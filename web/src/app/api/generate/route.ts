import { z } from "zod";
import { STYLES, type StyleSlug } from "@/lib/catalog";
import { env } from "@/lib/env";
import { aiAvailable, AiUnavailableError, generatePortrait, GenerationFailedError } from "@/lib/ai";
import { makeWatermarkedPreview, toPrintMaster } from "@/lib/image";
import { BUCKETS, db, previewUrl, signedUrl } from "@/lib/supabase/server";
import { ensureSessionId, getIpHash } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Leave room after the AI call for storing the master + watermarked preview. */
const AI_BUDGET_MS = 50_000;

const Body = z.object({
  uploadId: z.string().uuid(),
  style: z.enum(STYLES.map((s) => s.slug) as [StyleSlug, ...StyleSlug[]]),
  petName: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v ? v : undefined)),
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
    const { data: pending } = await supabase
      .from("generations")
      .insert({
        upload_id: upload.id,
        session_id: sessionId,
        ip_hash: ipHash,
        pet_name: body.petName ?? null,
        style: body.style,
        status: "pending",
        error: "ai_unavailable",
      })
      .select("id")
      .single();
    return json({ error: "ai_unavailable", message: "Our studio is busy right now.", generationId: pending?.id }, 503);
  }

  // Per-IP daily limit (failed attempts don't count against the customer).
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .neq("status", "failed")
    .gte("created_at", since);
  if ((count ?? 0) >= env.dailyGenerationLimitPerIp) {
    return json(
      {
        error: "rate_limited",
        message: `You've created ${env.dailyGenerationLimitPerIp} previews today — that's our daily limit. Your portraits are saved, and you can make more tomorrow.`,
      },
      429,
    );
  }

  const { data: row, error: insertError } = await supabase
    .from("generations")
    .insert({
      upload_id: upload.id,
      session_id: sessionId,
      ip_hash: ipHash,
      pet_name: body.petName ?? null,
      style: body.style,
      status: "processing",
    })
    .select("id")
    .single();
  if (insertError || !row) {
    console.error("[generate] insert failed", insertError);
    return json({ error: "generation_failed", message: "Something went wrong on our side. Please try again." }, 502);
  }
  const generationId: string = row.id;

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

    const result = await generatePortrait({
      imageUrl,
      imageBytes,
      mime: "image/jpeg",
      style: body.style,
      petName: body.petName,
      deadline: started + AI_BUDGET_MS,
    });

    const [master, preview] = await Promise.all([toPrintMaster(result.bytes), makeWatermarkedPreview(result.bytes)]);
    const fullPath = `${sessionId}/${generationId}.png`;
    const previewPath = `${sessionId}/${generationId}.jpg`;

    const [fullUpload, previewUpload] = await Promise.all([
      supabase.storage.from(BUCKETS.portraits).upload(fullPath, master.bytes, { contentType: "image/png", upsert: true }),
      supabase.storage
        .from(BUCKETS.previews)
        .upload(previewPath, preview.bytes, { contentType: "image/jpeg", upsert: true, cacheControl: "31536000" }),
    ]);
    if (fullUpload.error || previewUpload.error) {
      throw new Error(`Storage failed: ${fullUpload.error?.message ?? previewUpload.error?.message}`);
    }

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
      style: body.style,
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
