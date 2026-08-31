/*
 * Filename: plugin.ts
 * FullPath: modules/projects/ssr.e/src/ssre/vite/plugin.ts
 * FIND:ssre
 *
 * Vite middleware: SSR-load page modules and serve HTML. Channel is SSE + POST
 * on the same Vite server so `npm run demo` works without Fastify.
 */
import { ssre } from "../core/namespace.ts";
import { renderPage, type PageOptions } from "../node/page.ts";
import { createHub, type ReactiveHub } from "../core/store.ts";
import { attachSse, handleChannelPost, readRequestBody } from "../server/channel.ts";

export interface SsreViteOptions {
    pages?: Record<string, string>;
    hub?: ReactiveHub;
    channelPath?: string;
}

const pathOf = (url = "/"): string => {
    try { return new URL(url, "http://ssre.local").pathname; }
    catch { return url.split("?")[0] || "/"; }
};

const toHtml = async (mod: any, hub: ReactiveHub, channelUrl: string): Promise<string> => {
    const page = typeof mod?.default === "function" ? await mod.default({ hub }) : mod?.default ?? mod?.page;
    if (typeof page === "string") return page;
    if (page && typeof page === "object" && ("title" in page || "body" in page || "factory" in page)) {
        return renderPage({ ...(page as PageOptions), hub: (page as PageOptions).hub ?? hub, channel: { url: channelUrl, protocol: "sse" } });
    }
    return renderPage({ body: page, hub, channel: { url: channelUrl, protocol: "sse" } });
};

const injectViteClient = (html: string): string =>
    html.includes("/@vite/client")
        ? html
        : html.replace("</head>", `<script type="module" src="/@vite/client"></script>\n</head>`);

const pageFile = (pages: Record<string, string>, pathname: string): string | undefined =>
    pages[pathname] ?? (pathname === "/index.html" ? pages["/"] : undefined);

export const ssreVite = (options: SsreViteOptions = {}): any => {
    const hub = options.hub ?? createHub();
    ssre.attach(hub);
    const pages = options.pages ?? {};
    const channelPath = options.channelPath ?? "/ssre/channel";
    hub.channel = { url: channelPath, protocol: "sse" };

    return {
        name: "ssre",
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
                    const mod = await server.ssrLoadModule(file);
                    const html = injectViteClient(await toHtml(mod, hub, channelPath));
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
