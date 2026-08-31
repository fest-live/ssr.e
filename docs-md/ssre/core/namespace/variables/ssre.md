[**@fest-lib/ssre v0.1.2**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/core/namespace](../README.md) / ssre

# Variable: ssre

```ts
const ssre: object;
```

Defined in: ssre/core/namespace.ts:163

## Type Declaration

### client

```ts
client: object;
```

#### client.get()

```ts
get(name, fallback?): any;
```

##### Parameters

###### name

`string`

###### fallback?

`any`

##### Returns

`any`

#### client.set()

```ts
set(name, ref): any;
```

##### Parameters

###### name

`string`

###### ref

`any`

##### Returns

`any`

### server

```ts
server: object;
```

#### server.get()

```ts
get(name): any;
```

##### Parameters

###### name

`string`

##### Returns

`any`

#### server.set()

```ts
set(name, ref): any;
```

##### Parameters

###### name

`string`

###### ref

`any`

##### Returns

`any`

### attach()

```ts
attach(hub): ReactiveHub | null;
```

#### Parameters

##### hub

[`ReactiveHub`](../../store/classes/ReactiveHub.md) \| `null` \| `undefined`

#### Returns

[`ReactiveHub`](../../store/classes/ReactiveHub.md) \| `null`

### use()

```ts
use(adapters?): void;
```

#### Parameters

##### adapters?

###### bindWith?

[`SsreBindWith`](../type-aliases/SsreBindWith.md)

#### Returns

`void`
