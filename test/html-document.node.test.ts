import test from "node:test";
import assert from "node:assert/strict";
import { injectSsreIntoHtml, isHtmlDocument, isHtmlPageFile, pageFromHtml, pageOptionsFromHtml } from "../src/index.ts";

const DOC = `<!doctype html><html lang="ru"><head><title>Work</title></head><body><div id="app">ok</div></body></html>`;

test("isHtmlDocument distinguishes full documents from fragments", () => {
    assert.equal(isHtmlDocument(DOC), true);
    assert.equal(isHtmlDocument("<html lang=\"en\"><body>x</body></html>"), true);
    assert.equal(isHtmlDocument("<p>hi</p>"), false);
    assert.equal(isHtmlPageFile("index.html"), true);
    assert.equal(isHtmlPageFile("/pages/base.HTM"), true);
    assert.equal(isHtmlPageFile("test/demo/page.ts"), false);
});

test("pageFromHtml keeps an existing document as the base", () => {
    const out = pageFromHtml(DOC, { channel: { url: "/ssre/channel", protocol: "sse" } });
    assert.match(out, /<!doctype html>/i);
    assert.match(out, /id="app"/);
    assert.match(out, /lang="ru"/);
    assert.match(out, /id="ssre-scenario"/);
    assert.match(out, /\/ssre\/channel/);
    assert.equal((out.match(/<!doctype/gi) || []).length, 1);
});

test("pageFromHtml wraps a fragment once", () => {
    const out = pageFromHtml("<p>x</p>");
    assert.match(out, /<!doctype html>/i);
    assert.match(out, /<p[^>]*>x<\/p>/);
    assert.match(out, /id="ssre-scenario"/);
});

test("injectSsreIntoHtml is idempotent", () => {
    const once = injectSsreIntoHtml(DOC, { channelUrl: "/ssre/channel" });
    const twice = injectSsreIntoHtml(once, { channelUrl: "/ssre/channel" });
    assert.equal((twice.match(/id="ssre-scenario"/g) || []).length, 1);
});

test("pageOptionsFromHtml reads title and body from a document", () => {
    const opts = pageOptionsFromHtml(DOC);
    assert.equal(opts.title, "Work");
    assert.equal(opts.lang, "ru");
    assert.ok(opts.body);
});
