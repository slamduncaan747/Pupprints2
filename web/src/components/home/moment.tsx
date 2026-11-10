import { Photo } from "@/components/marketing/photo";
import { campaign } from "@/lib/campaign";

/**
 * One full-bleed picture between the formats and the last call to upload, with no words of its own:
 * the dog-and-portrait scene (web/public/campaign/dog-and-portrait.webp), or the gallery wall if
 * that is the one in place. Renders nothing until one of them exists.
 */
export function Moment() {
  const photo = [campaign("dogAndPortrait"), campaign("galleryWall")].find((p) => p.live);
  if (!photo) return null;

  return (
    <Photo
      photo={photo}
      ratio={null}
      sizes="100vw"
      // Phones: a touch squarer than the 3:2 scene. Desktop: most of the first screen.
      className="aspect-[4/3] md:aspect-auto md:h-[min(80svh,60vw)] md:min-h-[460px]"
    />
  );
}
