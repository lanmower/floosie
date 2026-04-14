export type ChunkType =
  | "json" | "binary" | "text" | "image" | "video" | "raw"
  | "ndjson" | "csv" | "xml" | "yaml" | "markdown" | "html" | "sql"
  | "http-request" | "http-response" | "websocket" | "sse"
  | "audio" | "pdf" | "archive"
  | "embedding" | "token" | "delta"
  | "uint8" | "int32" | "float64" | "bool" | "timestamp" | "uuid"
  | "error" | "signal" | "null";

export type HttpRequest = { method: string; url: string; headers: Record<string, string>; body?: Uint8Array };
export type HttpResponse = { status: number; headers: Record<string, string>; body?: Uint8Array };
export type WebSocketMessage = { kind: "text" | "binary"; payload: string | Uint8Array };
export type SseMessage = { data: string; event?: string; id?: string };
export type Token = { id: number; text: string };
export type ErrorData = { message: string; code?: string; stack?: string };
export type SignalData = { kind: string; payload?: unknown };

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
  | { type: "null";          data: null;             meta?: Record<string, unknown> };

export type JsonChunk<T = unknown>      = Extract<Chunk<T>, { type: "json" }>;
export type BinaryChunk                 = Extract<Chunk, { type: "binary" }>;
export type TextChunk                   = Extract<Chunk, { type: "text" }>;
export type NdjsonChunk                 = Extract<Chunk, { type: "ndjson" }>;
export type CsvChunk                    = Extract<Chunk, { type: "csv" }>;
export type XmlChunk                    = Extract<Chunk, { type: "xml" }>;
export type YamlChunk                   = Extract<Chunk, { type: "yaml" }>;
export type MarkdownChunk               = Extract<Chunk, { type: "markdown" }>;
export type HtmlChunk                   = Extract<Chunk, { type: "html" }>;
export type SqlChunk                    = Extract<Chunk, { type: "sql" }>;
export type HttpRequestChunk            = Extract<Chunk, { type: "http-request" }>;
export type HttpResponseChunk           = Extract<Chunk, { type: "http-response" }>;
export type WebSocketChunk              = Extract<Chunk, { type: "websocket" }>;
export type SseChunk                    = Extract<Chunk, { type: "sse" }>;
export type AudioChunk                  = Extract<Chunk, { type: "audio" }>;
export type PdfChunk                    = Extract<Chunk, { type: "pdf" }>;
export type ArchiveChunk                = Extract<Chunk, { type: "archive" }>;
export type EmbeddingChunk              = Extract<Chunk, { type: "embedding" }>;
export type TokenChunk                  = Extract<Chunk, { type: "token" }>;
export type DeltaChunk                  = Extract<Chunk, { type: "delta" }>;
export type Uint8Chunk                  = Extract<Chunk, { type: "uint8" }>;
export type Int32Chunk                  = Extract<Chunk, { type: "int32" }>;
export type Float64Chunk                = Extract<Chunk, { type: "float64" }>;
export type BoolChunk                   = Extract<Chunk, { type: "bool" }>;
export type TimestampChunk              = Extract<Chunk, { type: "timestamp" }>;
export type UuidChunk                   = Extract<Chunk, { type: "uuid" }>;
export type ErrorChunk                  = Extract<Chunk, { type: "error" }>;
export type SignalChunk                 = Extract<Chunk, { type: "signal" }>;
export type NullChunk                   = Extract<Chunk, { type: "null" }>;
