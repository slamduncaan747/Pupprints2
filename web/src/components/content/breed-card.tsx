import Link from "next/link";
import { STYLE_MAP } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Breed } from "@/content/types";
import { breedSample } from "@/content/breeds";
import { SampleImage } from "@/components/ui/sample-image";

/** Breed tile for image grids: the breed's sample portrait and its name. */
export function BreedCard({
  breed,
  className,
  priority,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 270px",
}: {
  breed: Breed;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const sample = breedSample(breed);
  return (
    <article className={cn("group", className)}>
      <Link href={`/breeds/${breed.slug}`} className="block">
        <SampleImage
          src={sample.src}
          alt={sample.alt}
          swatch={STYLE_MAP[sample.style].swatch}
          sizes={sizes}
          priority={priority}
          className="transition-opacity duration-300 group-hover:opacity-90"
        />
        <h3 className="mt-3 font-display text-[19px] leading-tight sm:text-[21px]">{breed.name}</h3>
      </Link>
    </article>
  );
}
