import Link from "next/link";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { site, socialLinks } from "@/lib/config";
import { GUARANTEE } from "@/lib/offer";

const COLUMNS = [
  {
    title: "Maison",
    links: [
      { href: "/about", label: "About" },
      { href: "/journal", label: "Journal" },
      { href: "/partners", label: "Creators" },
    ],
  },
  {
    title: "Collection",
    links: [
      { href: "/styles", label: "The styles" },
      { href: "/shop", label: "Canvas & prints" },
      { href: "/gifts", label: "Gifts" },
      { href: "/breeds", label: "By breed" },
    ],
  },
  {
    title: "Client services",
    links: [
      { href: "/how-it-works", label: "The process" },
      { href: "/faq", label: "FAQ" },
      { href: "/shipping", label: "Shipping" },
      { href: "/guarantee", label: GUARANTEE.name },
      { href: "/track", label: "Track an order" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-14 border-t border-line px-5 py-16 sm:px-10 md:grid-cols-[1.2fr_2fr]">
        <div className="min-w-0 max-w-sm">
          <p className="label">The newsletter</p>
          <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
            New styles, private previews and 10% off your first portrait.
          </p>
          <NewsletterForm source="footer" className="mt-6" />
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="label">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-ink-2 transition-opacity hover:opacity-60">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-10">
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap text-center font-display uppercase leading-[0.8] tracking-[0.06em] text-[13.2vw] min-[1440px]:text-[190px]"
        >
          Pup Prints
        </p>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-8 text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p className="label">© {new Date().getFullYear()} {site.legalName}</p>
        <div className="flex flex-wrap gap-6">
          {socialLinks.map((s) => (
            <a key={s.network} href={s.url} target="_blank" rel="noreferrer" className="label hover:text-ink">
              {s.label}
            </a>
          ))}
          <Link href="/privacy" className="label hover:text-ink">Privacy</Link>
          <Link href="/terms" className="label hover:text-ink">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
