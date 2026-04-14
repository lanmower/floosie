# floosie

Universal stream processing platform. Pipe anything to anything.

## Architecture

- `src/chunk.ts` — `Chunk` discriminated union: 98 types + factory fns
- `src/chunk-types.ts` — type definitions and data interfaces
- `src/chunk-aliases.ts` — Extract<Chunk,{type:K}> aliases for all 98 types
- `src/chunk-factories.ts` — factory functions
- `src/codec.ts` — `CODECS` registry: encode/decode per chunk type; passthrough for binary; ndjson for json/raw; newline for text
- `src/codec-text.ts` — text/markup codecs; `src/codec-binary.ts` — binary/media codecs; `src/codec-structured.ts` — JSON-envelope codecs
- `src/mime.ts` — `detectMime(Uint8Array): string`; magic-byte detection for 35 formats; auto-populated in binary decode meta
- `src/node.ts` — `StreamNode<I,O>`: composable sflow-backed pipe unit, lazy until iterated
- `src/processor.ts` — `createProcessor()`: single-call SDK entry; auto-detects stream type; tracks state via registry; `pipe()` composes transforms
- `src/pipeline.ts` — `pipe()`, `connect()`, `source()`, `sink()` — pipeline composition
- `src/operators.ts` — `mux`, `split`, `gate`, `scan`, `zip`, `withBackpressure`, `batch`, `window`, `throttle`, `debounce`, `take`, `drop`, `distinct`, `parallel`
- `src/registry.ts` — global `ProcessorState` map; `inspect()` / `snapshot()` for observability
- `src/stdio.ts` — `stdioProcessor()`: reads stdin, writes stdout; framing auto-selected by chunk type
- `src/acp.ts` — `acpSource()`, `acpSink()`, `acpProcessor()`: ACP AgentSideConnection as stream source/sink
- `src/index.ts` — re-exports all public API

## Key Technical Facts

### sflow Type Union
`sflow` is `ReadableStream<T> & AsyncIterableIterator<T> & BaseFlow<T>` — works with both Web Streams API and ES6 async iteration.

### FlowSource Inputs
Accepts: Promise, Iterable, AsyncIterable, `() => Iterable/AsyncIterable`, ReadableLike, ReadableStream.

### Terminal Methods
`sflow` provides: `.toArray()`, `.run()`, `.to(writable)`, `.toEnd()`, `.toNil()`, `.toCount()`, `.toFirst()` — one must be called to consume the stream.

### ProcessorHandle.pipe()
Composes transforms (not streams) — upstream input is preserved and both transforms are fused into one `createProcessor` call.

### sflow API Behaviors (Witnessed)
Working: `merge(other)`, `limit(n)`, `skip(n)`, `chunk(n)`, `chunkInterval(ms)`, `throttle(ms)`, `debounce(ms)`, `uniq()`, `uniqBy(fn)`, `pMap(fn, { concurrency: N })`, `through(async function*(src){})`

Broken/avoid: `head(n)` hangs on finite sources — use `limit(n)`; `confluenceByZip(other)` throws on AsyncIterable input; `chunkBy(number)` hangs — pass a comparator function; `forkTo()` returns empty; `reduceEmit()` emits nulls.

Custom zip (replaces confluenceByZip):
```ts
sflow(async function*() {
  const iters = sources.map(s => s[Symbol.asyncIterator]());
  while (true) {
    const nexts = await Promise.all(iters.map(it => it.next()));
    if (nexts.some(n => n.done)) break;
    yield nexts.map(n => n.value);
  }
}())
```

### Dependencies & TypeScript
- **@agentclientprotocol/sdk v0.19.0** has TS 5.x export ambiguity — requires `skipLibCheck: true` in tsconfig
- **exactOptionalPropertyTypes: true** requires conditional spread: `meta !== undefined ? { ...o, meta } : { ...o }`
- **Node v23.10** — native ESM, Web Streams built-in

## Changes

### 0.4.0 — 2026-04-14
- Added `src/operators.ts`: mux, split, gate, scan, zip, withBackpressure, batch, window, throttle, debounce, take, drop, distinct, parallel

### 0.3.0 — 2026-04-14
- Added 52 new chunk types (98 total): wasm, font, onnx, safetensors, epub, docx, xlsx, pptx, gltf, qrcode, toml, ini, jsonschema, avroschema, sourcemap, shader, obj, subtitle, playlist, graphml, socketio, webtransport, envelope, ack, nack, ast, hash, signature, tensor, timeseries, ohlcv, adjacency, pointcloud, keypair, certificate, hmac, dns, dhcp, icmp, ciphertext, int8, int16, uint16, uint32, int64, uint64, float32, complex64, complex128
- Added `src/chunk-aliases.ts`: Extract<Chunk,{type:K}> aliases split from chunk-types.ts

### 0.2.0 — 2026-04-14
- Added 17 new chunk types: protobuf, msgpack, cbor, arrow, parquet, geojson, jwt, graphql, rpc, event, span, metric, log, command, frame, patch, multipart (49 total)
- Added `src/mime.ts`: magic-byte detection for 35 formats, auto-populated as `meta.mime` on all binary decode

### 0.1.0 — 2026-04-14
- Initial platform: Chunk types, CODECS, StreamNode, createProcessor, pipeline wiring, registry, stdio adapter, ACP connector
