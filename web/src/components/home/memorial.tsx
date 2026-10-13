import Link from "next/link";
import { ArrowRight, Camera, Clock, Send } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { STYLE_SAMPLES } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { Framed } from "./framed";
import { Accent, HomeHeading } from "./typography";
import styles from "./home.module.css";

/** Gentle styles suited to remembrance (all tagged "memorial" in the catalog). */
const MEMORIAL: StyleSlug[] = ["watercolor", "botanical", "oil-classic", "charcoal"];

const POINTS = [
  {
    icon: Camera,
    title: "Older or imperfect photos welcome",
    body: "Upload the one you love, even if it's a little soft. You'll see the result before you pay.",
  },
  {
    icon: Clock,
    title: "Priority handling",
    body: "Memorial orders move to the front of the line, at no extra cost.",
  },
  {
    icon: Send,
    title: "A gentle way to say “I'm sorry”",
    body: "Send one to a grieving friend with a Gift Reveal they can open in their own time.",
  },
];

export function Memorial() {
  const items = MEMORIAL.map((slug) => STYLE_MAP[slug]);

  return (
    <Section aria-labelledby="memorial-title" className="relative overflow-hidden bg-sage-soft">
      <Container className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className={styles.reveal}>
          <HomeHeading
            id="memorial-title"
            tone="sage"
            eyebrow="In loving memory"
            title={
              <>
                For the ones who are <Accent>always with us.</Accent>
              </>
            }
            subtitle="A portrait can hold a whole life's worth of love. Our gentlest styles are made for remembering: soft, quiet, and unmistakably them."
          />
          <ul className="mt-9 space-y-6">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/70 text-moss ring-1 ring-moss/10">
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-lg leading-snug text-moss">{title}</p>
                  <p className="mt-0.5 text-[15.5px] leading-relaxed text-moss/80">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href="/create?occasion=memorial"
              className="group inline-flex h-13 w-full select-none items-center justify-center gap-2 whitespace-nowrap rounded-full bg-moss px-8 text-base font-medium text-white shadow-[0_6px_20px_-8px_rgb(47_74_58/0.6)] transition-all duration-200 hover:bg-[#263d30] active:scale-[0.98] sm:w-auto"
            >
              Create a memorial portrait
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/gifts/memorial"
              className="inline-flex items-center justify-center gap-1.5 text-[15px] font-medium text-moss underline decoration-moss/30 underline-offset-[6px] transition hover:decoration-moss"
            >
              About memorial portraits
            </Link>
          </div>
        </div>

        <div className={cn("relative", styles.reveal)}>
          <ul className="mx-auto grid max-w-[520px] grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10">
            {items.map((s, i) => (
              <li key={s.slug} className={cn(i % 2 === 1 && "translate-y-8 sm:translate-y-12")}>
                <Framed frame={i === 2 ? "oak" : "white"} thin>
                  <SampleImage
                    src={STYLE_SAMPLES[s.slug]}
                    alt={`${s.name} memorial portrait example`}
                    swatch={s.swatch}
                    sizes="(max-width: 640px) 45vw, 240px"
                  />
                </Framed>
                <p className="mt-3 text-center font-display text-[15px] text-moss">{s.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
