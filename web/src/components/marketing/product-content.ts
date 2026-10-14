/** Extra copy for /shop/[type] pages. Facts (materials, sizes, prices, timing) come from @/lib/catalog. */
import type { ProductType } from "@/lib/catalog";
import type { FaqItem } from "@/components/marketing/faq";
import { CANADA_SHIPPING_LABEL } from "@/components/marketing/commerce";

export type ProductContent = {
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  care: string[];
  faq: FaqItem[];
};

export const PRODUCT_CONTENT: Record<ProductType, ProductContent> = {
  canvas: {
    title: "Custom Dog Portrait on Canvas",
    metaDescription:
      "Your dog's portrait on hand-stretched gallery canvas, wrapped around a solid wood stretcher bar and ready to hang. Preview free, free US shipping, hi-res digital file included.",
    h1: "Your dog on gallery canvas",
    intro:
      "Printed on poly-cotton canvas and hand-stretched over a solid wood stretcher bar, with the image wrapping around the edges. No frame needed: it arrives ready to hang.",
    care: [
      "Dust gently with a soft, dry cloth or a feather duster.",
      "Keep it out of strong direct sunlight and away from damp rooms like bathrooms.",
      "Avoid leaning anything against the front of the canvas.",
    ],
    faq: [
      {
        q: "Does the canvas need a frame?",
        a: "No. The canvas is stretched over a solid wood bar and the image wraps around the edges, so it looks finished on its own. It arrives ready to hang, with hardware included.",
      },
      {
        q: "Will the gallery wrap cut off part of my dog?",
        a: "Your portrait is composed with comfortable space around your dog, and a person on our team checks every print file before it's printed, so nothing important ends up on the edges.",
      },
      {
        q: "Which size should I choose?",
        a: "As a rule of thumb, art above a sofa or bed looks best at around two-thirds of the furniture's width. For a shelf or a small wall, the smaller sizes are perfect.",
      },
    ],
  },
  framed: {
    title: "Framed Custom Dog Portrait",
    metaDescription:
      "Your dog's portrait framed in solid wood (black, white or natural oak) with shatter-resistant acrylic, ready to hang. Preview free, free US shipping, hi-res digital file included.",
    h1: "Framed, and ready to hang",
    intro:
      "Your portrait on archival matte paper, framed in solid wood behind shatter-resistant acrylic. Choose black, white or natural oak. Hanging hardware is included, so it can go straight on the wall.",
    care: [
      "Dust the frame with a soft, dry cloth.",
      "Clean the acrylic with a microfiber cloth and a little water. Avoid ammonia-based glass cleaners, which can cloud acrylic.",
      "Hang it out of strong direct sunlight to keep colors at their best.",
    ],
    faq: [
      {
        q: "Is the front glass or acrylic?",
        a: "Shatter-resistant acrylic. It's clear, lighter than glass and much safer to ship and hang, especially in homes with kids and tails.",
      },
      {
        q: "Which frame color should I choose?",
        a: "Black makes colors pop and suits dramatic styles. White feels light and modern, lovely with watercolor and line art. Natural oak is warm and works almost anywhere. You can compare the frames with your own portrait before you order.",
      },
      {
        q: "Is it ready to hang?",
        a: "Yes. Hanging hardware is included, so it can go straight on the wall.",
      },
    ],
  },
  poster: {
    title: "Custom Dog Portrait Fine Art Print",
    metaDescription:
      "Your dog's portrait on archival, acid-free matte paper with fade-resistant pigment inks, in standard frame sizes. Preview free, free US shipping, hi-res digital file included.",
    h1: "A fine art print of your dog",
    intro:
      "Archival, acid-free matte paper printed with fade-resistant pigment inks for rich, gallery-quality color. Every size is a standard frame size, so it's easy to frame your own way.",
    care: [
      "Handle by the edges with clean, dry hands.",
      "If it arrives rolled, let it relax flat for a day under a couple of books, with clean paper in between.",
      "Frame it behind glass or acrylic to keep it looking new for years.",
    ],
    faq: [
      {
        q: "Will it fit a standard frame?",
        a: "Yes. Every size we offer is a standard US frame size, so you can find a frame almost anywhere. Or choose our framed print and it arrives ready to hang.",
      },
      {
        q: "Does it ship flat or rolled?",
        a: "It ships flat or rolled in a protective tube, depending on size. If it arrives rolled, let it rest flat under a few books for a day before framing.",
      },
      {
        q: "How long will the colors last?",
        a: "We print with fade-resistant pigment inks on archival, acid-free paper. Kept out of strong direct sunlight, your print will stay vivid for a very long time.",
      },
    ],
  },
  digital: {
    title: "Digital Dog Portrait — Hi-Res File",
    metaDescription:
      "The high-resolution, unwatermarked file of your custom dog portrait, delivered by email right after checkout. Included free with every print, framed print and canvas.",
    h1: "Your portrait, delivered instantly",
    intro:
      "The full-resolution, unwatermarked file of your portrait, delivered to your inbox right after checkout. Use it as a lock screen, post it, or print it for your own home. It's included free with every print, framed print and canvas.",
    care: [
      "Download it and keep a backup somewhere safe, like your photo library or cloud storage.",
      "For printing at home or at a local print shop, use the original file rather than a screenshot.",
    ],
    faq: [
      {
        q: "Is the digital file included with prints?",
        a: "Yes. Every print, framed print and canvas includes the hi-res digital file free. Buy the digital file on its own only if you don't want a physical piece.",
      },
      {
        q: "Can I print it myself?",
        a: "Yes, for personal use. Print it at home, at a local print shop, or as holiday cards for friends and family. Please don't sell it or use it commercially.",
        link: { href: "/terms#your-portrait", label: "Read the personal-use license" },
      },
      {
        q: "Can I upgrade to a print later?",
        a: `Yes. Just get in touch and we'll help you order a print, framed print or canvas of the same portrait. US shipping is free; Canada is a flat ${CANADA_SHIPPING_LABEL}.`,
        link: { href: "/contact", label: "Contact us" },
      },
    ],
  },
};
