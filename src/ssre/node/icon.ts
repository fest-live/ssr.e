/*
 * Filename: icon.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/icon.ts
 * FIND:ssre
 *
 * ui-icon is a client component (`@fest-lib/icon`). SSR.E only emits the
 * custom element plus name / resource path — no icon drawing on the server.
 */
import { E } from "./E.ts";
import type { VNode } from "./types.ts";

export interface IconParams {
    icon?: any;
    name?: any;
    src?: any;
    resource?: any;
    style?: any;
    size?: any;
    classList?: string[] | Set<string> | string;
}

export const Icon = (params: IconParams = {}): VNode =>
    E("ui-icon", {
        classList: params.classList,
        icon: params.icon ?? params.name,
        attributes: {
            icon: params.icon ?? params.name,
            "icon-style": params.style,
            resource: params.src ?? params.resource,
            size: params.size,
        },
    });
