[**@fest-lib/ssre v0.1.8**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/css/vars](../README.md) / cssVars

# Function: cssVars()

```ts
function cssVars(
   vars, 
   options?, 
   hub?
): CssVarBinding[];
```

Defined in: ssr.e/src/ssre/css/vars.ts:40

## Parameters

### vars

`Record`\<`string`, `any`\>

### options?

`Omit`\<[`CssVarOptions`](../interfaces/CssVarOptions.md), `"typed"`\> & `object` = `{}`

### hub?

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

## Returns

[`CssVarBinding`](../../../node/types/interfaces/CssVarBinding.md)[]
