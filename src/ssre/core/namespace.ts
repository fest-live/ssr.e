/*
 * Filename: namespace.ts
 * FullPath: modules/projects/ssr.e/src/ssre/core/namespace.ts
 * FIND:ssre
 *
 * Shared `ssre` namespace for backend HTML and client scripts.
 * INVARIANT: does not import LUR.E. `ssre.use({ bindWith })` is the lure hook.
 */
import { getValue, hasValue } from "@fest-lib/core";
import { affected, observe } from "@fest-lib/object";
import type { ReactiveHub } from "./store.ts";
import type { BindingKind, SsreClientSlot } from "../node/types.ts";

export const $ssreSlot = Symbol.for("fest.ssre.slot");
export const $ssreNs = Symbol.for("fest.ssre.ns");

export type SsreSide = "client" | "server";

export interface SsreSlot {
    [$ssreSlot]: true;
    side: SsreSide;
    name: string;
    fallback?: any;
}

export type SsreBindWith = (el: any, prop: string, value: any, handler: (el: any, prop: string, value: any) => void) => void;

export const isSsreSlot = (value: any): value is SsreSlot =>
    !!value && typeof value === "object" && value[$ssreSlot] === true;

const makeSlot = (side: SsreSide, name: string, fallback?: any): SsreSlot => ({
    [$ssreSlot]: true,
    side,
    name: String(name),
    fallback,
});

type NsBag = {
    clientSlots: SsreClientSlot[];
    clientRefs: Map<string, any>;
    serverLive: Map<string, any>;
    pendingServer: Map<string, any>;
    bindWith: SsreBindWith | null;
    hub: ReactiveHub | null;
    onServerSet: (store: string, path: string, value: any) => void;
};

const createBag = (): NsBag => {
    const bag: NsBag = {
        clientSlots: [],
        clientRefs: new Map(),
        serverLive: new Map(),
        pendingServer: new Map(),
        bindWith: null,
        hub: null,
        onServerSet(store, path, value) {
            const live = bag.serverLive.get(store);
            if (!live) return;
            if (live && typeof live === "object" && path && path !== "value" && hasValue(live) === false) {
                live[path] = value;
                return;
            }
            if (hasValue(live)) live.value = value;
            else bag.serverLive.set(store, value);
        },
    };
    return bag;
};

const bagOf = (): NsBag => {
    const globalSlot = globalThis as typeof globalThis & { [$ssreNs]?: Partial<NsBag> };
    const current = globalSlot[$ssreNs];
    if (current?.clientRefs && current.serverLive && current.onServerSet) return current as NsBag;
    const created = createBag();
    if (current) {
        if (Array.isArray(current.clientSlots)) created.clientSlots = current.clientSlots;
        if (typeof current.onServerSet === "function") {
            const prev = current.onServerSet;
            const next = created.onServerSet;
            created.onServerSet = (store, path, value) => {
                prev(store, path, value);
                next(store, path, value);
            };
        }
    }
    globalSlot[$ssreNs] = created;
    return created;
};

const readScenario = (): any => {
    const doc = (globalThis as any).document;
    const script = doc?.querySelector?.("#ssre-scenario");
    if (!script) return null;
    try { return JSON.parse(script.textContent || "{}"); } catch { return null; }
};

const ensureClientSlots = (): SsreClientSlot[] => {
    const bag = bagOf();
    if (bag.clientSlots.length) return bag.clientSlots;
    const scenario = readScenario();
    if (Array.isArray(scenario?.clientSlots)) bag.clientSlots = scenario.clientSlots;
    return bag.clientSlots;
};

const applyBound = (el: any, prop: string, value: any): void => {
    const raw = hasValue(value) ? getValue(value) : value;
    const text = raw == null ? "" : String(raw);
    if (prop === "text" || prop === "textContent" || prop === "html") {
        if (prop === "html") el.innerHTML = text;
        else el.textContent = text;
        return;
    }
    if (prop === "value") {
        el.value = raw ?? "";
        return;
    }
    if (prop === "checked") {
        el.checked = !!raw;
        return;
    }
    if (prop === "class") {
        el.className = text;
        return;
    }
    if (prop === "style") {
        el.setAttribute("style", text);
        return;
    }
    if (prop) el.setAttribute(prop, text);
};

const bindHost = (el: any, prop: string, ref: any): void => {
    const bag = bagOf();
    if (typeof bag.bindWith === "function") {
        bag.bindWith(el, prop, ref, applyBound);
        return;
    }
    applyBound(el, prop, ref);
    if (ref != null && typeof ref === "object") {
        affected(ref, () => applyBound(el, prop, ref));
    }
};

const bindNamed = (name: string, ref: any): void => {
    const doc = (globalThis as any).document;
    if (!doc?.querySelector) return;
    for (const slot of ensureClientSlots()) {
        if (slot.name !== name) continue;
        const el = doc.querySelector(`[data-ssre="${slot.id}"]`);
        if (!el) continue;
        const prop = slot.kind === "text" || slot.kind === "html" || slot.kind === "value" || slot.kind === "checked"
            ? slot.kind
            : (slot.attr || slot.kind);
        bindHost(el, prop, ref);
    }
};

const wrapSnap = (snap: any): any => {
    if (snap != null && typeof snap === "object") return snap;
    return { value: snap };
};

export const ssre = {
    attach(hub: ReactiveHub | null | undefined): ReactiveHub | null {
        const bag = bagOf();
        if (hub) {
            bag.hub = hub;
            for (const [name, ref] of bag.pendingServer) hub.store(name, ref);
            bag.pendingServer.clear();
        }
        return bag.hub;
    },

    use(adapters: { bindWith?: SsreBindWith } = {}): void {
        const bag = bagOf();
        if (adapters.bindWith) bag.bindWith = adapters.bindWith;
    },

    client: {
        get(name: string, fallback?: any): any {
            const bag = bagOf();
            if (bag.clientRefs.has(name)) return bag.clientRefs.get(name);
            return makeSlot("client", name, fallback);
        },
        set(name: string, ref: any): any {
            const bag = bagOf();
            bag.clientRefs.set(name, ref);
            bindNamed(name, ref);
            return ref;
        },
    },

    server: {
        get(name: string): any {
            const bag = bagOf();
            if (bag.hub?.stores.has(name)) return bag.hub.stores.get(name);
            if (bag.pendingServer.has(name)) return bag.pendingServer.get(name);
            if (bag.serverLive.has(name)) return bag.serverLive.get(name);
            const doc = (globalThis as any).document;
            if (doc?.querySelector) {
                const scenario = readScenario();
                const snap = scenario?.stores?.[name]?.snapshot;
                const live = observe(wrapSnap(snap));
                bag.serverLive.set(name, live);
                return live;
            }
            return makeSlot("server", name);
        },
        set(name: string, ref: any): any {
            const bag = bagOf();
            if (bag.hub) return bag.hub.store(name, ref);
            bag.pendingServer.set(name, ref);
            return ref;
        },
    },
};

(globalThis as any).ssre = ssre;

export type { BindingKind };
