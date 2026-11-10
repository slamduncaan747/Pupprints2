import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FormatShowcase } from "@/components/marketing/format-showcase";

/**
 * The four formats with their prices, all showing the same portrait, so the eye compares canvas,
 * frame, paper and file rather than four different dogs.
 */
export function Pieces() {
  return (
    <section aria-labelledby="pieces-title" className="bg-paper-2 py-24 sm:py-36">
      <Container>
        <h2
          id="pieces-title"
          className="mb-10 max-w-2xl font-display text-[34px] leading-[1.08] tracking-[-0.015em] sm:mb-14 sm:text-[52px]"
        >
          Print, framed, canvas or digital.
        </h2>
      </Container>

      <FormatShowcase variant="compact" backdrop={false} />

      <Container>
        <Link href="/shop" className="link-cta mt-12 inline-block sm:mt-16">
          All sizes and prices
        </Link>
      </Container>
    </section>
  );
}
