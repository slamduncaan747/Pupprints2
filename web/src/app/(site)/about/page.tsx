import type { Metadata } from "next";
import { STYLE_MAP } from "@/lib/catalog";
import { GALLERY } from "@/lib/samples";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Prose, Rows } from "@/components/marketing/blocks";
import { CampaignImage } from "@/components/marketing/campaign";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "About",
  description: "Pup Prints makes portraits of dogs from a photo. Who we are and how we work.",
  alternates: { canonical: "/about" },
};

const HOW = [
  { title: "Dogs only", body: "Every style is designed around what makes a dog recognizable: the ears, the markings, the eyes." },
  { title: "You see it first", body: "The portrait is made before you order, so you know what you are buying." },
  { title: "Plain prices", body: "The price shown is the price charged. No sales that never end, nothing added for you." },
  { title: "How it is made", body: "By our AI artist, from your photo, and finished by our team. It is not painted by hand." },
  { title: "Replies", body: "Write to us and a person answers within one business day." },
];

export default function AboutPage() {
  const triptych = GALLERY.slice(0, 3);
  return (
    <>
      <PageHero
        align="center"
        title="About"
        lede="Pup Prints is a new, small company. We make portraits of dogs from a photo."
      />

      {triptych.length > 0 && (
        <section aria-label="Portraits from the collection">
          <ul className="grid grid-cols-2 gap-0.5 md:grid-cols-3">
            {triptych.map((g, i) => {
              const style = STYLE_MAP[g.style];
              return (
                <li key={g.src} className={i === 0 ? "col-span-2 md:col-span-1" : undefined}>
                  <CampaignImage
                    src={g.src}
                    alt={`${style.name} portrait of a ${g.dog}`}
                    swatch={style.swatch}
                    priority={i === 0}
                    sizes={i === 0 ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <Block title="How we work" className="pt-20 sm:pt-28">
        <Rows items={HOW} />
      </Block>

      <Block title="Rescues">
        <Prose>
          <p>
            We plan to support dog rescues and shelters once we are up and running. When we do, the details will be here.
          </p>
        </Prose>
      </Block>

      <CtaBand />
    </>
  );
}
