import { sflow } from "sflow";
import type { Chunk } from "./chunk.js";
import type { FlowFn } from "./node.js";
import { registry, type ProcessorState } from "./registry.js";
import type { Writable } from "node:stream";

type AnyReadable =
  | AsyncIterable<Chunk>
  | ReadableStream<Chunk>
  | null;

type AnyWritable =
  | WritableStream<Chunk>
  | Writable
  | null
  | undefined;

export type ProcessorConfig<I extends Chunk, O extends Chunk> = {
  name: string;
  input?: AnyReadable;
  transform: FlowFn<I, O>;
  output?: AnyWritable;
};

export type ProcessorHandle<I extends Chunk = Chunk, O extends Chunk = Chunk> = {
  readonly name: string;
  readonly state: ProcessorState;
  readonly _transform: FlowFn<I, O>;
  start(): Promise<void>;
  stop(): void;
  pipe<N extends Chunk>(next: ProcessorHandle<O, N>): ProcessorHandle<I, N>;
  readonly output: AsyncIterable<O>;
};

function toAsyncIterable(source: AnyReadable): AsyncIterable<Chunk> {
  if (source == null) {
    return nodeReadableToAsyncIterable(process.stdin as unknown as NodeJS.ReadableStream);
  }
  if (Symbol.asyncIterator in (source as object)) {
    return source as AsyncIterable<Chunk>;
  }
  return webReadableToAsyncIterable(source as ReadableStream<Chunk>);
}

async function* nodeReadableToAsyncIterable(readable: NodeJS.ReadableStream): AsyncIterable<Chunk> {
  for await (const chunk of readable as AsyncIterable<unknown>) {
    yield chunk as Chunk;
  }
}

async function* webReadableToAsyncIterable(readable: ReadableStream<Chunk>): AsyncIterable<Chunk> {
  const reader = readable.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

async function drainToWritable(iter: AsyncIterable<Chunk>, dest: AnyWritable): Promise<void> {
  if (dest == null) {
    const enc = new TextEncoder();
    for await (const chunk of iter) {
      process.stdout.write(enc.encode(JSON.stringify(chunk) + "\n"));
    }
    return;
  }
  if (dest instanceof WritableStream) {
    const writer = (dest as WritableStream<Chunk>).getWriter();
    try {
      for await (const chunk of iter) {
        await writer.write(chunk);
      }
      await writer.close();
    } finally {
      writer.releaseLock();
    }
    return;
  }
  const nodeWritable = dest as InstanceType<typeof Writable>;
  for await (const chunk of iter) {
    await new Promise<void>((resolve, reject) => {
      nodeWritable.write(chunk, (err) => (err ? reject(err) : resolve()));
    });
  }
  await new Promise<void>((resolve) => nodeWritable.end(resolve));
}

export function createProcessor<I extends Chunk, O extends Chunk>(
  config: ProcessorConfig<I, O>,
): ProcessorHandle<I, O> {
  const state = registry.register(config.name);
  let abortController = new AbortController();
  let _output: AsyncIterable<O> | null = null;

  function buildOutput(): AsyncIterable<O> {
    const sourceRaw = toAsyncIterable(config.input ?? null);
    const source = trackInput(sourceRaw, state);
    const flow = sflow(source as AsyncIterable<I>);
    const transformed = config.transform(flow);
    return trackOutput(transformed as AsyncIterable<Chunk>, state) as AsyncIterable<O>;
  }

  const handle: ProcessorHandle<I, O> = {
    name: state.name,
    state,
    _transform: config.transform,

    get output(): AsyncIterable<O> {
      if (!_output) _output = buildOutput();
      return _output;
    },

    async start(): Promise<void> {
      if (state.status === "running") return;
      state.status = "running";
      state.startedAt = Date.now();
      _output = buildOutput();
      try {
        await drainToWritable(_output as AsyncIterable<Chunk>, config.output);
        state.status = "idle";
      } catch (e) {
        state.status = "error";
        state.errors.push(String(e));
        throw e;
      }
    },

    stop(): void {
      abortController.abort();
      abortController = new AbortController();
      state.status = "stopped";
      _output = null;
    },

    pipe<N extends Chunk>(next: ProcessorHandle<O, N>): ProcessorHandle<I, N> {
      const self = handle;
      const composedTransform: FlowFn<I, N> = (flow) => {
        const midFlow = self._transform(flow);
        return next._transform(midFlow as ReturnType<typeof sflow<O>>);
      };
      const pipedConfig: ProcessorConfig<I, N> = {
        name: `${state.name}→${next.name}`,
        transform: composedTransform,
      };
      if (config.input !== undefined) pipedConfig.input = config.input;
      if (config.output !== undefined) pipedConfig.output = config.output;
      return createProcessor<I, N>(pipedConfig);
    },
  };

  return handle;
}

async function* trackInput(source: AsyncIterable<Chunk>, state: ProcessorState): AsyncIterable<Chunk> {
  for await (const chunk of source) {
    state.chunksIn++;
    yield chunk;
  }
}

async function* trackOutput(source: AsyncIterable<Chunk>, state: ProcessorState): AsyncIterable<Chunk> {
  for await (const chunk of source) {
    state.chunksOut++;
    yield chunk;
  }
}
