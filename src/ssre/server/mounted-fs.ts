/*
 * Filename: mounted-fs.ts
 * FullPath: modules/projects/ssr.e/src/ssre/server/mounted-fs.ts
 * FIND:mounted-fs
 * TAG:ssre
 *
 * Expose `MountedFs` over HTTPS, WebSocket, and Socket.IO.
 * WHY: Explorer `/assets/` and SSR hosts need a real directory listing, not
 * only same-origin fetch. HTTPS is the fallback; WS / Socket.IO are preferred.
 */

import type { Server as HttpServer } from "node:http";
import {
    MOUNTED_FS_EVENT,
    MOUNTED_FS_HTTP_PATH,
    MOUNTED_FS_WS_PATH,
    createMountedFsId,
    isMountedFsRequest,
    type MountedFsRequest
} from "@fest-lib/core";
import type { MountedFs } from "../fs/mounts.ts";
import { handleMountedFsMessage } from "../fs/mounts.ts";
import { readRequestBody } from "./channel.ts";

export type AttachMountedFsOptions = {
    httpPath?: string;
    wsPath?: string;
    event?: string;
    http?: boolean;
    ws?: boolean;
    socketio?: boolean;
};

const bindSocketFs = (
    mounted: MountedFs,
    socket: { send?: Function; emit?: Function; on: Function },
    event = MOUNTED_FS_EVENT
) => {
    const reply = (msg: unknown) => {
        try {
            if (typeof socket.send === "function") socket.send(JSON.stringify(msg));
            else socket.emit?.(event, msg);
        } catch { /* closed */ }
    };
    const onData = async (data: any, ack?: Function) => {
        const result = await handleMountedFsMessage(mounted, data);
        if (!result) return;
        if (typeof ack === "function") ack(result);
        else reply(result);
    };
    socket.on("message", onData);
    socket.on(event, onData);
};

export const attachMountedFsHttp = (app: any, mounted: MountedFs, path = MOUNTED_FS_HTTP_PATH): void => {
    const handlePost = async (request: any, reply: any) => {
        const raw = typeof request.body === "string"
            ? request.body
            : request.body != null
                ? request.body
                : await readRequestBody(request.raw ?? request);
        const parsed = typeof raw === "string"
            ? (() => { try { return JSON.parse(raw); } catch { return null; } })()
            : raw;
        const req: MountedFsRequest = isMountedFsRequest(parsed)
            ? parsed
            : {
                t: "fs",
                id: createMountedFsId(),
                op: (parsed?.op || "list") as MountedFsRequest["op"],
                path: parsed?.path
            };
        const result = await mounted.handle(req);
        reply.type?.("application/json");
        return result;
    };
    app.post?.(path, handlePost);
    app.get?.(path, async (request: any, reply: any) => {
        const query = request.query ?? {};
        const op = String(query.op || (query.path ? "list" : "mounts")) as MountedFsRequest["op"];
        const result = await mounted.handle({
            t: "fs",
            id: createMountedFsId(),
            op,
            path: query.path
        });
        reply.type?.("application/json");
        return result;
    });
};

export const attachMountedFsWebsocket = (app: any, mounted: MountedFs, path = MOUNTED_FS_WS_PATH): void => {
    app.get(path, { websocket: true }, (socket: any) => bindSocketFs(mounted, socket));
};

export const listenMountedFsWs = async (
    mounted: MountedFs,
    server: HttpServer,
    path = MOUNTED_FS_WS_PATH
) => {
    const { WebSocketServer } = await import("ws");
    const wss = new WebSocketServer({ server, path });
    wss.on("connection", (socket: any) => bindSocketFs(mounted, socket));
    return wss;
};

export const listenMountedFsSocketIO = async (
    mounted: MountedFs,
    server: HttpServer,
    options?: Record<string, any>
) => {
    const { Server } = await import("socket.io");
    const io = new Server(server, { cors: { origin: true }, ...options });
    io.on("connection", (socket: any) => bindSocketFs(mounted, socket, MOUNTED_FS_EVENT));
    return io;
};

export const attachMountedFs = (app: any, mounted: MountedFs, options: AttachMountedFsOptions = {}): void => {
    const httpPath = options.httpPath ?? MOUNTED_FS_HTTP_PATH;
    const wsPath = options.wsPath ?? MOUNTED_FS_WS_PATH;
    if (options.http !== false) attachMountedFsHttp(app, mounted, httpPath);
    if (options.ws !== false) {
        let wsAttached = false;
        try {
            attachMountedFsWebsocket(app, mounted, wsPath);
            wsAttached = true;
        } catch { /* @fastify/websocket not registered */ }
        app.addHook?.("onListen", async () => {
            const server = app.server;
            if (!server) return;
            if (!wsAttached) {
                try { await listenMountedFsWs(mounted, server, wsPath); }
                catch { /* ws missing */ }
            }
            if (options.socketio === true) {
                try { await listenMountedFsSocketIO(mounted, server); }
                catch { /* socket.io missing */ }
            }
        });
    }
};
