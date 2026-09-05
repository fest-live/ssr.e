[**@fest-lib/ssre API Documentation v0.1.12**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / RenderContext

# Class: RenderContext

Defined in: ssr.e/src/ssre/node/context.ts:14

## Constructors

### Constructor

> **new RenderContext**(`hub?`): `RenderContext`

Defined in: ssr.e/src/ssre/node/context.ts:24

#### Parameters

##### hub?

[`ReactiveHub`](ReactiveHub.md)

#### Returns

`RenderContext`

## Properties

### hub

> `readonly` **hub**: [`ReactiveHub`](ReactiveHub.md)

Defined in: ssr.e/src/ssre/node/context.ts:15

***

### bindings

> `readonly` **bindings**: [`SsreBinding`](../interfaces/SsreBinding.md)[] = `[]`

Defined in: ssr.e/src/ssre/node/context.ts:16

***

### events

> `readonly` **events**: `SsreOnBinding`[] = `[]`

Defined in: ssr.e/src/ssre/node/context.ts:17

***

### mapped

> `readonly` **mapped**: `object`[] = `[]`

Defined in: ssr.e/src/ssre/node/context.ts:18

#### id

> **id**: `string`

#### store

> **store**: `string`

#### path

> **path**: `string`

***

### clientSlots

> `readonly` **clientSlots**: [`SsreClientSlot`](../interfaces/SsreClientSlot.md)[] = `[]`

Defined in: ssr.e/src/ssre/node/context.ts:19

***

### channel?

> `optional` **channel?**: [`ChannelConfig`](../interfaces/ChannelConfig.md)

Defined in: ssr.e/src/ssre/node/context.ts:20

## Methods

### nextId()

> **nextId**(`prefix?`): `string`

Defined in: ssr.e/src/ssre/node/context.ts:28

#### Parameters

##### prefix?

`string` = `"n"`

#### Returns

`string`

***

### bind()

> **bind**(`binding`): `string`

Defined in: ssr.e/src/ssre/node/context.ts:32

#### Parameters

##### binding

`Omit`\<[`SsreBinding`](../interfaces/SsreBinding.md), `"id"`\> & `object`

#### Returns

`string`

***

### on()

> **on**(`event`, `action`, `id?`): `string`

Defined in: ssr.e/src/ssre/node/context.ts:38

#### Parameters

##### event

`string`

##### action

`string`

##### id?

`string`

#### Returns

`string`

***

### registerAction()

> **registerAction**(`handler`, `name?`): `string`

Defined in: ssr.e/src/ssre/node/context.ts:44

#### Parameters

##### handler

(...`args`) => `any`

##### name?

`string`

#### Returns

`string`

***

### toScenario()

> **toScenario**(): [`SsreScenario`](../interfaces/SsreScenario.md)

Defined in: ssr.e/src/ssre/node/context.ts:50

#### Returns

[`SsreScenario`](../interfaces/SsreScenario.md)
