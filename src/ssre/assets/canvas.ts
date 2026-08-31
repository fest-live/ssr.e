/*
 * Filename: canvas.ts
 * FullPath: modules/projects/ssr.e/src/ssre/assets/canvas.ts
 * FIND:ssre
 *
 * Optional image pre-process. Prefers @napi-rs/canvas, then node-canvas.
 * Returns null when neither peer is installed.
 */
export interface ResizeImageOptions {
    width: number;
    height?: number;
    mime?: "image/png" | "image/jpeg" | "image/webp";
}

const loadCanvas = async (): Promise<any | null> => {
    try { return await import("@napi-rs/canvas"); } catch {}
    try { return await import("canvas"); } catch {}
    return null;
};

export const resizeImageBuffer = async (input: Buffer, options: ResizeImageOptions): Promise<Buffer | null> => {
    const canvasMod = await loadCanvas();
    if (!canvasMod) return null;
    const loadImage = canvasMod.loadImage;
    const createCanvas = canvasMod.createCanvas;
    if (typeof loadImage !== "function" || typeof createCanvas !== "function") return null;
    const image = await loadImage(input);
    const width = options.width;
    const height = options.height ?? Math.max(1, Math.round(image.height * (width / image.width)));
    const canvas = createCanvas(width, height);
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    const mime = options.mime ?? "image/png";
    if (typeof canvas.toBuffer === "function") {
        try { return canvas.toBuffer(mime); } catch { return canvas.toBuffer("image/png"); }
    }
    return null;
};
