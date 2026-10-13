import Link from "next/link";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { site, socialLinks } from "@/lib/config";

const LINKS = [
  { href: "/styles", label: "Styles" },
  { href: "/shop", label: "Shop" },
  { href: "/gifts", label: "Gifts" },
  { href: "/breeds", label: "Breeds" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/guarantee", label: "Guarantee" },
  { href: "/track", label: "Track order" },
  { href: "/journal", label: "Journal" },
  { href: "/partners", label: "Creators" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-display text-2xl">10% off your first portrait.</p>
          <NewsletterForm source="footer" className="mt-5" />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[14px] text-ink-2 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="flex flex-col gap-3 border-t border-line py-6 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.legalName}</p>
        <div className="flex flex-wrap gap-5">
          {socialLinks.map((s) => (
            <a key={s.network} href={s.url} target="_blank" rel="noreferrer" className="hover:text-ink">
              {s.label}
            </a>
          ))}
          <a href={`mailto:${site.supportEmail}`} className="hover:text-ink">
            {site.supportEmail}
          </a>
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </div>
      </Container>
    </footer>
  );
}
