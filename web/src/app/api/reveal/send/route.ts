import { z } from "zod";
import { features } from "@/lib/env";
import { getOrderByStripeSession, isPaid, sendGiftRevealEmail, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  /** The Stripe Checkout Session id from the success page URL authorizes the buyer. */
  sessionId: z.string().trim().regex(/^cs_[A-Za-z0-9_]+$/).max(200),
  recipientEmail: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  recipientName: z.string().trim().max(80).optional(),
  senderName: z.string().trim().max(80).optional(),
  message: z.string().trim().max(500).optional(),
});

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const RESEND_COOLDOWN_MS = 10 * 60 * 1000;

/** Buyer emails the Gift Reveal to the recipient from the success page. */
export async function POST(req: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return json({ ok: false, error: "invalid_request", message: "Please enter a valid email address." }, 400);
  }
  if (!features.email) {
    return json({ ok: false, error: "email_unavailable", message: "Email isn't available right now. Copy the link and send it yourself." }, 503);
  }
  const order = await getOrderByStripeSession(body.sessionId);
  if (!order || !isPaid(order)) return json({ ok: false, error: "not_found", message: "We couldn't find a paid order for this page." }, 404);
  if (order.reveal_sent_at && Date.now() - new Date(order.reveal_sent_at).getTime() < RESEND_COOLDOWN_MS) {
    return json({ ok: false, error: "too_soon", message: "We just sent it. Give it a few minutes, then check spam or try again." }, 429);
  }

  const updated = await updateOrder(order.id, {
    gift_recipient_email: body.recipientEmail,
    gift_recipient_name: body.recipientName || order.gift_recipient_name,
    gift_sender_name: body.senderName || order.gift_sender_name,
    gift_message: body.message ?? order.gift_message,
  });
  if (!updated) return json({ ok: false, error: "not_found" }, 404);
  const sent = await sendGiftRevealEmail(updated, { force: true });
  return sent
    ? json({ ok: true })
    : json({ ok: false, error: "send_failed", message: "We couldn't send it just now. Copy the link and send it yourself." }, 502);
}
