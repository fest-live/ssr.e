/*
 * Filename: types.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/types.ts
 * FIND:ssre
 * TAG:ssre,vnode
 *
 * VNode model for SSR.E. No DOM constructors — backend HTML only.
 */

export const $ssre = Symbol.for("fest.ssre.node");
export const $raw = Symbol.for("fest.ssre.raw");
export const Fragment = Symbol.for("fest.ssre.Fragment");

export type SsreKind = "element" | "text" | "raw" | "fragment" | "mapped";

export type BindingKind = "text" | "attr" | "prop" | "class" | "style" | "dataset" | "value" | "checked" | "html" | "cssvar";

export type TypedOmHint = "px" | "percent" | "number" | "color" | "length" | "ident" | "raw";

export interface TypedOmEntry {
    type: TypedOmHint;
    target?: string;
}

export interface CssVarBinding {
    name: string;
    store: string;
    path: string;
    host: string;
    typed?: TypedOmHint;
}

export interface SsreBinding {
    id: string;
    kind: BindingKind;
    name?: string;
    store: string;
    path: string;
    host?: string;
}

export interface SsreOnBinding {
    id: string;
    event: string;
    action: string;
}

export interface SsreClientSlot {
    name: string;
    id: string;
    kind: BindingKind;
    attr?: string;
}

export interface VNode {
    [$ssre]: true;
    kind: SsreKind;
    tag?: string;
    id?: string;
    attrs: Record<string, string>;
    dataset: Record<string, string>;
    classList: string[];
    style?: string;
    children: Child[];
    bindings: SsreBinding[];
    events: SsreOnBinding[];
    source?: any;
    mapFn?: (item: any, index: number) => Child;
    html?: string;
}

export type Child = VNode | string | number | boolean | null | undefined | Child[] | { value?: any };

export interface SsreParams {
    classList?: Iterable<string> | string[] | Set<string> | string;
    attributes?: Record<string, any>;
    dataset?: Record<string, any>;
    style?: Record<string, any> | string;
    value?: any;
    checked?: any;
    placeholder?: any;
    name?: any;
    type?: any;
    role?: any;
    slot?: any;
    part?: any;
    hidden?: any;
    id?: any;
    on?: Record<string, any>;
    aria?: Record<string, any>;
    /** Vanilla CSS custom properties (`--accent` or `accent`) bound through object.ts refs. */
    css?: Record<string, any>;
    vars?: Record<string, any>;
    icon?: any;
    src?: any;
    resource?: any;
    [key: string]: any;
}

export interface ChannelConfig {
    url: string;
    protocol: "sse" | "ws" | "socket.io";
}

export interface SsreScenario {
    version: 1;
    stores: Record<string, { snapshot: any }>;
    bindings: SsreBinding[];
    events: SsreOnBinding[];
    mapped: Array<{ id: string; store: string; path: string }>;
    clientSlots?: SsreClientSlot[];
    cssVars?: CssVarBinding[];
    typedOm?: Record<string, TypedOmEntry>;
    channel?: ChannelConfig;
}

export interface ChannelMessage {
    t: "set" | "html" | "event" | "action" | "hello" | "error";
    store?: string;
    path?: string;
    value?: any;
    id?: string;
    name?: string;
    html?: string;
    event?: string;
    args?: any[];
    scenario?: SsreScenario;
    message?: string;
}

export const VOID_TAGS = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
]);

export const isVNode = (value: any): value is VNode =>
    !!value && typeof value === "object" && value[$ssre] === true;
