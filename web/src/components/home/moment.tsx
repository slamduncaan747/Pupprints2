import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";

/**
 * A campaign moment between the pieces and the offer: one full-bleed scene and one short line, no
 * call to action. The dog-and-portrait scene, or the gallery wall as a quieter interlude if that is
 * the one in place. Renders nothing until one of them exists (a portrait cropped to 3:2 would not do).
 */
export function Moment() {
  const photo = [campaign("dogAndPortrait"), campaign("galleryWall")].find((p) => p.live);
  if (!photo) return null;
  const line = photo.key === "dogAndPortrait" ? "Some love needs a wall." : "Made to hang.";

  return (
    <figure aria-label={line} className="m-0">
      <Photo
        photo={photo}
        ratio={null}
        sizes="100vw"
        // Phones: a touch squarer than the 3:2 scene. Desktop: the first screen at most.
        className="aspect-[4/3] md:aspect-auto md:h-[min(92svh,66.67vw)] md:min-h-[480px]"
      />
      <figcaption className="px-5 pt-16 text-center sm:pt-24">
        <p className="font-display text-[34px] leading-[1.06] tracking-[-0.015em] sm:text-[52px]">{line}</p>
      </figcaption>
    </figure>
  );
}
