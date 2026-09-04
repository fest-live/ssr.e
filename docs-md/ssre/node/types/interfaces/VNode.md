[**@fest-lib/ssre v0.1.10**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/types](../README.md) / VNode

# Interface: VNode

Defined in: ssr.e/src/ssre/node/types.ts:55

## Properties

### \[$ssre\]

```ts
[$ssre]: true;
```

Defined in: ssr.e/src/ssre/node/types.ts:56

***

### attrs

```ts
attrs: Record<string, string>;
```

Defined in: ssr.e/src/ssre/node/types.ts:60

***

### bindings

```ts
bindings: SsreBinding[];
```

Defined in: ssr.e/src/ssre/node/types.ts:65

***

### children

```ts
children: Child[];
```

Defined in: ssr.e/src/ssre/node/types.ts:64

***

### classList

```ts
classList: string[];
```

Defined in: ssr.e/src/ssre/node/types.ts:62

***

### dataset

```ts
dataset: Record<string, string>;
```

Defined in: ssr.e/src/ssre/node/types.ts:61

***

### events

```ts
events: SsreOnBinding[];
```

Defined in: ssr.e/src/ssre/node/types.ts:66

***

### html?

```ts
optional html?: string;
```

Defined in: ssr.e/src/ssre/node/types.ts:69

***

### id?

```ts
optional id?: string;
```

Defined in: ssr.e/src/ssre/node/types.ts:59

***

### kind

```ts
kind: SsreKind;
```

Defined in: ssr.e/src/ssre/node/types.ts:57

***

### mapFn?

```ts
optional mapFn?: (item, index) => Child;
```

Defined in: ssr.e/src/ssre/node/types.ts:68

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

Defined in: ssr.e/src/ssre/node/types.ts:67

***

### style?

```ts
optional style?: string;
```

Defined in: ssr.e/src/ssre/node/types.ts:63

***

### tag?

```ts
optional tag?: string;
```

Defined in: ssr.e/src/ssre/node/types.ts:58
