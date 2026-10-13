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

/**
 * Best-effort client IP. Only trustworthy on Vercel (or behind a proxy that overwrites these
 * headers); on a bare `next start` a client can send any value.
 */
export function getClientIp(source: Request | Headers): string {
  const headers = source instanceof Headers ? source : source.headers;
  // Vercel sets x-vercel-forwarded-for / x-real-ip itself and overwrites any client-sent
  // x-forwarded-for, so prefer its own header and only fall back to the generic ones.
  for (const name of ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"]) {
    const first = headers.get(name)?.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

/** Expand an IPv6 address and return its /64 network, or null if it doesn't parse. */
function ipv6Network64(v: string): string | null {
  const halves = v.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const groups = (xs: string[]) => xs.reduce((n, x) => n + (x.includes(".") ? 2 : 1), 0);
  const missing = 8 - groups(head) - groups(tail);
  if (halves.length === 1 ? missing !== 0 : missing < 1) return null;
  const full = [...head, ...Array<string>(halves.length === 2 ? missing : 0).fill("0"), ...tail];
  const prefix = full.slice(0, 4);
  if (prefix.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  return `${prefix.map((g) => parseInt(g, 16).toString(16)).join(":")}::/64`;
}

/**
 * Rate-limit key for an IP. IPv4 as-is; IPv6 by its /64, because a single home or server
 * typically controls a whole /64 and could otherwise rotate through 2^64 addresses.
 */
export function ipRateKey(ip: string): string {
  const v = ip.trim().toLowerCase().replace(/^\[|\]$/g, "").replace(/%.*$/, "");
  if (!v.includes(":")) return v;
  const mapped = v.match(/^(?:0{0,4}:){0,5}:?ffff:(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return mapped[1];
  return ipv6Network64(v) ?? v;
}

function hmacKey() {
  return process.env.IP_HASH_SALT || env.supabaseServerKey || "pupprints-ip-salt";
}

/** Stable, non-reversible hash of an IP address (32 hex chars); IPv6 is hashed per /64. */
export function hashIp(ip: string): string {
  return createHmac("sha256", hmacKey()).update(ipRateKey(ip)).digest("hex").slice(0, 32);
}

/** Convenience: hashed client IP for a request. */
export function getIpHash(source: Request | Headers): string {
  return hashIp(getClientIp(source));
}

/**
 * Opaque storage folder for a session's files. Object paths show up in public preview URLs
 * (and in signed URLs sent to AI providers), so they must never contain the raw `pp_sid`,
 * which is a bearer token for that browser's photos and previews.
 */
export function sessionStorageFolder(sessionId: string): string {
  return createHmac("sha256", hmacKey()).update(`storage:${sessionId}`).digest("hex").slice(0, 32);
}
