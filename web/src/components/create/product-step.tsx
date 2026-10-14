"use client";

import { useEffect, useId, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  ADDONS,
  getStyle,
  PRODUCT_MAP,
  PRODUCTS,
  SHIPPING_RATES,
  type Addon,
  type FrameColor,
  type Product,
  type ProductType,
} from "@/lib/catalog";
import {
  FOUNDING_OFFER,
  GUARANTEE,
  HEIRLOOM_SET,
  heirloomSets,
  holidayNotice,
  percentOffCents,
  valueStackFor,
  type OfferStatus,
} from "@/lib/offer";
import { buttonClasses } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { FrameMockup } from "@/components/product/frame-mockup";
import { shipWindow } from "@/components/order/timeline";
import { ApiError, fetchOffer, peekOffer, startCheckout, type CheckoutRequest } from "./api";
import { EmailCapture, isEmail } from "./email-capture";
import { updateFlow, type FlowState, type Generation, type ShipCountry } from "./store";

const FRAME_LABEL: Record<FrameColor, string> = { black: "Black", white: "White", oak: "Natural oak" };
const FRAME_SWATCH: Record<FrameColor, string> = { black: "#121212", white: "#fcfcfb", oak: "#c4a582" };
const COUNTRY_LABEL: Record<ShipCountry, string> = { US: "United States", CA: "Canada" };
const GIFT_MESSAGE_MAX = 300;

/* -------------------------- delivery estimate -------------------------- */

let todayCache: number | null = null;
function getToday() {
  if (todayCache === null) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    todayCache = d.getTime();
  }
  return todayCache;
}
const noopSubscribe = () => () => {};

/** Today's date on the client; null during SSR (so the server never renders a stale date). */
function useToday() {
  return useSyncExternalStore(noopSubscribe, getToday, () => null);
}

function addBusinessDays(from: number, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) left--;
  }
  return d;
}

const fmtDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

/* ------------------------------ live offer ------------------------------ */

/**
 * The offer checkout will really apply for this visitor (FOUNDING100 or their creator code), from
 * /api/offer. null until it answers (or if it can't): then only regular prices are shown.
 */
function useOffer(code: string): OfferStatus | null {
  const [state, setState] = useState<{ code: string; offer: OfferStatus | null }>(() => ({
    code,
    offer: peekOffer(code || undefined),
  }));
  useEffect(() => {
    let cancelled = false;
    fetchOffer(code || undefined)
      .then((offer) => {
        if (!cancelled) setState({ code, offer });
      })
      .catch(() => {
        // Offline or API down: regular prices only (never a discount we can't confirm).
      });
    return () => {
      cancelled = true;
    };
  }, [code]);
  return state.code === code ? state.offer : peekOffer(code || undefined);
}

/* ------------------------------ component ------------------------------ */

type CheckoutState = { kind: "idle" } | { kind: "loading" } | { kind: "unavailable" } | { kind: "error"; message: string };

