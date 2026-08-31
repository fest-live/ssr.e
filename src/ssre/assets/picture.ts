/*
 * Filename: picture.ts
 * FullPath: modules/projects/ssr.e/src/ssre/assets/picture.ts
 * FIND:ssre
 *
 * Adaptive <img srcset>. Widths are URL conventions unless a canvas peer
 * pre-renders variants into the backend FS root.
 */
import { E } from "../node/E.ts";
import type { VNode } from "../node/types.ts";

export interface PictureOptions {
    alt?: string;
    widths?: number[];
    sizes?: string;
    classList?: string[] | Set<string> | string;
    loading?: "lazy" | "eager";
}

export const widthVariant = (src: string, width: number): string => {
    const query = src.includes("?");
    const ext = src.lastIndexOf(".");
    if (!query && ext > 0 && ext > src.lastIndexOf("/")) {
        return `${src.slice(0, ext)}-${width}w${src.slice(ext)}`;
    }
    const sep = query ? "&" : "?";
    return `${src}${sep}w=${width}`;
};

export const srcsetFor = (src: string, widths: number[]): string =>
    widths.map((width) => `${widthVariant(src, width)} ${width}w`).join(", ");

export const picture = (src: string, options: PictureOptions = {}): VNode => {
    const widths = options.widths ?? [640, 1280];
    return E("img", {
        classList: options.classList,
        attributes: {
            src,
            ...(widths.length ? { srcset: srcsetFor(src, widths), sizes: options.sizes ?? "100vw" } : {}),
            alt: options.alt ?? "",
            loading: options.loading ?? "lazy",
        },
    });
};
