[**@fest-lib/ssre v0.1.11**](../../../../README.md)

***

[@fest-lib/ssre](../../../../README.md) / [ssre/node/html-document](../README.md) / injectSsreIntoHtml

# Function: injectSsreIntoHtml()

```ts
function injectSsreIntoHtml(html, options?): string;
```

Defined in: ssr.e/src/ssre/node/html-document.ts:42

Inject ssre scenario + hydrate into an existing document. Idempotent.
INVARIANT: never wraps a second `<!doctype html>`.

## Parameters

### html

`string`

### options?

[`InjectSsreOptions`](../interfaces/InjectSsreOptions.md) = `{}`

## Returns

`string`
