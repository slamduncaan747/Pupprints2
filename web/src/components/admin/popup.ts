import type { StyleSlug } from "@/lib/catalog";

/**
 * Pop-up mode (selling in person): the founder photographs a dog, the owner gets the finished
 * portrait's reveal link by QR, text or email and buys on their own phone. Client-safe helpers.
 */

/** The six strongest house styles, in picker order (royal is the default). */
export const POPUP_STYLES = ["royal", "oil-classic", "watercolor", "charcoal", "botanical", "fine-line"] as const satisfies readonly StyleSlug[];

/** YYYY-MM-DD for a date, in a time zone (default: the device's own). */
export function isoDay(date: Date = new Date(), timeZone?: string): string {
  // en-CA formats as 2026-10-19.
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/**
 * `url` with the pop-up UTMs (utm_source=popup, utm_medium=in_person | card, utm_campaign=<day>),
 * so orders that start from it are attributed in the scorecard (first-touch pp_utm cookie).
 */
export function withPopupUtm(url: string, medium: "in_person" | "card", day: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "popup");
  u.searchParams.set("utm_medium", medium);
  u.searchParams.set("utm_campaign", day);
  return u.toString();
}
