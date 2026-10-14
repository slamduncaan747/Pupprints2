import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { adminApiGuard, jsonError } from "@/components/admin/guard";
import { partnerQrUrl, qrPng, qrSvg } from "@/components/admin/partner-qr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET ?format=svg|png → the partner's `?ref=` QR code as a download (for printed cards). */
export async function GET(req: Request, ctx: RouteContext<"/api/admin/partners/[id]/qr">) {
  const denied = await adminApiGuard();
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!z.uuid().safeParse(id).success) return jsonError("Not found", 404);
  const c = db();
  if (!c) return jsonError("Database not configured", 503);

  const { data: p } = await c.from("partners").select("code, niche").eq("id", id).maybeSingle<{ code: string | null; niche: string | null }>();
  if (!p) return jsonError("Not found", 404);
  if (!p.code) return jsonError("This partner has no code yet. Generate one first.", 409);

  const format = new URL(req.url).searchParams.get("format") === "png" ? "png" : "svg";
  const url = partnerQrUrl(p.code, p.niche);
  const filename = `pupprints-qr-${p.code.toLowerCase()}.${format}`;
  const headers = {
    "content-disposition": `attachment; filename="${filename}"`,
    "cache-control": "private, no-store",
  };
  if (format === "png") {
    const png = await qrPng(url);
    return new Response(new Uint8Array(png), { headers: { ...headers, "content-type": "image/png" } });
  }
  return new Response(await qrSvg(url, 1024), { headers: { ...headers, "content-type": "image/svg+xml; charset=utf-8" } });
}
