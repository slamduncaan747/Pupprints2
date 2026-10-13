import Link from "next/link";
import { Logo } from "@/components/ui/paw";

const sideLink = "label inline-flex h-11 items-center px-2 transition-opacity hover:opacity-60";

/** Focused boutique shell for the creation flow: Close, the wordmark, Client services. No nav, no footer. */
export default function CreateLayout({ children }: LayoutProps<"/create">) {
  return (
    <>
      <header className="mx-auto grid h-16 w-full max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:h-20 sm:px-8">
        <Link href="/" aria-label="Close and return home" className={`${sideLink} justify-self-start`}>
          Close
        </Link>
        <Link href="/" aria-label="Pup Prints home" className="inline-flex h-11 items-center">
          <Logo className="[&>span]:text-[19px] sm:[&>span]:text-[26px]" />
        </Link>
        <Link href="/faq" className={`${sideLink} justify-self-end`}>
          <span className="sm:hidden">Help</span>
          <span className="hidden sm:inline">Client services</span>
        </Link>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
