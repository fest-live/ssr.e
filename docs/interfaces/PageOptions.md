[**@fest-lib/ssre API Documentation v0.1.11**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / PageOptions

# Interface: PageOptions

Defined in: ssr.e/src/ssre/node/page.ts:25

## Properties

### title?

> `optional` **title?**: `string`

Defined in: ssr.e/src/ssre/node/page.ts:26

***

### lang?

> `optional` **lang?**: `string`

Defined in: ssr.e/src/ssre/node/page.ts:27

***

### body?

> `optional` **body?**: [`Child`](../type-aliases/Child.md) \| [`RenderResult`](RenderResult.md) \| (() => [`Child`](../type-aliases/Child.md))

Defined in: ssr.e/src/ssre/node/page.ts:28

***

### head?

> `optional` **head?**: `string`

Defined in: ssr.e/src/ssre/node/page.ts:29

***

### styles?

> `optional` **styles?**: `string`[]

Defined in: ssr.e/src/ssre/node/page.ts:30

***

### scripts?

> `optional` **scripts?**: `string`[]

Defined in: ssr.e/src/ssre/node/page.ts:31

***

### hub?

> `optional` **hub?**: [`ReactiveHub`](../classes/ReactiveHub.md)

Defined in: ssr.e/src/ssre/node/page.ts:32

***

### channel?

> `optional` **channel?**: `object`

Defined in: ssr.e/src/ssre/node/page.ts:33

#### url

> **url**: `string`

#### protocol?

> `optional` **protocol?**: `"sse"` \| `"ws"` \| `"socket.io"`

***

### factory?

> `optional` **factory?**: (`ctx`) => [`Child`](../type-aliases/Child.md)

Defined in: ssr.e/src/ssre/node/page.ts:34

#### Parameters

##### ctx

[`RenderContext`](../classes/RenderContext.md)

#### Returns

[`Child`](../type-aliases/Child.md)
