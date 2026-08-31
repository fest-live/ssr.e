import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createFsRoot } from "../src/ssre/fs/backend.ts";

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
