[**@fest-lib/ssre v0.1.12**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / wrapRef

# Function: wrapRef()

```ts
function wrapRef<T>(initial?, behavior?): observeValid<refType<T>>;
```

Defined in: object.ts/src/core/Primitives.ts:91

Generic ref wrapper for values that do not need one of the specialized primitive ref shapes.

## Type Parameters

### T

`T` = `any`

## Parameters

### initial?

`T` \| `Promise`\<`T`\> \| `null`

### behavior?

`any`

## Returns

`observeValid`\<`refType`\<`T`\>\>
