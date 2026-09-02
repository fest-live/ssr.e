/*
 * Filename: mounts.ts
 * FullPath: modules/projects/ssr.e/src/ssre/fs/mounts.ts
 * FIND:mounted-fs
 * TAG:ssre,provide
 *
 * Allowed virtual roots → Node `FsRoot`. `/assets/` is the default host mount.
 * SECURITY: every path is resolved inside its mount; `..` cannot escape.
 */

import {
    createMountedFsId,
    isMountedFsRequest,
    type MountedFsEntry,
    type MountedFsRequest,
    type MountedFsResponse
} from "@fest-lib/core";
import { createFsRoot, type FsRoot } from "./backend.ts";

export type MountSpec = {
    virtual: string;
    root: string;
    writable?: boolean;
};

export type MountedFs = {
    mounts(): Array<{ virtual: string; writable: boolean }>;
    match(virtualPath: string): { spec: MountSpec; fs: FsRoot; rel: string } | null;
    handle(req: MountedFsRequest): Promise<MountedFsResponse>;
};

const normalizeVirtual = (root: string): string => {
    const raw = String(root || "").trim() || "/";
    if (raw === "/") return "/";
    return raw.endsWith("/") ? raw : `${raw}/`;
};

const stripVirtual = (path: string, root: string): string => {
    const p = String(path || "").trim() || "/";
    const key = normalizeVirtual(root);
    if (key === "/") return p.replace(/^\/+/, "") || ".";
    if (p === key.slice(0, -1) || p === key) return ".";
    if (p.startsWith(key)) return p.slice(key.length).replace(/^\/+/, "") || ".";
    return p.replace(/^\/+/, "") || ".";
};

const guessType = (name: string): string => {
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    const map: Record<string, string> = {
        ".md": "text/markdown",
        ".txt": "text/plain",
        ".json": "application/json",
        ".css": "text/css",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".woff2": "font/woff2",
        ".html": "text/html"
    };
    return map[ext] || "application/octet-stream";
};

const fail = (id: string, op: MountedFsRequest["op"], error: string): MountedFsResponse => ({
    t: "fs-result",
    id,
    ok: false,
    op,
    error
});

export const createMountedFs = (specs: MountSpec[]): MountedFs => {
    const mounts = specs
        .filter((spec) => spec?.virtual && spec?.root)
        .map((spec) => ({
            spec: { ...spec, virtual: normalizeVirtual(spec.virtual), writable: !!spec.writable },
            fs: createFsRoot(spec.root)
        }))
        .sort((a, b) => b.spec.virtual.length - a.spec.virtual.length);

    const match = (virtualPath: string): { spec: MountSpec; fs: FsRoot; rel: string } | null => {
        const p = String(virtualPath || "").trim() || "/";
        for (const mount of mounts) {
            const key = mount.spec.virtual;
            if (p === key.slice(0, -1) || p === key || p.startsWith(key)) {
                return { spec: mount.spec, fs: mount.fs, rel: stripVirtual(p, key) };
            }
        }
        return null;
    };

    const handle = async (req: MountedFsRequest): Promise<MountedFsResponse> => {
        const id = req.id || createMountedFsId();
        const op = req.op;
        if (op === "mounts") {
            return {
                t: "fs-result",
                id,
                ok: true,
                op,
                mounts: mounts.map(({ spec }) => ({ virtual: spec.virtual, writable: !!spec.writable }))
            };
        }
        const path = String(req.path || "").trim();
        if (!path) return fail(id, op, "path required");
        const hit = match(path);
        if (!hit) return fail(id, op, `no mount for ${path}`);
        const writable = !!hit.spec.writable;
        try {
            if (op === "list") {
                const rows = await hit.fs.listEntries(hit.rel);
                const base = path.endsWith("/") || hit.rel === "." ? (path.endsWith("/") ? path : `${path}/`) : `${path}/`;
                const entries: MountedFsEntry[] = rows.map((row) => ({
                    name: row.name,
                    kind: row.kind,
                    size: row.size,
                    path: `${base}${row.name}${row.kind === "directory" ? "/" : ""}`
                }));
                return { t: "fs-result", id, ok: true, op, path, entries };
            }
            if (op === "stat") {
                const stat = await hit.fs.stat(hit.rel);
                return { t: "fs-result", id, ok: true, op, path, stat };
            }
            if (op === "read") {
                const bytes = await hit.fs.readBytes(hit.rel);
                const name = path.split("/").filter(Boolean).pop() || "file";
                return {
                    t: "fs-result",
                    id,
                    ok: true,
                    op,
                    path,
                    file: {
                        name,
                        type: guessType(name),
                        encoding: "base64",
                        body: Buffer.from(bytes).toString("base64")
                    }
                };
            }
            if (!writable) return fail(id, op, `${hit.spec.virtual} is read-only`);
            if (op === "write") {
                const body = req.file?.body;
                if (body == null) return fail(id, op, "file body required");
                const bytes = Buffer.from(body, req.file?.encoding === "utf8" ? "utf8" : "base64");
                await hit.fs.writeBytes(hit.rel, bytes);
                return { t: "fs-result", id, ok: true, op, path };
            }
            if (op === "mkdir") {
                await hit.fs.mkdir(hit.rel);
                return { t: "fs-result", id, ok: true, op, path };
            }
            if (op === "remove") {
                await hit.fs.remove(hit.rel);
                return { t: "fs-result", id, ok: true, op, path };
            }
            return fail(id, op, `unknown op ${op}`);
        } catch (error) {
            return fail(id, op, error instanceof Error ? error.message : String(error));
        }
    };

    return { mounts: () => mounts.map(({ spec }) => ({ virtual: spec.virtual, writable: !!spec.writable })), match, handle };
};

export const handleMountedFsMessage = async (
    mounted: MountedFs,
    raw: unknown
): Promise<MountedFsResponse | null> => {
    const req = typeof raw === "string"
        ? (() => { try { return JSON.parse(raw); } catch { return null; } })()
        : raw;
    if (!isMountedFsRequest(req)) return null;
    return mounted.handle(req);
};
