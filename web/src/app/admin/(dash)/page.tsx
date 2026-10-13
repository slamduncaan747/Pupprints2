import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db, previewUrl } from "@/lib/supabase/server";
import { getStyle } from "@/lib/catalog";
import { RANGES, loadDashboard, type FunnelStep, type RangeKey } from "@/components/admin/dashboard-data";
import {
  Card,
  DbMissing,
  EmptyState,
  ErrorNote,
  FilterTabs,
  PageHeader,
  StatusPill,
  Table,
  Td,
  Th,
  fmtDate,
  fmtMoney,
  fmtNum,
  fmtPct,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3.5">
      <p className="text-xs font-medium text-ink-3">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-3">{sub}</p>}
    </div>
  );
}

function Funnel({ steps }: { steps: FunnelStep[] }) {
  const top = Math.max(1, steps[0]?.value ?? 0);
  return (
    <ol className="space-y-3 p-4">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1].value : null;
        const pct = s.value / top;
        return (
          <li key={s.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-ink">
                {s.label} <span className="text-xs text-ink-3">· {s.hint}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-semibold">{fmtNum(s.value)}</span>
                {prev != null && (
                  <span className="ml-2 text-xs text-ink-3">{prev > 0 ? fmtPct(s.value / prev) : "—"} of prev</span>
                )}
              </span>
            </div>
            <div className="h-2 rounded-full bg-paper-2" title={`${s.label}: ${s.value}`}>
              <div
                className="h-2 rounded-full bg-ink"
                style={{ width: `${s.value > 0 ? Math.max(2, Math.min(100, pct * 100)) : 0}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default async function AdminDashboard({ searchParams }: PageProps<"/admin">) {
  const sp = await searchParams;
  const range: RangeKey = sp.range === "today" || sp.range === "30d" ? sp.range : "7d";
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <DbMissing />
      </>
    );
  }

  let data: Awaited<ReturnType<typeof loadDashboard>> | null = null;
  let error: string | null = null;
  try {
    data = await loadDashboard(c, range);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load dashboard";
  }
  const rangeLabel = RANGES.find((r) => r.key === range)!.label;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={range === "today" ? "Since midnight Eastern time" : `Last ${rangeLabel.toLowerCase()}`}
      />
      <FilterTabs
        current={range}
        items={RANGES.map((r) => ({ value: r.key, label: r.label, href: r.key === "7d" ? "/admin" : `/admin?range=${r.key}` }))}
      />
      {error && <ErrorNote message={error} />}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Revenue" value={fmtMoney(data.kpis.revenueCents)} sub={`${fmtNum(data.kpis.orders)} paid orders`} />
            <Kpi label="Orders" value={fmtNum(data.kpis.orders)} sub={`AOV ${fmtMoney(data.kpis.aovCents)}`} />
            <Kpi
              label="Preview → order"
              value={fmtPct(data.kpis.conversion)}
              sub={`${fmtNum(data.kpis.orders)} of ${fmtNum(data.kpis.sessions)} sessions`}
            />
            <Kpi label="Leads" value={fmtNum(data.kpis.leads)} sub="new emails captured" />
            <Kpi
              label="Previews generated"
              value={fmtNum(data.kpis.previews)}
              sub={data.kpis.failed ? `${fmtNum(data.kpis.failed)} failed` : "no failures"}
            />
            <Kpi label="Sessions creating" value={fmtNum(data.kpis.sessions)} sub="unique visitors who generated" />
            <Kpi
              label="Previews / session"
              value={data.kpis.sessions ? (data.kpis.previews / data.kpis.sessions).toFixed(1) : "—"}
              sub="styles tried per visitor"
            />
            <Kpi
              label="Partner link clicks"
              value={fmtNum(data.kpis.refClicks)}
              sub={`${fmtNum(data.kpis.refOrders)} attributed orders`}
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Card title={`Funnel · ${rangeLabel.toLowerCase()}`}>
              <Funnel steps={data.funnel} />
            </Card>

            <Card
              title="Recent orders"
              actions={
                <Link href="/admin/orders" className="text-sm text-ink-3 hover:text-ink">
                  All orders →
                </Link>
              }
            >
              {data.recentOrders.length === 0 ? (
                <EmptyState title="No orders yet">Orders appear here as soon as Stripe confirms payment.</EmptyState>
              ) : (
                <Table className="[&_table]:min-w-[520px]">
                  <thead>
                    <tr>
                      <Th>Order</Th>
                      <Th>Customer</Th>
                      <Th className="text-right">Total</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-paper/50">
                        <Td>
                          <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-2 hover:underline">
                            {o.order_number}
                          </Link>
                          <div className="text-xs text-ink-3">{fmtDate(o.created_at)}</div>
                        </Td>
                        <Td className="max-w-[200px] truncate">{o.customer_name || o.email || "—"}</Td>
                        <Td className="text-right tabular-nums">{fmtMoney(o.total_cents, o.currency)}</Td>
                        <Td>
                          <StatusPill status={o.status} />
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card
              title={`Partner leaderboard · ${rangeLabel.toLowerCase()}`}
              actions={
                <Link href="/admin/partners" className="text-sm text-ink-3 hover:text-ink">
                  CRM →
                </Link>
              }
            >
              {data.leaderboard.length === 0 ? (
                <EmptyState title="No referral activity yet">
                  Clicks on partner links (<code>?ref=CODE</code>) and attributed orders show up here.
                </EmptyState>
              ) : (
                <Table className="[&_table]:min-w-[520px]">
                  <thead>
                    <tr>
                      <Th>Partner</Th>
                      <Th className="text-right">Clicks</Th>
                      <Th className="text-right">Orders</Th>
                      <Th className="text-right">Revenue</Th>
                      <Th className="text-right">Commission</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leaderboard.map((r) => (
                      <tr key={r.code}>
                        <Td>
                          {r.partnerId ? (
                            <Link href={`/admin/partners/${r.partnerId}`} className="font-medium hover:underline">
                              {r.name || (r.handle ? `@${r.handle}` : r.code)}
                            </Link>
                          ) : (
                            <span className="font-medium">{r.code}</span>
                          )}
                          <div className="font-mono text-xs text-ink-3">{r.code}</div>
                        </Td>
                        <Td className="text-right tabular-nums">{fmtNum(r.clicks)}</Td>
                        <Td className="text-right tabular-nums">{fmtNum(r.orders)}</Td>
                        <Td className="text-right tabular-nums">{fmtMoney(r.revenueCents)}</Td>
                        <Td className="text-right tabular-nums">{fmtMoney(r.commissionCents)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>

            <Card
              title="Latest previews"
              actions={
                <Link href="/admin/generations" className="text-sm text-ink-3 hover:text-ink">
                  All →
                </Link>
              }
            >
              {data.recentGens.length === 0 ? (
                <EmptyState title="No previews yet" />
              ) : (
                <ul className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-4">
                  {data.recentGens.map((g) => (
                    <li key={g.id} className="relative aspect-[4/5] overflow-hidden rounded-md bg-paper-2">
                      <Image
                        src={previewUrl(g.preview_path)}
                        alt={`${getStyle(g.style)?.name ?? g.style} preview${g.pet_name ? ` of ${g.pet_name}` : ""}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/70 to-transparent px-1.5 pb-1 pt-3 text-[10px] text-paper">
                        {getStyle(g.style)?.name ?? g.style}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </>
  );
}
