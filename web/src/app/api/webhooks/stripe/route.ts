import type Stripe from "stripe";
import { after } from "next/server";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { appendNote, applyCheckoutSession, prepareOrderFiles, runPostPaymentTasks, updateOrder } from "@/lib/orders";
import { db } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Print-file preparation (AI upscaling) runs in after() and can take a while. */
export const maxDuration = 300;

const ok = (body: Record<string, unknown> = { received: true }) =>
  Response.json(body, { status: 200, headers: { "Cache-Control": "no-store" } });

/**
 * Stripe webhook. Verifies the signature on the raw body, then:
 * - checkout.session.completed / async_payment_succeeded → mark paid, emails, attribution,
 *   then (after the response) print files and optional auto-submit to the print partner.
 * - charge.refunded → refunded (full) or a note (partial).
 * Unknown events are acknowledged with 200.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !env.stripeWebhookSecret) {
    return Response.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();
  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("missing stripe-signature header");
    event = await stripe.webhooks.constructEventAsync(payload, signature, env.stripeWebhookSecret);
  } catch (err) {
    console.warn("[stripe-webhook] signature verification failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "payment") return ok();
        const { order, paid, transitioned } = await applyCheckoutSession(session);
        if (!order || !paid) return ok({ received: true, paid: false });
        await runPostPaymentTasks(order, { giftSendNow: session.metadata?.giftSendNow === "1" });
        // Whoever moved the order to paid (this webhook or the success page) builds the files;
        // a later retry rebuilds them only if they are still missing after a few minutes.
        const stale = Date.now() - new Date(order.updated_at).getTime() > 5 * 60 * 1000;
        if (transitioned || (!order.print_files && stale)) after(() => prepareOrderFiles(order.id));
        return ok({ received: true, order: order.order_number });
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.client_reference_id ?? session.metadata?.orderId;
        if (orderId) await appendNote(orderId, "Async payment failed; order left pending.");
        return ok();
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
        const c = db();
        if (!pi || !c) return ok();
        const { data } = await c.from("orders").select("id, status").eq("stripe_payment_intent", pi).maybeSingle<{ id: string; status: string }>();
        if (!data) return ok();
        const full = charge.refunded || charge.amount_refunded >= charge.amount;
        if (full) {
          await updateOrder(data.id, { status: "refunded" });
          await appendNote(data.id, `Refunded in full (${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()}).`);
        } else {
          await appendNote(data.id, `Partial refund: ${(charge.amount_refunded / 100).toFixed(2)} ${charge.currency.toUpperCase()}.`);
        }
        return ok();
      }

      default:
        return ok();
    }
  } catch (err) {
    // 500 makes Stripe retry; every step above is idempotent.
    console.error("[stripe-webhook] handler failed", event.type, err);
    return Response.json({ error: "handler_failed" }, { status: 500 });
  }
}
