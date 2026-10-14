import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/supabase/server";
import {
  CHANNELS,
  DAILY_TARGET,
  MIN_DOSE,
  PAID_CAC_TARGET_CENTS,
  RULE100,
  addDays,
  dayKey,
  dayLabel,
  isDayKey,
  rule100Day,
} from "@/components/admin/scorecard";
import { loadDayEntries, loadHeardFrom, loadScorecard, totals, type DayRow, type HeardFromRow, type Totals } from "@/components/admin/scorecard-data";
import { ScorecardLogger } from "@/components/admin/scorecard-logger";
import { Card, DbMissing, ErrorNote, PageHeader, Table, Td, Th, adminButton, fmtMoney, fmtNum, fmtPct, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Scorecard", robots: { index: false, follow: false } };

const COUNTED = CHANNELS.filter((ch) => ch.counts);

function ratio(n: number, d: number): number | null {
  return d > 0 ? n / d : null;
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-ink-3">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-ink-3">{sub}</p>}
    </div>
  );
}

function Num({ n, muted = true }: { n: number; muted?: boolean }) {
  return <span className={cn("tabular-nums", n === 0 && muted && "text-ink-3/50")}>{fmtNum(n)}</span>;
}

function cac(spend: number, orders: number): string {
  if (spend <= 0) return "—";
  return orders > 0 ? fmtMoney(spend / orders) : "no orders";
}

