/*
 * Filename: backend.ts
 * FullPath: modules/projects/ssr.e/src/ssre/fs/backend.ts
 * FIND:ssre
 *
 * Backend FS analog of LUR.E OPFS helpers — Node paths, not browser OPFS.
 * SECURITY: all relatives resolve under `root`; `..` cannot escape.
 */
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";

const within = (root: string, target: string): boolean => {
    const rel = relative(root, target);
    return rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !rel.startsWith(".."));
};

export interface FsRoot {
    root: string;
    resolve(rel: string): string;
    exists(rel: string): Promise<boolean>;
    stat(rel: string): Promise<{ size: number; isFile: boolean; isDirectory: boolean }>;
    list(rel?: string): Promise<string[]>;
    readText(rel: string): Promise<string>;
    writeText(rel: string, text: string): Promise<void>;
    readBytes(rel: string): Promise<Buffer>;
    writeBytes(rel: string, data: Buffer | Uint8Array): Promise<void>;
    mkdir(rel: string): Promise<void>;
    remove(rel: string): Promise<void>;
}

export const createFsRoot = (root: string): FsRoot => {
    const base = resolve(root);
    const resolveSafe = (rel = "."): string => {
        const target = resolve(base, rel);
        if (!within(base, target)) throw new Error(`SSR.E FS: path escapes root (${rel})`);
        return target;
    };
    return {
        root: base,
        resolve: resolveSafe,
        async exists(rel) {
            try { await stat(resolveSafe(rel)); return true; }
            catch { return false; }
        },
        async stat(rel) {
            const info = await stat(resolveSafe(rel));
            return { size: info.size, isFile: info.isFile(), isDirectory: info.isDirectory() };
        },
        async list(rel = ".") {
            return readdir(resolveSafe(rel));
        },
        async readText(rel) {
            return readFile(resolveSafe(rel), "utf8");
        },
        async writeText(rel, text) {
            const target = resolveSafe(rel);
            await mkdir(dirname(target), { recursive: true });
            await writeFile(target, text, "utf8");
        },
        async readBytes(rel) {
            return readFile(resolveSafe(rel));
        },
        async writeBytes(rel, data) {
            const target = resolveSafe(rel);
            await mkdir(dirname(target), { recursive: true });
            await writeFile(target, data);
        },
        async mkdir(rel) {
            await mkdir(resolveSafe(rel), { recursive: true });
        },
        async remove(rel) {
            await rm(resolveSafe(rel), { recursive: true, force: true });
        },
    };
};
