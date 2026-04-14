### 0.2.0 — 2026-04-14
- Added 17 new chunk types: protobuf, msgpack, cbor, arrow, parquet, geojson, jwt, graphql, rpc, event, span, metric, log, command, frame, patch, multipart
- Added mime.ts: magic-byte detection for 35 binary formats (images, video, audio, pdf, archives, arrow, parquet)
- Binary chunk decode now populates meta.mime automatically for all binary passthrough types
- frame codec: length-prefixed JSON header + raw pixel data
- multipart codec: length-prefixed JSON header + raw binary payload with auto mime detection

