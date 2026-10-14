import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/lib/config";
import { env } from "@/lib/env";
import { renderPhoneWallpaper } from "@/lib/image/wallpaper";
import { BUCKETS, requireDb } from "@/lib/supabase/server";

/**
 * The Free Phone Portrait (lead magnet): a 1080×1920 crop of a generation's master, no watermark,
 * cached in the private portraits bucket and handed out through a token link
 * (/api/wallpaper/<generationId>/<token>) that redirects to a short-lived signed URL.
 */

export function wallpaperPath(generationId: string): string {
  return `wallpapers/${generationId}.jpg`;
}

function secret(): string {
  return env.supabaseServerKey || env.adminPassword;
}

/** Unguessable, stateless token for one generation's wallpaper (HMAC-SHA256). "" without a secret. */
export function wallpaperToken(generationId: string): string {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(`phone-wallpaper:${generationId.toLowerCase()}`).digest().subarray(0, 18).toString("base64url");
}

export function verifyWallpaperToken(generationId: string, token: string): boolean {
  const expected = wallpaperToken(generationId);
  if (!expected || !token) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function wallpaperUrl(generationId: string): string {
  return `${site.url.replace(/\/$/, "")}/api/wallpaper/${generationId}/${wallpaperToken(generationId)}`;
}

/** Storage path of the wallpaper, rendering it from the master the first time. */
export async function ensureWallpaper(generation: { id: string; full_path: string }): Promise<string> {
  const c = requireDb();
  const path = wallpaperPath(generation.id);
  const { data: exists } = await c.storage.from(BUCKETS.portraits).exists(path);
  if (exists) return path;
  const { data, error } = await c.storage.from(BUCKETS.portraits).download(generation.full_path);
  if (error || !data) throw new Error(`Could not read the portrait master: ${error?.message}`);
  const bytes = await renderPhoneWallpaper(Buffer.from(await data.arrayBuffer()));
  const { error: upErr } = await c.storage
    .from(BUCKETS.portraits)
    .upload(path, bytes, { contentType: "image/jpeg", upsert: true, cacheControl: "3600" });
  if (upErr) throw new Error(`Could not store the wallpaper: ${upErr.message}`);
  return path;
}
