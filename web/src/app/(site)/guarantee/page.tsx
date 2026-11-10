import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Rows, textLink } from "@/components/marketing/blocks";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { FAQ_GROUPS } from "@/components/marketing/faq-data";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Our returns policy: within 30 days of delivery we remake your portrait or refund it in full. Damaged pieces are replaced; a photo is all we need.",
  alternates: { canonical: "/guarantee" },
};

/** The policy, stated once. The substance matches /terms#guarantee; change both together. */
const POLICY = [
  { title: "Not happy with it", body: "Tell us within 30 days of delivery. We remake it in any style, or refund you in full." },
  {
    title: "It was a gift",
    body: "The person who received it can ask for a different style within 30 days of delivery. We remake it at no charge.",
  },
  { title: "Damaged or misprinted", body: "Send us a photo and we send a replacement at no charge." },
  { title: "Lost in the mail", body: "If tracking shows it never arrived, we replace it or refund you." },
  { title: "A problem with a digital file", body: "We fix it or refund you." },
  {
    title: "Sending it back",
    body: "Usually not needed. If we do need a piece back, we pay the return shipping.",
  },
  { title: "Refunds", body: "Refunds go back to the original payment method." },
];

const FAQS = FAQ_GROUPS.find((g) => g.id === "guarantee")?.items ?? [];

/** The returns policy (same route as before, so existing links keep working). */
export default function ReturnsPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        title="Returns"
        lede="Within 30 days of delivery, we remake your portrait or refund it in full."
      />

      <Block titleStyle="label" title="The policy">
        <Rows items={POLICY} />
        <p className="mt-8 text-[15px] leading-relaxed text-ink-2">
          To start a return, use the{" "}
          <Link href="/contact?topic=guarantee" className={textLink}>
            contact form
          </Link>{" "}
          or email{" "}
          <a href={`mailto:${site.supportEmail}`} className={`${textLink} break-all`}>
            {site.supportEmail}
          </a>
          . The full terms are in our{" "}
          <Link href="/terms#guarantee" className={textLink}>
            terms of service
          </Link>
          .
        </p>
      </Block>

      {FAQS.length > 0 && (
        <Block titleStyle="label" title="Questions">
          <FaqList items={FAQS} />
        </Block>
      )}
    </>
  );
}
