import Link from "next/link";
import { CircleHelp, Lock } from "lucide-react";
import { Logo } from "@/components/ui/paw";

/** Focused, distraction-free shell for the creation flow: logo, reassurance, help. No footer. */
export default function CreateLayout({ children }: LayoutProps<"/create">) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-8">
          <Link href="/" aria-label="Pup Prints home" className="shrink-0 rounded-md">
            <Logo className="[&_span.font-display]:text-[19px] sm:[&_span.font-display]:text-[22px]" />
          </Link>
          <p className="hidden items-center gap-1.5 text-[13px] font-medium text-ink-2 sm:flex">
            <Lock className="h-3.5 w-3.5 text-moss" aria-hidden />
            Free preview · No card needed
          </p>
          <Link
            href="/faq"
            className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-medium text-ink-2 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CircleHelp className="h-4 w-4" aria-hidden />
            Help
          </Link>
        </div>
        <p className="flex items-center justify-center gap-1.5 border-t border-line/60 py-1.5 text-[12px] font-medium text-ink-2 sm:hidden">
          <Lock className="h-3 w-3 text-moss" aria-hidden />
          Free preview · No card needed
        </p>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
