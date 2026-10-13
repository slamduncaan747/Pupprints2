import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/container";
import { CopyField } from "@/components/partners/copy-field";
import { REDEEMABLE_STATUSES, normalizeCode } from "@/components/partners/program";
import { EMPTY_STATS, daysAgoIso, getPartnerStats, getPartnerSummary, partnerShareLink, verifyPartnerStatsToken } from "@/lib/partners";
import { site } from "@/lib/config";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your partner stats",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: "no-referrer",
};

const money = (cents: number) => formatPrice(Math.round(cents));
const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-card bg-white p-5 ring-1 ring-line sm:p-6">
      <p className="text-sm text-ink-3">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink-3">{sub}</p>}
    </div>
  );
}

function Invalid() {
  return (
    <Container className="max-w-xl py-24 text-center sm:py-32">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-paper-2">
        <Lock className="h-6 w-6 text-ink-2" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-4xl">This stats link isn&apos;t valid</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-2">
        Your private stats link is in the welcome email we sent you. If it isn&apos;t working, email{" "}
        <a href={`mailto:${site.partnersEmail}`} className="font-medium text-ink underline underline-offset-4">
          {site.partnersEmail}
        </a>{" "}
        and we&apos;ll send a fresh one.
      </p>
      <p className="mt-8">
        <Link href="/partners" className="text-ink underline underline-offset-4">
          About the creator program
        </Link>
      </p>
    </Container>
  );
}

export default async function PartnerStatsPage({ searchParams }: PageProps<"/partners/stats">) {
  const sp = await searchParams;
  const code = normalizeCode(typeof sp.code === "string" ? sp.code : null);
  const token = typeof sp.token === "string" ? sp.token : "";
  if (!code || !verifyPartnerStatsToken(code, token)) return <Invalid />;

  const partner = await getPartnerSummary(code);
  if (!partner) return <Invalid />;

  const since30 = daysAgoIso(30);
  const [all, last30] = await Promise.all([getPartnerStats(partner.code), getPartnerStats(partner.code, since30)]).catch(
    () => [EMPTY_STATS, EMPTY_STATS] as const,
  );
  const redeemable = (REDEEMABLE_STATUSES as readonly string[]).includes(partner.status);
  const pct = Math.round(partner.commissionRate * 1000) / 10;
  const greeting = partner.name?.split(/\s+/)[0] || (partner.handle ? `@${partner.handle}` : null);

  return (
    <Container className="max-w-5xl py-12 sm:py-20">
      <Eyebrow>Creator program · private</Eyebrow>
      <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl">
        {greeting ? `Hi ${greeting}, here's how it's going` : "Your partner stats"}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        Clicks, orders and earnings from your link and code <span className="font-mono text-ink">{partner.code}</span>. This page is
        private to you; please don&apos;t share the link.
      </p>

      {!redeemable && (
        <p className="mt-6 rounded-xl bg-butter-soft px-4 py-3 text-[15px] text-ink-2 ring-1 ring-butter">
          Your code isn&apos;t live at checkout yet. We&apos;ll let you know as soon as it&apos;s active.
        </p>
      )}

      <section aria-labelledby="all-time" className="mt-10">
        <h2 id="all-time" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-3">
          All time
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Stat label="Link clicks" value={all.clicks.toLocaleString("en-US")} />
          <Stat label="Orders" value={all.orders.toLocaleString("en-US")} sub={all.clicks ? `${((all.orders / all.clicks) * 100).toFixed(1)}% of clicks` : undefined} />
          <Stat label="Sales from you" value={money(all.revenueCents)} />
          <Stat label="Your commission" value={money(all.commissionCents)} sub={`${pct}% of sales`} />
        </div>
      </section>

      <section aria-labelledby="last-30" className="mt-10">
        <h2 id="last-30" className="font-sans text-sm font-semibold uppercase tracking-[0.14em] text-ink-3">
          Last 30 days
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-card bg-paper-2 p-5 sm:grid-cols-4 sm:p-6">
          {[
            ["Clicks", last30.clicks.toLocaleString("en-US")],
            ["Orders", last30.orders.toLocaleString("en-US")],
            ["Sales", money(last30.revenueCents)],
            ["Commission", money(last30.commissionCents)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-ink-3">{k}</dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="share" className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-card bg-white p-5 ring-1 ring-line sm:p-8">
          <h2 id="share" className="font-display text-2xl">Share</h2>
          <p className="mt-2 text-[15px] text-ink-2">
            Your audience gets {partner.discountPercent}% off with your code, and your link remembers them for 30 days.
          </p>
          <div className="mt-6 space-y-5">
            <CopyField label="Your link" value={partnerShareLink(partner.code)} />
            <CopyField label="Your discount code" value={partner.code} mono />
          </div>
          <p className="mt-6 rounded-xl bg-butter-soft px-4 py-3 text-sm text-ink-2">
            Reminder: mark every post <strong className="text-ink">#ad</strong> or use the{" "}
            <strong className="text-ink">Paid partnership</strong> label.
          </p>
        </div>

        <div className="rounded-card bg-white p-5 ring-1 ring-line sm:p-8">
          <h2 className="font-display text-2xl">Recent orders</h2>
          {all.recentOrders.length === 0 ? (
            <p className="mt-3 text-[15px] text-ink-2">No orders yet. They&apos;ll appear here as soon as someone orders with your link or code.</p>
          ) : (
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="text-ink-3">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 text-right font-medium">Order</th>
                  <th className="py-2 text-right font-medium">You earned</th>
                </tr>
              </thead>
              <tbody>
                {all.recentOrders.map((o, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="py-2.5">{dateFmt.format(new Date(o.createdAt))}</td>
                    <td className="py-2.5 text-right tabular-nums">{money(o.amountCents)}</td>
                    <td className="py-2.5 text-right font-medium tabular-nums">{money(o.commissionCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <p className="mt-12 text-sm text-ink-3">
        Payouts are monthly. Refunded orders don&apos;t earn commission. Questions?{" "}
        <a href={`mailto:${site.partnersEmail}`} className="text-ink underline underline-offset-4">
          {site.partnersEmail}
        </a>
      </p>
    </Container>
  );
}
