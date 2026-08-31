/*
 * Filename: M.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/M.ts
 * FIND:ssre
 *
 * Mapped children. Live list updates re-render the host on the hub and patch HTML.
 */
import { getValue, hasValue } from "@fest-lib/core";
import { currentContext } from "./context.ts";
import { vnode } from "./E.ts";
import type { Child, VNode } from "./types.ts";

const itemsOf = (source: any): any[] => {
    const value = hasValue(source) ? getValue(source) : source;
    if (value == null) return [];
    if (Array.isArray(value)) return value;
    if (value instanceof Set || value instanceof Map) return Array.from(value);
    if (typeof value[Symbol.iterator] === "function") return Array.from(value);
    return [value];
};

export const M = (source: any, mapFn: (item: any, index: number) => Child = (item) => item): VNode => {
    const ctx = currentContext();
    const store = ctx.hub.ensureNamed(hasValue(source) || typeof source === "object" ? source : { value: source });
    const id = ctx.nextId("m");
    const node = vnode({
        kind: "mapped",
        tag: "ssre-map",
        id,
        source,
        mapFn,
        children: itemsOf(source).map((item, index) => mapFn(item, index)),
    });
    ctx.mapped.push({ id, store, path: hasValue(source) ? "value" : "" });
    ctx.hub.mapped.set(id, {
        source,
        store,
        path: hasValue(source) ? "value" : "",
        render: () => {
            const { renderChildren } = requireRender();
            return renderChildren(itemsOf(source).map((item, index) => mapFn(item, index)));
        },
    });
    return node;
};

let renderChildren: ((children: Child[]) => string) | null = null;

/** WHY: M registers a hub renderer without importing render.ts (cycle). */
export const bindMappedRenderer = (fn: (children: Child[]) => string): void => {
    renderChildren = fn;
};

const requireRender = () => {
    if (!renderChildren) throw new Error("SSR.E: render pipeline is not bound");
    return { renderChildren };
};

export default M;
