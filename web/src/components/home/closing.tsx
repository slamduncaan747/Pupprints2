import { Container } from "@/components/ui/container";
import { OfferCta } from "@/components/marketing/offer";

/** The last word before the footer: one line and the button. */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="py-24 sm:py-36">
      <Container className="flex flex-col items-center text-center">
        <h2 id="closing-title" className="font-display text-[36px] leading-[1.08] tracking-[-0.015em] sm:text-[56px]">
          Start with a photo.
        </h2>
        <OfferCta className="mt-8 w-full sm:mt-10 sm:w-auto" align="center" />
      </Container>
    </section>
  );
}
