/*
 * Filename: refs.ts
 * FullPath: modules/projects/ssr.e/src/ssre/core/refs.ts
 * FIND:ssre
 *
 * Re-export object.ts primitives so SSR pages use one import surface.
 */
export {
    affected,
    booleanRef,
    computed,
    isObservable,
    numberRef,
    observe,
    propRef,
    ref,
    stringRef,
    wrapRef,
    $ref,
} from "@fest-lib/object";
export { deref, getValue, hasValue } from "@fest-lib/core";
