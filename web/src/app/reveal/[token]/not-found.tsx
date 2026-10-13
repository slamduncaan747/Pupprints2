import Link from "next/link";

export default function RevealNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <h1 className="font-display text-[2.6rem] leading-[1.04] sm:text-5xl">This gift link isn&apos;t available</h1>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2">
        It may have been mistyped, or the order isn&apos;t complete yet. Ask the sender to share the link again.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-[3px] bg-ink px-7 text-[15px] font-medium text-paper transition-colors hover:bg-ink/85"
      >
        Visit Pup Prints
      </Link>
    </main>
  );
}
