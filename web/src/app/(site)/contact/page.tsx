import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Flower2, Mail, PackageSearch } from "lucide-react";
import { site } from "@/lib/config";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CtaBand } from "@/components/marketing/cta-band";
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
        lede={
          <p>
            Questions about an order, a photo or a gift? Send us a note and a real person will reply within one business
            day.
          </p>
        }
      />

      <Container className="grid gap-12 pb-20 lg:grid-cols-[1.4fr_0.9fr] lg:gap-16 lg:pb-28">
        <div className="relative rounded-card bg-white/60 p-6 ring-1 ring-line sm:p-10">
          <ContactForm initialStatus={status} supportEmail={site.supportEmail} defaultTopic={topic} />
        </div>

        <aside className="space-y-5">
          <div className="rounded-card bg-paper-2 p-6 sm:p-7">
            <Mail className="h-5 w-5 text-clay" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl">Prefer email?</h2>
            <p className="mt-2 text-[15px] text-ink-2">Write to us any time at</p>
            <a href={`mailto:${site.supportEmail}`} className="mt-1 inline-block break-all font-medium text-ink underline decoration-clay/50 underline-offset-4 hover:decoration-clay">
              {site.supportEmail}
            </a>
          </div>
          <div className="rounded-card bg-paper-2 p-6 sm:p-7">
            <Clock className="h-5 w-5 text-clay" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl">When we&apos;ll reply</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              Within one business day. If it&apos;s about an order, including your order number helps us answer faster.
            </p>
          </div>
          <div className="rounded-card bg-sage-soft p-6 sm:p-7">
            <Flower2 className="h-5 w-5 text-moss" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl">Memorial portraits</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
              If you&apos;re making a portrait of a dog who has passed, let us know. We&apos;ll gladly help you choose a photo,
              and we put memorial orders first.
            </p>
          </div>
          <nav aria-label="Help topics" className="rounded-card p-6 ring-1 ring-line sm:p-7">
            <PackageSearch className="h-5 w-5 text-clay" aria-hidden="true" />
            <h2 className="mt-4 font-display text-2xl">Quick answers</h2>
            <ul className="mt-3 divide-y divide-line">
              {QUICK.map((q) => (
                <li key={q.href}>
                  <Link href={q.href} className="group flex items-center justify-between py-3 text-[15px] text-ink-2 hover:text-ink">
                    {q.label}
                    <ArrowRight className="h-4 w-4 text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </Container>

      <CtaBand
        className="pt-0 sm:pt-0"
        eyebrow="While you're here"
        title="See your dog as a work of art"
      />
    </>
  );
}
