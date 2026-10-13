import type { ArticleInput } from "@/content/types";
import { addonPrice, fromPrice, priceOf, styleLink } from "@/content/helpers";
import {
  CHRISTMAS_CA_CUTOFF,
  CHRISTMAS_US_CUTOFF,
  CHRISTMAS_US_CUTOFF_FULL,
  PHYSICAL_SHIP_WINDOW,
} from "@/components/marketing/commerce";

export const christmasGifts: ArticleInput = {
  slug: "christmas-gifts-for-dog-owners",
  title: "Christmas Gifts for Dog Owners: Ideas and 2026 Order-By Dates",
  metaTitle: "Christmas Gifts for Dog Owners (2026 Ideas + Order-By Dates)",
  description: `Thoughtful Christmas gifts for dog owners and dog lovers, our 2026 order-by dates (${CHRISTMAS_US_CUTOFF} for US delivery), and what to do if you've left it to the last minute.`,
  date: "2026-10-13",
  category: "gift-guides",
  heroStyle: "holiday",
  keywords: [
    "christmas gifts for dog owners",
    "christmas gifts for dog lovers",
    "dog christmas gift",
    "custom dog portrait christmas",
    "christmas shipping deadline 2026",
  ],
  related: ["gift-ideas-for-dog-lovers", "canvas-vs-framed-print-vs-poster", "how-to-photograph-your-dog-for-a-portrait"],
  body: [
    {
      type: "paragraph",
      text: "Every December the same thing happens: the dog people in your life are the easiest to love and somehow the hardest to shop for. They already have the leash, the bed and the mug with the paw prints. What they don't have is something that feels like it was made just for them.",
    },
    {
      type: "paragraph",
      text: "This guide covers both halves of the problem: what to give, and when to order it so it actually arrives.",
    },
    { type: "heading", text: "Our 2026 Christmas order-by dates" },
    {
      type: "paragraph",
      text: `For delivery before Christmas, we recommend ordering physical pieces (fine art prints, framed prints and canvases) by **${CHRISTMAS_US_CUTOFF_FULL}** in the US, and by **${CHRISTMAS_CA_CUTOFF}** for Canada.`,
    },
    {
      type: "paragraph",
      text: "That's our honest guidance, not a guarantee. Carriers get extremely busy in December and delays do happen, so ordering earlier is always kinder to your nerves. If you're shopping around Black Friday (November 27) or Cyber Monday (November 30), you're comfortably ahead of the cutoffs.",
    },
    {
      type: "table",
      caption: "Holiday 2026 guidance. US shipping is free on every order.",
      head: ["What", "Order by", "Why"],
      rows: [
        ["Prints, framed prints and canvases (US)", CHRISTMAS_US_CUTOFF, `Most pieces arrive in ${PHYSICAL_SHIP_WINDOW}, and carriers slow down in December`],
        ["Prints, framed prints and canvases (Canada)", CHRISTMAS_CA_CUTOFF, "Cross-border delivery adds a few days"],
        ["Digital portrait", "Christmas morning", "Delivered by email right after checkout"],
        ["Gift Reveal", "Christmas Day", "Sent instantly with your order; the print follows"],
      ],
    },
    { type: "heading", text: "Missed the cutoff? Send a Gift Reveal" },
    {
      type: "paragraph",
      text: "Here's the part we're proudest of. When you order a portrait as a gift, you get a Gift Reveal: a beautiful digital reveal of the artwork that you can text, email or show in person the moment you order. On Christmas morning they see their dog as a work of art, and the print follows in the mail. It works right up to Christmas Day, which makes it the least stressful last-minute gift we know of. More on our [Christmas gifts page](/gifts/christmas).",
    },
    { type: "heading", text: "Christmas gift ideas for dog owners" },
    { type: "heading", level: 3, text: "A portrait of their dog" },
    {
      type: "paragraph",
      text: `The gift we know best. A ${styleLink("holiday")} portrait, with a knit scarf and a crackling fire, is made for December, while a classic like ${styleLink("oil-classic")} or ${styleLink("royal")} stays up all year. Framed prints start at ${fromPrice("framed")} and canvases at ${fromPrice("canvas")}, with free US shipping and the digital file included.`,
    },
    { type: "heading", level: 3, text: "A matching ornament" },
    {
      type: "paragraph",
      text: `Add a 3" glossy ceramic ornament with the same portrait on both sides to any print, frame or canvas, for ${addonPrice("addon-ornament")}. It becomes a small tradition every time the tree goes up.`,
    },
    { type: "heading", level: 3, text: "Holiday cards starring the dog" },
    {
      type: "paragraph",
      text: "Every physical portrait comes with the hi-res digital file, which makes a gorgeous holiday card. Upload it to any card printer and next year's cards are sorted, too.",
    },
    { type: "heading", level: 3, text: "Something cozy for the dog" },
    {
      type: "paragraph",
      text: "A plush bed, a warm sweater for short-coated breeds like [Chihuahuas](/breeds/chihuahua) and [French Bulldogs](/breeds/french-bulldog), or a heated pad for an older dog. The dog is happy, so the owner is happy.",
    },
    { type: "heading", level: 3, text: "A stocking full of small things" },
    {
      type: "list",
      items: [
        "Long-lasting chews, sized for their dog",
        "A new toy: squeaky for most dogs, tough rubber for power chewers",
        "Paw balm for salty winter sidewalks",
        "A good poop-bag dispenser (glamorous? No. Used every single day? Yes.)",
        "A collapsible travel bowl for walks and road trips",
      ],
    },
    { type: "heading", level: 3, text: "An experience" },
    {
      type: "paragraph",
      text: "A dog-friendly cabin weekend, a class at a local training school, or a session with a pet photographer. Experiences are perfect for people who insist they don't need anything.",
    },
    { type: "heading", level: 3, text: "Something for the whole family" },
    {
      type: "paragraph",
      text: "If the dog is the family's center of gravity, a large canvas for the living room is a gift everyone shares. Our [size guide](/journal/what-size-art-for-your-wall) helps you pick the right scale, and our [full list of gifts for dog lovers](/journal/gift-ideas-for-dog-lovers) has 25 more ideas.",
    },
    { type: "heading", text: "Christmas gifts at every budget" },
    {
      type: "paragraph",
      text: "Not every dog person on your list needs a showstopper. Here's how the ideas above break down, with our own portrait prices included so you can compare honestly:",
    },
    {
      type: "list",
      items: [
        `**Stocking-sized:** a bag of chews and a new toy, paw balm, a collapsible travel bowl, a matching ornament (${addonPrice("addon-ornament")} with any print), or the digital portrait (${fromPrice("digital")}) for their holiday cards.`,
        `**Thoughtful mid-range:** an 8×10" fine art print of their dog (${priceOf("poster-8x10")}), an 8×10" canvas (${priceOf("canvas-8x10")}) or framed print (${priceOf("framed-8x10")}), a washable orthopedic bed or a hands-free leash.`,
        `**Something special:** a 16×20" canvas (${priceOf("canvas-16x20")}) or framed print (${priceOf("framed-16x20")}) for the living room, a GPS tracker for an escape artist, or a training class they've been meaning to try.`,
        `**The big gift:** a 24×36" statement canvas (${priceOf("canvas-24x36")}) above the fireplace, a dog-friendly weekend away, or a professional photo session for the whole family.`,
      ],
    },
    {
      type: "paragraph",
      text: "Every price above includes free US shipping, and every physical portrait includes the hi-res digital file. What you see is what you pay.",
    },
    { type: "heading", text: "A quick holiday safety note" },
    { type: "paragraph", text: "December is wonderful and a little hazardous for dogs. A few practical reminders:" },
    {
      type: "list",
      items: [
        "**Keep holiday food out of reach.** Chocolate, grapes and raisins, onions and anything sweetened with xylitol are toxic to dogs.",
        "**Watch the decorations.** Tinsel, ribbon and ornament hooks can cause serious problems if swallowed.",
        "**Mind the greenery.** Holly and mistletoe can make dogs sick, so keep them up high.",
        "**Secure the tree** if you live with a tail-wagging, zoom-prone dog.",
        "**If you're worried your dog ate something, call your vet** or an animal poison control line right away.",
      ],
    },
    { type: "heading", text: "Getting the photo without spoiling the surprise" },
    {
      type: "paragraph",
      text: "Giving a portrait of someone else's dog? Their Instagram, a family group chat or a co-conspirator in the household is usually all you need. Pick a clear, close photo where the dog looks toward the camera, then check the free preview before you buy. Our [photo guide](/journal/how-to-photograph-your-dog-for-a-portrait) explains what to look for.",
    },
    {
      type: "cta",
      title: "Start their Christmas portrait",
      body: `Upload a photo of their dog and see it free in about a minute. Order by ${CHRISTMAS_US_CUTOFF} for US delivery before Christmas, or send a Gift Reveal any time.`,
      href: "/create?style=holiday",
      label: "Create a free preview",
      style: "holiday",
    },
  ],
};
