[**@fest-lib/ssre v0.1.12**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/fs/mounts](../README.md) / MountedFs

# Type Alias: MountedFs

```ts
type MountedFs = object;
```

Defined in: ssr.e/src/ssre/fs/mounts.ts:26

## Methods

### handle()

```ts
handle(req): Promise<MountedFsResponse>;
```

Defined in: ssr.e/src/ssre/fs/mounts.ts:29

#### Parameters

##### req

`MountedFsRequest`

#### Returns

`Promise`\<`MountedFsResponse`\>

***

### match()

```ts
match(virtualPath): 
  | {
  fs: FsRoot;
  rel: string;
  spec: MountSpec;
}
  | null;
```

Defined in: ssr.e/src/ssre/fs/mounts.ts:28

#### Parameters

##### virtualPath

`string`

#### Returns

  \| \{
  `fs`: [`FsRoot`](../../backend/interfaces/FsRoot.md);
  `rel`: `string`;
  `spec`: [`MountSpec`](MountSpec.md);
\}
  \| `null`

***

### mounts()

```ts
mounts(): object[];
```

Defined in: ssr.e/src/ssre/fs/mounts.ts:27

#### Returns

`object`[]
