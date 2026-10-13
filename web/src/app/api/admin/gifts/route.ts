import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { getStyle, type StyleSlug } from "@/lib/catalog";
import { aiAvailable, AiUnavailableError, generatePortrait, GenerationFailedError } from "@/lib/ai";
import { ImageError, makeWatermarkedPreview, normalizeUpload, toPrintMaster } from "@/lib/image";
import { BUCKETS, db, signedUrl } from "@/lib/supabase/server";
import { uniquePartnerCode } from "@/lib/partners";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { GIFT_SESSION, giftDm } from "@/components/admin/constants";
import { giftImagePath, giftRevealUrl, type GiftRow } from "@/components/admin/gifts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Leave room after the AI call for the image variants + storage writes. */
const AI_BUDGET_MS = 48_000;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const GIFT_WEB_EDGE = 1600;

const optText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

const Fields = z.object({
  giftId: z.uuid().optional(),
  partnerId: z.uuid().optional(),
  imageUrl: optText(2000),
  style: z.string().refine((s) => Boolean(getStyle(s)), "Pick a style"),
  petName: optText(40),
  recipientName: optText(80),
  senderName: optText(80),
  message: optText(1000),
});

function isPrivateHost(host: string) {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  return (
    h === "localhost" ||
    h.endsWith(".localhost") ||
    h.endsWith(".internal") ||
    h === "::1" ||
    /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(h) ||
    /^f[cd][0-9a-f]{2}:/.test(h)
  );
}

/** Download a pasted image URL (admin-only, but still refuse internal hosts and non-images). */
async function fetchRemoteImage(raw: string): Promise<Buffer> {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new ImageError("unreadable", "That doesn't look like a valid URL.");
  }
  if (!/^https?:$/.test(url.protocol) || isPrivateHost(url.hostname)) {
    throw new ImageError("unreadable", "Only public http(s) image URLs are allowed.");
  }
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; PupPrintsGiftTool/1.0)", accept: "image/*" },
    });
  } catch {
    throw new ImageError("unreadable", "Couldn't download that image (timed out or blocked). Try uploading the file instead.");
  }
  if (!res.ok) throw new ImageError("unreadable", `Couldn't download that image (HTTP ${res.status}). Try uploading the file instead.`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) {
    throw new ImageError(
      "unsupported_type",
      `That URL is a web page (${type.split(";")[0] || "unknown type"}), not an image. Right-click the photo → "Copy image address", or upload the file.`,
    );
  }
  if (Number(res.headers.get("content-length") ?? 0) > MAX_IMAGE_BYTES) throw new ImageError("unreadable", "That image is over 15 MB.");
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.length > MAX_IMAGE_BYTES) throw new ImageError("unreadable", "That image is over 15 MB.");
  return bytes;
}

/**
 * Create (or regenerate) a free gift portrait for creator outreach.
 * multipart/form-data: style, + (file | imageUrl) for a new gift or giftId to regenerate
 * from the same source photo; optional partnerId, petName, recipientName, senderName, message.
 */
