import type { Metadata } from "next";
import { getStyle, styleAvailable } from "@/lib/catalog";
import { CreateFlow } from "@/components/create/create-flow";

export const metadata: Metadata = {
  title: "Upload a photo",
  description:
    "Upload a photo of your dog and see the portrait. Then choose a print, framed print, canvas or digital file.",
  alternates: { canonical: "/create" },
};

export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const params = await searchParams;
  const raw = Array.isArray(params.style) ? params.style[0] : params.style;
  // A retired style (an old ?style= link) is not preselected.
  const style = raw ? getStyle(raw) : undefined;
  const initialStyle = style && styleAvailable(style) ? style.slug : undefined;
  // ?gift=<reveal token>: order the gift portrait from a reveal link.
  const rawGift = Array.isArray(params.gift) ? params.gift[0] : params.gift;
  const giftToken = rawGift && /^[a-f0-9]{16,64}$/i.test(rawGift) ? rawGift : undefined;
  return <CreateFlow initialStyle={initialStyle} giftToken={giftToken} />;
}
