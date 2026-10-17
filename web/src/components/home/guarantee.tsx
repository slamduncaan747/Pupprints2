import Link from "next/link";
import { Container } from "@/components/ui/container";
import { GUARANTEE } from "@/lib/offer";
import { keepHyphenated } from "@/components/marketing/offer";

/** Risk reversal, said once and large: you see it before you pay, and you're covered after. */
export function Guarantee() {
  return (
    <section aria-labelledby="guarantee-title" className="bg-paper-2 py-24 sm:py-36">
      <Container className="flex flex-col items-center text-center">
        <p className="label text-ink-3">Without risk</p>
        <h2
          id="guarantee-title"
          className="mt-8 max-w-4xl font-display text-[44px] leading-[1] tracking-[-0.02em] sm:text-[80px] lg:text-[104px]"
        >
          {keepHyphenated(GUARANTEE.name)}
        </h2>
        <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink-2 sm:mt-10 sm:text-[17px]">{GUARANTEE.body}</p>
        <p className="mt-10 max-w-xl font-display text-[24px] leading-[1.2] sm:text-[30px]">
          You see it before you pay. Then you&apos;re covered after.
        </p>
        <Link href="/guarantee" className="link-cta mt-10">
          The guarantee in full
        </Link>
      </Container>
    </section>
  );
}
