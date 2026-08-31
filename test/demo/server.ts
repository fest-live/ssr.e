/*
 * Filename: server.ts
 * FullPath: modules/projects/ssr.e/test/demo/server.ts
 * FIND:ssre
 *
 * Minimal HTTP backend (no Fastify required). Fastify hosts use ssrePlugin instead.
 */
import { createServer } from "node:http";
import { createHub, handleChannelPost, renderPage } from "../../src/index.ts";
import { attachSse, readRequestBody } from "../../src/node.ts";
import { buildDemo } from "./page.ts";

const hub = createHub();
const channelPath = "/ssre/channel";
hub.channel = { url: channelPath, protocol: "sse" };

export const createDemoServer = (port = 5178) => {
    const server = createServer(async (req, res) => {
        const url = new URL(req.url || "/", "http://127.0.0.1");
        if (url.pathname === channelPath && req.method === "GET") {
            attachSse(hub, req, res);
            return;
        }
        if (url.pathname === channelPath && req.method === "POST") {
            const result = await handleChannelPost(hub, await readRequestBody(req));
            res.writeHead(result.ok ? 200 : 400, { "content-type": "application/json" });
            res.end(JSON.stringify(result));
            return;
        }
        if (url.pathname === "/" && req.method === "GET") {
            const html = renderPage({ ...buildDemo(hub), channel: { url: channelPath, protocol: "sse" } });
            res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
            res.end(html);
            return;
        }
        res.writeHead(404);
        res.end("not found");
    });
    return { server, hub, listen: () => new Promise<number>((resolve) => server.listen(port, "127.0.0.1", () => resolve(port))) };
};

if (import.meta.main || process.argv[1]?.endsWith("server.ts")) {
    const { listen } = createDemoServer(Number(process.env.PORT) || 5178);
    const port = await listen();
    console.log(`ssr.e demo http://127.0.0.1:${port}/`);
}
