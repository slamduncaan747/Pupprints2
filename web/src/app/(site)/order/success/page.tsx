import type { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import type Stripe from "stripe";
import { Download, HeartHandshake, Truck } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
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
        <h1 className="font-display text-4xl sm:text-5xl">We couldn&apos;t find that order</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-ink-2">
          If you just paid, check your inbox for a confirmation email. You can also look it up by order number.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
    <div className="pb-20">
      {purchase && <PurchaseTracker {...purchase} />}
      <Container className="pt-10 sm:pt-16">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          {/* Portrait on a softly lit wall */}
          <div className="relative flex items-center justify-center overflow-hidden rounded-card bg-paper-2 px-8 py-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_30%,rgb(255_255_255/0.85),transparent_70%)]"
            />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[16%] bg-paper-3/70" />
            {src ? (
              <FramedPortrait
                src={src}
                alt={pet ? `Portrait of ${pet}` : "Your portrait"}
                finish={finishFor(main?.productType, main?.frameColor)}
                className="relative w-[72%] max-w-[340px] animate-fade-up"
                priority
              />
            ) : (
              <div className="relative aspect-[4/5] w-[72%] max-w-[340px] skeleton" />
            )}
            {!clean && src && (
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-ink-3">Preview shown; your file has no watermark.</p>
            )}
          </div>

          <div className="lg:pt-6">
            <Eyebrow>Order {order.order_number} · Confirmed</Eyebrow>
            <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] sm:text-6xl">
              {hi ? `Thank you, ${hi}.` : "Thank you."}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              {physical
                ? `${pet ? `${pet}'s portrait` : "Your portrait"} is in good hands. A person on our team checks every piece before it's printed.`
                : `${pet ? `${pet}'s portrait` : "Your portrait"} is ready to download, watermark-free.`}
              {order.email ? (
                <>
                  {" "}
                  We&apos;ve emailed your confirmation to <span className="font-medium text-ink">{order.email}</span>.
                </>
              ) : null}
            </p>
            {physical && arrival && (
              <p className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-sage-soft px-4 py-2 text-[15px] text-moss">
                <Truck className="h-4 w-4" aria-hidden="true" />
                Estimated arrival <span className="font-semibold">{arrival}</span>
              </p>
            )}

            <h2 className="mt-10 font-display text-2xl">{physical ? "What happens next" : "Your order"}</h2>
            <OrderTimeline steps={steps} className="mt-5" />
            {physical && (
              <p className="mt-6 text-sm text-ink-3">
                We&apos;ll email your tracking link the moment it ships. You can also{" "}
                <Link href={`/track?order=${encodeURIComponent(order.order_number)}`} className="text-clay underline underline-offset-2">
                  track your order
                </Link>{" "}
                any time.
              </p>
            )}
          </div>
        </div>
      </Container>

      <Container className="mt-14 sm:mt-20">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <GiftRevealCard
            revealUrl={revealUrl(order.reveal_token)}
            sessionId={sessionId}
            petName={pet}
            recipientName={order.gift_recipient_name}
            senderName={order.gift_sender_name || order.customer_name}
            sentTo={sentTo}
            emailEnabled={features.email}
          />

          <div className="space-y-6">
            <section aria-labelledby="digital-title" className="rounded-card bg-ink p-6 text-paper sm:p-8">
              <h2 id="digital-title" className="font-display text-2xl">
                {physical ? "Your hi-res file, free" : "Your hi-res file"}
              </h2>
              <p className="mt-2 text-paper/75">
                Full resolution, no watermark{physical ? ", included with your print" : ""}. Yours to print, post and share.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {gens.map((g, n) => (
                  <a
                    key={g}
                    href={`/api/download/${order.reveal_token}/${g}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-paper px-6 text-[15px] font-medium text-ink transition-colors hover:bg-white"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {gens.length > 1 ? `Download portrait ${n + 1}` : "Download"}
                  </a>
                ))}
              </div>
            </section>

            <section aria-labelledby="summary-title" className="rounded-card bg-white p-6 ring-1 ring-line sm:p-8">
              <h2 id="summary-title" className="font-display text-xl">
                Order summary
              </h2>
              <ul className="mt-4 divide-y divide-line text-[15px]">
                {items.map((it, i) => (
                  <li key={i} className="flex justify-between gap-4 py-3">
                    <span>
                      <span className="text-ink">
                        {it.label}
                        {it.quantity > 1 ? ` × ${it.quantity}` : ""}
                      </span>
                      {it.detail && <span className="block text-sm text-ink-3">{it.detail}</span>}
                    </span>
                    <span className="shrink-0 text-ink">{it.amount}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-2 space-y-1.5 border-t border-line pt-4 text-[15px]">
                {totals.map((t) => (
                  <div key={t.label} className={`flex justify-between ${t.strong ? "pt-1 font-semibold text-ink" : "text-ink-2"}`}>
                    <dt>{t.label}</dt>
                    <dd>{t.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <div className="mt-6">
          <InviteCard siteUrl={site.url} instagramUrl={site.social.instagram} />
        </div>

        <p className="mt-10 flex items-start justify-center gap-2 text-center text-[15px] text-ink-2">
          <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-clay" aria-hidden="true" />
          <span>
            Love it or we&apos;ll remake or refund it. Questions? Reply to your confirmation email or write to{" "}
            <a className="text-clay underline underline-offset-2" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
            .
          </span>
        </p>
      </Container>
    </div>
  );
}
