import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Breed } from "@/content/types";
import { breedSample } from "@/content/breeds";
import { FramedSample } from "@/components/content/framed-sample";

/** Breed tile linking to /breeds/[slug]. */
export function BreedCard({ breed, className, priority }: { breed: Breed; className?: string; priority?: boolean }) {
  const sample = breedSample(breed);
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative flex aspect-[5/6] items-center justify-center overflow-hidden rounded-card bg-paper-2 transition-colors duration-300 group-hover:bg-paper-3">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_30%,rgb(255_255_255/0.75),transparent_70%)]"
        />
        <FramedSample
          style={sample.style}
          src={sample.src}
          alt={sample.alt}
          priority={priority}
          sizes="(max-width: 640px) 32vw, (max-width: 1024px) 20vw, 13vw"
          className="relative w-[58%] transition-transform duration-500 group-hover:-translate-y-1"
        />
      </div>
      <h3 className="mt-4 font-display text-xl leading-tight text-ink sm:text-[1.35rem]">
        <Link href={`/breeds/${breed.slug}`} className="after:absolute after:inset-0 hover:text-clay-dark">
          {breed.name}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-2">{breed.personality}</p>
    </article>
  );
}
