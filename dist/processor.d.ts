import type { Chunk } from "./chunk.js";
import type { FlowFn } from "./node.js";
import { type ProcessorState } from "./registry.js";
import type { Writable } from "node:stream";
type AnyReadable = AsyncIterable<Chunk> | ReadableStream<Chunk> | null;
type AnyWritable = WritableStream<Chunk> | Writable | null | undefined;
export type ProcessorConfig<I extends Chunk, O extends Chunk> = {
    name: string;
    input?: AnyReadable;
    transform: FlowFn<I, O>;
    output?: AnyWritable;
};
export type ProcessorHandle<I extends Chunk = Chunk, O extends Chunk = Chunk> = {
    readonly name: string;
    readonly state: ProcessorState;
    readonly _transform: FlowFn<I, O>;
    start(): Promise<void>;
    stop(): void;
    pipe<N extends Chunk>(next: ProcessorHandle<O, N>): ProcessorHandle<I, N>;
    readonly output: AsyncIterable<O>;
};
export declare function createProcessor<I extends Chunk, O extends Chunk>(config: ProcessorConfig<I, O>): ProcessorHandle<I, O>;
export {};
//# sourceMappingURL=processor.d.ts.map