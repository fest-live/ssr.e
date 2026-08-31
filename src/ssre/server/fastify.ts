/*
 * Filename: fastify.ts
 * FullPath: modules/projects/ssr.e/src/ssre/server/fastify.ts
 * FIND:ssre
 *
 * Default backend adapter. Fastify is a peer — this file is duck-typed so tests
 * and other servers can reuse the same reply helper.
 */
import { renderPage, sendSsre, type PageOptions, type SsreReplyLike } from "../node/page.ts";
import { renderToString, renderView } from "../node/render.ts";
import { createHub, type ReactiveHub } from "../core/store.ts";
import { attachSse, handleChannelPost, readRequestBody } from "./channel.ts";
import { attachFastifyWebsocket } from "./sockets.ts";

export { sendSsre } from "../node/page.ts";

export interface SsrePluginOptions {
    hub?: ReactiveHub;
    prefix?: string;
    channel?: boolean | { path?: string; protocol?: "sse" | "ws" | "socket.io" };
}

export type { SsreReplyLike } from "../node/page.ts";

export const ssrePlugin = (options: SsrePluginOptions = {}) => {
    const hub = options.hub ?? createHub();
    const prefix = options.prefix ?? "/ssre";
    const channelEnabled = options.channel !== false;
    const channelPath = typeof options.channel === "object" && options.channel.path
        ? options.channel.path
        : `${prefix}/channel`;
    const protocol = typeof options.channel === "object" ? options.channel.protocol ?? "sse" : "sse";
    hub.channel = { url: channelPath, protocol };

    return async function ssre(app: any) {
        app.decorateReply?.("ssre", function (this: SsreReplyLike, page: any) {
            return sendSsre(this, page, hub);
        });
        app.decorate?.("ssreHub", hub);

        if (!channelEnabled) return;

        if (protocol === "ws") {
            try { attachFastifyWebsocket(app, hub, channelPath); }
            catch { /* @fastify/websocket not registered — SSE still below */ }
        }

        app.get?.(channelPath, async (request: any, reply: any) => {
            const req = request.raw ?? request;
            const res = reply.raw ?? reply;
            attachSse(hub, req, res);
            reply.hijack?.();
        });

        app.post?.(channelPath, async (request: any, reply: any) => {
            const raw = typeof request.body === "string"
                ? request.body
                : request.body != null
                    ? JSON.stringify(request.body)
                    : await readRequestBody(request.raw ?? request);
            const result = await handleChannelPost(hub, typeof request.body === "object" && request.body ? JSON.stringify(request.body) : raw);
            reply.type?.("application/json");
            return result;
        });
    };
};

export { createHub, renderPage, renderToString, renderView };
export type { PageOptions, ReactiveHub };
