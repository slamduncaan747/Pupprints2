import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { PROMISES, STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { Framed, type FrameKind } from "./framed";
import { Accent } from "./typography";

const WALL: { slug: StyleSlug; frame: FrameKind; cls: string }[] = [
  { slug: "pop-art", frame: "white", cls: "left-[3%] top-[18%] w-[11%] -rotate-[5deg]" },
  { slug: "oil-classic", frame: "gold", cls: "left-[9%] bottom-[12%] w-[9%] rotate-[4deg]" },
  { slug: "admiral", frame: "black", cls: "right-[4%] top-[14%] w-[10%] rotate-[5deg]" },
  { slug: "botanical", frame: "oak", cls: "right-[10%] bottom-[10%] w-[10%] -rotate-[3deg]" },
];

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="grain relative overflow-hidden bg-ink text-paper">
      {/* A few portraits hung around the edges on wide screens */}
      <div aria-hidden="true" className="absolute inset-0 hidden xl:block">
        {WALL.map((w) => (
          <div key={w.slug} className={cn("absolute opacity-90", w.cls)}>
            <Framed frame={w.frame} thin>
              <SampleImage src={STYLE_SAMPLES[w.slug]} alt="" swatch={STYLE_MAP[w.slug].swatch} sizes="160px" />
            </Framed>
          </div>
        ))}
      </div>

      <Container className="relative py-24 text-center sm:py-32">
        <div className="ph-reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-butter">Your turn</p>
          <h2
            id="final-title"
            className="mx-auto mt-5 max-w-3xl font-display text-[2.9rem] leading-[1] tracking-[-0.035em] sm:text-6xl lg:text-[5rem]"
          >
            Ready to meet <Accent className="text-butter">the masterpiece?</Accent>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[17px] leading-relaxed text-paper/70 sm:text-lg">
            Upload a photo and see your portrait in about a minute. It&apos;s free, and there&apos;s no card needed.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4">
            <ButtonLink href="/create" variant="light" size="xl" className="group w-full sm:w-auto">
              Create your portrait
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
            <p className="text-sm text-paper/55">
              {PROMISES.guarantee} · {PROMISES.shipping}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto mt-16 flex max-w-2xl flex-col items-center gap-5 border-t border-white/10 pt-12 sm:mt-20",
            "ph-reveal",
          )}
        >
          <div>
            <p className="font-display text-2xl">Not today? Take 10% off for later.</p>
            <p className="mt-1.5 text-[15px] text-paper/60">
              One email with your code, plus new styles and holiday shipping dates. No spam.
            </p>
          </div>
          <NewsletterForm source="home" dark cta="Get 10% off" className="mx-auto" />
        </div>
      </Container>
    </section>
  );
}
