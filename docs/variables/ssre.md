[**@fest-lib/ssre API Documentation v0.1.3**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / ssre

# Variable: ssre

> `const` **ssre**: `object`

Defined in: ssr.e/src/ssre/core/namespace.ts:163

## Type Declaration

### attach()

> **attach**(`hub`): [`ReactiveHub`](../classes/ReactiveHub.md) \| `null`

#### Parameters

##### hub

[`ReactiveHub`](../classes/ReactiveHub.md) \| `null` \| `undefined`

#### Returns

[`ReactiveHub`](../classes/ReactiveHub.md) \| `null`

### use()

> **use**(`adapters?`): `void`

#### Parameters

##### adapters?

###### bindWith?

[`SsreBindWith`](../type-aliases/SsreBindWith.md)

#### Returns

`void`

### client

> **client**: `object`

#### client.get()

> **get**(`name`, `fallback?`): `any`

##### Parameters

###### name

`string`

###### fallback?

`any`

##### Returns

`any`

#### client.set()

> **set**(`name`, `ref`): `any`

##### Parameters

###### name

`string`

###### ref

`any`

##### Returns

`any`

### server

> **server**: `object`

#### server.get()

> **get**(`name`): `any`

##### Parameters

###### name

`string`

##### Returns

`any`

#### server.set()

> **set**(`name`, `ref`): `any`

##### Parameters

###### name

`string`

###### ref

`any`

##### Returns

`any`
