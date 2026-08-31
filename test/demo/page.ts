/*
 * Filename: page.ts
 * FullPath: modules/projects/ssr.e/test/demo/page.ts
 * FIND:ssre
 *
 * Demo page: counter + list + input, served by Vite (`npm run demo`) or Fastify.
 */
import { E, H, Icon, M, cssVars, numberRef, observe, picture, ssre, stringRef, type PageOptions, type ReactiveHub } from "../../src/index.ts";

export const buildDemo = (hub: ReactiveHub): PageOptions => {
    const count = hub.store("count", numberRef(0));
    const items = hub.store("items", observe(["alpha", "beta"]));
    const draft = hub.store("draft", { value: "hello" });
    ssre.attach(hub);
    ssre.server.set("label", stringRef("from server"));
    hub.action("inc", () => { count.value += 1; });
    hub.action("add", () => {
        const next = String(draft.value ?? "").trim();
        if (next) items.push(next);
    });
    return {
        title: "SSR.E demo",
        hub,
        styles: [],
        scripts: ["/test/demo/client.ts"],
        factory: () => {
            cssVars({ "--count": count }, { typed: { "--count": "number" } }, hub);
            return E("main.ssre-demo", { attributes: { style: "font:16px/1.4 sans-serif;max-width:36rem;margin:2rem auto;padding:1rem" } }, [
                E("h1", {}, ["SSR.E ", Icon({ icon: "house", style: "duotone" })]),
                E("p", { css: { pad: numberRef(8) } }, ["Count: ", E("strong", {}, count)]),
                E("button", { type: "button", on: { click: "inc" } }, "+1"),
                E("p", {}, [
                    E("input", { name: "draft", value: draft }),
                    " ",
                    E("button", { type: "button", on: { click: "add" } }, "Add"),
                ]),
                E("ul", {}, M(items, (item) => E("li", {}, item))),
                H`<p class="ssre-server" data-note=${ssre.server.get("label")}>${ssre.server.get("label")}</p>`,
                H`<p class="ssre-client" data-accent=${ssre.client.get("accent")}>client slot</p>`,
                picture("data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120"><rect fill="#e8e8e8" width="100%" height="100%"/><text x="50%" y="54%" text-anchor="middle" font-size="22" fill="#333">SSR.E</text></svg>`), { alt: "Demo", widths: [] }),
            ]);
        },
    };
};

export default function demoPage({ hub }: { hub: ReactiveHub }): PageOptions {
    return buildDemo(hub);
}
