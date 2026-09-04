[**@fest-lib/ssre v0.1.8**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/vite/plugin](../README.md) / SsreViteOptions

# Interface: SsreViteOptions

Defined in: ssr.e/src/ssre/vite/plugin.ts:16

## Properties

### channelPath?

```ts
optional channelPath?: string;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:22

***

### htmlAsBase?

```ts
optional htmlAsBase?: boolean;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:20

Default true: keep existing HTML documents; inject scenario via transformIndexHtml.

***

### htmlPages?

```ts
optional htmlPages?: Record<string, string>;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:18

***

### hub?

```ts
optional hub?: ReactiveHub;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:21

***

### injectOnBuild?

```ts
optional injectOnBuild?: boolean;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:24

Default false — Capacitor / VDS HTML must not grow a stray EventSource.

***

### pages?

```ts
optional pages?: Record<string, string>;
```

Defined in: ssr.e/src/ssre/vite/plugin.ts:17
