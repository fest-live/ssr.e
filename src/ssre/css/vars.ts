/*
 * Filename: vars.ts
 * FullPath: modules/projects/ssr.e/src/ssre/css/vars.ts
 * FIND:ssre
 *
 * Proxied CSS custom-property reactivity via object.ts refs.
 */
import { getValue, hasValue } from "@fest-lib/core";
import { currentContext } from "../node/context.ts";
import { escapeHtml } from "../node/escape.ts";
import type { CssVarBinding, SsreScenario, TypedOmHint, VNode } from "../node/types.ts";
import type { ReactiveHub } from "../core/store.ts";
import { formatCssValue, normalizeVarName, typedOmMap } from "./typed-om.ts";

export interface CssVarOptions {
    host?: string;
    typed?: TypedOmHint;
    store?: string;
}

const valueOf = (value: any) => hasValue(value) ? getValue(value) : value;

export const registerCssVar = (name: string, value: any, options: CssVarOptions = {}, hub?: ReactiveHub): CssVarBinding => {
    const ctx = currentContext();
    const owner = hub ?? ctx.hub;
    const varName = normalizeVarName(name);
    const store = options.store ?? owner.ensureNamed(hasValue(value) || (value != null && typeof value === "object") ? value : { value });
    const binding: CssVarBinding = {
        name: varName,
        store,
        path: hasValue(value) ? "value" : "value",
        host: options.host ?? ":root",
        typed: options.typed,
    };
    owner.cssVar(binding);
    if (options.typed) owner.typedOm(varName, { type: options.typed, target: options.host });
    return binding;
};

export const cssVars = (
    vars: Record<string, any>,
    options: Omit<CssVarOptions, "typed"> & { typed?: Record<string, TypedOmHint> } = {},
    hub?: ReactiveHub,
): CssVarBinding[] => {
    const typed = options.typed ? typedOmMap(options.typed) : {};
    return Object.entries(vars).map(([name, value]) =>
        registerCssVar(name, value, { host: options.host, typed: typed[normalizeVarName(name)]?.type, store: options.store }, hub));
};

export const bindNodeCss = (node: VNode, vars: Record<string, any>): string => {
    const parts: string[] = [];
    const ctx = currentContext();
    const id = node.id ?? ctx.nextId();
    node.id = id;
    const host = `[data-ssre="${id}"]`;
    for (const [key, value] of Object.entries(vars)) {
        const binding = registerCssVar(key, value, { host });
        const current = formatCssValue(valueOf(value), binding.typed);
        parts.push(`${binding.name}:${current}`);
        ctx.bindings.push({ id, kind: "cssvar", name: binding.name, store: binding.store, path: binding.path, host });
        node.bindings.push({ id, kind: "cssvar", name: binding.name, store: binding.store, path: binding.path, host });
    }
    return parts.join(";");
};

export const emitCssBlock = (scenario: SsreScenario): string => {
    const vars = scenario.cssVars ?? [];
    if (!vars.length) return "";
    const groups = new Map<string, string[]>();
    for (const item of vars) {
        const snap = scenario.stores[item.store]?.snapshot;
        const value = snap != null && typeof snap === "object" && item.path && item.path in snap
            ? (snap as any)[item.path]
            : snap;
        const decl = `${item.name}:${escapeHtml(formatCssValue(value, item.typed))}`;
        const list = groups.get(item.host) ?? [];
        list.push(decl);
        groups.set(item.host, list);
    }
    const css = [...groups.entries()].map(([host, decls]) => `${host}{${decls.join(";")}}`).join("");
    return `<style id="ssre-css">${css}</style>`;
};
