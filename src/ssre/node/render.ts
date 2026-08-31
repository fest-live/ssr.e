/*
 * Filename: render.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/render.ts
 * FIND:ssre
 *
 * VNode → HTML string. Collects the reactive scenario for the client runtime.
 */
import { getValue, hasValue } from "@fest-lib/core";
import { isSsreSlot } from "../core/namespace.ts";
import { bindMappedRenderer } from "./M.ts";
import { T } from "./E.ts";
import { beginRender, currentContext, withContext, type RenderContext } from "./context.ts";
import { escapeAttr, escapeHtml } from "./escape.ts";
import { isVNode, VOID_TAGS, type Child, type SsreScenario, type VNode } from "./types.ts";
import type { ReactiveHub } from "../core/store.ts";

const renderChild = (child: Child): string => {
    if (child == null || child === false) return "";
    if (isSsreSlot(child)) return renderChild(T(child));
    if (isVNode(child)) return renderNode(child);
    if (Array.isArray(child)) return child.map(renderChild).join("");
    if (hasValue(child) && !isVNode(child)) return escapeHtml(getValue(child));
    if (typeof child === "function") return renderChild((child as () => Child)());
    return escapeHtml(child);
};

export const renderChildren = (children: Child[]): string => children.map(renderChild).join("");

bindMappedRenderer(renderChildren);

const hostAttrs = (node: VNode): string => {
    const attrs: string[] = [];
    if (node.id) attrs.push(`data-ssre="${escapeAttr(node.id)}"`);
    for (const [key, value] of Object.entries(node.attrs)) {
        if (value === "") attrs.push(key);
        else attrs.push(`${key}="${escapeAttr(value)}"`);
    }
    for (const [key, value] of Object.entries(node.dataset)) {
        attrs.push(`data-${key}="${escapeAttr(value)}"`);
    }
    if (node.classList.length) attrs.push(`class="${escapeAttr(node.classList.join(" "))}"`);
    if (node.style) attrs.push(`style="${escapeAttr(node.style)}"`);
    for (const event of node.events) {
        attrs.push(`data-ssre-on-${escapeAttr(event.event)}="${escapeAttr(event.action)}"`);
    }
    return attrs.length ? ` ${attrs.join(" ")}` : "";
};

export const renderNode = (node: VNode): string => {
    if (node.kind === "text") return renderChildren(node.children);
    if (node.kind === "raw") return node.html ?? "";
    if (node.kind === "fragment") return renderChildren(node.children);
    if (node.kind === "mapped") {
        const inner = renderChildren(node.children);
        return `<span data-ssre="${escapeAttr(node.id || "")}" data-ssre-map="1">${inner}</span>`;
    }
    const tag = node.tag || "div";
    const open = `<${tag}${hostAttrs(node)}>`;
    if (VOID_TAGS.has(tag)) return open.replace(/>$/, " />");
    return `${open}${renderChildren(node.children)}</${tag}>`;
};

export interface RenderResult {
    html: string;
    scenario: SsreScenario;
    context: RenderContext;
}

export const renderToString = (node: Child | (() => Child), hub?: ReactiveHub): RenderResult => {
    const ctx = currentContext().hub === hub || !hub ? currentContext() : beginRender(hub);
    const run = () => {
        const tree = typeof node === "function" ? (node as () => Child)() : node;
        return { html: renderChild(tree), scenario: ctx.toScenario(), context: ctx };
    };
    return withContext(ctx, run);
};

export const renderView = (factory: (ctx: RenderContext) => Child, hub?: ReactiveHub): RenderResult => {
    const ctx = beginRender(hub);
    return withContext(ctx, () => {
        const tree = factory(ctx);
        return { html: renderChild(tree), scenario: ctx.toScenario(), context: ctx };
    });
};
