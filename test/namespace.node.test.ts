import test from "node:test";
import assert from "node:assert/strict";
import { H, createHub, renderView, ssre, stringRef } from "../src/index.ts";

test("H interpolates ssre.client.get as a client slot", () => {
    const { html, scenario } = renderView(() => H`<div data-x=${ssre.client.get("ref")}></div>`);
    assert.match(html, /data-ssre-client="ref"/);
    assert.match(html, /data-ssre="/);
    assert.equal(scenario.clientSlots?.[0]?.name, "ref");
    assert.equal(scenario.clientSlots?.[0]?.attr, "data-x");
});

test("ssre.client.get paints a default until client.set", () => {
    const { html } = renderView(() => H`<div data-x=${ssre.client.get("ref", "wait")}></div>`);
    assert.match(html, /data-x="wait"/);
    assert.match(html, /data-ssre-client="ref"/);
});

test("ssre.server.set/get bind through the hub", () => {
    const hub = createHub();
    ssre.attach(hub);
    ssre.server.set("label", stringRef("hi"));
    const { html, scenario } = renderView(() => H`<b data-x=${ssre.server.get("label")}>${ssre.server.get("label")}</b>`, hub);
    assert.match(html, />hi</);
    assert.match(html, /data-x="hi"/);
    assert.ok(scenario.stores.label);
});

test("ssre.client.set applies a ref onto reserved hosts", () => {
    const { scenario } = renderView(() => H`<div data-x=${ssre.client.get("accent")}></div>`);
    const slot = scenario.clientSlots?.[0];
    assert.ok(slot);
    const el: any = { attrs: {}, setAttribute(name: string, value: string) { this.attrs[name] = value; } };
    const prev = (globalThis as any).document;
    (globalThis as any).document = {
        querySelector(sel: string) {
            if (sel === `#ssre-scenario`) return { textContent: JSON.stringify(scenario) };
            if (sel === `[data-ssre="${slot.id}"]`) return el;
            return null;
        },
    };
    try {
        ssre.client.set("accent", stringRef("from client"));
        assert.equal(el.attrs["data-x"], "from client");
    } finally {
        (globalThis as any).document = prev;
    }
});
