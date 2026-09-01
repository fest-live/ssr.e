/*
 * Filename: html-document.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/html-document.ts
 * FIND:ssre
 *
 * Existing HTML files are a first-class page base: full documents stay intact
 * (no second doctype). Fragments are described via pageOptionsFromHtml.
 */
import { escapeScriptJson } from "./escape.ts";
import { runtimeScript } from "../client/hydrate.ts";
import { fragmentToVNode, parseHtmlFragment } from "./html-parse.ts";
import type { PageOptions } from "./page.ts";

export interface InjectSsreOptions {
    channelUrl?: string;
    protocol?: "sse" | "ws" | "socket.io";
    scenario?: Record<string, unknown>;
    viteClient?: boolean;
}

const HTML_FILE_RE = /\.html?$/i;

export const isHtmlPageFile = (file = ""): boolean =>
    HTML_FILE_RE.test((file.split("?")[0] || "").trim());

/** Full documents (`<!doctype html>` / `<html>`) vs fragments. */
export const isHtmlDocument = (html = ""): boolean => {
    const start = html.trimStart();
    return /^<!doctype\s+html/i.test(start) || /^<html[\s>]/i.test(start);
};

const insertBeforeLast = (html: string, tag: string, block: string): string | null => {
    const idx = html.toLowerCase().lastIndexOf(tag.toLowerCase());
    if (idx < 0) return null;
    return html.slice(0, idx) + block + html.slice(idx);
};

/**
 * Inject ssre scenario + hydrate into an existing document. Idempotent.
 * INVARIANT: never wraps a second `<!doctype html>`.
 */
export const injectSsreIntoHtml = (html: string, options: InjectSsreOptions = {}): string => {
    let out = html;
    if (options.viteClient && !out.includes("/@vite/client")) {
        const tag = `<script type="module" src="/@vite/client"></script>\n`;
        out = insertBeforeLast(out, "</head>", tag) ?? `${tag}${out}`;
    }
    if (out.includes('id="ssre-scenario"')) return out;
    const scenario: Record<string, unknown> = { ...(options.scenario ?? {}) };
    if (options.channelUrl) {
        scenario.channel = { url: options.channelUrl, protocol: options.protocol ?? "sse" };
    }
    const block = `<script type="application/json" id="ssre-scenario">${escapeScriptJson(scenario)}</script>\n<script>${runtimeScript()}</script>\n`;
    return insertBeforeLast(out, "</body>", block)
        ?? insertBeforeLast(out, "</html>", block)
        ?? `${out}\n${block}`;
};

/** Map an existing HTML file (document or fragment) onto PageOptions without inventing a shell. */
export const pageOptionsFromHtml = (html: string): PageOptions => {
    if (!isHtmlDocument(html)) {
        return { body: fragmentToVNode(parseHtmlFragment(html)) };
    }
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim();
    const lang = html.match(/<html\b[^>]*\slang\s*=\s*["']([^"']+)["']/i)?.[1];
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
    const bodyInner = html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
    return {
        ...(title ? { title } : {}),
        ...(lang ? { lang } : {}),
        ...(head ? { head } : {}),
        body: fragmentToVNode(parseHtmlFragment(bodyInner)),
    };
};
