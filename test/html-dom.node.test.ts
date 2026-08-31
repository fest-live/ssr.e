import test from "node:test";
import assert from "node:assert/strict";
import { beginRender, isVNode, renderToString } from "../src/index.ts";
import { availableHtmlEngines, createHtmlDocument, detectHtmlEngine, parseHtmlFragment } from "../src/ssre/node/html-dom.ts";

test("detectHtmlEngine defaults to builtin", () => {
    assert.equal(detectHtmlEngine(), "builtin");
    assert.equal(availableHtmlEngines().includes("builtin"), true);
});

test("builtin fragment parse matches H for a simple tree", () => {
    beginRender();
    const nodes = parseHtmlFragment(`<p class="note">hello</p>`, [], [], "builtin");
    assert.equal(nodes.length, 1);
    assert.equal(isVNode(nodes[0]), true);
    const { html } = renderToString(() => nodes[0] as any);
    assert.match(html, /<p[^>]*class="note"/);
    assert.match(html, />hello<\/p>/);
});

test("createHtmlDocument builtin serializes the source", () => {
    const doc = createHtmlDocument("<p>x</p>", "builtin");
    assert.equal(doc.engine, "builtin");
    assert.equal(doc.serialize(), "<p>x</p>");
});
