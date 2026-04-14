# floosie

Universal stream processing platform. Pipe anything to anything.

Built on [sflow](https://www.npmjs.com/package/sflow) with [ACP](https://www.npmjs.com/package/@agentclientprotocol/sdk) support.

## Install

```sh
npm install
```

## Quick start

```ts
import { createProcessor, json, text } from "./src/index.js";
import type { JsonChunk, TextChunk } from "./src/index.js";

const upper = createProcessor<JsonChunk<{ msg: string }>, TextChunk>({
  name: "upper",
  input: (async function* () {
    yield json({ msg: "hello" });
    yield json({ msg: "world" });
  })(),
  transform: (flow) => flow.map((chunk) => text(chunk.data.msg.toUpperCase())),
});

const exclaim = createProcessor<TextChunk, TextChunk>({
  name: "exclaim",
  transform: (flow) => flow.map((chunk) => text(chunk.data + "!!!")),
});

for await (const chunk of upper.pipe(exclaim).output) {
  console.log(chunk.data); // HELLO!!!  WORLD!!!
}
```

## Chunk types (98)

### Structured / JSON
`json`, `raw`, `ndjson`, `rpc`, `event`, `span`, `metric`, `log`, `command`, `patch`, `token`, `error`, `signal`,
`socketio`, `envelope`, `ack`, `nack`, `ast`, `hash`, `timeseries`, `ohlcv`, `adjacency`

### Text / Markup
`text`, `delta`, `uuid`, `jwt`, `xml`, `yaml`, `markdown`, `html`, `sql`, `geojson`, `graphql`, `csv`,
`toml`, `ini`, `jsonschema`, `avroschema`, `sourcemap`, `shader`, `obj`, `subtitle`, `playlist`, `graphml`

### Network / Protocol
`http-request`, `http-response`, `websocket`, `sse`, `dns`, `dhcp`, `icmp`

### Binary / Media (mime auto-detected)
`binary`, `image`, `video`, `audio`, `pdf`, `archive`,
`protobuf`, `msgpack`, `cbor`, `arrow`, `parquet`,
`wasm`, `font`, `onnx`, `safetensors`, `epub`, `docx`, `xlsx`, `pptx`, `gltf`, `qrcode`

### Binary with JSON header
`frame`, `multipart`, `ciphertext`, `signature`, `hmac`, `keypair`, `certificate`, `tensor`, `pointcloud`, `webtransport`

### Scalars
`uint8`, `int8`, `int16`, `uint16`, `int32`, `uint32`, `int64` (bigint), `uint64` (bigint),
`float32`, `float64`, `bool`, `timestamp`, `complex64`, `complex128`, `null`

### Embedding
`embedding` (Float32Array)

Binary decode populates `meta.mime` automatically via magic-byte detection (35 formats).

## Stream Operators

`src/operators.ts` provides typed `StreamNode` factories for pipeline composition:

```ts
import { mux, split, gate, scan, zip, batch, window, throttle, debounce, take, drop, distinct, parallel, withBackpressure } from "./src/index.js";
```

| operator | description |
|----------|-------------|
| `mux(...sources)` | merge N input streams (interleaved) |
| `split(flow, n)` | fan-out one stream to N branches |
| `gate(pred)` | async predicate filter / blocking gate |
| `scan(fn, seed)` | running accumulator, emits each intermediate value |
| `zip(...sources)` | combine N streams into tuples |
| `batch(n)` | group into fixed-size arrays |
| `window(ms)` | group by time interval |
| `throttle(ms)` | rate limit |
| `debounce(ms)` | emit last value after quiet period |
| `take(n)` | first N items |
| `drop(n)` | skip first N items |
| `distinct(keyFn?)` | deduplicate consecutive |
| `parallel(fn, n)` | concurrent async map |
| `withBackpressure(hwm)` | pause upstream at high-water mark |

## API

### `createProcessor(config)`

```ts
createProcessor<I, O>({
  name: string,
  input?: AsyncIterable<Chunk> | ReadableStream<Chunk> | null,  // null = stdin
  transform: (flow: sflow<I>) => sflow<O>,
  output?: WritableStream<Chunk> | null,  // null = stdout
})
```

Returns `ProcessorHandle` with `.pipe(next)`, `.start()`, `.stop()`, `.output`.

### `pipe(...nodes)`

Compose `StreamNode`s: `pipe(a, b, c)` = `a → b → c`.

### `stdioProcessor(config)`

Wraps a processor to read stdin / write stdout. Framing auto-selected by `inputType`.

### `acpProcessor(conn, name, transform)`

Wraps an ACP `AgentSideConnection` as source and sink.

### `detectMime(data: Uint8Array): string`

Magic-byte detection for 35 formats. Returns MIME type string or `application/octet-stream`.

### `registry.snapshot()`

Returns all live processor states: `name`, `status`, `chunksIn`, `chunksOut`, `errors`, `uptimeMs`.

## Shell piping

Processors behave like CLI programs:

```sh
node proc-a.js | node proc-b.js | node proc-c.js
```

Framing is transparent to transform functions — ndjson for structured types, length-prefix for binary, newline for text.
