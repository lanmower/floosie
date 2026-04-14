import type { Chunk, ChunkType } from "./chunk.js";
import { type ProcessorConfig, type ProcessorHandle } from "./processor.js";
export declare function stdioProcessor<I extends Chunk, O extends Chunk>(config: Omit<ProcessorConfig<I, O>, "input" | "output"> & {
    inputType: ChunkType;
}): ProcessorHandle<I, O>;
//# sourceMappingURL=stdio.d.ts.map