import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FormatShowcase } from "@/components/marketing/format-showcase";
import { PROMISES } from "@/lib/catalog";

/**
 * The pieces, all showing the same portrait, so the eye compares canvas, frame, paper and file rather
 * than four different dogs.
 */
export function Pieces() {
  return (
    <section aria-labelledby="pieces-title" className="bg-paper-2 py-24 sm:py-36">
      <Container>
        <div className="mb-12 max-w-xl sm:mb-16">
          <p className="label text-ink-3">Same portrait, four ways</p>
          <h2 id="pieces-title" className="mt-5 font-display text-[34px] leading-[1.04] sm:text-[48px]">
            Choose the piece after you&apos;ve seen the art.
          </h2>
        </div>

        <FormatShowcase variant="compact" backdrop={false} />

        <div className="mt-14 flex flex-col gap-6 border-t border-ink/15 pt-6 sm:mt-20 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="max-w-md text-[13px] leading-relaxed text-ink-3">
            {PROMISES.digital}. {PROMISES.shipping}.
          </p>
          <Link href="/shop" className="link-cta shrink-0">
            Compare every size
          </Link>
        </div>
      </Container>
    </section>
  );
}
