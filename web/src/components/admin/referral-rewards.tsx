import Link from "next/link";
import { REFERRAL } from "@/lib/offer";
import { getReferralRewards } from "@/lib/referrals";
import { Card, fmtDate, fmtMoney } from "@/components/admin/ui";

/**
 * Admin: a customer's "Give $15, get $15" rewards: owed (pending until the friend's order is past
 * its 30-day guarantee window; the daily cron issues them) and issued (single-use codes emailed).
 */
export async function ReferralRewardsCard({ code, referrerOrderId }: { code: string; referrerOrderId?: string | null }) {
  const r = await getReferralRewards(code);
  return (
    <Card title="Referral rewards">
      <div className="space-y-3 p-4 text-sm">
        <p className="text-xs text-ink-3">
          Customer code: friends get ${REFERRAL.friendCents / 100} off a first order of ${REFERRAL.minimumCents / 100}+; this
          customer gets ${REFERRAL.rewardCents / 100} per qualifying order after the {REFERRAL.holdDays}-day window.
          {referrerOrderId && (
            <>
              {" "}
              Earned with{" "}
              <Link href={`/admin/orders/${referrerOrderId}`} className="underline-offset-2 hover:underline">
                this order
              </Link>
              .
            </>
          )}
        </p>
        {!r ? (
          <p className="text-ink-3">Rewards unavailable.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-ink-3">Owed</p>
                <p className="text-lg font-semibold tabular-nums">
                  {fmtMoney(r.pendingCents)} <span className="text-xs font-normal text-ink-3">({r.pendingCount})</span>
                </p>
                {r.nextDueAt && <p className="text-xs text-ink-3">next due {fmtDate(r.nextDueAt, false)}</p>}
              </div>
              <div>
                <p className="text-xs text-ink-3">Issued</p>
                <p className="text-lg font-semibold tabular-nums">
                  {fmtMoney(r.issuedCents)} <span className="text-xs font-normal text-ink-3">({r.issuedCount})</span>
                </p>
                {r.voidCount > 0 && <p className="text-xs text-ink-3">{r.voidCount} not eligible</p>}
              </div>
            </div>
            {r.recent.length > 0 && (
              <ul className="divide-y divide-line border-t border-line text-xs">
                {r.recent.map((e, i) => (
                  <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 py-2">
                    <span>
                      {e.orderId ? (
                        <Link href={`/admin/orders/${e.orderId}`} className="underline-offset-2 hover:underline">
                          Friend&apos;s order
                        </Link>
                      ) : (
                        "Order"
                      )}{" "}
                      · {fmtDate(e.createdAt, false)}
                    </span>
                    <span className="text-ink-2">
                      {e.status === "issued"
                        ? `Issued${e.code ? ` ${e.code}` : ""}`
                        : e.status === "pending"
                          ? `Owed, due ${fmtDate(e.dueAt, false)}`
                          : "Not eligible"}
                      {e.note ? <span className="block text-ink-3">{e.note}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
