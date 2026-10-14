import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FoundingGate, FoundingRemaining } from "@/components/marketing/offer-status";
import { FOUNDING_OFFER, OFFER } from "@/lib/offer";
import { FOUNDING, foundingOfferOpen } from "@/lib/launch";

/**
 * Real scarcity: the Founding 100 (a real cap and a real deadline, never extended). The live count
 * appears only when the API returns one; the band disappears once the offer closes.
 */
export function Founding() {
  if (!foundingOfferOpen()) return null;
  return (
    <FoundingGate>
      <section aria-labelledby="founding-title" className="bg-ink text-paper">
        <Container className="flex flex-col items-center py-24 text-center sm:py-32">
          <p className="label text-paper/70">Through {FOUNDING.deadlineLong}</p>
          <h2
            id="founding-title"
            className="mt-6 font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[64px] lg:text-[76px]"
          >
            {FOUNDING_OFFER.headline}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/80 sm:text-[16px]">{FOUNDING_OFFER.line}</p>
          <FoundingRemaining className="label mt-6 text-paper" />
          <Link href="/create" className="link-cta mt-10 text-paper">
            {OFFER.cta}
          </Link>
        </Container>
      </section>
    </FoundingGate>
  );
}
