"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/paw";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/styles", label: "Styles" },
  { href: "/shop", label: "Prints & Canvas" },
  { href: "/gifts", label: "Gifts" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-paper/85 backdrop-blur-xl shadow-[0_1px_0_var(--color-line)]" : "bg-paper",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 sm:h-[72px]">
        <Link href="/" aria-label="Pup Prints home" className="shrink-0">
          <Logo className="[&_svg]:h-6 [&_svg]:w-6 sm:[&_svg]:h-7 sm:[&_svg]:w-7" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-[15px] text-ink-2 transition-colors hover:text-ink",
                pathname?.startsWith(item.href) && "text-ink font-medium",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/create" size="sm" className="h-10 px-4 sm:h-11 sm:px-6 sm:text-[15px]">
            <span className="sm:hidden">Try it free</span>
            <span className="hidden sm:inline">Create yours — free preview</span>
          </ButtonLink>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col py-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="py-3 font-display text-2xl">
                {item.label}
              </Link>
            ))}
            <Link href="/track" className="py-3 text-ink-2">
              Track an order
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
