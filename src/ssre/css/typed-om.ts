/*
 * Filename: typed-om.ts
 * FullPath: modules/projects/ssr.e/src/ssre/css/typed-om.ts
 * FIND:ssre
 *
 * Typed OM is a frontend apply map. SSR.E only serializes hint + value;
 * the client uses CSS.px / attributeStyleMap when the browser has Typed OM.
 * INVARIANT: vanilla CSS custom properties only — no SCSS.
 */
import type { TypedOmEntry, TypedOmHint } from "../node/types.ts";

export type { TypedOmEntry, TypedOmHint };

const UNIT: Record<string, string> = {
    px: "px",
    percent: "%",
    length: "px",
};

export const normalizeVarName = (name: string): string =>
    name.startsWith("--") ? name : `--${name.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`)}`;

export const formatCssValue = (value: any, typed?: TypedOmHint | TypedOmEntry | null): string => {
    if (value == null) return "";
    const hint = typeof typed === "string" ? typed : typed?.type;
    if (hint === "px" || hint === "length") return `${Number(value) || 0}px`;
    if (hint === "percent") return `${Number(value) || 0}%`;
    if (hint === "number") return String(Number(value) || 0);
    return String(value);
};

export const typedOmMap = (entries: Record<string, TypedOmHint | TypedOmEntry>): Record<string, TypedOmEntry> => {
    const out: Record<string, TypedOmEntry> = {};
    for (const [key, value] of Object.entries(entries)) {
        const name = normalizeVarName(key);
        out[name] = typeof value === "string" ? { type: value } : { type: value.type, target: value.target };
    }
    return out;
};

export const cssUnitOf = (typed?: TypedOmHint): string => UNIT[typed ?? ""] ?? "";
