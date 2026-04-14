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
export declare const registry: {
    register(name: string): ProcessorState;
    deregister(name: string): void;
    inspect(): ProcessorState[];
    snapshot(): object[];
};
//# sourceMappingURL=registry.d.ts.map