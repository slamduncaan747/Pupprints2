import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PROMISES } from "@/lib/catalog";

/** The last word before the footer: one line, one link, and the guarantee in small type. */
export function Closing() {
  return (
    <section aria-labelledby="closing-title" className="bg-paper-2 py-28 sm:py-44">
      <Container className="flex flex-col items-center text-center">
        <h2 id="closing-title" className="font-display text-[40px] leading-[1.02] tracking-[-0.02em] sm:text-[72px]">
          Begin with a photograph.
        </h2>
        <Link href="/create" className="link-cta mt-10 sm:mt-12">
          Commission a portrait
        </Link>
        <p className="mt-12 text-[13px] text-ink-3 sm:mt-16">{PROMISES.guarantee}.</p>
      </Container>
    </section>
  );
}
