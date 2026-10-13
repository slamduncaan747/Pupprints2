import { z } from "zod";
import { db } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({ token: z.string().regex(/^[a-f0-9]{16,64}$/i) });

/**
 * Called by the reveal page in the browser (not during server render, so link-preview bots
 * don't count as views). Orders: first view sets reveal_viewed_at. Gifts: view_count + viewed_at.
 */
export async function POST(req: Request) {
  const res = Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  let token: string;
  try {
    token = Body.parse(await req.json()).token;
  } catch {
    return res;
  }
  const c = db();
  if (!c) return res;
  const now = new Date().toISOString();
  try {
    const { data: order } = await c.from("orders").select("id, reveal_viewed_at").eq("reveal_token", token).maybeSingle<{ id: string; reveal_viewed_at: string | null }>();
    if (order) {
      if (!order.reveal_viewed_at) {
        await c.from("orders").update({ reveal_viewed_at: now, updated_at: now }).eq("id", order.id).is("reveal_viewed_at", null);
      }
      return res;
    }
    const { data: gift } = await c.from("gifts").select("id, viewed_at, view_count").eq("reveal_token", token).maybeSingle<{ id: string; viewed_at: string | null; view_count: number }>();
    if (gift) {
      await c
        .from("gifts")
        .update({ view_count: (gift.view_count ?? 0) + 1, ...(gift.viewed_at ? {} : { viewed_at: now }) })
        .eq("id", gift.id);
    }
  } catch (err) {
    console.error("[reveal/viewed] failed", err);
  }
  return res;
}
