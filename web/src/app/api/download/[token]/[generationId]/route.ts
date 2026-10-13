import { BUCKETS, db } from "@/lib/supabase/server";
import { getOrderByRevealToken, isPaid, isUuid, itemsOf } from "@/lib/orders";
import { ensureWebImage } from "@/lib/print-file";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

function slug(s: string | null | undefined) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const notFound = () =>
  new Response("This link isn't valid anymore. Reply to your order email and we'll send a fresh one.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });

/**
 * Token-authorized portrait links for a paid order:
 *   /api/download/<revealToken>/<generationId>           → the hi-res digital file (attachment)
 *   /api/download/<revealToken>/<generationId>?inline=1  → clean ~1600px image (emails, reveal)
 * Both 302 to a short-lived signed Supabase URL.
 */
export async function GET(req: Request, ctx: RouteContext<"/api/download/[token]/[generationId]">) {
  const { token, generationId } = await ctx.params;
  if (!/^[a-f0-9]{16,64}$/i.test(token) || !isUuid(generationId)) return notFound();
  const c = db();
  if (!c) return notFound();

  const order = await getOrderByRevealToken(token);
  if (!order || !isPaid(order)) return notFound();
  const item = itemsOf(order).find((i) => i.generationId === generationId);
  if (!item) return notFound();
  const inline = new URL(req.url).searchParams.get("inline") === "1";

  try {
    if (inline) {
      const path = await ensureWebImage(generationId);
      const { data, error } = await c.storage.from(BUCKETS.portraits).createSignedUrl(path, 60 * 60);
      if (error || !data) throw new Error(error?.message);
      return new Response(null, {
        status: 302,
        headers: { Location: data.signedUrl, "Cache-Control": "private, max-age=600" },
      });
    }

    const digital = order.print_files?.digital.find((d) => d.generationId === generationId);
    let path = digital?.path;
    let ext = "jpg";
    if (!path) {
      // Files are still being prepared: hand out the clean master instead of making them wait.
      const { data: gen } = await c.from("generations").select("full_path").eq("id", generationId).maybeSingle<{ full_path: string | null }>();
      path = gen?.full_path ?? undefined;
      ext = path?.split(".").pop() ?? "png";
    }
    if (!path) return notFound();
    const filename = `pup-prints-${[slug(item.petName), slug(item.styleName)].filter(Boolean).join("-") || "portrait"}.${ext}`;
    const { data, error } = await c.storage.from(BUCKETS.portraits).createSignedUrl(path, 10 * 60, { download: filename });
    if (error || !data) throw new Error(error?.message);
    return new Response(null, { status: 302, headers: { Location: data.signedUrl, "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[download] failed", order.id, generationId, err);
    return new Response("We couldn't prepare your file just now. Please try again in a minute.", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
}
