/*
 * Filename: E.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/E.ts
 * FIND:ssre
 * TAG:ssre,hyperscript
 *
 * Backend H/E: same call shape as LUR.E `E`, but a VNode — no DOM, no lure.
 */
import { getValue, hasValue, isPrimitive } from "@fest-lib/core";
import { isObservable } from "@fest-lib/object";
import { bindNodeCss } from "../css/vars.ts";
import { isSsreSlot } from "../core/namespace.ts";
import { currentContext } from "./context.ts";
import { $ssre, type Child, type SsreParams, type VNode } from "./types.ts";

const parseTag = (selector: string): { tag: string; id: string | null; className: string | null } => {
    const tagMatch = selector.match(/^[a-zA-Z][\w:-]*/);
    const tag = tagMatch?.[0] || "div";
    const rest = selector.slice(tag.length);
    const id = rest.match(/#([\w-]+)/)?.[1] ?? null;
    const classes = [...rest.matchAll(/\.([\w-]+)/g)].map((match) => match[1]);
    return { tag, id, className: classes.length ? classes.join(" ") : null };
};

const asClassList = (value: SsreParams["classList"]): string[] => {
    if (value == null) return [];
    if (typeof value === "string") return value.split(/\s+/).filter(Boolean);
    return Array.from(value as Iterable<string>).filter(Boolean);
};

const styleText = (style: SsreParams["style"]): string | undefined => {
    if (style == null) return undefined;
    if (typeof style === "string") return style;
    return Object.entries(style)
        .filter(([, v]) => v != null && v !== false)
        .map(([k, v]) => `${k.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`)}:${String(getValue(v))}`)
        .join(";");
};

const isBindable = (value: any): boolean => {
    if (value == null || isPrimitive(value) || typeof value === "function") return false;
    return hasValue(value) || isObservable(value);
};

const bindValue = (node: VNode, kind: VNode["bindings"][number]["kind"], value: any, name?: string): any => {
    if (isSsreSlot(value)) {
        const ctx = currentContext();
        if (value.side === "client") {
            const id = node.id ?? ctx.nextId();
            node.id = id;
            ctx.clientSlots.push({ name: value.name, id, kind, attr: name });
            const prev = node.dataset["ssre-client"];
            node.dataset["ssre-client"] = prev && prev !== value.name ? `${prev} ${value.name}` : value.name;
            const fallback = value.fallback;
            if (fallback == null) return "";
            return hasValue(fallback) ? getValue(fallback) : fallback;
        }
        const store = ctx.hub.stores.get(value.name) ?? ctx.hub.store(value.name, { value: "" });
        return bindValue(node, kind, store, name);
    }
    if (!isBindable(value)) return hasValue(value) ? getValue(value) : value;
    const ctx = currentContext();
    const store = ctx.hub.ensureNamed(value);
    const id = node.id ?? ctx.nextId();
    node.id = id;
    node.bindings.push({ id, kind, name, store, path: "value" });
    ctx.bindings.push({ id, kind, name, store, path: "value" });
    return getValue(value);
};

const flattenChildren = (children: any): Child[] => {
    if (children == null || children === false) return [];
    if (Array.isArray(children)) return children.flat(8) as Child[];
    return [children];
};

const resolveAction = (handler: any): string | null => {
    if (handler == null) return null;
    if (typeof handler === "string") return handler;
    if (typeof handler === "function") return currentContext().registerAction(handler);
    if (Array.isArray(handler)) {
        const fn = handler.find((item) => typeof item === "function" || typeof item === "string");
        return resolveAction(fn);
    }
    return null;
};

export const vnode = (partial: Partial<VNode> & { kind: VNode["kind"] }): VNode => ({
    [$ssre]: true,
    attrs: {},
    dataset: {},
    classList: [],
    children: [],
    bindings: [],
    events: [],
    ...partial,
});

export const T = (text: any): VNode => {
    if (isSsreSlot(text) || isBindable(text)) {
        const node = vnode({ kind: "element", tag: "span", children: [] });
        const current = bindValue(node, "text", text);
        node.children = [current == null ? "" : String(current)];
        return node;
    }
    return vnode({ kind: "text", children: [text == null ? "" : String(text)] });
};

export const E = (
    selector: string | symbol | ((params?: SsreParams, children?: any) => any),
    params: SsreParams = {},
    children?: any,
): VNode => {
    if (typeof selector === "function") return selector(params, children);
    if (typeof selector === "symbol") {
        return vnode({ kind: "fragment", children: flattenChildren(children) });
    }

    const parsed = parseTag(selector);
    const node = vnode({
        kind: "element",
        tag: parsed.tag,
        classList: asClassList(parsed.className ?? []),
        attrs: parsed.id ? { id: parsed.id } : {},
    });

    if (params.id != null) {
        const id = bindValue(node, "attr", params.id, "id");
        if (id != null) node.attrs.id = String(id);
    }
    node.classList.push(...asClassList(params.classList));
    if (params.style != null) {
        if (isBindable(params.style)) node.style = String(bindValue(node, "style", params.style) ?? "");
        else node.style = styleText(params.style);
    }
    const cssVars = params.css ?? params.vars;
    if (cssVars) {
        const decls = bindNodeCss(node, cssVars);
        node.style = node.style ? `${node.style};${decls}` : decls;
    }
    if (params.icon != null || (parsed.tag === "ui-icon" && (params.src != null || params.resource != null))) {
        const icon = bindValue(node, "attr", params.icon ?? params.name, "icon");
        if (icon != null) node.attrs.icon = String(icon);
        const resource = params.src ?? params.resource;
        if (resource != null) {
            const current = bindValue(node, "attr", resource, "resource");
            if (current != null) node.attrs.resource = String(current);
        }
    }
    if (params.attributes) {
        for (const [key, value] of Object.entries(params.attributes)) {
            const current = bindValue(node, "attr", value, key);
            if (current != null && current !== false) node.attrs[key] = String(current);
        }
    }
    if (params.dataset) {
        for (const [key, value] of Object.entries(params.dataset)) {
            const current = bindValue(node, "dataset", value, key);
            if (current != null) node.dataset[key] = String(current);
        }
    }
    if (params.aria) {
        for (const [key, value] of Object.entries(params.aria)) {
            const name = key.startsWith("aria-") ? key : `aria-${key}`;
            const current = bindValue(node, "attr", value, name);
            if (current != null) node.attrs[name] = String(current);
        }
    }

    for (const key of ["name", "type", "role", "slot", "part", "placeholder"] as const) {
        if (params[key] != null) {
            const current = bindValue(node, "attr", params[key], key);
            if (current != null) node.attrs[key] = String(current);
        }
    }
    if ("value" in params) {
        const current = bindValue(node, "value", params.value);
        if (current != null) node.attrs.value = String(current);
    }
    if ("checked" in params) {
        const current = bindValue(node, "checked", params.checked);
        if (current) node.attrs.checked = "";
    }
    if (params.hidden != null) {
        const current = bindValue(node, "attr", params.hidden, "hidden");
        if (current) node.attrs.hidden = "";
    }

    if (params.on) {
        const ctx = currentContext();
        for (const [event, handler] of Object.entries(params.on)) {
            const action = resolveAction(handler);
            if (!action) continue;
            const id = node.id ?? ctx.nextId("e");
            node.id = id;
            node.events.push({ id, event, action });
            ctx.events.push({ id, event, action });
        }
    }

    const list = flattenChildren(children);
    if (list.length === 1 && (isBindable(list[0]) || isSsreSlot(list[0])) && !list[0]?.[$ssre]) {
        const current = bindValue(node, "text", list[0]);
        node.children = [current == null ? "" : String(current)];
        return node;
    }
    node.children = list.map((child) => {
        if ((isBindable(child) || isSsreSlot(child)) && !child?.[$ssre]) return T(child);
        return child as Child;
    });
    return node;
};

export default E;
