[**@fest-lib/ssre v0.1.3**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / observe

# Function: observe()

```ts
function observe<T>(target, stateName?): observeValid<T>;
```

Defined in: object.ts/src/core/Primitives.ts:288

`function` (not `const`) so circular Mainline ↔ Primitives/Assigned init cannot TDZ in bundled output.

## Type Parameters

### T

`T` = `any`

## Parameters

### target

`T`

### stateName?

`string`

## Returns

`observeValid`\<`T`\>
