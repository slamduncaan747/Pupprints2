import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
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
    <Container className="py-20 sm:py-28">
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-[2.75rem] leading-[1.02] sm:text-6xl">Track your order</h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-2">
          Every portrait is checked by a person, then printed and shipped with tracking.
        </p>

        <div className="mt-10">
          <TrackForm initialOrder={initialOrder} supportEmail={site.supportEmail} />
        </div>

        <p className="mt-16 text-[13px] text-ink-3">
          Questions?{" "}
          <a
            className="text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            href={`mailto:${site.supportEmail}`}
          >
            Email us
          </a>{" "}
          and a person on our team will reply.
        </p>
      </div>
    </Container>
  );
}
