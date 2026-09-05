[**@fest-lib/ssre API Documentation v0.1.12**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / ReactiveHub

# Class: ReactiveHub

Defined in: ssr.e/src/ssre/core/store.ts:33

## Constructors

### Constructor

> **new ReactiveHub**(): `ReactiveHub`

#### Returns

`ReactiveHub`

## Properties

### stores

> `readonly` **stores**: `Map`\<`string`, `any`\>

Defined in: ssr.e/src/ssre/core/store.ts:34

***

### actions

> `readonly` **actions**: `Map`\<`string`, (...`args`) => `any`\>

Defined in: ssr.e/src/ssre/core/store.ts:35

***

### mapped

> `readonly` **mapped**: `Map`\<`string`, \{ `source`: `any`; `store`: `string`; `path`: `string`; `render`: () => `string`; \}\>

Defined in: ssr.e/src/ssre/core/store.ts:36

***

### names

> `readonly` **names**: `WeakMap`\<`object`, `string`\>

Defined in: ssr.e/src/ssre/core/store.ts:37

***

### sinks

> `readonly` **sinks**: `Set`\<[`HubSink`](../type-aliases/HubSink.md)\>

Defined in: ssr.e/src/ssre/core/store.ts:38

***

### cssVars

> `readonly` **cssVars**: `Map`\<`string`, [`CssVarBinding`](../interfaces/CssVarBinding.md)\>

Defined in: ssr.e/src/ssre/core/store.ts:39

***

### typedOmEntries

> `readonly` **typedOmEntries**: `Map`\<`string`, [`TypedOmEntry`](../interfaces/TypedOmEntry.md)\>

Defined in: ssr.e/src/ssre/core/store.ts:40

***

### channel

> **channel**: [`ChannelConfig`](../interfaces/ChannelConfig.md) \| `undefined`

Defined in: ssr.e/src/ssre/core/store.ts:41

***

### lastScenario

> **lastScenario**: [`SsreScenario`](../interfaces/SsreScenario.md) \| `null` = `null`

Defined in: ssr.e/src/ssre/core/store.ts:42

## Methods

### store()

> **store**\<`T`\>(`name`, `initial`): `observeValid`\<`T`\>

Defined in: ssr.e/src/ssre/core/store.ts:46

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### name

`string`

##### initial

`T`

#### Returns

`observeValid`\<`T`\>

***

### attach()

> **attach**(`name`, `observed`): `any`

Defined in: ssr.e/src/ssre/core/store.ts:57

#### Parameters

##### name

`string`

##### observed

`any`

#### Returns

`any`

***

### nameOf()

> **nameOf**(`target`): `string` \| `null`

Defined in: ssr.e/src/ssre/core/store.ts:71

#### Parameters

##### target

`any`

#### Returns

`string` \| `null`

***

### ensureNamed()

> **ensureNamed**(`target`, `hint?`): `string`

Defined in: ssr.e/src/ssre/core/store.ts:76

#### Parameters

##### target

`any`

##### hint?

`string`

#### Returns

`string`

***

### action()

> **action**(`name`, `fn`): `void`

Defined in: ssr.e/src/ssre/core/store.ts:84

#### Parameters

##### name

`string`

##### fn

(...`args`) => `any`

#### Returns

`void`

***

### cssVar()

> **cssVar**(`binding`): [`CssVarBinding`](../interfaces/CssVarBinding.md)

Defined in: ssr.e/src/ssre/core/store.ts:88

#### Parameters

##### binding

[`CssVarBinding`](../interfaces/CssVarBinding.md)

#### Returns

[`CssVarBinding`](../interfaces/CssVarBinding.md)

***

### typedOm()

> **typedOm**(`name`, `entry`): `void`

Defined in: ssr.e/src/ssre/core/store.ts:93

#### Parameters

##### name

`string`

##### entry

[`TypedOmEntry`](../interfaces/TypedOmEntry.md)

#### Returns

`void`

***

### subscribe()

> **subscribe**(`sink`): () => `void`

Defined in: ssr.e/src/ssre/core/store.ts:97

#### Parameters

##### sink

[`HubSink`](../type-aliases/HubSink.md)

#### Returns

() => `void`

***

### broadcast()

> **broadcast**(`msg`): `void`

Defined in: ssr.e/src/ssre/core/store.ts:102

#### Parameters

##### msg

[`ChannelMessage`](../interfaces/ChannelMessage.md)

#### Returns

`void`

***

### handle()

> **handle**(`msg`): `any`

Defined in: ssr.e/src/ssre/core/store.ts:106

#### Parameters

##### msg

[`ChannelMessage`](../interfaces/ChannelMessage.md)

#### Returns

`any`

***

### toScenario()

> **toScenario**(): `Pick`\<[`SsreScenario`](../interfaces/SsreScenario.md), `"stores"` \| `"cssVars"` \| `"typedOm"`\>

Defined in: ssr.e/src/ssre/core/store.ts:123

#### Returns

`Pick`\<[`SsreScenario`](../interfaces/SsreScenario.md), `"stores"` \| `"cssVars"` \| `"typedOm"`\>

***

### \[dispose\]()

> **\[dispose\]**(): `void`

Defined in: ssr.e/src/ssre/core/store.ts:135

#### Returns

`void`
