import { Container } from "@/components/ui/container";
import { FROM_PRICE, OfferCta, PriceAnchor, ValueStack } from "@/components/marketing/offer";

/**
 * The offer, stacked: everything a physical order includes, item by item, then the price, the honest
 * market anchor and the call to action. Ends on the guarantee (the last line of the stack).
 */
export function OfferStack() {
  return (
    <section aria-labelledby="offer-title" className="py-24 sm:py-36">
      <Container className="lg:grid lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <p className="label text-ink-3">Everything included</p>
          <h2 id="offer-title" className="mt-5 font-display text-[34px] leading-[1.04] sm:text-[48px]">
            One portrait. Everything it needs.
          </h2>
          <p className="mt-8 font-display text-[44px] leading-none tracking-[-0.02em] sm:mt-10 sm:text-[56px]">
            {FROM_PRICE}
          </p>
          <PriceAnchor className="mt-4 max-w-xs" />
        </div>

        <div className="mt-12 lg:col-span-7 lg:col-start-6 lg:mt-1.5">
          <ValueStack />
          <OfferCta className="mt-10" />
        </div>
      </Container>
    </section>
  );
}
