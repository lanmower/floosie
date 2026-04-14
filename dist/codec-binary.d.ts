import type { Chunk, FrameData, MultipartData } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";
export declare const EMBEDDING_CODEC: ChunkCodec<Extract<Chunk, {
    type: "embedding";
}>>;
export declare const NULL_CODEC: ChunkCodec<Extract<Chunk, {
    type: "null";
}>>;
export declare const FRAME_CODEC: ChunkCodec<Extract<Chunk, {
    type: "frame";
}>>;
export declare const MULTIPART_CODEC: ChunkCodec<Extract<Chunk, {
    type: "multipart";
}>>;
export declare const BINARY_CODECS: {
    binary: ChunkCodec<{
        type: "binary";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    image: ChunkCodec<{
        type: "image";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    video: ChunkCodec<{
        type: "video";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    audio: ChunkCodec<{
        type: "audio";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    pdf: ChunkCodec<{
        type: "pdf";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    archive: ChunkCodec<{
        type: "archive";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    protobuf: ChunkCodec<{
        type: "protobuf";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    msgpack: ChunkCodec<{
        type: "msgpack";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    cbor: ChunkCodec<{
        type: "cbor";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    arrow: ChunkCodec<{
        type: "arrow";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    parquet: ChunkCodec<{
        type: "parquet";
        data: Uint8Array;
        meta?: Record<string, unknown>;
    }>;
    embedding: ChunkCodec<{
        type: "embedding";
        data: Float32Array;
        meta?: Record<string, unknown>;
    }>;
    null: ChunkCodec<{
        type: "null";
        data: null;
        meta?: Record<string, unknown>;
    }>;
    frame: ChunkCodec<{
        type: "frame";
        data: FrameData;
        meta?: Record<string, unknown>;
    }>;
    multipart: ChunkCodec<{
        type: "multipart";
        data: MultipartData;
        meta?: Record<string, unknown>;
    }>;
    uint8: ChunkCodec<{
        type: "uint8";
        data: number;
        meta?: Record<string, unknown>;
    }>;
    int32: ChunkCodec<{
        type: "int32";
        data: number;
        meta?: Record<string, unknown>;
    }>;
    float64: ChunkCodec<{
        type: "float64";
        data: number;
        meta?: Record<string, unknown>;
    }>;
    bool: ChunkCodec<{
        type: "bool";
        data: boolean;
        meta?: Record<string, unknown>;
    }>;
    timestamp: ChunkCodec<{
        type: "timestamp";
        data: number;
        meta?: Record<string, unknown>;
    }>;
};
//# sourceMappingURL=codec-binary.d.ts.map