[**@fest-lib/ssre v0.1.0**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/context](../README.md) / RenderContext

# Class: RenderContext

Defined in: ssre/node/context.ts:13

## Constructors

### Constructor

```ts
new RenderContext(hub?): RenderContext;
```

Defined in: ssre/node/context.ts:22

#### Parameters

##### hub?

[`ReactiveHub`](../../../core/store/classes/ReactiveHub.md)

#### Returns

`RenderContext`

## Properties

### bindings

```ts
readonly bindings: SsreBinding[] = [];
```

Defined in: ssre/node/context.ts:15

***

### channel?

```ts
optional channel?: ChannelConfig;
```

Defined in: ssre/node/context.ts:18

***

### events

```ts
readonly events: SsreOnBinding[] = [];
```

Defined in: ssre/node/context.ts:16

***

### hub

```ts
readonly hub: ReactiveHub;
```

Defined in: ssre/node/context.ts:14

***

### mapped

```ts
readonly mapped: object[] = [];
```

Defined in: ssre/node/context.ts:17

#### id

```ts
id: string;
```

#### path

```ts
path: string;
```

#### store

```ts
store: string;
```

## Methods

### bind()

```ts
bind(binding): string;
```

Defined in: ssre/node/context.ts:30

#### Parameters

##### binding

`Omit`\<[`SsreBinding`](../../types/interfaces/SsreBinding.md), `"id"`\> & `object`

#### Returns

`string`

***

### nextId()

```ts
nextId(prefix?): string;
```

Defined in: ssre/node/context.ts:26

#### Parameters

##### prefix?

`string` = `"n"`

#### Returns

`string`

***

### on()

```ts
on(
   event, 
   action, 
   id?
): string;
```

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

```ts
registerAction(handler, name?): string;
```

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

```ts
toScenario(): SsreScenario;
```

Defined in: ssre/node/context.ts:48

#### Returns

[`SsreScenario`](../../types/interfaces/SsreScenario.md)
