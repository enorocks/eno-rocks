/** ENO-Tool-URLs (Hub + Rechner) */
export const ENO_TOOL_URLS = {
    hub: '/',
    calories: '/tools/kalorienrechner/',
    macros: '/tools/makrorechner/',
    pedia: '/tools/pedia/',
    exercises: '/tools/uebungen/',
    dailytogether: '/tools/dailytogether/',
} as const;

export type EnoToolId = keyof typeof ENO_TOOL_URLS;

export function toolUrl(id: EnoToolId): string {
    return ENO_TOOL_URLS[id];
}
