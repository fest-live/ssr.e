[**@fest-lib/ssre v0.1.6**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/context](../README.md) / RenderContext

# Class: RenderContext

Defined in: ssr.e/src/ssre/node/context.ts:14

## Constructors

### Constructor

```ts
new RenderContext(hub?): RenderContext;
```

Defined in: ssr.e/src/ssre/node/context.ts:24

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

Defined in: ssr.e/src/ssre/node/context.ts:16

***

### channel?

```ts
optional channel?: ChannelConfig;
```

Defined in: ssr.e/src/ssre/node/context.ts:20

***

### clientSlots

```ts
readonly clientSlots: SsreClientSlot[] = [];
```

Defined in: ssr.e/src/ssre/node/context.ts:19

***

### events

```ts
readonly events: SsreOnBinding[] = [];
```

Defined in: ssr.e/src/ssre/node/context.ts:17

***

### hub

```ts
readonly hub: ReactiveHub;
```

Defined in: ssr.e/src/ssre/node/context.ts:15

***

### mapped

```ts
readonly mapped: object[] = [];
```

Defined in: ssr.e/src/ssre/node/context.ts:18

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

Defined in: ssr.e/src/ssre/node/context.ts:32

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

Defined in: ssr.e/src/ssre/node/context.ts:28

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

```ts
registerAction(handler, name?): string;
```

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

```ts
toScenario(): SsreScenario;
```

Defined in: ssr.e/src/ssre/node/context.ts:50

#### Returns

[`SsreScenario`](../../types/interfaces/SsreScenario.md)
