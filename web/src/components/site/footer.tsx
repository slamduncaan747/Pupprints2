import Link from "next/link";
import { Logo } from "@/components/ui/paw";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { site, socialLinks } from "@/lib/config";
import { STYLES } from "@/lib/catalog";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/create", label: "Create a portrait" },
      { href: "/shop", label: "Prints & canvas" },
      { href: "/styles", label: "All styles" },
      { href: "/breeds", label: "Shop by breed" },
      { href: "/gifts", label: "Gift ideas" },
      { href: "/gift-cards", label: "Gift cards" },
    ],
  },
  {
    // "Featured", never "Popular": we have no sales data to back a popularity claim.
    title: "Featured styles",
    links: STYLES.slice(0, 5).map((s) => ({ href: `/styles/${s.slug}`, label: s.name })),
  },
  {
    title: "Help",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping" },
      { href: "/guarantee", label: "Love-it guarantee" },
      { href: "/track", label: "Track an order" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/partners", label: "Creators & affiliates" },
      { href: "/journal", label: "Journal" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-paper-2">
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-ink-2">
            Fine-art portraits of the dogs we love. Preview yours free, then we print, frame and ship it to your door.
          </p>
          <div className="mt-8">
            <p className="font-display text-xl">Get 10% off your first portrait</p>
            <p className="mt-1 text-sm text-ink-2">Plus new styles and holiday shipping reminders. No spam.</p>
            <NewsletterForm source="footer" className="mt-4" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[15px] text-ink-2 hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-sm text-ink-3 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.legalName}. Made with love for dogs everywhere.</p>
          <div className="flex gap-5">
            {socialLinks.map((s) => (
              <a key={s.network} href={s.url} target="_blank" rel="noreferrer" className="hover:text-ink">
                {s.label}
              </a>
            ))}
            <a href={`mailto:${site.supportEmail}`} className="hover:text-ink">{site.supportEmail}</a>
          </div>
        </Container>
      </div>
    </footer>
  );
}
