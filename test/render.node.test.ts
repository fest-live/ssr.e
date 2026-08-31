import test from "node:test";
import assert from "node:assert/strict";
import { E, H, T, escapeHtml, renderToString, beginRender } from "../src/index.ts";

test("E renders tag, class, id, and escaped text", () => {
    beginRender();
    const { html } = renderToString(() => E("button.primary#ok", { attributes: { type: "submit" } }, "<raw>"));
    assert.match(html, /<button[^>]*id="ok"/);
    assert.match(html, /class="primary"/);
    assert.match(html, /type="submit"/);
    assert.match(html, /&lt;raw&gt;/);
});

test("T and escapeHtml keep markup inert", () => {
    assert.equal(escapeHtml("<x>"), "&lt;x&gt;");
    beginRender();
    const { html } = renderToString(() => T("<script>"));
    assert.equal(html, "&lt;script&gt;");
});

test("H tagged template interpolates attributes and children", () => {
    beginRender();
    const cls = "note";
    const { html } = renderToString(() => H`<p class="${cls}">hello</p>`);
    assert.match(html, /<p[^>]*class="note"/);
    assert.match(html, />hello<\/p>/);
});

test("void tags do not emit a closer", () => {
    beginRender();
    const { html } = renderToString(() => E("input", { name: "q", attributes: { type: "text" } }));
    assert.match(html, /<input[^>]*\/>/);
    assert.doesNotMatch(html, /<\/input>/);
});
