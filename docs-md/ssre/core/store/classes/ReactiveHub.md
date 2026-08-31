[**@fest-lib/ssre v0.1.2**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/core/store](../README.md) / ReactiveHub

# Class: ReactiveHub

Defined in: ssre/core/store.ts:33

## Constructors

### Constructor

```ts
new ReactiveHub(): ReactiveHub;
```

#### Returns

`ReactiveHub`

## Properties

### actions

```ts
readonly actions: Map<string, (...args) => any>;
```

Defined in: ssre/core/store.ts:35

***

### channel

```ts
channel: 
  | ChannelConfig
  | undefined;
```

Defined in: ssre/core/store.ts:41

***

### cssVars

```ts
readonly cssVars: Map<string, CssVarBinding>;
```

Defined in: ssre/core/store.ts:39

***

### lastScenario

```ts
lastScenario: SsreScenario | null = null;
```

Defined in: ssre/core/store.ts:42

***

### mapped

```ts
readonly mapped: Map<string, {
  path: string;
  render: () => string;
  source: any;
  store: string;
}>;
```

Defined in: ssre/core/store.ts:36

***

### names

```ts
readonly names: WeakMap<object, string>;
```

Defined in: ssre/core/store.ts:37

***

### sinks

```ts
readonly sinks: Set<HubSink>;
```

Defined in: ssre/core/store.ts:38

***

### stores

```ts
readonly stores: Map<string, observeValid<any>>;
```

Defined in: ssre/core/store.ts:34

***

### typedOmEntries

```ts
readonly typedOmEntries: Map<string, TypedOmEntry>;
```

Defined in: ssre/core/store.ts:40

## Methods

### \[dispose\]()

```ts
dispose: void;
```

Defined in: ssre/core/store.ts:135

#### Returns

`void`

***

### action()

```ts
action(name, fn): void;
```

Defined in: ssre/core/store.ts:84

#### Parameters

##### name

`string`

##### fn

(...`args`) => `any`

#### Returns

`void`

***

### attach()

```ts
attach(name, observed): observeValid<any>;
```

Defined in: ssre/core/store.ts:57

#### Parameters

##### name

`string`

##### observed

`observeValid`\<`any`\>

#### Returns

`observeValid`\<`any`\>

***

### broadcast()

```ts
broadcast(msg): void;
```

Defined in: ssre/core/store.ts:102

#### Parameters

##### msg

[`ChannelMessage`](../../../node/types/interfaces/ChannelMessage.md)

#### Returns

`void`

***

### cssVar()

```ts
cssVar(binding): CssVarBinding;
```

Defined in: ssre/core/store.ts:88

#### Parameters

##### binding

[`CssVarBinding`](../../../node/types/interfaces/CssVarBinding.md)

#### Returns

[`CssVarBinding`](../../../node/types/interfaces/CssVarBinding.md)

***

### ensureNamed()

```ts
ensureNamed(target, hint?): string;
```

Defined in: ssre/core/store.ts:76

#### Parameters

##### target

`any`

##### hint?

`string`

#### Returns

`string`

***

### handle()

```ts
handle(msg): any;
```

Defined in: ssre/core/store.ts:106

#### Parameters

##### msg

[`ChannelMessage`](../../../node/types/interfaces/ChannelMessage.md)

#### Returns

`any`

***

### nameOf()

```ts
nameOf(target): string | null;
```

Defined in: ssre/core/store.ts:71

#### Parameters

##### target

`any`

#### Returns

`string` \| `null`

***

### store()

```ts
store<T>(name, initial): observeValid<T>;
```

Defined in: ssre/core/store.ts:46

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

### subscribe()

```ts
subscribe(sink): () => void;
```

Defined in: ssre/core/store.ts:97

#### Parameters

##### sink

[`HubSink`](../type-aliases/HubSink.md)

#### Returns

() => `void`

***

### toScenario()

```ts
toScenario(): Pick<SsreScenario, "stores" | "cssVars" | "typedOm">;
```

Defined in: ssre/core/store.ts:123

#### Returns

`Pick`\<[`SsreScenario`](../../../node/types/interfaces/SsreScenario.md), `"stores"` \| `"cssVars"` \| `"typedOm"`\>

***

### typedOm()

```ts
typedOm(name, entry): void;
```

Defined in: ssre/core/store.ts:93

#### Parameters

##### name

`string`

##### entry

[`TypedOmEntry`](../../../node/types/interfaces/TypedOmEntry.md)

#### Returns

`void`
