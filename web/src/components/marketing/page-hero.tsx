import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/**
 * Top of every secondary page: breadcrumbs or an eyebrow, one serif headline and a short intro
 * (two sentences at most). Pass `media` (one large portrait) to show it beside the text on desktop
 * and below it on phones.
 */
export function PageHero({
  eyebrow,
  breadcrumbs,
  title,
  lede,
  children,
  media,
  className,
}: {
  eyebrow?: string;
  breadcrumbs?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  /** Small extras under the intro: a price, a grey note, a text link. */
  children?: ReactNode;
  media?: ReactNode;
  className?: string;
}) {
  const kicker = breadcrumbs ?? (eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null);
  return (
    <section className={cn("pb-16 pt-12 sm:pb-24 sm:pt-20", className)}>
      <Container
        className={cn(media && "grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-20")}
      >
        <div className="min-w-0">
          {kicker && <div className="mb-6 sm:mb-8">{kicker}</div>}
          <h1 className="max-w-4xl font-display text-[2.75rem] leading-[1.02] tracking-[-0.015em] sm:text-6xl lg:text-[4.5rem]">
            {title}
          </h1>
          {lede && <div className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2 sm:text-lg">{lede}</div>}
          {children && <div className="mt-8">{children}</div>}
        </div>
        {media && <div className="min-w-0">{media}</div>}
      </Container>
    </section>
  );
}
