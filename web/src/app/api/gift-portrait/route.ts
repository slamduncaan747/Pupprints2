import { cookies } from "next/headers";
import { getStyle } from "@/lib/catalog";
import { makeWatermarkedPreview } from "@/lib/image";
import { storeObject } from "@/lib/image/storage";
import { BUCKETS, db, previewUrl } from "@/lib/supabase/server";
import { normalizeCode } from "@/components/partners/program";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TOKEN_RE = /^[a-f0-9]{16,64}$/i;
const REF_MAX_AGE = 60 * 60 * 24 * 30;

type GiftRow = { generation_id: string | null; partner_id: string | null; pet_name: string | null };
type GenerationRow = {
  id: string;
  created_at: string;
  status: string;
  style: string;
  pet_name: string | null;
  preview_path: string | null;
  full_path: string | null;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

const notFound = () =>
  json({ error: "gift_not_found", message: "We couldn't find that gift portrait. The link may be incomplete." }, 404);

/**
 * GET /api/gift-portrait?token=<reveal_token>
 * Resolves a gift portrait (creator outreach reveal) so its recipient can order it as a print:
 * returns the generation and its watermarked preview (created on demand if missing). The
 * reveal token is the bearer secret; /api/checkout accepts the same token as proof of access.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token")?.trim() ?? "";
  if (!TOKEN_RE.test(token)) return notFound();
  const c = db();
  if (!c) return json({ error: "unavailable", message: "Our studio is temporarily unavailable." }, 503);

  const { data: gift, error: giftError } = await c
    .from("gifts")
    .select("generation_id, partner_id, pet_name")
    .eq("reveal_token", token)
    .maybeSingle<GiftRow>();
  if (giftError) {
    console.error("[gift-portrait] gift lookup failed", giftError.message);
    return json({ error: "unavailable", message: "Our studio is temporarily unavailable." }, 503);
  }
  if (!gift?.generation_id) return notFound();

  const { data: gen } = await c
    .from("generations")
    .select("id, created_at, status, style, pet_name, preview_path, full_path")
    .eq("id", gift.generation_id)
    .maybeSingle<GenerationRow>();
  if (!gen || gen.status !== "succeeded" || !gen.full_path || !getStyle(gen.style)) return notFound();

  // Watermarked preview (gift generations normally have one; build it from the master if not).
  let previewPath = gen.preview_path;
  if (!previewPath) {
    try {
      const { data: file, error } = await c.storage.from(BUCKETS.portraits).download(gen.full_path);
      if (error || !file) throw new Error(error?.message ?? "missing master");
      const preview = await makeWatermarkedPreview(Buffer.from(await file.arrayBuffer()));
      previewPath = `gifts/${gen.id}.jpg`;
      await storeObject(BUCKETS.previews, previewPath, preview.bytes, {
        contentType: "image/jpeg",
        upsert: true,
        cacheControl: "31536000",
      });
      await c.from("generations").update({ preview_path: previewPath }).eq("id", gen.id);
    } catch (err) {
      console.error("[gift-portrait] preview failed", gen.id, err instanceof Error ? err.message : err);
      return json({ error: "unavailable", message: "We couldn't load that portrait. Please try again." }, 503);
    }
  }

  // Credit the creator who received the gift (first touch: never overwrite an existing referral).
  if (gift.partner_id) {
    const store = await cookies();
    if (!store.get("pp_ref")?.value) {
      const { data: partner } = await c
        .from("partners")
        .select("code")
        .eq("id", gift.partner_id)
        .maybeSingle<{ code: string | null }>();
      const code = normalizeCode(partner?.code);
      if (code) store.set("pp_ref", code, { path: "/", maxAge: REF_MAX_AGE, sameSite: "lax" });
    }
  }

  return json({
    generationId: gen.id,
    style: gen.style,
    petName: gift.pet_name ?? gen.pet_name ?? null,
    previewUrl: previewUrl(previewPath),
    createdAt: gen.created_at,
  });
}
