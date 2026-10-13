import Link from "next/link";
import { Logo } from "@/components/ui/paw";

/** Focused, distraction-free shell for the creation flow: wordmark and help. No nav, no footer. */
export default function CreateLayout({ children }: LayoutProps<"/create">) {
  return (
    <>
      <header className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:h-16 sm:px-8">
        <Link href="/" aria-label="Pup Prints home" className="shrink-0">
          <Logo className="[&>span]:text-[22px] sm:[&>span]:text-[24px]" />
        </Link>
        <Link href="/faq" className="-mr-2 inline-flex h-11 items-center px-2 text-[14px] text-ink-2 transition-colors hover:text-ink">
          Help
        </Link>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
