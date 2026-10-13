import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, FileImage, Gift, HeartHandshake, Truck, UserCheck } from "lucide-react";
import { ADDONS, PRODUCT_MAP, PRODUCTS, PROMISES, STARTING_PHYSICAL_PRICE } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { ProductCard } from "@/components/marketing/product-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { FramedArt } from "@/components/marketing/framed-art";
import { PRODUCT_CONTENT } from "@/components/marketing/product-content";
import { CANADA_SHIPPING_LABEL, PHYSICAL_PRODUCTS, shipWindow } from "@/components/marketing/commerce";

export const metadata: Metadata = {
  title: "Custom Dog Portrait Prints, Framed Prints & Canvas",
  description: `Custom dog portraits as fine art prints, framed prints, gallery canvas or a digital file. Physical pieces from ${formatPrice(STARTING_PHYSICAL_PRICE)}, free US shipping, hi-res digital file included. Preview free first.`,
  alternates: { canonical: "/shop" },
};

/** All physical sizes, in catalog order of first appearance, sorted by area. */
const SIZES = [...new Set(PHYSICAL_PRODUCTS.flatMap((p) => p.variants.map((v) => v.label)))].sort((a, b) => {
  const area = (label: string) => {
    const v = PHYSICAL_PRODUCTS.flatMap((p) => p.variants).find((x) => x.label === label);
    return v ? v.widthIn * v.heightIn : 0;
  };
  return area(a) - area(b);
});

const INCLUDED = [
  { icon: FileImage, title: "The hi-res digital file", body: PROMISES.digital },
  { icon: Truck, title: "Free US shipping", body: "On every order, with tracking. No minimum, no surprise fees" },
  { icon: UserCheck, title: "A human check", body: "A person on our team checks your art before it's printed" },
  { icon: HeartHandshake, title: "Love-it guarantee", body: "Remake or full refund within 30 days of delivery" },
  { icon: Gift, title: "Gift Reveal", body: "Ordering a gift? Send a digital reveal the moment you order" },
];

