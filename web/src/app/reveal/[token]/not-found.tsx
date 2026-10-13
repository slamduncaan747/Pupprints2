import Link from "next/link";

export default function RevealNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#17130f] px-6 text-center text-[#f7efe1]">
      <h1 className="font-display text-4xl">This gift link isn&apos;t available</h1>
      <p className="mt-4 max-w-sm text-[#f7efe1]/75">
        It may have been mistyped, or the order isn&apos;t complete yet. Ask the sender to share the link again.
      </p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-full bg-[#f7efe1] px-6 font-medium text-[#1b1814]">
        Visit Pup Prints
      </Link>
    </main>
  );
}
