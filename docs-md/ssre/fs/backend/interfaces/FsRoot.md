[**@fest-lib/ssre v0.1.11**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/fs/backend](../README.md) / FsRoot

# Interface: FsRoot

Defined in: ssr.e/src/ssre/fs/backend.ts:18

## Properties

### root

```ts
root: string;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:19

## Methods

### exists()

```ts
exists(rel): Promise<boolean>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:21

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<`boolean`\>

***

### list()

```ts
list(rel?): Promise<string[]>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:23

#### Parameters

##### rel?

`string`

#### Returns

`Promise`\<`string`[]\>

***

### listEntries()

```ts
listEntries(rel?): Promise<object[]>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:24

#### Parameters

##### rel?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### mkdir()

```ts
mkdir(rel): Promise<void>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:29

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<`void`\>

***

### readBytes()

```ts
readBytes(rel): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:27

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

***

### readText()

```ts
readText(rel): Promise<string>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:25

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<`string`\>

***

### remove()

```ts
remove(rel): Promise<void>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:30

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<`void`\>

***

### resolve()

```ts
resolve(rel): string;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:20

#### Parameters

##### rel

`string`

#### Returns

`string`

***

### stat()

```ts
stat(rel): Promise<{
  isDirectory: boolean;
  isFile: boolean;
  size: number;
}>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:22

#### Parameters

##### rel

`string`

#### Returns

`Promise`\<\{
  `isDirectory`: `boolean`;
  `isFile`: `boolean`;
  `size`: `number`;
\}\>

***

### writeBytes()

```ts
writeBytes(rel, data): Promise<void>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:28

#### Parameters

##### rel

`string`

##### data

`Buffer`\<`ArrayBufferLike`\> \| `Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`void`\>

***

### writeText()

```ts
writeText(rel, text): Promise<void>;
```

Defined in: ssr.e/src/ssre/fs/backend.ts:26

#### Parameters

##### rel

`string`

##### text

`string`

#### Returns

`Promise`\<`void`\>
