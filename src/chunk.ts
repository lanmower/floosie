export type ChunkType = "json" | "binary" | "text" | "image" | "video" | "raw";

export type Chunk<T = unknown> =
  | { type: "json"; data: T; meta?: Record<string, unknown> }
  | { type: "binary"; data: Uint8Array; meta?: Record<string, unknown> }
  | { type: "text"; data: string; meta?: Record<string, unknown> }
  | { type: "image"; data: Uint8Array; meta?: Record<string, unknown> }
  | { type: "video"; data: Uint8Array; meta?: Record<string, unknown> }
  | { type: "raw"; data: unknown; meta?: Record<string, unknown> };

export type JsonChunk<T = unknown> = Extract<Chunk<T>, { type: "json" }>;
export type BinaryChunk = Extract<Chunk, { type: "binary" }>;
export type TextChunk = Extract<Chunk, { type: "text" }>;

export function json<T>(data: T, meta?: Record<string, unknown>): JsonChunk<T> {
  const c: JsonChunk<T> = meta !== undefined ? { type: "json", data, meta } : { type: "json", data };
  return c;
}

export function binary(data: Uint8Array, meta?: Record<string, unknown>): BinaryChunk {
  return meta !== undefined ? { type: "binary", data, meta } : { type: "binary", data };
}

export function text(data: string, meta?: Record<string, unknown>): TextChunk {
  return meta !== undefined ? { type: "text", data, meta } : { type: "text", data };
}

export function raw(data: unknown, meta?: Record<string, unknown>): Extract<Chunk, { type: "raw" }> {
  return meta !== undefined ? { type: "raw", data, meta } : { type: "raw", data };
}

export function image(data: Uint8Array, meta?: Record<string, unknown>): Extract<Chunk, { type: "image" }> {
  return meta !== undefined ? { type: "image", data, meta } : { type: "image", data };
}

export function video(data: Uint8Array, meta?: Record<string, unknown>): Extract<Chunk, { type: "video" }> {
  return meta !== undefined ? { type: "video", data, meta } : { type: "video", data };
}
