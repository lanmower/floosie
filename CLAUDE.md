# floosie

Universal stream processing platform. Pipe anything to anything.

## Architecture

- `src/chunk.ts` — `Chunk` discriminated union: json/binary/text/image/video/raw + factory fns
- `src/codec.ts` — `CODECS` registry: encode/decode per chunk type; passthrough for binary; ndjson for json/raw; newline for text
- `src/node.ts` — `StreamNode<I,O>`: composable sflow-backed pipe unit, lazy until iterated
- `src/processor.ts` — `createProcessor()`: single-call SDK entry; auto-detects stream type; tracks state via registry; `pipe()` composes transforms
- `src/pipeline.ts` — `pipe()`, `connect()`, `source()`, `sink()` — pipeline composition
- `src/registry.ts` — global `ProcessorState` map; `inspect()` / `snapshot()` for observability
- `src/stdio.ts` — `stdioProcessor()`: reads stdin, writes stdout; framing auto-selected by chunk type
- `src/acp.ts` — `acpSource()`, `acpSink()`, `acpProcessor()`: ACP AgentSideConnection as stream source/sink
- `src/index.ts` — re-exports all public API

## Changes

### 0.1.0 — 2026-04-14
- Initial platform: Chunk types, CODECS, StreamNode, createProcessor, pipeline wiring, registry, stdio adapter, ACP connector
