[**@fest-lib/ssre v0.1.3**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / $ref

# Function: $ref()

```ts
function $ref<T>(typed, behavior?): T extends symbol | object | Function ? observeValid<T> | refType<T> : refType<T>;
```

Defined in: object.ts/src/core/Primitives.ts:228

Pick the most suitable ref implementation for the provided value type.

## Type Parameters

### T

`T` = `any`

## Parameters

### typed

`T` \| `Promise`\<`T`\> \| `null` \| `undefined`

### behavior?

`any`

## Returns

`T` *extends* `symbol` \| `object` \| `Function` ? `observeValid`\<`T`\> \| `refType`\<`T`\> : `refType`\<`T`\>
