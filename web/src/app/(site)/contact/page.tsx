import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { PageHero } from "@/components/marketing/page-hero";
import { Container } from "@/components/ui/container";
import { textLink } from "@/components/marketing/blocks";
import { ContactForm } from "@/components/marketing/contact-form";
import { GUARANTEE } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Questions about an order, a photo or a gift? Send us a message or email ${site.supportEmail}. A real person replies within one business day.`,
  alternates: { canonical: "/contact" },
};

const QUICK = [
  { href: "/track", label: "Track an order" },
  { href: "/faq", label: "Read the FAQ" },
  { href: "/shipping", label: "Shipping & holiday dates" },
  { href: "/guarantee", label: GUARANTEE.name },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const status = first(sp.sent) ? "sent" : first(sp.error) ? "error" : "idle";
  const topic = first(sp.topic);

  const others = [
    {
      title: "By email",
      body: (
        <a href={`mailto:${site.supportEmail}`} className={`${textLink} break-all`}>
          {site.supportEmail}
        </a>
      ),
    },
    {
      title: "When we'll reply",
      body: "Within one business day. If it's about an order, your order number helps us answer faster.",
    },
    {
      title: "Memorial portraits",
      body: "If you're making a portrait of a dog who has passed, let us know. We'll gladly help you choose a photo, and we put memorial orders first.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Client Services"
        title="Write to us"
        lede="Questions about an order, a photo or a gift? Send a note and a real person will reply within one business day."
      />

      <section aria-label="Contact" className="pb-24 sm:pb-36">
        <Container>
          <div className="border-t border-line pt-10 sm:pt-12 lg:grid lg:grid-cols-12 lg:gap-x-10">
            <div className="min-w-0 lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <h2 className="label mb-10 text-ink">Send a message</h2>
              <ContactForm initialStatus={status} supportEmail={site.supportEmail} defaultTopic={topic} />
            </div>
            <aside aria-labelledby="other-ways" className="mt-20 min-w-0 lg:col-span-4 lg:row-start-1 lg:mt-0">
              <h2 id="other-ways" className="label text-ink">
                Other ways to reach us
              </h2>
              <dl className="mt-8 space-y-8">
                {others.map((o) => (
                  <div key={o.title}>
                    <dt className="label text-ink-3">{o.title}</dt>
                    <dd className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink-2">{o.body}</dd>
                  </div>
                ))}
                <div>
                  <dt className="label text-ink-3">Quick answers</dt>
                  <dd className="mt-3">
                    <ul className="border-t border-line">
                      {QUICK.map((q) => (
                        <li key={q.href} className="border-b border-line">
                          <Link href={q.href} className="label block py-3.5 text-ink transition-opacity hover:opacity-60">
                            {q.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
