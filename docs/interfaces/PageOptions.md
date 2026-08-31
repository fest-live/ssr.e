[**@fest-lib/ssre API Documentation v0.1.2**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / PageOptions

# Interface: PageOptions

Defined in: ssre/node/page.ts:23

## Properties

### title?

> `optional` **title?**: `string`

Defined in: ssre/node/page.ts:24

***

### lang?

> `optional` **lang?**: `string`

Defined in: ssre/node/page.ts:25

***

### body?

> `optional` **body?**: [`Child`](../type-aliases/Child.md) \| [`RenderResult`](RenderResult.md) \| (() => [`Child`](../type-aliases/Child.md))

Defined in: ssre/node/page.ts:26

***

### head?

> `optional` **head?**: `string`

Defined in: ssre/node/page.ts:27

***

### styles?

> `optional` **styles?**: `string`[]

Defined in: ssre/node/page.ts:28

***

### scripts?

> `optional` **scripts?**: `string`[]

Defined in: ssre/node/page.ts:29

***

### hub?

> `optional` **hub?**: [`ReactiveHub`](../classes/ReactiveHub.md)

Defined in: ssre/node/page.ts:30

***

### channel?

> `optional` **channel?**: `object`

Defined in: ssre/node/page.ts:31

#### url

> **url**: `string`

#### protocol?

> `optional` **protocol?**: `"sse"` \| `"ws"` \| `"socket.io"`

***

### factory?

> `optional` **factory?**: (`ctx`) => [`Child`](../type-aliases/Child.md)

Defined in: ssre/node/page.ts:32

#### Parameters

##### ctx

[`RenderContext`](../classes/RenderContext.md)

#### Returns

[`Child`](../type-aliases/Child.md)
