import type {
  Chunk, HttpRequest, HttpResponse, WebSocketMessage, SseMessage,
  Token, ErrorData, SignalData, RpcMessage, EventData, SpanData,
  MetricData, LogData, CommandData, FrameData, PatchOp, MultipartData,
  JsonChunk, BinaryChunk, TextChunk, NdjsonChunk, CsvChunk,
  XmlChunk, YamlChunk, MarkdownChunk, HtmlChunk, SqlChunk,
  HttpRequestChunk, HttpResponseChunk, WebSocketChunk, SseChunk,
  AudioChunk, PdfChunk, ArchiveChunk,
  EmbeddingChunk, TokenChunk, DeltaChunk,
  Uint8Chunk, Int32Chunk, Float64Chunk, BoolChunk, TimestampChunk, UuidChunk,
  ErrorChunk, SignalChunk, NullChunk,
  ProtobufChunk, MsgpackChunk, CborChunk, ArrowChunk, ParquetChunk,
  GeojsonChunk, JwtChunk, GraphqlChunk,
  RpcChunk, EventChunk, SpanChunk, MetricChunk, LogChunk,
  CommandChunk, FrameChunk, PatchChunk, MultipartChunk,
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

export const protobuf  = (data: Uint8Array,   meta?: M): ProtobufChunk  => mk({ type: "protobuf",  data }, meta);
export const msgpack   = (data: Uint8Array,   meta?: M): MsgpackChunk   => mk({ type: "msgpack",   data }, meta);
export const cbor      = (data: Uint8Array,   meta?: M): CborChunk      => mk({ type: "cbor",      data }, meta);
export const arrow     = (data: Uint8Array,   meta?: M): ArrowChunk     => mk({ type: "arrow",     data }, meta);
export const parquet   = (data: Uint8Array,   meta?: M): ParquetChunk   => mk({ type: "parquet",   data }, meta);

export const geojson   = (data: string,       meta?: M): GeojsonChunk   => mk({ type: "geojson",   data }, meta);
export const jwt       = (data: string,       meta?: M): JwtChunk       => mk({ type: "jwt",       data }, meta);
export const graphql   = (data: string,       meta?: M): GraphqlChunk   => mk({ type: "graphql",   data }, meta);

export const rpc       = (data: RpcMessage,   meta?: M): RpcChunk       => mk({ type: "rpc",       data }, meta);
export const event     = (data: EventData,    meta?: M): EventChunk     => mk({ type: "event",     data }, meta);
export const span      = (data: SpanData,     meta?: M): SpanChunk      => mk({ type: "span",      data }, meta);
export const metric    = (data: MetricData,   meta?: M): MetricChunk    => mk({ type: "metric",    data }, meta);
export const log       = (data: LogData,      meta?: M): LogChunk       => mk({ type: "log",       data }, meta);
export const command   = (data: CommandData,  meta?: M): CommandChunk   => mk({ type: "command",   data }, meta);
export const frame     = (data: FrameData,    meta?: M): FrameChunk     => mk({ type: "frame",     data }, meta);
export const patch     = (data: PatchOp[],    meta?: M): PatchChunk     => mk({ type: "patch",     data }, meta);
export const multipart = (data: MultipartData,meta?: M): MultipartChunk => mk({ type: "multipart", data }, meta);
