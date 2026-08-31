/*
 * Filename: html-parse.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/html-parse.ts
 * FIND:ssre
 *
 * Builtin HTML fragment tokenizer. No `node:` imports — H() and the public
 * barrel can load this in Vite's browser graph.
 */
import { E, vnode } from "./E.ts";
import { isVNode, VOID_TAGS, type Child } from "./types.ts";

export type HtmlParseEngine = "jsdom" | "xmldom" | "node-html-parser" | "builtin";

export type HtmlPeerParse = (html: string, atb: any[], psh: any[], engine: HtmlParseEngine) => Child[];

let peerParse: HtmlPeerParse | null = null;
let defaultEngine: HtmlParseEngine = "builtin";

/** html-dom.ts installs peer engines here; isomorphic H() stays builtin until then. */
export const setHtmlParseHook = (hook: { parse?: HtmlPeerParse | null; engine?: HtmlParseEngine } | null): void => {
    peerParse = hook?.parse ?? null;
    defaultEngine = hook?.engine ?? "builtin";
};

const decodeAttr = (value: string): string =>
    value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export const parseAttrs = (raw: string, atb: any[]): { attrs: Record<string, string>; bound: Array<{ name: string; value: any }> } => {
    const attrs: Record<string, string> = {};
    const bound: Array<{ name: string; value: any }> = [];
    const re = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))?/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(raw))) {
        const name = match[1];
        const value = match[2] ?? match[3] ?? match[4] ?? "";
        const placeholder = value.match(/^#\{(\d+)\}$/);
        if (placeholder) {
            bound.push({ name, value: atb[Number(placeholder[1])] });
            continue;
        }
        if (name) attrs[name] = decodeAttr(value);
    }
    return { attrs, bound };
};

export const elementFrom = (tag: string, attrs: Record<string, string>, bound: Array<{ name: string; value: any }>, children: Child[]) => {
    const className = attrs.class;
    delete attrs.class;
    const id = attrs.id;
    delete attrs.id;
    const style = attrs.style;
    delete attrs.style;
    const attributes = { ...attrs };
    for (const item of bound) {
        if (item.name === "class" || item.name === "classList") continue;
        attributes[item.name] = item.value;
    }
    const classBound = bound.find((item) => item.name === "class" || item.name === "classList");
    return E(
        id ? `${tag}#${id}` : tag,
        { attributes, classList: classBound ? classBound.value : className, style },
        children,
    );
};

export const parseBuiltin = (html: string, atb: any[] = [], psh: any[] = [], start = 0, stopTag: string | null = null): { nodes: Child[]; index: number } => {
    const nodes: Child[] = [];
    let i = start;
    while (i < html.length) {
        if (html.startsWith("</", i)) {
            const end = html.indexOf(">", i);
            const tag = html.slice(i + 2, end).trim().toLowerCase();
            if (stopTag && tag === stopTag) return { nodes, index: end + 1 };
            i = end < 0 ? html.length : end + 1;
            continue;
        }
        if (html.startsWith("<!--o:", i)) {
            const end = html.indexOf("-->", i);
            const index = Number(html.slice(i + 6, end));
            const value = psh[index];
            if (value != null && value !== false) nodes.push(value);
            i = end < 0 ? html.length : end + 3;
            continue;
        }
        if (html.startsWith("<!--", i)) {
            const end = html.indexOf("-->", i);
            i = end < 0 ? html.length : end + 3;
            continue;
        }
        if (html[i] === "<") {
            const end = html.indexOf(">", i);
            if (end < 0) break;
            const body = html.slice(i + 1, end).trim();
            const selfClose = body.endsWith("/");
            const parts = body.replace(/\/$/, "").match(/^([^\s]+)([\s\S]*)$/);
            const tag = (parts?.[1] || "div").toLowerCase();
            const { attrs, bound } = parseAttrs(parts?.[2] || "", atb);
            i = end + 1;
            let children: Child[] = [];
            if (!selfClose && !VOID_TAGS.has(tag)) {
                const nested = parseBuiltin(html, atb, psh, i, tag);
                children = nested.nodes;
                i = nested.index;
            }
            nodes.push(elementFrom(tag, attrs, bound, children));
            continue;
        }
        const next = html.indexOf("<", i);
        const text = html.slice(i, next < 0 ? html.length : next);
        if (text) nodes.push(text);
        if (next < 0) break;
        i = next;
    }
    return { nodes, index: i };
};

export const parseHtmlFragment = (html: string, atb: any[] = [], psh: any[] = [], engine: HtmlParseEngine = defaultEngine): Child[] => {
    if (engine !== "builtin" && peerParse) {
        try { return peerParse(html, atb, psh, engine); }
        catch { /* fall through to builtin */ }
    }
    return parseBuiltin(html, atb, psh).nodes;
};

export const fragmentToVNode = (nodes: Child[]) => {
    if (nodes.length === 1 && isVNode(nodes[0])) return nodes[0];
    return vnode({ kind: "fragment", children: nodes });
};
