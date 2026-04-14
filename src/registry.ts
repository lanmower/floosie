export type ProcessorStatus = "idle" | "running" | "error" | "stopped";

export type ProcessorState = {
  name: string;
  status: ProcessorStatus;
  chunksIn: number;
  chunksOut: number;
  errors: string[];
  startedAt: number | null;
  uptimeMs: () => number;
};

type ProcessorEntry = {
  state: ProcessorState;
};

const entries = new Map<string, ProcessorEntry>();

let nameCounter = 0;

function uniqueName(base: string): string {
  const candidate = entries.has(base) ? `${base}-${++nameCounter}` : base;
  return candidate;
}

export const registry = {
  register(name: string): ProcessorState {
    const key = uniqueName(name);
    const startedAt: number | null = null;
    const state: ProcessorState = {
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

  deregister(name: string): void {
    entries.delete(name);
  },

  inspect(): ProcessorState[] {
    return [...entries.values()].map((e) => e.state);
  },

  snapshot(): object[] {
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
