import Link from "next/link";
import { Chapter } from "@/components/marketing/campaign";
import { Photo } from "@/components/marketing/photo";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";
import { campaign } from "@/lib/campaign";

/**
 * "Give it now": the Gift Reveal, the one thing a gift from a typical portrait shop can't do.
 * The gift scene runs to the edge of the screen; the text says it once and links to the gift guide.
 */
export function Gifting() {
  const photo = campaign("gift");
  return (
    <Chapter
      id="gifting"
      kicker="The Gift Reveal"
      title="Give it today."
      side="right"
      media={<Photo photo={photo} ratio="4 / 5" sizes="(min-width: 768px) 50vw, 100vw" />}
    >
      <p>
        Order a portrait as a gift and a digital reveal is theirs the same moment: by text, by email, or on your
        phone across the table. The piece follows in <span className="whitespace-nowrap">{PHYSICAL_SHIP_WINDOW}</span>.
      </p>
      <Link href="/gifts" className="link-cta mt-9 inline-block text-ink">
        The gift guide
      </Link>
    </Chapter>
  );
}
