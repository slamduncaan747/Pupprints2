"use client";

import { useId, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Gift,
  LoaderCircle,
  Lock,
  Maximize2,
  ShieldCheck,
  Sofa,
  Truck,
  UserCheck,
} from "lucide-react";
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
import { Eyebrow } from "@/components/ui/container";
import { FrameMockup } from "@/components/product/frame-mockup";
import { shipWindow } from "@/components/order/timeline";
import { ApiError, startCheckout, type CheckoutRequest } from "./api";
import { EmailCapture, isEmail } from "./email-capture";
import { updateFlow, type FlowState, type Generation, type ShipCountry } from "./store";

const FRAME_LABEL: Record<FrameColor, string> = { black: "Black", white: "White", oak: "Natural oak" };
const FRAME_CHIP: Record<FrameColor, string> = { black: "Black", white: "White", oak: "Oak" };
const FRAME_SWATCH: Record<FrameColor, string> = {
  black: "linear-gradient(135deg, #3a3532, #121110)",
  white: "linear-gradient(135deg, #ffffff, #e4dfd5)",
  oak: "linear-gradient(135deg, #dcbc8f, #a87b4c)",
};
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
    <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-6 pb-36 sm:px-8 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pb-20">
      {/* ---------------- Preview ---------------- */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center gap-2 rounded-full px-1 text-[14px] font-medium text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>
              Back<span className="hidden sm:inline"> {backLabel}</span>
            </span>
          </button>
          {physical && (
            <div
              role="group"
              aria-label="Preview view"
              className="flex rounded-full bg-white p-1 text-[12.5px] font-medium shadow-soft ring-1 ring-line"
            >
              {(
                [
                  { id: "room", label: "On the wall", Icon: Sofa },
                  { id: "closeup", label: "Close-up", Icon: Maximize2 },
                ] as const
              ).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-full px-3 transition",
                    view === id ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
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
            <div className="flex justify-center rounded-card bg-paper-2 px-6 py-8 sm:px-12 sm:py-12">
              {/* Cap by viewport height so tall 2:3 pieces stay fully visible in the sticky column. */}
              <div
                className="flex w-full justify-center"
                style={{ maxWidth: `min(480px, calc((100dvh - 300px) * ${printSize ? printSize.widthIn / printSize.heightIn : 0.75}))` }}
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
        </div>
        <p className="mt-3 text-center text-[12.5px] text-ink-3">
          {showRoom
            ? `${variant.label} shown to scale above a 6-ft sofa. Preview watermark is not printed.`
            : "Watermark appears on previews only — never on your print or file."}
        </p>
      </div>

      {/* ---------------- Configurator ---------------- */}
      <div className="min-w-0">
        <Eyebrow className="hidden sm:block">{giftToken ? "Your gift portrait" : "Step 3 of 3 · Your piece"}</Eyebrow>
        <h1 className="font-display text-[2.15rem] leading-[1.05] sm:mt-3 sm:text-[2.75rem]">
          {giftToken ? `Put ${name || "them"} on your wall.` : "Choose your piece."}
        </h1>

        {/* Product tabs */}
        <div role="radiogroup" aria-label="Product" className="mt-6 grid grid-cols-4 gap-2">
          {PRODUCTS.map((p) => (
            <ProductTab key={p.type} product={p} selected={p.type === product.type} onSelect={() => selectProduct(p.type)} />
          ))}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{product.tagline}</p>

        {/* Sizes */}
        {product.variants.length > 1 && (
          <fieldset className="mt-6">
            <legend className="text-[13px] font-semibold tracking-wide text-ink uppercase">Size</legend>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fit,minmax(5.25rem,1fr))]">
              {product.variants.map((v) => {
                const sel = v.id === variant.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => selectVariant(v.id)}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center rounded-xl px-2 py-2 transition",
                      sel ? "bg-ink text-paper shadow-soft" : "bg-white text-ink ring-1 ring-line hover:ring-ink/40",
                    )}
                  >
                    <span className="text-[15px] font-semibold tabular-nums">{v.label}</span>
                    <span className={cn("text-[13px] tabular-nums", sel ? "text-paper/75" : "text-ink-2")}>
                      {formatPrice(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Frame color */}
        {product.frameColors && (
          <fieldset className="mt-6">
            <legend className="text-[13px] font-semibold tracking-wide text-ink uppercase">
              Frame <span className="font-normal text-ink-2 normal-case">· {FRAME_LABEL[selection.frameColor]}</span>
            </legend>
            <div className="mt-3 flex gap-3">
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
                    className={cn(
                      "flex h-12 items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[14px] transition",
                      sel ? "bg-white font-medium ring-2 ring-ink" : "bg-white ring-1 ring-line hover:ring-ink/40",
                    )}
                  >
                    <span className="h-9 w-9 rounded-full ring-1 ring-ink/15" style={{ background: FRAME_SWATCH[c] }} />
                    {FRAME_CHIP[c]}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Details */}
        <ul className="mt-6 space-y-2 text-[14px] text-ink-2">
          {product.details.map((d) => (
            <li key={d} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
              {d}
            </li>
          ))}
        </ul>

        {/* Ship to */}
        {physical && (
          <fieldset className="mt-7">
            <legend className="text-[13px] font-semibold tracking-wide text-ink uppercase">Ship to</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
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
                    className={cn(
                      "flex min-h-14 flex-col items-start justify-center rounded-xl px-4 py-2 text-left transition",
                      sel ? "bg-white ring-2 ring-ink" : "bg-white ring-1 ring-line hover:ring-ink/40",
                    )}
                  >
                    <span className="text-[14.5px] font-medium">{COUNTRY_LABEL[c]}</span>
                    <span className={cn("text-[13px]", rate === 0 ? "font-medium text-moss" : "text-ink-2")}>
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
            <legend className="text-[13px] font-semibold tracking-wide text-ink uppercase">
              Add a matching gift <span className="font-normal text-ink-3 normal-case">(optional)</span>
            </legend>
            <div className="mt-3 space-y-2">
              {ADDONS.map((a) => {
                const checked = selection.addons.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={cn(
                      "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl bg-white px-4 py-3 transition",
                      checked ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-ink/40",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(a.id)}
                      className="h-5 w-5 shrink-0 accent-[#1b1814]"
                    />
                    <span className="flex-1">
                      <span className="block text-[14.5px] font-medium">{a.name}</span>
                      <span className="block text-[13px] leading-snug text-ink-2">{a.description}</span>
                    </span>
                    <span className="text-[14.5px] font-medium tabular-nums">+{formatPrice(a.price)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Promises */}
        <ul className="mt-7 grid gap-2.5 rounded-2xl bg-sage-soft/60 p-4 text-[14px] text-ink sm:p-5">
          {physical && (
            <li className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
              {PROMISES.digital}
            </li>
          )}
          <li className="flex gap-2.5">
            <Truck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
            <span>
              {delivery}
              {physical && selection.shipCountry === "US" && <span className="text-ink-2"> · {PROMISES.shipping}</span>}
            </span>
          </li>
          {physical && (
            <li className="flex gap-2.5">
              <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
              Checked by a person before it&apos;s printed
            </li>
          )}
          <li className="flex gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden />
            {PROMISES.guarantee}
          </li>
        </ul>

        {/* Gift */}
        <div className="mt-7 rounded-2xl bg-white ring-1 ring-line">
          <label htmlFor={ids.gift} className="flex min-h-14 cursor-pointer items-center gap-3 px-4 py-3 sm:px-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush text-clay-dark">
              <Gift className="h-4 w-4" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] font-medium">This is a gift</span>
              <span className="block text-[13px] text-ink-2">Add a note and send an instant Gift Reveal</span>
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
              className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition peer-checked:bg-moss peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
            />
          </label>
          {gift.enabled && (
            <div className="grid gap-4 border-t border-line px-4 pt-4 pb-5 sm:grid-cols-2 sm:px-5">
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
                <p className="mt-1.5 text-[12.5px] leading-snug text-ink-3">
                  We&apos;ll email them a Gift Reveal of their portrait right after checkout — the print follows. Leave
                  blank to keep it a surprise.
                </p>
                {giftError && (
                  <p role="alert" className="mt-1.5 text-[13px] text-clay-dark">
                    {giftError}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={ids.msg} className="text-[13px] font-medium text-ink">
                  Message
                </label>
                <textarea
                  id={ids.msg}
                  rows={3}
                  maxLength={GIFT_MESSAGE_MAX}
                  value={gift.message}
                  onChange={(e) => setGift({ message: e.target.value })}
                  placeholder="Happy birthday! I thought Biscuit deserved a royal portrait…"
                  className="mt-1.5 w-full resize-none rounded-xl bg-paper px-4 py-3 text-[16px] ring-1 ring-line outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-ink"
                />
                <p className="text-right text-[12px] text-ink-3 tabular-nums">
                  {gift.message.length}/{GIFT_MESSAGE_MAX}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-7 rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5" aria-live="polite">
          <dl className="space-y-2 text-[14.5px]">
            <SummaryRow
              label={`${product.name}${variant.widthIn ? ` · ${variant.label}` : ""}${product.type === "framed" ? ` · ${FRAME_LABEL[selection.frameColor]}` : ""}`}
              value={formatPrice(variant.price)}
            />
            {physical && <SummaryRow label="Hi-res digital file" value="Included" muted />}
            {chosenAddons.map((a) => (
              <SummaryRow key={a.id} label={a.name} value={formatPrice(a.price)} />
            ))}
            {physical && (
              <SummaryRow
                label={`Shipping to ${COUNTRY_LABEL[selection.shipCountry]}`}
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
                muted={shipping === 0}
              />
            )}
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-display text-xl">Total</dt>
              <dd className="font-display text-2xl tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-[12.5px] text-ink-3">No hidden fees. Sales tax, if any, is shown before you pay.</p>

          {checkout.kind === "unavailable" ? (
            <div className="mt-5 rounded-xl bg-butter-soft p-4">
              <p className="text-[14.5px] font-medium text-ink">Checkout is taking a short break.</p>
              <p className="mt-1 text-[13.5px] leading-snug text-ink-2">
                Leave your email and we&apos;ll send you a secure checkout link for this exact portrait and size — your
                preview is saved.
              </p>
              <EmailCapture
                className="mt-3"
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
                className="mt-5 hidden h-14 w-full items-center justify-center gap-2 rounded-full bg-clay text-[16.5px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)] transition hover:bg-clay-dark active:scale-[0.98] disabled:opacity-70 sm:inline-flex"
              >
                {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
                {loading ? "Opening secure checkout…" : checkoutLabel}
              </button>
              {checkout.kind === "error" && (
                <p role="alert" className="mt-3 flex gap-2 text-[13.5px] text-clay-dark">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {checkout.message}
                </p>
              )}
              <TrustRow />
            </>
          )}
        </div>
      </div>

      {/* Mobile sticky checkout */}
      {checkout.kind !== "unavailable" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl sm:hidden">
          <div className="flex items-center gap-3">
            {/* Live mini mockup: options are chosen below the fold, so mirror them here. */}
            <div className="w-11 shrink-0" aria-hidden>
              <FrameMockup
                src={active.previewUrl}
                alt=""
                productType={product.type}
                frameColor={selection.frameColor}
                printSize={printSize}
                size="sm"
              />
            </div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={loading}
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-clay text-[16px] font-medium text-white shadow-[0_8px_24px_-8px_rgb(200_85_61/0.7)] active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Lock className="h-4 w-4" aria-hidden />}
              {loading ? "Opening secure checkout…" : checkoutLabel}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11.5px] text-ink-3">
            {product.shortName} · {variant.widthIn ? variant.label : "High-res file"}
            {physical ? " · digital file included" : ""} · Love-it guarantee
          </p>
        </div>
      )}
    </section>
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
        "relative flex min-h-[4.25rem] flex-col items-center justify-center rounded-xl px-1 pt-2.5 pb-2 text-center transition",
        selected ? "bg-ink text-paper shadow-soft" : "bg-white text-ink ring-1 ring-line hover:ring-ink/40",
      )}
    >
      {product.badge && (
        <span
          className={cn(
            "absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider whitespace-nowrap uppercase sm:text-[9.5px]",
            selected ? "bg-butter text-ink" : "bg-clay-soft text-clay-dark",
          )}
        >
          {product.badge}
        </span>
      )}
      <span className="text-[14px] font-semibold sm:text-[15px]">{product.shortName}</span>
      <span className={cn("text-[12px] tabular-nums", selected ? "text-paper/70" : "text-ink-3")}>
        {product.variants.length > 1 ? `from ${formatPrice(from)}` : formatPrice(from)}
      </span>
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
      <label htmlFor={id} className="text-[13px] font-medium text-ink">
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
        className="mt-1.5 h-12 w-full rounded-xl bg-paper px-4 text-[16px] ring-1 ring-line outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-ink"
      />
    </div>
  );
}

function SummaryRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-2">{label}</dt>
      <dd className={cn("shrink-0 tabular-nums", muted ? "font-medium text-moss" : "text-ink")}>{value}</dd>
    </div>
  );
}

function TrustRow() {
  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-2">
      <li className="flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" aria-hidden />
        Secure checkout by Stripe
      </li>
      <li>Apple Pay · Google Pay · cards</li>
      <li className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
        Love-it guarantee
      </li>
    </ul>
  );
}
