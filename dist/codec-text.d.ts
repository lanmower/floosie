import type { Chunk } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";
export declare const JSON_CODEC: ChunkCodec<Extract<Chunk, {
    type: "json";
}>>;
export declare const RAW_CODEC: ChunkCodec<Extract<Chunk, {
    type: "raw";
}>>;
export declare const CSV_CODEC: ChunkCodec<Extract<Chunk, {
    type: "csv";
}>>;
export declare const TEXT_CODECS: {
    json: ChunkCodec<{
        type: "json";
        data: unknown;
        meta?: Record<string, unknown>;
    }>;
    raw: ChunkCodec<{
        type: "raw";
        data: unknown;
        meta?: Record<string, unknown>;
    }>;
    csv: ChunkCodec<{
        type: "csv";
        data: string[];
        meta?: Record<string, unknown>;
    }>;
    text: ChunkCodec<{
        type: "text";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    ndjson: ChunkCodec<{
        type: "ndjson";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    xml: ChunkCodec<{
        type: "xml";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    yaml: ChunkCodec<{
        type: "yaml";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    markdown: ChunkCodec<{
        type: "markdown";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    html: ChunkCodec<{
        type: "html";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    sql: ChunkCodec<{
        type: "sql";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    delta: ChunkCodec<{
        type: "delta";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    uuid: ChunkCodec<{
        type: "uuid";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    geojson: ChunkCodec<{
        type: "geojson";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    jwt: ChunkCodec<{
        type: "jwt";
        data: string;
        meta?: Record<string, unknown>;
    }>;
    graphql: ChunkCodec<{
        type: "graphql";
        data: string;
        meta?: Record<string, unknown>;
    }>;
};
//# sourceMappingURL=codec-text.d.ts.map