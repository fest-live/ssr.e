[**@fest-lib/ssre API Documentation v0.1.5**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / applyCustomPropertyFallbacks

# Function: applyCustomPropertyFallbacks()

> **applyCustomPropertyFallbacks**(`css`, `values`): `string`

Defined in: ssr.e/src/ssre/css/vanilla.ts:22

Inject current values as `var(--x, fallback)` so first paint matches the hub.

## Parameters

### css

`string`

### values

`Record`\<`string`, `string`\>

## Returns

`string`
