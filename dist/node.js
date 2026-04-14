import { sflow } from "sflow";
function makeNode(name, transform) {
    const node = {
        name,
        transform,
        pipe(next) {
            return makeNode(`${name}→${next.name}`, (flow) => next.transform(transform(flow)));
        },
        run(source) {
            return transform(sflow(source));
        },
    };
    return node;
}
export function createNode(name, transform) {
    return makeNode(name, transform);
}
export function identityNode(name) {
    return makeNode(name, (flow) => flow);
}
//# sourceMappingURL=node.js.map