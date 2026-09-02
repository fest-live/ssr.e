[**@fest-lib/ssre API Documentation v0.1.5**](../README.md)

***

[@fest-lib/ssre API Documentation](../globals.md) / injectSsreIntoHtml

# Function: injectSsreIntoHtml()

> **injectSsreIntoHtml**(`html`, `options?`): `string`

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
