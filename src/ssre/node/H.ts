/*
 * Filename: H.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/H.ts
 * FIND:ssre
 *
 * Tagged-template / HTML primitive. Parses via html-parse.ts (builtin).
 * Peer engines (jsdom / xmldom / node-html-parser) attach from html-dom.ts.
 */
import { isPrimitive } from "@fest-lib/core";
import { T, vnode } from "./E.ts";
import { fragmentToVNode, parseHtmlFragment } from "./html-parse.ts";
import { $raw, isVNode, type Child, type VNode } from "./types.ts";

const insideTag = (before: string): boolean => {
    const lt = before.lastIndexOf("<");
    const gt = before.lastIndexOf(">");
    return lt > gt;
};

const afterEquals = (before: string): boolean => /=\s*$/.test(before);

const compileTemplate = (strings: TemplateStringsArray | string[], values: any[]): { html: string; atb: any[]; psh: any[] } => {
    const parts: string[] = [];
    const atb: any[] = [];
    const psh: any[] = [];
    for (let i = 0; i < strings.length; i++) {
        parts.push(strings[i] || "");
        if (i >= values.length) continue;
        const before = parts.join("");
        const value = values[i];
        const quoted = /["']$/.test(before.trimEnd());
        if (insideTag(before) && (afterEquals(before) || quoted)) {
            parts.push(quoted ? `#{${atb.length}}` : `"#{${atb.length}}"`);
            atb.push(value);
        } else if (!insideTag(before)) {
            if (isPrimitive(value) && value != null) parts.push(String(value));
            else {
                parts.push(`<!--o:${psh.length}-->`);
                psh.push(value);
            }
        }
    }
    return { html: parts.join("").trim(), atb, psh };
};

export const html = (strings: TemplateStringsArray | string[], ...values: any[]): VNode => {
    const first = String(strings?.[0] ?? "").trim();
    const last = String(strings?.[strings.length - 1] ?? "").trim();
    if (first.startsWith("<") && last.endsWith(">")) {
        const compiled = compileTemplate(strings, values);
        return fragmentToVNode(parseHtmlFragment(compiled.html, compiled.atb, compiled.psh));
    }
    const children: Child[] = [];
    for (let i = 0; i < strings.length; i++) {
        if (strings[i]) children.push(T(strings[i]));
        if (i < values.length && values[i] != null) children.push(values[i]);
    }
    return vnode({ kind: "fragment", children });
};

export const H = (str: any, ...values: any[]): VNode | Child => {
    if (typeof str === "function") return H(str());
    if (Array.isArray(str) && values.length) return html(str, ...values);
    if (isVNode(str)) return str;
    if (typeof str === "string") {
        const trimmed = str.trim();
        if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
            return fragmentToVNode(parseHtmlFragment(trimmed));
        }
        return T(str);
    }
    return T(str);
};

export const raw = (htmlText: string): VNode => vnode({ kind: "raw", html: htmlText, [$raw]: true } as any);

export default H;
