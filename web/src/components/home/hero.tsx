import { ArrowRight, CreditCard, Heart, Sparkles, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { BEFORE_AFTER, STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { BeforeAfter } from "./before-after";
import { Framed } from "./framed";
import { Accent } from "./typography";
import styles from "./home.module.css";

const TRUST = [
  { icon: Sparkles, label: "Free preview" },
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

      <Container className="relative grid items-center gap-10 pb-16 pt-8 sm:pt-14 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-24 lg:pt-16">
        {/* Copy */}
        <div className="max-w-xl">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/70 py-1.5 pl-2 pr-3.5 text-[13px] text-ink-2 ring-1 ring-line backdrop-blur">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-clay-soft text-clay-dark">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
            </span>
            Custom dog portraits, from your photo
          </p>

          <h1
            id="hero-title"
            className="mt-6 animate-fade-up font-display text-[2.9rem] leading-[0.98] tracking-[-0.035em] [animation-delay:80ms] sm:text-6xl lg:text-[5.1rem]"
          >
            Your dog, as a <Accent className="text-clay-dark">work of art.</Accent>
          </h1>

          <p className="mt-6 max-w-lg animate-fade-up text-[17px] leading-relaxed text-ink-2 [animation-delay:160ms] sm:text-xl sm:leading-relaxed">
            Upload a photo and meet your portrait in about a minute,{" "}
            <span className="font-medium text-ink">free, before you pay a thing.</span> Love it? We print it, frame it
            and send it to your door in days.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center">
            <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
              <span className="sm:hidden">Create your portrait — free</span>
              <span className="hidden sm:inline">Create your portrait — it&apos;s free to preview</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="#styles" variant="ghost" size="lg" className="w-full underline-offset-4 hover:underline sm:w-auto">
              See the styles
            </ButtonLink>
          </div>

          <ul className="mt-8 grid animate-fade-up grid-cols-2 gap-x-4 gap-y-3 text-[13.5px] text-ink-2 [animation-delay:320ms] sm:flex sm:flex-wrap sm:gap-x-6">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-clay-dark" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Art: before/after in an oak frame, two portraits hung behind */}
        <div className="relative mx-auto w-full max-w-[400px] animate-fade-up [animation-delay:200ms] sm:max-w-[480px] lg:max-w-[540px]">
          <div className="relative aspect-[1/1.1]">
            {/* Gallery arch */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[9%] bottom-[6%] top-0 rounded-t-full bg-gradient-to-b from-paper-2 to-paper-3/60"
            />

            <div className={cn("absolute left-0 top-[13%] w-[34%] -rotate-[7deg]", styles.driftSlow)}>
              <Framed frame="white" thin>
                <SampleImage
                  src={STYLE_SAMPLES.watercolor}
                  alt={`Example ${left.name} portrait`}
                  swatch={left.swatch}
                  sizes="180px"
                />
              </Framed>
            </div>
            <div className={cn("absolute right-0 top-[34%] w-[32%] rotate-[6deg]", styles.drift)}>
              <Framed frame="black" thin>
                <SampleImage
                  src={STYLE_SAMPLES.admiral}
                  alt={`Example ${right.name} portrait`}
                  swatch={right.swatch}
                  sizes="180px"
                />
              </Framed>
            </div>

            <div className="absolute left-1/2 top-[5%] z-10 w-[66%] -translate-x-1/2">
              <Framed frame="oak">
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
                <p className="mt-0.5 text-[11px] text-ink-3">
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
