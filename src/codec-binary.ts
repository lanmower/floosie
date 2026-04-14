import type { Chunk, FrameData, MultipartData } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";
import { detectMime } from "./mime.js";

const pass = <K extends "binary" | "image" | "video" | "audio" | "pdf" | "archive" | "protobuf" | "msgpack" | "cbor" | "arrow" | "parquet">(
  type: K,
): ChunkCodec<Extract<Chunk, { type: K }>> => {
  type T = Extract<Chunk, { type: K }>;
  return {
    encode: (c) => (c as { data: Uint8Array }).data,
    decode: (b, meta) => {
      const mime = detectMime(b);
      const m = meta !== undefined ? { ...meta, mime } : { mime };
      return { type, data: b, meta: m } as T;
    },
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
const i32Read = (b: Uint8Array): number => new DataView(b.buffer, b.byteOffset).getInt32(0, true);

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

const enc = new TextEncoder();
const dec = new TextDecoder();

export const FRAME_CODEC: ChunkCodec<Extract<Chunk, { type: "frame" }>> = {
  encode: (c) => {
    const header = enc.encode(JSON.stringify({ width: c.data.width, height: c.data.height, format: c.data.format }));
    const hlen = new Uint8Array(4);
    new DataView(hlen.buffer).setUint32(0, header.length, false);
    const out = new Uint8Array(4 + header.length + c.data.data.length);
    out.set(hlen, 0);
    out.set(header, 4);
    out.set(c.data.data, 4 + header.length);
    return out;
  },
  decode: (b, meta) => {
    const hlen = new DataView(b.buffer, b.byteOffset).getUint32(0, false);
    const header = JSON.parse(dec.decode(b.subarray(4, 4 + hlen))) as { width: number; height: number; format: string };
    const data: FrameData = { ...header, data: b.subarray(4 + hlen) };
    return meta !== undefined ? { type: "frame", data, meta } : { type: "frame", data };
  },
};

export const MULTIPART_CODEC: ChunkCodec<Extract<Chunk, { type: "multipart" }>> = {
  encode: (c) => {
    const header = enc.encode(JSON.stringify({ name: c.data.name, filename: c.data.filename, contentType: c.data.contentType }));
    const hlen = new Uint8Array(4);
    new DataView(hlen.buffer).setUint32(0, header.length, false);
    const out = new Uint8Array(4 + header.length + c.data.data.length);
    out.set(hlen, 0);
    out.set(header, 4);
    out.set(c.data.data, 4 + header.length);
    return out;
  },
  decode: (b, meta) => {
    const hlen = new DataView(b.buffer, b.byteOffset).getUint32(0, false);
    const header = JSON.parse(dec.decode(b.subarray(4, 4 + hlen))) as { name: string; filename?: string; contentType?: string };
    const mime = detectMime(b.subarray(4 + hlen));
    const data: MultipartData = { ...header, data: b.subarray(4 + hlen) };
    const m = meta !== undefined ? { ...meta, mime } : { mime };
    return { type: "multipart", data, meta: m };
  },
};

export const BINARY_CODECS = {
  binary:    pass("binary"),
  image:     pass("image"),
  video:     pass("video"),
  audio:     pass("audio"),
  pdf:       pass("pdf"),
  archive:   pass("archive"),
  protobuf:  pass("protobuf"),
  msgpack:   pass("msgpack"),
  cbor:      pass("cbor"),
  arrow:     pass("arrow"),
  parquet:   pass("parquet"),
  embedding: EMBEDDING_CODEC,
  null:      NULL_CODEC,
  frame:     FRAME_CODEC,
  multipart: MULTIPART_CODEC,
  uint8:     fixedNumCodec("uint8",     1, u8Write,  u8Read),
  int32:     fixedNumCodec("int32",     4, i32Write, i32Read),
  float64:   fixedNumCodec("float64",   8, f64Write, f64Read),
  bool:      fixedNumCodec("bool",      1, (v) => u8Write(v ? 1 : 0), (b) => u8Read(b) !== 0),
  timestamp: fixedNumCodec("timestamp", 8, f64Write, f64Read),
};