function ConversionTable({ week, month }: { week: Totals; month: Totals }) {
  const rows: { label: string; hint?: string; v: (t: Totals) => string }[] = [
    { label: "New actions", v: (t) => fmtNum(t.actions) },
    { label: "Days at 100", v: (t) => `${t.daysAtTarget} / ${t.days}` },
    { label: "Follow-ups", hint: "extra", v: (t) => fmtNum(t.followUps) },
    { label: "Gifts sent → opened", v: (t) => `${fmtNum(t.giftsSent)} → ${fmtNum(t.giftsOpened)}` },
    { label: "Previews", hint: "customers", v: (t) => fmtNum(t.previews) },
    { label: "Leads", v: (t) => fmtNum(t.leads) },
    { label: "Orders", v: (t) => fmtNum(t.orders) },
    { label: "Revenue", v: (t) => fmtMoney(t.revenueCents) },
    { label: "Actions → lead", v: (t) => fmtPct(ratio(t.leads, t.actions)) },
    { label: "Lead → order", v: (t) => fmtPct(ratio(t.orders, t.leads)) },
    { label: "Actions per order", v: (t) => (t.orders ? fmtNum(Math.round(t.actions / t.orders)) : "—") },
    { label: "Ad spend", v: (t) => fmtMoney(t.spendCents) },
    { label: "Paid CAC", hint: "spend ÷ paid-tagged orders", v: (t) => cac(t.spendCents, t.paidOrders) },
    { label: "Blended CAC", hint: "spend ÷ all orders", v: (t) => cac(t.spendCents, t.orders) },
  ];
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          <Th>
            <span className="sr-only">Metric</span>
          </Th>
          <Th className="text-right">7 days</Th>
          <Th className="text-right">30 days</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <Td className="py-2">
              {r.label}
              {r.hint && <span className="ml-1 text-xs text-ink-3">· {r.hint}</span>}
            </Td>
            <Td className="py-2 text-right tabular-nums">{r.v(week)}</Td>
            <Td className="py-2 text-right tabular-nums">{r.v(month)}</Td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function HeardFromTable({ rows, total, other }: { rows: HeardFromRow[]; total: number; other: string[] }) {
  return (
    <>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <Th className="text-left">Answer</Th>
            <Th className="text-right">Orders</Th>
            <Th className="text-right">% of orders</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <Td className={cn("py-2", r.id === "none" && "text-ink-3")}>{r.label}</Td>
              <Td className="py-2 text-right">
                <Num n={r.orders} />
              </Td>
              <Td className="py-2 text-right tabular-nums">{r.orders ? fmtPct(r.share) : <span className="text-ink-3/50">—</span>}</Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-y-1.5 border-t border-line px-4 py-3">
        <p className="text-[11px] text-ink-3">
          {total} paid {total === 1 ? "order" : "orders"} in the last 30 days. Asked once, optionally, on the order success page.
        </p>
        {other.length > 0 && <p className="text-[11px] text-ink-3">Other: {other.join(" · ")}</p>}
      </div>
    </>
  );
}

function CacVerdict({ week }: { week: Totals }) {
  if (week.spendCents <= 0) {
    return <p className="text-xs text-ink-3">Log ad spend on the paid channels to see the trailing-7-day CAC.</p>;
  }
  const paidCac = week.paidOrders > 0 ? week.spendCents / week.paidOrders : null;
  const ok = paidCac != null && paidCac <= PAID_CAC_TARGET_CENTS;
  return (
    <p className={cn("text-xs", ok ? "text-moss" : "text-ink-2")}>
      Trailing-7-day paid CAC {paidCac != null ? fmtMoney(paidCac) : "n/a (no paid-tagged orders)"}:{" "}
      {ok
        ? `at or under ${fmtMoney(PAID_CAC_TARGET_CENTS)}, so spend can move toward $100/day.`
        : `hold spend until it is at or under ${fmtMoney(PAID_CAC_TARGET_CENTS)}.`}
    </p>
  );
}

function DayTable({ rows, selected, month }: { rows: DayRow[]; selected: string; month: Totals }) {
  const outcome = (r: Pick<DayRow, "previews" | "leads" | "orders" | "revenueCents" | "giftsSent" | "giftsOpened" | "applications" | "spendCents" | "followUps">) => (
    <>
      <Td className="text-right">
        <Num n={r.followUps} />
      </Td>
      <Td className="text-right tabular-nums">{r.spendCents ? fmtMoney(r.spendCents) : <span className="text-ink-3/50">—</span>}</Td>
      <Td className="border-l border-line text-right">
        <Num n={r.previews} />
      </Td>
      <Td className="text-right">
        <Num n={r.leads} />
      </Td>
      <Td className="text-right">
        <Num n={r.orders} />
      </Td>
      <Td className="text-right tabular-nums">{r.revenueCents ? fmtMoney(r.revenueCents) : <span className="text-ink-3/50">—</span>}</Td>
      <Td className="text-right">
        <Num n={r.giftsSent} />
      </Td>
      <Td className="text-right">
        <Num n={r.giftsOpened} />
      </Td>
      <Td className="text-right">
        <Num n={r.applications} />
      </Td>
    </>
  );

  return (
    <Table className="[&_table]:min-w-[1180px]">
      <thead>
        <tr>
          <Th className="sticky left-0 z-10 bg-white">Day</Th>
          {COUNTED.map((ch) => (
            <Th key={ch.id} className="text-right" title={ch.hint}>
              {ch.short}
            </Th>
          ))}
          <Th className="text-right">Total</Th>
          <Th className="text-right" title="Follow-ups don't count toward the 100">
            Follow-ups
          </Th>
          <Th className="text-right">Spend</Th>
          <Th className="border-l border-line text-right" title="Successful previews by customers (admin gifts excluded)">
            Previews
          </Th>
          <Th className="text-right">Leads</Th>
          <Th className="text-right">Orders</Th>
          <Th className="text-right">Revenue</Th>
          <Th className="text-right">Gifts</Th>
          <Th className="text-right" title="Gift reveal pages opened for the first time">
            Opened
          </Th>
          <Th className="text-right" title="Partner applications">
            Apps
          </Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.day} className={cn(r.day === selected && "bg-paper-2/70")}>
            <Td className={cn("sticky left-0 z-10 whitespace-nowrap", r.day === selected ? "bg-paper-2" : "bg-white")}>
              <Link href={`/admin/scorecard?day=${r.day}`} className="font-medium underline-offset-2 hover:underline">
                {dayLabel(r.day)}
              </Link>
              {rule100Day(r.day) >= 1 && rule100Day(r.day) <= RULE100.days && (
                <span className="ml-1.5 text-[11px] text-ink-3">D{rule100Day(r.day)}</span>
              )}
            </Td>
            {COUNTED.map((ch) => (
              <Td key={ch.id} className="text-right">
                <Num n={r.counts[ch.id] ?? 0} />
              </Td>
            ))}
            <Td
              className={cn(
                "text-right font-semibold tabular-nums",
                r.actions >= DAILY_TARGET ? "text-moss" : r.actions > 0 && r.actions < MIN_DOSE ? "text-clay-dark" : "",
              )}
            >
              {r.actions}
              <span className="ml-0.5 text-[11px] font-normal text-ink-3">/{DAILY_TARGET}</span>
            </Td>
            {outcome(r)}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-paper/60 font-semibold">
          <Td className="sticky left-0 z-10 bg-paper-2">30 days</Td>
          {COUNTED.map((ch) => (
            <Td key={ch.id} className="text-right">
              <Num n={rows.reduce((s, r) => s + (r.counts[ch.id] ?? 0), 0)} muted={false} />
            </Td>
          ))}
          <Td className="text-right tabular-nums">{fmtNum(month.actions)}</Td>
          {outcome(month)}
        </tr>
      </tfoot>
    </Table>
  );
}

