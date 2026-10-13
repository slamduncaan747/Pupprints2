import type { StyleSlug } from "@/lib/catalog";

/**
 * Example portraits shown across the marketing site. Files live in web/public/samples/.
 * All portraits are 4:5 (e.g. 960×1200) WebP. Owned by the visual-assets pipeline
 * (web/scripts/generate-samples.ts); components must tolerate a missing file (use <SampleImage>).
 */
export const STYLE_SAMPLES: Record<StyleSlug, string> = {
  royal: "/samples/royal.webp",
  admiral: "/samples/admiral.webp",
  "oil-classic": "/samples/oil-classic.webp",
  watercolor: "/samples/watercolor.webp",
  "fine-line": "/samples/fine-line.webp",
  "pop-art": "/samples/pop-art.webp",
  storybook: "/samples/storybook.webp",
  botanical: "/samples/botanical.webp",
  astronaut: "/samples/astronaut.webp",
  charcoal: "/samples/charcoal.webp",
  "mid-century": "/samples/mid-century.webp",
  holiday: "/samples/holiday.webp",
};

/** Before/after pairs: the original dog photo and the finished portrait of the same dog. */
export const BEFORE_AFTER: { before: string; after: string; style: StyleSlug; dog: string }[] = [
  { before: "/samples/pair-1-before.webp", after: "/samples/pair-1-after.webp", style: "royal", dog: "Golden Retriever" },
  { before: "/samples/pair-2-before.webp", after: "/samples/pair-2-after.webp", style: "watercolor", dog: "French Bulldog" },
  { before: "/samples/pair-3-before.webp", after: "/samples/pair-3-after.webp", style: "admiral", dog: "Beagle" },
];

/** Extra gallery portraits (various breeds/styles) for social-proof-free "wall of portraits" sections. */
export const GALLERY: { src: string; style: StyleSlug; dog: string }[] = [
  { src: "/samples/gallery-1.webp", style: "oil-classic", dog: "Golden Retriever" },
  { src: "/samples/gallery-2.webp", style: "pop-art", dog: "French Bulldog" },
  { src: "/samples/gallery-3.webp", style: "watercolor", dog: "Cavapoo" },
  { src: "/samples/gallery-4.webp", style: "admiral", dog: "Husky" },
  { src: "/samples/gallery-5.webp", style: "storybook", dog: "Cavalier King Charles" },
  { src: "/samples/gallery-6.webp", style: "charcoal", dog: "Beagle" },
];
