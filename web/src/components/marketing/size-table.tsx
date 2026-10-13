import type { Product } from "@/lib/catalog";
import { formatPrice, cn } from "@/lib/utils";
import { sizeUse, variantDims } from "@/components/marketing/commerce";

/** Size/price table for a product type. Prices come straight from the catalog; US shipping is free. */
export function SizeTable({ product, className }: { product: Product; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-card bg-white/70 ring-1 ring-line", className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{product.name} sizes and prices</caption>
        <thead>
          <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-ink-3">
            <th scope="col" className="px-5 py-4 font-semibold sm:px-6">Size</th>
            <th scope="col" className="hidden px-5 py-4 font-semibold sm:table-cell">Good for</th>
            <th scope="col" className="px-5 py-4 text-right font-semibold sm:px-6">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {product.variants.map((v) => {
            const dims = variantDims(v);
            const pick = v.id === product.defaultVariantId && product.variants.length > 1;
            return (
              <tr key={v.id} className={cn(pick && "bg-butter-soft/50")}>
                <th scope="row" className="px-5 py-4 align-top font-normal sm:px-6">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl">{v.label}</span>
                    {pick && (
                      <span className="rounded-full bg-butter px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#5c430c]">
                        Our pick
                      </span>
                    )}
                  </span>
                  {dims && <span className="mt-0.5 block text-sm text-ink-3">{dims.cm}</span>}
                  <span className="mt-1 block text-sm text-ink-2 sm:hidden">{sizeUse(v)}</span>
                </th>
                <td className="hidden px-5 py-4 align-top text-[15px] text-ink-2 sm:table-cell">{sizeUse(v)}</td>
                <td className="px-5 py-4 text-right align-top font-display text-xl sm:px-6">{formatPrice(v.price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
