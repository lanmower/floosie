const enc = new TextEncoder();
const dec = new TextDecoder();
const utf8Codec = (type) => {
    return {
        encode: (c) => enc.encode(c.data),
        decode: (b, meta) => {
            const data = dec.decode(b);
            return (meta !== undefined ? { type, data, meta } : { type, data });
        },
    };
};
export const JSON_CODEC = {
    encode: (c) => enc.encode(JSON.stringify(c.data)),
    decode: (b, meta) => {
        const str = dec.decode(b);
        try {
            const data = JSON.parse(str);
            return meta !== undefined ? { type: "json", data, meta } : { type: "json", data };
        }
        catch (e) {
            throw new Error(`json decode failed: ${str.slice(0, 80)} — ${String(e)}`);
        }
    },
};
export const RAW_CODEC = {
    encode: (c) => enc.encode(JSON.stringify(c.data)),
    decode: (b, meta) => {
        const data = JSON.parse(dec.decode(b));
        return meta !== undefined ? { type: "raw", data, meta } : { type: "raw", data };
    },
};
export const CSV_CODEC = {
    encode: (c) => enc.encode(c.data.map((f) => (f.includes(",") || f.includes('"') ? `"${f.replace(/"/g, '""')}"` : f)).join(",")),
    decode: (b, meta) => {
        const line = dec.decode(b);
        const data = [];
        let cur = "", inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"' && inQ && line[i + 1] === '"') {
                cur += '"';
                i++;
                continue;
            }
            if (ch === '"') {
                inQ = !inQ;
                continue;
            }
            if (ch === "," && !inQ) {
                data.push(cur);
                cur = "";
                continue;
            }
            cur += ch;
        }
        data.push(cur);
        return meta !== undefined ? { type: "csv", data, meta } : { type: "csv", data };
    },
};
export const TEXT_CODECS = {
    json: JSON_CODEC,
    raw: RAW_CODEC,
    csv: CSV_CODEC,
    text: utf8Codec("text"),
    ndjson: utf8Codec("ndjson"),
    xml: utf8Codec("xml"),
    yaml: utf8Codec("yaml"),
    markdown: utf8Codec("markdown"),
    html: utf8Codec("html"),
    sql: utf8Codec("sql"),
    delta: utf8Codec("delta"),
    uuid: utf8Codec("uuid"),
    geojson: utf8Codec("geojson"),
    jwt: utf8Codec("jwt"),
    graphql: utf8Codec("graphql"),
};
//# sourceMappingURL=codec-text.js.map