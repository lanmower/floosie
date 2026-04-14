import { TEXT_CODECS } from "./codec-text.js";
import { BINARY_CODECS } from "./codec-binary.js";
import { STRUCTURED_CODECS } from "./codec-structured.js";
export const CODECS = {
    ...TEXT_CODECS,
    ...BINARY_CODECS,
    ...STRUCTURED_CODECS,
};
export function encodeChunk(chunk) {
    return CODECS[chunk.type].encode(chunk);
}
export function decodeChunk(type, bytes, meta) {
    return CODECS[type].decode(bytes, meta);
}
//# sourceMappingURL=codec.js.map