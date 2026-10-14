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
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";
import { PRODUCT_MAP, findAddon, type ProductType } from "@/lib/catalog";

export const OFFER = {
  /** Primary call to action, used site-wide. Clarity beats cleverness. */
  cta: "Create your free portrait",
  ctaShort: "Start free",
  /** Effort-reduction line shown under primary CTAs. */
  effort: "No account. No card. About a minute.",
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
  { item: "Free US shipping, tracked", value: "Included" },
  { item: GUARANTEE.name, value: "Included" },
];

/**
 * The value stack for one specific order, so every row is literally true for what's in the bag:
 * prints ship flat (not "ready to hang"), Canada shipping is a paid line (not "free"), and a
 * digital-only order has no print to check or ship.
 */
export function valueStackFor({
  productType,
  shipCountry,
}: {
  productType: ProductType;
  shipCountry: "US" | "CA";
}): { item: string; value: string }[] {
  const physical = productType !== "digital";
  const rows: { item: string; value: string }[] = [
    { item: "Your portrait, previewed before you pay", value: "Free" },
    { item: "Try every style, redo as often as you like", value: "Free" },
  ];
  if (physical) rows.push({ item: `Hi-res digital file (sold alone for $${digitalPrice / 100})`, value: "Included" });
  rows.push({ item: "Instant Gift Reveal to send the same day", value: "Included" });
  if (physical) {
    rows.push({ item: "Checked by a person before it's printed", value: "Included" });
    if (shipCountry === "US") {
      rows.push({
        item: productType === "poster" ? "Free US shipping, tracked" : "Free US shipping, arrives ready to hang",
        value: "Included",
      });
    }
  }
  rows.push({ item: GUARANTEE.name, value: "Included" });
  return rows;
}

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
  /**
   * How the saving is split across the two add-ons (cents off each unit in a set), so the
   * server can charge real, round per-item prices ($19 → $14, $25 → $20). Sums to discountCents.
   */
  unitDiscount: { "addon-ornament": 500, "addon-mug": 500 } as Record<string, number>,
  line: "Add the matching ornament and mug together and save $10.",
  addonsTotal: (ornament?.price ?? 0) + (mug?.price ?? 0),
} as const;

/**
 * Number of complete Heirloom Sets in an order: one ornament + one mug each, and only alongside
 * a physical piece. Each set takes HEIRLOOM_SET.discountCents off (applied by /api/checkout).
 */
export function heirloomSets(lines: { variantId: string; quantity: number }[], hasPhysical: boolean): number {
  if (!hasPhysical) return 0;
  const qty = (id: string) => lines.filter((l) => l.variantId === id).reduce((n, l) => n + l.quantity, 0);
  return Math.min(...HEIRLOOM_SET.addonIds.map(qty));
}

/** Founding 100 launch offer: real cap (100 orders) and real deadline, auto-applied while open. */
export const FOUNDING_OFFER = {
  ...FOUNDING,
  autoApply: true,
  headline: `Founding offer: ${FOUNDING.percentOff}% off`,
  line: `${FOUNDING.percentOff}% off for our first ${FOUNDING.maxRedemptions} orders, through ${FOUNDING.deadlineLabel}. Applied automatically.`,
  /** The one-line label at the purchase moment. */
  label: `Founding offer — ${FOUNDING.percentOff}% off for our first ${FOUNDING.maxRedemptions} orders, through ${FOUNDING.deadlineLabel}`,
} as const;

/** Cents off for a percent-off discount (Stripe rounds percent-off to the nearest cent). */
export function percentOffCents(cents: number, percentOff: number): number {
  return Math.round((cents * percentOff) / 100);
}

/**
 * "Give $15, get $15": the customer referral program. Every paying customer gets a personal code
 * (e.g. BISCUIT-7K2). A friend takes $15 off a first order of $59+; the referrer gets a single-use
 * $15 code once the friend's order is past its 30-day guarantee window. Real terms: /terms#referrals.
 */
export const REFERRAL = {
  /** Friend's saving on a first order (merchandise subtotal, never shipping). */
  friendCents: 1500,
  /** Minimum merchandise subtotal for the friend's saving (protects poster margin). */
  minimumCents: 5900,
  /** The referrer's thank-you, issued as a single-use promotion code. */
  rewardCents: 1500,
  /** Days after the friend's delivery before the reward is issued (the guarantee window). */
  holdDays: 30,
  /** Rewards per referrer per rolling year ($60). */
  maxRewardsPerYear: 4,
  /** Days a reward code stays valid. */
  rewardValidDays: 365,
  /** Shared Stripe coupons: the friend's $15 (on every customer code) and the referrer's $15. */
  couponId: "PP_REFER_15",
  rewardCouponId: "PP_REFER_THANKS_15",
  headline: "Give $15, get $15",
  /** Appended to every share text: the referrer earns something, so the share says so (FTC). */
  disclosure: "(we both get $15)",
} as const;

/** Short terms line used on the success page, the reveal and in emails. */
export const REFERRAL_TERMS = `$15 off a first order of $${REFERRAL.minimumCents / 100} or more. Your $15 arrives as a single-use code once their order is past its ${REFERRAL.holdDays}-day guarantee window. Up to $${(REFERRAL.rewardCents * REFERRAL.maxRewardsPerYear) / 100} a year; not for your own orders.`;

