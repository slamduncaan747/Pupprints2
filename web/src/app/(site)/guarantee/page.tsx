import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { GUARANTEE } from "@/lib/offer";
import { keepHyphenated } from "@/components/marketing/offer";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Bullets, Note, Rows, Statement, textLink } from "@/components/marketing/blocks";
import { CtaBand } from "@/components/marketing/cta-band";
import { FaqList, faqJsonLd } from "@/components/marketing/faq";
import { JsonLd } from "@/components/marketing/json-ld";
import { FAQ_GROUPS } from "@/components/marketing/faq-data";

export const metadata: Metadata = {
  title: `${GUARANTEE.name} — Free Remake or Full Refund`,
  description:
    "If you don't love your printed portrait, tell us within 30 days of delivery and we'll remake it free or refund you in full. Damaged? Send a photo for a free replacement. No fine print.",
  alternates: { canonical: "/guarantee" },
};

const STEPS = [
  { title: "Tell us", body: "Email us or use the contact form within 30 days of delivery. Tell us what's not right; a photo helps." },
  { title: "Choose", body: "A free remake (a new style, a different photo or a fresh version) or a full refund. It's your call." },
  { title: "Done", body: "Remakes are printed and shipped free. Refunds go back to your original payment method." },
];

const COVERED = [
  { title: "You don't love it", body: "Remake it free or get a full refund, within 30 days of delivery." },
  { title: "Damaged in transit", body: "Send us a photo of the damage and we'll send a free replacement." },
  { title: "A printing defect", body: "Smudges, color problems or anything that isn't up to standard: free replacement." },
  { title: "Lost in the mail", body: "If tracking shows it never arrived, we'll replace it or refund you." },
  { title: "A problem with your file", body: "If something's wrong with your digital file, we'll fix it or refund you." },
];

const NO_FINE_PRINT = [
  "No “custom items are final sale”",
  "No 48-hour window to report problems",
  "No restocking or cancellation fees",
  "No return shipping costs on you",
  "No hoops: a quick email (and a photo, if it's damaged) is enough",
];

const FAQS = FAQ_GROUPS.find((g) => g.id === "guarantee")?.items ?? [];

export default function GuaranteePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHero
        eyebrow={GUARANTEE.short}
        title={keepHyphenated(GUARANTEE.name)}
        lede={GUARANTEE.body}
      />

      <Block eyebrow="The process" title="Three steps, no runaround">
        <Rows numbered items={STEPS} />
        <p className="mt-8">
          <Link href="/contact?topic=guarantee" className="link-cta">
            Ask for a remake or refund
          </Link>
        </p>
      </Block>

      <Block eyebrow="Covered" title="If it's not right, we make it right" intro="Damaged pieces don't need to come back. A photo is all we need.">
        <Rows items={COVERED} />
        <Note className="mt-6">
          Tip: keep the packaging until you&apos;ve checked your piece. It helps if anything was damaged on the way.
        </Note>
      </Block>

      <Block eyebrow="Our word" title="No fine print" intro="Typical portrait shops often hide behind these. We don't.">
        <Bullets items={NO_FINE_PRINT} />
      </Block>

      <Statement
        className="bg-paper-2"
        eyebrow="Before you pay, and after"
        body={
          <>
            <p>
              You approve your portrait before checkout, and a person on our team checks every print before it&apos;s printed.
              When something does go wrong, it should be our problem, not yours.
            </p>
            <p className="mt-6">
              Questions about an order?{" "}
              <a href={`mailto:${site.supportEmail}`} className={`${textLink} break-all`}>
                {site.supportEmail}
              </a>
            </p>
          </>
        }
      >
        You see it before you pay. Then you&apos;re covered after.
      </Statement>

      <Block
        titleStyle="label"
        title="The details"
        intro={
          <>
            Full terms are in our{" "}
            <Link href="/terms#guarantee" className={textLink}>
              terms of service
            </Link>
            , written just as plainly.
          </>
        }
      >
        <FaqList items={FAQS} />
      </Block>

      <CtaBand eyebrow="Without risk" title={`See it free. ${GUARANTEE.short}.`} />
    </>
  );
}
