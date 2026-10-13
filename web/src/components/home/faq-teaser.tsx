import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { PRODUCT_MAP, SHIPPING_RATES } from "@/lib/catalog";
import { site } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import { fromPrice } from "./data";
import { Accent, HomeHeading } from "./typography";

const days = (t: "poster" | "framed" | "canvas") => PRODUCT_MAP[t].shipDays.join("–");

const FAQS = [
  {
    q: "How long does it take?",
    a: `Your preview appears in about a minute. Digital files arrive right after checkout. Fine art prints arrive in ${days("poster")} business days, and framed prints and canvas in ${days("framed")}, with free US shipping.`,
  },
  {
    q: "What photo works best?",
    a: "A clear, well-lit photo where you can see your dog's face and eyes. Shoot at their eye level in natural light, skip heavy filters, and fill the frame. A good phone photo is perfect.",
  },
  {
    q: "What if I don't love it?",
    a: "You see your portrait before you pay, and you can try every style as often as you like. If the finished piece still isn't right, we'll remake it free or refund you in full. That's our Love-it guarantee.",
  },
  {
    q: "Is the digital file included?",
    a: `Yes. Every canvas, framed print and fine art print comes with the full-resolution digital file, free. Want only the file? It's ${formatPrice(fromPrice(PRODUCT_MAP.digital))} on its own.`,
  },
  {
    q: "Do you ship outside the US?",
    a: `We ship to the US & Canada for now. US shipping is free on every order; Canada is a flat ${formatPrice(SHIPPING_RATES.CA)}. More countries soon.`,
  },
];

export function FaqTeaser() {
  return (
    <Section aria-labelledby="faq-title" className="bg-paper">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start ph-reveal">
          <HomeHeading
            id="faq-title"
            eyebrow="Good questions"
            title={
              <>
                The short <Accent>answers.</Accent>
              </>
            }
            subtitle={
              <>
                Something else on your mind? Read the{" "}
                <Link href="/faq" className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
                  full FAQ
                </Link>{" "}
                or write to{" "}
                <a
                  href={`mailto:${site.supportEmail}`}
                  className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
                >
                  {site.supportEmail}
                </a>
                .
              </>
            }
          />
          <div className="mt-8 hidden lg:block">
            <ButtonLink href="/create" className="group">
              Try it free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="ph-reveal">
          <div className="divide-y divide-line border-y border-line">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-xl leading-snug transition-colors hover:text-clay-dark sm:text-[1.4rem] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-line transition-all duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-paper group-open:ring-ink">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </span>
                </summary>
                <p className="-mt-1 max-w-2xl pb-7 pr-12 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-[15px] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] transition hover:decoration-ink"
            >
              All questions <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="lg:hidden">
              <ButtonLink href="/create" className="group w-full sm:w-auto">
                Try it free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
