/*
 * Filename: vite.config.js
 * FullPath: modules/projects/ssr.e/vite.config.js
 * FIND:ssre
 * Change date and time: 04.50.00_01.09.2026
 * Reason for changes: Library build as ssre.js; serve uses the SSR.E Vite plugin for demo pages.
 */
import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";
import { initiate } from "../../shared/vite.config.js";
import { ssreVite } from "./src/ssre/vite/plugin.ts";

export const NAME = "ssre";
export const __dirname = resolve(import.meta.dirname, "./");

export default defineConfig(async ({ command }) => {
    const tsconfig = JSON.parse(await readFile(resolve(__dirname, "./tsconfig.json"), { encoding: "utf8" }));
    const base = initiate(NAME, tsconfig, __dirname, command);
    if (command === "serve") {
        const plugins = Array.isArray(base.plugins) ? base.plugins : [];
        base.plugins = [
            ...plugins,
            ssreVite({
                pages: { "/": resolve(__dirname, "test/demo/page.ts") },
            }),
        ];
        // WHY: shared initiate() prebundles `./src/**/*.ts` for the browser; that
        // graph includes node:fs / node:module and throws `node is not defined`.
        base.optimizeDeps = {
            ...base.optimizeDeps,
            include: [],
            entries: [
                resolve(__dirname, "index.html"),
                resolve(__dirname, "test/demo/client.ts"),
            ],
            exclude: Array.from(new Set([
                ...(base.optimizeDeps?.exclude || []),
                "jsdom",
                "@xmldom/xmldom",
                "node-html-parser",
            ])),
        };
        if (base.build) {
            delete base.build.lib;
            if (base.build.rolldownOptions) delete base.build.rolldownOptions.input;
        }
        if (base.rolldownOptions) delete base.rolldownOptions.input;
        // WHY: top-level appType — `server.appType` is ignored; SPA fallback
        // served index.html for /main.js and the browser executed it as a script.
        base.appType = "mpa";
        if (base.server) base.server.appType = "mpa";
    }
    return base;
});
