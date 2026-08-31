import test from "node:test";
import assert from "node:assert/strict";
import {
    E,
    Icon,
    applyCustomPropertyFallbacks,
    createHub,
    cssVars,
    emitCssBlock,
    extractCustomProperties,
    formatCssValue,
    isScssSource,
    numberRef,
    picture,
    renderPage,
    renderView,
    srcsetFor,
    stringRef,
} from "../src/index.ts";

test("formatCssValue applies Typed OM hints without SCSS", () => {
    assert.equal(formatCssValue(8, "px"), "8px");
    assert.equal(formatCssValue(50, "percent"), "50%");
    assert.equal(formatCssValue("#abc", "color"), "#abc");
    assert.equal(isScssSource("$x: 1; @mixin foo {}"), true);
    assert.equal(isScssSource(":root { --x: 1px; }"), false);
});

test("extractCustomProperties and fallbacks stay on vanilla CSS", () => {
    const css = ":root { --accent: red; } .x { color: var(--accent); }";
    assert.deepEqual(extractCustomProperties(css).sort(), ["--accent"]);
    assert.match(applyCustomPropertyFallbacks(css, { "--accent": "blue" }), /var\(--accent, blue\)/);
});

test("cssVars emit :root custom properties and scenario map", () => {
    const hub = createHub();
    const pad = hub.store("pad", numberRef(8));
    const html = renderPage({
        title: "css",
        hub,
        factory: () => {
            cssVars({ "--pad": pad }, { typed: { "--pad": "px" } }, hub);
            return E("div", { css: { accent: stringRef("#f00") } }, "hi");
        },
    });
    assert.match(html, /id="ssre-css"/);
    assert.match(html, /--pad:8px/);
    assert.match(html, /--accent:#f00/);
    assert.match(html, /"typedOm"/);
});

test("Icon emits ui-icon name/resource only", () => {
    const hub = createHub();
    const { html } = renderView(() => Icon({ icon: "house", style: "duotone", src: "/icons/house.svg" }), hub);
    assert.match(html, /<ui-icon[^>]*icon="house"/);
    assert.match(html, /icon-style="duotone"/);
    assert.match(html, /resource="\/icons\/house.svg"/);
});

test("picture writes srcset width variants", () => {
    assert.equal(srcsetFor("/a.jpg", [320, 640]), "/a-320w.jpg 320w, /a-640w.jpg 640w");
    const hub = createHub();
    const { html } = renderView(() => picture("/hero.jpg", { alt: "Hero", widths: [640] }), hub);
    assert.match(html, /srcset="\/hero-640w.jpg 640w"/);
    assert.match(html, /alt="Hero"/);
});
