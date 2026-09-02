[**@fest-lib/ssre v0.1.6**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/sockets](../README.md) / listenWithSocketIO

# Function: listenWithSocketIO()

```ts
function listenWithSocketIO(
   hub, 
   server, 
   options?
): Promise<Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>;
```

Defined in: ssr.e/src/ssre/server/sockets.ts:48

Dynamic `socket.io` Server. Event name is `ssre`.

## Parameters

### hub

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

### server

`Server`

### options?

`Record`\<`string`, `any`\>

## Returns

`Promise`\<`Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>\>
