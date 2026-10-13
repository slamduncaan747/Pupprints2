import type { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import type Stripe from "stripe";
import { Container, Eyebrow } from "@/components/ui/container";
import { ButtonLink, buttonClasses } from "@/components/ui/button";
import { FramedPortrait, finishFor } from "@/components/order/framed-portrait";
import { GiftRevealCard } from "@/components/order/gift-reveal-card";
import { InviteCard } from "@/components/order/invite-card";
import { OrderTimeline } from "@/components/order/order-timeline";
import { PaymentPending } from "@/components/order/payment-pending";
import { PurchaseTracker } from "@/components/order/purchase-tracker";
import { buildTimeline } from "@/components/order/timeline";
import { site } from "@/lib/config";
import { features } from "@/lib/env";
import {
  applyCheckoutSession,
  digitalGenerationIds,
  getOrder,
  getOrderByStripeSession,
  hasPhysical,
  isPaid,
  orderArrivalText,
  orderPetName,
  orderShipDays,
  prepareOrderFiles,
  previewImageUrl,
  primaryItem,
  revealUrl,
  runPostPaymentTasks,
  sessionIsPaid,
  summarizeOrder,
  webImagePath,
  type OrderRow,
} from "@/lib/orders";
import { ensureWebImage } from "@/lib/print-file";
import { getStripe } from "@/lib/stripe";
import { BUCKETS, db } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export const metadata: Metadata = {
  title: "Thank you for your order",
  robots: { index: false, follow: false },
};

async function loadOrder(sessionId: string): Promise<OrderRow | null> {
  let order = await getOrderByStripeSession(sessionId);
  const stripe = getStripe();
  let session: Stripe.Checkout.Session | null = null;
  if (stripe && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (err) {
      console.warn("[order/success] session retrieve failed", err instanceof Error ? err.message : err);
    }
  }
  if (!order && session) {
    const id = session.client_reference_id ?? session.metadata?.orderId;
    if (id) order = await getOrder(id);
  }
  // Don't wait for the webhook if Stripe already says it's paid (both paths are idempotent).
  if (order && session && order.status === "pending" && session.status === "complete" && sessionIsPaid(session)) {
    const result = await applyCheckoutSession(session).catch(() => null);
    if (result?.order) {
      order = result.order;
      if (result.transitioned) {
        const paid = result.order;
        const giftSendNow = session.metadata?.giftSendNow === "1";
        after(async () => {
          await runPostPaymentTasks(paid, { giftSendNow });
          await prepareOrderFiles(paid.id);
        });
      }
    }
  }
  return order;
}

async function portraitSrc(order: OrderRow): Promise<{ src: string | null; clean: boolean }> {
  const main = primaryItem(order);
  if (!main) return { src: null, clean: false };
  const c = db();
  if (c && isPaid(order)) {
    try {
      const path = await ensureWebImage(main.generationId).catch(() => webImagePath(main.generationId));
      const { data } = await c.storage.from(BUCKETS.portraits).createSignedUrl(path, 60 * 60);
      if (data?.signedUrl) return { src: data.signedUrl, clean: true };
    } catch {
      // fall back to the preview
    }
  }
  return { src: previewImageUrl(main), clean: false };
}

/** Props for the one-time Purchase conversion event (dollars). Null for unpaid or $0 (internal/gift) orders. */
function purchaseEvent(order: OrderRow) {
  if (!isPaid(order) || !order.total_cents) return null;
  return {
    orderNumber: order.order_number,
    value: order.total_cents / 100,
    currency: (order.currency || "usd").toUpperCase(),
    shipping: order.shipping_cents != null ? order.shipping_cents / 100 : undefined,
    tax: order.tax_cents != null ? order.tax_cents / 100 : undefined,
    items: (Array.isArray(order.items) ? order.items : []).map((i) => ({
      id: i.variantId,
      name: i.label,
      price: (i.included ? 0 : i.unitAmount) / 100,
      quantity: i.quantity,
      category: i.productType,
      variant: i.frameColor ?? undefined,
    })),
  };
}

function firstName(name: string | null) {
  const n = (name ?? "").trim().split(/\s+/)[0];
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : null;
}

export default async function OrderSuccessPage({ searchParams }: PageProps<"/order/success">) {
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : "";
  const order = sessionId ? await loadOrder(sessionId) : null;

  if (!order) {
    return (
      <Container className="py-24 text-center sm:py-32">
        <h1 className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl">We couldn&apos;t find that order</h1>
        <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-ink-2">
          If you just paid, check your inbox for a confirmation email. You can also look it up by order number.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/track" variant="primary">
            Track an order
          </ButtonLink>
          <ButtonLink href={`mailto:${site.supportEmail}`} variant="secondary">
            Contact us
          </ButtonLink>
        </div>
      </Container>
    );
  }

  if (order.status === "pending") {
    return (
      <Container className="py-24 sm:py-32">
        <PaymentPending />
      </Container>
    );
  }

  const physical = hasPhysical(order);
  const pet = orderPetName(order);
  const main = primaryItem(order);
  const { src, clean } = await portraitSrc(order);
  const arrival = orderArrivalText(order);
  const steps = buildTimeline({
    status: order.status,
    orderedAt: new Date(order.created_at),
    shipDays: orderShipDays(order),
    country: order.ship_country,
    hasPhysical: physical,
    carrier: order.carrier,
  });
  const { items, totals } = summarizeOrder(order);
  const gens = digitalGenerationIds(order);
  const hi = firstName(order.customer_name);
  const sentTo = order.reveal_sent_at && order.gift_recipient_email ? order.gift_recipient_name || order.gift_recipient_email : null;
  const purchase = purchaseEvent(order);

  return (
    <div className="pb-24">
      {purchase && <PurchaseTracker {...purchase} />}
      <Container className="pt-12 sm:pt-20">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          {/* The portrait, on white */}
          <div className="flex flex-col items-center">
            {src ? (
              <FramedPortrait
                src={src}
                alt={pet ? `Portrait of ${pet}` : "Your portrait"}
                finish={finishFor(main?.productType, main?.frameColor)}
                className="w-[78%] max-w-[380px] animate-fade-up"
                priority
              />
            ) : (
              <div className="skeleton aspect-[4/5] w-[78%] max-w-[380px]" />
            )}
            {!clean && src && <p className="mt-5 text-center text-[12.5px] text-ink-3">Preview shown; your file has no watermark.</p>}
          </div>

          <div>
            <Eyebrow>Order {order.order_number} · Confirmed</Eyebrow>
            <h1 className="mt-4 font-display text-[2.75rem] leading-[1.02] sm:text-6xl">
              {hi ? `Thank you, ${hi}.` : "Thank you."}
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-2">
              {physical
                ? `${pet ? `${pet}'s portrait` : "Your portrait"} is in good hands. A person on our team checks every piece before it's printed.`
                : `${pet ? `${pet}'s portrait` : "Your portrait"} is ready to download, watermark-free.`}
              {order.email ? (
                <>
                  {" "}
                  We&apos;ve emailed your confirmation to <span className="text-ink">{order.email}</span>.
                </>
              ) : null}
            </p>

            <h2 className="mt-12 font-sans text-[12px] tracking-[0.14em] text-ink-3 uppercase">
              {physical ? "What happens next" : "Your order"}
            </h2>
            <OrderTimeline steps={steps} className="mt-3" />
            {physical && arrival && (
              <p className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-[15px]">
                <span className="text-ink-2">Estimated arrival</span>
                <span className="text-ink">{arrival}</span>
              </p>
            )}
            {physical && (
              <p className="mt-5 text-[13px] leading-relaxed text-ink-3">
                We&apos;ll email your tracking link the moment it ships. You can also{" "}
                <Link
                  href={`/track?order=${encodeURIComponent(order.order_number)}`}
                  className="text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  track your order
                </Link>{" "}
                any time.
              </p>
            )}
          </div>
        </div>
      </Container>

      <Container className="mt-24 sm:mt-32">
        <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
          <GiftRevealCard
            revealUrl={revealUrl(order.reveal_token)}
            sessionId={sessionId}
            petName={pet}
            recipientName={order.gift_recipient_name}
            senderName={order.gift_sender_name || order.customer_name}
            sentTo={sentTo}
            emailEnabled={features.email}
          />

          <section aria-labelledby="digital-title" className="grid gap-4 py-10 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10">
            <h2 id="digital-title" className="font-display text-[1.75rem] leading-tight">
              {physical ? "Your hi-res file, free" : "Your hi-res file"}
            </h2>
            <div>
              <p className="text-[15px] leading-relaxed text-ink-2">
                Full resolution, no watermark{physical ? ", included with your print" : ""}. Yours to print, post and share.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {gens.map((g, n) => (
                  <a
                    key={g}
                    href={`/api/download/${order.reveal_token}/${g}`}
                    className={buttonClasses(physical ? "secondary" : "primary", "md", "min-w-36")}
                  >
                    {gens.length > 1 ? `Download portrait ${n + 1}` : "Download"}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="summary-title" className="grid gap-4 py-10 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-10">
            <h2 id="summary-title" className="font-display text-[1.75rem] leading-tight">
              Order summary
            </h2>
            <div>
              <ul className="text-[15px]">
                {items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 border-b border-line py-3 first:pt-0">
                    <span>
                      <span className="text-ink">
                        {it.label}
                        {it.quantity > 1 ? ` × ${it.quantity}` : ""}
                      </span>
                      {it.detail && <span className="block text-[13px] text-ink-3">{it.detail}</span>}
                    </span>
                    <span className="shrink-0 text-ink tabular-nums">{it.amount}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1.5 text-[15px]">
                {totals.map((t) => (
                  <div key={t.label} className={`flex justify-between ${t.strong ? "pt-1 text-ink" : "text-ink-2"}`}>
                    <dt>{t.label}</dt>
                    <dd className={t.strong ? "font-display text-[1.6rem] leading-none tabular-nums" : "tabular-nums"}>{t.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <InviteCard siteUrl={site.url} instagramUrl={site.social.instagram} />
        </div>

        <p className="mx-auto mt-12 max-w-md text-center text-[13px] leading-relaxed text-ink-3">
          Love it or we&apos;ll remake or refund it. Questions? Reply to your confirmation email or write to{" "}
          <a
            className="text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            href={`mailto:${site.supportEmail}`}
          >
            {site.supportEmail}
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
