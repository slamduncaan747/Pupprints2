/**
 * Admin session primitives. Uses only Web Crypto + process.env so it runs in `proxy.ts`
 * as well as in route handlers and server components (no `server-only`/`@/lib/env` import).
 *
 * The session cookie `pp_admin` holds HMAC-SHA256(ADMIN_PASSWORD, "admin-session"): it can
 * only be produced by someone who knows the password, and rotating the password logs
 * everyone out. When ADMIN_PASSWORD is unset the admin is disabled entirely.
 */

export const ADMIN_COOKIE = "pp_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function adminEnabled(): boolean {
  return adminPassword().length > 0;
}

async function hmacHex(key: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time string comparison (for equal-length hex digests). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** The expected cookie value, or null when admin is disabled. */
export async function adminSessionValue(): Promise<string | null> {
  const pw = adminPassword();
  if (!pw) return null;
  return hmacHex(pw, "admin-session");
}

export async function isValidAdminSession(value: string | null | undefined): Promise<boolean> {
  if (!value) return false;
  const expected = await adminSessionValue();
  return expected !== null && safeEqual(value, expected);
}

/** Timing-safe password check: compares fixed-length HMAC digests, never the raw strings. */
export async function checkAdminPassword(input: string): Promise<boolean> {
  const pw = adminPassword();
  if (!pw || !input) return false;
  const [a, b] = await Promise.all([hmacHex("pp-admin-login", input), hmacHex("pp-admin-login", pw)]);
  return safeEqual(a, b);
}

/** Only allow redirects back into the admin after login. */
export function safeAdminNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/admin") || next.startsWith("//") || next.startsWith("/admin/login")) return "/admin";
  return next;
}
