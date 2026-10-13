/**
 * Founding 100 launch offer. Client-safe constants (no Stripe/env access), shared by checkout,
 * emails, the reveal page and the admin gift DM so the code, cap and deadline never drift.
 * Honest by design: a real cap and a real deadline, never extended or restarted.
 */
export const FOUNDING = {
  code: "FOUNDING100",
  couponId: "PP_FOUNDING_15",
  percentOff: 15,
  maxRedemptions: 100,
  /** Sat Oct 31 2026, 11:59:59pm Pacific (PDT = UTC-7). */
  expiresAt: new Date("2026-11-01T06:59:59Z"),
  /** Short deadline for copy, e.g. "15% off through Oct 31". */
  deadlineLabel: "Oct 31",
  /** Long deadline for copy. */
  deadlineLong: "Oct 31 at 11:59pm PT",
} as const;

/** True until the deadline passes. (The 100-redemption cap is checked against Stripe where it matters.) */
export function foundingOfferOpen(now: number = Date.now()): boolean {
  return now < FOUNDING.expiresAt.getTime();
}
