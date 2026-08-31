/*
 * Filename: client.ts
 * FullPath: modules/projects/ssr.e/test/demo/client.ts
 * FIND:ssre
 *
 * Vite playground entry. Must not import the Node barrel (`src/node.ts`).
 * SSR HTML already inlines hydrate; this is a no-op fallback for index.html.
 */
import { hydrateSsre } from "../../src/ssre/client/hydrate.ts";

if (typeof document !== "undefined" && document.querySelector("#ssre-scenario")) {
    hydrateSsre();
}
