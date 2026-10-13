import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PawMark } from "@/components/ui/paw";
import { SampleImage } from "@/components/ui/sample-image";
import { STYLE_MAP } from "@/lib/catalog";
import { site } from "@/lib/config";
import { GALLERY } from "@/lib/samples";
import { cn } from "@/lib/utils";
import { Accent, HomeHeading } from "./typography";
import styles from "./home.module.css";

const handle = `@${site.social.instagram.replace(/\/+$/, "").split("/").pop()}`;

/**
 * Launch-honest social proof: no reviews yet, so we say so, and show clearly-labelled
 * example portraits with an invitation to tag us. Swap in real customer photos/reviews later.
 */
export function Founding() {
  return (
    <Section aria-labelledby="founding-title" className="bg-paper-2">
      <Container className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className={styles.reveal}>
          <HomeHeading
            id="founding-title"
            eyebrow="Founding customers"
            title={
              <>
                We&apos;re new. <Accent>You get our full attention.</Accent>
              </>
            }
            subtitle="You won't find a wall of five-star quotes here yet, and we won't fake one. What you will find: every order personally checked before it prints, and a small team that makes things right."
          />
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
            Be one of our first customers, then tag <span className="font-medium text-ink">{handle}</span>. We&apos;d
            love to see your dog on the wall (literally).
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <ButtonLink href="/create" size="lg" className="group w-full sm:w-auto">
              Create your portrait
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1 text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink"
            >
              Follow {handle} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className={cn("rounded-[1.75rem] bg-paper p-4 shadow-soft ring-1 ring-line sm:p-6", styles.reveal)}>
          {/* Profile-style header (no follower counts: we don't fabricate numbers) */}
          <div className="flex items-center justify-between gap-4 px-1 pb-4 sm:pb-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[conic-gradient(from_200deg,var(--color-butter),var(--color-clay),var(--color-blush),var(--color-butter))] p-[2px]">
                <span className="grid h-full w-full place-items-center rounded-full bg-paper">
                  <PawMark className="h-5 w-5 text-clay" />
                </span>
              </span>
              <div>
                <p className="text-[15px] font-semibold leading-tight">{handle}</p>
                <p className="text-[13px] text-ink-3">Example portraits from our studio</p>
              </div>
            </div>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-ink/90"
            >
              Follow
            </a>
          </div>
          <ul className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-xl sm:gap-2">
            {GALLERY.map((g) => {
              const s = STYLE_MAP[g.style];
              return (
                <li key={g.src} className="group relative">
                  <SampleImage
                    src={g.src}
                    alt={`Example: ${g.dog} in the ${s.name} style`}
                    swatch={s.swatch}
                    sizes="(max-width: 1024px) 33vw, 200px"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-medium leading-tight text-white">
                    {g.dog} · {s.name}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="px-1 pt-4 text-center text-[13px] text-ink-3">
            Examples made by our studio to show each style. Real customer photos coming soon.
          </p>
        </div>
      </Container>
    </Section>
  );
}
