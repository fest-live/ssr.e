[**@fest-lib/ssre v0.1.9**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/page](../README.md) / sendSsre

# Function: sendSsre()

```ts
function sendSsre(
   reply, 
   page, 
   hub?
): any;
```

Defined in: ssr.e/src/ssre/node/page.ts:87

## Parameters

### reply

[`SsreReplyLike`](../interfaces/SsreReplyLike.md)

### page

  \| [`Child`](../../types/type-aliases/Child.md)
  \| [`PageOptions`](../interfaces/PageOptions.md)
  \| [`RenderResult`](../../render/interfaces/RenderResult.md)
  \| (() => [`Child`](../../types/type-aliases/Child.md))

### hub?

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

## Returns

`any`
