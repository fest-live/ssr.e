/*
 * Filename: jsx-runtime.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/jsx-runtime.ts
 * FIND:ssre
 *
 * Server JSX → E(). Optional; pages can stay on H/E without a JSX transform.
 */
import { E } from "./E.ts";
import { Fragment } from "./types.ts";

export { Fragment };

export const jsx = (type: any, props: any = {}) => {
    const { children, ...rest } = props ?? {};
    return E(type, rest, children);
};

export const jsxs = jsx;
export const jsxDEV = jsx;
export const createElement = (type: any, props: any = {}, ...children: any[]) =>
    E(type, props ?? {}, children.length <= 1 ? children[0] : children);
