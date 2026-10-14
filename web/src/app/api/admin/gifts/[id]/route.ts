import { NextResponse } from "next/server";
import { z } from "zod";
import { BUCKETS, db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { GIFT_SESSION } from "@/components/admin/constants";
import { giftImagePath } from "@/components/admin/gifts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Delete a gift portrait made by mistake (wrong photo, wrong name), with its admin-gift
 * generations, source photo and stored images. Only while the reveal link is unopened: once
 * someone has viewed it, it may have been shared or ordered from, so it stays.
 */
export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/gifts/[id]">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  const { data: gift } = await c
    .from("gifts")
    .select("id, generation_id, view_count")
    .eq("id", id)
    .maybeSingle<{ id: string; generation_id: string | null; view_count: number }>();
  if (!gift) return jsonError("Gift not found", 404);
  if (gift.view_count > 0) return jsonError("This gift's reveal link has already been opened, so it can't be deleted.", 409);

  type Gen = { id: string; upload_id: string | null; full_path: string | null; preview_path: string | null; session_id: string | null };
  const { data: gen } = gift.generation_id
    ? await c.from("generations").select("id, upload_id, full_path, preview_path, session_id").eq("id", gift.generation_id).maybeSingle<Gen>()
    : { data: null };

  // Every admin-gift generation of the same source photo (regenerations), never customer rows.
  let gens: Gen[] = gen && gen.session_id === GIFT_SESSION ? [gen] : [];
  let upload: { id: string; storage_path: string } | null = null;
  if (gen?.upload_id && gen.session_id === GIFT_SESSION) {
    const [{ data: siblings }, { data: up }] = await Promise.all([
      c
        .from("generations")
        .select("id, upload_id, full_path, preview_path, session_id")
        .eq("upload_id", gen.upload_id)
        .eq("session_id", GIFT_SESSION),
      c.from("uploads").select("id, storage_path, session_id").eq("id", gen.upload_id).maybeSingle<{ id: string; storage_path: string; session_id: string | null }>(),
    ]);
    gens = (siblings ?? gens) as Gen[];
    if (up && up.session_id === GIFT_SESSION) upload = up;
  }

  // Delete the row first, conditionally, so a reveal opened a moment ago is never removed.
  const { data: deleted, error: giftErr } = await c.from("gifts").delete().eq("id", gift.id).eq("view_count", 0).select("id");
  if (giftErr) return jsonError(`Deleting the gift failed: ${giftErr.message}`, 500);
  if (!deleted?.length) return jsonError("This gift's reveal link has just been opened, so it can't be deleted.", 409);

  const portraitPaths = [giftImagePath(gift.id), ...gens.flatMap((g) => [g.full_path, `web/${g.id}.jpg`].filter((p): p is string => Boolean(p)))];
  const previewPaths = gens.map((g) => g.preview_path).filter((p): p is string => Boolean(p));
  const removals = await Promise.all([
    c.storage.from(BUCKETS.portraits).remove(portraitPaths),
    previewPaths.length ? c.storage.from(BUCKETS.previews).remove(previewPaths) : Promise.resolve({ error: null }),
    upload ? c.storage.from(BUCKETS.uploads).remove([upload.storage_path]) : Promise.resolve({ error: null }),
  ]);
  const storageErr = removals.find((r) => r.error)?.error;
  if (storageErr) console.error("[admin/gifts] storage cleanup failed", id, storageErr.message);

  if (gens.length) {
    const { error } = await c.from("generations").delete().in("id", gens.map((g) => g.id)).eq("session_id", GIFT_SESSION);
    if (error) console.error("[admin/gifts] generation cleanup failed", id, error.message);
  }
  if (upload) {
    const { error } = await c.from("uploads").delete().eq("id", upload.id).eq("session_id", GIFT_SESSION);
    if (error) console.error("[admin/gifts] upload cleanup failed", id, error.message);
  }
  return NextResponse.json({ ok: true }, { headers: { "cache-control": "no-store" } });
}
