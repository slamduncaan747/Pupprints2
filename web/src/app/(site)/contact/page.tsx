import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { PageHero } from "@/components/marketing/page-hero";
import { Block, Rows, textLink } from "@/components/marketing/blocks";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Questions about an order, a photo or a gift? Send us a message or email ${site.supportEmail}. A real person replies within one business day.`,
  alternates: { canonical: "/contact" },
};

const QUICK = [
  { href: "/track", label: "Track an order" },
  { href: "/faq", label: "Read the FAQ" },
  { href: "/shipping", label: "Shipping & holiday dates" },
  { href: "/guarantee", label: "Love-it guarantee" },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const status = first(sp.sent) ? "sent" : first(sp.error) ? "error" : "idle";
  const topic = first(sp.topic);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        lede="Questions about an order, a photo or a gift? Send us a note and a real person will reply within one business day."
      />

      <Block title="Send a message">
        <ContactForm initialStatus={status} supportEmail={site.supportEmail} defaultTopic={topic} />
      </Block>

      <Block title="Other ways to reach us">
        <Rows
          items={[
            {
              title: "Prefer email?",
              body: (
                <>
                  Write to us any time at{" "}
                  <a href={`mailto:${site.supportEmail}`} className={`${textLink} break-all`}>
                    {site.supportEmail}
                  </a>
                  .
                </>
              ),
            },
            {
              title: "When we'll reply",
              body: "Within one business day. If it's about an order, including your order number helps us answer faster.",
            },
            {
              title: "Memorial portraits",
              body: "If you're making a portrait of a dog who has passed, let us know. We'll gladly help you choose a photo, and we put memorial orders first.",
            },
            {
              title: "Quick answers",
              body: (
                <span className="flex flex-wrap gap-x-5 gap-y-1">
                  {QUICK.map((q) => (
                    <Link key={q.href} href={q.href} className={textLink}>
                      {q.label}
                    </Link>
                  ))}
                </span>
              ),
            },
          ]}
        />
      </Block>
    </>
  );
}
