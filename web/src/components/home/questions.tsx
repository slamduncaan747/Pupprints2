import { Block } from "@/components/marketing/blocks";
import { FaqList, type FaqItem } from "@/components/marketing/faq";
import { faq } from "@/components/marketing/faq-data";
import { PHYSICAL_PRODUCTS, joinWords, shipWindow } from "@/components/marketing/commerce";
import { GUARANTEE, HOLIDAY } from "@/lib/offer";
import { beforeHolidayCutoff } from "@/components/marketing/offer";

/** "Gallery Canvas and Framed Print: 5–9 business days. Fine Art Print: 4–8 business days." */
const arrivals = [...new Set(PHYSICAL_PRODUCTS.map(shipWindow))]
  .map((w) => `${joinWords(PHYSICAL_PRODUCTS.filter((p) => shipWindow(p) === w).map((p) => p.name))}: ${w}.`)
  .join(" ");

/** The five objections that stop a first order, answered plainly. Holiday lines only until the cutoff. */
export function homeFaq(now: number = Date.now()): FaqItem[] {
  const holiday = beforeHolidayCutoff(now) ? `\n\n${HOLIDAY.label}. ${HOLIDAY.reveal}.` : "";
  return [
    {
      q: "Will it look like my dog?",
      a: "You'll know before you pay: your own dog's portrait appears in about a minute, free. If it isn't unmistakably them, redo it, try another style or another photo, as often as you like. You only buy the one you love.",
    },
    {
      q: "Is it AI?",
      a: "Yes. Our AI artist creates your portrait from your photo, and our team finishes and checks every piece before it's printed. It's never hand-painted, and we'll never say it is.",
      link: { href: "/how-it-works#how-its-made", label: "How the art is made" },
    },
    {
      q: "What if I don't love it?",
      a: GUARANTEE.body,
      link: { href: "/guarantee", label: GUARANTEE.name },
    },
    {
      q: "When will it arrive?",
      a: `The hi-res file arrives the moment you order, and so does the Gift Reveal if it's a gift. Estimated US delivery, including production: ${arrivals} Shipping is free and tracked.${holiday}`,
      link: { href: "/shipping", label: "Shipping details" },
    },
    {
      q: "Is my photo private?",
      a: `${faq("What do you do with my photos?").a} ${faq("Can I ask you to delete my photos?").a}`,
      link: { href: "/privacy", label: "Privacy policy" },
    },
  ];
}

/** Objection handling, five questions, before the last call to action. */
export function Questions({ items }: { items: FaqItem[] }) {
  return (
    <Block id="questions" eyebrow="Before you begin" title="Questions, answered" className="pt-24 sm:pt-36">
      <FaqList items={items} />
    </Block>
  );
}
