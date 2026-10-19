import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { site } from "@/lib/config";
import { db } from "@/lib/supabase/server";
import type { PartnerRow } from "@/lib/partners";
import { REDEEMABLE_STATUSES } from "@/components/partners/program";
import { partnerQrUrl, qrSvg, qrSvgDataUrl } from "@/components/admin/partner-qr";
import { CardLayoutSwitch, CardPages, CounterCard, cardLayout } from "@/components/admin/counter-card";
import { DbMissing } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Counter card", robots: { index: false, follow: false } };

export default async function PartnerCardPage({ params, searchParams }: PageProps<"/admin/partners/[id]/card">) {
  const { id } = await params;
  const sp = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const layout = cardLayout(sp.layout);
  const c = db();
  if (!c) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <DbMissing />
      </main>
    );
  }
  const { data: p } = await c.from("partners").select("*").eq("id", id).maybeSingle<PartnerRow>();
  if (!p) notFound();
  const partnerName = p.name || (p.handle ? `@${p.handle}` : "This business");
  const back = (
    <Link href={`/admin/partners/${p.id}`} className="text-sm text-ink-3 hover:text-ink">
      ← {partnerName}
    </Link>
  );

  if (!p.code || p.kind === "customer") {
    return (
      <main className="mx-auto max-w-3xl space-y-3 p-6">
        {back}
        <p className="text-sm text-ink-2">
          {p.kind === "customer"
            ? "Counter cards are for business and creator partners. This is a customer referral code, which customers share from their order page."
            : "Generate a code on the partner page first; the card prints their code and QR."}
        </p>
      </main>
    );
  }

  const url = partnerQrUrl(p.code, p.niche);
  const qr = qrSvgDataUrl(await qrSvg(url));
  const redeemable = (REDEEMABLE_STATUSES as readonly string[]).includes(p.status);
  // FTC: a business that earns a fee for recommending us must say so on the card itself.
  const disclose = Number(p.commission_rate) > 0;
  const host = new URL(site.url).host;
  const code = p.code;
  const card = (
    <CounterCard
      qr={qr}
      qrAlt={`QR code linking to ${host} with code ${code}`}
      line={
        p.discount_percent > 0 ? (
          <>
            {p.discount_percent}% off with code <span className="font-semibold">{code}</span>
          </>
        ) : (
          <>
            Use code <span className="font-semibold">{code}</span> at checkout
          </>
        )
      }
      fine={disclose ? `${partnerName} earns a referral fee from Pup Prints orders.` : undefined}
    />
  );

  return (
    <CardPages
      layout={layout}
      card={card}
      toolbar={
        <>
          {back}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Counter card · {p.code}</h1>
              <p className="mt-1 text-sm text-ink-3">
                QR opens <span className="break-all font-mono text-xs">{url}</span>
              </p>
            </div>
            <CardLayoutSwitch href={`/admin/partners/${p.id}/card`} layout={layout} />
          </div>
          {!redeemable && (
            <p role="alert" className="rounded-lg border border-clay/30 bg-clay-soft px-4 py-3 text-sm text-clay-dark">
              {p.code} only redeems at checkout once this partner is Gifted or Active (now: {p.status}). Update the status
              before handing out cards.
            </p>
          )}
          <p className="text-xs text-ink-3">
            In the print dialog choose paper size {layout === "sheet" ? "A4" : "A6"}, margins None and scale 100%.
            {layout === "sheet" && " Cut along the grey lines."}
            {disclose ? " The card carries the referral-fee disclosure the FTC requires." : ""}
          </p>
        </>
      }
    />
  );
}
