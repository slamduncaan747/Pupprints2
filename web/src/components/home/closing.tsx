import { Container } from "@/components/ui/container";
import { OfferCta } from "@/components/marketing/offer";
import { GUARANTEE } from "@/lib/offer";

/** The last word before the footer: one line, one button, the effort line and the guarantee. */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="py-28 sm:py-44">
      <Container className="flex flex-col items-center text-center">
        <h2 id="closing-title" className="font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[72px]">
          Begin with a photograph.
        </h2>
        <OfferCta className="mt-10 w-full sm:mt-12 sm:w-auto" align="center" />
        <p className="mt-10 text-[13px] text-ink-3">{GUARANTEE.short}.</p>
      </Container>
    </section>
  );
}
