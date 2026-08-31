/*
 * Filename: index.ts
 * FullPath: modules/projects/ssr.e/src/index.ts
 * FIND:ssre
 *
 * Browser-safe public entry for `@fest-lib/ssre`. No `node:` builtins.
 * Fastify / FS / html-dom peers / Vite plugin: `src/node.ts` or subpath exports.
 */
export { $ssre, $raw, Fragment, VOID_TAGS, isVNode } from "./ssre/node/types.ts";
export type { BindingKind, ChannelConfig, ChannelMessage, Child, CssVarBinding, SsreBinding, SsreClientSlot, SsreKind, SsreParams, SsreScenario, TypedOmEntry, TypedOmHint, VNode } from "./ssre/node/types.ts";
export { $ssreSlot, isSsreSlot, ssre } from "./ssre/core/namespace.ts";
export type { SsreBindWith, SsreSide, SsreSlot } from "./ssre/core/namespace.ts";
export { escapeAttr, escapeHtml, escapeScriptJson } from "./ssre/node/escape.ts";
export { RenderContext, beginRender, createContext, currentContext, withContext } from "./ssre/node/context.ts";
export { E, T, vnode } from "./ssre/node/E.ts";
export { H, html, raw } from "./ssre/node/H.ts";
export { parseBuiltin, parseHtmlFragment, fragmentToVNode } from "./ssre/node/html-parse.ts";
export { Icon } from "./ssre/node/icon.ts";
export type { IconParams } from "./ssre/node/icon.ts";
export { M } from "./ssre/node/M.ts";
export { formatCssValue, normalizeVarName, typedOmMap } from "./ssre/css/typed-om.ts";
export { applyCustomPropertyFallbacks, extractCustomProperties, isScssSource, tryParseCssTree } from "./ssre/css/vanilla.ts";
export { bindNodeCss, cssVars, emitCssBlock, registerCssVar } from "./ssre/css/vars.ts";
export { picture, srcsetFor, widthVariant } from "./ssre/assets/picture.ts";
export type { PictureOptions } from "./ssre/assets/picture.ts";
export { renderChildren, renderNode, renderToString, renderView } from "./ssre/node/render.ts";
export type { RenderResult } from "./ssre/node/render.ts";
export { renderPage, sendSsre } from "./ssre/node/page.ts";
export type { PageOptions, SsreReplyLike } from "./ssre/node/page.ts";
export { jsx, jsxs, jsxDEV, createElement } from "./ssre/node/jsx-runtime.ts";
export { createHub, ReactiveHub } from "./ssre/core/store.ts";
export type { HubSink } from "./ssre/core/store.ts";
export {
    affected,
    booleanRef,
    computed,
    deref,
    getValue,
    hasValue,
    isObservable,
    numberRef,
    observe,
    propRef,
    ref,
    stringRef,
    wrapRef,
    $ref,
} from "./ssre/core/refs.ts";
export { hydrateSsre, runtimeScript } from "./ssre/client/hydrate.ts";
export { encodeSse, handleChannelPost, parseChannelBody } from "./ssre/server/protocol.ts";
