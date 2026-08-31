[**@fest-lib/ssre v0.1.0**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/types](../README.md) / SsreScenario

# Interface: SsreScenario

Defined in: ssre/node/types.ts:98

## Properties

### bindings

```ts
bindings: SsreBinding[];
```

Defined in: ssre/node/types.ts:101

***

### channel?

```ts
optional channel?: ChannelConfig;
```

Defined in: ssre/node/types.ts:106

***

### cssVars?

```ts
optional cssVars?: CssVarBinding[];
```

Defined in: ssre/node/types.ts:104

***

### events

```ts
events: SsreOnBinding[];
```

Defined in: ssre/node/types.ts:102

***

### mapped

```ts
mapped: object[];
```

Defined in: ssre/node/types.ts:103

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

***

### stores

```ts
stores: Record<string, {
  snapshot: any;
}>;
```

Defined in: ssre/node/types.ts:100

***

### typedOm?

```ts
optional typedOm?: Record<string, TypedOmEntry>;
```

Defined in: ssre/node/types.ts:105

***

### version

```ts
version: 1;
```

Defined in: ssre/node/types.ts:99
