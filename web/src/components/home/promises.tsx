import { Container } from "@/components/ui/container";
import { PROMISES } from "@/lib/catalog";

const LINES = [PROMISES.shipping, PROMISES.digital, PROMISES.guarantee];

/** The real reasons to trust us, in one quiet line. */
export function Promises() {
  return (
    <Container className="pb-20 sm:pb-24">
      <ul className="flex flex-col items-center gap-2 text-center text-[13px] text-ink-3 md:flex-row md:justify-center md:gap-0">
        {LINES.map((line) => (
          <li key={line} className="md:before:mx-3 md:before:content-['·'] md:first:before:hidden">
            {line}
          </li>
        ))}
      </ul>
    </Container>
  );
}
