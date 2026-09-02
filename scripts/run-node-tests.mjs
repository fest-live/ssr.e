import { rm } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { build } from "vite";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, ".tmp-tests/node");
const entry = resolve(root, "test/ssre.node.test.ts");
const output = resolve(outDir, "ssre.node.test.mjs");

await rm(outDir, { recursive: true, force: true });

await build({
    root,
    configFile: false,
    logLevel: "warn",
    resolve: {
        alias: [
            { find: "@fest-lib/ssre", replacement: resolve(root, "src/index.ts") },
            { find: "@fest-lib/object", replacement: resolve(root, "../object.ts/src/index.ts") },
            { find: "@fest-lib/core", replacement: resolve(root, "../core.ts/src/index.ts") },
            { find: "@fest-lib/uniform/mounted-fs", replacement: resolve(root, "../uniform.ts/src/newer/messaging/MountedFs.ts") },
            { find: "@fest-lib/uniform", replacement: resolve(root, "../uniform.ts/src/index.ts") },
        ],
    },
    build: {
        emptyOutDir: true,
        target: "esnext",
        minify: false,
        sourcemap: "inline",
        outDir,
        ssr: entry,
        rollupOptions: {
            treeshake: false,
            external: [/^node:/],
            output: {
                format: "es",
                entryFileNames: "ssre.node.test.mjs",
            },
        },
    },
});

await new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, ["--test", output], {
        cwd: root,
        stdio: "inherit",
    });
    child.once("error", rejectRun);
    child.once("exit", (code) => code === 0 ? resolveRun(undefined) : rejectRun(new Error(`node --test exited with ${code}`)));
});
