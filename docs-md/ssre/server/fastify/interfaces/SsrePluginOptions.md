[**@fest-lib/ssre v0.1.3**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/fastify](../README.md) / SsrePluginOptions

# Interface: SsrePluginOptions

Defined in: ssr.e/src/ssre/server/fastify.ts:17

## Properties

### channel?

```ts
optional channel?: 
  | boolean
  | {
  path?: string;
  protocol?: "sse" | "ws" | "socket.io";
};
```

Defined in: ssr.e/src/ssre/server/fastify.ts:20

***

### hub?

```ts
optional hub?: ReactiveHub;
```

Defined in: ssr.e/src/ssre/server/fastify.ts:18

***

### prefix?

```ts
optional prefix?: string;
```

Defined in: ssr.e/src/ssre/server/fastify.ts:19
