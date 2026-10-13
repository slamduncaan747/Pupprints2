import type { Metadata } from "next";
import { getStyle } from "@/lib/catalog";
import { CreateFlow } from "@/components/create/create-flow";

export const metadata: Metadata = {
  title: "Create your portrait — free preview",
  description:
    "Upload a photo of your dog and see a fine-art portrait free in about a minute. Then choose a canvas, framed print, fine-art print or digital file.",
  alternates: { canonical: "/create" },
};

export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const params = await searchParams;
  const raw = Array.isArray(params.style) ? params.style[0] : params.style;
  const initialStyle = raw ? getStyle(raw)?.slug : undefined;
  // ?gift=<reveal token>: order the gift portrait from a reveal link.
  const rawGift = Array.isArray(params.gift) ? params.gift[0] : params.gift;
  const giftToken = rawGift && /^[a-f0-9]{16,64}$/i.test(rawGift) ? rawGift : undefined;
  return <CreateFlow initialStyle={initialStyle} giftToken={giftToken} />;
}
