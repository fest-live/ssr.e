[**@fest-lib/ssre v0.1.2**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/html-parse](../README.md) / setHtmlParseHook

# Function: setHtmlParseHook()

```ts
function setHtmlParseHook(hook): void;
```

Defined in: ssre/node/html-parse.ts:20

html-dom.ts installs peer engines here; isomorphic H() stays builtin until then.

## Parameters

### hook

  \| \{
  `engine?`: [`HtmlParseEngine`](../type-aliases/HtmlParseEngine.md);
  `parse?`: [`HtmlPeerParse`](../type-aliases/HtmlPeerParse.md) \| `null`;
\}
  \| `null`

## Returns

`void`
