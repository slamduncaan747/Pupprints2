"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Pages where a "create" bar would get in the way of the task at hand. */
const QUIET = ["/order", "/track", "/contact", "/partners", "/privacy", "/terms", "/gift-cards"];

/**
 * Phones only: once the first screen has scrolled away, keep the one action within thumb reach.
 * It steps aside again when the footer comes into view.
 */
export function MobileCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const quiet = QUIET.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (quiet) return;
    const footer = document.querySelector("footer");
    const update = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const atFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight - 40 : false;
      setShow(past && !atFooter);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [quiet, pathname]);

  if (quiet) return null;
  return (
    <div
      aria-hidden={!show}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-opacity duration-300 md:hidden",
        show ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Link href="/create" tabIndex={show ? 0 : -1} className={buttonClasses("primary", "md", "w-full")}>
        Create your free portrait
      </Link>
      <p className="label mt-2 text-center text-ink-3">No account. No card.</p>
    </div>
  );
}
