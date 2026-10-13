import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { ButtonLink } from "@/components/ui/button";
import { Container, Eyebrow } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/styles", label: "Styles" },
  { href: "/shop", label: "Prints & canvas" },
  { href: "/gifts", label: "Gift ideas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <Container className="py-24 sm:py-36">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-display text-[2.75rem] leading-[1.02] tracking-[-0.015em] sm:text-6xl lg:text-[4.5rem]">
            This page wandered off chasing a squirrel
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2 sm:text-lg">
            It may have moved, or the link might be a little off. Let&apos;s get you back on the trail.
          </p>
          <ButtonLink href="/create" size="lg" className="mt-10">
            Create your portrait
          </ButtonLink>
          <nav aria-label="Helpful links" className="mt-16 border-t border-line pt-8">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
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
