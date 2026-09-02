[**@fest-lib/ssre API Documentation v0.1.4**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / ref

# Function: ref()

> **ref**\<`T`\>(`typed`, `prop?`, `behavior?`): `T` *extends* `symbol` \| `object` \| `Function` ? `observeValid`\<`T`\> \| `refType`\<`T`\> : `refType`\<`T`\> & `T` *extends* `symbol` \| `object` \| `Function` ? `T` : `any`

Defined in: object.ts/src/core/Primitives.ts:239

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
