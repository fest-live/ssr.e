/*
 * Filename: sockets.ts
 * FullPath: modules/projects/ssr.e/src/ssre/server/sockets.ts
 * FIND:ssre
 *
 * Optional socket hosts. Node's built-in WebSocket is a *client* only
 * (https://nodejs.org/learn/getting-started/websocket) — servers use
 * `ws`, `@fastify/websocket`, or socket.io.
 */
import type { Server as HttpServer } from "node:http";
import type { ReactiveHub } from "../core/store.ts";
import { parseChannelBody } from "./channel.ts";

const bindSocket = (hub: ReactiveHub, socket: { send?: Function; emit?: Function; on: Function }, event = "ssre") => {
    const off = hub.subscribe((msg) => {
        try {
            if (typeof socket.send === "function") socket.send(JSON.stringify(msg));
            else socket.emit?.(event, msg);
        } catch {}
    });
    const onData = (data: any) => {
        const msg = typeof data === "string" || Buffer.isBuffer(data)
            ? parseChannelBody(String(data))
            : data;
        if (msg && typeof msg.t === "string") hub.handle(msg);
    };
    socket.on("message", onData);
    socket.on(event, onData);
    socket.on("close", off);
    socket.on("disconnect", off);
    return off;
};

/** `@fastify/websocket` — `app.get(path, { websocket: true }, ...)`. */
export const attachFastifyWebsocket = (app: any, hub: ReactiveHub, path = "/ssre/channel") => {
    app.get(path, { websocket: true }, (socket: any) => bindSocket(hub, socket));
};

/** Dynamic `ws` WebSocketServer on an HTTP server. */
export const listenWithWs = async (hub: ReactiveHub, server: HttpServer, path = "/ssre/channel") => {
    const { WebSocketServer } = await import("ws");
    const wss = new WebSocketServer({ server, path });
    wss.on("connection", (socket: any) => bindSocket(hub, socket));
    return wss;
};

/** Dynamic `socket.io` Server. Event name is `ssre`. */
export const listenWithSocketIO = async (hub: ReactiveHub, server: HttpServer, options?: Record<string, any>) => {
    const { Server } = await import("socket.io");
    const io = new Server(server, { cors: { origin: true }, ...options });
    io.on("connection", (socket: any) => bindSocket(hub, socket, "ssre"));
    return io;
};

export { bindSocket };
