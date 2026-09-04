[**@fest-lib/ssre v0.1.9**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/types](../README.md) / SsreScenario

# Interface: SsreScenario

Defined in: ssr.e/src/ssre/node/types.ts:105

## Properties

### bindings

```ts
bindings: SsreBinding[];
```

Defined in: ssr.e/src/ssre/node/types.ts:108

***

### channel?

```ts
optional channel?: ChannelConfig;
```

Defined in: ssr.e/src/ssre/node/types.ts:114

***

### clientSlots?

```ts
optional clientSlots?: SsreClientSlot[];
```

Defined in: ssr.e/src/ssre/node/types.ts:111

***

### cssVars?

```ts
optional cssVars?: CssVarBinding[];
```

Defined in: ssr.e/src/ssre/node/types.ts:112

***

### events

```ts
events: SsreOnBinding[];
```

Defined in: ssr.e/src/ssre/node/types.ts:109

***

### mapped

```ts
mapped: object[];
```

Defined in: ssr.e/src/ssre/node/types.ts:110

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

Defined in: ssr.e/src/ssre/node/types.ts:107

***

### typedOm?

```ts
optional typedOm?: Record<string, TypedOmEntry>;
```

Defined in: ssr.e/src/ssre/node/types.ts:113

***

### version

```ts
version: 1;
```

Defined in: ssr.e/src/ssre/node/types.ts:106
