/*
 * Filename: hydrate.ts
 * FullPath: modules/projects/ssr.e/src/ssre/client/hydrate.ts
 * FIND:ssre
 *
 * Browser bootstrap for a scripted scenario. No LUR.E / DOM library required.
 * INVARIANT: this function must stay import-free so runtimeScript() can stringify it.
 */

export function hydrateSsre(root?: Document | Element): void {
    const doc = (root && (root as Document).querySelector ? root as Document : (root as Element | undefined)?.ownerDocument) ?? document;
    const script = doc.querySelector("#ssre-scenario");
    if (!script) return;
    let scenario: any;
    try { scenario = JSON.parse(script.textContent || "{}"); } catch { return; }

    const stores: Record<string, any> = {};
    for (const [name, entry] of Object.entries(scenario.stores || {})) {
        stores[name] = (entry as any)?.snapshot;
    }

    const readPath = (store: string, path: string) => {
        const snap = stores[store];
        if (snap == null) return "";
        if (path === "" || path == null) return snap;
        if (typeof snap === "object" && path in snap) return (snap as any)[path];
        return snap;
    };

    const formatCss = (value: any, typed: any) => {
        const hint = typeof typed === "string" ? typed : typed?.type;
        if (value == null) return "";
        if (hint === "px" || hint === "length") return `${Number(value) || 0}px`;
        if (hint === "percent") return `${Number(value) || 0}%`;
        if (hint === "number") return String(Number(value) || 0);
        return String(value);
    };

    const applyCssVar = (item: any, value: any) => {
        const typed = (scenario.typedOm || {})[item.name] || item.typed;
        const formatted = formatCss(value, typed);
        const host = !item.host || item.host === ":root"
            ? doc.documentElement
            : (doc.querySelector(item.host) as HTMLElement | null);
        if (!host) return;
        host.style.setProperty(item.name, formatted);
        const cssApi = (globalThis as any).CSS;
        const map = (host as any).attributeStyleMap;
        const kind = typeof typed === "string" ? typed : typed?.type;
        if (map && cssApi) {
            try {
                if (kind === "px" && cssApi.px) map.set(item.name, cssApi.px(Number(value) || 0));
                else if (kind === "percent" && cssApi.percent) map.set(item.name, cssApi.percent(Number(value) || 0));
                else if (kind === "number" && cssApi.number) map.set(item.name, cssApi.number(Number(value) || 0));
            } catch {}
        }
    };

    const applyBinding = (binding: any, value: any) => {
        if (binding.kind === "cssvar") {
            applyCssVar(binding, value);
            return;
        }
        const el = doc.querySelector(`[data-ssre="${binding.id}"]`);
        if (!el) return;
        const text = value == null ? "" : String(value);
        if (binding.kind === "text") el.textContent = text;
        else if (binding.kind === "html") (el as HTMLElement).innerHTML = text;
        else if (binding.kind === "value") (el as HTMLInputElement).value = text;
        else if (binding.kind === "checked") (el as HTMLInputElement).checked = !!value;
        else if (binding.kind === "style") (el as HTMLElement).setAttribute("style", text);
        else if (binding.kind === "class") (el as HTMLElement).className = text;
        else if (binding.kind === "dataset" && binding.name) (el as HTMLElement).dataset[binding.name] = text;
        else if (binding.name) el.setAttribute(binding.name, text);
    };

    const nsSlot = Symbol.for("fest.ssre.ns");
    const bag = ((globalThis as any)[nsSlot] ??= { clientSlots: [] as any[] });
    if (Array.isArray(scenario.clientSlots)) bag.clientSlots = scenario.clientSlots;

    const applySet = (store: string, path: string, value: any) => {
        const snap = stores[store];
        if (snap != null && typeof snap === "object" && path && path !== "value") (snap as any)[path] = value;
        else stores[store] = value;
        const next = readPath(store, path || "value");
        for (const binding of scenario.bindings || []) {
            if (binding.store === store) applyBinding(binding, path && path !== "value" && binding.path !== path ? readPath(store, binding.path) : next);
        }
        for (const item of scenario.cssVars || []) {
            if (item.store === store) applyCssVar(item, path && path !== "value" && item.path !== path ? readPath(store, item.path) : next);
        }
        bag.onServerSet?.(store, path, value);
    };

    const keepList = (incoming: any, current: any) =>
        Array.isArray(incoming) && incoming.length ? incoming : current;

    const onHello = (incoming: any) => {
        if (!incoming || typeof incoming !== "object") return;
        scenario = {
            ...scenario,
            ...incoming,
            stores: incoming.stores && Object.keys(incoming.stores).length ? incoming.stores : scenario.stores,
            bindings: keepList(incoming.bindings, scenario.bindings),
            events: keepList(incoming.events, scenario.events),
            mapped: keepList(incoming.mapped, scenario.mapped),
            clientSlots: keepList(incoming.clientSlots, scenario.clientSlots),
            cssVars: keepList(incoming.cssVars, scenario.cssVars),
            channel: incoming.channel ?? scenario.channel,
        };
        for (const [name, entry] of Object.entries(scenario.stores || {})) {
            stores[name] = (entry as any)?.snapshot;
        }
        if (Array.isArray(scenario.clientSlots)) bag.clientSlots = scenario.clientSlots;
    };

    const send = (msg: any) => {
        const channel = scenario.channel;
        if (!channel?.url) return;
        if (channel.protocol === "ws") {
            const sock: WebSocket | undefined = (hydrateSsre as any)._ws;
            sock?.readyState === 1 ? sock.send(JSON.stringify(msg)) : undefined;
            return;
        }
        if (channel.protocol === "socket.io") {
            (hydrateSsre as any)._io?.emit?.("ssre", msg);
            return;
        }
        try {
            fetch(channel.url, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(msg),
            });
        } catch {}
    };

    const onMessage = (msg: any) => {
        if (!msg || typeof msg !== "object") return;
        if (msg.t === "set" && msg.store) applySet(msg.store, msg.path || "value", msg.value);
        if (msg.t === "html" && msg.id) {
            const el = doc.querySelector(`[data-ssre="${msg.id}"]`);
            if (el) el.innerHTML = msg.html || "";
        }
        if (msg.t === "hello" && msg.scenario) onHello(msg.scenario);
    };

    const connect = () => {
        const channel = scenario.channel;
        if (!channel?.url) return;
        if (channel.protocol === "socket.io") {
            const io = (globalThis as any).io;
            if (typeof io === "function") {
                const sock = io(channel.url);
                (hydrateSsre as any)._io = sock;
                sock.on?.("ssre", onMessage);
                return;
            }
        }
        if (channel.protocol === "ws") {
            const ws = new WebSocket(channel.url.replace(/^http/, "ws"));
            (hydrateSsre as any)._ws = ws;
            ws.addEventListener("message", (ev) => {
                try { onMessage(JSON.parse(String(ev.data))); } catch {}
            });
            return;
        }
        if (typeof EventSource === "undefined") return;
        const src = new EventSource(channel.url);
        src.addEventListener("message", (ev) => {
            try { onMessage(JSON.parse(ev.data)); } catch {}
        });
    };

    for (const item of scenario.cssVars || []) applyCssVar(item, readPath(item.store, item.path));

    for (const binding of scenario.bindings || []) {
        applyBinding(binding, readPath(binding.store, binding.path));
        const el = doc.querySelector(`[data-ssre="${binding.id}"]`);
        if (!el) continue;
        if (binding.kind === "value" || binding.kind === "checked") {
            const emit = () => send({
                t: "set",
                store: binding.store,
                path: binding.path,
                value: binding.kind === "checked" ? (el as HTMLInputElement).checked : (el as HTMLInputElement).value,
            });
            el.addEventListener("input", emit);
            el.addEventListener("change", emit);
        }
    }

    doc.addEventListener("click", (ev) => {
        const target = (ev.target as Element | null)?.closest?.("[data-ssre]");
        if (!target) return;
        for (const attr of Array.from(target.attributes)) {
            if (!attr.name.startsWith("data-ssre-on-")) continue;
            send({ t: "action", name: attr.value, id: target.getAttribute("data-ssre") });
        }
    });

    connect();
    (hydrateSsre as any).dispatch = onMessage;
    (globalThis as any).__ssreHydrate = hydrateSsre;
    (globalThis as any).__ssreDispatch = onMessage;
}

export const runtimeScript = (): string => `(${hydrateSsre.toString()})();`;
