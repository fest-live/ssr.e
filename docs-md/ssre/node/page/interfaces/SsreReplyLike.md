[**@fest-lib/ssre v0.1.0**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/page](../README.md) / SsreReplyLike

# Interface: SsreReplyLike

Defined in: ssre/node/page.ts:17

## Properties

### header?

```ts
optional header?: (name, value) => SsreReplyLike;
```

Defined in: ssre/node/page.ts:19

#### Parameters

##### name

`string`

##### value

`string`

#### Returns

`SsreReplyLike`

***

### send

```ts
send: (payload) => any;
```

Defined in: ssre/node/page.ts:20

#### Parameters

##### payload

`string`

#### Returns

`any`

***

### type

```ts
type: (contentType) => SsreReplyLike;
```

Defined in: ssre/node/page.ts:18

#### Parameters

##### contentType

`string`

#### Returns

`SsreReplyLike`
