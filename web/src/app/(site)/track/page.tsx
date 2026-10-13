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
    <Container className="py-20 sm:py-32">
      <div className="mx-auto max-w-[460px]">
        <p className="label text-center text-ink-3">Client services</p>
        <h1 className="mt-5 text-center font-display text-[44px] leading-[1.02] sm:text-[64px]">Track your order.</h1>
        <p className="mx-auto mt-6 max-w-sm text-center text-[14px] leading-relaxed text-ink-2 sm:text-[15px]">
          Every portrait is checked by a person, then printed and shipped with tracking.
        </p>

        <div className="mt-14">
          <TrackForm initialOrder={initialOrder} supportEmail={site.supportEmail} />
        </div>

        <p className="mt-20 text-center text-[13px] leading-relaxed text-ink-3">
          Questions?{" "}
          <a
            className="text-ink-2 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            href={`mailto:${site.supportEmail}`}
          >
            Write to us
          </a>{" "}
          and a person on our team will reply.
        </p>
      </div>
    </Container>
  );
}
