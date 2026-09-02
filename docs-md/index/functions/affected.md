[**@fest-lib/ssre v0.1.5**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / affected

# Function: affected()

```ts
function affected<Under>(
   obj, 
   prop, 
   cb?, 
   options?
): Function | undefined;
```

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
