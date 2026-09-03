[**@fest-lib/ssre v0.1.7**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/mounted-fs](../README.md) / listenMountedFsWs

# Function: listenMountedFsWs()

```ts
function listenMountedFsWs(
   mounted, 
   server, 
   path?
): Promise<Server<typeof WebSocket, typeof IncomingMessage>>;
```

Defined in: ssr.e/src/ssre/server/mounted-fs.ts:96

## Parameters

### mounted

[`MountedFs`](../../../fs/mounts/type-aliases/MountedFs.md)

### server

`Server`

### path?

`string` = `MOUNTED_FS_WS_PATH`

## Returns

`Promise`\<`Server`\<*typeof* `WebSocket`, *typeof* `IncomingMessage`\>\>
