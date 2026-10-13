import type { Metadata } from "next";
import { Truck, ShieldCheck, Mail } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/container";
import { TrackForm } from "@/components/order/track-form";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check where your Pup Prints portrait is: checked by hand, printed, shipped with tracking.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({ searchParams }: PageProps<"/track">) {
  const sp = await searchParams;
  const initialOrder = typeof sp.order === "string" ? sp.order.slice(0, 24) : "";

  return (
    <Container className="py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Eyebrow>Order status</Eyebrow>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] sm:text-6xl">Track your order</h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-2">
          Every portrait is checked by a person, then printed, finished and shipped with tracking. Here&apos;s where yours is.
        </p>

        <div className="mt-10">
          <TrackForm initialOrder={initialOrder} supportEmail={site.supportEmail} />
        </div>

        <ul className="mt-12 grid gap-4 text-[15px] text-ink-2 sm:grid-cols-3">
          <li className="flex gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <span>Checked by our team before printing</span>
          </li>
          <li className="flex gap-3">
            <Truck className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <span>Free, tracked US shipping on every order</span>
          </li>
          <li className="flex gap-3">
            <Mail className="h-5 w-5 shrink-0 text-moss" aria-hidden="true" />
            <span>
              Questions? <a className="text-clay underline underline-offset-2" href={`mailto:${site.supportEmail}`}>Email us</a>, a real person replies.
            </span>
          </li>
        </ul>
      </div>
    </Container>
  );
}
