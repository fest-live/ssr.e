/*
 * Filename: vanilla.ts
 * FullPath: modules/projects/ssr.e/src/ssre/css/vanilla.ts
 * FIND:ssre
 *
 * Vanilla CSS only. Optional css-tree parse if the peer is installed;
 * regex fallback never walks SCSS.
 */
import { normalizeVarName } from "./typed-om.ts";

const CUSTOM_PROP = /(--[A-Za-z_][\w-]*)\s*:/g;
const VAR_USE = /var\(\s*(--[A-Za-z_][\w-]*)/g;

export const extractCustomProperties = (css: string): string[] => {
    const names = new Set<string>();
    for (const match of css.matchAll(CUSTOM_PROP)) names.add(match[1]);
    for (const match of css.matchAll(VAR_USE)) names.add(match[1]);
    return [...names];
};

/** Inject current values as `var(--x, fallback)` so first paint matches the hub. */
export const applyCustomPropertyFallbacks = (css: string, values: Record<string, string>): string =>
    css.replace(/var\(\s*(--[A-Za-z_][\w-]*)(\s*,\s*[^)]+)?\)/g, (full, name: string, fallback?: string) => {
        const next = values[name] ?? values[normalizeVarName(name)];
        if (next == null) return full;
        return `var(${name}, ${next})`;
    });

export const isScssSource = (source: string): boolean =>
    /^\s*@(use|forward|import|mixin|include|extend|function|if|else|for|each|while)\b/m.test(source)
    || /\$[A-Za-z_-][\w-]*\s*:/.test(source);

/** Optional css-tree. Returns null when the peer is missing — callers keep the regex path. */
export const tryParseCssTree = async (css: string): Promise<any | null> => {
    try {
        const csstree = await import("css-tree");
        return csstree.parse(css, { parseValue: true });
    } catch {
        return null;
    }
};
