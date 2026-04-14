import { sflow } from "sflow";
import type { Chunk, ChunkType } from "./chunk.js";
import { encodeChunk, decodeChunk } from "./codec.js";
import { createProcessor, type ProcessorConfig, type ProcessorHandle } from "./processor.js";

const FRAME_TYPES: Record<ChunkType, "ndjson" | "length-prefix" | "newline"> = {
  json: "ndjson",
  raw: "ndjson",
  text: "newline",
  binary: "length-prefix",
  image: "length-prefix",
  video: "length-prefix",
};

async function* stdinChunks(type: ChunkType): AsyncIterable<Chunk> {
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const strategy = FRAME_TYPES[type];

  if (strategy === "ndjson" || strategy === "newline") {
    let buf = "";
    for await (const raw of process.stdin) {
      buf += dec.decode(raw as Uint8Array, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const bytes = enc.encode(line);
        yield decodeChunk(type, bytes);
      }
    }
    if (buf.trim()) yield decodeChunk(type, enc.encode(buf));
    return;
  }

  let pending = Buffer.alloc(0);
  for await (const raw of process.stdin) {
    pending = Buffer.concat([pending, Buffer.from(raw as Uint8Array)]);
    while (pending.length >= 4) {
      const len = pending.readUInt32BE(0);
      if (pending.length < 4 + len) break;
      const payload = pending.subarray(4, 4 + len);
      pending = pending.subarray(4 + len);
      yield decodeChunk(type, payload);
    }
  }
}

function writeToStdout(chunk: Chunk): void {
  const strategy = FRAME_TYPES[chunk.type];
  const bytes = encodeChunk(chunk);

  if (strategy === "ndjson" || strategy === "newline") {
    const str = new TextDecoder().decode(bytes);
    process.stdout.write(str + "\n");
    return;
  }

  const frame = Buffer.alloc(4 + bytes.length);
  frame.writeUInt32BE(bytes.length, 0);
  bytes.forEach((b, i) => frame.writeUInt8(b, 4 + i));
  process.stdout.write(frame);
}

export function stdioProcessor<I extends Chunk, O extends Chunk>(
  config: Omit<ProcessorConfig<I, O>, "input" | "output"> & { inputType: ChunkType },
): ProcessorHandle<I, O> {
  const input = stdinChunks(config.inputType) as AsyncIterable<Chunk>;

  return createProcessor<I, O>({
    name: config.name,
    input,
    transform: (flow) => {
      const transformed = config.transform(flow);
      return sflow(transformed).forEach((chunk: O) => { writeToStdout(chunk); }) as ReturnType<typeof sflow<O>>;
    },
  });
}