export default async function ScorecardPage({ searchParams }: PageProps<"/admin/scorecard">) {
  const sp = await searchParams;
  const today = dayKey();
  const minDay = addDays(today, -365);
  const day = isDayKey(sp.day) && sp.day <= today && sp.day >= minDay ? sp.day : today;

  const runDay = rule100Day(today);
  const runLine =
    runDay < 1
      ? `The 100-day run starts ${dayLabel(RULE100.start)} (${runDay === 0 ? "tomorrow" : `in ${1 - runDay} days`}) and ends ${dayLabel(RULE100.end, true)}.`
      : runDay <= RULE100.days
        ? `Day ${runDay} of ${RULE100.days} · ends ${dayLabel(RULE100.end, true)}.`
        : `The 100-day run ended ${dayLabel(RULE100.end, true)}.`;

  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Rule of 100" subtitle={runLine} />
        <DbMissing />
      </>
    );
  }

  const [scoreRes, dayData, heard] = await Promise.all([
    loadScorecard(c, { today, days: 30 }).then(
      (value) => ({ value, error: null }),
      (err: unknown) => ({ value: null, error: err instanceof Error ? err.message : "Could not load the scorecard" }),
    ),
    loadDayEntries(c, day),
    loadHeardFrom(c, { today, days: 30 }),
  ]);
  const score = scoreRes.value;
  const loadError = scoreRes.error;

  const tableMissing = dayData.tableMissing || Boolean(score?.tableMissing);
  const week = score ? totals(score.rows, 7, DAILY_TARGET) : null;
  const month = score ? totals(score.rows, 30, DAILY_TARGET) : null;
  const dayRow = score?.rows.find((r) => r.day === day) ?? null;
  const isToday = day === today;
  const prev = addDays(day, -1);
  const next = addDays(day, 1);

  return (
    <>
      <PageHeader
        title="Rule of 100"
        subtitle={`${runLine} ${DAILY_TARGET} new primary actions a day (minimum dose ${MIN_DOSE}); follow-ups are extra.`}
        actions={
          <>
            <Link href={`/admin/scorecard?day=${prev}`} className={adminButton("secondary")} aria-label="Previous day">
              ←
            </Link>
            {!isToday && (
              <Link href="/admin/scorecard" className={adminButton("secondary")}>
                Today
              </Link>
            )}
            {next <= today && (
              <Link href={`/admin/scorecard?day=${next}`} className={adminButton("secondary")} aria-label="Next day">
                →
              </Link>
            )}
            <form method="get" action="/admin/scorecard" className="flex items-center gap-2">
              <label htmlFor="sc-day" className="sr-only">
                Day to log
              </label>
              <input id="sc-day" type="date" name="day" defaultValue={day} min={minDay} max={today} className={cn(inputClass, "h-9 w-auto")} />
              <button type="submit" className={adminButton("secondary")}>
                Go
              </button>
            </form>
          </>
        }
      />

      {tableMissing && (
        <ErrorNote message="The daily_actions table isn't in the database yet. Apply web/supabase/migrations/0006_daily_actions.sql to start logging; outcomes below still work." />
      )}
      {dayData.error && <ErrorNote message={dayData.error} />}
      {score?.actionsError && <ErrorNote message={score.actionsError} />}
      {loadError && <ErrorNote message={loadError} />}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <ScorecardLogger
          key={day}
          day={day}
          dayTitle={isToday ? `Today · ${dayLabel(day)}` : `${dayLabel(day, true)} (past day)`}
          initial={dayData.entries}
          disabled={tableMissing}
        />

        <div className="space-y-6">
          <Card title={`Outcomes · ${isToday ? "today" : dayLabel(day)}`}>
            {dayRow ? (
              <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                <Stat label="Previews" value={fmtNum(dayRow.previews)} sub="customers, gifts excluded" />
                <Stat label="Leads" value={fmtNum(dayRow.leads)} sub="emails captured" />
                <Stat label="Orders" value={fmtNum(dayRow.orders)} sub={fmtMoney(dayRow.revenueCents)} />
                <Stat label="Gifts sent" value={fmtNum(dayRow.giftsSent)} />
                <Stat label="Gifts opened" value={fmtNum(dayRow.giftsOpened)} sub="first views" />
                <Stat label="Partner apps" value={fmtNum(dayRow.applications)} />
              </div>
            ) : (
              <p className="p-4 text-sm text-ink-3">Outcomes are shown for the last 30 days only.</p>
            )}
          </Card>

          {week && month && (
            <Card title="Conversion">
              <ConversionTable week={week} month={month} />
              <div className="space-y-1.5 border-t border-line px-4 py-3">
                <CacVerdict week={week} />
                <p className="text-[11px] text-ink-3">
                  Paid-tagged orders have a first-touch utm_medium such as cpc or paid_social, so tag ad links that way.
                  Outcomes are site-wide, not attributed to a channel.
                </p>
              </div>
            </Card>
          )}

          <Card title="How they heard about us · last 30 days">
            {heard.error ? (
              <p className="p-4 text-sm text-ink-3">Couldn&apos;t load answers: {heard.error}</p>
            ) : (
              <HeardFromTable rows={heard.rows} total={heard.total} other={heard.other} />
            )}
          </Card>
        </div>
      </div>

      {score && month && (
        <Card title="Last 30 days" className="mt-6">
          <DayTable rows={score.rows} selected={day} month={month} />
        </Card>
      )}
    </>
  );
}
