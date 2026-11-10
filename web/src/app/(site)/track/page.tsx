import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TrackForm } from "@/components/order/track-form";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check where your Pup Prints order is.",
  alternates: { canonical: "/track" },
};

export default async function TrackPage({ searchParams }: PageProps<"/track">) {
  const sp = await searchParams;
  const initialOrder = typeof sp.order === "string" ? sp.order.slice(0, 24) : "";

  return (
    <Container className="py-20 sm:py-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-center font-display text-[40px] leading-[1.08] sm:text-[56px]">Track your order</h1>

        <div className="mx-auto mt-14 max-w-[460px]">
          <TrackForm initialOrder={initialOrder} supportEmail={site.supportEmail} />
        </div>

        <p className="mx-auto mt-20 max-w-[460px] text-center text-[13px] leading-relaxed text-ink-3">
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
