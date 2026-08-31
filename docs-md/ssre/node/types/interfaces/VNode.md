[**@fest-lib/ssre v0.1.0**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/types](../README.md) / VNode

# Interface: VNode

Defined in: ssre/node/types.ts:48

## Properties

### \[$ssre\]

```ts
[$ssre]: true;
```

Defined in: ssre/node/types.ts:49

***

### attrs

```ts
attrs: Record<string, string>;
```

Defined in: ssre/node/types.ts:53

***

### bindings

```ts
bindings: SsreBinding[];
```

Defined in: ssre/node/types.ts:58

***

### children

```ts
children: Child[];
```

Defined in: ssre/node/types.ts:57

***

### classList

```ts
classList: string[];
```

Defined in: ssre/node/types.ts:55

***

### dataset

```ts
dataset: Record<string, string>;
```

Defined in: ssre/node/types.ts:54

***

### events

```ts
events: SsreOnBinding[];
```

Defined in: ssre/node/types.ts:59

***

### html?

```ts
optional html?: string;
```

Defined in: ssre/node/types.ts:62

***

### id?

```ts
optional id?: string;
```

Defined in: ssre/node/types.ts:52

***

### kind

```ts
kind: SsreKind;
```

Defined in: ssre/node/types.ts:50

***

### mapFn?

```ts
optional mapFn?: (item, index) => Child;
```

Defined in: ssre/node/types.ts:61

#### Parameters

##### item

`any`

##### index

`number`

#### Returns

[`Child`](../type-aliases/Child.md)

***

### source?

```ts
optional source?: any;
```

Defined in: ssre/node/types.ts:60

***

### style?

```ts
optional style?: string;
```

Defined in: ssre/node/types.ts:56

***

### tag?

```ts
optional tag?: string;
```

Defined in: ssre/node/types.ts:51
