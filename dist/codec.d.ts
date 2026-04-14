import type { Chunk, ChunkType } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";
export type { ChunkCodec } from "./codec-types.js";
export declare const CODECS: {
    [K in ChunkType]: ChunkCodec<Extract<Chunk, {
        type: K;
    }>>;
};
export declare function encodeChunk(chunk: Chunk): Uint8Array;
export declare function decodeChunk(type: ChunkType, bytes: Uint8Array, meta?: Record<string, unknown>): Chunk;
//# sourceMappingURL=codec.d.ts.map