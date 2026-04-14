const entries = new Map();
let nameCounter = 0;
function uniqueName(base) {
    const candidate = entries.has(base) ? `${base}-${++nameCounter}` : base;
    return candidate;
}
export const registry = {
    register(name) {
        const key = uniqueName(name);
        const startedAt = null;
        const state = {
            name: key,
            status: "idle",
            chunksIn: 0,
            chunksOut: 0,
            errors: [],
            startedAt,
            uptimeMs() {
                return this.startedAt == null ? 0 : Date.now() - this.startedAt;
            },
        };
        entries.set(key, { state });
        return state;
    },
    deregister(name) {
        entries.delete(name);
    },
    inspect() {
        return [...entries.values()].map((e) => e.state);
    },
    snapshot() {
        return [...entries.values()].map((e) => ({
            name: e.state.name,
            status: e.state.status,
            chunksIn: e.state.chunksIn,
            chunksOut: e.state.chunksOut,
            errors: e.state.errors.slice(-10),
            uptimeMs: e.state.uptimeMs(),
        }));
    },
};
//# sourceMappingURL=registry.js.map