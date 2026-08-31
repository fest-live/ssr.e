import test from "node:test";
import assert from "node:assert/strict";
import { E, M, createHub, hydrateSsre, numberRef, observe, renderPage, renderView } from "../src/index.ts";

test("ref children become text bindings and snapshot the current value", () => {
    const hub = createHub();
    const count = hub.store("count", numberRef(3));
    const { html, scenario } = renderView(() => E("span", {}, count), hub);
    assert.match(html, />3</);
    assert.match(html, /data-ssre="/);
    assert.equal(scenario.stores.count.snapshot, 3);
    assert.equal(scenario.bindings.some((binding) => binding.store === "count" && binding.kind === "text"), true);
});

test("named click actions are serialized onto the node", () => {
    const hub = createHub();
    hub.action("inc", () => {});
    const { html, scenario } = renderView(() => E("button", { on: { click: "inc" } }, "+"), hub);
    assert.match(html, /data-ssre-on-click="inc"/);
    assert.equal(scenario.events.some((event) => event.action === "inc" && event.event === "click"), true);
});

test("M renders the current list and records a mapped host", () => {
    const hub = createHub();
    const items = hub.store("items", observe(["a", "b"]));
    const { html, scenario } = renderView(() => M(items, (item) => E("li", {}, item)), hub);
    assert.match(html, /<li[^>]*>a<\/li>/);
    assert.match(html, /<li[^>]*>b<\/li>/);
    assert.equal(scenario.mapped.length, 1);
});

test("render remembers bindings on the hub for SSE hello", () => {
    const hub = createHub();
    const count = hub.store("count", numberRef(1));
    renderView(() => E("span", {}, count), hub);
    assert.ok(hub.lastScenario);
    assert.equal(hub.lastScenario?.bindings.some((binding) => binding.store === "count" && binding.kind === "text"), true);
});

test("hydrate keeps bindings when SSE hello sends empty lists", () => {
    const strong = { textContent: "0" };
    const scenarioEl = {
        textContent: JSON.stringify({
            version: 1,
            stores: { count: { snapshot: 0 } },
            bindings: [{ id: "n0", kind: "text", store: "count", path: "value" }],
            events: [],
            mapped: [],
        }),
    };
    const doc = {
        querySelector(sel: string) {
            if (sel === "#ssre-scenario") return scenarioEl;
            if (sel === '[data-ssre="n0"]') return strong;
            return null;
        },
        documentElement: { style: { setProperty() {} } },
        addEventListener() {},
    };
    hydrateSsre(doc as any);
    const dispatch = (hydrateSsre as any).dispatch;
    dispatch({ t: "hello", scenario: { version: 1, stores: { count: { snapshot: 0 } }, bindings: [], events: [], mapped: [] } });
    dispatch({ t: "set", store: "count", path: "value", value: 4 });
    assert.equal(strong.textContent, "4");
});

test("renderPage embeds scenario JSON and hydrate runtime", () => {
    const hub = createHub();
    const html = renderPage({
        title: "Probe",
        hub,
        factory: () => E("p", {}, "hi"),
        channel: { url: "/ssre/channel", protocol: "sse" },
    });
    assert.match(html, /<title>Probe<\/title>/);
    assert.match(html, /id="ssre-scenario"/);
    assert.match(html, /"version":1/);
    assert.match(html, /hydrateSsre/);
    assert.match(html, /\/ssre\/channel/);
});
