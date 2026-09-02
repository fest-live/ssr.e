[**@fest-lib/ssre v0.1.4**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/sockets](../README.md) / listenWithWs

# Function: listenWithWs()

```ts
function listenWithWs(
   hub, 
   server, 
   path?
): Promise<Server<typeof WebSocket, typeof IncomingMessage>>;
```

Defined in: ssr.e/src/ssre/server/sockets.ts:40

Dynamic `ws` WebSocketServer on an HTTP server.

## Parameters

### hub

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

### server

`Server`

### path?

`string` = `"/ssre/channel"`

## Returns

`Promise`\<`Server`\<*typeof* `WebSocket`, *typeof* `IncomingMessage`\>\>
