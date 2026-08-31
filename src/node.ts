/*
 * Filename: node.ts
 * FullPath: modules/projects/ssr.e/src/node.ts
 * FIND:ssre
 *
 * Node-only public surface. Imports `node:fs` / `node:http` / `node:module`.
 * Browsers and the Vite demo client must use `src/index.ts` or `./client`.
 */
export * from "./index.ts";
export { availableHtmlEngines, createHtmlDocument, detectHtmlEngine, setHtmlEngine } from "./ssre/node/html-dom.ts";
export type { HtmlDocumentHandle, HtmlEngine } from "./ssre/node/html-dom.ts";
export { createFsRoot } from "./ssre/fs/backend.ts";
export type { FsRoot } from "./ssre/fs/backend.ts";
export { resizeImageBuffer } from "./ssre/assets/canvas.ts";
export type { ResizeImageOptions } from "./ssre/assets/canvas.ts";
export {
    attachFastifyWebsocket,
    attachSse,
    attachSocketIO,
    attachWebSocketServer,
    hubAsUniformTarget,
    listenWithSocketIO,
    listenWithWs,
    readRequestBody,
} from "./ssre/server/channel.ts";
export { ssrePlugin } from "./ssre/server/fastify.ts";
export type { SsrePluginOptions, SsreReplyLike } from "./ssre/server/fastify.ts";
export { ssreVite } from "./ssre/vite/plugin.ts";
export type { SsreViteOptions } from "./ssre/vite/plugin.ts";
