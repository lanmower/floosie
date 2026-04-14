import type { Chunk } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";

const pass = <K extends "binary" | "image" | "video" | "audio" | "pdf" | "archive">(
  type: K,
): ChunkCodec<Extract<Chunk, { type: K }>> => {
  type T = Extract<Chunk, { type: K }>;
  return {
    encode: (c) => (c as { data: Uint8Array }).data,
    decode: (b, meta) => (meta !== undefined ? { type, data: b, meta } : { type, data: b }) as T,
  };
};

const view = new DataView(new ArrayBuffer(8));

const fixedNumCodec = <K extends "uint8" | "int32" | "float64" | "bool" | "timestamp">(
  type: K,
  size: number,
  write: (v: number | boolean) => Uint8Array,
  read: (b: Uint8Array) => number | boolean,
): ChunkCodec<Extract<Chunk, { type: K }>> => {
  type T = Extract<Chunk, { type: K }>;
  return {
    encode: (c) => write((c as { data: number | boolean }).data),
    decode: (b, meta) => {
      const data = read(b) as (number & boolean);
      return (meta !== undefined ? { type, data, meta } : { type, data }) as T;
    },
  };
};

const u8Write = (v: number | boolean): Uint8Array => new Uint8Array([Number(v) & 0xff]);
const u8Read  = (b: Uint8Array): number => b[0]!;

const i32Write = (v: number | boolean): Uint8Array => {
  view.setInt32(0, Number(v), true);
  return new Uint8Array(view.buffer.slice(0, 4));
};
const i32Read = (b: Uint8Array): number => { new DataView(b.buffer, b.byteOffset).getInt32(0, true); return new DataView(b.buffer, b.byteOffset).getInt32(0, true); };

const f64Write = (v: number | boolean): Uint8Array => {
  view.setFloat64(0, Number(v), true);
  return new Uint8Array(view.buffer.slice(0, 8));
};
const f64Read = (b: Uint8Array): number => new DataView(b.buffer, b.byteOffset).getFloat64(0, true);

export const EMBEDDING_CODEC: ChunkCodec<Extract<Chunk, { type: "embedding" }>> = {
  encode: (c) => new Uint8Array(c.data.buffer, c.data.byteOffset, c.data.byteLength),
  decode: (b, meta) => {
    const data = new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
    return meta !== undefined ? { type: "embedding", data, meta } : { type: "embedding", data };
  },
};

export const NULL_CODEC: ChunkCodec<Extract<Chunk, { type: "null" }>> = {
  encode: () => new Uint8Array(0),
  decode: (_, meta) => meta !== undefined ? { type: "null", data: null, meta } : { type: "null", data: null },
};

export const BINARY_CODECS = {
  binary:    pass("binary"),
  image:     pass("image"),
  video:     pass("video"),
  audio:     pass("audio"),
  pdf:       pass("pdf"),
  archive:   pass("archive"),
  embedding: EMBEDDING_CODEC,
  null:      NULL_CODEC,
  uint8:     fixedNumCodec("uint8",     1, u8Write,  u8Read),
  int32:     fixedNumCodec("int32",     4, i32Write, i32Read),
  float64:   fixedNumCodec("float64",   8, f64Write, f64Read),
  bool:      fixedNumCodec("bool",      1, (v) => u8Write(v ? 1 : 0), (b) => u8Read(b) !== 0),
  timestamp: fixedNumCodec("timestamp", 8, f64Write, f64Read),
};
