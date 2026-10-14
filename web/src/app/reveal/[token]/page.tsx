import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RevealExperience } from "@/components/reveal/reveal-experience";
import { getRevealData } from "@/components/reveal/data";
import { site } from "@/lib/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function titleFor(d: NonNullable<Awaited<ReturnType<typeof getRevealData>>>) {
  if (d.kind === "gift") return d.recipientName ? `A gift for ${d.recipientName}` : "A gift for you";
  return d.senderName ? `${d.senderName} made you something` : "Someone made you something";
}

export async function generateMetadata({ params }: PageProps<"/reveal/[token]">): Promise<Metadata> {
  const { token } = await params;
  const data = await getRevealData(token);
  if (!data) return { title: "Gift not found", robots: { index: false, follow: false } };
  const title = titleFor(data);
  const description = data.petName
    ? `A one-of-a-kind portrait of ${data.petName}. Tap to open.`
    : "A one-of-a-kind portrait, made just for you. Tap to open.";
  return {
    title: { absolute: `${title} · ${site.name}` },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: null },
    openGraph: { type: "website", siteName: site.name, title, description, url: `/reveal/${token}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RevealPage({ params }: PageProps<"/reveal/[token]">) {
  const { token } = await params;
  const data = await getRevealData(token);
  if (!data) notFound();
  return (
    <RevealExperience
      token={data.token}
      kind={data.kind}
      imageUrl={data.imageUrl}
      recipientName={data.recipientName}
      senderName={data.senderName}
      petName={data.petName}
      styleName={data.styleName}
      message={data.message}
      productNote={data.productNote}
      ctas={data.ctas}
      choice={data.choice}
    />
  );
}
