/**
 * How the offer is worded and priced, in one place: the call to action, the guarantee policy, what
 * an order includes, the one dated bundle, discounts and holiday deadlines.
 *
 * Tone: plain. Point people at uploading a photo of their dog and let the preview speak for itself.
 * No "free" hype, no reassurance lines, no stacked claims. Every value, cap and deadline is real.
 * Client-safe (no env/server imports).
 */
import { PRODUCT_MAP, type ProductType } from "@/lib/catalog";

export const OFFER = {
  /** Primary call to action, used site-wide. */
  cta: "Upload a photo",
  ctaShort: "Start",
  /** One line that says what we make. */
  promise: "Your dog, as a piece of art for your home.",
  /** Real market anchor (from docs/research/competitors.md). */
  anchor: "Hand-painted pet commissions typically cost $150–$500 and take weeks.",
} as const;

export const GUARANTEE = {
  name: "The Love-It Guarantee",
  short: "Love it, or it's free",
  body: "If you don't love your piece, tell us within 30 days of delivery. We'll remake it in any style or refund you in full. No forms, no hoops.",
  /** Recipient's Choice: the guarantee extends to the person who receives a gift (handled by client services). */
  recipientName: "Recipient's Choice",
  recipient: "The person you give it to can ask for a different style within 30 days of delivery, remade free.",
} as const;

const digitalPrice = PRODUCT_MAP.digital.variants[0].price;

/** What every physical order includes besides the piece itself. */
export const VALUE_STACK: { item: string; value: string }[] = [
  { item: `Hi-res digital file (sold alone for $${digitalPrice / 100})`, value: "Included" },
  { item: "US shipping, tracked", value: "Included" },
];

/**
 * The same list for one specific order, so every row is literally true for what's in the bag:
 * Canada shipping is a paid line, and a digital-only order has no print to check or ship.
 */
export function valueStackFor({
  productType,
  shipCountry,
}: {
  productType: ProductType;
  shipCountry: "US" | "CA";
}): { item: string; value: string }[] {
  if (productType === "digital") return [];
  const rows = [
    { item: `Hi-res digital file (sold alone for $${digitalPrice / 100})`, value: "Included" },
    ];
  if (shipCountry === "US") rows.push({ item: "US shipping, tracked", value: "Included" });
  return rows;
}

/** Product types that count as a physical piece (a portrait on the wall, not an add-on or the file). */
export const PHYSICAL_TYPES: readonly ProductType[] = ["canvas", "framed", "poster"];

/**
 * "Buy two portraits, get two matching ornaments free": a dated holiday offer. An order with two or
 * more physical pieces (canvas, framed or print, any mix; quantity counts) gets up to two matching
 * ornaments at $0. List prices never change, ornaments are never added for the customer, and outside
 * the window the offer is invisible everywhere. Checked server-side by /api/checkout (applyBundles).
 */
export const GIFT_TWO = {
  name: "Two portraits, two ornaments",
  /** Sun Nov 1 2026, 00:00 PT (still PDT at midnight; DST ends at 2am). */
  startsAtIso: "2026-11-01T00:00:00-07:00",
  /** Thu Dec 10 2026, 23:59:59 PT (PST), the same day as the US Christmas cutoff. */
  endsAtIso: "2026-12-10T23:59:59-08:00",
  endsLabel: "Dec 10",
  minPieces: 2,
  freeOrnaments: 2,
  ornamentId: "addon-ornament",
  /** Shown in the product step when the customer could use the offer but hasn't. */
  prompt: "Two portraits? Two matching ornaments are on us through Dec 10.",
  /** Shown once the ornaments are in the order. */
  applied: "Two matching ornaments, on us",
  /** Top line. */
  short: "Two portraits, two ornaments on us, through Dec 10",
} as const;

/** True from Nov 1 00:00 PT to Dec 10 23:59:59 PT. Pass `now` to test. */
export function giftTwoActive(now: number = Date.now()): boolean {
  return now >= Date.parse(GIFT_TWO.startsAtIso) && now <= Date.parse(GIFT_TWO.endsAtIso);
}

/** Ornaments that are free under GIFT_TWO: up to two, with two or more physical pieces, in the window. */
export function giftTwoFreeOrnaments(physicalPieces: number, ornaments: number, now: number = Date.now()): number {
  if (!giftTwoActive(now) || physicalPieces < GIFT_TWO.minPieces) return 0;
  return Math.max(0, Math.min(GIFT_TWO.freeOrnaments, ornaments));
}

/** "heirloom" is a retired bundle (ornament + mug together, $10 off): never applied now, but stored order lines can carry it. */
export type BundleTag = "heirloom" | "gift-two";

/** The fields bundle pricing reads and writes on an order line (OrderItem satisfies it). */
export type BundleLine = {
  kind: "product" | "addon";
  productType: ProductType | "addon";
  variantId: string;
  quantity: number;
  /** Cents charged per unit. */
  unitAmount: number;
  included?: boolean;
  /** Catalog price per unit before a bundle (set with `bundle`). */
  regularUnitAmount?: number;
  bundle?: BundleTag;
};

/** Number of physical pieces in an order (quantity counts). */
export function physicalPieceCount(lines: Pick<BundleLine, "kind" | "productType" | "quantity">[]): number {
  return lines
    .filter((l) => l.kind === "product" && (PHYSICAL_TYPES as readonly string[]).includes(l.productType))
    .reduce((n, l) => n + l.quantity, 0);
}

