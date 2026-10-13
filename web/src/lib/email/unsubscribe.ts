import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

/** HMAC key for unsubscribe links (the Supabase server key never leaves the server). */
function secret() {
  return env.supabaseServerKey || process.env.CRON_SECRET || "pupprints-unsubscribe";
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function unsubscribeToken(email: string): string {
  return createHmac("sha256", secret()).update(`unsubscribe:${normalizeEmail(email)}`).digest().subarray(0, 18).toString("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const a = Buffer.from(unsubscribeToken(email));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function unsubscribeUrl(email: string): string {
  const params = new URLSearchParams({ e: normalizeEmail(email), t: unsubscribeToken(email) });
  return `${env.siteUrl.replace(/\/$/, "")}/api/unsubscribe?${params.toString()}`;
}

/** RFC 8058 one-click unsubscribe headers for marketing email. */
export function unsubscribeHeaders(email: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${unsubscribeUrl(email)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
