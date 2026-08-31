[**@fest-lib/ssre v0.1.1**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/css/vanilla](../README.md) / applyCustomPropertyFallbacks

# Function: applyCustomPropertyFallbacks()

```ts
function applyCustomPropertyFallbacks(css, values): string;
```

Defined in: ssre/css/vanilla.ts:22

Inject current values as `var(--x, fallback)` so first paint matches the hub.

## Parameters

### css

`string`

### values

`Record`\<`string`, `string`\>

## Returns

`string`
