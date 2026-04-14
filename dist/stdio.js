import { sflow } from "sflow";
import { encodeChunk, decodeChunk } from "./codec.js";
import { createProcessor } from "./processor.js";
const FRAME_TYPES = {
    json: "ndjson", raw: "ndjson", error: "ndjson", signal: "ndjson",
    token: "ndjson", "http-request": "length-prefix", "http-response": "length-prefix",
    websocket: "length-prefix",
    text: "newline", ndjson: "newline", sql: "newline", delta: "newline",
    uuid: "newline", sse: "newline",
    binary: "length-prefix", image: "length-prefix", video: "length-prefix",
    audio: "length-prefix", pdf: "length-prefix", archive: "length-prefix",
    embedding: "length-prefix",
    xml: "length-prefix", yaml: "length-prefix", markdown: "length-prefix",
    html: "length-prefix", csv: "newline",
    uint8: "length-prefix", int32: "length-prefix", float64: "length-prefix",
    bool: "length-prefix", timestamp: "length-prefix",
    null: "length-prefix",
    protobuf: "length-prefix", msgpack: "length-prefix", cbor: "length-prefix",
    arrow: "length-prefix", parquet: "length-prefix",
    geojson: "length-prefix", jwt: "newline", graphql: "length-prefix",
    rpc: "ndjson", event: "ndjson", span: "ndjson",
    metric: "ndjson", log: "ndjson", command: "ndjson",
    frame: "length-prefix", patch: "ndjson", multipart: "length-prefix",
};
async function* stdinChunks(type) {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const strategy = FRAME_TYPES[type];
    if (strategy === "ndjson" || strategy === "newline") {
        let buf = "";
        for await (const raw of process.stdin) {
            buf += dec.decode(raw, { stream: true });
            const lines = buf.split("\n");
            buf = lines.pop() ?? "";
            for (const line of lines) {
                if (!line.trim())
                    continue;
                yield decodeChunk(type, enc.encode(line));
            }
        }
        if (buf.trim())
            yield decodeChunk(type, enc.encode(buf));
        return;
    }
    let pending = Buffer.alloc(0);
    for await (const raw of process.stdin) {
        pending = Buffer.concat([pending, Buffer.from(raw)]);
        while (pending.length >= 4) {
            const len = pending.readUInt32BE(0);
            if (pending.length < 4 + len)
                break;
            const payload = pending.subarray(4, 4 + len);
            pending = pending.subarray(4 + len);
            yield decodeChunk(type, payload);
        }
    }
}
function writeToStdout(chunk) {
    const strategy = FRAME_TYPES[chunk.type];
    const bytes = encodeChunk(chunk);
    if (strategy === "ndjson" || strategy === "newline") {
        process.stdout.write(new TextDecoder().decode(bytes) + "\n");
        return;
    }
    const frame = Buffer.alloc(4 + bytes.length);
    frame.writeUInt32BE(bytes.length, 0);
    bytes.forEach((b, i) => frame.writeUInt8(b, 4 + i));
    process.stdout.write(frame);
}
export function stdioProcessor(config) {
    const input = stdinChunks(config.inputType);
    return createProcessor({
        name: config.name,
        input,
        transform: (flow) => {
            const transformed = config.transform(flow);
            return sflow(transformed).forEach((chunk) => { writeToStdout(chunk); });
        },
    });
}
//# sourceMappingURL=stdio.js.map