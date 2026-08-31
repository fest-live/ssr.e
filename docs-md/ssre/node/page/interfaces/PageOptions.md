[**@fest-lib/ssre v0.1.2**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/page](../README.md) / PageOptions

# Interface: PageOptions

Defined in: ssre/node/page.ts:23

## Properties

### body?

```ts
optional body?: 
  | Child
  | (() => Child)
  | RenderResult;
```

Defined in: ssre/node/page.ts:26

***

### channel?

```ts
optional channel?: object;
```

Defined in: ssre/node/page.ts:31

#### protocol?

```ts
optional protocol?: "sse" | "ws" | "socket.io";
```

#### url

```ts
url: string;
```

***

### factory?

```ts
optional factory?: (ctx) => Child;
```

Defined in: ssre/node/page.ts:32

#### Parameters

##### ctx

[`RenderContext`](../../context/classes/RenderContext.md)

#### Returns

[`Child`](../../types/type-aliases/Child.md)

***

### head?

```ts
optional head?: string;
```

Defined in: ssre/node/page.ts:27

***

### hub?

```ts
optional hub?: ReactiveHub;
```

Defined in: ssre/node/page.ts:30

***

### lang?

```ts
optional lang?: string;
```

Defined in: ssre/node/page.ts:25

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: ssre/node/page.ts:29

***

### styles?

```ts
optional styles?: string[];
```

Defined in: ssre/node/page.ts:28

***

### title?

```ts
optional title?: string;
```

Defined in: ssre/node/page.ts:24
