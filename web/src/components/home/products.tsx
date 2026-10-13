import Link from "next/link";
import { ArrowRight, Download, Gift } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { ADDONS, PRODUCT_MAP, PROMISES, STYLE_MAP, type Product, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn, formatPrice } from "@/lib/utils";
import { fromPrice, shipCopy, sizeRange } from "./data";
import { Framed } from "./framed";
import { Accent, HomeHeading } from "./typography";

const FRAME_SWATCH: Record<string, string> = {
  black: "#151311",
  white: "#fbfaf7",
  oak: "#c9a26f",
};

function Art({ slug, sizes }: { slug: StyleSlug; sizes: string }) {
  const s = STYLE_MAP[slug];
  return <SampleImage src={STYLE_SAMPLES[slug]} alt={`${s.name} portrait example`} swatch={s.swatch} sizes={sizes} />;
}

function PriceLine({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="text-sm text-ink-2/85">From</span>
      <span className="font-display text-[1.75rem] leading-none">{formatPrice(fromPrice(product))}</span>
      {product.type !== "digital" && (
        <span className={cn("text-sm text-ink-2/85", compact && "hidden xl:inline")}>· {sizeRange(product)}</span>
      )}
    </p>
  );
}

function FeatureCard({
  product,
  visual,
  wall,
  extra,
}: {
  product: Product;
  visual: ReactNode;
  wall: string;
  extra?: ReactNode;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-white ring-1 ring-line ph-reveal">
      <Link
        href={`/shop/${product.type}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("relative flex aspect-[4/3] items-center justify-center overflow-hidden pt-4", wall)}
      >
        {visual}
        {product.badge && (
          <Badge tone="ink" className="absolute left-5 top-5">
            {product.badge}
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[1.75rem] leading-tight">
              <Link href={`/shop/${product.type}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-2">{product.tagline}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-[14.5px] text-ink-2">
          {product.details.slice(0, 2).map((d) => (
            <li key={d} className="flex gap-2.5">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-clay" aria-hidden="true" />
              {d}
            </li>
          ))}
        </ul>
        {extra}
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
            <div>
              <PriceLine product={product} />
              <p className="mt-1.5 text-[13px] text-ink-2/85">{shipCopy(product.type)} · free US shipping</p>
            </div>
            <Link
              href={`/shop/${product.type}`}
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark transition-colors hover:text-ink"
            >
              Shop {product.shortName.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ product, visual, wall, note }: { product: Product; visual: ReactNode; wall: string; note: string }) {
  return (
    <article
      className="group grid grid-cols-[38%_1fr] overflow-hidden rounded-card bg-white ring-1 ring-line sm:grid-cols-[42%_1fr] ph-reveal"
    >
      <Link
        href={`/shop/${product.type}`}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("relative flex items-center justify-center overflow-hidden p-4", wall)}
      >
        {visual}
      </Link>
      <div className="flex flex-col p-5 sm:p-7">
        <h3 className="font-display text-[1.4rem] leading-tight sm:text-[1.6rem]">
          <Link href={`/shop/${product.type}`} className="hover:underline hover:decoration-1 hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{product.tagline}</p>
        <div className="mt-auto pt-4">
          <PriceLine product={product} compact />
          <p className="mt-1.5 text-[13px] text-ink-2/85">{note}</p>
          <Link
            href={`/shop/${product.type}`}
            className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-medium text-clay-dark transition-colors hover:text-ink"
          >
            Shop {product.shortName.toLowerCase()} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function Products() {
  const canvas = PRODUCT_MAP.canvas;
  const framed = PRODUCT_MAP.framed;
  const poster = PRODUCT_MAP.poster;
  const digital = PRODUCT_MAP.digital;
  const addonCopy = ADDONS.map((a) => `${a.name.replace(/^Matching /, "").toLowerCase()} (${formatPrice(a.price)})`).join(" or ");

  return (
    <Section aria-labelledby="products-title" className="bg-paper">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ph-reveal">
          <HomeHeading
            id="products-title"
            eyebrow="Canvas, prints & frames"
            title={
              <>
                Made to hang. <Accent>Built to last.</Accent>
              </>
            }
            subtitle={`Archival materials, honest prices and free US shipping on every order. ${PROMISES.digital}.`}
          />
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink lg:inline-flex"
          >
            Compare all formats <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-2 md:gap-6">
          <FeatureCard
            product={canvas}
            wall="bg-[linear-gradient(180deg,#ece3d4,#e2d6c3)]"
            visual={
              <div className="w-[38%] transition-transform duration-700 ease-out group-hover:-translate-y-1">
                <div className="canvas-wrap">
                  <Art slug="royal" sizes="(max-width: 768px) 46vw, 280px" />
                </div>
              </div>
            }
          />
          <FeatureCard
            product={framed}
            wall="bg-[linear-gradient(180deg,#f3e3d8,#ead3c5)]"
            visual={
              <div className="w-[40%] transition-transform duration-700 ease-out group-hover:-translate-y-1">
                <Framed frame="black">
                  <Art slug="watercolor" sizes="(max-width: 768px) 36vw, 220px" />
                </Framed>
              </div>
            }
            extra={
              framed.frameColors && (
                <div className="mt-5 flex items-center gap-2.5 text-[13px] text-ink-2/85">
                  <span className="flex -space-x-1">
                    {framed.frameColors.map((c) => (
                      <span
                        key={c}
                        title={c}
                        className="h-5 w-5 rounded-full ring-2 ring-white"
                        style={{ background: FRAME_SWATCH[c], boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)" }}
                      />
                    ))}
                  </span>
                  {framed.frameColors.join(", ").replace(/, ([^,]*)$/, " or $1")} frame
                </div>
              )
            }
          />
          <CompactCard
            product={poster}
            wall="bg-paper-2"
            note={`${shipCopy(poster.type)} · ready for your own frame`}
            visual={
              <div className="relative w-[80%] max-w-[170px] -rotate-2 bg-white p-[7%] shadow-soft transition-transform duration-700 group-hover:rotate-0">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-3deg] bg-butter/70"
                />
                <Art slug="fine-line" sizes="170px" />
              </div>
            }
          />
          <CompactCard
            product={digital}
            wall="bg-paper-2"
            note={`${shipCopy(digital.type)} · free with any print`}
            visual={
              <div className="relative w-[78%] max-w-[160px]">
                <div className="overflow-hidden rounded-lg shadow-soft ring-1 ring-black/5">
                  <Art slug="pop-art" sizes="160px" />
                </div>
                <span className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-paper shadow-soft">
                  <Download className="h-3 w-3" aria-hidden="true" /> Hi-res file
                </span>
              </div>
            }
          />
        </div>

        <div
          className="mt-6 flex flex-col items-start gap-5 rounded-card bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 ph-reveal"
        >
          <div className="flex gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-clay-dark ring-1 ring-line">
              <Gift className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-xl leading-snug">No need to choose a format yet.</p>
              <p className="mt-1 text-[15px] text-ink-2">
                See your portrait first, then pick canvas, frame or print. Add a matching {addonCopy} at checkout if
                you like.
              </p>
            </div>
          </div>
          <ButtonLink href="/create" className="group w-full shrink-0 sm:w-auto">
            Create your portrait
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
