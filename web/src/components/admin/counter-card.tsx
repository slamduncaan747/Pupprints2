import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/config";
import { PrintButton } from "@/components/admin/print-button";
import { adminButton } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/**
 * Printable A6 counter cards (partner counters and pop-up walk-ins): one card per A6 page, or four
 * per A4 sheet with cut lines. Shared by /admin/partners/[id]/card and /admin/popup/card.
 */
export type CardLayout = "a6" | "sheet";

export function cardLayout(value: string | string[] | undefined): CardLayout {
  return value === "sheet" ? "sheet" : "a6";
}

/** A6 (105 × 148 mm): wordmark, one line, QR, then an optional offer line, the host and fine print. */
export function CounterCard({ qr, qrAlt, line, fine }: { qr: string; qrAlt: string; line?: ReactNode; fine?: ReactNode }) {
  const host = new URL(site.url).host;
  return (
    <div className="flex h-[148mm] w-[105mm] flex-col items-center bg-white px-[10mm] pb-[7mm] pt-[11mm] text-center text-ink">
      <p className="font-display text-[19pt] uppercase leading-none tracking-[0.16em]">Pup Prints</p>
      <p className="mt-[7mm] max-w-[72mm] text-balance font-display text-[15pt] leading-[1.2]">See your dog as a work of art — free</p>
      {/* SVG data URL: stays vector in print. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qr} alt={qrAlt} className="mt-[5mm] h-[50mm] w-[50mm]" />
      <p className="text-[6.5pt] font-medium uppercase tracking-[0.2em] text-ink-2">Scan to see yours</p>
      <div className="mt-auto w-full border-t border-ink/15 pt-[4mm]">
        {line ? (
          <>
            <p className="text-[9pt] uppercase tracking-[0.14em]">{line}</p>
            <p className="mt-[1.5mm] text-[7pt] tracking-[0.06em] text-ink-2">{host}</p>
          </>
        ) : (
          <p className="text-[9pt] uppercase tracking-[0.14em]">{host}</p>
        )}
        {fine && <p className="mt-[2.5mm] text-[6pt] leading-snug text-ink-3">{fine}</p>}
      </div>
    </div>
  );
}

/** "A6 · 1 per page" / "A4 · 4 per sheet" switch plus the print button. `href` is the card page. */
export function CardLayoutSwitch({ href, layout }: { href: string; layout: CardLayout }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={href} aria-current={layout === "a6" ? "page" : undefined} className={adminButton(layout === "a6" ? "primary" : "secondary")}>
        A6 · 1 per page
      </Link>
      <Link
        href={`${href}?layout=sheet`}
        aria-current={layout === "sheet" ? "page" : undefined}
        className={adminButton(layout === "sheet" ? "primary" : "secondary")}
      >
        A4 · 4 per sheet
      </Link>
      <PrintButton />
    </div>
  );
}

/** The print page: a screen-only toolbar, then the card on A6 or four of it on an A4 sheet. */
export function CardPages({ layout, toolbar, card }: { layout: CardLayout; toolbar: ReactNode; card: ReactNode }) {
  return (
    <>
      {/* Explicit mm sizes: Chrome ignores the A6 keyword. Heights a hair under the page avoid a blank spill page. */}
      <style>{`
        @page { size: ${layout === "sheet" ? "210mm 297mm" : "105mm 148mm"}; margin: 0; }
        @media print {
          html, body, body > div { background: #fff !important; min-height: 0 !important; height: auto !important; }
          .pp-sheet { box-shadow: none !important; margin: 0 !important; overflow: hidden; height: ${layout === "sheet" ? "296.5mm" : "147.5mm"} !important; }
        }
      `}</style>
      <div className="bg-paper-2 print:bg-white">
        <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 print:hidden">{toolbar}</div>

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
