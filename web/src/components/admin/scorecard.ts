/**
 * Rule-of-100 scorecard constants (client-safe). Channels mirror the CHECK constraint in
 * supabase/migrations/0006_daily_actions.sql. Plan: docs/plan-research/hormozi-application.md §B13.
 */
import { ADMIN_TZ } from "@/components/admin/ui";

export const CHANNELS = [
  { id: "creator_dm", label: "Creator DMs", short: "Creator DM", hint: "Gift-first DMs with a reveal link (~20–30 a day on new accounts)", counts: true, paid: false },
  { id: "b2b_email", label: "Partner emails", short: "B2B email", hint: "Groomers, vets, trainers, daycares, shelters, boutiques", counts: true, paid: false },
  { id: "b2b_walkin", label: "Walk-ins", short: "Walk-in", hint: "In-person visits with a counter card", counts: true, paid: false },
  { id: "content_post", label: "Content posts", short: "Content", hint: "Shorts, Reels and TikToks published", counts: true, paid: false },
  { id: "community_post", label: "Community posts", short: "Community", hint: "Groups, forums, breed clubs", counts: true, paid: false },
  { id: "ad_boost", label: "Ad boosts", short: "Ads", hint: "Ads launched or boosted (Spark, partnership codes)", counts: true, paid: true },
  { id: "etsy", label: "Etsy", short: "Etsy", hint: "Listings, renewals, Etsy Ads changes", counts: true, paid: true },
  { id: "other", label: "Other", short: "Other", hint: "Anything else that reaches new people", counts: true, paid: true },
  { id: "follow_up", label: "Follow-ups", short: "Follow-ups", hint: "Day 2 / 4 / 7 follow-ups: extra, not part of the 100", counts: false, paid: false },
] as const;

export type Channel = (typeof CHANNELS)[number]["id"];
export const CHANNEL_IDS = CHANNELS.map((c) => c.id) as [Channel, ...Channel[]];
export const COUNTED_CHANNELS: readonly Channel[] = CHANNELS.filter((c) => c.counts).map((c) => c.id);

export const DAILY_TARGET = 100;
/** "Minimum dose on bad days" (§B13). */
export const MIN_DOSE = 50;
/** The founder's 100-day run, inclusive. */
export const RULE100 = { start: "2026-10-15", end: "2027-01-22", days: 100 } as const;
/** Scale ads to $100/day only once trailing-7-day paid CAC is at or below this (CFA, §B13). */
export const PAID_CAC_TARGET_CENTS = 5400;

export type DayEntry = { count: number; notes: string; spendCents: number };

/** YYYY-MM-DD of an instant in the admin timezone (America/New_York). */
export function dayKey(d: Date | number | string = new Date(), tz = ADMIN_TZ): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(d));
}

export function isDayKey(s: unknown): s is string {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** "Wed Oct 14" (or with the year). */
export function dayLabel(day: string, withYear = false): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(withYear ? { year: "numeric" } : {}),
  }).format(new Date(`${day}T12:00:00Z`));
}

/** 1-based day number of the 100-day run (≤ 0 before it starts, > 100 after it ends). */
export function rule100Day(day: string): number {
  return daysBetween(RULE100.start, day) + 1;
}
