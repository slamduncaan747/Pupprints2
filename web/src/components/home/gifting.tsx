import Link from "next/link";
import { Photo } from "@/components/marketing/photo";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { BLEED_PAD_LEFT } from "@/components/marketing/page-hero";
import { campaign } from "@/lib/campaign";
import { cn } from "@/lib/utils";

/**
 * "Give it now": the Gift Reveal, the one thing a gift from a typical portrait shop can't do.
 * The gift scene runs to the right edge of the screen; the text says it once and links to the guide.
 */
export function Gifting() {
  const photo = campaign("gift");
  return (
    <section aria-labelledby="gifting-title" className="md:grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center">
      <Photo
        photo={photo}
        ratio="4 / 5"
        sizes="(min-width: 768px) 42vw, 100vw"
        className="md:order-2"
      />
      <div className={cn("px-5 pb-24 pt-12 sm:px-10 sm:pb-28 sm:pt-16 md:py-24 md:pr-16 xl:pr-24", BLEED_PAD_LEFT)}>
        <p className="label text-ink-3">The Gift Reveal</p>
        <h2
          id="gifting-title"
          className="mt-6 max-w-lg font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[56px] xl:text-[68px]"
        >
          Give it today.
        </h2>
        <p className="mt-7 max-w-sm text-[15px] leading-relaxed text-ink-2">
          Order a portrait as a gift and a digital reveal is theirs the same moment: by text, by email, or on your phone
          across the table. The piece follows in <span className="whitespace-nowrap">{PHYSICAL_SHIP_WINDOW}</span>.
        </p>
        <Link href="/gifts" className="link-cta mt-9 inline-block text-ink">
          The gift guide
        </Link>
      </div>
    </section>
  );
}
