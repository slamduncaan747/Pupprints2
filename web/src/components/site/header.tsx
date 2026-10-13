"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/paw";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/styles", label: "Styles" },
  { href: "/shop", label: "Shop" },
  { href: "/gifts", label: "Gifts" },
  { href: "/how-it-works", label: "How it works" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Pup Prints home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[14px] text-ink-2 transition-colors hover:text-ink",
                pathname?.startsWith(item.href) && "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/create"
            className="inline-flex h-9 items-center rounded-[3px] bg-ink px-4 text-[14px] font-medium text-paper transition-colors hover:bg-ink/85"
          >
            Create
          </Link>
          <button
            type="button"
            className="text-[14px] text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <Container className="flex flex-col py-6">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="py-2.5 font-display text-3xl">
                {item.label}
              </Link>
            ))}
            <Link href="/faq" className="mt-4 py-2 text-[15px] text-ink-2">
              FAQ
            </Link>
            <Link href="/track" className="py-2 text-[15px] text-ink-2">
              Track an order
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
