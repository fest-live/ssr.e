[**@fest-lib/ssre API Documentation v0.1.0**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / RenderContext

# Class: RenderContext

Defined in: ssre/node/context.ts:13

## Constructors

### Constructor

> **new RenderContext**(`hub?`): `RenderContext`

Defined in: ssre/node/context.ts:22

#### Parameters

##### hub?

[`ReactiveHub`](ReactiveHub.md)

#### Returns

`RenderContext`

## Properties

### hub

> `readonly` **hub**: [`ReactiveHub`](ReactiveHub.md)

Defined in: ssre/node/context.ts:14

***

### bindings

> `readonly` **bindings**: [`SsreBinding`](../interfaces/SsreBinding.md)[] = `[]`

Defined in: ssre/node/context.ts:15

***

### events

> `readonly` **events**: `SsreOnBinding`[] = `[]`

Defined in: ssre/node/context.ts:16

***

### mapped

> `readonly` **mapped**: `object`[] = `[]`

Defined in: ssre/node/context.ts:17

#### id

> **id**: `string`

#### store

> **store**: `string`

#### path

> **path**: `string`

***

### channel?

> `optional` **channel?**: [`ChannelConfig`](../interfaces/ChannelConfig.md)

Defined in: ssre/node/context.ts:18

## Methods

### nextId()

> **nextId**(`prefix?`): `string`

Defined in: ssre/node/context.ts:26

#### Parameters

##### prefix?

`string` = `"n"`

#### Returns

`string`

***

### bind()

> **bind**(`binding`): `string`

Defined in: ssre/node/context.ts:30

#### Parameters

##### binding

`Omit`\<[`SsreBinding`](../interfaces/SsreBinding.md), `"id"`\> & `object`

#### Returns

`string`

***

### on()

> **on**(`event`, `action`, `id?`): `string`

Defined in: ssre/node/context.ts:36

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

Defined in: ssre/node/context.ts:42

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

Defined in: ssre/node/context.ts:48

#### Returns

[`SsreScenario`](../interfaces/SsreScenario.md)
