import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFsRoot } from "../src/ssre/fs/backend.ts";
import { createMountedFs } from "../src/ssre/fs/mounts.ts";

test("backend FS reads and writes under the root", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ssre-fs-"));
    const fs = createFsRoot(dir);
    await fs.writeText("note.txt", "hello");
    assert.equal(await fs.readText("note.txt"), "hello");
    assert.equal(await fs.exists("note.txt"), true);
    assert.deepEqual(await fs.list("."), ["note.txt"]);
    await rm(dir, { recursive: true, force: true });
});

test("backend FS rejects path escape", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ssre-fs-"));
    const fs = createFsRoot(dir);
    await assert.rejects(() => fs.readText("../secret"));
    await rm(dir, { recursive: true, force: true });
});

test("mounted /assets/ lists and reads, and rejects escape", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ssre-mount-"));
    const assets = join(dir, "assets");
    const secret = join(dir, "secret.txt");
    const { mkdir, writeFile } = await import("node:fs/promises");
    await mkdir(assets);
    await writeFile(join(assets, "logo.svg"), "<svg/>");
    await writeFile(secret, "nope");
    const mounted = createMountedFs([{ virtual: "/assets/", root: assets, writable: false }]);
    const listed = await mounted.handle({ t: "fs", id: "1", op: "list", path: "/assets/" });
    assert.equal(listed.ok, true);
    assert.equal(listed.entries?.[0]?.name, "logo.svg");
    assert.equal(listed.entries?.[0]?.path, "/assets/logo.svg");
    const read = await mounted.handle({ t: "fs", id: "2", op: "read", path: "/assets/logo.svg" });
    assert.equal(read.ok, true);
    assert.equal(Buffer.from(read.file?.body || "", "base64").toString("utf8"), "<svg/>");
    const escaped = await mounted.handle({ t: "fs", id: "3", op: "read", path: "/assets/../secret.txt" });
    assert.equal(escaped.ok, false);
    const write = await mounted.handle({
        t: "fs",
        id: "4",
        op: "write",
        path: "/assets/x.txt",
        file: { name: "x.txt", type: "text/plain", encoding: "utf8", body: "x" }
    });
    assert.equal(write.ok, false);
    await rm(dir, { recursive: true, force: true });
});
