[**@fest-lib/ssre v0.1.6**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/sockets](../README.md) / attachFastifyWebsocket

# Function: attachFastifyWebsocket()

```ts
function attachFastifyWebsocket(
   app, 
   hub, 
   path?
): void;
```

Defined in: ssr.e/src/ssre/server/sockets.ts:35

`@fastify/websocket` — `app.get(path, { websocket: true }, ...)`.

## Parameters

### app

`any`

### hub

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

### path?

`string` = `"/ssre/channel"`

## Returns

`void`
