import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, ExternalLink, Gift, Layers, Printer } from "lucide-react";
import { z } from "zod";
import { db } from "@/lib/supabase/server";
import { daysAgoIso, getPartnerStats, partnerShareLink, partnerStatsLink, partnerStatsToken, type PartnerRow } from "@/lib/partners";
import { PartnerForm } from "@/components/admin/partner-form";
import { CopyButton, PartnerQuickActions } from "@/components/admin/partner-controls";
import { REDEEMABLE_STATUSES } from "@/components/partners/program";
import { nicheCampaign, partnerQrUrl, qrSvg, qrSvgDataUrl } from "@/components/admin/partner-qr";
import { Card, DbMissing, PageHeader, StatusPill, adminButton, fmtDate, fmtMoney, fmtNum } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Partner", robots: { index: false, follow: false } };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-3">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function ApplicationView({ app }: { app: Record<string, unknown> }) {
  const channels = Array.isArray(app.channels) ? (app.channels as { platform: string; handle: string; followers?: number | null; profileUrl?: string | null }[]) : [];
  const dog = (app.dog ?? {}) as { name?: string | null; breed?: string | null };
  const links = Array.isArray(app.contentLinks) ? (app.contentLinks as string[]) : [];
  return (
    <dl className="space-y-3 p-4 text-sm">
      {typeof app.submittedAt === "string" && (
        <div>
          <dt className="text-xs text-ink-3">Submitted</dt>
          <dd>{fmtDate(app.submittedAt)}</dd>
        </div>
      )}
      {channels.length > 0 && (
        <div>
          <dt className="text-xs text-ink-3">Channels</dt>
          <dd>
            <ul className="mt-0.5 space-y-0.5">
              {channels.map((ch, i) => (
                <li key={i}>
                  <span className="capitalize">{ch.platform}</span>:{" "}
                  {ch.profileUrl ? (
                    <a href={ch.profileUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                      {ch.platform === "other" ? ch.handle : `@${ch.handle}`}
                    </a>
                  ) : (
                    `@${ch.handle}`
                  )}
                  {ch.followers != null && <span className="text-ink-3"> · {fmtNum(ch.followers)}</span>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      )}
      {(dog.name || dog.breed) && (
        <div>
          <dt className="text-xs text-ink-3">Dog</dt>
          <dd>{[dog.name, dog.breed].filter(Boolean).join(" · ")}</dd>
        </div>
      )}
      {typeof app.shippingCountry === "string" && (
        <div>
          <dt className="text-xs text-ink-3">Ships to</dt>
          <dd>{app.shippingCountry}</dd>
        </div>
      )}
      {links.length > 0 && (
        <div>
          <dt className="text-xs text-ink-3">Content links</dt>
          <dd className="space-y-0.5">
            {links.map((l) => (
              <a key={l} href={l} target="_blank" rel="noreferrer" className="block truncate underline-offset-2 hover:underline">
                {l}
              </a>
            ))}
          </dd>
        </div>
      )}
      {typeof app.why === "string" && app.why && (
        <div>
          <dt className="text-xs text-ink-3">Why Pup Prints</dt>
          <dd className="whitespace-pre-wrap text-ink-2">{app.why}</dd>
        </div>
      )}
      {typeof app.referredBy === "string" && app.referredBy && (
        <div>
          <dt className="text-xs text-ink-3">Arrived via ref</dt>
          <dd className="font-mono">{app.referredBy}</dd>
        </div>
      )}
    </dl>
  );
}

export default async function PartnerDetailPage({ params }: PageProps<"/admin/partners/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const c = db();
  if (!c) {
    return (
      <>
        <PageHeader title="Partner" back={{ href: "/admin/partners", label: "Partners" }} />
        <DbMissing />
      </>
    );
  }
  const { data } = await c.from("partners").select("*").eq("id", id).maybeSingle<PartnerRow>();
  if (!data) notFound();
  const p = data;

  const since30 = daysAgoIso(30);
  const [all, last30] = p.code ? await Promise.all([getPartnerStats(p.code), getPartnerStats(p.code, since30)]) : [null, null];
  const redeemable = (REDEEMABLE_STATUSES as readonly string[]).includes(p.status);
  const qrUrl = p.code ? partnerQrUrl(p.code, p.niche) : null;
  const qrImage = qrUrl ? qrSvgDataUrl(await qrSvg(qrUrl)) : null;

  return (
    <>
      <PageHeader
        back={{ href: "/admin/partners", label: "Partners" }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {p.name || (p.handle ? `@${p.handle}` : "Partner")} <StatusPill status={p.status} />
          </span>
        }
        subtitle={
          <>
            {p.platform && <span className="capitalize">{p.platform}</span>}
            {p.handle && <> · @{p.handle}</>}
            {p.followers != null && <> · {fmtNum(p.followers)} followers</>}
            {p.tier && <> · {p.tier}</>}
            {p.source && <> · source: {p.source}</>}
            {" · "}added {fmtDate(p.created_at, false)}
          </>
        }
        actions={
          <>
            {p.profile_url && (
              <a href={p.profile_url} target="_blank" rel="noreferrer" className={adminButton("secondary")}>
                Profile <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <Link href={`/admin/gifts/batch?partner=${p.id}`} className={adminButton("secondary")}>
              <Layers className="h-4 w-4" /> Batch gifts
            </Link>
            <Link href={`/admin/partners/${p.id}/gift`} className={adminButton("accent")}>
              <Gift className="h-4 w-4" /> Gift a portrait
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card title="Details">
            <div className="p-4">
              <PartnerForm id={p.id} initial={p} />
            </div>
          </Card>
          {p.application && Object.keys(p.application).length > 0 && (
            <Card title="Application">
              <ApplicationView app={p.application} />
            </Card>
          )}
        </div>

        <aside className="space-y-6 max-lg:order-first">
          <Card title="Code & links">
            <div className="space-y-4 p-4">
              <div>
                <p className="text-xs text-ink-3">Discount code</p>
                <p className="mt-0.5 font-mono text-xl font-semibold tracking-wide">{p.code ?? "—"}</p>
                <p className="mt-0.5 text-xs text-ink-3">
                  {Math.round(Number(p.commission_rate) * 1000) / 10}% commission · {p.discount_percent}% off for their audience
                  {p.code && !redeemable && (
                    <span className="mt-1 block text-clay-dark">Code only redeems at checkout once status is Gifted or Active.</span>
                  )}
                </p>
              </div>
              <PartnerQuickActions id={p.id} code={p.code} lastContactedAt={p.last_contacted_at} />
              <p className="text-xs text-ink-3">
                Last contacted: <span className="text-ink-2">{p.last_contacted_at ? fmtDate(p.last_contacted_at) : "never"}</span>
              </p>
              {p.code && (
                <div className="space-y-3 border-t border-line pt-4">
                  <div>
                    <p className="text-xs text-ink-3">Share link</p>
                    <p className="mb-1.5 break-all font-mono text-xs">{partnerShareLink(p.code)}</p>
                    <CopyButton value={partnerShareLink(p.code)} label="Copy share link" />
                  </div>
                  <div>
                    <p className="text-xs text-ink-3">Private stats link (send only to the partner)</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      <CopyButton value={partnerStatsLink(p.code)} label="Copy stats link" />
                      <a
                        href={`/partners/stats?code=${encodeURIComponent(p.code)}&token=${partnerStatsToken(p.code)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-8 items-center gap-1 text-xs text-ink-2 hover:text-ink"
                      >
                        Open <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {p.code && qrUrl && qrImage && (
            <Card title="QR code & counter card">
              <div className="space-y-3 p-4">
                <div className="flex gap-4">
                  {/* Inline SVG data URL generated server-side. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrImage} alt={`QR code for ${p.code}`} className="h-32 w-32 shrink-0 ring-1 ring-line" />
                  <div className="min-w-0 text-xs text-ink-3">
                    <p>Opens</p>
                    <p className="break-all font-mono text-ink-2">{qrUrl}</p>
                    <p className="mt-2">
                      utm_campaign <span className="font-mono text-ink-2">{nicheCampaign(p.niche)}</span>
                      {p.niche ? " (from niche)" : ": set a niche above to tag the campaign"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a href={`/api/admin/partners/${p.id}/qr?format=svg`} download className={adminButton("secondary", "h-8 text-xs")}>
                    <Download className="h-3.5 w-3.5" /> SVG
                  </a>
                  <a href={`/api/admin/partners/${p.id}/qr?format=png`} download className={adminButton("secondary", "h-8 text-xs")}>
                    <Download className="h-3.5 w-3.5" /> PNG
                  </a>
                  <Link href={`/admin/partners/${p.id}/card`} target="_blank" className={adminButton("primary", "h-8 text-xs")}>
                    <Printer className="h-3.5 w-3.5" /> A6 counter card
                  </Link>
                  <CopyButton value={qrUrl} label="Copy QR link" />
                </div>
              </div>
            </Card>
          )}

          <Card title="Performance">
            {all && last30 ? (
              <div className="space-y-4 p-4">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-3">All time</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Clicks" value={fmtNum(all.clicks)} />
                    <Stat label="Orders" value={fmtNum(all.orders)} />
                    <Stat label="Revenue" value={fmtMoney(all.revenueCents)} />
                    <Stat label="Commission" value={fmtMoney(all.commissionCents)} />
                  </div>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-3">Last 30 days</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Clicks" value={fmtNum(last30.clicks)} />
                    <Stat label="Orders" value={fmtNum(last30.orders)} />
                    <Stat label="Revenue" value={fmtMoney(last30.revenueCents)} />
                    <Stat label="Conversion" value={last30.clicks ? `${((last30.orders / last30.clicks) * 100).toFixed(1)}%` : "—"} />
                  </div>
                </div>
              </div>
            ) : (
              <p className="p-4 text-sm text-ink-3">Generate a code to start tracking clicks and orders.</p>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
