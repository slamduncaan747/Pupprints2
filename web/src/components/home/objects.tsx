import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FrameMockup } from "@/components/product/frame-mockup";
import { SampleImage } from "@/components/ui/sample-image";
import { PRODUCTS, PROMISES, STYLE_MAP, type Product, type ProductType, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { formatPrice } from "@/lib/utils";

/** Which portrait each object is shown with. */
const SHOWN: Record<ProductType, StyleSlug> = {
  canvas: "oil-classic",
  framed: "charcoal",
  poster: "fine-line",
  digital: "watercolor",
};

/** 4:5, the shape of every sample portrait, so nothing is cropped. */
const PRINT_SIZE = { widthIn: 8, heightIn: 10 };

/** "From $59", or the single price when there is only one. Always from the catalog. */
function price(product: Product) {
  const low = Math.min(...product.variants.map((v) => v.price));
  return product.variants.length > 1 ? `From ${formatPrice(low)}` : formatPrice(low);
}

/** The four pieces, presented as objects on an ivory wall: name and price beneath, nothing else. */
export function Objects() {
  return (
    <section aria-labelledby="objects-title" className="bg-paper-2 py-24 sm:py-36">
      <Container>
        <div className="text-center">
          <p className="label text-ink-3">Canvas &amp; prints</p>
          <h2 id="objects-title" className="mt-4 font-display text-[34px] sm:text-[48px]">
            Made to be kept.
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:mt-20 sm:gap-x-10 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-12">
          {PRODUCTS.map((product) => {
            const style = STYLE_MAP[SHOWN[product.type]];
            const src = STYLE_SAMPLES[style.slug];
            const alt = `${product.name}, ${style.name} portrait`;
            return (
              <li key={product.type}>
                <Link href={`/shop/${product.type}`} className="group flex flex-col items-center text-center">
                  <div className="flex aspect-[4/5] w-full items-center justify-center">
                    {product.type === "digital" ? (
                      <SampleImage
                        src={src}
                        alt={alt}
                        swatch={style.swatch}
                        sizes="(min-width: 1440px) 250px, (min-width: 1024px) 18vw, 40vw"
                        className="w-[82%] ring-1 ring-ink/10"
                      />
                    ) : (
                      <FrameMockup
                        src={src}
                        alt={alt}
                        productType={product.type}
                        frameColor="black"
                        printSize={PRINT_SIZE}
                        className="w-[86%] max-w-none transition-opacity duration-500 group-hover:opacity-90"
                      />
                    )}
                  </div>
                  <p className="label mt-5 sm:mt-6">{product.shortName}</p>
                  <p className="label mt-1.5 tabular-nums text-ink-3">{price(product)}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-16 max-w-md text-center text-[13px] leading-relaxed text-ink-3 sm:mt-24">
          {PROMISES.digital}. {PROMISES.shipping}.
        </p>
      </Container>
    </section>
  );
}
