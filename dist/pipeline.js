import { createNode } from "./node.js";
import { sflow } from "sflow";
export function pipe(...nodes) {
    if (nodes.length === 0)
        throw new Error("pipe() requires at least one node");
    return nodes.reduce((acc, next) => acc.pipe(next));
}
export function connect(from, to) {
    return {
        [Symbol.asyncIterator]() {
            const source = from.run(emptySource());
            return to.run(source)[Symbol.asyncIterator]();
        },
    };
}
async function* emptySource() { }
export function source(items) {
    return createNode("source", (_flow) => sflow(items));
}
export function sink(name) {
    return createNode(name, (flow) => flow);
}
//# sourceMappingURL=pipeline.js.map