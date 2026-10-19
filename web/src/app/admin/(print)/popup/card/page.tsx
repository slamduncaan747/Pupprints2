import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { qrSvg, qrSvgDataUrl } from "@/components/admin/partner-qr";
import { CardLayoutSwitch, CardPages, CounterCard, cardLayout } from "@/components/admin/counter-card";
import { isoDay, withPopupUtm } from "@/components/admin/popup";
import { ADMIN_TZ } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Pop-up cards", robots: { index: false, follow: false } };

/**
 * Code-free cards for pop-up walk-ins: the same A6 counter card as partners get, with a QR to the
 * home page tagged utm_source=popup&utm_medium=card&utm_campaign=<today> and no discount or
 * partner line.
 */
export default async function PopupCardPage({ searchParams }: PageProps<"/admin/popup/card">) {
  const sp = await searchParams;
  const layout = cardLayout(sp.layout);
  const day = isoDay(new Date(), ADMIN_TZ);
  const url = withPopupUtm(`${site.url.replace(/\/$/, "")}/`, "card", day);
  const qr = qrSvgDataUrl(await qrSvg(url));
  const host = new URL(site.url).host;
  const card = <CounterCard qr={qr} qrAlt={`QR code linking to ${host}`} />;

  return (
    <CardPages
      layout={layout}
      card={card}
      toolbar={
        <>
          <Link href="/admin/popup" className="text-sm text-ink-3 hover:text-ink">
            ← Pop-up
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Pop-up cards · {day}</h1>
              <p className="mt-1 text-sm text-ink-3">
                QR opens <span className="break-all font-mono text-xs">{url}</span>
              </p>
            </div>
            <CardLayoutSwitch href="/admin/popup/card" layout={layout} />
          </div>
          <p className="text-xs text-ink-3">
            No code and no discount: hand these to people you meet so they can make their own portrait later. The QR
            carries today&apos;s date, so print a fresh batch on the day you hand them out. In the print dialog choose
            paper size {layout === "sheet" ? "A4" : "A6"}, margins None and scale 100%.
            {layout === "sheet" && " Cut along the grey lines."}
          </p>
        </>
      }
    />
  );
}
