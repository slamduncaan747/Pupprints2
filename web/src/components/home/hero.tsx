import { ArrowRight, CreditCard, Eye, Heart, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PawMark } from "@/components/ui/paw";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { BeforeAfter } from "./before-after";
import { Framed } from "./framed";
import { Accent } from "./typography";

const TRUST = [
  { icon: Eye, label: "Free preview" },
  { icon: CreditCard, label: "No card needed" },
  { icon: Truck, label: "Free US shipping" },
  { icon: Heart, label: "Love-it guarantee" },
];

export function Hero() {
  const pair = BEFORE_AFTER[0];
  const style = STYLE_MAP[pair.style];
  const left = STYLE_MAP.watercolor;
  const right = STYLE_MAP.admiral;

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      {/* Warm light behind the art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-40 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgb(244_217_204/0.7),rgb(250_246_239/0))] lg:right-0 lg:top-10 lg:h-[820px] lg:w-[820px]"
      />

      <Container className="relative grid items-center gap-8 pb-12 pt-7 sm:gap-10 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_1.04fr] lg:gap-8 lg:pb-24 lg:pt-14">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/70 py-1.5 pl-2 pr-3.5 text-[13px] text-ink-2 ring-1 ring-line backdrop-blur">
            <PawMark className="h-5 w-5 text-clay" />
            Custom dog portraits, from your photo
          </p>

          <h1
            id="hero-title"
            className="mt-5 animate-fade-up font-display text-[2.85rem] leading-[0.98] tracking-[-0.035em] [animation-delay:80ms] sm:text-6xl lg:text-[5.1rem]"
          >
            Your dog, <br className="hidden sm:block" />
            as a <Accent className="text-clay-dark">work of art.</Accent>
          </h1>

          <p className="mt-5 max-w-lg animate-fade-up text-[16.5px] leading-relaxed text-ink-2 [animation-delay:160ms] sm:mt-6 sm:text-xl sm:leading-relaxed">
            Upload a photo and meet your portrait in about a minute,{" "}
            <span className="font-medium text-ink">free, before you pay a thing.</span> Love it? We print it, frame it
            and send it to your door in days.
          </p>

          <div className="mt-7 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:mt-8 sm:flex-row sm:items-center">
            <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
              <span className="sm:hidden">Create your portrait — free</span>
              <span className="hidden sm:inline">Create your portrait — it&apos;s free to preview</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
            <div className="hidden sm:block">
              <ButtonLink href="#styles" variant="secondary" size="lg">
                See the styles
              </ButtonLink>
            </div>
          </div>

          <ul className="mt-5 grid animate-fade-up grid-cols-2 gap-x-3 gap-y-2.5 text-[13.5px] text-ink-2 [animation-delay:320ms] sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-6">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-clay-dark" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Art: before/after in an oak frame, two portraits hung behind */}
        <div className="relative mx-auto w-full max-w-[400px] animate-fade-up [animation-delay:200ms] sm:max-w-[480px] lg:max-w-[580px]">
          <div className="relative aspect-[1/1.1]">
            {/* Gallery arch */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[10%] bottom-0 top-0 rounded-t-full bg-gradient-to-b from-paper-2 via-paper-2/80 to-paper-2/0"
            />

            <div className="absolute -left-[4%] top-[15%] w-[33%] -rotate-[7deg] sm:w-[35%] ph-drift-slow">
              <Framed frame="white" thin>
                <SampleImage
                  src={STYLE_SAMPLES.watercolor}
                  alt={`Example ${left.name} portrait`}
                  swatch={left.swatch}
                  sizes="180px"
                />
              </Framed>
            </div>
            <div className="absolute -right-[4%] top-[36%] w-[31%] rotate-[6deg] sm:w-[33%] ph-drift">
              <Framed frame="black" thin>
                <SampleImage
                  src={STYLE_SAMPLES.admiral}
                  alt={`Example ${right.name} portrait`}
                  swatch={right.swatch}
                  sizes="180px"
                />
              </Framed>
            </div>

            <div className="absolute left-1/2 top-[4%] z-10 w-[72%] -translate-x-1/2 sm:w-[64%]">
              <Framed frame="oak" className="p-[10px] sm:p-[14px]">
                <BeforeAfter
                  before={pair.before}
                  after={pair.after}
                  beforeAlt={`Original photo of a ${pair.dog}`}
                  afterAlt={`The same ${pair.dog} as a ${style.name} fine-art portrait`}
                  afterSwatch={style.swatch}
                  sizes="(max-width: 640px) 60vw, 360px"
                />
              </Framed>
              {/* Museum placard */}
              <div className="absolute -bottom-[3.75rem] right-[-4%] w-max rotate-[1.5deg] bg-white px-3.5 py-2.5 shadow-soft ring-1 ring-black/[0.04] sm:-bottom-16">
                <p className="font-display text-[15px] leading-tight">{style.name}</p>
                <p className="mt-0.5 text-[11px] text-ink-2/85">
                  {pair.dog} · drag to compare
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
