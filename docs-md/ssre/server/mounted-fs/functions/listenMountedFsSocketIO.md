[**@fest-lib/ssre v0.1.6**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/server/mounted-fs](../README.md) / listenMountedFsSocketIO

# Function: listenMountedFsSocketIO()

```ts
function listenMountedFsSocketIO(
   mounted, 
   server, 
   options?
): Promise<Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>;
```

Defined in: ssr.e/src/ssre/server/mounted-fs.ts:107

## Parameters

### mounted

[`MountedFs`](../../../fs/mounts/type-aliases/MountedFs.md)

### server

`Server`

### options?

`Record`\<`string`, `any`\>

## Returns

`Promise`\<`Server`\<`DefaultEventsMap`, `DefaultEventsMap`, `DefaultEventsMap`, `any`\>\>
