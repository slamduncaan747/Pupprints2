import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { PRODUCTS, PRODUCT_MAP, STYLE_MAP, type Product, type ProductType } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { formatPrice } from "@/lib/utils";

/** "black, white or oak", straight from the catalog so we never show a finish we don't sell. */
function listWords(words: string[]) {
  return words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} or ${words[words.length - 1]}`;
}

const LINES: Record<ProductType, string> = {
  canvas: "Hand-stretched and gallery-wrapped, ready to hang.",
  framed: `Solid wood frame in ${listWords(PRODUCT_MAP.framed.frameColors ?? [])}.`,
  poster: "Archival matte paper, ready for your own frame.",
  digital: "The full-resolution file. Free with every print.",
};

function price(product: Product) {
  const low = Math.min(...product.variants.map((v) => v.price));
  return product.variants.length > 1 ? `from ${formatPrice(low)}` : formatPrice(low);
}

/** A framed portrait on a plain wall, and the price list beside it. */
export function Products() {
  const shown = STYLE_MAP["oil-classic"];

  return (
    <section aria-labelledby="products-title" className="pb-24 sm:pb-32">
      <Container>
        <div className="flex items-baseline justify-between gap-6 border-t border-line pt-6">
          <h2 id="products-title" className="font-display text-4xl sm:text-5xl">
            Prints &amp; frames
          </h2>
          <Link
            href="/shop"
            className="text-[13px] text-ink-3 underline underline-offset-4 transition-colors hover:text-ink"
          >
            Sizes &amp; prices
          </Link>
        </div>

        <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="grid aspect-square place-items-center bg-paper-2 sm:aspect-[4/5] lg:col-span-5">
            <div className="frame-black w-[46%] sm:w-[54%]">
              <SampleImage
                src={STYLE_SAMPLES[shown.slug]}
                alt={`A ${shown.name} portrait in a thin black frame`}
                swatch={shown.swatch}
                sizes="(min-width: 1024px) 240px, 50vw"
              />
            </div>
          </div>

          <ul className="border-t border-line lg:col-span-6 lg:col-start-7">
            {PRODUCTS.map((product) => (
              <li key={product.type} className="border-b border-line">
                <Link href={`/shop/${product.type}`} className="group flex items-baseline justify-between gap-6 py-6">
                  <span>
                    <span className="block font-display text-[28px] leading-tight underline-offset-4 group-hover:underline">
                      {product.name}
                    </span>
                    <span className="mt-1.5 block text-pretty text-[14px] leading-relaxed text-ink-3">{LINES[product.type]}</span>
                  </span>
                  <span className="shrink-0 text-[15px] tabular-nums text-ink-2">{price(product)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
