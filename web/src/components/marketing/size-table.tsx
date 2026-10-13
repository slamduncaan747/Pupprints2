import type { Product } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { sizeUse, variantDims } from "@/components/marketing/commerce";

/** Size/price table for a product type. Prices come straight from the catalog; US shipping is free. */
export function SizeTable({ product, className }: { product: Product; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-left text-[16px]", className)}>
      <caption className="sr-only">{product.name} sizes and prices</caption>
      <thead>
        <tr className="border-b border-line text-[12px] uppercase tracking-[0.14em] text-ink-3">
          <th scope="col" className="pb-3 pr-4 font-medium">
            Size
          </th>
          <th scope="col" className="hidden pb-3 pr-4 font-medium sm:table-cell">
            Good for
          </th>
          <th scope="col" className="pb-3 text-right font-medium">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {product.variants.map((v) => {
          const dims = variantDims(v);
          return (
            <tr key={v.id} className="border-b border-line">
              <th scope="row" className="py-4 pr-4 align-top font-normal text-ink">
                {v.label}
                {dims && <span className="ml-2 text-[14px] text-ink-3">{dims.cm}</span>}
                <span className="mt-0.5 block text-[14px] text-ink-3 sm:hidden">{sizeUse(v)}</span>
              </th>
              <td className="hidden py-4 pr-4 align-top text-ink-2 sm:table-cell">{sizeUse(v)}</td>
              <td className="py-4 text-right align-top tabular-nums text-ink">{formatPrice(v.price)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
