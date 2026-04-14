import type { Chunk, ChunkType } from "./chunk.js";

export type ChunkCodec<T extends Chunk = Chunk> = {
  encode(chunk: T): Uint8Array;
  decode(bytes: Uint8Array, meta?: Record<string, unknown>): T;
};

const enc = new TextEncoder();
const dec = new TextDecoder();

const JSON_CODEC: ChunkCodec<Extract<Chunk, { type: "json" }>> = {
  encode(chunk) {
    return enc.encode(JSON.stringify(chunk.data));
  },
  decode(bytes, meta) {
    const str = dec.decode(bytes);
    try {
      const data: unknown = JSON.parse(str);
      return meta !== undefined ? { type: "json", data, meta } : { type: "json", data };
    } catch (e) {
      throw new Error(`JSON decode failed at: ${str.slice(0, 80)} — ${String(e)}`);
    }
  },
};

function passthroughCodec<K extends "binary" | "image" | "video">(type: K): ChunkCodec<Extract<Chunk, { type: K }>> {
  type T = Extract<Chunk, { type: K }>;
  return {
    encode(chunk: T) {
      return (chunk as { data: Uint8Array }).data;
    },
    decode(bytes, meta): T {
      return (meta !== undefined ? { type, data: bytes, meta } : { type, data: bytes }) as T;
    },
  };
}

const TEXT_CODEC: ChunkCodec<Extract<Chunk, { type: "text" }>> = {
  encode(chunk) {
    return enc.encode(chunk.data);
  },
  decode(bytes, meta) {
    const data = dec.decode(bytes);
    return meta !== undefined ? { type: "text", data, meta } : { type: "text", data };
  },
};

const RAW_CODEC: ChunkCodec<Extract<Chunk, { type: "raw" }>> = {
  encode(chunk) {
    return enc.encode(JSON.stringify(chunk.data));
  },
  decode(bytes, meta) {
    const data: unknown = JSON.parse(dec.decode(bytes));
    return meta !== undefined ? { type: "raw", data, meta } : { type: "raw", data };
  },
};

export const CODECS = {
  json: JSON_CODEC,
  binary: passthroughCodec("binary"),
  text: TEXT_CODEC,
  image: passthroughCodec("image"),
  video: passthroughCodec("video"),
  raw: RAW_CODEC,
} satisfies { [K in ChunkType]: ChunkCodec<Extract<Chunk, { type: K }>> };

export function encodeChunk(chunk: Chunk): Uint8Array {
  return (CODECS[chunk.type] as ChunkCodec<typeof chunk>).encode(chunk as never);
}

export function decodeChunk(type: ChunkType, bytes: Uint8Array, meta?: Record<string, unknown>): Chunk {
  return (CODECS[type] as ChunkCodec).decode(bytes, meta);
}
