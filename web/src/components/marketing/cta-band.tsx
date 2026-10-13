import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { CampaignImage } from "@/components/marketing/campaign";
import { BLEED_PAD_RIGHT } from "@/components/marketing/page-hero";
import { cn } from "@/lib/utils";

export const PROMISE_LINE = "Free preview · Love-it guarantee · Free US shipping";

/**
 * The one call to action at the end of a page: a Bodoni line and a single black button. Always
 * points at the free preview. Pass `image` (a style) for a split composition with a campaign portrait.
 */
export function CtaBand({
  eyebrow = "Commission",
  title = "See your dog as a work of art",
  body,
  href = "/create",
  cta = "Commission a portrait",
  note = PROMISE_LINE,
  image,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  href?: string;
  cta?: string;
  note?: ReactNode;
  image?: StyleSlug;
}) {
  const text = (
    <>
      {eyebrow && <p className="label mb-8 text-ink-3">{eyebrow}</p>}
      <h2 className="max-w-3xl font-display text-[40px] leading-[1.02] tracking-[-0.02em] text-balance sm:text-[64px] lg:text-[76px]">
        {title}
      </h2>
      {body && <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-2">{body}</p>}
      <ButtonLink href={href} size="lg" className="mt-10 w-full sm:w-auto">
        {cta}
      </ButtonLink>
      {note && <p className="label mt-7 text-ink-3">{note}</p>}
    </>
  );

  if (image) {
    const s = STYLE_MAP[image];
    return (
      <section className="border-t border-line lg:grid lg:grid-cols-2">
        <CampaignImage
          src={STYLE_SAMPLES[image]}
          alt={`Example ${s.name} dog portrait`}
          swatch={s.swatch}
          fill
        />
        <div
          className={cn(
            "flex flex-col items-start justify-center px-5 py-20 sm:px-10 sm:py-28 lg:py-32 lg:pl-20 xl:pl-28",
            BLEED_PAD_RIGHT,
          )}
        >
          {text}
        </div>
      </section>
    );
  }

  return (
    <section>
      <Container>
        <div className="flex flex-col items-center border-t border-line py-28 text-center sm:py-40">{text}</div>
      </Container>
    </section>
  );
}
