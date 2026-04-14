import type { AgentSideConnection } from "@agentclientprotocol/sdk";
import type { Chunk } from "./chunk.js";
import { type ProcessorHandle } from "./processor.js";
import type { FlowFn } from "./node.js";
export declare function acpSource(conn: AgentSideConnection): AsyncIterable<Chunk>;
export declare function acpSink(conn: AgentSideConnection): (iter: AsyncIterable<Chunk>) => Promise<void>;
export declare function acpProcessor<I extends Chunk, O extends Chunk>(conn: AgentSideConnection, name: string, transform: FlowFn<I, O>): ProcessorHandle<I, O>;
//# sourceMappingURL=acp.d.ts.map