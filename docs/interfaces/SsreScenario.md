[**@fest-lib/ssre API Documentation v0.1.0**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / SsreScenario

# Interface: SsreScenario

Defined in: ssre/node/types.ts:98

## Properties

### version

> **version**: `1`

Defined in: ssre/node/types.ts:99

***

### stores

> **stores**: `Record`\<`string`, \{ `snapshot`: `any`; \}\>

Defined in: ssre/node/types.ts:100

***

### bindings

> **bindings**: [`SsreBinding`](SsreBinding.md)[]

Defined in: ssre/node/types.ts:101

***

### events

> **events**: `SsreOnBinding`[]

Defined in: ssre/node/types.ts:102

***

### mapped

> **mapped**: `object`[]

Defined in: ssre/node/types.ts:103

#### id

> **id**: `string`

#### store

> **store**: `string`

#### path

> **path**: `string`

***

### cssVars?

> `optional` **cssVars?**: [`CssVarBinding`](CssVarBinding.md)[]

Defined in: ssre/node/types.ts:104

***

### typedOm?

> `optional` **typedOm?**: `Record`\<`string`, [`TypedOmEntry`](TypedOmEntry.md)\>

Defined in: ssre/node/types.ts:105

***

### channel?

> `optional` **channel?**: [`ChannelConfig`](ChannelConfig.md)

Defined in: ssre/node/types.ts:106
