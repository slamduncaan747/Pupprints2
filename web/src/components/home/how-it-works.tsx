import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/lib/catalog";

const PHYSICAL = PRODUCTS.filter((p) => p.type !== "digital");
/** Fastest and slowest delivery estimate across physical products, in business days. */
const SHIP_FROM = Math.min(...PHYSICAL.map((p) => p.shipDays[0]));
const SHIP_TO = Math.max(...PHYSICAL.map((p) => p.shipDays[1]));

const STEPS = [
  { title: "Upload a photo", body: "Any clear phone photo of your dog will do." },
  { title: "See it free", body: "Your portrait is ready in about a minute." },
  {
    title: "We print & ship",
    body: `Checked by a person, at your door in ${SHIP_FROM}–${SHIP_TO} business days.`,
  },
];

/** Three numbered lines, no icons. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className="pb-24 sm:pb-32">
      <Container>
        <div className="grid gap-10 border-t border-line pt-6 lg:grid-cols-4 lg:gap-8">
          <h2 id="how-title" className="font-display text-4xl sm:text-5xl">
            How it works
          </h2>
          <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-3 lg:pt-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.75rem_1fr] items-baseline sm:block">
                <p className="text-[13px] tabular-nums text-ink-3" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-[26px] leading-tight sm:mt-4 sm:text-[28px]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2 sm:max-w-[17rem]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
