import { ArrowRight, Check, Clock, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLES, STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { SHIP_WINDOW } from "./data";
import { Framed } from "./framed";
import { Accent, HomeHeading } from "./typography";

const FAN: StyleSlug[] = ["watercolor", "royal", "pop-art"];

function UploadVisual() {
  const photo = BEFORE_AFTER[1];
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 w-[44%] -translate-x-1/2 -translate-y-[55%] -rotate-[4deg] bg-white p-2 pb-7 shadow-frame">
        <SampleImage src={photo.before} alt={`A phone photo of a ${photo.dog}`} swatch="#a5978a" sizes="160px" />
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium shadow-soft ring-1 ring-line">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-moss text-white">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
        </span>
        Photo added
      </div>
    </div>
  );
}

function StyleVisual() {
  return (
    <div className="relative h-full w-full">
      {FAN.map((slug, i) => {
        const s = STYLE_MAP[slug];
        const isCenter = i === 1;
        return (
          <div
            key={slug}
            className={cn(
              "absolute top-1/2 bg-white p-1.5 shadow-soft",
              isCenter
                ? "left-1/2 z-10 w-[36%] -translate-x-1/2 -translate-y-[56%] shadow-frame"
                : i === 0
                  ? "left-[14%] w-[29%] -translate-y-[50%] -rotate-[9deg]"
                  : "right-[14%] w-[29%] -translate-y-[50%] rotate-[9deg]",
            )}
          >
            <SampleImage src={STYLE_SAMPLES[slug]} alt={`${s.name} style example`} swatch={s.swatch} sizes="140px" />
          </div>
        );
      })}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper shadow-soft">
        {STYLE_MAP[FAN[1]].name}
      </div>
    </div>
  );
}

function ShipVisual() {
  const s = STYLE_MAP["oil-classic"];
  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-1/2 w-[38%] -translate-x-1/2 -translate-y-[56%]">
        <Framed frame="black" thin>
          <SampleImage src={STYLE_SAMPLES["oil-classic"]} alt={`${s.name} portrait in a black frame`} swatch={s.swatch} sizes="140px" />
        </Framed>
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium shadow-soft ring-1 ring-line">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-clay text-white">
          <Truck className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
        </span>
        Checked, framed, on its way
      </div>
    </div>
  );
}

const STEPS: { title: string; time: string; body: string; visual: ReactNode }[] = [
  {
    title: "Upload a photo",
    time: "10 seconds",
    body: "Any clear phone photo will do. Face visible, eyes bright, decent light. That's the whole brief.",
    visual: <UploadVisual />,
  },
  {
    title: "Pick a style, see it instantly",
    time: "About a minute",
    body: `Watch your dog appear in any of our ${STYLES.length} styles. Try them all, as often as you like. Still free.`,
    visual: <StyleVisual />,
  },
  {
    title: "We print, frame & ship",
    time: `${SHIP_WINDOW[0]}–${SHIP_WINDOW[1]} business days`,
    body: "A real person checks every portrait. Then it's printed on archival paper and sent to your door, ready to hang.",
    visual: <ShipVisual />,
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" aria-labelledby="how-title" className="bg-paper-2">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between ph-reveal">
          <HomeHeading
            id="how-title"
            eyebrow="How it works"
            title={
              <>
                From camera roll to <Accent>gallery wall.</Accent>
              </>
            }
            subtitle="No waiting days for a proof. No paying to see it. You see your portrait first, then decide."
          />
          <ButtonLink href="/how-it-works" variant="secondary" className="self-start lg:self-auto">
            The details <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>

        <ol className="mt-12 grid gap-5 sm:mt-16 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex flex-col overflow-hidden rounded-card bg-paper ring-1 ring-line ph-reveal"
            >
              <div className="relative h-56 bg-[radial-gradient(120%_100%_at_50%_0%,var(--color-paper),var(--color-paper-3))] sm:h-60">
                {step.visual}
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-[15px] text-clay-dark">
                    Step {i + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-2 px-2.5 py-1 text-xs font-medium text-ink-2">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {step.time}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl leading-tight">{step.title}</h3>
                <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3 text-center ph-reveal">
          <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
            Start with a photo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </ButtonLink>
          <p className="text-sm text-ink-2/85">Free to preview. You only pay if you love it.</p>
        </div>
      </Container>
    </Section>
  );
}
