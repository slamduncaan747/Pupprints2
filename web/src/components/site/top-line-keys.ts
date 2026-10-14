/**
 * Shared by the server-rendered top line (its inline "hide if dismissed" script) and the client bar.
 * Kept out of the "use client" module: a server component importing a constant from a client module
 * gets a client-reference proxy, not the string, which broke that inline script.
 */
export const TOP_LINE_ID = "pp-topline";
export const TOP_LINE_STORAGE_KEY = "pp-topline-dismissed";
