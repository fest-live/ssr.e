[**@fest-lib/ssre API Documentation v0.1.2**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / SsreScenario

# Interface: SsreScenario

Defined in: ssre/node/types.ts:105

## Properties

### version

> **version**: `1`

Defined in: ssre/node/types.ts:106

***

### stores

> **stores**: `Record`\<`string`, \{ `snapshot`: `any`; \}\>

Defined in: ssre/node/types.ts:107

***

### bindings

> **bindings**: [`SsreBinding`](SsreBinding.md)[]

Defined in: ssre/node/types.ts:108

***

### events

> **events**: `SsreOnBinding`[]

Defined in: ssre/node/types.ts:109

***

### mapped

> **mapped**: `object`[]

Defined in: ssre/node/types.ts:110

#### id

> **id**: `string`

#### store

> **store**: `string`

#### path

> **path**: `string`

***

### clientSlots?

> `optional` **clientSlots?**: [`SsreClientSlot`](SsreClientSlot.md)[]

Defined in: ssre/node/types.ts:111

***

### cssVars?

> `optional` **cssVars?**: [`CssVarBinding`](CssVarBinding.md)[]

Defined in: ssre/node/types.ts:112

***

### typedOm?

> `optional` **typedOm?**: `Record`\<`string`, [`TypedOmEntry`](TypedOmEntry.md)\>

Defined in: ssre/node/types.ts:113

***

### channel?

> `optional` **channel?**: [`ChannelConfig`](ChannelConfig.md)

Defined in: ssre/node/types.ts:114
