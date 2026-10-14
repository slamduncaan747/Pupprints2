import { z } from "zod";
import { HEARD_FROM_DETAIL_MAX, HEARD_FROM_IDS } from "@/lib/heard-from";
import { getOrderByStripeSession, isPaid, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  /** The Stripe Checkout Session id from the success page URL authorizes the buyer (as /api/reveal/send). */
  sessionId: z.string().trim().regex(/^cs_[A-Za-z0-9_]+$/).max(200),
  answer: z.enum(HEARD_FROM_IDS),
  detail: z
    .string()
    .trim()
    .max(HEARD_FROM_DETAIL_MAX)
    .optional()
    .transform((v) => (v ? v : undefined)),
});

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** "How did you hear about us?" from the order success page: one optional answer per order (changeable). */
export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return json({ ok: false, error: "invalid_request", message: "Please choose one answer." }, 400);
  }
  const order = await getOrderByStripeSession(body.sessionId);
  if (!order || !isPaid(order)) return json({ ok: false, error: "not_found", message: "We couldn't find a paid order for this page." }, 404);
  try {
    const updated = await updateOrder(order.id, {
      heard_from: body.answer,
      heard_from_detail: body.answer === "other" ? (body.detail ?? null) : null,
    });
    if (!updated) return json({ ok: false, error: "not_found", message: "We couldn't find a paid order for this page." }, 404);
  } catch (err) {
    console.error("[heard-from] save failed", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "unavailable", message: "We couldn't save that just now. Please try again." }, 503);
  }
  return json({ ok: true });
}
