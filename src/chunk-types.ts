export type ChunkType =
  | "json" | "binary" | "text" | "image" | "video" | "raw"
  | "ndjson" | "csv" | "xml" | "yaml" | "markdown" | "html" | "sql"
  | "http-request" | "http-response" | "websocket" | "sse"
  | "audio" | "pdf" | "archive"
  | "embedding" | "token" | "delta"
  | "uint8" | "int32" | "float64" | "bool" | "timestamp" | "uuid"
  | "error" | "signal" | "null"
  | "protobuf" | "msgpack" | "cbor" | "arrow" | "parquet"
  | "geojson" | "jwt" | "graphql"
  | "rpc" | "event" | "span" | "metric" | "log" | "command" | "frame" | "patch" | "multipart";

export type HttpRequest      = { method: string; url: string; headers: Record<string, string>; body?: Uint8Array };
export type HttpResponse     = { status: number; headers: Record<string, string>; body?: Uint8Array };
export type WebSocketMessage = { kind: "text" | "binary"; payload: string | Uint8Array };
export type SseMessage       = { data: string; event?: string; id?: string };
export type Token            = { id: number; text: string };
export type ErrorData        = { message: string; code?: string; stack?: string };
export type SignalData       = { kind: string; payload?: unknown };
export type RpcMessage       = { id: string; method: string; params?: unknown; result?: unknown; error?: unknown };
export type EventData        = { type: string; target?: string; data?: unknown; timestamp?: number };
export type SpanData         = { traceId: string; spanId: string; name: string; start: number; end?: number; attrs?: Record<string, unknown> };
export type MetricData       = { name: string; value: number; labels?: Record<string, string>; timestamp?: number };
export type LogData          = { level: string; message: string; timestamp?: number; attrs?: Record<string, unknown> };
export type CommandData      = { cmd: string; args?: string[]; env?: Record<string, string> };
export type FrameData        = { width: number; height: number; format: string; data: Uint8Array };
export type PatchOp          = { op: string; path: string; value?: unknown };
export type MultipartData    = { name: string; filename?: string; contentType?: string; data: Uint8Array };

export type Chunk<T = unknown> =
  | { type: "json";          data: T;                meta?: Record<string, unknown> }
  | { type: "binary";        data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "text";          data: string;           meta?: Record<string, unknown> }
  | { type: "image";         data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "video";         data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "raw";           data: unknown;          meta?: Record<string, unknown> }
  | { type: "ndjson";        data: string;           meta?: Record<string, unknown> }
  | { type: "csv";           data: string[];         meta?: Record<string, unknown> }
  | { type: "xml";           data: string;           meta?: Record<string, unknown> }
  | { type: "yaml";          data: string;           meta?: Record<string, unknown> }
  | { type: "markdown";      data: string;           meta?: Record<string, unknown> }
  | { type: "html";          data: string;           meta?: Record<string, unknown> }
  | { type: "sql";           data: string;           meta?: Record<string, unknown> }
  | { type: "http-request";  data: HttpRequest;      meta?: Record<string, unknown> }
  | { type: "http-response"; data: HttpResponse;     meta?: Record<string, unknown> }
  | { type: "websocket";     data: WebSocketMessage; meta?: Record<string, unknown> }
  | { type: "sse";           data: SseMessage;       meta?: Record<string, unknown> }
  | { type: "audio";         data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "pdf";           data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "archive";       data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "embedding";     data: Float32Array;     meta?: Record<string, unknown> }
  | { type: "token";         data: Token;            meta?: Record<string, unknown> }
  | { type: "delta";         data: string;           meta?: Record<string, unknown> }
  | { type: "uint8";         data: number;           meta?: Record<string, unknown> }
  | { type: "int32";         data: number;           meta?: Record<string, unknown> }
  | { type: "float64";       data: number;           meta?: Record<string, unknown> }
  | { type: "bool";          data: boolean;          meta?: Record<string, unknown> }
  | { type: "timestamp";     data: number;           meta?: Record<string, unknown> }
  | { type: "uuid";          data: string;           meta?: Record<string, unknown> }
  | { type: "error";         data: ErrorData;        meta?: Record<string, unknown> }
  | { type: "signal";        data: SignalData;       meta?: Record<string, unknown> }
  | { type: "null";          data: null;             meta?: Record<string, unknown> }
  | { type: "protobuf";      data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "msgpack";       data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "cbor";          data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "arrow";         data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "parquet";       data: Uint8Array;       meta?: Record<string, unknown> }
  | { type: "geojson";       data: string;           meta?: Record<string, unknown> }
  | { type: "jwt";           data: string;           meta?: Record<string, unknown> }
  | { type: "graphql";       data: string;           meta?: Record<string, unknown> }
  | { type: "rpc";           data: RpcMessage;       meta?: Record<string, unknown> }
  | { type: "event";         data: EventData;        meta?: Record<string, unknown> }
  | { type: "span";          data: SpanData;         meta?: Record<string, unknown> }
  | { type: "metric";        data: MetricData;       meta?: Record<string, unknown> }
  | { type: "log";           data: LogData;          meta?: Record<string, unknown> }
  | { type: "command";       data: CommandData;      meta?: Record<string, unknown> }
  | { type: "frame";         data: FrameData;        meta?: Record<string, unknown> }
  | { type: "patch";         data: PatchOp[];        meta?: Record<string, unknown> }
  | { type: "multipart";     data: MultipartData;    meta?: Record<string, unknown> };

