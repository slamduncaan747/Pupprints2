import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Facts } from "@/components/marketing/blocks";
import { FrameMockup } from "@/components/product/frame-mockup";
import { FROM_PRICE } from "@/components/marketing/offer";
import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";
import { findAddon } from "@/lib/catalog";
import { FORMAT_SHOWCASE, HEIRLOOM_SET, OFFER } from "@/lib/offer";
import { formatPrice } from "@/lib/utils";

/**
 * The premium option: the portrait plus both matching keepsakes, with the real bundle saving.
 * Every price is from the catalog; the saving is HEIRLOOM_SET.discountCents.
 */
export function Heirloom() {
  const addons = HEIRLOOM_SET.addonIds.map((id) => findAddon(id)).filter((a) => a !== undefined);
  if (addons.length < HEIRLOOM_SET.addonIds.length) return null;
  const together = HEIRLOOM_SET.addonsTotal - HEIRLOOM_SET.discountCents;
  const scene = campaign("heirloom");

  return (
    <section aria-labelledby="heirloom-title" className="py-24 sm:py-36">
      <Container className="grid gap-12 md:grid-cols-12 md:items-center md:gap-x-10">
        {scene.live ? (
          <Photo
            photo={scene}
            ratio={null}
            sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
            className="-mx-5 aspect-[4/5] sm:mx-0 md:col-span-6 lg:col-span-4 lg:col-start-2"
          />
        ) : (
          <div className="flex aspect-[5/4] items-center justify-center bg-paper-2 md:col-span-6 md:aspect-[4/5] lg:col-span-4 lg:col-start-2">
            <FrameMockup
              src={FORMAT_SHOWCASE.src}
              alt="The portrait in a natural oak frame"
              productType="framed"
              frameColor="oak"
              printSize={{ widthIn: 8, heightIn: 10 }}
              className="w-[40%] max-w-none md:w-[58%]"
            />
          </div>
        )}

        <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
          <p className="label text-ink-3">{HEIRLOOM_SET.name}</p>
          <h2 id="heirloom-title" className="mt-5 font-display text-[34px] leading-[1.04] sm:text-[48px]">
            The portrait, and two keepsakes to match.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-2">{HEIRLOOM_SET.line}</p>
          <Facts
            className="mt-10"
            items={[
              { key: "piece", label: "Your portrait", note: "Print, framed print or canvas", value: FROM_PRICE },
              ...addons.map((a) => ({ key: a.id, label: a.name, note: a.description, value: formatPrice(a.price) })),
              {
                key: "together",
                label: "Both keepsakes together",
                note: `Instead of ${formatPrice(HEIRLOOM_SET.addonsTotal)}`,
                value: formatPrice(together),
              },
            ]}
          />
          <p className="mt-6 text-[13px] leading-relaxed text-ink-3">
            Add them at checkout, after you&apos;ve seen your portrait. Never pre-selected.
          </p>
          <Link href="/create" className="link-cta mt-8 inline-block">
            {OFFER.cta}
          </Link>
        </div>
      </Container>
    </section>
  );
}
