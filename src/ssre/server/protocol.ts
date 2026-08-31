/*
 * Filename: protocol.ts
 * FullPath: modules/projects/ssr.e/src/ssre/server/protocol.ts
 * FIND:ssre
 * TAG:ssre,channel
 *
 * Channel envelope encode/decode. No `node:http` — safe for the public barrel.
 */
import type { ChannelMessage } from "../node/types.ts";
import type { ReactiveHub } from "../core/store.ts";

export const encodeSse = (msg: ChannelMessage): string =>
    `data: ${JSON.stringify(msg)}\n\n`;

export const parseChannelBody = (raw: string): ChannelMessage | null => {
    try {
        const msg = JSON.parse(raw);
        if (!msg || typeof msg !== "object" || typeof msg.t !== "string") return null;
        return msg as ChannelMessage;
    } catch {
        return null;
    }
};

export const handleChannelPost = async (hub: ReactiveHub, raw: string): Promise<{ ok: boolean }> => {
    const msg = parseChannelBody(raw);
    if (!msg) return { ok: false };
    hub.handle(msg);
    return { ok: true };
};