export async function POST(req: Request) {
  const started = Date.now();
  const denied = await adminApiGuard();
  if (denied) return denied;
  const c = db();
  if (!c) return jsonError("Database not configured", 503);
  if (!aiAvailable()) {
    return NextResponse.json(
      {
        ok: false,
        error: "ai_unavailable",
        message:
          "No AI image provider is configured yet. Add GEMINI_API_KEY, FAL_KEY, OPENAI_API_KEY or REPLICATE_API_TOKEN to the environment (or AI_MOCK=1 in development), then try again.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Send the gift as multipart/form-data");
  }
  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : undefined;
  };
  const parsed = Fields.safeParse({
    giftId: str("giftId") || undefined,
    partnerId: str("partnerId") || undefined,
    imageUrl: str("imageUrl"),
    style: str("style") ?? "",
    petName: str("petName"),
    recipientName: str("recipientName"),
    senderName: str("senderName"),
    message: str("message"),
  });
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid request");
  const input = parsed.data;
  const style = input.style as StyleSlug;
  const file = form.get("file");

  // 1) Source photo: reuse the gift's original upload, or ingest a new one.
  let existing: GiftRow | null = null;
  let upload: { id: string; storage_path: string };
  let sourceBytes: Buffer;
  try {
    if (input.giftId) {
      const { data: gift } = await c.from("gifts").select("*").eq("id", input.giftId).maybeSingle<GiftRow>();
      if (!gift) return jsonError("Gift not found", 404);
      existing = gift;
      const { data: gen } = gift.generation_id
        ? await c.from("generations").select("upload_id").eq("id", gift.generation_id).maybeSingle()
        : { data: null };
      const { data: up } = gen?.upload_id
        ? await c.from("uploads").select("id, storage_path").eq("id", gen.upload_id).maybeSingle()
        : { data: null };
      if (!up) return jsonError("The original photo for this gift is missing; start a new gift instead.", 409);
      const { data: blob, error } = await c.storage.from(BUCKETS.uploads).download(up.storage_path);
      if (error || !blob) return jsonError("Couldn't read the original photo; start a new gift instead.", 409);
      upload = up;
      sourceBytes = Buffer.from(await blob.arrayBuffer());
    } else {
      let raw: Buffer;
      if (file instanceof File && file.size > 0) {
        if (file.size > MAX_IMAGE_BYTES) return jsonError("That image is over 15 MB.", 413);
        raw = Buffer.from(await file.arrayBuffer());
      } else if (input.imageUrl) {
        raw = await fetchRemoteImage(input.imageUrl);
      } else {
        return jsonError("Paste an image URL or upload a photo of the dog.");
      }
      const normalized = await normalizeUpload(raw);
      const uploadId = randomUUID();
      const path = `${GIFT_SESSION}/${uploadId}.jpg`;
      const { error: upErr } = await c.storage
        .from(BUCKETS.uploads)
        .upload(path, normalized.bytes, { contentType: "image/jpeg", upsert: false });
      if (upErr) throw new Error(`Storing the photo failed: ${upErr.message}`);
      const { error: rowErr } = await c.from("uploads").insert({
        id: uploadId,
        session_id: GIFT_SESSION,
        storage_path: path,
        width: normalized.width,
        height: normalized.height,
        bytes: normalized.bytes.length,
        mime: "image/jpeg",
      });
      if (rowErr) throw new Error(`Saving the upload failed: ${rowErr.message}`);
      upload = { id: uploadId, storage_path: path };
      sourceBytes = normalized.bytes;
    }
  } catch (err) {
    if (err instanceof ImageError) return jsonError(err.message, 422);
    console.error("[admin/gifts] source photo failed", err);
    return jsonError(err instanceof Error ? err.message : "Couldn't process that photo", 500);
  }

  const petName = input.petName ?? existing?.pet_name ?? undefined;

  // 2) Generation row (excluded from customer KPIs via its session id).
  const { data: genRow, error: genErr } = await c
    .from("generations")
    .insert({ upload_id: upload.id, session_id: GIFT_SESSION, pet_name: petName ?? null, style, status: "processing" })
    .select("id")
    .single();
  if (genErr || !genRow) return jsonError(`Couldn't start the generation: ${genErr?.message}`, 500);
  const generationId: string = genRow.id;
  const fail = (error: string) =>
    c
      .from("generations")
      .update({ status: "failed", error: error.slice(0, 1000), duration_ms: Date.now() - started })
      .eq("id", generationId);

  try {
    const result = await generatePortrait({
      imageBytes: sourceBytes,
      imageUrl: await signedUrl("uploads", upload.storage_path, 60 * 10),
      mime: "image/jpeg",
      style,
      petName,
      deadline: started + AI_BUDGET_MS,
    });

    const giftId = existing?.id ?? randomUUID();
    const [master, preview, web] = await Promise.all([
      toPrintMaster(result.bytes),
      makeWatermarkedPreview(result.bytes),
      sharp(result.bytes, { failOn: "none" })
        .autoOrient()
        .resize({ width: GIFT_WEB_EDGE, height: GIFT_WEB_EDGE, fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .toColourspace("srgb")
        .jpeg({ quality: 86, mozjpeg: true, progressive: true })
        .toBuffer(),
    ]);
    const fullPath = `${GIFT_SESSION}/${generationId}.png`;
    const previewPath = `${GIFT_SESSION}/${generationId}.jpg`;
    const writes = await Promise.all([
      c.storage.from(BUCKETS.portraits).upload(fullPath, master.bytes, { contentType: "image/png", upsert: true }),
      c.storage
        .from(BUCKETS.previews)
        .upload(previewPath, preview.bytes, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" }),
      c.storage
        .from(BUCKETS.portraits)
        .upload(giftImagePath(giftId), web, { contentType: "image/jpeg", upsert: true, cacheControl: "60" }),
    ]);
    const writeErr = writes.find((w) => w.error)?.error;
    if (writeErr) throw new Error(`Storage failed: ${writeErr.message}`);

    await c
      .from("generations")
      .update({
        status: "succeeded",
        provider: result.provider,
        model: result.model,
        full_path: fullPath,
        preview_path: previewPath,
        width: master.width,
        height: master.height,
        duration_ms: Date.now() - started,
        error: null,
      })
      .eq("id", generationId);

    // 3) Gift row: regenerate keeps the same reveal link.
    let gift: GiftRow;
    if (existing) {
      const patch: Record<string, unknown> = { generation_id: generationId };
      if (input.petName) patch.pet_name = input.petName;
      if (input.recipientName) patch.recipient_name = input.recipientName;
      if (input.message !== undefined) patch.message = input.message;
      if (input.senderName) patch.sender_name = input.senderName;
      const { data, error } = await c.from("gifts").update(patch).eq("id", existing.id).select("*").single<GiftRow>();
      if (error || !data) throw new Error(`Updating the gift failed: ${error?.message}`);
      gift = data;
    } else {
      const row: Record<string, unknown> = {
        id: giftId,
        generation_id: generationId,
        partner_id: input.partnerId ?? null,
        recipient_name: input.recipientName ?? null,
        pet_name: petName ?? null,
        message: input.message ?? null,
        source_photo_url: input.imageUrl && !(file instanceof File && file.size > 0) ? input.imageUrl : null,
      };
      if (input.senderName) row.sender_name = input.senderName;
      const { data, error } = await c.from("gifts").insert(row).select("*").single<GiftRow>();
      if (error || !data) throw new Error(`Saving the gift failed: ${error?.message}`);
      gift = data;
    }

    // 4) CRM: mark the creator as gifted + contacted (never downgrade an active partner), and give
    //    them a code so traffic from their shared reveal page is attributed to them.
    const partnerId = gift.partner_id;
    if (partnerId) {
      const now = new Date().toISOString();
      const { data: p } = await c
        .from("partners")
        .select("status, code, handle, name, discount_percent")
        .eq("id", partnerId)
        .maybeSingle();
      const patch: Record<string, unknown> = { last_contacted_at: now, updated_at: now };
      if (p && p.status !== "active") patch.status = "gifted";
      if (p && !p.code) {
        patch.code = await uniquePartnerCode(p.handle || p.name || "PUP", Number(p.discount_percent ?? 15), partnerId);
      }
      const { error: pErr } = await c.from("partners").update(patch).eq("id", partnerId);
      if (pErr) console.error("[admin/gifts] partner update failed", pErr.message);
    }

    const revealUrl = giftRevealUrl(gift.reveal_token);
    return NextResponse.json({
      ok: true,
      gift,
      style,
      provider: result.provider,
      model: result.model,
      imageUrl: await signedUrl("portraits", giftImagePath(gift.id), 60 * 60),
      revealUrl,
      dm: giftDm({ name: gift.recipient_name, pet: gift.pet_name, link: revealUrl }),
      durationMs: Date.now() - started,
    });
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      await fail("ai_unavailable");
      return NextResponse.json(
        { ok: false, error: "ai_unavailable", message: "No AI image provider is configured yet." },
        { status: 503 },
      );
    }
    const detail = err instanceof GenerationFailedError ? err.message : err instanceof Error ? err.message : String(err);
    console.error("[admin/gifts] generation failed", generationId, detail);
    await fail(detail);
    return NextResponse.json(
      { ok: false, error: "generation_failed", message: `Generation failed: ${detail}. Try again or pick another style.` },
      { status: 502 },
    );
  }
}
