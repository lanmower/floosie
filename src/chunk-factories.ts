import type {
  Chunk, HttpRequest, HttpResponse, WebSocketMessage, SseMessage,
  Token, ErrorData, SignalData,
  JsonChunk, BinaryChunk, TextChunk, NdjsonChunk, CsvChunk,
  XmlChunk, YamlChunk, MarkdownChunk, HtmlChunk, SqlChunk,
  HttpRequestChunk, HttpResponseChunk, WebSocketChunk, SseChunk,
  AudioChunk, PdfChunk, ArchiveChunk,
  EmbeddingChunk, TokenChunk, DeltaChunk,
  Uint8Chunk, Int32Chunk, Float64Chunk, BoolChunk, TimestampChunk, UuidChunk,
  ErrorChunk, SignalChunk, NullChunk,
} from "./chunk-types.js";

type M = Record<string, unknown>;
const mk = <T extends Chunk>(base: Omit<T, "meta">, meta?: M): T =>
  (meta !== undefined ? { ...base, meta } : base) as T;

export const json    = <T>(data: T, meta?: M): JsonChunk<T>       => mk({ type: "json",    data }, meta);
export const binary  = (data: Uint8Array,      meta?: M): BinaryChunk   => mk({ type: "binary",  data }, meta);
export const text    = (data: string,          meta?: M): TextChunk     => mk({ type: "text",    data }, meta);
export const raw     = (data: unknown,         meta?: M): Extract<Chunk, { type: "raw" }> => mk({ type: "raw", data }, meta);
export const image   = (data: Uint8Array,      meta?: M): Extract<Chunk, { type: "image" }> => mk({ type: "image", data }, meta);
export const video   = (data: Uint8Array,      meta?: M): Extract<Chunk, { type: "video" }> => mk({ type: "video", data }, meta);

export const ndjson  = (data: string,          meta?: M): NdjsonChunk   => mk({ type: "ndjson",   data }, meta);
export const csv     = (data: string[],        meta?: M): CsvChunk      => mk({ type: "csv",      data }, meta);
export const xml     = (data: string,          meta?: M): XmlChunk      => mk({ type: "xml",      data }, meta);
export const yaml    = (data: string,          meta?: M): YamlChunk     => mk({ type: "yaml",     data }, meta);
export const markdown= (data: string,          meta?: M): MarkdownChunk => mk({ type: "markdown", data }, meta);
export const html    = (data: string,          meta?: M): HtmlChunk     => mk({ type: "html",     data }, meta);
export const sql     = (data: string,          meta?: M): SqlChunk      => mk({ type: "sql",      data }, meta);

export const httpRequest  = (data: HttpRequest,       meta?: M): HttpRequestChunk  => mk({ type: "http-request",  data }, meta);
export const httpResponse = (data: HttpResponse,      meta?: M): HttpResponseChunk => mk({ type: "http-response", data }, meta);
export const websocket    = (data: WebSocketMessage,  meta?: M): WebSocketChunk    => mk({ type: "websocket",     data }, meta);
export const sse          = (data: SseMessage,        meta?: M): SseChunk          => mk({ type: "sse",           data }, meta);

export const audio   = (data: Uint8Array,     meta?: M): AudioChunk    => mk({ type: "audio",   data }, meta);
export const pdf     = (data: Uint8Array,     meta?: M): PdfChunk      => mk({ type: "pdf",     data }, meta);
export const archive = (data: Uint8Array,     meta?: M): ArchiveChunk  => mk({ type: "archive", data }, meta);

export const embedding = (data: Float32Array, meta?: M): EmbeddingChunk => mk({ type: "embedding", data }, meta);
export const token     = (data: Token,        meta?: M): TokenChunk     => mk({ type: "token",     data }, meta);
export const delta     = (data: string,       meta?: M): DeltaChunk     => mk({ type: "delta",     data }, meta);

export const uint8     = (data: number,       meta?: M): Uint8Chunk     => mk({ type: "uint8",     data }, meta);
export const int32     = (data: number,       meta?: M): Int32Chunk     => mk({ type: "int32",     data }, meta);
export const float64   = (data: number,       meta?: M): Float64Chunk   => mk({ type: "float64",   data }, meta);
export const bool      = (data: boolean,      meta?: M): BoolChunk      => mk({ type: "bool",      data }, meta);
export const timestamp = (data: number,       meta?: M): TimestampChunk => mk({ type: "timestamp", data }, meta);
export const uuid      = (data: string,       meta?: M): UuidChunk      => mk({ type: "uuid",      data }, meta);

export const error     = (data: ErrorData,    meta?: M): ErrorChunk     => mk({ type: "error",     data }, meta);
export const signal    = (data: SignalData,   meta?: M): SignalChunk     => mk({ type: "signal",    data }, meta);
export const nil       = (meta?: M): NullChunk                           => mk({ type: "null", data: null }, meta);
