import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Search, Upload } from "lucide-react";
import { db } from "@/lib/supabase/server";
import type { PartnerRow } from "@/lib/partners";
import { fetchAll } from "@/components/admin/queries";
import { AutoSubmitSelect, PartnerStatusSelect } from "@/components/admin/partner-controls";
import { PARTNER_STATUSES, PARTNER_TIERS, PLATFORMS, PLATFORM_LABELS } from "@/components/partners/program";
import { labelize } from "@/components/admin/constants";
import {
  Card,
  DbMissing,
  EmptyState,
  ErrorNote,
  FilterTabs,
  PageHeader,
  Table,
  Td,
  Th,
  adminButton,
  fmtDate,
  fmtMoney,
  fmtNum,
  inputClass,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partners", robots: { index: false, follow: false } };

type Agg = { clicks: number; orders: number; revenueCents: number };

function one(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function PartnersPage({ searchParams }: PageProps<"/admin/partners">) {
  const sp = await searchParams;
  const status = (PARTNER_STATUSES as readonly string[]).includes(one(sp.status)) ? one(sp.status) : "";
  const tier = (PARTNER_TIERS as readonly string[]).includes(one(sp.tier)) ? one(sp.tier) : "";
  const platform = one(sp.platform).toLowerCase().replace(/[^a-z0-9 _-]/g, "").slice(0, 30);
  const q = one(sp.q).trim().slice(0, 80);

  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Partners" />
        <DbMissing />
      </>
    );
  }

  let query = c.from("partners").select("*").order("updated_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  if (tier) query = query.eq("tier", tier);
  if (platform) query = query.eq("platform", platform);
  const term = q.replace(/[^A-Za-z0-9@._+\- ]/g, "").replace(/^@/, "").trim();
  if (term) {
    const like = `*${term}*`;
    query = query.or(`name.ilike.${like},handle.ilike.${like},email.ilike.${like},code.ilike.${like},niche.ilike.${like}`);
  }

  const [{ data, error }, statusRows, events] = await Promise.all([
    query,
    fetchAll<{ status: string }>((f, t) => c.from("partners").select("status").range(f, t), 50_000).catch(() => []),
    fetchAll<{ code: string; type: string; amount_cents: number | null }>(
      (f, t) => c.from("referral_events").select("code, type, amount_cents").range(f, t),
      100_000,
    ).catch(() => []),
  ]);
  const partners = (data ?? []) as PartnerRow[];

  const counts = new Map<string, number>();
  for (const r of statusRows) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  const agg = new Map<string, Agg>();
  for (const e of events) {
    const k = e.code.toUpperCase();
    const a = agg.get(k) ?? { clicks: 0, orders: 0, revenueCents: 0 };
    if (e.type === "click") a.clicks++;
    else {
      a.orders++;
      a.revenueCents += e.amount_cents ?? 0;
    }
    agg.set(k, a);
  }

  const href = (s: string) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (tier) p.set("tier", tier);
    if (platform) p.set("platform", platform);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/admin/partners?${qs}` : "/admin/partners";
  };

  return (
    <>
      <PageHeader
        title="Partners"
        subtitle="Creators, affiliates and outreach pipeline"
        actions={
          <>
            <Link href="/admin/partners/import" className={adminButton("secondary")}>
              <Upload className="h-4 w-4" /> Import CSV
            </Link>
            <Link href="/admin/partners/new" className={adminButton("primary")}>
              <Plus className="h-4 w-4" /> Add partner
            </Link>
          </>
        }
      />

      <FilterTabs
        current={status}
        items={[
          { value: "", label: "All", count: statusRows.length, href: href("") },
          ...PARTNER_STATUSES.map((s) => ({ value: s, label: labelize(s), count: counts.get(s) ?? 0, href: href(s) })),
        ]}
      />

      <form method="get" className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        {status && <input type="hidden" name="status" value={status} />}
        <div className="col-span-2 flex gap-2 sm:w-72">
          <label htmlFor="q" className="sr-only">
            Search partners
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Name, handle, email, code" className={inputClass} />
          <button type="submit" className={adminButton("primary")} aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
        </div>
        <label htmlFor="tier" className="sr-only">
          Tier
        </label>
        <AutoSubmitSelect id="tier" name="tier" defaultValue={tier} className="sm:w-36">
          <option value="">All tiers</option>
          {PARTNER_TIERS.map((t) => (
            <option key={t} value={t}>
              {labelize(t)}
            </option>
          ))}
        </AutoSubmitSelect>
        <label htmlFor="platform" className="sr-only">
          Platform
        </label>
        <AutoSubmitSelect id="platform" name="platform" defaultValue={platform} className="sm:w-40">
          <option value="">All platforms</option>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]}
            </option>
          ))}
        </AutoSubmitSelect>
        {(tier || platform || q) && (
          <Link href={status ? `/admin/partners?status=${status}` : "/admin/partners"} className="text-sm text-ink-3 hover:text-ink">
            Clear filters
          </Link>
        )}
      </form>

      {error && <ErrorNote message={error.message} />}
      <Card>
        {partners.length === 0 ? (
          <EmptyState title={status || tier || platform || q ? "No partners match these filters" : "No partners yet"}>
            Add creators by hand, import a research CSV, or share the <Link href="/partners" className="underline">creator program page</Link>.
          </EmptyState>
        ) : (
          <Table className="[&_table]:min-w-[980px]">
            <thead>
              <tr>
                <Th>Partner</Th>
                <Th>Platform</Th>
                <Th className="text-right">Followers</Th>
                <Th>Status</Th>
                <Th>Code</Th>
                <Th className="text-right">Clicks</Th>
                <Th className="text-right">Orders</Th>
                <Th className="text-right">Revenue</Th>
                <Th>Last contact</Th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => {
                const a = p.code ? agg.get(p.code.toUpperCase()) : undefined;
                return (
                  <tr key={p.id} className="hover:bg-paper/50">
                    <Td className="max-w-[260px]">
                      <Link href={`/admin/partners/${p.id}`} className="block truncate font-medium hover:underline">
                        {p.name || (p.handle ? `@${p.handle}` : p.email) || "Unnamed"}
                      </Link>
                      <div className="truncate text-xs text-ink-3">
                        {p.handle &&
                          (p.profile_url ? (
                            <a href={p.profile_url} target="_blank" rel="noreferrer" className="hover:text-ink hover:underline">
                              @{p.handle}
                            </a>
                          ) : (
                            <>@{p.handle}</>
                          ))}
                        {p.niche && <> · {p.niche}</>}
                        {p.source && <> · {p.source}</>}
                      </div>
                    </Td>
                    <Td className="text-ink-2">{p.platform ? (PLATFORM_LABELS[p.platform as keyof typeof PLATFORM_LABELS] ?? p.platform) : "—"}</Td>
                    <Td className="text-right tabular-nums">
                      {fmtNum(p.followers)}
                      {p.tier && <div className="text-xs text-ink-3">{p.tier}</div>}
                    </Td>
                    <Td>
                      <PartnerStatusSelect id={p.id} status={p.status} />
                    </Td>
                    <Td className="font-mono text-xs">{p.code ?? <span className="text-ink-3">—</span>}</Td>
                    <Td className="text-right tabular-nums">{a ? fmtNum(a.clicks) : "—"}</Td>
                    <Td className="text-right tabular-nums">{a ? fmtNum(a.orders) : "—"}</Td>
                    <Td className="text-right tabular-nums">{a ? fmtMoney(a.revenueCents) : "—"}</Td>
                    <Td className="whitespace-nowrap text-xs text-ink-2">{p.last_contacted_at ? fmtDate(p.last_contacted_at, false) : "Never"}</Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
