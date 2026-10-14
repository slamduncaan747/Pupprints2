import { getStyle } from "@/lib/catalog";
import { isUuid } from "@/lib/orders";
import { BUCKETS, db } from "@/lib/supabase/server";
import { ensureWallpaper, verifyWallpaperToken } from "@/lib/wallpaper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function slug(s: string | null | undefined) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const notFound = () =>
  new Response("This link isn't valid anymore. Make a new preview and ask for the wallpaper again.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });

/**
 * GET /api/wallpaper/<generationId>/<token>[?download=1]: the Free Phone Portrait (1080×1920).
 * The token is an HMAC of the generation id, so the link in the email works without a login.
 * Redirects to a short-lived signed URL: inline by default (on a phone: open it, Share → Use as
 * Wallpaper), or as an attachment with ?download=1.
 */
export async function GET(req: Request, ctx: RouteContext<"/api/wallpaper/[generationId]/[token]">) {
  const { generationId, token } = await ctx.params;
  if (!isUuid(generationId) || !verifyWallpaperToken(generationId, token)) return notFound();
  const c = db();
  if (!c) return notFound();
  const { data: gen } = await c
    .from("generations")
    .select("id, status, full_path, pet_name, style")
    .eq("id", generationId)
    .maybeSingle<{ id: string; status: string; full_path: string | null; pet_name: string | null; style: string }>();
  if (!gen || gen.status !== "succeeded" || !gen.full_path) return notFound();

  try {
    const path = await ensureWallpaper({ id: gen.id, full_path: gen.full_path });
    const download = new URL(req.url).searchParams.get("download") === "1";
    const filename = `pup-prints-${[slug(gen.pet_name), slug(getStyle(gen.style)?.name)].filter(Boolean).join("-") || "portrait"}-phone-wallpaper.jpg`;
    const { data, error } = await c.storage
      .from(BUCKETS.portraits)
      .createSignedUrl(path, 10 * 60, download ? { download: filename } : undefined);
    if (error || !data) throw new Error(error?.message);
    return new Response(null, { status: 302, headers: { Location: data.signedUrl, "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[wallpaper] download failed", generationId, err instanceof Error ? err.message : err);
    return new Response("We couldn't prepare your wallpaper just now. Please try again in a minute.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}
