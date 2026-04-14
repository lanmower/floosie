import { json } from "./chunk.js";
import { createProcessor } from "./processor.js";
async function* acpSourceIter(conn) {
    const queue = [];
    let notifyReady = null;
    let done = false;
    const enqueue = (chunk) => {
        queue.push(chunk);
        notifyReady?.();
        notifyReady = null;
    };
    conn.signal.addEventListener("abort", () => {
        done = true;
        notifyReady?.();
        notifyReady = null;
    });
    conn.on?.("sessionUpdate", (params) => {
        enqueue(json(params));
    });
    while (!done || queue.length > 0) {
        if (queue.length === 0) {
            await new Promise((r) => { notifyReady = r; });
        }
        const chunk = queue.shift();
        if (chunk !== undefined)
            yield chunk;
    }
}
export function acpSource(conn) {
    return acpSourceIter(conn);
}
export function acpSink(conn) {
    return async (iter) => {
        for await (const chunk of iter) {
            if (chunk.type === "json") {
                await conn.sessionUpdate(chunk.data);
            }
            else {
                const sessionId = chunk.meta?.["sessionId"] ?? "";
                await conn.sessionUpdate({
                    sessionId,
                    update: {
                        type: "message",
                        role: "assistant",
                        content: [{ type: "text", text: JSON.stringify(chunk.data) }],
                    },
                });
            }
        }
    };
}
export function acpProcessor(conn, name, transform) {
    const input = acpSource(conn);
    const handle = createProcessor({
        name,
        input,
        transform,
    });
    conn.signal.addEventListener("abort", () => handle.stop());
    const sink = acpSink(conn);
    void sink(handle.output).catch((e) => {
        handle.state.errors.push(String(e));
        handle.state.status = "error";
    });
    return handle;
}
//# sourceMappingURL=acp.js.map