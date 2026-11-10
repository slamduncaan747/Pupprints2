import { z } from "zod";
import { getStyle, isRetiredStyle, styleAvailable } from "@/lib/catalog";
import { env } from "@/lib/env";
import { aiAvailable, AiUnavailableError, generatePortrait, GenerationFailedError } from "@/lib/ai";
import { makeWatermarkedPreview, toPrintMaster } from "@/lib/image";
import { letteringText, letterName } from "@/lib/image/lettering";
import { BUCKETS, db, previewUrl, signedUrl } from "@/lib/supabase/server";
import { storeObject } from "@/lib/image/storage";
import { ensureSessionId, getIpHash, sessionStorageFolder } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Leave room after the AI call for storing the master + watermarked preview. */
const AI_BUDGET_MS = 105_000;

const Body = z.object({
  uploadId: z.string().uuid(),
  /** Checked against the catalog below, so a retired slug gets a clear 410 rather than a generic 400. */
  style: z.string().min(1).max(40),
  petName: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
  /** "Add the name to the portrait": letter petName at the top, on any style. Off unless true. */
  nameOnArt: z.boolean().optional(),
  /** The gentle track, stored on the generation. The create flow no longer sends it. */
  memorial: z.boolean().optional(),
});

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const started = Date.now();

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return json({ error: "invalid_request", message: "Please choose a photo and a style." }, 400);
  }
  // Styles we no longer sell (RETIRED_STYLE_SLUGS) and dated editions past their last day are
  // refused with 410, checked on every request; a slug we never had is a plain 400.
  const style = getStyle(body.style);
  if (!style && !isRetiredStyle(body.style)) {
    return json({ error: "invalid_request", message: "Please choose a style from the collection." }, 400);
  }
  if (!style || !styleAvailable(style)) {
    return json(
      { error: "style_retired", message: `${style?.name ?? "That style"} has been retired. Please choose another style.` },
      410,
    );
  }
  const memorial = body.memorial ? { memorial: true } : {};

  const supabase = db();
  if (!supabase) {
    return json({ error: "ai_unavailable", message: "Our studio is busy right now." }, 503);
  }

  const sessionId = await ensureSessionId();
  const ipHash = getIpHash(req);

  // The upload must belong to this browser session.
  const { data: upload } = await supabase
    .from("uploads")
    .select("id, storage_path, session_id")
    .eq("id", body.uploadId)
    .maybeSingle();
  if (!upload || upload.session_id !== sessionId) {
    return json({ error: "upload_not_found", message: "We couldn't find your photo. Please upload it again." }, 404);
  }

  if (!aiAvailable()) {
    // Queue the request as a `pending` generation so the "email me when it's ready" lead
    // (POST /api/leads with this generationId) carries the photo + style for follow-up.
    const { data: existing } = await supabase
      .from("generations")
      .select("id")
      .eq("upload_id", upload.id)
      .eq("style", style.slug)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    if (existing) {
      return json({ error: "ai_unavailable", message: "Our studio is busy right now.", generationId: existing.id }, 503);
    }
    const { data: pending } = await supabase
      .from("generations")
      .insert({
        upload_id: upload.id,
        session_id: sessionId,
        ip_hash: ipHash,
        pet_name: body.petName ?? null,
        style: style.slug,
        status: "pending",
        error: "ai_unavailable",
        ...memorial,
      })
      .select("id")
      .single();
    return json({ error: "ai_unavailable", message: "Our studio is busy right now.", generationId: pending?.id }, 503);
  }

  // Insert this attempt *before* checking the limits, so parallel requests can't all pass the
  // check at once (each one counts the others). A rejected attempt removes its own row.
  const { data: row, error: insertError } = await supabase
    .from("generations")
    .insert({
      upload_id: upload.id,
      session_id: sessionId,
      ip_hash: ipHash,
      pet_name: body.petName ?? null,
      style: style.slug,
      status: "processing",
      ...memorial,
    })
    .select("id")
    .single();
  if (insertError || !row) {
    console.error("[generate] insert failed", insertError);
    return json({ error: "generation_failed", message: "Something went wrong on our side. Please try again." }, 502);
  }
  const generationId: string = row.id;

  // Per-IP daily limit + optional site-wide daily cap (GLOBAL_DAILY_GENERATION_LIMIT). Only
  // attempts that reached the AI count: failed and queued (pending) ones cost nothing.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const countAttempts = async (byIp: boolean) => {
    let q = supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .in("status", ["processing", "succeeded"])
      .gte("created_at", since);
    if (byIp) q = q.eq("ip_hash", ipHash);
    const { count, error } = await q;
    if (error) console.error("[generate] limit count failed", error.message);
    return count ?? 0;
  };
  const globalLimit = env.globalDailyGenerationLimit;
  const [ipCount, globalCount] = await Promise.all([
    countAttempts(true),
    globalLimit > 0 ? countAttempts(false) : Promise.resolve(0),
  ]);
  if (ipCount > env.dailyGenerationLimitPerIp) {
    await supabase.from("generations").delete().eq("id", generationId);
    return json(
      {
        error: "rate_limited",
        message:
          "You've reached today's limit for previews. Your portraits are saved, and you can make more tomorrow.",
      },
      429,
    );
  }
  if (globalLimit > 0 && globalCount > globalLimit) {
    // Cost backstop: queue it like an AI outage so the visitor can leave their email.
    console.warn(`[generate] global daily generation limit reached (${globalCount}/${globalLimit})`);
    await supabase
      .from("generations")
      .update({ status: "pending", error: "ai_unavailable: global_daily_limit" })
      .eq("id", generationId);
    return json({ error: "ai_unavailable", message: "Our studio is busy right now.", generationId }, 503);
  }

  const fail = async (error: string) => {
    await supabase
      .from("generations")
      .update({ status: "failed", error: error.slice(0, 1000), duration_ms: Date.now() - started })
      .eq("id", generationId);
  };

  try {
    const { data: file, error: downloadError } = await supabase.storage.from(BUCKETS.uploads).download(upload.storage_path);
    if (downloadError || !file) throw new Error(`Could not read upload: ${downloadError?.message}`);
    const imageBytes = Buffer.from(await file.arrayBuffer());
    const imageUrl = await signedUrl("uploads", upload.storage_path, 60 * 10);

    // The name is lettered only when the customer asked for it and it is one we can set.
    const withName = body.nameOnArt === true && letteringText(body.petName) !== null;

    const result = await generatePortrait({
      imageUrl,
      imageBytes,
      mime: "image/jpeg",
      style: style.slug,
      petName: body.petName,
      withName,
      deadline: started + AI_BUDGET_MS,
    });

    // The name is type we set, never the model's. Flat-ground styles (Modern) are also set to their
    // exact ground color, name or not. On other styles the name is left off if the head is in its way.
    const { bytes: art, lettered } = await letterName(result.bytes, withName ? body.petName : null, style.ground);
    const [master, preview] = await Promise.all([toPrintMaster(art), makeWatermarkedPreview(art)]);
    // Never put the raw session id in object paths: preview URLs are public.
    const folder = sessionStorageFolder(sessionId);
    const fullPath = `${folder}/${generationId}.png`;
    const previewPath = `${folder}/${generationId}.jpg`;

    // The AI call already cost money: retry transient storage failures instead of discarding the result.
    await Promise.all([
      storeObject(BUCKETS.portraits, fullPath, master.bytes, { contentType: "image/png", upsert: true }),
      storeObject(BUCKETS.previews, previewPath, preview.bytes, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000",
      }),
    ]);

    const durationMs = Date.now() - started;
    await supabase
      .from("generations")
      .update({
        status: "succeeded",
        provider: result.provider,
        model: result.model,
        full_path: fullPath,
        preview_path: previewPath,
        width: master.width,
        height: master.height,
        duration_ms: durationMs,
        error: null,
      })
      .eq("id", generationId);

    return json({
      generationId,
      status: "succeeded",
      previewUrl: previewUrl(previewPath),
      style: style.slug,
      nameOnArt: lettered,
      width: preview.width,
      height: preview.height,
    });
  } catch (err) {
    if (err instanceof AiUnavailableError) {
      await supabase
        .from("generations")
        .update({ status: "pending", error: "ai_unavailable", duration_ms: Date.now() - started })
        .eq("id", generationId);
      return json({ error: "ai_unavailable", message: "Our studio is busy right now.", generationId }, 503);
    }
    const detail = err instanceof GenerationFailedError ? err.message : err instanceof Error ? err.message : String(err);
    console.error("[generate] failed", generationId, detail);
    await fail(detail);
    return json(
      {
        error: "generation_failed",
        message: "Our artist couldn't finish this one. Please try again — it usually works on the next attempt.",
      },
      502,
    );
  }
}
