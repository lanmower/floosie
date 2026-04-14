const enc = new TextEncoder();
const dec = new TextDecoder();
const jsonCodec = (type) => {
    return {
        encode: (c) => enc.encode(JSON.stringify(c.data)),
        decode: (b, meta) => {
            const data = JSON.parse(dec.decode(b));
            return (meta !== undefined ? { type, data, meta } : { type, data });
        },
    };
};
export const SSE_CODEC = {
    encode: (c) => {
        const parts = [];
        if (c.data.event !== undefined)
            parts.push(`event: ${c.data.event}`);
        if (c.data.id !== undefined)
            parts.push(`id: ${c.data.id}`);
        parts.push(`data: ${c.data.data}`);
        return enc.encode(parts.join("\n") + "\n\n");
    },
    decode: (b, meta) => {
        const data = {};
        for (const line of dec.decode(b).split("\n")) {
            if (line.startsWith("data: "))
                data.data = line.slice(6);
            else if (line.startsWith("event: "))
                data.event = line.slice(7);
            else if (line.startsWith("id: "))
                data.id = line.slice(4);
        }
        if (data.data === undefined)
            throw new Error(`sse decode: missing data field in: ${dec.decode(b).slice(0, 80)}`);
        const msg = { data: data.data };
        if (data.event !== undefined)
            msg.event = data.event;
        if (data.id !== undefined)
            msg.id = data.id;
        return meta !== undefined ? { type: "sse", data: msg, meta } : { type: "sse", data: msg };
    },
};
export const STRUCTURED_CODECS = {
    "http-request": jsonCodec("http-request"),
    "http-response": jsonCodec("http-response"),
    "websocket": jsonCodec("websocket"),
    "token": jsonCodec("token"),
    "error": jsonCodec("error"),
    "signal": jsonCodec("signal"),
    "rpc": jsonCodec("rpc"),
    "event": jsonCodec("event"),
    "span": jsonCodec("span"),
    "metric": jsonCodec("metric"),
    "log": jsonCodec("log"),
    "command": jsonCodec("command"),
    "patch": jsonCodec("patch"),
    "sse": SSE_CODEC,
};
//# sourceMappingURL=codec-structured.js.map