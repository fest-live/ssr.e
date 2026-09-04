**@fest-lib/ssre API Documentation v0.1.9**

***

# ssr.e

Backend-first sibling of [LUR.E](_media/lur.e). Same `H` / `E` / `M` ideas and `object.ts` refs, but it renders **HTML on the server** with a scripted reactive scenario — no DOM, overlays, drag, or other client-only LUR.E features.

Optional frontend: load LUR.E / FL-UI / app modules after the page. Live updates go through SSE (default), WebSocket, or socket.io; the envelope is the same shape `uniform.ts` already proxies.

Default host is **Fastify**. Vite is supported via `ssreVite()` (`npm run demo`).

## Layer

```
core → object / uniform → ssre          (backend)
                         ↘ lure / …     (optional client, after HTML)
```

`ssr.e` must not import `lur.e` or `dom.ts`.

## Render

```ts
import { E, M, createHub, numberRef, observe, renderPage } from "@fest-lib/ssre";

const hub = createHub();
const count = hub.store("count", numberRef(0));
hub.action("inc", () => { count.value += 1; });

const html = renderPage({
  title: "SSR.E",
  hub,
  channel: { url: "/ssre/channel", protocol: "sse" },
  factory: () => E("main", {}, [
    E("p", {}, ["Count: ", count]),
    E("button", { on: { click: "inc" } }, "+1"),
    M(hub.store("items", observe(["a"])), (item) => E("li", {}, item)),
  ]),
});
```

The document includes `#ssre-scenario` JSON and an inline hydrate script. Bindings stay live without LUR.E.

## Fastify

```ts
import Fastify from "fastify";
import { createHub, ssrePlugin, numberRef, E } from "@fest-lib/ssre";

const hub = createHub();
const count = hub.store("count", numberRef(0));
hub.action("inc", () => { count.value += 1; });

const app = Fastify();
await app.register(ssrePlugin({ hub }));
app.get("/", (_, reply) => reply.ssre({
  title: "SSR.E",
  factory: () => E("p", {}, ["Count: ", count]),
}));
```

`GET /ssre/channel` is SSE. `POST /ssre/channel` applies `{ t: "set" | "action", ... }`.

Sockets (optional peers): [`ws`](https://www.npmjs.com/package/ws), [`@fastify/websocket`](https://www.npmjs.com/package/@fastify/websocket), [socket.io](https://socket.io/) / [socket.io-client](https://www.npmjs.com/package/socket.io-client). Node's built-in [`WebSocket`](https://nodejs.org/learn/getting-started/websocket) is a **client** only. Helpers: `listenWithWs`, `listenWithSocketIO`, `attachFastifyWebsocket`. `hubAsUniformTarget(hub)` is a duck-typed port for `uniform.ts`.

## CSS (vanilla only)

Reactivity is proxied `object.ts` refs → **CSS custom properties**. No SCSS. Optional [css-tree](https://github.com/csstree/csstree) parse if installed.

```ts
cssVars({ "--pad": padRef }, { typed: { "--pad": "px" } }, hub);
E("div", { css: { accent: colorRef } }, "…");
```

The page emits `#ssre-css`. The client applies `style.setProperty` and, when present, Typed OM (`CSS.px` / `attributeStyleMap`) from the `typedOm` map.

## Icons, images, FS

- `Icon({ icon, src })` emits `<ui-icon>` (name / resource path). Drawing is client `@fest-lib/icon`.
- `picture(src, { widths })` writes `srcset` (`file-640w.jpg` or `?w=`). Optional resize: `@napi-rs/canvas` or `canvas` via `resizeImageBuffer`.
- `createFsRoot(dir)` is the backend analog of LUR.E OPFS (`@fest-lib/ssre/fs`). Paths cannot leave `root`.
- `H` defaults to the builtin tokenizer. Opt into [jsdom](https://github.com/jsdom/jsdom), [`@xmldom/xmldom`](https://www.npmjs.com/package/@xmldom/xmldom), or [node-html-parser](https://github.com/taoqf/node-html-parser) via `setHtmlEngine("jsdom")` or `SSRE_HTML_ENGINE`. `createHtmlDocument()` returns the peer document + `serialize()`.

## Vite

```ts
import { ssreVite } from "@fest-lib/ssre/vite";

export default {
  plugins: [ssreVite({ pages: { "/": "./pages/home.ts" } })],
};
```

Page module: `export default ({ hub }) => ({ title, factory })`.

## Tests

```bash
npm test          # node:test via Vite bundle
npm run demo      # Vite + ssreVite, http://localhost:5173/
```

A Fastify-less backend is `test/demo/server.ts`.
