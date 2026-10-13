import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const LINKS = [
  { href: "/styles", label: "Browse styles" },
  { href: "/shop", label: "Prints & canvas" },
  { href: "/gifts", label: "Gift ideas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
];

/** Paw prints trotting off the edge of the page (after a squirrel, presumably). */
function PawTrail() {
  const steps = [
    { x: 30, y: 150, r: -20 },
    { x: 78, y: 122, r: 10 },
    { x: 128, y: 136, r: -15 },
    { x: 176, y: 104, r: 12 },
    { x: 226, y: 116, r: -10 },
    { x: 274, y: 82, r: 15 },
    { x: 322, y: 92, r: -8 },
  ];
  return (
    <svg viewBox="0 0 360 180" className="h-auto w-full max-w-[420px]" aria-hidden="true">
      {steps.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y}) rotate(${s.r + 70})`} className="text-clay" fill="currentColor" opacity={0.85 - i * 0.13}>
          <ellipse cx="0" cy="5" rx="8" ry="6.5" />
          <ellipse cx="-8" cy="-5" rx="3" ry="4" />
          <ellipse cx="-3" cy="-10" rx="3" ry="4" />
          <ellipse cx="3" cy="-10" rx="3" ry="4" />
          <ellipse cx="8" cy="-5" rx="3" ry="4" />
        </g>
      ))}
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="flex flex-col items-center py-20 text-center sm:py-28">
          <PawTrail />
          <Eyebrow className="mt-8">Error 404</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-[2.6rem] leading-[1.03] sm:text-6xl">
            This page wandered off chasing a squirrel
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            We couldn&apos;t find what you were looking for. It may have moved, or the link might be a little off. Let&apos;s
            get you back on the trail.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/create" variant="accent" size="lg">
              Create your free preview <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="lg">
              Back to home
            </ButtonLink>
          </div>
          <nav aria-label="Helpful links" className="mt-12">
            <ul className="flex flex-wrap justify-center gap-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex rounded-full bg-paper-2 px-4 py-2 text-sm text-ink-2 ring-1 ring-line hover:bg-paper-3 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </main>
      <Footer />
    </>
  );
}
