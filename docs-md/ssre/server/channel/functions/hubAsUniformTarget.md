[**@fest-lib/ssre v0.1.9**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/channel](../README.md) / hubAsUniformTarget

# Function: hubAsUniformTarget()

```ts
function hubAsUniformTarget(hub): object;
```

Defined in: ssr.e/src/ssre/server/channel.ts:72

Duck-typed target so uniform `createWebSocketTransport` / proxies can share the hub.

## Parameters

### hub

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

## Returns

`object`

### addEventListener()

```ts
addEventListener(_type, listener): void;
```

#### Parameters

##### \_type

`string`

##### listener

(`ev`) => `void`

#### Returns

`void`

### postMessage()

```ts
postMessage(msg): void;
```

#### Parameters

##### msg

[`ChannelMessage`](../../../node/types/interfaces/ChannelMessage.md)

#### Returns

`void`

### removeEventListener()

```ts
removeEventListener(_type, listener): void;
```

#### Parameters

##### \_type

`string`

##### listener

(`ev`) => `void`

#### Returns

`void`

### send()

```ts
send(msg): void;
```

#### Parameters

##### msg

[`ChannelMessage`](../../../node/types/interfaces/ChannelMessage.md)

#### Returns

`void`
