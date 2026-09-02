[**@fest-lib/ssre API Documentation v0.1.6**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / affected

# Function: affected()

> **affected**\<`Under`\>(`obj`, `prop`, `cb?`, `options?`): `Function` \| `undefined`

Defined in: object.ts/src/core/Mainline.ts:165

`function` (not `const`) so circular imports from Assigned/Primitives cannot hit TDZ during bundle init.

## Type Parameters

### Under

`Under` = `any`

## Parameters

### obj

`any`

### prop

`keyType` \| `AffectedCallback` \| `null`

### cb?

`AffectedCallback` \| `AffectedConfig`

### options?

`AffectedConfig`

## Returns

`Function` \| `undefined`
