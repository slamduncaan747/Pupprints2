import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FormatShowcase } from "@/components/marketing/format-showcase";
import { PROMISES } from "@/lib/catalog";

/**
 * The pieces, all showing the same portrait, so the eye compares canvas, frame, paper and file rather
 * than four different dogs. Edge to edge, like the product grid of a fashion house.
 */
export function Pieces() {
  return (
    <section aria-labelledby="pieces-title" className="bg-paper-2 py-24 sm:py-36">
      <Container>
        <div className="mb-14 max-w-2xl sm:mb-20">
          <p className="label text-ink-3">Same portrait, four ways</p>
          <h2 id="pieces-title" className="mt-6 font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[64px]">
            Choose the piece after you&apos;ve seen the art.
          </h2>
        </div>
      </Container>

      <FormatShowcase variant="compact" backdrop={false} />

      <Container>
        <div className="mt-16 flex flex-col gap-6 border-t border-ink/15 pt-6 sm:mt-24 sm:flex-row sm:items-baseline sm:justify-between">
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
