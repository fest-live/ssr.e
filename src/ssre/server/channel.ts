/*
 * Filename: channel.ts
 * FullPath: modules/projects/ssr.e/src/ssre/server/channel.ts
 * FIND:ssre
 * TAG:ssre,channel
 *
 * Reactive hub transport: SSE + POST by default, optional WebSocket / socket.io.
 * uniform.ts can wrap the same message shape (`createWebSocketTransport`).
 */
import { IncomingMessage, ServerResponse } from "node:http";
import type { ChannelMessage } from "../node/types.ts";
import type { ReactiveHub } from "../core/store.ts";
import { encodeSse, parseChannelBody } from "./protocol.ts";

export { encodeSse, handleChannelPost, parseChannelBody } from "./protocol.ts";

export const attachSse = (hub: ReactiveHub, req: IncomingMessage, res: ServerResponse): void => {
    res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no",
    });
    res.flushHeaders?.();
    const scenario = hub.lastScenario ?? {
        version: 1 as const,
        ...hub.toScenario(),
        bindings: [],
        events: [],
        mapped: [],
    };
    res.write(encodeSse({ t: "hello", scenario }));
    const off = hub.subscribe((msg) => res.write(encodeSse(msg)));
    req.on("close", off);
};

export const readRequestBody = (req: IncomingMessage): Promise<string> =>
    new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        req.on("error", reject);
    });

/** Optional `ws` WebSocketServer — loaded only when the caller has `ws` installed. */
export const attachWebSocketServer = async (hub: ReactiveHub, wss: { on: Function }): Promise<void> => {
    wss.on("connection", (socket: { send: (data: string) => void; on: Function }) => {
        const off = hub.subscribe((msg) => {
            try { socket.send(JSON.stringify(msg)); } catch {}
        });
        socket.on("message", (data: any) => {
            const msg = parseChannelBody(String(data));
            if (msg) hub.handle(msg);
        });
        socket.on("close", off);
    });
};

/** Optional socket.io Server — same message event `ssre`. */
export const attachSocketIO = (hub: ReactiveHub, io: { on: Function }): void => {
    io.on("connection", (socket: { emit: Function; on: Function }) => {
        const off = hub.subscribe((msg) => socket.emit("ssre", msg));
        socket.on("ssre", (data: any) => {
            const msg = typeof data === "string" ? parseChannelBody(data) : data;
            if (msg && typeof msg.t === "string") hub.handle(msg);
        });
        socket.on("disconnect", off);
    });
};

/** Duck-typed target so uniform `createWebSocketTransport` / proxies can share the hub. */
export const hubAsUniformTarget = (hub: ReactiveHub) => {
    const listeners = new Set<(ev: { data: ChannelMessage }) => void>();
    hub.subscribe((msg) => {
        for (const listener of listeners) listener({ data: msg });
    });
    return {
        send(msg: ChannelMessage) { hub.handle(msg); },
        postMessage(msg: ChannelMessage) { hub.handle(msg); },
        addEventListener(_type: string, listener: (ev: { data: ChannelMessage }) => void) { listeners.add(listener); },
        removeEventListener(_type: string, listener: (ev: { data: ChannelMessage }) => void) { listeners.delete(listener); },
    };
};

export { attachFastifyWebsocket, listenWithSocketIO, listenWithWs } from "./sockets.ts";
