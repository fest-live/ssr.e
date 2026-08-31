/*
 * Filename: escape.ts
 * FullPath: modules/projects/ssr.e/src/ssre/node/escape.ts
 * FIND:ssre
 *
 * HTML / attribute / JSON-in-script escaping. No DOM.
 */

const ATTR: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export const escapeHtml = (value: any): string =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ATTR[ch] ?? ch);

export const escapeAttr = escapeHtml;

/** SECURITY: JSON inside <script> must not close the tag. */
export const escapeScriptJson = (value: any): string =>
    JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
