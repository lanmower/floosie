import { createProcessor, json, text, registry } from "./index.js";
async function* msgs() {
    yield json({ msg: "hello" });
    yield json({ msg: "world" });
    yield json({ msg: "stream" });
}
const upper = createProcessor({
    name: "upper",
    input: msgs(),
    transform: (flow) => flow.map((chunk) => text(String(chunk.data.msg).toUpperCase())),
});
const exclaim = createProcessor({
    name: "exclaim",
    transform: (flow) => flow.map((chunk) => text(chunk.data + "!!!")),
});
const pipeline = upper.pipe(exclaim);
for await (const chunk of pipeline.output) {
    console.log(chunk.data);
}
console.log("\nRegistry:", registry.snapshot());
//# sourceMappingURL=example.js.map