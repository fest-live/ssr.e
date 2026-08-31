/*
 * Filename: html-dom.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/html-dom.ts
 * FIND:ssre
 *
 * Optional HTML/XML documents for H(): jsdom, @xmldom/xmldom, node-html-parser.
 * Builtin tokenizer stays the default when no peer is installed.
 *
 * INVARIANT: this file is Node-only (`node:module`). H() imports html-parse.ts.
 */
import { createRequire } from "node:module";
import { elementFrom, parseAttrs, parseBuiltin, setHtmlParseHook, type HtmlParseEngine } from "./html-parse.ts";
import type { Child } from "./types.ts";

export type HtmlEngine = HtmlParseEngine;
export { parseBuiltin, fragmentToVNode } from "./html-parse.ts";

const ELEMENT = 1;
const TEXT = 3;
const COMMENT = 8;

const req = (() => {
    try { return createRequire(import.meta.url); }
    catch { return null; }
})();

const tryLoad = (id: string): any | null => {
    try { return req?.(id) ?? null; } catch { return null; }
};

let preferred: HtmlEngine | null = null;

export const availableHtmlEngines = (): HtmlEngine[] => {
    const found: HtmlEngine[] = ["builtin"];
    if (tryLoad("jsdom")) found.push("jsdom");
    if (tryLoad("@xmldom/xmldom")) found.push("xmldom");
    if (tryLoad("node-html-parser")) found.push("node-html-parser");
    return found;
};

/** Default is builtin. Opt in with setHtmlEngine() or SSRE_HTML_ENGINE — do not auto-pick jsdom. */
export const detectHtmlEngine = (): HtmlEngine => {
    if (preferred) return preferred;
    const fromEnv = process.env.SSRE_HTML_ENGINE as HtmlEngine | undefined;
    if (fromEnv && availableHtmlEngines().includes(fromEnv)) return fromEnv;
    return "builtin";
};

const attrMap = (el: any, atb: any[]): { attrs: Record<string, string>; bound: Array<{ name: string; value: any }> } => {
    const attrs: Record<string, string> = {};
    const bound: Array<{ name: string; value: any }> = [];
    const list = el.attributes;
    if (!list) return { attrs, bound };
    const length = list.length ?? 0;
    for (let i = 0; i < length; i++) {
        const item = list[i] ?? list.item?.(i);
        const name = item?.name ?? item?.key;
        const value = String(item?.value ?? "");
        if (!name) continue;
        const placeholder = value.match(/^#\{(\d+)\}$/);
        if (placeholder) bound.push({ name, value: atb[Number(placeholder[1])] });
        else attrs[name] = value;
    }
    if (!length && typeof el.getAttribute === "function" && el.rawAttrs) {
        return parseAttrs(String(el.rawAttrs), atb);
    }
    return { attrs, bound };
};

const walkDom = (node: any, atb: any[], psh: any[]): Child[] => {
    if (!node) return [];
    const type = node.nodeType;
    if (type === COMMENT || node.nodeName === "#comment") {
        const text = String(node.nodeValue ?? node.data ?? node.rawText ?? "");
        if (text.trim().startsWith("o:")) {
            const value = psh[Number(text.trim().slice(2))];
            return value != null && value !== false ? [value] : [];
        }
        return [];
    }
    if (type === TEXT || node.nodeName === "#text") {
        const text = String(node.nodeValue ?? node.data ?? node.rawText ?? "");
        return text ? [text] : [];
    }
    if (type !== ELEMENT && node.nodeName?.[0] === "#") return [];
    const tag = String(node.nodeName || node.rawTagName || "div").toLowerCase();
    if (tag === "html" || tag === "head") return [];
    const kids = Array.from(node.childNodes ?? node.childNodes ?? []);
    const children = kids.flatMap((child) => walkDom(child, atb, psh));
    if (tag === "body" || tag === "fragment" || tag === "#document-fragment") return children;
    const { attrs, bound } = attrMap(node, atb);
    return [elementFrom(tag, attrs, bound, children)];
};

const rootsFromJsdom = (html: string): any[] => {
    const { JSDOM } = tryLoad("jsdom");
    const dom = new JSDOM(`<!doctype html><body>${html}</body>`);
    return Array.from(dom.window.document.body.childNodes);
};

const rootsFromXmldom = (html: string): any[] => {
    const { DOMParser } = tryLoad("@xmldom/xmldom");
    const doc = new DOMParser().parseFromString(`<fragment>${html}</fragment>`, "text/xml");
    const root = doc.documentElement;
    return Array.from(root?.childNodes ?? []);
};

const rootsFromNodeHtml = (html: string): any[] => {
    const { parse } = tryLoad("node-html-parser");
    const root = parse(html, { comment: true });
    return Array.from(root.childNodes ?? []);
};

const parseWithPeers = (html: string, atb: any[], psh: any[], engine: HtmlEngine): Child[] => {
    if (engine === "builtin") return parseBuiltin(html, atb, psh).nodes;
    try {
        const roots = engine === "jsdom" ? rootsFromJsdom(html)
            : engine === "xmldom" ? rootsFromXmldom(html)
            : rootsFromNodeHtml(html);
        return roots.flatMap((node) => walkDom(node, atb, psh));
    } catch {
        return parseBuiltin(html, atb, psh).nodes;
    }
};

export const parseHtmlFragment = (html: string, atb: any[] = [], psh: any[] = [], engine: HtmlEngine = detectHtmlEngine()): Child[] =>
    parseWithPeers(html, atb, psh, engine);

const applyParseHook = (): void => {
    setHtmlParseHook({ engine: detectHtmlEngine(), parse: parseWithPeers });
};

export const setHtmlEngine = (engine: HtmlEngine | null): void => {
    preferred = engine;
    applyParseHook();
};

applyParseHook();

export interface HtmlDocumentHandle {
    engine: HtmlEngine;
    document?: any;
    window?: any;
    serialize: () => string;
}

/** Full document when a peer is present; builtin returns a serialize-only stub. */
export const createHtmlDocument = (html = "<!doctype html><html><body></body></html>", engine: HtmlEngine = detectHtmlEngine()): HtmlDocumentHandle => {
    if (engine === "jsdom") {
        const jsdom = tryLoad("jsdom");
        if (jsdom) {
            const dom = new jsdom.JSDOM(html);
            return { engine, window: dom.window, document: dom.window.document, serialize: () => dom.serialize() };
        }
    }
    if (engine === "xmldom") {
        const xmldom = tryLoad("@xmldom/xmldom");
        if (xmldom) {
            const document = new xmldom.DOMParser().parseFromString(html, "text/xml");
            return {
                engine,
                document,
                serialize: () => new xmldom.XMLSerializer().serializeToString(document),
            };
        }
    }
    if (engine === "node-html-parser") {
        const nhp = tryLoad("node-html-parser");
        if (nhp) {
            const document = nhp.parse(html, { comment: true });
            return { engine, document, serialize: () => document.toString() };
        }
    }
    return { engine: "builtin", serialize: () => html };
};
