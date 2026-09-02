[**@fest-lib/ssre v0.1.6**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / ref

# Function: ref()

```ts
function ref<T>(
   typed, 
   prop?, 
   behavior?
): T extends symbol | object | Function ? observeValid<T> | refType<T> : refType<T> & T extends symbol | object | Function ? T : any;
```

Defined in: object.ts/src/core/Primitives.ts:256

Public ref helper that can either wrap a value or target one specific property.

## Type Parameters

### T

`T` = `any`

## Parameters

### typed

`T` \| `Promise`\<`T`\> \| `null` \| `undefined`

### prop?

`keyType` \| `null`

### behavior?

`any`

## Returns

`T` *extends* `symbol` \| `object` \| `Function` ? `observeValid`\<`T`\> \| `refType`\<`T`\> : `refType`\<`T`\> & `T` *extends* `symbol` \| `object` \| `Function` ? `T` : `any`
