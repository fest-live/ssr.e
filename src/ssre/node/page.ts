/*
 * Filename: page.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/page.ts
 * FIND:ssre
 *
 * HTML document wrapper: body + scenario JSON + inline hydrate runtime.
 * Optional client scripts (LUR.E / FL-UI / app) attach after the scenario.
 */
import { runtimeScript } from "../client/hydrate.ts";
import { emitCssBlock } from "../css/vars.ts";
import { escapeHtml, escapeScriptJson } from "./escape.ts";
import { injectSsreIntoHtml, isHtmlDocument } from "./html-document.ts";
import { fragmentToVNode, parseHtmlFragment } from "./html-parse.ts";
import { renderToString, renderView, type RenderResult } from "./render.ts";
import type { Child } from "./types.ts";
import type { ReactiveHub } from "../core/store.ts";
import type { RenderContext } from "./context.ts";

export interface SsreReplyLike {
    type: (contentType: string) => SsreReplyLike;
    header?: (name: string, value: string) => SsreReplyLike;
    send: (payload: string) => any;
}

export interface PageOptions {
    title?: string;
    lang?: string;
    body?: Child | (() => Child) | RenderResult;
    head?: string;
    styles?: string[];
    scripts?: string[];
    hub?: ReactiveHub;
    channel?: { url: string; protocol?: "sse" | "ws" | "socket.io" };
    factory?: (ctx: RenderContext) => Child;
}

const styleTags = (hrefs: string[] = []): string =>
    hrefs.map((href) => `<link rel="stylesheet" href="${escapeHtml(href)}">`).join("");

const scriptTags = (srcs: string[] = []): string =>
    srcs.map((src) => `<script type="module" src="${escapeHtml(src)}"></script>`).join("");

export const renderPage = (options: PageOptions): string => {
    const rendered = options.factory
        ? renderView(options.factory, options.hub)
        : options.body && typeof options.body === "object" && "html" in options.body && "scenario" in options.body
            ? options.body as RenderResult
            : renderToString((options.body ?? "") as Child | (() => Child), options.hub);
    if (options.channel) rendered.scenario.channel = {
        url: options.channel.url,
        protocol: options.channel.protocol ?? "sse",
    };
    const title = escapeHtml(options.title ?? "SSR.E");
    return `<!doctype html>
<html lang="${escapeHtml(options.lang ?? "en")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${options.head ?? ""}
${styleTags(options.styles)}
${emitCssBlock(rendered.scenario)}
</head>
<body>
${rendered.html}
<script type="application/json" id="ssre-scenario">${escapeScriptJson(rendered.scenario)}</script>
<script>${runtimeScript()}</script>
${scriptTags(options.scripts)}
</body>
</html>`;
};

/** Existing HTML file: document stays the base; fragment is wrapped once. */
export const pageFromHtml = (html: string, options: PageOptions = {}): string => {
    if (isHtmlDocument(html)) {
        return injectSsreIntoHtml(html, {
            channelUrl: options.channel?.url,
            protocol: options.channel?.protocol,
        });
    }
    return renderPage({
        ...options,
        body: options.body ?? fragmentToVNode(parseHtmlFragment(html)),
    });
};

export const sendSsre = (reply: SsreReplyLike, page: string | PageOptions | RenderResult | Child | (() => Child), hub?: ReactiveHub) => {
    const html = typeof page === "string"
        ? pageFromHtml(page, { hub, channel: hub?.channel })
        : page && typeof page === "object" && "title" in page
            ? renderPage({ ...(page as PageOptions), hub: (page as PageOptions).hub ?? hub })
            : page && typeof page === "object" && "html" in page && "scenario" in page
                ? renderPage({ body: page as RenderResult, hub })
                : renderPage({ body: page as Child | (() => Child), hub });
    reply.type("text/html; charset=utf-8");
    reply.header?.("cache-control", "no-store");
    return reply.send(html);
};
