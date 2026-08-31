[**@fest-lib/ssre API Documentation v0.1.0**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / VNode

# Interface: VNode

Defined in: ssre/node/types.ts:48

## Properties

### \[$ssre\]

> **\[$ssre\]**: `true`

Defined in: ssre/node/types.ts:49

***

### kind

> **kind**: [`SsreKind`](../type-aliases/SsreKind.md)

Defined in: ssre/node/types.ts:50

***

### tag?

> `optional` **tag?**: `string`

Defined in: ssre/node/types.ts:51

***

### id?

> `optional` **id?**: `string`

Defined in: ssre/node/types.ts:52

***

### attrs

> **attrs**: `Record`\<`string`, `string`\>

Defined in: ssre/node/types.ts:53

***

### dataset

> **dataset**: `Record`\<`string`, `string`\>

Defined in: ssre/node/types.ts:54

***

### classList

> **classList**: `string`[]

Defined in: ssre/node/types.ts:55

***

### style?

> `optional` **style?**: `string`

Defined in: ssre/node/types.ts:56

***

### children

> **children**: [`Child`](../type-aliases/Child.md)[]

Defined in: ssre/node/types.ts:57

***

### bindings

> **bindings**: [`SsreBinding`](SsreBinding.md)[]

Defined in: ssre/node/types.ts:58

***

### events

> **events**: `SsreOnBinding`[]

Defined in: ssre/node/types.ts:59

***

### source?

> `optional` **source?**: `any`

Defined in: ssre/node/types.ts:60

***

### mapFn?

> `optional` **mapFn?**: (`item`, `index`) => [`Child`](../type-aliases/Child.md)

Defined in: ssre/node/types.ts:61

#### Parameters

##### item

`any`

##### index

`number`

#### Returns

[`Child`](../type-aliases/Child.md)

***

### html?

> `optional` **html?**: `string`

Defined in: ssre/node/types.ts:62