export default function ShopPage() {
  const digital = PRODUCT_MAP.digital;
  return (
    <>
      <PageHero
        eyebrow="Prints, frames & canvas"
        title="Honest prices, gallery-quality pieces"
        lede={
          <p>
            Every portrait starts with a free preview of your dog. When you love it, choose how to hang it. US shipping is
            free on every order, and the hi-res digital file is included with every physical piece.
          </p>
        }
        actions={
          <>
            <ButtonLink href="/create" variant="accent" size="lg">
              Start with a free preview <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#prices" variant="secondary" size="lg">
              Compare sizes &amp; prices
            </ButtonLink>
          </>
        }
        aside={
          <div className="relative mx-auto grid max-w-[520px] grid-cols-[1.15fr_0.85fr] items-end gap-5 rounded-[2rem] bg-paper-2 p-8 sm:gap-7 sm:p-10">
            <FramedArt style="oil-classic" finish="canvas" priority sizes="(max-width: 1024px) 45vw, 22vw" />
            <div className="space-y-5 sm:space-y-7">
              <FramedArt style="royal" finish="black" sizes="(max-width: 1024px) 30vw, 14vw" />
              <FramedArt style="watercolor" finish="oak" sizes="(max-width: 1024px) 30vw, 14vw" />
            </div>
          </div>
        }
      />

      <Section className="pt-6 sm:pt-10">
        <Container>
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => (
              <li key={p.type}>
                <ProductCard product={p} style={PRODUCT_CONTENT[p.type].exampleStyle} priority={i < 2} />
              </li>
            ))}
          </ul>
          <p className="mt-14 text-center text-[15px] text-ink-2">
            Every style works on every product.{" "}
            <Link href="/styles" className="font-medium text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
              Browse styles
            </Link>
          </p>
        </Container>
      </Section>

      <Section id="prices" className="scroll-mt-20 bg-paper-2">
        <Container>
          <SectionHeading
            eyebrow="Every size, every price"
            title="The price you see is the price you pay"
            subtitle={`No fake "compare at" prices, no countdown timers, no pre-checked add-ons. US shipping is included in every price below.`}
          />
          <div className="mt-14 overflow-x-auto rounded-card bg-paper ring-1 ring-line">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">Prices by size and product</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="px-5 py-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-3 sm:px-7">
                    Size
                  </th>
                  {PHYSICAL_PRODUCTS.map((p) => (
                    <th key={p.type} scope="col" className="px-4 py-5 text-right sm:px-7">
                      <Link href={`/shop/${p.type}`} className="font-display text-lg font-normal hover:text-clay-dark sm:text-xl">
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {SIZES.map((size) => (
                  <tr key={size}>
                    <th scope="row" className="px-5 py-4 font-display text-xl font-normal sm:px-7">
                      {size}
                    </th>
                    {PHYSICAL_PRODUCTS.map((p) => {
                      const v = p.variants.find((x) => x.label === size);
                      return (
                        <td key={p.type} className="px-4 py-4 text-right text-[17px] sm:px-7">
                          {v ? formatPrice(v.price) : <span className="text-ink-3" aria-label="Not available">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line bg-paper-2/50">
                  <th scope="row" className="px-5 py-4 text-left text-sm font-medium sm:px-7">
                    Arrives in (US)
                  </th>
                  {PHYSICAL_PRODUCTS.map((p) => (
                    <td key={p.type} className="px-4 py-4 text-right text-sm text-ink-2 sm:px-7">
                      {shipWindow(p)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-6 flex flex-col gap-4 rounded-card bg-paper p-6 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="font-display text-xl">
                {digital.name} · {formatPrice(digital.variants[0].price)}
              </p>
              <p className="mt-1 text-[15px] text-ink-2">
                Just want the file? Delivered instantly by email. It&apos;s free with any print, framed print or canvas.
              </p>
            </div>
            <ButtonLink href="/shop/digital" variant="secondary" className="self-start sm:self-auto">
              Digital details
            </ButtonLink>
          </div>
          <p className="mt-6 text-center text-sm text-ink-3">
            Prices in USD. Shipping to Canada is a flat {CANADA_SHIPPING_LABEL} per order.{" "}
            <Link href="/shipping" className="underline underline-offset-4 hover:text-ink">
              Shipping details
            </Link>
          </p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow className="mb-4">Included, always</Eyebrow>
            <h2 className="font-display text-4xl leading-[1.05] sm:text-5xl">What comes with every physical piece</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              No upsell needed for the things that should simply be part of buying art.
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {INCLUDED.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 ring-1 ring-line">
                  <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-ink-2">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {ADDONS.length > 0 && (
        <Section className="bg-paper-2 py-16 sm:py-20">
          <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <Eyebrow className="mb-4">Optional extras</Eyebrow>
              <h2 className="font-display text-3xl leading-tight sm:text-4xl">The same portrait, on a little something extra</h2>
              <p className="mt-4 text-ink-2">
                When you order a print, framed print or canvas, you can add matching pieces. They&apos;re never pre-checked;
                add them only if you want them.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {ADDONS.map((a) => (
                <li key={a.id} className="rounded-card bg-paper p-6 ring-1 ring-line">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-xl">{a.name}</p>
                    <p className="font-medium">{formatPrice(a.price)}</p>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{a.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 rounded-card bg-paper p-0 sm:grid-cols-3">
            {[
              { icon: Clock, title: "Made to order", body: "Each piece is printed for you after a person on our team checks it." },
              { icon: Truck, title: "Tracked to your door", body: "We email a tracking link as soon as your order ships." },
              { icon: Check, title: "Simple if something's wrong", body: "Damaged in transit? Send us a photo and we'll replace it free." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="border-t border-line pt-6">
                <Icon className="h-5 w-5 text-clay" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow="It starts with a photo"
        title="Pick the frame later. Meet the portrait first."
        body="Upload a photo of your dog and see your portrait free in about a minute. Then choose a print, frame or canvas."
        cta="Start with a free preview"
      />
    </>
  );
}
