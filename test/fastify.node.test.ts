import test from "node:test";
import assert from "node:assert/strict";
import { E, createHub, sendSsre } from "../src/index.ts";

test("sendSsre writes HTML onto a duck-typed Fastify reply", () => {
    const hub = createHub();
    let body = "";
    let type = "";
    const reply = {
        type(value: string) { type = value; return this; },
        header() { return this; },
        send(payload: string) { body = payload; return payload; },
    };
    sendSsre(reply, { title: "Fastify", hub, factory: () => E("p", {}, "ok") }, hub);
    assert.match(type, /text\/html/);
    assert.match(body, /<p[^>]*>ok<\/p>/);
    assert.match(body, /id="ssre-scenario"/);
});
