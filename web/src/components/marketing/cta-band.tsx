import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { site } from "@/lib/config";
import { STYLE_SAMPLES } from "@/lib/samples";
import { CampaignImage } from "@/components/marketing/campaign";
import { BLEED_PAD_RIGHT } from "@/components/marketing/page-hero";
import { cn } from "@/lib/utils";

/**
 * The one call to action at the end of a page: a short line and a single black button to /create.
 * Pass `image` (a style) for a split composition with an example portrait.
 */
export function CtaBand({
  eyebrow,
  title = "Start with a photo.",
  body,
  href = "/create",
  cta = site.cta,
  note,
  image,
  rule = true,
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  body?: ReactNode;
  href?: string;
  cta?: string;
  note?: ReactNode;
  image?: StyleSlug;
  /** Hairline above the band; turn off when it follows an ivory section. */
  rule?: boolean;
}) {
  const text = (
    <>
      {eyebrow && <p className="label mb-8 text-ink-3">{eyebrow}</p>}
      <h2 className="max-w-3xl font-display text-[36px] leading-[1.08] tracking-[-0.015em] text-balance sm:text-[56px]">
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
      <section className={cn("lg:grid lg:grid-cols-2", rule && "border-t border-line")}>
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
        <div className={cn("flex flex-col items-center py-24 text-center sm:py-36", rule && "border-t border-line")}>{text}</div>
      </Container>
    </section>
  );
}
