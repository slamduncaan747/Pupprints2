/**
 * The Grand Slam Offer (Hormozi, "$100M Offers"): single source of truth for how we frame
 * the offer everywhere — value stack, risk reversal, real urgency, bundles and CTAs.
 *
 * Value equation we optimize: (Dream outcome × Perceived likelihood) / (Time delay × Effort).
 *  - Dream outcome: their dog as a museum-worthy portrait on the wall (or a gift that makes someone cry).
 *  - Likelihood: you SEE the exact portrait before paying + the Love-It Guarantee.
 *  - Time delay: preview in about a minute, Gift Reveal instantly, delivered in days.
 *  - Effort: one photo, no account, no card to preview, arrives ready to hang, free shipping.
 *
 * Honesty rules still apply: every value, cap and deadline here is real. No invented
 * "worth $X" figures — items we don't sell separately say "Included", not a made-up price.
 * Client-safe (no env/server imports).
 */
import { FOUNDING } from "@/lib/launch";
import { PRODUCT_MAP, findAddon } from "@/lib/catalog";

export const OFFER = {
  /** Primary call to action, used site-wide. Clarity beats cleverness. */
  cta: "Create your free portrait",
  ctaShort: "Start free",
  /** One-line promise that states the whole offer. */
  promise: "See your dog as a work of art in about a minute — free. Love it, or it's free.",
  /** Real market anchor (from docs/research/competitors.md). */
  anchor: "Hand-painted pet commissions typically cost $150–$500 and take weeks.",
} as const;

export const GUARANTEE = {
  name: "The Love-It Guarantee",
  short: "Love it, or it's free",
  body: "If you don't love your piece, tell us within 30 days of delivery. We'll remake it in any style or refund you in full. No forms, no hoops.",
} as const;

const digitalPrice = PRODUCT_MAP.digital.variants[0].price;

/** What every physical order includes. `value` is a real price or the word "Included"/"Free". */
export const VALUE_STACK: { item: string; value: string }[] = [
  { item: "Your portrait, previewed before you pay", value: "Free" },
  { item: "Try every style, redo as often as you like", value: "Free" },
  { item: `Hi-res digital file (sold alone for $${digitalPrice / 100})`, value: "Included" },
  { item: "Instant Gift Reveal to send the same day", value: "Included" },
  { item: "Checked by a person before it's printed", value: "Included" },
  { item: "Free US shipping, arrives ready to hang", value: "Included" },
  { item: GUARANTEE.name, value: "Included" },
];

/**
 * The Heirloom Set: a physical piece + both matching add-ons, with a real bundle saving
 * applied server-side in checkout (the add-ons are cheaper together).
 */
const ornament = findAddon("addon-ornament");
const mug = findAddon("addon-mug");
export const HEIRLOOM_SET = {
  name: "The Heirloom Set",
  addonIds: ["addon-ornament", "addon-mug"] as const,
  /** Saving when BOTH add-ons are added to an order with a physical piece. */
  discountCents: 1000,
  line: "Add the matching ornament and mug together and save $10.",
  addonsTotal: (ornament?.price ?? 0) + (mug?.price ?? 0),
} as const;

/** Founding 100 launch offer: real cap (100 orders) and real deadline, auto-applied while open. */
export const FOUNDING_OFFER = {
  ...FOUNDING,
  autoApply: true,
  headline: `Founding offer: ${FOUNDING.percentOff}% off`,
  line: `${FOUNDING.percentOff}% off for our first ${FOUNDING.maxRedemptions} orders, through ${FOUNDING.deadlineLabel}. Applied automatically.`,
} as const;

/** Real holiday deadlines (US standard delivery guidance, not a guarantee). */
export const HOLIDAY = {
  cutoffIso: "2026-12-12T23:59:59-08:00",
  label: "Order by Dec 12 for Christmas delivery in the US",
  reveal: "Gift Reveal can be sent instantly, right up to Christmas Day",
} as const;

/** One portrait used to show every format, so customers compare formats, not pictures. */
export const FORMAT_SHOWCASE = {
  src: "/samples/royal.webp",
  alt: "The same portrait shown as a canvas, framed print, fine art print and digital file",
} as const;
