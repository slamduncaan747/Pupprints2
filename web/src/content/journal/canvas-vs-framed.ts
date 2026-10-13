import type { ArticleInput } from "@/content/types";
import { fromPrice, shipWindow, sizeList, styleLink } from "@/content/helpers";

export const canvasVsFramed: ArticleInput = {
  slug: "canvas-vs-framed-print-vs-poster",
  title: "Canvas vs. Framed Print vs. Poster: Which Is Right for Your Dog Portrait?",
  metaTitle: "Canvas vs. Framed Print vs. Poster for a Dog Portrait",
  description:
    "Gallery canvas, framed print or unframed fine art print? An honest comparison of looks, durability, price and where each one works best, so you can choose with confidence.",
  date: "2026-10-06",
  category: "home-and-framing",
  heroStyle: "admiral",
  keywords: ["pet portrait canvas", "framed dog portrait", "canvas vs framed print", "canvas or framed print", "dog portrait print"],
  related: ["what-size-art-for-your-wall", "how-to-hang-a-canvas-or-framed-print", "watercolor-vs-oil-vs-line-art"],
  body: [
    {
      type: "paragraph",
      text: "You've found the portrait. It looks exactly like your dog. Now comes the question that stalls more decisions than you'd think: canvas, framed or print? Each one changes how the art looks and where it works best. Here's how to choose, without the upselling.",
    },
    { type: "heading", text: "The quick answer" },
    {
      type: "list",
      items: [
        "**Choose a gallery canvas** if you want a painting-like, frameless look for a living room or a big wall.",
        "**Choose a framed print** if it's a gift, if you want it ready to hang the moment it arrives, or if your home leans classic or tailored.",
        "**Choose a fine art print** if you already have a frame you love, want to use your own framer, or are building a gallery wall on a budget.",
        "**Choose the digital file** if you want to print it yourself, use it on cards or make it your lock screen. It's also included free with every physical piece.",
      ],
    },
    { type: "heading", text: "Side by side" },
    {
      type: "table",
      caption: "Prices, sizes and timings come straight from our catalog. US shipping is free on every order.",
      head: ["", "Gallery canvas", "Framed print", "Fine art print"],
      rows: [
        ["Starting price", fromPrice("canvas"), fromPrice("framed"), fromPrice("poster")],
        ["Sizes", sizeList("canvas"), sizeList("framed"), sizeList("poster")],
        ["Surface", "Textured poly-cotton canvas", "Archival matte paper behind acrylic", "Archival, acid-free matte paper"],
        ["Ready to hang?", "Yes, hardware included", "Yes, hardware included", "No, frame it yourself"],
        ["The look", "Painting-like, no frame", "Polished and finished", "Depends on your frame"],
        ["Arrives in (US)", shipWindow("canvas"), shipWindow("framed"), shipWindow("poster")],
      ],
    },
    { type: "heading", text: "Gallery canvas: the painting look" },
    {
      type: "paragraph",
      text: `Our canvas is poly-cotton, hand-stretched over a solid wood stretcher bar, with the image wrapping around the edges for a finished gallery look. There's no glazing, so there's no glare, and the woven texture gives the art a painted feel up close. That makes canvas a natural partner for the painterly styles: ${styleLink("oil-classic")}, ${styleLink("royal")} and ${styleLink("admiral")}.`,
    },
    {
      type: "paragraph",
      text: "Canvas shines in living rooms, above a sofa or bed, and in the larger sizes. Because there's no frame, it reads as contemporary even when the art is classical. It's also light for its size, which makes hanging a big piece easier.",
    },
    {
      type: "tip",
      title: "About that wrapped edge",
      text: "On a gallery wrap, a thin strip around the outside of the image folds onto the sides of the canvas. Our portraits are composed with comfortable space around your dog, so the ears and face stay on the front where they belong.",
    },
    {
      type: "paragraph",
      text: `The trade-offs: canvas has no protective glazing, so keep it out of steamy bathrooms and strong direct sun. And its texture softens the very finest lines a little, so ultra-delicate styles like ${styleLink("fine-line")} often look crisper on paper.`,
    },
    { type: "heading", text: "Framed print: ready the moment it arrives" },
    {
      type: "paragraph",
      text: "A framed print is the most finished option: archival matte paper and fade-resistant pigment inks, in a solid wood frame in black, white or natural oak, behind shatter-resistant acrylic. It arrives ready to hang, which is exactly why it makes such a good gift. Nobody has to make a trip to the frame shop.",
    },
    {
      type: "paragraph",
      text: `Framed prints suit crisp, detailed styles beautifully, like ${styleLink("fine-line")}, ${styleLink("botanical")} and ${styleLink("watercolor")}, and they look at home in both classic and modern rooms. They're also lovely in smaller sizes, on desks, shelves and gallery walls.`,
    },
    { type: "heading", level: 3, text: "Which frame color?" },
    {
      type: "list",
      items: [
        `**Black** sharpens everything. Great with bold styles like ${styleLink("pop-art")}, and with high-contrast dogs.`,
        "**White** feels light and airy. Perfect for watercolor and for bright, modern rooms.",
        `**Natural oak** is warm and relaxed. It loves the warm tones of the oil styles and ${styleLink("mid-century")}.`,
      ],
    },
    {
      type: "paragraph",
      text: "The main trade-off is price: framing adds to the cost of the same size print. You're paying for the frame, the glazing and the convenience of hanging it the day it arrives.",
    },
    { type: "heading", text: "Fine art print: flexible and affordable" },
    {
      type: "paragraph",
      text: "Our fine art print is archival, acid-free enhanced matte paper (189gsm) with fade-resistant pigment inks. It ships flat or rolled in a protective tube, ready for your own frame.",
    },
    {
      type: "paragraph",
      text: `It's the right choice if you already have a frame, want a custom framer to add a wide mat, or are matching an existing gallery wall. It's also the most affordable physical piece, starting at ${fromPrice("poster")}. Our print sizes (${sizeList("poster")}) are common frame sizes, so ready-made frames are easy to find.`,
    },
    {
      type: "tip",
      title: "Framing it yourself?",
      text: "Measure the print when it arrives before buying a frame, and decide whether you want a mat. A mat needs a frame one size up (an 8×10\" print in an 11×14\" frame is a classic combination).",
    },
    { type: "heading", text: "What about digital?" },
    {
      type: "paragraph",
      text: `Every print, framed print and canvas comes with the high-resolution digital file at no extra cost, so you don't have to choose. If you only want the file, the digital portrait is ${fromPrice("digital")} and arrives by email right after checkout: no watermark, yours to print, share and post.`,
    },
    { type: "heading", text: "Still undecided? Match it to the room" },
    {
      type: "list",
      items: [
        "**Above a sofa or bed:** a large canvas or framed piece, or a pair. Our [size guide](/journal/what-size-art-for-your-wall) has the numbers.",
        `**Home office:** a framed ${styleLink("admiral")} or ${styleLink("oil-classic")} in natural oak.`,
        `**Nursery or kids' room:** a framed ${styleLink("storybook")} in white.`,
        "**Gallery wall:** framed prints in mixed sizes, all in one frame color.",
        "**A gift:** framed, almost always. It's ready to hang and feels complete when it's unwrapped.",
      ],
    },
    {
      type: "paragraph",
      text: "And if your piece arrives and you don't love it, our [love-it guarantee](/guarantee) has you covered: we'll remake it or refund you. When it's time to put it up, here's [how to hang a canvas or framed print](/journal/how-to-hang-a-canvas-or-framed-print).",
    },
    {
      type: "cta",
      title: "See it before you choose",
      body: "Create your portrait free in about a minute, then choose canvas, framed print or fine art print only if you love it.",
      href: "/create",
      label: "Create your free preview",
      style: "admiral",
    },
  ],
};
