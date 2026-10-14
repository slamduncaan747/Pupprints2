import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAll } from "@/components/admin/queries";
import { GIFT_SESSION, PAID_STATUSES } from "@/components/admin/constants";
import { CHANNELS, COUNTED_CHANNELS, addDays, dayKey, type Channel, type DayEntry } from "@/components/admin/scorecard";

export type DayRow = {
  day: string;
  counts: Partial<Record<Channel, number>>;
  spendCents: number;
  /** Actions that count toward the 100 (follow-ups excluded). */
  actions: number;
  followUps: number;
  previews: number;
  leads: number;
  orders: number;
  /** Orders whose first-touch utm_medium says paid (cpc, paid_social, …). */
  paidOrders: number;
  revenueCents: number;
  giftsSent: number;
  giftsOpened: number;
  applications: number;
};

export type Totals = Omit<DayRow, "day" | "counts"> & { days: number; daysAtTarget: number };

type ActionRow = { day: string; channel: string; count: number; notes: string | null; ad_spend_cents: number };

const PAID_MEDIUM = /^(paid|cpc|ppc|cpm|paid[-_ ]?social|paidsocial|social[-_]?paid|ads?|display|spark|retargeting)$/i;

/** True when the error means migration 0006 hasn't been applied yet. */
export function isMissingTable(error: { code?: string; message?: string } | null | undefined): boolean {
  if (!error) return false;
  return error.code === "42P01" || error.code === "PGRST205" || /daily_actions/.test(error.message ?? "");
}

function emptyRow(day: string): DayRow {
  return {
    day,
    counts: {},
    spendCents: 0,
    actions: 0,
    followUps: 0,
    previews: 0,
    leads: 0,
    orders: 0,
    paidOrders: 0,
    revenueCents: 0,
    giftsSent: 0,
    giftsOpened: 0,
    applications: 0,
  };
}

/**
 * Last `days` days (newest first, admin timezone) of logged actions and the outcomes we can
 * read from existing tables. Customer outcomes exclude admin gift generations.
 */
export async function loadScorecard(c: SupabaseClient, { today = dayKey(), days = 30 }: { today?: string; days?: number } = {}) {
  const firstDay = addDays(today, -(days - 1));
  // One extra day covers the timezone offset; rows are bucketed by their local day below.
  const sinceIso = new Date(Date.parse(`${firstDay}T00:00:00Z`) - 86_400_000).toISOString();

  const [actionsRes, gens, leads, orders, giftsSent, giftsOpened, apps] = await Promise.all([
    c.from("daily_actions").select("day, channel, count, notes, ad_spend_cents").gte("day", firstDay).lte("day", today).limit(5000),
    fetchAll<{ created_at: string }>((f, t) =>
      c
        .from("generations")
        .select("created_at")
        .eq("status", "succeeded")
        .or(`session_id.is.null,session_id.neq.${GIFT_SESSION}`)
        .gte("created_at", sinceIso)
        .range(f, t),
    ),
    fetchAll<{ created_at: string; source: string | null }>((f, t) =>
      c.from("leads").select("created_at, source").gte("created_at", sinceIso).range(f, t),
    ),
    fetchAll<{ created_at: string; status: string; total_cents: number | null; utm: Record<string, string> | null }>((f, t) =>
      c.from("orders").select("created_at, status, total_cents, utm").gte("created_at", sinceIso).range(f, t),
    ),
    fetchAll<{ created_at: string }>((f, t) => c.from("gifts").select("created_at").gte("created_at", sinceIso).range(f, t)),
    fetchAll<{ viewed_at: string }>((f, t) => c.from("gifts").select("viewed_at").gte("viewed_at", sinceIso).range(f, t)),
    fetchAll<{ created_at: string; submitted: string | null; first: string | null }>((f, t) =>
      c
        .from("partners")
        .select("created_at, submitted:application->>submittedAt, first:application->>firstSubmittedAt")
        .not("application", "is", null)
        .range(f, t),
    ),
  ]);

  const byDay = new Map<string, DayRow>();
  for (let i = 0; i < days; i++) {
    const d = addDays(today, -i);
    byDay.set(d, emptyRow(d));
  }
  const bucket = (iso: string | null | undefined) => (iso ? byDay.get(dayKey(iso)) : undefined);

  const tableMissing = isMissingTable(actionsRes.error);
  const actionsError = actionsRes.error && !tableMissing ? actionsRes.error.message : null;
  const counted = new Set<string>(COUNTED_CHANNELS);
  for (const a of (actionsRes.data ?? []) as ActionRow[]) {
    const row = byDay.get(String(a.day).slice(0, 10));
    if (!row) continue;
    const ch = a.channel as Channel;
    row.counts[ch] = (row.counts[ch] ?? 0) + a.count;
    row.spendCents += a.ad_spend_cents ?? 0;
    if (counted.has(ch)) row.actions += a.count;
    else if (ch === "follow_up") row.followUps += a.count;
  }

  for (const g of gens) {
    const r = bucket(g.created_at);
    if (r) r.previews++;
  }
  for (const l of leads) {
    if (l.source === "unsubscribe") continue;
    const r = bucket(l.created_at);
    if (r) r.leads++;
  }
  const paid = PAID_STATUSES as readonly string[];
  for (const o of orders) {
    if (!paid.includes(o.status)) continue;
    const r = bucket(o.created_at);
    if (!r) continue;
    r.orders++;
    r.revenueCents += o.total_cents ?? 0;
    if (PAID_MEDIUM.test(String(o.utm?.utm_medium ?? ""))) r.paidOrders++;
  }
  for (const g of giftsSent) {
    const r = bucket(g.created_at);
    if (r) r.giftsSent++;
  }
  for (const g of giftsOpened) {
    const r = bucket(g.viewed_at);
    if (r) r.giftsOpened++;
  }
  for (const p of apps) {
    const r = bucket(p.first ?? p.submitted ?? p.created_at);
    if (r) r.applications++;
  }

  return { rows: [...byDay.values()], tableMissing, actionsError };
}

