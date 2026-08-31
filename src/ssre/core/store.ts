/*
 * Filename: store.ts
 * FullPath: modules/projects/ssr.e/src/ssre/core/store.ts
 * FIND:ssre
 * TAG:ssre,store
 *
 * Named observe() stores shared between HTML render and the live channel.
 */
import { getValue, hasValue, isPrimitive } from "@fest-lib/core";
import { affected, observe, safe, type observeValid } from "@fest-lib/object";
import type { ChannelMessage, CssVarBinding, SsreScenario, TypedOmEntry } from "../node/types.ts";

export type HubSink = (msg: ChannelMessage) => void;

const pathOf = (prop: any): string =>
    prop == null || prop === "value" ? "value" : String(prop);

const snapshotOf = (value: any): any => {
    const raw = hasValue(value) ? getValue(value) : value;
    if (raw == null || isPrimitive(raw)) return raw;
    try {
        const plain = safe(raw);
        return JSON.parse(JSON.stringify(plain, (_key, item) => {
            if (typeof item === "bigint") return Number(item);
            if (typeof item === "function" || typeof item === "symbol") return undefined;
            return item;
        }));
    } catch {
        return String(getValue(value) ?? "");
    }
};

export class ReactiveHub {
    readonly stores = new Map<string, observeValid<any>>();
    readonly actions = new Map<string, (...args: any[]) => any>();
    readonly mapped = new Map<string, { source: any; store: string; path: string; render: () => string }>();
    readonly names = new WeakMap<object, string>();
    readonly sinks = new Set<HubSink>();
    readonly cssVars = new Map<string, CssVarBinding>();
    readonly typedOmEntries = new Map<string, TypedOmEntry>();
    channel: SsreScenario["channel"];
    lastScenario: SsreScenario | null = null;
    private storeSeq = 0;
    private unsubs = new Map<string, () => void>();

    store<T = any>(name: string, initial: T): observeValid<T> {
        const existing = this.stores.get(name);
        if (existing) return existing as observeValid<T>;
        const target = (initial != null && typeof initial === "object") || typeof initial === "function"
            ? initial
            : { value: initial } as T;
        const observed = observe(target) as observeValid<T>;
        this.attach(name, observed);
        return observed;
    }

    attach(name: string, observed: observeValid<any>): observeValid<any> {
        this.stores.set(name, observed);
        if (observed != null && typeof observed === "object") this.names.set(observed, name);
        this.unsubs.get(name)?.();
        const off = affected(observed, (value, prop) => {
            this.broadcast({ t: "set", store: name, path: pathOf(prop), value: snapshotOf(hasValue(observed) && (prop == null || prop === "value") ? observed : value) });
            for (const [id, mapped] of this.mapped) {
                if (mapped.store === name) this.broadcast({ t: "html", id, html: mapped.render() });
            }
        });
        this.unsubs.set(name, () => off?.());
        return observed;
    }

    nameOf(target: any): string | null {
        if (target == null || typeof target !== "object") return null;
        return this.names.get(target) ?? null;
    }

    ensureNamed(target: any, hint?: string): string {
        const known = this.nameOf(target);
        if (known) return known;
        const name = hint || `__s${this.storeSeq++}`;
        this.attach(name, observe(target));
        return name;
    }

    action(name: string, fn: (...args: any[]) => any): void {
        this.actions.set(name, fn);
    }

    cssVar(binding: CssVarBinding): CssVarBinding {
        this.cssVars.set(`${binding.host}\0${binding.name}`, binding);
        return binding;
    }

    typedOm(name: string, entry: TypedOmEntry): void {
        this.typedOmEntries.set(name, entry);
    }

    subscribe(sink: HubSink): () => void {
        this.sinks.add(sink);
        return () => this.sinks.delete(sink);
    }

    broadcast(msg: ChannelMessage): void {
        for (const sink of this.sinks) sink(msg);
    }

    handle(msg: ChannelMessage): any {
        if (msg.t === "set" && msg.store) {
            const store = this.stores.get(msg.store);
            if (!store) return;
            const path = msg.path ?? "value";
            if (path === "value" && hasValue(store)) store.value = msg.value;
            else (store as any)[path] = msg.value;
            return;
        }
        if (msg.t === "action" && msg.name) {
            return this.actions.get(msg.name)?.(...(msg.args ?? []));
        }
        if (msg.t === "event" && msg.name) {
            return this.actions.get(msg.name)?.(msg.value, msg);
        }
    }

    toScenario(): Pick<SsreScenario, "stores" | "cssVars" | "typedOm"> {
        const stores: SsreScenario["stores"] = {};
        for (const [name, store] of this.stores) {
            stores[name] = { snapshot: snapshotOf(store) };
        }
        const cssVars = [...this.cssVars.values()];
        const typedOm = this.typedOmEntries.size
            ? Object.fromEntries(this.typedOmEntries)
            : undefined;
        return { stores, cssVars, typedOm };
    }

    [Symbol.dispose](): void {
        for (const off of this.unsubs.values()) off?.();
        this.unsubs.clear();
        this.sinks.clear();
    }
}

export const createHub = (): ReactiveHub => new ReactiveHub();
