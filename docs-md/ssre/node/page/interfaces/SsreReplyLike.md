[**@fest-lib/ssre v0.1.7**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/page](../README.md) / SsreReplyLike

# Interface: SsreReplyLike

Defined in: ssr.e/src/ssre/node/page.ts:19

## Properties

### header?

```ts
optional header?: (name, value) => SsreReplyLike;
```

Defined in: ssr.e/src/ssre/node/page.ts:21

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

Defined in: ssr.e/src/ssre/node/page.ts:22

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

Defined in: ssr.e/src/ssre/node/page.ts:20

#### Parameters

##### contentType

`string`

#### Returns

`SsreReplyLike`
