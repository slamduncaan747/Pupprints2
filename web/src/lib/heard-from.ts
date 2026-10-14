/**
 * "How did you hear about us?": the one optional question on the order success page. Stored on
 * orders.heard_from (+ heard_from_detail for "Other"), summarized on /admin/scorecard.
 * The ids match the check constraint in supabase/migrations/0007_offer_round2.sql. Client-safe.
 */
export const HEARD_FROM = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "google", label: "Google search" },
  { id: "pet_business", label: "A groomer, daycare or pet business" },
  { id: "creator", label: "A creator or influencer" },
  { id: "friend", label: "A friend or family member" },
  { id: "gift_reveal", label: "A Gift Reveal I received" },
  { id: "pinterest", label: "Pinterest" },
  { id: "other", label: "Other" },
] as const;

export type HeardFrom = (typeof HEARD_FROM)[number]["id"];

export const HEARD_FROM_IDS = HEARD_FROM.map((o) => o.id) as [HeardFrom, ...HeardFrom[]];

/** Longest free-text answer for "Other". */
export const HEARD_FROM_DETAIL_MAX = 200;

export function heardFromLabel(id: string | null | undefined): string {
  return HEARD_FROM.find((o) => o.id === id)?.label ?? "No answer";
}
