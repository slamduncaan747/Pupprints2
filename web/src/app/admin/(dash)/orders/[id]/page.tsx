import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, ExternalLink } from "lucide-react";
import { z } from "zod";
import { db, previewUrl, signedUrl } from "@/lib/supabase/server";
import { getStyle } from "@/lib/catalog";
import { OrderActions } from "@/components/admin/order-actions";
import { formatAddress, normalizeItems } from "@/components/admin/order-items";
import { labelize } from "@/components/admin/constants";
import { Card, DbMissing, PageHeader, StatusPill, adminButton, fmtDate, fmtMoney } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order", robots: { index: false, follow: false } };

type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  order_number: string;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  status: string;
  email: string | null;
  customer_name: string | null;
  phone: string | null;
  shipping_address: unknown;
  items: unknown;
  subtotal_cents: number | null;
  shipping_cents: number | null;
  discount_cents: number | null;
  tax_cents: number | null;
  total_cents: number | null;
  currency: string;
  referral_code: string | null;
  utm: Record<string, string> | null;
  gift_message: string | null;
  fulfillment_provider: string | null;
  fulfillment_order_id: string | null;
  fulfillment_status: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  carrier: string | null;
  print_files: unknown;
  notes: string | null;
};

type Gen = { id: string; style: string; preview_path: string | null; full_path: string | null; pet_name: string | null; width: number | null; height: number | null };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-ink-3">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Order" back={{ href: "/admin/orders", label: "Orders" }} />
        <DbMissing />
      </>
    );
  }

  const { data } = await c.from("orders").select("*").eq("id", id).maybeSingle<Order>();
  if (!data) notFound();
  const order = data;
  const items = normalizeItems(order.items);

  const genIds = [...new Set(items.map((i) => i.generationId).filter((x): x is string => !!x && z.uuid().safeParse(x).success))];
  const { data: gens } = genIds.length
    ? await c.from("generations").select("id, style, preview_path, full_path, pet_name, width, height").in("id", genIds)
    : { data: [] as Gen[] };
  const genMap = new Map(((gens ?? []) as Gen[]).map((g) => [g.id, g]));
  const downloads = new Map<string, string>();
  await Promise.all(
    [...genMap.values()].map(async (g) => {
      if (!g.full_path) return;
      try {
        downloads.set(g.id, await signedUrl("portraits", g.full_path, 60 * 60));
      } catch {
        // file missing — leave the link out
      }
    }),
  );

  const address = formatAddress(order.shipping_address);
  const cur = order.currency;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/orders", label: "Orders" }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {order.order_number} <StatusPill status={order.status} />
          </span>
        }
        subtitle={`Placed ${fmtDate(order.created_at)} · updated ${fmtDate(order.updated_at)}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title={`Items (${items.length})`}>
            {items.length === 0 ? (
              <p className="p-4 text-sm text-ink-3">No items recorded on this order.</p>
            ) : (
              <ul className="divide-y divide-line">
                {items.map((it, i) => {
                  const g = it.generationId ? genMap.get(it.generationId) : undefined;
                  const dl = g ? downloads.get(g.id) : undefined;
                  return (
                    <li key={i} className="flex gap-4 p-4">
                      <div className="relative h-32 w-26 shrink-0 overflow-hidden rounded-md bg-paper-2 sm:h-40 sm:w-32">
                        {g?.preview_path ? (
                          <a href={previewUrl(g.preview_path)} target="_blank" rel="noreferrer" title="Open preview">
                            <Image
                              src={previewUrl(g.preview_path)}
                              alt={`Preview for ${it.label}`}
                              fill
                              sizes="128px"
                              className="object-cover"
                            />
                          </a>
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-ink-3">
                            No preview
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-medium text-ink">{it.label}</p>
                        <p className="mt-0.5 text-ink-2">
                          {[
                            it.style ?? (g ? (getStyle(g.style)?.name ?? g.style) : null),
                            it.frame ? `${labelize(it.frame)} frame` : null,
                            (it.petName ?? g?.pet_name) ? `“${it.petName ?? g?.pet_name}”` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                        <p className="mt-1 tabular-nums text-ink-2">
                          {it.quantity} × {it.included ? "included" : fmtMoney(it.unitCents, cur)}
                        </p>
                        {it.variantId && <p className="mt-1 font-mono text-xs text-ink-3">{it.variantId}</p>}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {dl ? (
                            <a href={dl} className={adminButton("primary", "h-8 text-xs")} target="_blank" rel="noreferrer">
                              <Download className="h-3.5 w-3.5" /> Download print file
                            </a>
                          ) : (
                            <span className="text-xs text-clay-dark">
                              {g ? "Print file not found in storage" : it.generationId ? "Generation not found" : "No generation linked"}
                            </span>
                          )}
                          {g?.width && g?.height && (
                            <span className="self-center text-xs text-ink-3">
                              {g.width}×{g.height}px
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <details className="border-t border-line px-4 py-2 text-xs text-ink-3">
              <summary className="cursor-pointer py-1">Raw items JSON</summary>
              <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(order.items, null, 2)}
              </pre>
            </details>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Customer">
              <dl className="px-4 py-2">
                <Row label="Name">{order.customer_name || "—"}</Row>
                <Row label="Email">
                  {order.email ? (
                    <a href={`mailto:${order.email}`} className="break-all underline-offset-2 hover:underline">
                      {order.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </Row>
                <Row label="Phone">{order.phone || "—"}</Row>
              </dl>
              <div className="border-t border-line px-4 py-3 text-sm">
                <p className="mb-1 text-ink-3">Ship to</p>
                {address.length ? (
                  <address className="not-italic leading-relaxed">
                    {address.map((l, i) => (
                      <div key={i}>{l}</div>
                    ))}
                  </address>
                ) : (
                  <p className="text-ink-3">No shipping address (digital order?)</p>
                )}
              </div>
            </Card>

            <Card title="Payment">
              <dl className="px-4 py-2">
                <Row label="Subtotal">{fmtMoney(order.subtotal_cents, cur)}</Row>
                <Row label="Shipping">{fmtMoney(order.shipping_cents, cur)}</Row>
                <Row label="Discount">{order.discount_cents ? `−${fmtMoney(order.discount_cents, cur)}` : "—"}</Row>
                <Row label="Tax">{fmtMoney(order.tax_cents, cur)}</Row>
                <div className="mt-1 border-t border-line pt-1">
                  <Row label="Total">
                    <span className="font-semibold">{fmtMoney(order.total_cents, cur)}</span>
                  </Row>
                </div>
                <Row label="Stripe">
                  <span className="break-all font-mono text-xs">{order.stripe_payment_intent ?? order.stripe_session_id ?? "—"}</span>
                </Row>
              </dl>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Attribution">
              <dl className="px-4 py-2">
                <Row label="Referral code">
                  <span className="font-mono">{order.referral_code ?? "—"}</span>
                </Row>
                {order.utm &&
                  Object.entries(order.utm).map(([k, v]) => (
                    <Row key={k} label={k}>
                      <span className="break-all">{String(v)}</span>
                    </Row>
                  ))}
              </dl>
            </Card>
            <Card title="Gift message">
              <p className="whitespace-pre-wrap px-4 py-3 text-sm text-ink-2">{order.gift_message || "—"}</p>
            </Card>
          </div>

          <Card title="Fulfillment">
            <dl className="px-4 py-2">
              <Row label="Provider">{order.fulfillment_provider ?? "—"}</Row>
              <Row label="Provider order">
                <span className="font-mono text-xs">{order.fulfillment_order_id ?? "—"}</span>
              </Row>
              <Row label="Status">{order.fulfillment_status ? labelize(order.fulfillment_status) : "—"}</Row>
              <Row label="Tracking">
                {order.tracking_url ? (
                  <a href={order.tracking_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    {order.carrier ? `${order.carrier} ` : ""}
                    {order.tracking_number ?? "Track"} <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  [order.carrier, order.tracking_number].filter(Boolean).join(" ") || "—"
                )}
              </Row>
            </dl>
            <p className="border-t border-line px-4 py-2.5 text-xs">
              <a
                href={`/api/admin/orders/${order.id}/fulfill`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-ink-2 underline-offset-2 hover:text-ink hover:underline"
              >
                Print-ready file links (7-day signed URLs) <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            {order.print_files != null && (
              <details className="border-t border-line px-4 py-2 text-xs text-ink-3">
                <summary className="cursor-pointer py-1">Print files JSON</summary>
                <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-all font-mono">
                  {JSON.stringify(order.print_files, null, 2)}
                </pre>
              </details>
            )}
          </Card>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card title="Actions">
            <div className="p-4">
              <OrderActions
                order={{
                  id: order.id,
                  status: order.status,
                  tracking_number: order.tracking_number,
                  tracking_url: order.tracking_url,
                  carrier: order.carrier,
                  fulfillment_status: order.fulfillment_status,
                  notes: order.notes,
                }}
              />
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
