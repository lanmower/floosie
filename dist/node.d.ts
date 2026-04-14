import { sflow } from "sflow";
import type { Chunk } from "./chunk.js";
export type FlowFn<I extends Chunk, O extends Chunk> = (flow: ReturnType<typeof sflow<I>>) => ReturnType<typeof sflow<O>>;
export type StreamNode<I extends Chunk = Chunk, O extends Chunk = Chunk> = {
    readonly name: string;
    readonly transform: FlowFn<I, O>;
    pipe<N extends Chunk>(next: StreamNode<O, N>): StreamNode<I, N>;
    run(source: AsyncIterable<I>): AsyncIterable<O>;
};
export declare function createNode<I extends Chunk, O extends Chunk>(name: string, transform: FlowFn<I, O>): StreamNode<I, O>;
export declare function identityNode<T extends Chunk>(name: string): StreamNode<T, T>;
//# sourceMappingURL=node.d.ts.map