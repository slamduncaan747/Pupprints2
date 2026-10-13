"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import {
  ADDONS,
  getStyle,
  PRODUCT_MAP,
  PRODUCTS,
  PROMISES,
  SHIPPING_RATES,
  type FrameColor,
  type Product,
  type ProductType,
} from "@/lib/catalog";
import { cn, formatPrice } from "@/lib/utils";
import { FrameMockup } from "@/components/product/frame-mockup";
import { shipWindow } from "@/components/order/timeline";
import { ApiError, startCheckout, type CheckoutRequest } from "./api";
import { EmailCapture, isEmail } from "./email-capture";
import { updateFlow, type FlowState, type Generation, type ShipCountry } from "./store";

const FRAME_LABEL: Record<FrameColor, string> = { black: "Black", white: "White", oak: "Natural oak" };
const FRAME_SWATCH: Record<FrameColor, string> = { black: "#161616", white: "#fbfbfa", oak: "#c9a77f" };
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

/* ------------------------------ component ------------------------------ */

type CheckoutState = { kind: "idle" } | { kind: "loading" } | { kind: "unavailable" } | { kind: "error"; message: string };

export function ProductStep({
  flow,
  active,
  onBack,
  giftToken,
  backLabel = "to styles",
}: {
  flow: FlowState;
  active: Generation;
  onBack: () => void;
  /** Set when ordering a gift portrait from its reveal link (not made in this browser). */
  giftToken?: string;
  /** Shown after "Back" on wider screens. */
  backLabel?: string;
}) {
  const { selection, gift } = flow;
  const product = PRODUCT_MAP[selection.productType];
  const variant = product.variants.find((v) => v.id === selection.variantId) ?? product.variants[0];
  const physical = product.type !== "digital";
  const chosenAddons = physical ? ADDONS.filter((a) => selection.addons.includes(a.id)) : [];
  const shipping = physical ? SHIPPING_RATES[selection.shipCountry] : 0;
  const subtotal = variant.price + chosenAddons.reduce((sum, a) => sum + a.price, 0);
  const total = subtotal + shipping;
  const style = getStyle(active.style);
  const name = (giftToken ? (active.petName ?? "") : flow.petName).trim();

  const [view, setView] = useState<"room" | "closeup">("room");
  const [checkout, setCheckout] = useState<CheckoutState>({ kind: "idle" });
  const [giftError, setGiftError] = useState<string | null>(null);
  const today = useToday();
  const ids = { gift: useId(), from: useId(), to: useId(), email: useId(), msg: useId() };

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
        ...chosenAddons.map((a) => ({ id: a.id, name: a.name, price: a.price / 100, quantity: 1, category: "addon" })),
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

  const checkoutLabel = `Checkout — ${formatPrice(total)}`;
  const loading = checkout.kind === "loading";

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 pt-6 pb-32 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:pb-24">
      {/* ---------------- Preview ---------------- */}
      <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 inline-flex min-h-11 items-center gap-1.5 px-1 text-[13px] text-ink-2 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            <span>
              Back<span className="hidden sm:inline"> {backLabel}</span>
            </span>
          </button>
          {physical && (
            <div role="group" aria-label="Preview view" className="flex items-center gap-4 text-[13px]">
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
                    "inline-flex min-h-11 items-center transition-colors",
                    view === id ? "text-ink underline decoration-1 underline-offset-[6px]" : "text-ink-3 hover:text-ink-2",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {showRoom ? (
          <FrameMockup
            src={active.previewUrl}
            alt={`${name || "Your dog"} as ${style?.name ?? "a portrait"}, shown as a ${variant.label} ${product.name.toLowerCase()} above a sofa`}
            productType={product.type}
            frameColor={selection.frameColor}
            printSize={printSize}
            room
            size="lg"
            priority
            className="mx-auto"
          />
        ) : (
          <div className="flex justify-center bg-paper-2 px-8 py-10 sm:px-12 sm:py-14">
            {/* Cap by viewport height so tall 2:3 pieces stay fully visible in the sticky column. */}
            <div
              className="flex w-full justify-center"
              style={{ maxWidth: `min(420px, calc((100dvh - 300px) * ${printSize ? printSize.widthIn / printSize.heightIn : 0.75}))` }}
            >
              <FrameMockup
                src={active.previewUrl}
                alt={`${name || "Your dog"} as ${style?.name ?? "a portrait"}, ${product.name}`}
                productType={product.type}
                frameColor={selection.frameColor}
                printSize={printSize}
                size="lg"
                priority
              />
            </div>
          </div>
        )}
        <p className="mt-3 text-center text-[12px] text-ink-3">
          {showRoom
            ? `${variant.label} shown to scale above a 6-ft sofa. The preview watermark is not printed.`
            : "The watermark appears on previews only, never on your print or file."}
        </p>
      </div>

      {/* ---------------- Configurator ---------------- */}
      <div className="min-w-0">
        <h1 className="font-display text-[2.4rem] leading-[1.04] sm:text-[3rem]">
          {giftToken ? `Put ${name || "them"} on your wall.` : "Choose your piece."}
        </h1>

        {/* Product */}
        <div role="radiogroup" aria-label="Product" className="mt-8 grid grid-cols-4 border-b border-line">
          {PRODUCTS.map((p) => (
            <ProductTab key={p.type} product={p} selected={p.type === product.type} onSelect={() => selectProduct(p.type)} />
          ))}
        </div>
        <p className="mt-4 text-[14px] leading-relaxed text-ink-2">{product.tagline}</p>
        <details className="group mt-1">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center text-[13px] text-ink-3 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Details</span>
            <span className="hidden group-open:inline">Hide details</span>
          </summary>
          <ul className="space-y-1 pb-1 text-[13px] leading-relaxed text-ink-2">
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>

        {/* Sizes */}
        {product.variants.length > 1 && (
          <fieldset className="mt-7">
            <legend className={LEGEND}>Size</legend>
            <div className="mt-2 border-t border-line">
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
                    <Dot on={sel} />
                    <span className={cn("flex-1 tabular-nums", sel ? "text-ink" : "text-ink-2")}>{v.label}</span>
                    <span className={cn("tabular-nums", sel ? "text-ink" : "text-ink-2")}>{formatPrice(v.price)}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Frame color */}
        {product.frameColors && (
          <fieldset className="mt-7">
            <legend className={LEGEND}>
              Frame <span className="tracking-normal normal-case">· {FRAME_LABEL[selection.frameColor]}</span>
            </legend>
            <div className="mt-2 -ml-2.5 flex">
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
                    className="group flex h-11 w-11 items-center justify-center"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-6 w-6 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] outline-1 outline-offset-[3px] transition-[outline-color]",
                        sel ? "outline-ink" : "outline-transparent group-hover:outline-line",
                      )}
                      style={{ background: FRAME_SWATCH[c] }}
                    />
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Ship to */}
        {physical && (
          <fieldset className="mt-7">
            <legend className={LEGEND}>Ship to</legend>
            <div className="mt-2 border-t border-line">
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
                    <Dot on={sel} />
                    <span className={cn("flex-1", sel ? "text-ink" : "text-ink-2")}>{COUNTRY_LABEL[c]}</span>
                    <span className={cn("tabular-nums", sel ? "text-ink" : "text-ink-2")}>
                      {rate === 0 ? "Free shipping" : `${formatPrice(rate)} flat`}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Add-ons */}
        {physical && (
          <fieldset className="mt-7">
            <legend className={LEGEND}>
              Add a matching gift <span className="tracking-normal normal-case">(optional)</span>
            </legend>
            <div className="mt-2 border-t border-line">
              {ADDONS.map((a) => {
                const checked = selection.addons.includes(a.id);
                return (
                  <label key={a.id} className="flex min-h-14 cursor-pointer items-start gap-3 border-b border-line py-3.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(a.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#111111]"
                    />
                    <span className="flex-1">
                      <span className={cn("block text-[15px]", checked ? "text-ink" : "text-ink-2")}>{a.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{a.description}</span>
                    </span>
                    <span className={cn("text-[15px] tabular-nums", checked ? "text-ink" : "text-ink-2")}>
                      +{formatPrice(a.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Gift */}
        <div className={cn("mt-7 border-b border-line", !physical && "border-t")}>
          <label htmlFor={ids.gift} className="flex min-h-16 cursor-pointer items-center gap-4 py-3">
            <span className="flex-1">
              <span className="block text-[15px] text-ink">This is a gift</span>
              <span className="mt-0.5 block text-[13px] text-ink-3">Add a note and send an instant Gift Reveal</span>
            </span>
            <input
              id={ids.gift}
              type="checkbox"
              role="switch"
              checked={gift.enabled}
              onChange={(e) => setGift({ enabled: e.target.checked })}
              className="peer sr-only"
            />
            <span
              aria-hidden
              className="relative h-6 w-10 shrink-0 rounded-full border border-ink/25 bg-paper transition-colors peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-ink after:absolute after:top-[3px] after:left-[3px] after:h-4 after:w-4 after:rounded-full after:bg-ink/35 after:transition-[transform,background-color] peer-checked:after:translate-x-4 peer-checked:after:bg-paper"
            />
          </label>
          {gift.enabled && (
            <div className="grid gap-4 pt-1 pb-6 sm:grid-cols-2">
              <Field id={ids.from} label="From" placeholder="Your name" value={gift.senderName} onChange={(v) => setGift({ senderName: v })} autoComplete="name" />
              <Field id={ids.to} label="To" placeholder="Their name" value={gift.recipientName} onChange={(v) => setGift({ recipientName: v })} />
              <div className="sm:col-span-2">
                <Field
                  id={ids.email}
                  label="Their email (optional)"
                  type="email"
                  placeholder="them@email.com"
                  value={gift.recipientEmail}
                  onChange={(v) => setGift({ recipientEmail: v })}
                  invalid={Boolean(giftError)}
                />
                <p className="mt-2 text-[12.5px] leading-snug text-ink-3">
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
                <label htmlFor={ids.msg} className="text-[13px] text-ink-2">
                  Message
                </label>
                <textarea
                  id={ids.msg}
                  rows={3}
                  maxLength={GIFT_MESSAGE_MAX}
                  value={gift.message}
                  onChange={(e) => setGift({ message: e.target.value })}
                  placeholder="Happy birthday! I thought Biscuit deserved a royal portrait…"
                  className="mt-2 w-full resize-none rounded-[3px] border border-line bg-white px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink"
                />
                <p className="mt-1 text-right text-[12px] text-ink-3 tabular-nums">
                  {gift.message.length}/{GIFT_MESSAGE_MAX}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Promises */}
        <ul className="mt-7 space-y-1 text-[13px] leading-relaxed text-ink-2">
          <li>
            {delivery}
            {physical && selection.shipCountry === "US" && <span className="text-ink-3"> · {PROMISES.shipping}</span>}
          </li>
          {physical && <li>{PROMISES.digital}</li>}
          {physical && <li>Checked by a person before it&apos;s printed</li>}
          <li>{PROMISES.guarantee}</li>
        </ul>

        {/* Summary */}
        <div className="mt-8 border-t border-line pt-5" aria-live="polite">
          <dl className="space-y-2 text-[14px]">
            <SummaryRow
              label={`${product.name}${variant.widthIn ? ` · ${variant.label}` : ""}${product.type === "framed" ? ` · ${FRAME_LABEL[selection.frameColor]}` : ""}`}
              value={formatPrice(variant.price)}
            />
            {physical && <SummaryRow label="Hi-res digital file" value="Included" />}
            {chosenAddons.map((a) => (
              <SummaryRow key={a.id} label={a.name} value={formatPrice(a.price)} />
            ))}
            {physical && (
              <SummaryRow
                label={`Shipping to ${COUNTRY_LABEL[selection.shipCountry]}`}
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
              />
            )}
            <div className="flex items-baseline justify-between border-t border-line pt-4">
              <dt className="text-[15px] text-ink">Total</dt>
              <dd className="font-display text-[2rem] leading-none tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[12.5px] text-ink-3">No hidden fees. Sales tax, if any, is shown before you pay.</p>

          {checkout.kind === "unavailable" ? (
            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[15px] text-ink">Checkout is taking a short break.</p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-2">
                Leave your email and we&apos;ll send a secure checkout link for this exact portrait and size. Your
                preview is saved.
              </p>
              <EmailCapture
                className="mt-4"
                source="checkout_unavailable"
                generationId={active.generationId}
                petName={name || undefined}
                cta="Send link"
                doneMessage="Got it! We'll email your checkout link shortly."
              />
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onCheckout}
                disabled={loading}
                className="mt-6 hidden h-14 w-full items-center justify-center gap-2 rounded-[3px] bg-ink text-[15px] font-medium text-paper transition-colors hover:bg-ink/85 disabled:opacity-70 sm:inline-flex"
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
                {loading ? "Opening secure checkout…" : checkoutLabel}
              </button>
              {checkout.kind === "error" && (
                <p role="alert" className="mt-3 text-[13.5px] text-ink">
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
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1" aria-hidden>
              <p className="font-display text-[1.75rem] leading-none tabular-nums">{formatPrice(total)}</p>
              <p className="mt-1 truncate text-[12px] text-ink-3">
                {product.shortName} · {variant.widthIn ? variant.label : "High-res file"}
                {physical ? " · file included" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={loading}
              aria-label={loading ? "Opening secure checkout" : checkoutLabel}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[3px] bg-ink px-8 text-[15px] font-medium text-paper transition-colors active:bg-ink/85 disabled:opacity-70"
            >
              {loading && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />}
              {loading ? "Opening…" : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const LEGEND = "text-[12px] tracking-[0.14em] text-ink-3 uppercase";
const ROW = "flex min-h-12 w-full items-center gap-3 border-b border-line py-2 text-left text-[15px] transition-colors hover:bg-paper-2/60";

/** Radio indicator: a hollow circle, filled when chosen. */
function Dot({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-4 w-4 shrink-0 rounded-full border transition-colors",
        on ? "border-ink bg-ink shadow-[inset_0_0_0_3px_var(--color-paper)]" : "border-ink/30",
      )}
    />
  );
}

function ProductTab({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: () => void }) {
  const from = Math.min(...product.variants.map((v) => v.price));
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "relative flex min-h-14 flex-col items-center justify-center gap-0.5 pt-1 pb-2.5 text-center transition-colors",
        selected ? "text-ink" : "text-ink-3 hover:text-ink-2",
      )}
    >
      <span className="text-[15px]">{product.shortName}</span>
      <span className="text-[12px] text-ink-3 tabular-nums">
        {product.variants.length > 1 ? `from ${formatPrice(from)}` : formatPrice(from)}
      </span>
      {selected && <span aria-hidden className="absolute inset-x-1 -bottom-px h-px bg-ink" />}
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
      <label htmlFor={id} className="text-[13px] text-ink-2">
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
          "mt-2 h-12 w-full rounded-[3px] border bg-white px-4 text-[16px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink",
          invalid ? "border-ink" : "border-line",
        )}
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-2">{label}</dt>
      <dd className="shrink-0 text-ink tabular-nums">{value}</dd>
    </div>
  );
}