/** Sums the newest `n` rows (rows are newest first). */
export function totals(rows: DayRow[], n = rows.length, target = 100): Totals {
  const slice = rows.slice(0, n);
  const sum = (k: keyof Omit<DayRow, "day" | "counts">) => slice.reduce((s, r) => s + r[k], 0);
  return {
    days: slice.length,
    daysAtTarget: slice.filter((r) => r.actions >= target).length,
    spendCents: sum("spendCents"),
    actions: sum("actions"),
    followUps: sum("followUps"),
    previews: sum("previews"),
    leads: sum("leads"),
    orders: sum("orders"),
    paidOrders: sum("paidOrders"),
    revenueCents: sum("revenueCents"),
    giftsSent: sum("giftsSent"),
    giftsOpened: sum("giftsOpened"),
    applications: sum("applications"),
  };
}

/** Today's actions toward the 100 (null when the table is missing or unreadable). Never throws. */
export async function loadTodayActionTotal(c: SupabaseClient): Promise<number | null> {
  try {
    const { data, error } = await c.from("daily_actions").select("channel, count").eq("day", dayKey());
    if (error) return null;
    const counted = new Set<string>(COUNTED_CHANNELS);
    return ((data ?? []) as { channel: string; count: number }[]).reduce((s, a) => s + (counted.has(a.channel) ? a.count : 0), 0);
  } catch {
    return null;
  }
}

/** The logged entries for one day, keyed by channel (for the +1/+5/+10 logger). */
export async function loadDayEntries(
  c: SupabaseClient,
  day: string,
): Promise<{ entries: Partial<Record<Channel, DayEntry>>; tableMissing: boolean; error: string | null }> {
  const { data, error } = await c.from("daily_actions").select("day, channel, count, notes, ad_spend_cents").eq("day", day);
  if (error) return { entries: {}, tableMissing: isMissingTable(error), error: isMissingTable(error) ? null : error.message };
  const entries: Partial<Record<Channel, DayEntry>> = {};
  const known = new Set<string>(CHANNELS.map((ch) => ch.id));
  for (const a of (data ?? []) as ActionRow[]) {
    if (!known.has(a.channel)) continue;
    entries[a.channel as Channel] = { count: a.count, notes: a.notes ?? "", spendCents: a.ad_spend_cents ?? 0 };
  }
  return { entries, tableMissing: false, error: null };
}