export type JsonChunk<T = unknown>  = Extract<Chunk<T>, { type: "json" }>;
export type BinaryChunk             = Extract<Chunk, { type: "binary" }>;
export type TextChunk               = Extract<Chunk, { type: "text" }>;
export type NdjsonChunk             = Extract<Chunk, { type: "ndjson" }>;
export type CsvChunk                = Extract<Chunk, { type: "csv" }>;
export type XmlChunk                = Extract<Chunk, { type: "xml" }>;
export type YamlChunk               = Extract<Chunk, { type: "yaml" }>;
export type MarkdownChunk           = Extract<Chunk, { type: "markdown" }>;
export type HtmlChunk               = Extract<Chunk, { type: "html" }>;
export type SqlChunk                = Extract<Chunk, { type: "sql" }>;
export type HttpRequestChunk        = Extract<Chunk, { type: "http-request" }>;
export type HttpResponseChunk       = Extract<Chunk, { type: "http-response" }>;
export type WebSocketChunk          = Extract<Chunk, { type: "websocket" }>;
export type SseChunk                = Extract<Chunk, { type: "sse" }>;
export type AudioChunk              = Extract<Chunk, { type: "audio" }>;
export type PdfChunk                = Extract<Chunk, { type: "pdf" }>;
export type ArchiveChunk            = Extract<Chunk, { type: "archive" }>;
export type EmbeddingChunk          = Extract<Chunk, { type: "embedding" }>;
export type TokenChunk              = Extract<Chunk, { type: "token" }>;
export type DeltaChunk              = Extract<Chunk, { type: "delta" }>;
export type Uint8Chunk              = Extract<Chunk, { type: "uint8" }>;
export type Int32Chunk              = Extract<Chunk, { type: "int32" }>;
export type Float64Chunk            = Extract<Chunk, { type: "float64" }>;
export type BoolChunk               = Extract<Chunk, { type: "bool" }>;
export type TimestampChunk          = Extract<Chunk, { type: "timestamp" }>;
export type UuidChunk               = Extract<Chunk, { type: "uuid" }>;
export type ErrorChunk              = Extract<Chunk, { type: "error" }>;
export type SignalChunk             = Extract<Chunk, { type: "signal" }>;
export type NullChunk               = Extract<Chunk, { type: "null" }>;
export type ProtobufChunk           = Extract<Chunk, { type: "protobuf" }>;
export type MsgpackChunk            = Extract<Chunk, { type: "msgpack" }>;
export type CborChunk               = Extract<Chunk, { type: "cbor" }>;
export type ArrowChunk              = Extract<Chunk, { type: "arrow" }>;
export type ParquetChunk            = Extract<Chunk, { type: "parquet" }>;
export type GeojsonChunk            = Extract<Chunk, { type: "geojson" }>;
export type JwtChunk                = Extract<Chunk, { type: "jwt" }>;
export type GraphqlChunk            = Extract<Chunk, { type: "graphql" }>;
export type RpcChunk                = Extract<Chunk, { type: "rpc" }>;
export type EventChunk              = Extract<Chunk, { type: "event" }>;
export type SpanChunk               = Extract<Chunk, { type: "span" }>;
export type MetricChunk             = Extract<Chunk, { type: "metric" }>;
export type LogChunk                = Extract<Chunk, { type: "log" }>;
export type CommandChunk            = Extract<Chunk, { type: "command" }>;
export type FrameChunk              = Extract<Chunk, { type: "frame" }>;
export type PatchChunk              = Extract<Chunk, { type: "patch" }>;
export type MultipartChunk          = Extract<Chunk, { type: "multipart" }>;
