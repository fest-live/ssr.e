[**@fest-lib/ssre API Documentation v0.1.7**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / $ref

# Function: $ref()

> **$ref**\<`T`\>(`typed`, `behavior?`): `T` *extends* `symbol` \| `object` \| `Function` ? `observeValid`\<`T`\> \| `refType`\<`T`\> : `refType`\<`T`\>

Defined in: object.ts/src/core/Primitives.ts:245

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
