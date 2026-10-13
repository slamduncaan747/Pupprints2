import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/supabase/server";
import { ORDER_STATUSES, labelize } from "@/components/admin/constants";
import { fetchAll } from "@/components/admin/queries";
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
  adminButton,
  fmtDate,
  fmtMoney,
  inputClass,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders", robots: { index: false, follow: false } };

type OrderListRow = {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  email: string | null;
  customer_name: string | null;
  items: unknown;
  total_cents: number | null;
  currency: string;
  referral_code: string | null;
  fulfillment_status: string | null;
  tracking_number: string | null;
};

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (ORDER_STATUSES as readonly string[]).includes(sp.status) ? sp.status : "all";
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Orders" />
        <DbMissing />
      </>
    );
  }

  let query = c
    .from("orders")
    .select(
      "id, order_number, created_at, status, email, customer_name, items, total_cents, currency, referral_code, fulfillment_status, tracking_number",
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (status !== "all") query = query.eq("status", status);
  // Restrict to characters that are safe inside a PostgREST or=(...) filter.
  const term = q.replace(/[^A-Za-z0-9@.+\- ]/g, "").trim();
  if (term) {
    const like = `*${term}*`;
    query = query.or(`order_number.ilike.${like},email.ilike.${like},customer_name.ilike.${like}`);
  }

  const [{ data, error }, statusRows] = await Promise.all([
    query,
    fetchAll<{ status: string }>((f, t) => c.from("orders").select("status").range(f, t), 50_000).catch(() => []),
  ]);
  const counts = new Map<string, number>();
  for (const r of statusRows) counts.set(r.status, (counts.get(r.status) ?? 0) + 1);
  const orders = (data ?? []) as OrderListRow[];

  const href = (s: string) => {
    const p = new URLSearchParams();
    if (s !== "all") p.set("status", s);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  };

  const tabs = [
    { value: "all", label: "All", count: statusRows.length },
    ...["needs_attention", "paid", "in_production", "shipped", "delivered", "pending", "refunded", "canceled"].map((s) => ({
      value: s,
      label: labelize(s),
      count: counts.get(s) ?? 0,
    })),
  ].map((t) => ({ ...t, href: href(t.value) }));

  return (
    <>
      <PageHeader title="Orders" subtitle="Newest first · up to 200 shown" />
      <form method="get" className="mb-4 flex max-w-md gap-2">
        {status !== "all" && <input type="hidden" name="status" value={status} />}
        <label htmlFor="q" className="sr-only">
          Search orders
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Order #, email or name" className={inputClass} />
        <button type="submit" className={adminButton("primary")} aria-label="Search">
          <Search className="h-4 w-4" />
        </button>
      </form>
      <FilterTabs current={status} items={tabs} />
      {error && <ErrorNote message={error.message} />}

      <Card>
        {orders.length === 0 ? (
          <EmptyState title={q || status !== "all" ? "No orders match" : "No orders yet"}>
            Paid orders are created by the Stripe webhook.
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th className="text-right">Items</Th>
                <Th className="text-right">Total</Th>
                <Th>Ref</Th>
                <Th>Status</Th>
                <Th>Fulfillment</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-paper/50">
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} className="font-medium underline-offset-2 hover:underline">
                      {o.order_number}
                    </Link>
                    <div className="text-xs text-ink-3">{fmtDate(o.created_at)}</div>
                  </Td>
                  <Td className="max-w-[240px]">
                    <div className="truncate">{o.customer_name || "—"}</div>
                    <div className="truncate text-xs text-ink-3">{o.email}</div>
                  </Td>
                  <Td className="text-right tabular-nums">{Array.isArray(o.items) ? o.items.length : 0}</Td>
                  <Td className="text-right tabular-nums">{fmtMoney(o.total_cents, o.currency)}</Td>
                  <Td className="font-mono text-xs">{o.referral_code ?? ""}</Td>
                  <Td>
                    <StatusPill status={o.status} />
                  </Td>
                  <Td className="text-xs text-ink-2">
                    {o.fulfillment_status ? labelize(o.fulfillment_status) : "—"}
                    {o.tracking_number && <div className="font-mono text-ink-3">{o.tracking_number}</div>}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
