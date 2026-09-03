[**@fest-lib/ssre v0.1.7**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/fastify](../README.md) / SsrePluginOptions

# Interface: SsrePluginOptions

Defined in: ssr.e/src/ssre/server/fastify.ts:19

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

Defined in: ssr.e/src/ssre/server/fastify.ts:22

***

### fs?

```ts
optional fs?: 
  | boolean
  | object & AttachMountedFsOptions;
```

Defined in: ssr.e/src/ssre/server/fastify.ts:24

Allowed Node mounts (`/assets/` → disk). Served over HTTPS + WS / Socket.IO.

***

### hub?

```ts
optional hub?: ReactiveHub;
```

Defined in: ssr.e/src/ssre/server/fastify.ts:20

***

### prefix?

```ts
optional prefix?: string;
```

Defined in: ssr.e/src/ssre/server/fastify.ts:21
