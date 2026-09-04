[**@fest-lib/ssre v0.1.10**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/html-parse](../README.md) / parseBuiltin

# Function: parseBuiltin()

```ts
function parseBuiltin(
   html, 
   atb?, 
   psh?, 
   start?, 
   stopTag?
): object;
```

Defined in: ssr.e/src/ssre/node/html-parse.ts:66

## Parameters

### html

`string`

### atb?

`any`[] = `[]`

### psh?

`any`[] = `[]`

### start?

`number` = `0`

### stopTag?

`string` \| `null`

## Returns

`object`

### index

```ts
index: number;
```

### nodes

```ts
nodes: Child[];
```
