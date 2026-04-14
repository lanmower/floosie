import type { Chunk } from "./chunk-types.js";

export type ChunkCodec<T extends Chunk = Chunk> = {
  encode(chunk: T): Uint8Array;
  decode(bytes: Uint8Array, meta?: Record<string, unknown>): T;
};
