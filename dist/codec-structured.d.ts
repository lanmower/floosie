import type { Chunk, SseMessage } from "./chunk-types.js";
import type { ChunkCodec } from "./codec-types.js";
export declare const SSE_CODEC: ChunkCodec<Extract<Chunk, {
    type: "sse";
}>>;
export declare const STRUCTURED_CODECS: {
    "http-request": ChunkCodec<{
        type: "http-request";
        data: import("./chunk-types.js").HttpRequest;
        meta?: Record<string, unknown>;
    }>;
    "http-response": ChunkCodec<{
        type: "http-response";
        data: import("./chunk-types.js").HttpResponse;
        meta?: Record<string, unknown>;
    }>;
    websocket: ChunkCodec<{
        type: "websocket";
        data: import("./chunk-types.js").WebSocketMessage;
        meta?: Record<string, unknown>;
    }>;
    token: ChunkCodec<{
        type: "token";
        data: import("./chunk-types.js").Token;
        meta?: Record<string, unknown>;
    }>;
    error: ChunkCodec<{
        type: "error";
        data: import("./chunk-types.js").ErrorData;
        meta?: Record<string, unknown>;
    }>;
    signal: ChunkCodec<{
        type: "signal";
        data: import("./chunk-types.js").SignalData;
        meta?: Record<string, unknown>;
    }>;
    rpc: ChunkCodec<{
        type: "rpc";
        data: import("./chunk-types.js").RpcMessage;
        meta?: Record<string, unknown>;
    }>;
    event: ChunkCodec<{
        type: "event";
        data: import("./chunk-types.js").EventData;
        meta?: Record<string, unknown>;
    }>;
    span: ChunkCodec<{
        type: "span";
        data: import("./chunk-types.js").SpanData;
        meta?: Record<string, unknown>;
    }>;
    metric: ChunkCodec<{
        type: "metric";
        data: import("./chunk-types.js").MetricData;
        meta?: Record<string, unknown>;
    }>;
    log: ChunkCodec<{
        type: "log";
        data: import("./chunk-types.js").LogData;
        meta?: Record<string, unknown>;
    }>;
    command: ChunkCodec<{
        type: "command";
        data: import("./chunk-types.js").CommandData;
        meta?: Record<string, unknown>;
    }>;
    patch: ChunkCodec<{
        type: "patch";
        data: import("./chunk-types.js").PatchOp[];
        meta?: Record<string, unknown>;
    }>;
    sse: ChunkCodec<{
        type: "sse";
        data: SseMessage;
        meta?: Record<string, unknown>;
    }>;
};
//# sourceMappingURL=codec-structured.d.ts.map