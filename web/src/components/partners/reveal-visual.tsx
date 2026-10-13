import { Heart, MessageCircle, Send } from "lucide-react";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { PROGRAM } from "@/components/partners/program";

/**
 * Hero art for the creator page: a framed portrait on the wall and a phone showing
 * the kind of disclosed "reveal" post we hope creators make. Illustrative only:
 * the handle and caption are placeholders, not a real creator.
 */
export function RevealVisual() {
  const royal = STYLE_MAP.royal;
  const botanical = STYLE_MAP.botanical;
  return (
    <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[500px]" aria-hidden="true">
      <div className="relative aspect-[1/1.08]">
        <div className="absolute inset-x-[6%] bottom-[4%] top-0 rounded-t-full bg-gradient-to-b from-paper-2 to-paper-3/60" />

        {/* Framed portrait on the wall */}
        <div className="absolute left-[2%] top-[6%] w-[48%] -rotate-[4deg]">
          <div className="frame-wood">
            <div className="mat">
              <SampleImage src={STYLE_SAMPLES.botanical} alt="" swatch={botanical.swatch} sizes="240px" />
            </div>
          </div>
        </div>

        {/* Phone with a reveal post */}
        <div className="absolute right-[3%] top-[3%] w-[52%] rotate-[3deg] rounded-[2rem] bg-ink p-[7px] shadow-frame">
          <div className="overflow-hidden rounded-[1.6rem] bg-white">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="h-6 w-6 rounded-full bg-gradient-to-br from-butter to-clay" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[11px] font-semibold text-ink">yourdog</p>
                <p className="text-[9px] text-ink-3">Paid partnership with Pup Prints</p>
              </div>
            </div>
            <SampleImage src={STYLE_SAMPLES.royal} alt="" swatch={royal.swatch} label={royal.name} sizes="240px" />
            <div className="space-y-1.5 px-3 pb-3.5 pt-2.5">
              <div className="flex gap-2.5 text-ink">
                <Heart className="h-4 w-4" />
                <MessageCircle className="h-4 w-4" />
                <Send className="h-4 w-4" />
              </div>
              <p className="text-[10.5px] leading-snug text-ink-2">
                <span className="font-semibold text-ink">#ad</span> Her face when she saw herself as royalty. Code{" "}
                <span className="font-semibold text-ink">YOURDOG{PROGRAM.discountPercent}</span> for {PROGRAM.discountPercent}% off
              </p>
            </div>
          </div>
        </div>

        {/* Code ticket */}
        <div className="absolute bottom-[3%] left-0 z-10 -rotate-[2deg] rounded-xl bg-white px-3 py-2 shadow-soft ring-1 ring-line sm:px-4 sm:py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-clay sm:text-[10px]">Your code</p>
          <p className="mt-0.5 font-display text-lg leading-none sm:text-xl">YOURDOG{PROGRAM.discountPercent}</p>
          <p className="mt-1 hidden text-[11px] text-ink-3 sm:block">
            {PROGRAM.discountPercent}% off for them · {Math.round(PROGRAM.commissionRate * 100)}% for you
          </p>
        </div>
      </div>
    </div>
  );
}
