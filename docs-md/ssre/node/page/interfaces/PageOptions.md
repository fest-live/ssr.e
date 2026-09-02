[**@fest-lib/ssre v0.1.5**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/page](../README.md) / PageOptions

# Interface: PageOptions

Defined in: ssr.e/src/ssre/node/page.ts:25

## Properties

### body?

```ts
optional body?: 
  | Child
  | (() => Child)
  | RenderResult;
```

Defined in: ssr.e/src/ssre/node/page.ts:28

***

### channel?

```ts
optional channel?: object;
```

Defined in: ssr.e/src/ssre/node/page.ts:33

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

Defined in: ssr.e/src/ssre/node/page.ts:34

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

Defined in: ssr.e/src/ssre/node/page.ts:29

***

### hub?

```ts
optional hub?: ReactiveHub;
```

Defined in: ssr.e/src/ssre/node/page.ts:32

***

### lang?

```ts
optional lang?: string;
```

Defined in: ssr.e/src/ssre/node/page.ts:27

***

### scripts?

```ts
optional scripts?: string[];
```

Defined in: ssr.e/src/ssre/node/page.ts:31

***

### styles?

```ts
optional styles?: string[];
```

Defined in: ssr.e/src/ssre/node/page.ts:30

***

### title?

```ts
optional title?: string;
```

Defined in: ssr.e/src/ssre/node/page.ts:26
