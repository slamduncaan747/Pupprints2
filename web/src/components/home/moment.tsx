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
  const dog = photo.key === "dogAndPortrait";
  const line = dog ? "Some love needs a wall." : "Made to hang.";

  return (
    <figure className="m-0">
      <Photo
        photo={photo}
        ratio={null}
        sizes="100vw"
        // Phones: a touch squarer than the 3:2 scene. Desktop: most of the first screen.
        className="aspect-[4/3] md:aspect-auto md:h-[min(80svh,60vw)] md:min-h-[460px]"
      />
      {/* The line belongs to the picture: a caption set directly beneath it, not a headline. */}
      <figcaption className="mx-auto flex max-w-[1440px] items-baseline justify-between gap-6 px-5 pt-4 sm:px-10 sm:pt-5">
        <p className="font-display text-[22px] leading-[1.15] sm:text-[28px]">{line}</p>
        <p className="label hidden text-ink-3 sm:block">{dog ? "An example portrait" : "Example portraits"}</p>
      </figcaption>
    </figure>
  );
}