export function ProductStep({
  flow,
  active,
  onBack,
  giftToken,
  backLabel = "to styles",
  onCheckoutStart,
}: {
  flow: FlowState;
  active: Generation;
  onBack: () => void;
  /** Set when ordering a gift portrait from its reveal link (not made in this browser). */
  giftToken?: string;
  /** Shown after "Back" on wider screens. */
  backLabel?: string;
  /** Called when the visitor commits to checkout (e.g. to quiet the keep-your-portrait prompt). */
  onCheckoutStart?: () => void;
}) {
  const { selection, gift } = flow;
  const product = PRODUCT_MAP[selection.productType];
  const variant = product.variants.find((v) => v.id === selection.variantId) ?? product.variants[0];
  const physical = product.type !== "digital";
  const chosenAddons = physical ? ADDONS.filter((a) => selection.addons.includes(a.id)) : [];
  const shipping = physical ? SHIPPING_RATES[selection.shipCountry] : 0;

  // Same pricing rules as /api/checkout: catalog prices, the Heirloom Set saving, then the one
  // automatic discount (FOUNDING100 or a creator code), which never touches shipping.
  const heirloom = heirloomSets(chosenAddons.map((a) => ({ variantId: a.id, quantity: 1 })), physical) > 0;
  const addonPrice = (a: Addon) => a.price - (heirloom ? (HEIRLOOM_SET.unitDiscount[a.id] ?? 0) : 0);
  const merchandise = variant.price + chosenAddons.reduce((sum, a) => sum + addonPrice(a), 0);
  const offer = useOffer(flow.creatorCode);
  const discount = offer?.discount ?? null;
  const discountCents = discount ? percentOffCents(merchandise, discount.percentOff) : 0;
  const total = merchandise - discountCents + shipping;
  const discounted = (cents: number) => (discount ? cents - percentOffCents(cents, discount.percentOff) : cents);
  const priceTag = discount?.source === "founding" ? "Founding price" : "With your code";
  const style = getStyle(active.style);
  const name = (giftToken ? (active.petName ?? "") : flow.petName).trim();

  const [view, setView] = useState<"room" | "closeup">("room");
  const [checkout, setCheckout] = useState<CheckoutState>({ kind: "idle" });
  const [giftError, setGiftError] = useState<string | null>(null);
  const today = useToday();
  const ids = { gift: useId(), from: useId(), to: useId(), email: useId(), msg: useId(), stack: useId() };

  const printSize = variant.widthIn > 0 ? { widthIn: variant.widthIn, heightIn: variant.heightIn } : undefined;
  const showRoom = physical && view === "room";

  function selectProduct(type: ProductType) {
    const p = PRODUCT_MAP[type];
    const v = p.variants.find((x) => x.id === p.defaultVariantId) ?? p.variants[0];
    updateFlow((s) => ({ ...s, selection: { ...s.selection, productType: type, variantId: v.id } }));
    track("SelectProduct", { product: type, variant: v.id, price: v.price / 100 });
  }

  function selectVariant(id: string) {
    const v = product.variants.find((x) => x.id === id);
    updateFlow((s) => ({ ...s, selection: { ...s.selection, variantId: id } }));
    if (v) track("SelectProduct", { product: product.type, variant: id, price: v.price / 100 });
  }

  const setSelection = (patch: Partial<FlowState["selection"]>) =>
    updateFlow((s) => ({ ...s, selection: { ...s.selection, ...patch } }));
  const setGift = (patch: Partial<FlowState["gift"]>) => updateFlow((s) => ({ ...s, gift: { ...s.gift, ...patch } }));

  function toggleAddon(id: string) {
    const has = selection.addons.includes(id);
    setSelection({ addons: has ? selection.addons.filter((a) => a !== id) : [...selection.addons, id] });
  }

  async function onCheckout() {
    if (gift.enabled && gift.recipientEmail.trim() && !isEmail(gift.recipientEmail)) {
      setGiftError("Please check the recipient's email address, or leave it blank.");
      return;
    }
    setGiftError(null);
    setCheckout({ kind: "loading" });
    onCheckoutStart?.();

    const body: CheckoutRequest = {
      items: [
        {
          generationId: active.generationId,
          variantId: variant.id,
          frameColor: product.type === "framed" ? selection.frameColor : undefined,
          quantity: 1,
        },
        ...chosenAddons.map((a) => ({ generationId: active.generationId, variantId: a.id, quantity: 1 })),
      ],
      shipCountry: physical ? selection.shipCountry : undefined,
      ...(giftToken ? { giftToken } : {}),
      ...(flow.creatorCode ? { code: flow.creatorCode } : {}),
    };
    if (gift.enabled) {
      body.giftSenderName = gift.senderName.trim() || undefined;
      body.giftRecipientName = gift.recipientName.trim() || undefined;
      body.giftRecipientEmail = gift.recipientEmail.trim() || undefined;
      body.giftMessage = gift.message.trim().slice(0, GIFT_MESSAGE_MAX) || undefined;
    }

    // No cart: committing to checkout is the add-to-cart moment. Same item ids as the Purchase event.
    const ecommerce = {
      value: total / 100,
      currency: "USD",
      items: [
        { id: variant.id, name: product.name, price: variant.price / 100, quantity: 1, category: product.type, variant: variant.id },
        ...chosenAddons.map((a) => ({ id: a.id, name: a.name, price: addonPrice(a) / 100, quantity: 1, category: "addon" })),
      ],
    };
    track("AddToCart", { product: product.type, variant: variant.id }, ecommerce);
    track(
      "InitiateCheckout",
      {
        value: total / 100,
        currency: "USD",
        product: product.type,
        variant: variant.id,
        num_items: body.items.length,
        gift: gift.enabled,
        offer: discount?.source ?? null,
      },
      ecommerce,
    );

    try {
      const { url } = await startCheckout(body);
      window.location.assign(url);
    } catch (err) {
      if (err instanceof ApiError && (err.code === "checkout_unavailable" || err.status === 503 || err.status === 404)) {
        setCheckout({ kind: "unavailable" });
      } else {
        setCheckout({
          kind: "error",
          message: err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
        });
      }
    }
  }

  let delivery: string;
  if (!physical) {
    delivery = "Delivered to your inbox right after checkout";
  } else if (today !== null) {
    // Same window Stripe shows at checkout (catalog days + the country's extra transit days).
    const [minDays, maxDays] = shipWindow(product.shipDays, selection.shipCountry);
    const from = addBusinessDays(today, minDays);
    const to = addBusinessDays(today, maxDays);
    delivery = `Estimated delivery ${fmtDate(from)} – ${fmtDate(to)}`;
  } else {
    delivery = `Delivered in ${product.shipDays[0]}–${product.shipDays[1]} business days`;
  }

  const holiday = today !== null ? holidayNotice(today, { physical, shipCountry: selection.shipCountry }) : null;
  const stack = valueStackFor({ productType: product.type, shipCountry: selection.shipCountry });
  const checkoutLabel = `Proceed to checkout — ${formatPrice(total)}`;
  const loading = checkout.kind === "loading";
  /** Close-up: the mockup's width inside the 4:5 ivory field, so tall pieces still fit its height. */
  const pieceRatio = printSize ? printSize.widthIn / printSize.heightIn : 3 / 4;
  const closeupWidth = Math.min(76, 100 * pieceRatio);

  return (
    <section className="mx-auto grid w-full max-w-[1440px] gap-10 pt-2 pb-36 sm:px-10 sm:pt-6 sm:pb-28 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-28">
      {/* ---------------- Preview ---------------- */}
      <div className="min-w-0 lg:sticky lg:top-4 lg:self-start">
        <div className="mb-1 flex items-center justify-between gap-3 px-3 sm:mb-3 sm:px-0">
          <button type="button" onClick={onBack} className={cn(TOGGLE, "text-ink-3 hover:text-ink sm:-ml-2")}>
            Back<span className="hidden sm:inline">&nbsp;{backLabel}</span>
          </button>
          {physical && (
            <div role="group" aria-label="Preview view" className="flex items-center gap-2 sm:-mr-2 sm:gap-4">
              {(
                [
                  { id: "room", label: "On the wall" },
                  { id: "closeup", label: "Close-up" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    TOGGLE,
                    view === id ? "text-ink underline underline-offset-[6px]" : "text-ink-3 hover:text-ink",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative bg-paper-2">
          <div className="mx-auto w-full sm:max-w-[560px] lg:max-w-[min(100%,calc((100dvh_-_250px)_*_0.8))]">
            {showRoom ? (
              <FrameMockup
                src={active.previewUrl}
                alt={`${name || "Your dog"} as ${style?.name ?? "a portrait"}, shown to scale as a ${variant.label} ${product.name.toLowerCase()} on a wall`}
                productType={product.type}
                frameColor={selection.frameColor}
                printSize={printSize}
                room
                size="lg"
                priority
                className="max-w-none"
              />
            ) : (
              <div className="@container flex aspect-[4/5] w-full items-center justify-center bg-paper-2">
                <div style={{ width: `${closeupWidth}cqw` }}>
                  <FrameMockup
                    src={active.previewUrl}
                    alt={`${name || "Your dog"} as ${style?.name ?? "a portrait"}, ${product.name}`}
                    productType={product.type}
                    frameColor={selection.frameColor}
                    printSize={printSize}
                    size="lg"
                    priority
                    className="max-w-none"
                  />
                </div>
              </div>
            )}
          </div>
          <p className="label pointer-events-none absolute inset-x-0 bottom-4 px-5 text-center text-ink-3 sm:bottom-6">
            {physical ? `${variant.label} — ${showRoom ? "shown to scale" : "close-up"}` : "High-resolution file"}
          </p>
        </div>
        <p className="mt-3 px-5 text-center text-[12px] text-ink-3 sm:px-0">
          {physical ? "The preview watermark is never printed." : "The preview watermark is not on your file."}
        </p>
      </div>

      {/* ---------------- Configurator ---------------- */}
      <div className="min-w-0 px-5 sm:px-0 lg:pt-14">
        {/* Product */}
        <div role="radiogroup" aria-label="Product" className="flex gap-6 border-b border-line sm:gap-8">
          {PRODUCTS.map((p) => (
            <ProductTab key={p.type} product={p} selected={p.type === product.type} onSelect={() => selectProduct(p.type)} />
          ))}
        </div>

        <p className="label mt-9 text-ink-3">
          {name || "Your dog"}, as {style?.name ?? "a portrait"}
        </p>
        <h1 className="mt-3 font-display text-[40px] leading-[1.04] sm:text-[52px]">{product.name}</h1>
        {discount ? (
          <div className="mt-4 motion-safe:animate-fade-up">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="sr-only">Regular price</span>
              <s className="font-display text-[20px] leading-none text-ink-3 tabular-nums decoration-1">
                {formatPrice(variant.price)}
              </s>
              <span className="sr-only">, {priceTag.toLowerCase()}</span>
              <span className="font-display text-[26px] leading-none tabular-nums">{formatPrice(discounted(variant.price))}</span>
              <span aria-hidden className="label text-ink-3">
                {priceTag}
              </span>
            </p>
            <p className="label mt-3 leading-relaxed text-ink-2">
              {discount.source === "founding" ? (
                <>
                  {FOUNDING_OFFER.label}
                  {typeof offer?.founding.remaining === "number" && (
                    <span className="text-ink-3 tabular-nums"> · {offer.founding.remaining} remaining</span>
                  )}
                </>
              ) : (
                <>
                  Creator code {discount.code} — {discount.percentOff}% off, applied at checkout
                </>
              )}
            </p>
          </div>
        ) : (
          <p className="mt-4 font-display text-[26px] leading-none tabular-nums">{formatPrice(variant.price)}</p>
        )}
        <p className="mt-6 text-[14px] leading-relaxed text-ink-2">{product.tagline}</p>
        <details className="group mt-2">
          <summary className="link-cta inline-flex min-h-11 cursor-pointer list-none items-center text-ink-3 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Details</span>
            <span className="hidden group-open:inline">Hide details</span>
          </summary>
          <ul className="space-y-1.5 pt-1 pb-2 text-[13px] leading-relaxed text-ink-2">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>

        {/* Sizes */}
        {product.variants.length > 1 && (
          <fieldset className="mt-8">
            <legend className={LEGEND}>Size</legend>
            <div className="mt-3 border-t border-line">
              {product.variants.map((v) => {
                const sel = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => selectVariant(v.id)}
                    className={ROW}
                  >
                    <span className={cn("tabular-nums", sel ? "text-ink underline underline-offset-[6px]" : "text-ink-3 group-hover:text-ink")}>
                      {v.label}
                    </span>
                    <span className={cn("tabular-nums", sel ? "text-ink" : "text-ink-3 group-hover:text-ink")}>
                      {discount ? (
                        <>
                          <span className="sr-only">Regular price </span>
                          <s className="mr-2.5 text-ink-3 decoration-1">{formatPrice(v.price)}</s>
                          <span className="sr-only">{priceTag.toLowerCase()} </span>
                          {formatPrice(discounted(v.price))}
                        </>
                      ) : (
                        formatPrice(v.price)
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Frame finish */}
        {product.frameColors && (
          <fieldset className="mt-10">
            <legend className={LEGEND}>Frame</legend>
            <div className="mt-4 flex gap-7">
              {product.frameColors.map((c) => {
                const sel = c === selection.frameColor;
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    aria-label={`${FRAME_LABEL[c]} frame`}
                    onClick={() => setSelection({ frameColor: c })}
                    className="group flex min-h-11 flex-col items-start gap-3 pt-1"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-8 w-8 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] outline-1 outline-offset-[3px] transition-[outline-color]",
                        sel ? "outline-ink" : "outline-transparent group-hover:outline-line",
                      )}
                      style={{ background: FRAME_SWATCH[c] }}
                    />
                    <span className={cn("label", sel ? "text-ink" : "text-ink-3 group-hover:text-ink")}>{FRAME_LABEL[c]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Ship to */}
        {physical && (
          <fieldset className="mt-10">
            <legend className={LEGEND}>Ship to</legend>
            <div className="mt-3 border-t border-line">
              {(Object.keys(SHIPPING_RATES) as ShipCountry[]).map((c) => {
                const sel = selection.shipCountry === c;
                const rate = SHIPPING_RATES[c];
                return (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => setSelection({ shipCountry: c })}
                    className={ROW}
                  >
                    <span className={cn(sel ? "text-ink underline underline-offset-[6px]" : "text-ink-3 group-hover:text-ink")}>
                      {COUNTRY_LABEL[c]}
                    </span>
                    <span className={cn("tabular-nums", sel ? "text-ink" : "text-ink-3 group-hover:text-ink")}>
                      {rate === 0 ? "Complimentary" : `${formatPrice(rate)} flat`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Add-ons: the order bump, with the Heirloom Set saving shown as it happens */}
        {physical && (
          <fieldset className="mt-10">
            <legend className={LEGEND}>Complete the set</legend>
            <div className="mt-3 border-t border-line">
              {ADDONS.map((a) => {
                const checked = selection.addons.includes(a.id);
                const price = addonPrice(a);
                return (
                  <label key={a.id} className="flex min-h-14 cursor-pointer items-start gap-3.5 border-b border-line py-3.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(a.id)}
                      className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-none border border-ink-3 bg-paper transition-colors checked:border-ink checked:bg-ink checked:shadow-[inset_0_0_0_3px_var(--color-paper)] hover:border-ink"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] text-ink">{a.name}</span>
                      <span className="mt-1 block text-[12px] leading-snug text-ink-3">{a.description}</span>
                    </span>
                    <span className="shrink-0 text-[13px] text-ink tabular-nums">
                      {price < a.price && checked ? (
                        <>
                          <span className="sr-only">Regular price </span>
                          <s className="mr-2 text-ink-3 decoration-1">{formatPrice(a.price)}</s>
                          <span className="sr-only">{HEIRLOOM_SET.name} price </span>
                          {formatPrice(price)}
                        </>
                      ) : (
                        `+ ${formatPrice(a.price)}`
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
            <p aria-live="polite" className={cn("mt-3 text-[12px] leading-snug", heirloom ? "label text-ink" : "text-ink-3")}>
              {heirloom
                ? `${HEIRLOOM_SET.name.replace(/^The /, "")} — you save ${formatPrice(HEIRLOOM_SET.discountCents)}`
                : HEIRLOOM_SET.line}
            </p>
          </fieldset>
        )}

        {/* Gift */}
        <div className="mt-8 border-y border-line">
          <button
            type="button"
            role="switch"
            aria-checked={gift.enabled}
            aria-controls={ids.gift}
            onClick={() => setGift({ enabled: !gift.enabled })}
            className="group flex min-h-14 w-full items-center justify-between gap-4 text-left"
          >
            <span>
              <span className="link-cta block group-hover:opacity-60">Send as a gift</span>
              <span className="mt-2 block text-[12px] text-ink-3">A note and an instant Gift Reveal, sent today.</span>
            </span>
            <span aria-hidden className="label w-4 text-center text-[15px] text-ink">
              {gift.enabled ? "−" : "+"}
            </span>
          </button>
          {gift.enabled && (
            <div id={ids.gift} className="grid gap-x-6 gap-y-6 pt-3 pb-8 sm:grid-cols-2">
              <Field id={ids.from} label="From" placeholder="Your name" value={gift.senderName} onChange={(v) => setGift({ senderName: v })} autoComplete="name" />
              <Field id={ids.to} label="To" placeholder="Their name" value={gift.recipientName} onChange={(v) => setGift({ recipientName: v })} />
              <div className="sm:col-span-2">
                <Field
                  id={ids.email}
                  label="Their email — optional"
                  type="email"
                  placeholder="them@email.com"
                  value={gift.recipientEmail}
                  onChange={(v) => setGift({ recipientEmail: v })}
                  invalid={Boolean(giftError)}
                />
                <p className="mt-2.5 text-[12px] leading-snug text-ink-3">
                  We&apos;ll email them a Gift Reveal right after checkout; the print follows. Leave blank to keep it a
                  surprise.
                </p>
                {giftError && (
                  <p role="alert" className="mt-2 text-[13px] text-ink">
                    {giftError}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={ids.msg} className="label text-ink-3">
                  Message
                </label>
                <textarea
                  id={ids.msg}
                  rows={3}
                  maxLength={GIFT_MESSAGE_MAX}
                  value={gift.message}
                  onChange={(e) => setGift({ message: e.target.value })}
                  placeholder="Happy birthday. I thought Biscuit deserved a royal portrait."
                  className="mt-2.5 w-full resize-none rounded-none border border-line bg-transparent px-3.5 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus-visible:outline-none"
                />
                <p className="label mt-1.5 text-right text-ink-3 tabular-nums">
                  {gift.message.length}/{GIFT_MESSAGE_MAX}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Delivery (+ the real holiday cutoff, from Nov 1 only) */}
        <p className="mt-6 text-[13px] leading-relaxed text-ink-3">{delivery}</p>
        {holiday && <p className="label mt-2 text-ink">{holiday}</p>}

        {/* The value stack: everything in the bag, then the price, then the guarantee, then the button */}
        <section aria-labelledby={ids.stack} className="mt-10" aria-live="polite">
          <h2 id={ids.stack} className={LEGEND}>
            Your commission
          </h2>
          <dl className="mt-3 border-t border-line pt-3 text-[13px]">
            <StackRow
              item={`${product.name}${variant.widthIn ? ` · ${variant.label}` : ""}${product.type === "framed" ? ` · ${FRAME_LABEL[selection.frameColor]}` : ""}`}
              value={formatPrice(variant.price)}
            />
            {chosenAddons.map((a) => (
              <StackRow
                key={a.id}
                item={heirloom ? `${a.name} · ${HEIRLOOM_SET.name.replace(/^The /, "")}` : a.name}
                value={formatPrice(addonPrice(a))}
              />
            ))}
            {stack.map((row) => (
              <StackRow key={row.item} item={row.item} value={row.value} quiet />
            ))}
            {physical && shipping > 0 && <StackRow item={`Tracked shipping to ${COUNTRY_LABEL[selection.shipCountry]}`} value={formatPrice(shipping)} />}
            {discount && discountCents > 0 && (
              <StackRow
                item={
                  discount.source === "founding"
                    ? `Founding offer, ${discount.percentOff}% off`
                    : `Creator code ${discount.code}, ${discount.percentOff}% off`
                }
                value={`−${formatPrice(discountCents)}`}
              />
            )}
          </dl>
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <p className="label text-ink">Today</p>
            <p className="flex items-baseline gap-3">
              {discountCents > 0 && (
                <>
                  <span className="sr-only">Regular total </span>
                  <s className="text-[14px] text-ink-3 tabular-nums decoration-1">{formatPrice(merchandise + shipping)}</s>
                  <span className="sr-only">, today </span>
                </>
              )}
              <span className="font-display text-[30px] leading-none tabular-nums">{formatPrice(total)}</span>
            </p>
          </div>
          <p className="mt-3 text-[12px] text-ink-3">No hidden fees. Sales tax, if any, is shown before you pay.</p>
          <CreatorCode code={flow.creatorCode} className="mt-4" />
        </section>

        {/* Risk reversal: the last thing read before the button */}
        <div className="mt-9 border-t border-line pt-7">
          <p className="font-display text-[24px] leading-tight">{GUARANTEE.name}</p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">{GUARANTEE.body}</p>
        </div>

        <div className="mt-8">
          {checkout.kind === "unavailable" ? (
            <div className="border-t border-line pt-7">
              <p className="font-display text-[26px] leading-tight">Checkout is paused for a moment.</p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
                Leave your email and we&apos;ll send a secure checkout link for this exact portrait and size. Your
                preview is saved.
              </p>
              <EmailCapture
                className="mt-4"
                source="checkout_unavailable"
                generationId={active.generationId}
                petName={name || undefined}
                cta="Send link"
                doneMessage="Thank you. We'll email your checkout link shortly."
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onCheckout}
                disabled={loading}
                aria-label={loading ? "Opening secure checkout" : checkoutLabel}
                className={buttonClasses("primary", "lg", "hidden w-full disabled:opacity-70 sm:inline-flex")}
              >
                {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />}
                {loading ? "Opening secure checkout…" : checkoutLabel}
              </button>
              {checkout.kind === "error" && (
                <p role="alert" className="mt-3 text-[13px] text-ink">
                  {checkout.message}
                </p>
              )}
              <p className="mt-4 text-center text-[12px] text-ink-3">Secure checkout by Stripe · Apple Pay · Google Pay · cards</p>
            </>
          )}
        </div>
      </div>

      {/* Mobile sticky checkout */}
      {checkout.kind !== "unavailable" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1" aria-hidden>
              <p className="flex items-baseline gap-2.5">
                <span className="font-display text-[26px] leading-none tabular-nums">{formatPrice(total)}</span>
                {discountCents > 0 && (
                  <s className="text-[13px] text-ink-3 tabular-nums decoration-1">{formatPrice(merchandise + shipping)}</s>
                )}
              </p>
              <p className="label mt-1.5 truncate text-ink-3">
                {discountCents > 0 ? `${priceTag} · ` : ""}
                {product.shortName}
                {variant.widthIn ? ` · ${variant.label}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={loading}
              aria-label={loading ? "Opening secure checkout" : checkoutLabel}
              className={buttonClasses("primary", "md", "shrink-0 px-7 disabled:opacity-70")}
            >
              {loading && <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden />}
              {loading ? "Opening…" : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const LEGEND = "label text-ink";
const TOGGLE = "label inline-flex min-h-11 items-center px-2 transition-colors";
const ROW =
  "group label flex min-h-12 w-full items-center justify-between gap-4 border-b border-line text-left transition-colors";

function ProductTab({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "label relative inline-flex min-h-12 items-center transition-colors",
        selected ? "text-ink" : "text-ink-3 hover:text-ink",
      )}
    >
      {product.shortName}
      {selected && <span aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-ink" />}
    </button>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label text-ink-3">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        maxLength={type === "email" ? 254 : 60}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "off"}
        aria-invalid={invalid || undefined}
        className={cn(
          "mt-1 h-11 w-full rounded-none border-0 border-b bg-transparent px-0 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none",
          invalid ? "border-ink" : "border-line",
        )}
      />
    </div>
  );
}

/** One line of the value stack: what's in the bag on the left, its price (or Included) on the right. */
function StackRow({ item, value, quiet }: { item: string; value: ReactNode; quiet?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-[5px]">
      <dt className={quiet ? "text-ink-2" : "text-ink"}>{item}</dt>
      <dd className={cn("shrink-0 tabular-nums", quiet ? "label text-ink-3" : "text-ink")}>{value}</dd>
    </div>
  );
}

/**
 * "Have a creator code?": while FOUNDING100 is applied automatically Stripe's promo-code box is
 * off, so a creator's code is entered here. It's checked against /api/offer before it's kept,
 * and sent with the checkout so the creator is credited (and their discount applies).
 */
function CreatorCode({ code, className }: { code: string; className?: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "invalid" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const typed = value.trim().toUpperCase();
    if (!typed) return;
    setState("checking");
    try {
      const res = await fetchOffer(typed);
      if (res.code?.valid) {
        updateFlow((s) => ({ ...s, creatorCode: res.code!.code }));
        setState("idle");
        setValue("");
        setOpen(false);
      } else {
        setState("invalid");
      }
    } catch {
      setState("error");
    }
  }

  if (code) {
    return (
      <p className={cn("flex flex-wrap items-center gap-x-4 text-[12px] text-ink-3", className)}>
        <span>
          Creator code <span className="text-ink">{code}</span> applied.
        </span>
        <button
          type="button"
          onClick={() => updateFlow((s) => ({ ...s, creatorCode: "" }))}
          className="link-cta inline-flex min-h-11 items-center"
        >
          Remove
        </button>
      </p>
    );
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={cn("link-cta inline-flex min-h-11 items-center text-ink-3", className)}>
        Have a creator code?
      </button>
    );
  }
  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <label htmlFor={id} className="label text-ink-3">
        Creator code
      </label>
      <div className="mt-1 flex items-end gap-4">
        <input
          id={id}
          type="text"
          value={value}
          maxLength={40}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          onChange={(e) => {
            setValue(e.target.value);
            if (state !== "checking") setState("idle");
          }}
          aria-invalid={state === "invalid" || undefined}
          aria-describedby={state === "invalid" || state === "error" ? `${id}-msg` : undefined}
          className="h-11 min-w-0 flex-1 rounded-none border-0 border-b border-line bg-transparent px-0 text-[16px] uppercase text-ink outline-none transition-colors placeholder:normal-case placeholder:text-ink-3/70 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus-visible:outline-none"
          placeholder="e.g. the code from a creator's post"
        />
        <button
          type="submit"
          disabled={state === "checking" || !value.trim()}
          className={buttonClasses("secondary", "sm", "shrink-0 px-6")}
        >
          {state === "checking" ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
          Apply
        </button>
      </div>
      {(state === "invalid" || state === "error") && (
        <p id={`${id}-msg`} role="alert" className="mt-2 text-[12px] text-ink">
          {state === "invalid" ? "We don't recognize that code." : "We couldn't check that code just now. Please try again."}
        </p>
      )}
    </form>
  );
}