/**
 * An automatic discount this visitor qualifies for. Stripe applies one per order, so checkout
 * picks the one that saves the customer the most (pickCheckoutDiscount).
 */
export type DiscountOption =
  | { source: "founding"; code: string; percentOff: number }
  | { source: "partner"; code: string; percentOff: number }
  | { source: "referral"; code: string; amountOffCents: number; minimumCents: number };

/** Cents an option takes off a merchandise subtotal (0 when the order is below its minimum). */
export function discountSaving(option: DiscountOption, merchandiseCents: number): number {
  const merch = Math.max(0, Math.round(merchandiseCents));
  if (option.source === "referral") return merch >= option.minimumCents ? Math.min(option.amountOffCents, merch) : 0;
  return percentOffCents(merch, option.percentOff);
}

/** Ties go to a code (it credits a creator or a friend), then to the founding offer. */
const TIE_ORDER: Record<DiscountOption["source"], number> = { partner: 0, referral: 1, founding: 2 };

/**
 * Which automatic discount checkout applies to an order: whichever saves the customer more on this
 * merchandise subtotal. A creator or friend whose code was used is still credited when another
 * discount wins (the order keeps its referral code); this only decides the price.
 */
export function pickCheckoutDiscount(options: DiscountOption[], merchandiseCents: number): DiscountOption | null {
  let best: DiscountOption | null = null;
  let bestSaving = 0;
  for (const option of options) {
    const saving = discountSaving(option, merchandiseCents);
    if (saving <= 0) continue;
    if (!best || saving > bestSaving || (saving === bestSaving && TIE_ORDER[option.source] < TIE_ORDER[best.source])) {
      best = option;
      bestSaving = saving;
    }
  }
  return best;
}

/** Customer-facing name of an applied discount, e.g. "Founding offer, 15% off". */
export function discountLabel(option: DiscountOption): string {
  if (option.source === "founding") return `Founding offer, ${option.percentOff}% off`;
  if (option.source === "partner") return `Creator code ${option.code}, ${option.percentOff}% off`;
  return `Referral code ${option.code}, $${option.amountOffCents / 100} off`;
}

/** GET /api/offer response. Every number is real: `remaining` is null unless it comes from Stripe. */
export type OfferStatus = {
  founding: {
    open: boolean;
    /** Redemptions left out of maxRedemptions, from Stripe. null when unknown (never guessed). */
    remaining: number | null;
    percentOff: number;
    maxRedemptions: number;
    /** ISO timestamp of the hard deadline. */
    deadline: string;
    deadlineLabel: string;
  };
  /**
   * Every automatic discount this visitor qualifies for (FOUNDING100, their creator code, a
   * friend's referral code). Checkout applies pickCheckoutDiscount(discounts, merchandise).
   */
  discounts: DiscountOption[];
  /** Present when a code was checked (?code=): whether it is a live creator or referral code. */
  code?: { code: string; valid: boolean; kind?: "creator" | "customer"; reason?: "own_code" };
};

/** Static fallback (no Stripe, or before /api/offer answers): deadline only, never a count. */
export function staticFoundingStatus(now: number = Date.now()): OfferStatus["founding"] {
  return {
    open: foundingOfferOpen(now),
    remaining: null,
    percentOff: FOUNDING.percentOff,
    maxRedemptions: FOUNDING.maxRedemptions,
    deadline: FOUNDING.expiresAt.toISOString(),
    deadlineLabel: FOUNDING.deadlineLabel,
  };
}

/** Real holiday deadlines (US standard delivery guidance, not a guarantee). */
export const HOLIDAY = {
  cutoffIso: "2026-12-10T23:59:59-08:00",
  /** The cutoff line is shown from Nov 1 (before that it is not yet urgent, so nothing is shown). */
  showFromIso: "2026-11-01T00:00:00-07:00",
  /** Christmas Day, end of day PT: after this the reveal line is no longer relevant. */
  revealUntilIso: "2026-12-25T23:59:59-08:00",
  label: "Order by Dec 10 for Christmas delivery in the US",
  reveal: "Gift Reveal can be sent instantly, right up to Christmas Day",
} as const;

/**
 * The real holiday line for right now, or null. From Nov 1 to the cutoff: the US delivery cutoff
 * (physical pieces shipping to the US only). After the cutoff until Christmas: the instant Gift
 * Reveal, which is true for every order. Otherwise nothing.
 */
export function holidayNotice(now: number, opts: { physical: boolean; shipCountry: "US" | "CA" }): string | null {
  const from = Date.parse(HOLIDAY.showFromIso);
  const cutoff = Date.parse(HOLIDAY.cutoffIso);
  const until = Date.parse(HOLIDAY.revealUntilIso);
  if (now < from || now > until) return null;
  if (now <= cutoff) return opts.physical && opts.shipCountry === "US" ? HOLIDAY.label : null;
  return HOLIDAY.reveal;
}

/** One portrait used to show every format, so customers compare formats, not pictures. */
export const FORMAT_SHOWCASE = {
  src: "/samples/royal.webp",
  alt: "The same portrait shown as a canvas, framed print, fine art print and digital file",
} as const;
