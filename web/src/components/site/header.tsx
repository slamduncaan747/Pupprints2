"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/paw";
import { OFFER } from "@/lib/offer";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/styles", label: "Collection" },
  { href: "/shop", label: "Shop" },
  { href: "/gifts", label: "Gifts" },
];

const NAV_RIGHT = [{ href: "/how-it-works", label: "The Process" }];

export function Header() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;
  const setOpen = (next: (o: boolean) => boolean) => setOpenOn(next(open) ? pathname : null);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkClass = (href: string) =>
    cn("label transition-opacity hover:opacity-60", pathname?.startsWith(href) && "underline underline-offset-[6px]");

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:h-20 sm:px-10">
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="label md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" aria-label="Pup Prints home" className="justify-self-center">
          <Logo />
        </Link>

        <div className="flex items-center justify-end gap-8">
          {NAV_RIGHT.map((item) => (
            <Link key={item.href} href={item.href} className={cn(linkClass(item.href), "hidden md:inline")}>
              {item.label}
            </Link>
          ))}
          <Link href="/create" className="label whitespace-nowrap underline underline-offset-[6px] transition-opacity hover:opacity-60">
            Create free
          </Link>
        </div>
      </div>

      {open && (
        // Hangs from the header itself, so it starts right below it whether or not the top line is showing.
        <div className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] overflow-y-auto bg-paper md:hidden">
          <nav className="flex flex-col gap-6 px-5 pt-10" aria-label="Mobile">
            {[...NAV, ...NAV_RIGHT, { href: "/create", label: OFFER.cta }].map((item) => (
              <Link key={item.href} href={item.href} className="font-display text-[34px] leading-none">
                {item.label}
              </Link>
            ))}
            <div className="mt-8 flex flex-col gap-4">
              {[
                { href: "/faq", label: "Client services" },
                { href: "/track", label: "Track an order" },
                { href: "/journal", label: "Journal" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="label text-ink-3">
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
