import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const PROMISE_LINE = "Free preview · Love-it guarantee · Free US shipping";

/** The one call to action at the end of a page. Always points at the free preview. */
export function CtaBand({
  title = "See your dog as a work of art",
  body,
  href = "/create",
  cta = "Create your portrait",
  note = PROMISE_LINE,
}: {
  title?: ReactNode;
  body?: ReactNode;
  href?: string;
  cta?: string;
  note?: ReactNode;
}) {
  return (
    <section>
      <Container>
        <div className="border-t border-line py-24 text-center sm:py-32">
          <h2 className="mx-auto max-w-3xl font-display text-[2.5rem] leading-[1.04] sm:text-6xl">{title}</h2>
          {body && <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-ink-2">{body}</p>}
          <ButtonLink href={href} size="lg" className="mt-10">
            {cta}
          </ButtonLink>
          {note && <p className="mt-5 text-[13px] text-ink-3">{note}</p>}
        </div>
      </Container>
    </section>
  );
}
