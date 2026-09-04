[**@fest-lib/ssre v0.1.9**](../../README.md)

***

[@fest-lib/ssre](../../README.md) / [index](../README.md) / computed

# Function: computed()

```ts
function computed<T, OT>(
   src, 
   cb?, 
   behavior?, 
   prop?
): observeValid<OT>;
```

Defined in: object.ts/src/core/Assigned.ts:293

Build a computed ref whose getter and optional setter are driven by a source subscription.

## Type Parameters

### T

`T` = `any`

### OT

`OT` = `T`

## Parameters

### src

`subValid`\<`T`\>

### cb?

`Function` \| `null`

### behavior?

`any`

### prop?

`keyType` \| `null`

## Returns

`observeValid`\<`OT`\>
