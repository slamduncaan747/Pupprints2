import { randomUUID } from "node:crypto";
import { BUCKETS, db, signedUrl } from "@/lib/supabase/server";
import { ImageError, normalizeUpload } from "@/lib/image";
import { ensureSessionId, getIpHash } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** The client resizes to ≤2048px JPEG before upload; this is a generous safety cap. */
const MAX_BYTES = 12 * 1024 * 1024;
/** Uploads per IP per 24h (storage abuse guard; generations have their own limit). */
const DAILY_UPLOAD_LIMIT = 60;
/** Signed display URL lifetime. GET /api/generations re-signs it on reload. */
const DISPLAY_URL_TTL = 60 * 60 * 24;

const ACCEPTED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif", ""]);

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) {
    return json({ error: "storage_unavailable", message: "Uploads are temporarily unavailable. Please try again soon." }, 503);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: "invalid_request", message: "Please choose a photo to upload." }, 400);
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json({ error: "invalid_request", message: "Please choose a photo to upload." }, 400);
  }
  if (file.size > MAX_BYTES) {
    return json({ error: "file_too_large", message: "That photo is too large. Please choose one under 12 MB." }, 413);
  }
  const type = file.type.toLowerCase();
  if (!ACCEPTED.has(type)) {
    return json({ error: "unsupported_type", message: "Please upload a JPG, PNG or WebP photo." }, 415);
  }

  const ipHash = getIpHash(req);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("uploads")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= DAILY_UPLOAD_LIMIT) {
    return json(
      { error: "rate_limited", message: "You've uploaded a lot of photos today. Please come back tomorrow." },
      429,
    );
  }

  let normalized: Awaited<ReturnType<typeof normalizeUpload>>;
  try {
    normalized = await normalizeUpload(Buffer.from(await file.arrayBuffer()));
  } catch (err) {
    if (err instanceof ImageError) {
      return json({ error: err.code, message: err.message }, err.code === "unsupported_type" ? 415 : 422);
    }
    console.error("[upload] normalize failed", err);
    return json({ error: "unreadable", message: "We couldn't read that photo. Please try a different JPG or PNG." }, 422);
  }

  const sessionId = await ensureSessionId();
  const uploadId = randomUUID();
  const path = `${sessionId}/${uploadId}.jpg`;

  const { error: storageError } = await supabase.storage
    .from(BUCKETS.uploads)
    .upload(path, normalized.bytes, { contentType: "image/jpeg", upsert: false, cacheControl: "31536000" });
  if (storageError) {
    console.error("[upload] storage failed", storageError);
    return json({ error: "upload_failed", message: "We couldn't save your photo. Please try again." }, 502);
  }

  const { error: dbError } = await supabase.from("uploads").insert({
    id: uploadId,
    session_id: sessionId,
    ip_hash: ipHash,
    storage_path: path,
    width: normalized.width,
    height: normalized.height,
    bytes: normalized.bytes.length,
    mime: "image/jpeg",
  });
  if (dbError) {
    console.error("[upload] db insert failed", dbError);
    await supabase.storage.from(BUCKETS.uploads).remove([path]);
    return json({ error: "upload_failed", message: "We couldn't save your photo. Please try again." }, 502);
  }

  const url = await signedUrl("uploads", path, DISPLAY_URL_TTL);
  return json({ uploadId, url, width: normalized.width, height: normalized.height });
}
