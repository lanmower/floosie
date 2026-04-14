import type { Chunk } from "./chunk.js";
import type { StreamNode } from "./node.js";
export declare function pipe<A extends Chunk>(...nodes: []): never;
export declare function pipe<A extends Chunk, B extends Chunk>(a: StreamNode<A, B>): StreamNode<A, B>;
export declare function pipe<A extends Chunk, B extends Chunk, C extends Chunk>(a: StreamNode<A, B>, b: StreamNode<B, C>): StreamNode<A, C>;
export declare function pipe<A extends Chunk, B extends Chunk, C extends Chunk, D extends Chunk>(a: StreamNode<A, B>, b: StreamNode<B, C>, c: StreamNode<C, D>): StreamNode<A, D>;
export declare function pipe<A extends Chunk, B extends Chunk, C extends Chunk, D extends Chunk, E extends Chunk>(a: StreamNode<A, B>, b: StreamNode<B, C>, c: StreamNode<C, D>, d: StreamNode<D, E>): StreamNode<A, E>;
export declare function connect<I extends Chunk, O extends Chunk>(from: StreamNode<I, O>, to: {
    run(source: AsyncIterable<O>): AsyncIterable<unknown>;
}): AsyncIterable<unknown>;
export declare function source<T extends Chunk>(items: Iterable<T> | AsyncIterable<T>): StreamNode<never, T>;
export declare function sink<T extends Chunk>(name: string): StreamNode<T, T>;
//# sourceMappingURL=pipeline.d.ts.map