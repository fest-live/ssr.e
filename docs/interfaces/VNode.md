[**@fest-lib/ssre API Documentation v0.1.12**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / VNode

# Interface: VNode

Defined in: ssr.e/src/ssre/node/types.ts:55

## Properties

### \[$ssre\]

> **\[$ssre\]**: `true`

Defined in: ssr.e/src/ssre/node/types.ts:56

***

### kind

> **kind**: [`SsreKind`](../type-aliases/SsreKind.md)

Defined in: ssr.e/src/ssre/node/types.ts:57

***

### tag?

> `optional` **tag?**: `string`

Defined in: ssr.e/src/ssre/node/types.ts:58

***

### id?

> `optional` **id?**: `string`

Defined in: ssr.e/src/ssre/node/types.ts:59

***

### attrs

> **attrs**: `Record`\<`string`, `string`\>

Defined in: ssr.e/src/ssre/node/types.ts:60

***

### dataset

> **dataset**: `Record`\<`string`, `string`\>

Defined in: ssr.e/src/ssre/node/types.ts:61

***

### classList

> **classList**: `string`[]

Defined in: ssr.e/src/ssre/node/types.ts:62

***

### style?

> `optional` **style?**: `string`

Defined in: ssr.e/src/ssre/node/types.ts:63

***

### children

> **children**: [`Child`](../type-aliases/Child.md)[]

Defined in: ssr.e/src/ssre/node/types.ts:64

***

### bindings

> **bindings**: [`SsreBinding`](SsreBinding.md)[]

Defined in: ssr.e/src/ssre/node/types.ts:65

***

### events

> **events**: `SsreOnBinding`[]

Defined in: ssr.e/src/ssre/node/types.ts:66

***

### source?

> `optional` **source?**: `any`

Defined in: ssr.e/src/ssre/node/types.ts:67

***

### mapFn?

> `optional` **mapFn?**: (`item`, `index`) => [`Child`](../type-aliases/Child.md)

Defined in: ssr.e/src/ssre/node/types.ts:68

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

Defined in: ssr.e/src/ssre/node/types.ts:69
