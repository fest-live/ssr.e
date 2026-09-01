/*
 * Filename: plugin.ts
 * FullPath: modules/projects/ssr.e/src/ssre/vite/plugin.ts
 * FIND:ssre
 *
 * Vite middleware: HTML files as document base, or SSR-load JS page modules.
 * Channel is SSE + POST on the same Vite server (dev). Does not bind :8434.
 */
import { readFile } from "node:fs/promises";
import { ssre } from "../core/namespace.ts";
import { pageFromHtml, renderPage, type PageOptions } from "../node/page.ts";
import { injectSsreIntoHtml, isHtmlPageFile } from "../node/html-document.ts";
import { createHub, type ReactiveHub } from "../core/store.ts";
import { attachSse, handleChannelPost, readRequestBody } from "../server/channel.ts";

export interface SsreViteOptions {
    pages?: Record<string, string>;
    htmlPages?: Record<string, string>;
    /** Default true: keep existing HTML documents; inject scenario via transformIndexHtml. */
    htmlAsBase?: boolean;
    hub?: ReactiveHub;
    channelPath?: string;
    /** Default false — Capacitor / VDS HTML must not grow a stray EventSource. */
    injectOnBuild?: boolean;
}

const pathOf = (url = "/"): string => {
    try { return new URL(url, "http://ssre.local").pathname; }
    catch { return url.split("?")[0] || "/"; }
};

const toHtml = async (mod: any, hub: ReactiveHub, channelUrl: string): Promise<string> => {
    const page = typeof mod?.default === "function" ? await mod.default({ hub }) : mod?.default ?? mod?.page;
    if (typeof page === "string") return pageFromHtml(page, { hub, channel: { url: channelUrl, protocol: "sse" } });
    if (page && typeof page === "object" && ("title" in page || "body" in page || "factory" in page)) {
        return renderPage({ ...(page as PageOptions), hub: (page as PageOptions).hub ?? hub, channel: { url: channelUrl, protocol: "sse" } });
    }
    return renderPage({ body: page, hub, channel: { url: channelUrl, protocol: "sse" } });
};

const injectViteClient = (html: string): string =>
    injectSsreIntoHtml(html, { viteClient: true });

const pageFile = (pages: Record<string, string>, pathname: string): string | undefined =>
    pages[pathname] ?? (pathname === "/index.html" ? pages["/"] : undefined);

export const ssreVite = (options: SsreViteOptions = {}): any => {
    const hub = options.hub ?? createHub();
    ssre.attach(hub);
    const htmlAsBase = options.htmlAsBase !== false;
    const pages = { ...(options.pages ?? {}), ...(options.htmlPages ?? {}) };
    const channelPath = options.channelPath ?? "/ssre/channel";
    hub.channel = { url: channelPath, protocol: "sse" };
    let command: string = "serve";

    return {
        name: "ssre",
        configResolved(config: { command?: string }) {
            command = config.command ?? "serve";
        },
        transformIndexHtml: {
            order: "post",
            handler(html: string) {
                if (!htmlAsBase) return html;
                if (command !== "serve" && !options.injectOnBuild) return html;
                return injectSsreIntoHtml(html, { channelUrl: channelPath, protocol: "sse" });
            },
        },
        configureServer(server: any) {
            server.middlewares.use(async (req: any, res: any, next: () => void) => {
                const pathname = pathOf(req.url || "/");
                if (pathname === channelPath) {
                    if (req.method === "GET") {
                        attachSse(hub, req, res);
                        return;
                    }
                    if (req.method === "POST") {
                        const raw = await readRequestBody(req);
                        const result = await handleChannelPost(hub, raw);
                        res.statusCode = result.ok ? 200 : 400;
                        res.setHeader("content-type", "application/json");
                        res.end(JSON.stringify(result));
                        return;
                    }
                }
                const file = pageFile(pages, pathname);
                if (!file || (req.method !== "GET" && req.method !== "HEAD")) return next();
                try {
                    let html: string;
                    if (isHtmlPageFile(file)) {
                        const raw = await readFile(file, "utf8");
                        const url = req.originalUrl || req.url || pathname;
                        html = await server.transformIndexHtml(url, raw);
                        if (!htmlAsBase) {
                            html = pageFromHtml(html, { hub, channel: { url: channelPath, protocol: "sse" } });
                        }
                    } else {
                        const mod = await server.ssrLoadModule(file);
                        html = injectViteClient(await toHtml(mod, hub, channelPath));
                    }
                    res.statusCode = 200;
                    res.setHeader("content-type", "text/html; charset=utf-8");
                    res.end(req.method === "HEAD" ? "" : html);
                } catch (error) {
                    server.ssrFixStacktrace?.(error);
                    console.error("[ssre]", error);
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader("content-type", "text/plain; charset=utf-8");
                        res.end(String((error as Error)?.stack || error));
                    }
                }
            });
        },
    };
};
