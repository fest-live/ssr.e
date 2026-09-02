[**@fest-lib/ssre v0.1.4**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/sockets](../README.md) / bindSocket

# Function: bindSocket()

```ts
function bindSocket(
   hub, 
   socket, 
   event?
): () => void;
```

Defined in: ssr.e/src/ssre/server/sockets.ts:14

## Parameters

### hub

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

### socket

#### emit?

`Function`

#### on

`Function`

#### send?

`Function`

### event?

`string` = `"ssre"`

## Returns

() => `void`
