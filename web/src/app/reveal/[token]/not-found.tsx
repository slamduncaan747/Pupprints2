import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Logo } from "@/components/ui/paw";

export default function RevealNotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-paper text-ink">
      <header className="flex h-16 shrink-0 items-center justify-center sm:h-20">
        <Logo />
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-5 pb-24 text-center">
        <p className="label text-ink-3">Gift Reveal</p>
        <h1 className="mt-5 max-w-xl font-display text-[40px] leading-[1.04] sm:text-[56px]">This gift link isn&apos;t available.</h1>
        <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-ink-2">
          It may have been mistyped, or the order isn&apos;t complete yet. Ask the sender to share the link again.
        </p>
        <Link href="/" className={buttonClasses("primary", "lg", "mt-12")}>
          Visit Pup Prints
        </Link>
      </div>
    </main>
  );
}
