import { sflow } from "sflow";
import { registry } from "./registry.js";
function toAsyncIterable(source) {
    if (source == null) {
        return nodeReadableToAsyncIterable(process.stdin);
    }
    if (Symbol.asyncIterator in source) {
        return source;
    }
    return webReadableToAsyncIterable(source);
}
async function* nodeReadableToAsyncIterable(readable) {
    for await (const chunk of readable) {
        yield chunk;
    }
}
async function* webReadableToAsyncIterable(readable) {
    const reader = readable.getReader();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            yield value;
        }
    }
    finally {
        reader.releaseLock();
    }
}
async function drainToWritable(iter, dest) {
    if (dest == null) {
        const enc = new TextEncoder();
        for await (const chunk of iter) {
            process.stdout.write(enc.encode(JSON.stringify(chunk) + "\n"));
        }
        return;
    }
    if (dest instanceof WritableStream) {
        const writer = dest.getWriter();
        try {
            for await (const chunk of iter) {
                await writer.write(chunk);
            }
            await writer.close();
        }
        finally {
            writer.releaseLock();
        }
        return;
    }
    const nodeWritable = dest;
    for await (const chunk of iter) {
        await new Promise((resolve, reject) => {
            nodeWritable.write(chunk, (err) => (err ? reject(err) : resolve()));
        });
    }
    await new Promise((resolve) => nodeWritable.end(resolve));
}
export function createProcessor(config) {
    const state = registry.register(config.name);
    let abortController = new AbortController();
    let _output = null;
    function buildOutput() {
        const sourceRaw = toAsyncIterable(config.input ?? null);
        const source = trackInput(sourceRaw, state);
        const flow = sflow(source);
        const transformed = config.transform(flow);
        return trackOutput(transformed, state);
    }
    const handle = {
        name: state.name,
        state,
        _transform: config.transform,
        get output() {
            if (!_output)
                _output = buildOutput();
            return _output;
        },
        async start() {
            if (state.status === "running")
                return;
            state.status = "running";
            state.startedAt = Date.now();
            _output = buildOutput();
            try {
                await drainToWritable(_output, config.output);
                state.status = "idle";
            }
            catch (e) {
                state.status = "error";
                state.errors.push(String(e));
                throw e;
            }
        },
        stop() {
            abortController.abort();
            abortController = new AbortController();
            state.status = "stopped";
            _output = null;
        },
        pipe(next) {
            const self = handle;
            const composedTransform = (flow) => {
                const midFlow = self._transform(flow);
                return next._transform(midFlow);
            };
            const pipedConfig = {
                name: `${state.name}→${next.name}`,
                transform: composedTransform,
            };
            if (config.input !== undefined)
                pipedConfig.input = config.input;
            if (config.output !== undefined)
                pipedConfig.output = config.output;
            return createProcessor(pipedConfig);
        },
    };
    return handle;
}
async function* trackInput(source, state) {
    for await (const chunk of source) {
        state.chunksIn++;
        yield chunk;
    }
}
async function* trackOutput(source, state) {
    for await (const chunk of source) {
        state.chunksOut++;
        yield chunk;
    }
}
//# sourceMappingURL=processor.js.map