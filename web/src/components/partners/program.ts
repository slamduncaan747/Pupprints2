/**
 * Creator / affiliate program constants shared by the public partner pages, the admin CRM
 * (client components) and `@/lib/partners` (server). Safe to import anywhere.
 *
 * Defaults mirror the `partners` table defaults (commission_rate 0.15, discount_percent 15).
 */

export const PROGRAM = {
  commissionRate: 0.15,
  discountPercent: 15,
  /** Matches the first-touch `pp_ref` cookie written by `components/site/tracking.tsx`. */
  attributionDays: 30,
} as const;

export const PARTNER_STATUSES = [
  "prospect",
  "applied",
  "contacted",
  "replied",
  "negotiating",
  "gifted",
  "active",
  "paused",
  "declined",
] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

/** Statuses whose discount code is redeemable at checkout. */
export const REDEEMABLE_STATUSES: readonly PartnerStatus[] = ["active", "gifted"];

/** Statuses whose `?ref=` link clicks are recorded. */
export const TRACKABLE_STATUSES: readonly PartnerStatus[] = [
  "active",
  "gifted",
  "negotiating",
  "contacted",
  "replied",
  "applied",
];

export const PARTNER_TIERS = ["nano", "micro", "mid", "macro", "mega"] as const;
export type PartnerTier = (typeof PARTNER_TIERS)[number];

export const PLATFORMS = ["instagram", "tiktok", "youtube", "pinterest", "facebook", "blog", "other"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  pinterest: "Pinterest",
  facebook: "Facebook",
  blog: "Blog",
  other: "Other",
};

/** nano <10k, micro <100k, mid <500k, macro <1M, mega ≥1M. */
export function tierForFollowers(followers: number | null | undefined): PartnerTier | null {
  if (followers == null || !Number.isFinite(followers) || followers < 0) return null;
  if (followers < 10_000) return "nano";
  if (followers < 100_000) return "micro";
  if (followers < 500_000) return "mid";
  if (followers < 1_000_000) return "macro";
  return "mega";
}

/** Strip "@", whitespace and URL noise from a handle the user typed or pasted. */
export function cleanHandle(input: string): string {
  let h = input.trim();
  if (/^https?:\/\//i.test(h) || /^(www\.)?[a-z0-9-]+\.(com|net|org)\//i.test(h)) {
    try {
      const url = new URL(/^https?:\/\//i.test(h) ? h : `https://${h}`);
      const parts = url.pathname.split("/").filter(Boolean);
      // youtube.com/c/name, youtube.com/channel/id, youtube.com/@name
      h = parts.length > 1 && ["c", "channel", "user"].includes(parts[0]) ? parts[1] : (parts[0] ?? "");
    } catch {
      // fall through with the raw string
    }
  }
  return h.replace(/^@+/, "").replace(/\s+/g, "").slice(0, 80);
}

export function profileUrlFor(platform: string, handle: string): string | null {
  const h = encodeURIComponent(cleanHandle(handle));
  if (!h) return null;
  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/${h}`;
    case "tiktok":
      return `https://www.tiktok.com/@${h}`;
    case "youtube":
      return `https://www.youtube.com/@${h}`;
    case "pinterest":
      return `https://www.pinterest.com/${h}`;
    case "facebook":
      return `https://www.facebook.com/${h}`;
    default:
      return null;
  }
}

/** Partner codes are stored uppercase, letters/digits/hyphen only. */
export const PARTNER_CODE_RE = /^[A-Z0-9][A-Z0-9-]{1,31}$/;

export function normalizeCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return PARTNER_CODE_RE.test(c) ? c : null;
}

/** Escape a value for a PostgREST (i)like pattern so it matches literally (case-insensitive equality). */
export function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (m) => `\\${m}`);
}
