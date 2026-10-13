import { Gift } from "lucide-react";
import type { StyleSlug } from "@/lib/catalog";
import { FramedArt } from "@/components/marketing/framed-art";
import { cn } from "@/lib/utils";

/** Illustrative phone showing what a Gift Reveal looks like to the recipient. */
export function GiftRevealMock({ style = "royal", className }: { style?: StyleSlug; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[300px]", className)} aria-hidden="true">
      <div className="rounded-[2.6rem] bg-ink p-3 shadow-frame">
        <div className="overflow-hidden rounded-[2rem] bg-paper">
          <div className="flex h-7 items-center justify-center">
            <span className="h-1.5 w-14 rounded-full bg-ink/15" />
          </div>
          <div className="px-5 pb-6 pt-2 text-center">
            <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-clay-soft">
              <Gift className="h-4 w-4 text-clay-dark" />
            </span>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">A gift for you</p>
            <p className="mt-1 font-display text-xl leading-tight">Someone made you something</p>
            <div className="mx-auto mt-5 w-[72%]">
              <FramedArt style={style} finish="black" sizes="200px" />
            </div>
            <p className="mt-5 text-[12px] leading-relaxed text-ink-2">Your framed portrait is being printed and is on its way to you.</p>
            <span className="mt-4 inline-flex h-9 items-center rounded-full bg-ink px-5 text-[12px] font-medium text-paper">
              See your portrait
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
