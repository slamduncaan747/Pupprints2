import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/lib/catalog";

const PHYSICAL = PRODUCTS.filter((p) => p.type !== "digital");
/** Fastest and slowest delivery estimate across physical pieces, in business days. */
const SHIP_FROM = Math.min(...PHYSICAL.map((p) => p.shipDays[0]));
const SHIP_TO = Math.max(...PHYSICAL.map((p) => p.shipDays[1]));

const STEPS = [
  { title: "Photograph", body: "Send any clear photo of your dog." },
  { title: "Preview", body: "See your portrait in about a minute, free." },
  {
    title: "Delivered",
    body: `A digital reveal to give at once. The piece, checked by a person, in ${SHIP_FROM}–${SHIP_TO} business days.`,
  },
];

/** Three numbered lines between hairlines. Quiet on purpose. */
export function Process() {
  return (
    <section aria-labelledby="process-title" className="py-24 sm:py-36">
      <Container className="grid gap-8 lg:grid-cols-12 lg:gap-0">
        <h2 id="process-title" className="label lg:col-span-3 lg:pt-[33px]">
          The Process
        </h2>
        <ol className="border-t border-line lg:col-span-8 lg:col-start-5">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[2.75rem_1fr] gap-y-2 border-b border-line py-6 sm:grid-cols-[4rem_9rem_1fr] sm:items-baseline sm:py-7"
            >
              <span className="label tabular-nums text-ink-3" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="label">{step.title}</h3>
              <p className="col-start-2 text-[14px] leading-relaxed text-ink-2 sm:col-start-3">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
