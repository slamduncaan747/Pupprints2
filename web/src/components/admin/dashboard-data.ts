import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAll } from "@/components/admin/queries";
import { GIFT_SESSION, PAID_STATUSES } from "@/components/admin/constants";
import { ADMIN_TZ } from "@/components/admin/ui";

export type RangeKey = "today" | "7d" | "30d";
export const RANGES: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
];

/** Midnight "today" in the admin timezone, as a UTC Date. */
export function startOfToday(tz = ADMIN_TZ, now = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const localAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  const offset = localAsUtc - Math.floor(now.getTime() / 1000) * 1000;
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day")) - offset);
}

export function rangeStart(range: RangeKey, now = new Date()): Date {
  if (range === "today") return startOfToday(ADMIN_TZ, now);
  return new Date(now.getTime() - (range === "7d" ? 7 : 30) * 86_400_000);
}

type GenRow = { created_at: string; session_id: string | null; ip_hash: string | null; status: string };
type UploadRow = { created_at: string; session_id: string | null };
type LeadRow = { created_at: string };
type OrderRow = { created_at: string; status: string; total_cents: number | null };
type RefRow = { created_at: string; code: string; type: string; amount_cents: number | null; commission_cents: number | null };

export type Kpis = {
  previews: number;
  failed: number;
  sessions: number;
  leads: number;
  orders: number;
  revenueCents: number;
  aovCents: number | null;
  conversion: number | null;
  refClicks: number;
  refOrders: number;
};

export type FunnelStep = { label: string; hint: string; value: number };

export type LeaderRow = {
  code: string;
  name: string | null;
  handle: string | null;
  partnerId: string | null;
  clicks: number;
  orders: number;
  revenueCents: number;
  commissionCents: number;
};

function inRange<T extends { created_at: string }>(rows: T[], since: Date) {
  const t = since.getTime();
  return rows.filter((r) => new Date(r.created_at).getTime() >= t);
}

function visitorKey(g: { session_id: string | null; ip_hash?: string | null }) {
  return g.session_id ?? (g.ip_hash ? `ip:${g.ip_hash}` : null);
}

export async function loadDashboard(c: SupabaseClient, range: RangeKey) {
  const now = new Date();
  const since30 = new Date(now.getTime() - 30 * 86_400_000).toISOString();

  const [gens, uploads, leads, orders, refs, recentOrders, recentGens, partners] = await Promise.all([
    fetchAll<GenRow>((f, t) =>
      c.from("generations").select("created_at, session_id, ip_hash, status").gte("created_at", since30).range(f, t),
    ),
    fetchAll<UploadRow>((f, t) => c.from("uploads").select("created_at, session_id").gte("created_at", since30).range(f, t)),
    fetchAll<LeadRow>((f, t) => c.from("leads").select("created_at").gte("created_at", since30).range(f, t)),
    fetchAll<OrderRow>((f, t) =>
      c.from("orders").select("created_at, status, total_cents").gte("created_at", since30).range(f, t),
    ),
    fetchAll<RefRow>(
      (f, t) =>
        c
          .from("referral_events")
          .select("created_at, code, type, amount_cents, commission_cents")
          .gte("created_at", since30)
          .range(f, t),
      50_000,
    ),
    c
      .from("orders")
      .select("id, order_number, created_at, status, customer_name, email, total_cents, currency, referral_code")
      .order("created_at", { ascending: false })
      .limit(8),
    c
      .from("generations")
      .select("id, created_at, style, preview_path, status, pet_name")
      .eq("status", "succeeded")
      .not("preview_path", "is", null)
      .or(`session_id.is.null,session_id.neq.${GIFT_SESSION}`)
      .order("created_at", { ascending: false })
      .limit(12),
    c.from("partners").select("id, name, handle, code").not("code", "is", null).limit(1000),
  ]);

  const since = rangeStart(range, now);
  // Gift portraits made in the admin aren't customer activity.
  const g = inRange(gens, since).filter((x) => x.session_id !== GIFT_SESSION);
  const paid = inRange(orders, since).filter((o) => (PAID_STATUSES as readonly string[]).includes(o.status));
  const succeeded = g.filter((x) => x.status === "succeeded");
  const sessions = new Set(g.map(visitorKey).filter(Boolean)).size;
  const revenueCents = paid.reduce((s, o) => s + (o.total_cents ?? 0), 0);

  const kpis: Kpis = {
    previews: succeeded.length,
    failed: g.filter((x) => x.status === "failed").length,
    sessions,
    leads: inRange(leads, since).length,
    orders: paid.length,
    revenueCents,
    aovCents: paid.length ? Math.round(revenueCents / paid.length) : null,
    conversion: sessions ? paid.length / sessions : null,
    refClicks: 0,
    refOrders: 0,
  };

  // Funnel over the selected range: people, not events.
  const uploadSessions = new Set(
    inRange(uploads, since)
      .map((u) => u.session_id)
      .filter((sid) => sid && sid !== GIFT_SESSION),
  );
  const previewSessions = new Set(succeeded.map(visitorKey).filter(Boolean));
  const funnel: FunnelStep[] = [
    { label: "Uploaded a photo", hint: "unique sessions", value: Math.max(uploadSessions.size, previewSessions.size) },
    { label: "Saw a preview", hint: "unique sessions", value: previewSessions.size },
    { label: "Left an email", hint: "new leads", value: kpis.leads },
    { label: "Ordered", hint: "paid orders", value: kpis.orders },
  ];

  // Partner leaderboard (selected range).
  const byCode = new Map<string, LeaderRow>();
  const partnerByCode = new Map(
    ((partners.data ?? []) as { id: string; name: string | null; handle: string | null; code: string }[]).map((p) => [
      p.code.toUpperCase(),
      p,
    ]),
  );
  for (const e of inRange(refs, since)) {
    const code = e.code.toUpperCase();
    const p = partnerByCode.get(code);
    const row =
      byCode.get(code) ??
      ({
        code,
        name: p?.name ?? null,
        handle: p?.handle ?? null,
        partnerId: p?.id ?? null,
        clicks: 0,
        orders: 0,
        revenueCents: 0,
        commissionCents: 0,
      } satisfies LeaderRow);
    if (e.type === "click") {
      row.clicks++;
      kpis.refClicks++;
    } else {
      kpis.refOrders++;
      row.orders++;
      row.revenueCents += e.amount_cents ?? 0;
      row.commissionCents += e.commission_cents ?? 0;
    }
    byCode.set(code, row);
  }
  const leaderboard = [...byCode.values()]
    .sort((a, b) => b.revenueCents - a.revenueCents || b.orders - a.orders || b.clicks - a.clicks)
    .slice(0, 10);

  return {
    kpis,
    funnel,
    leaderboard,
    recentOrders: (recentOrders.data ?? []) as {
      id: string;
      order_number: string;
      created_at: string;
      status: string;
      customer_name: string | null;
      email: string | null;
      total_cents: number | null;
      currency: string;
      referral_code: string | null;
    }[],
    recentGens: (recentGens.data ?? []) as {
      id: string;
      created_at: string;
      style: string;
      preview_path: string;
      status: string;
      pet_name: string | null;
    }[],
  };
}
