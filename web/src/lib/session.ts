import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * Anonymous visitor session + IP hashing.
 *
 * - `pp_sid` is an opaque random UUID in an httpOnly cookie. It scopes uploads and
 *   generations to a browser without requiring an account. It is a bearer token for
 *   that browser's previews only, so it is unguessable but not signed.
 * - IPs are never stored raw: we keep an HMAC so we can rate-limit per IP.
 */

export const SESSION_COOKIE = "pp_sid";
const SESSION_MAX_AGE = 60 * 60 * 24 * 180; // 180 days
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidSessionId(value: string | undefined | null): value is string {
  return Boolean(value && UUID_RE.test(value));
}

/** Read the current session id, or null if the visitor has none yet. */
export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  const value = store.get(SESSION_COOKIE)?.value;
  return isValidSessionId(value) ? value : null;
}

/**
 * Return the session id, creating + setting the cookie if missing.
 * Only call from Route Handlers or Server Functions (cookies can't be set while rendering).
 */
export async function ensureSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (isValidSessionId(existing)) return existing;
  const id = randomUUID();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return id;
}

/** Best-effort client IP. On Vercel `x-forwarded-for` is set by the platform. */
export function getClientIp(source: Request | Headers): string {
  const headers = source instanceof Headers ? source : source.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || headers.get("cf-connecting-ip")?.trim() || "unknown";
}

function ipSalt() {
  return process.env.IP_HASH_SALT || env.supabaseServerKey || "pupprints-ip-salt";
}

/** Stable, non-reversible hash of an IP address (32 hex chars). */
export function hashIp(ip: string): string {
  return createHmac("sha256", ipSalt()).update(ip).digest("hex").slice(0, 32);
}

/** Convenience: hashed client IP for a request. */
export function getIpHash(source: Request | Headers): string {
  return hashIp(getClientIp(source));
}
