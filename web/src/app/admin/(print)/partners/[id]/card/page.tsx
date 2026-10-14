import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { site } from "@/lib/config";
import { db } from "@/lib/supabase/server";
import type { PartnerRow } from "@/lib/partners";
import { REDEEMABLE_STATUSES } from "@/components/partners/program";
import { partnerQrUrl, qrSvg, qrSvgDataUrl } from "@/components/admin/partner-qr";
import { PrintButton } from "@/components/admin/print-button";
import { DbMissing, adminButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Counter card", robots: { index: false, follow: false } };

type Layout = "a6" | "sheet";

/** A6 (105 × 148 mm) counter card for groomers, vets and breeders: wordmark, one line, QR, code. */
function CounterCard({
  qr,
  code,
  discount,
  partnerName,
  disclose,
}: {
  qr: string;
  code: string;
  discount: number;
  partnerName: string;
  disclose: boolean;
}) {
  const host = new URL(site.url).host;
  return (
    <div className="flex h-[148mm] w-[105mm] flex-col items-center bg-white px-[10mm] pb-[7mm] pt-[11mm] text-center text-ink">
      <p className="font-display text-[19pt] uppercase leading-none tracking-[0.16em]">Pup Prints</p>
      <p className="mt-[7mm] max-w-[72mm] font-display text-[15pt] leading-[1.2]">See your dog as a work of art — free</p>
      {/* SVG data URL: stays vector in print. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt={`QR code linking to ${host} with code ${code}`} className="mt-[5mm] h-[50mm] w-[50mm]" />
      <p className="text-[6.5pt] font-medium uppercase tracking-[0.2em] text-ink-2">Scan to see yours</p>
      <div className="mt-auto w-full border-t border-ink/15 pt-[4mm]">
        <p className="text-[9pt] uppercase tracking-[0.14em]">
          {discount > 0 ? (
            <>
              {discount}% off with code <span className="font-semibold">{code}</span>
            </>
          ) : (
            <>
              Use code <span className="font-semibold">{code}</span> at checkout
            </>
          )}
        </p>
        <p className="mt-[1.5mm] text-[7pt] tracking-[0.06em] text-ink-2">{host}</p>
        {disclose && <p className="mt-[2.5mm] text-[6pt] leading-snug text-ink-3">{partnerName} earns a referral fee from Pup Prints orders.</p>}
      </div>
    </div>
  );
}

export default async function PartnerCardPage({ params, searchParams }: PageProps<"/admin/partners/[id]/card">) {
  const { id } = await params;
  const sp = await searchParams;
  if (!z.uuid().safeParse(id).success) notFound();
  const layout: Layout = sp.layout === "sheet" ? "sheet" : "a6";
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

  if (!p.code) {
    return (
      <main className="mx-auto max-w-3xl space-y-3 p-6">
        {back}
        <p className="text-sm text-ink-2">Generate a code on the partner page first; the card prints their code and QR.</p>
      </main>
    );
  }

  const url = partnerQrUrl(p.code, p.niche);
  const qr = qrSvgDataUrl(await qrSvg(url));
  const redeemable = (REDEEMABLE_STATUSES as readonly string[]).includes(p.status);
  // FTC: a business that earns a fee for recommending us must say so on the card itself.
  const disclose = Number(p.commission_rate) > 0;
  const card = <CounterCard qr={qr} code={p.code} discount={p.discount_percent} partnerName={partnerName} disclose={disclose} />;

  return (
    <>
      <style>{`
        @page { size: ${layout === "sheet" ? "A4" : "A6"}; margin: 0; }
        @media print {
          html, body { background: #fff !important; }
          .pp-sheet { box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>
      <div className="bg-paper-2 print:bg-white">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 print:hidden">
          {back}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Counter card · {p.code}</h1>
              <p className="mt-1 text-sm text-ink-3">
                QR opens <span className="break-all font-mono text-xs">{url}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/admin/partners/${p.id}/card`}
                aria-current={layout === "a6" ? "page" : undefined}
                className={adminButton(layout === "a6" ? "primary" : "secondary")}
              >
                A6 · 1 per page
              </Link>
              <Link
                href={`/admin/partners/${p.id}/card?layout=sheet`}
                aria-current={layout === "sheet" ? "page" : undefined}
                className={adminButton(layout === "sheet" ? "primary" : "secondary")}
              >
                A4 · 4 per sheet
              </Link>
              <PrintButton />
            </div>
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
        </div>

        {layout === "a6" ? (
          <div className="pp-sheet mx-auto mb-10 w-[105mm] shadow-[0_10px_40px_rgba(0,0,0,0.12)] print:mb-0">{card}</div>
        ) : (
          <div className="pp-sheet mx-auto mb-10 grid h-[297mm] w-[210mm] grid-cols-2 grid-rows-2 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] print:mb-0">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center border-dashed border-[#c8c8c8]",
                  i % 2 === 0 && "border-r-[0.2mm]",
                  i < 2 && "border-b-[0.2mm]",
                )}
              >
                {card}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