/** Give `units` units of an add-on (not already in a bundle) a bundle price, splitting a line if needed. */
function bundleUnits<T extends BundleLine>(lines: T[], variantId: string, units: number, priced: (line: T) => Partial<BundleLine>): T[] {
  let left = units;
  const out: T[] = [];
  for (const line of lines) {
    const take = left > 0 && line.kind === "addon" && !line.bundle && line.variantId === variantId ? Math.min(line.quantity, left) : 0;
    if (take === 0) {
      out.push(line);
      continue;
    }
    left -= take;
    out.push({ ...line, quantity: take, ...priced(line) });
    if (line.quantity > take) out.push({ ...line, quantity: line.quantity - take });
  }
  return out;
}

/**
 * Prices an order's lines exactly as /api/checkout charges them (the product step runs the same
 * function, so the price shown is the price charged). Catalog unit prices in, bundle prices out; a
 * line only partly in the bundle is split so every stored unit price is exact.
 *
 * The one bundle is GIFT_TWO: up to two ornaments at $0 with two or more physical pieces (in the
 * window). Everything else is charged at its catalog price.
 *
 * The one automatic discount (a creator's percent off or a friend's $15) is applied by Stripe
 * afterwards to the paid merchandise only: $0 ornaments are not charged, so a percent off never
 * touches them and they never count toward a minimum order.
 */
export function applyBundles<T extends BundleLine>(
  lines: T[],
  opts: {
    /** Clock for the GIFT_TWO window (tests inject it). Defaults to now. */
    now?: number;
    /** Whether GIFT_TWO is live, when the caller already knows (the product step uses the server's answer). */
    giftTwo?: boolean;
  } = {},
): { lines: T[]; physicalPieces: number; freeOrnaments: number } {
  const pieces = physicalPieceCount(lines);
  const live = opts.giftTwo ?? giftTwoActive(opts.now ?? Date.now());
  const ornaments = lines
    .filter((l) => l.kind === "addon" && !l.bundle && l.variantId === GIFT_TWO.ornamentId)
    .reduce((n, l) => n + l.quantity, 0);
  const free = live && pieces >= GIFT_TWO.minPieces ? Math.min(GIFT_TWO.freeOrnaments, ornaments) : 0;
  const out = bundleUnits(lines, GIFT_TWO.ornamentId, free, (l) => ({ unitAmount: 0, regularUnitAmount: l.unitAmount, bundle: "gift-two" }));
  return { lines: out, physicalPieces: pieces, freeOrnaments: free };
}

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
 * An automatic discount this visitor qualifies for: a creator's code or a friend's referral code.
 * Stripe applies one per order, so checkout picks the one that saves the customer the most
 * (pickCheckoutDiscount). There is no site-wide sale: with neither code, nothing is applied.
 */
export type DiscountOption =
  | { source: "partner"; code: string; percentOff: number }
  | { source: "referral"; code: string; amountOffCents: number; minimumCents: number };

/** Cents an option takes off a merchandise subtotal (0 when the order is below its minimum). */
export function discountSaving(option: DiscountOption, merchandiseCents: number): number {
  const merch = Math.max(0, Math.round(merchandiseCents));
  if (option.source === "referral") return merch >= option.minimumCents ? Math.min(option.amountOffCents, merch) : 0;
  return percentOffCents(merch, option.percentOff);
}

/** Ties go to the creator's code, then to the friend's. */
const TIE_ORDER: Record<DiscountOption["source"], number> = { partner: 0, referral: 1 };

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

/** Customer-facing name of an applied discount, e.g. "Creator code RUFUS15, 15% off". */
export function discountLabel(option: DiscountOption): string {
  if (option.source === "partner") return `Creator code ${option.code}, ${option.percentOff}% off`;
  return `Referral code ${option.code}, $${option.amountOffCents / 100} off`;
}

/** GET /api/offer response. */
export type OfferStatus = {
  /**
   * Every automatic discount this visitor qualifies for (their creator code or a friend's referral
   * code; usually none). Checkout applies pickCheckoutDiscount(discounts, merchandise).
   */
  discounts: DiscountOption[];
  /** GIFT_TWO is live on the server's clock right now (checkout decides with the same clock). */
  giftTwo: boolean;
  /** Present when a code was checked (?code=): whether it is a live creator or referral code. */
  code?: { code: string; valid: boolean; kind?: "creator" | "customer"; reason?: "own_code" };
};

/** Real holiday deadlines (US standard delivery guidance, not a guarantee). */
export const HOLIDAY = {
  cutoffIso: "2026-12-10T23:59:59-08:00",
  /** The cutoff line is shown from Nov 1 (before that it is not yet urgent, so nothing is shown). */
  showFromIso: "2026-11-01T00:00:00-07:00",
  /** Christmas Day, end of day PT: after this the reveal line is no longer relevant. */
  revealUntilIso: "2026-12-25T23:59:59-08:00",
  label: "Order by Dec 10 for Christmas delivery in the US",
  /** No longer shown in the create flow; kept only until the marketing pages that print it are rewritten. */
  reveal: "Gift Reveal can be sent instantly, right up to Christmas Day",
} as const;

/**
 * The real holiday line for right now, or null: from Nov 1 to the cutoff, the US delivery cutoff
 * (physical pieces shipping to the US only). Otherwise nothing.
 */
export function holidayNotice(now: number, opts: { physical: boolean; shipCountry: "US" | "CA" }): string | null {
  if (now < Date.parse(HOLIDAY.showFromIso) || now > Date.parse(HOLIDAY.cutoffIso)) return null;
  return opts.physical && opts.shipCountry === "US" ? HOLIDAY.label : null;
}

/**
 * One portrait used to show every format, so customers compare formats, not pictures: the
 * Modern golden retriever (the "after" of before/after pair 1, and the campaign hero portrait).
 */
export const FORMAT_SHOWCASE = {
  src: "/samples/pair-1-after.webp",
  alt: "The same portrait shown as a canvas, framed print, fine art print and digital file",
} as const;
