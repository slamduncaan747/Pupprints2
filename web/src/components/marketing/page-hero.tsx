import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** Left padding that lines text up with the 1440px container even when a split hero runs full-bleed. */
export const BLEED_PAD_LEFT = "lg:pl-[max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]";
export const BLEED_PAD_RIGHT = "lg:pr-[max(2.5rem,calc((100vw_-_1440px)/2_+_2.5rem))]";

/**
 * Top of every secondary page: a `.label` kicker (eyebrow or breadcrumbs), one Bodoni headline and
 * a short intro. Without `media` the headline runs large across the page with the intro set off to
 * the right (or centered with `align="center"`). With `media` the hero splits in two: a campaign
 * image running to the edge of the screen on one side, the text on the other.
 */
export function PageHero({
  eyebrow,
  breadcrumbs,
  title,
  lede,
  children,
  media,
  mediaSide = "right",
  mediaFirst = false,
  mediaPanel = false,
  align = "left",
  className,
}: {
  eyebrow?: string;
  breadcrumbs?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** Small extras under the intro: a price, a grey note, a text link, one button. */
  children?: ReactNode;
  media?: ReactNode;
  mediaSide?: "left" | "right";
  /** On phones, show the image above the text (product pages). */
  mediaFirst?: boolean;
  /** Set the media on an ivory panel, like product photography (for framed art). */
  mediaPanel?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  const kicker = breadcrumbs ?? (eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null);

  if (media) {
    const left = mediaSide === "left";
    return (
      <section className={cn("flex flex-col lg:grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2", className)}>
        <div
          className={cn(
            "relative min-w-0",
            mediaFirst ? "order-1" : "order-2",
            left ? "lg:order-1" : "lg:order-2",
            mediaPanel && "flex items-center justify-center bg-paper-2 px-[16%] py-16 sm:py-24 lg:px-[12%]",
          )}
        >
          {media}
        </div>
        <div
          className={cn(
            "flex min-w-0 flex-col justify-center px-5 sm:px-10 lg:py-24",
            mediaFirst ? "order-2 pb-16 pt-10 sm:pb-20 sm:pt-14" : "order-1 pb-14 pt-12 sm:pb-16 sm:pt-20",
            left ? `lg:order-2 lg:pl-16 xl:pl-24 ${BLEED_PAD_RIGHT}` : `lg:order-1 lg:pr-16 xl:pr-24 ${BLEED_PAD_LEFT}`,
          )}
        >
          {kicker && <div className="mb-8 lg:mb-12">{kicker}</div>}
          <h1 className="max-w-2xl font-display text-[42px] leading-[1.02] tracking-[-0.02em] sm:text-[60px] xl:text-[72px]">
            {title}
          </h1>
          {lede && <div className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-[16px]">{lede}</div>}
          {children && <div className="mt-9">{children}</div>}
        </div>
      </section>
    );
  }

  if (align === "center") {
    return (
      <section className={cn("pb-20 pt-16 text-center sm:pb-28 sm:pt-28", className)}>
        <Container>
          {kicker && <div className="mb-8 flex justify-center sm:mb-12">{kicker}</div>}
          <h1 className="mx-auto max-w-5xl font-display text-[46px] leading-[1] tracking-[-0.02em] sm:text-[80px] lg:text-[108px]">
            {title}
          </h1>
          {lede && (
            <div className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-ink-2 sm:mt-10 sm:text-[16px]">{lede}</div>
          )}
          {children && <div className="mt-9 flex flex-col items-center">{children}</div>}
        </Container>
      </section>
    );
  }

  return (
    <section className={cn("pb-20 pt-14 sm:pb-28 sm:pt-24", className)}>
      <Container>
        {kicker && <div className="mb-8 sm:mb-12">{kicker}</div>}
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-10">
          <h1 className="font-display text-[44px] leading-[1] tracking-[-0.02em] sm:text-[72px] lg:col-span-8 lg:text-[88px]">
            {title}
          </h1>
          {lede && (
            <div className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-2 sm:text-[16px] lg:col-span-4 lg:col-start-9 lg:mt-0 lg:pb-2">
              {lede}
            </div>
          )}
        </div>
        {children && <div className="mt-10 sm:mt-14">{children}</div>}
      </Container>
    </section>
  );
}
