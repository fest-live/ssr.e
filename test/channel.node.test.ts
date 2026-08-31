import test from "node:test";
import assert from "node:assert/strict";
import { createHub, encodeSse, handleChannelPost, numberRef, parseChannelBody } from "../src/index.ts";

test("hub action mutates a store and broadcasts a set", async () => {
    const hub = createHub();
    const count = hub.store("count", numberRef(0));
    const seen: any[] = [];
    hub.subscribe((msg) => seen.push(msg));
    hub.action("inc", () => { count.value += 1; });
    hub.handle({ t: "action", name: "inc" });
    assert.equal(count.value, 1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(seen.some((msg) => msg.t === "set" && msg.store === "count"), true);
});

test("POST body applies a set onto the store", async () => {
    const hub = createHub();
    const draft = hub.store("draft", { value: "a" });
    const result = await handleChannelPost(hub, JSON.stringify({ t: "set", store: "draft", path: "value", value: "b" }));
    assert.equal(result.ok, true);
    assert.equal(draft.value, "b");
});

test("SSE encoder and parser keep the channel envelope", () => {
    const frame = encodeSse({ t: "set", store: "count", path: "value", value: 2 });
    assert.match(frame, /^data: /);
    const msg = parseChannelBody(frame.slice(6).trim());
    assert.equal(msg?.t, "set");
    assert.equal(msg?.value, 2);
});
