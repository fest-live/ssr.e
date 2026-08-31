/*
 * Filename: context.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/context.ts
 * FIND:ssre
 *
 * Per-render registry: node ids, bindings, mapped hosts, named actions.
 * INVARIANT: slot lives on globalThis so Vite config graph and ssrLoadModule
 * share one context (duplicate module copies of this file must not fork state).
 */
import { createHub, type ReactiveHub } from "../core/store.ts";
import type { ChannelConfig, SsreBinding, SsreOnBinding, SsreScenario } from "./types.ts";

export class RenderContext {
    readonly hub: ReactiveHub;
    readonly bindings: SsreBinding[] = [];
    readonly events: SsreOnBinding[] = [];
    readonly mapped: SsreScenario["mapped"] = [];
    channel?: ChannelConfig;
    private nodeSeq = 0;
    private actionSeq = 0;

    constructor(hub?: ReactiveHub) {
        this.hub = hub ?? createHub();
    }

    nextId(prefix = "n"): string {
        return `${prefix}${this.nodeSeq++}`;
    }

    bind(binding: Omit<SsreBinding, "id"> & { id?: string }): string {
        const id = binding.id ?? this.nextId();
        this.bindings.push({ ...binding, id });
        return id;
    }

    on(event: string, action: string, id?: string): string {
        const nodeId = id ?? this.nextId("e");
        this.events.push({ id: nodeId, event, action });
        return nodeId;
    }

    registerAction(handler: (...args: any[]) => any, name?: string): string {
        const action = name ?? `__a${this.actionSeq++}`;
        this.hub.action(action, handler);
        return action;
    }

    toScenario(): SsreScenario {
        const scenario: SsreScenario = {
            version: 1,
            ...this.hub.toScenario(),
            bindings: this.bindings.slice(),
            events: this.events.slice(),
            mapped: this.mapped.slice(),
            channel: this.channel ?? this.hub.channel,
        };
        this.hub.lastScenario = scenario;
        return scenario;
    }
}

const SLOT = Symbol.for("fest.ssre.context.slot");

type ContextSlot = { current: RenderContext };

const slot = (): ContextSlot => {
    const globalSlot = globalThis as typeof globalThis & { [SLOT]?: ContextSlot };
    globalSlot[SLOT] ??= { current: new RenderContext() };
    return globalSlot[SLOT];
};

export const currentContext = (): RenderContext => slot().current;

export const withContext = <T>(ctx: RenderContext, fn: () => T): T => {
    const current = slot();
    const prev = current.current;
    current.current = ctx;
    try { return fn(); }
    finally { current.current = prev; }
};

export const beginRender = (hub?: ReactiveHub): RenderContext => {
    const ctx = new RenderContext(hub);
    slot().current = ctx;
    return ctx;
};

export const createContext = (hub?: ReactiveHub): RenderContext => new RenderContext(hub);
