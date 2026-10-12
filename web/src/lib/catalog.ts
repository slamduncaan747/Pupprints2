/**
 * Pup Prints catalog: art styles + physical/digital products.
 * Prices are integer cents (USD). This module is safe to import on client and server.
 */

export type StyleSlug =
  | "royal"
  | "admiral"
  | "oil-classic"
  | "watercolor"
  | "fine-line"
  | "pop-art"
  | "storybook"
  | "botanical"
  | "astronaut"
  | "charcoal"
  | "mid-century"
  | "holiday";

export type ArtStyle = {
  slug: StyleSlug;
  name: string;
  /** Short line shown on style cards. */
  blurb: string;
  /** Longer marketing copy for the style landing page. */
  description: string;
  /** Prompt sent to the image model. The model receives the pet photo as reference. */
  prompt: string;
  /** Background/accent color used for the style card. */
  swatch: string;
  /** Which occasions this style is especially good for (used for merchandising). */
  goodFor: ("gift" | "memorial" | "funny" | "decor" | "holiday")[];
  popular?: boolean;
  isNew?: boolean;
};

const IDENTITY =
  "Use the dog in the reference photo as the subject. Preserve its exact breed, face shape, eye color, ear shape, fur color, markings and proportions so the owner instantly recognizes their own dog. Keep the dog's head large and centered with comfortable margin around the subject for cropping. No text, no letters, no signature, no watermark, no frame.";

export const STYLES: ArtStyle[] = [
  {
    slug: "royal",
    name: "The Royal",
    blurb: "Velvet, ermine and a crown. Nobility suits them.",
    description:
      "A Renaissance court portrait in rich oil paint: a velvet robe trimmed in ermine, gold chains and jewels, and the dramatic candlelit background of an old-master painting. Our best-selling style for a reason.",
    prompt: `A regal Renaissance oil painting portrait of the dog as a noble monarch, wearing a deep crimson velvet robe with white ermine fur trim, an ornate gold chain with a jeweled medallion, and a small jeweled crown. Dark umber background with soft candlelight, dramatic chiaroscuro, visible brushwork, craquelure-free museum quality, in the manner of 17th-century Dutch and Flemish court painters. ${IDENTITY}`,
    swatch: "#7a2e2a",
    goodFor: ["gift", "funny", "decor"],
    popular: true,
  },
  {
    slug: "admiral",
    name: "The Admiral",
    blurb: "A decorated officer of the high seas.",
    description:
      "An 18th-century naval officer portrait: navy dress coat, gold epaulettes, a chest of medals and a stormy seascape behind. Distinguished, a little absurd, and perfect above a desk.",
    prompt: `A classical 18th-century oil painting portrait of the dog as a distinguished naval admiral, wearing a navy blue officer's dress coat with gold epaulettes, gold buttons, braided cords and a row of medals. Background of a moody stormy sea with a tall ship, warm varnished tones, museum quality old-master brushwork. ${IDENTITY}`,
    swatch: "#1f2f4a",
    goodFor: ["gift", "funny", "decor"],
    popular: true,
  },
  {
    slug: "oil-classic",
    name: "Old Master",
    blurb: "Just your dog, painted like a museum piece.",
    description:
      "No costume, no gimmick: your dog as the subject of a timeless oil painting with Rembrandt lighting and a quiet, warm background. Elegant enough for any room.",
    prompt: `A timeless classical oil painting portrait of the dog, no costume, natural fur rendered with confident visible brush strokes. Rembrandt lighting, warm muted olive and umber background, subtle glazing, fine-art gallery quality. ${IDENTITY}`,
    swatch: "#4b4232",
    goodFor: ["memorial", "decor", "gift"],
    popular: true,
  },
  {
    slug: "watercolor",
    name: "Watercolor",
    blurb: "Soft washes and loose, luminous color.",
    description:
      "A hand-painted look with soft watercolor washes that bloom into textured cold-press paper. Light, airy and full of feeling — a favorite for memorial pieces.",
    prompt: `A delicate loose watercolor painting of the dog on textured white cold-press watercolor paper. Soft translucent washes, gentle color blooms and bleeds, fine ink-free detail around the eyes and nose, lots of white negative space around the subject, airy and luminous. ${IDENTITY}`,
    swatch: "#7fa6b5",
    goodFor: ["memorial", "gift", "decor"],
    popular: true,
  },
  {
    slug: "fine-line",
    name: "Fine Line",
    blurb: "Minimal ink lines on warm paper.",
    description:
      "A modern minimalist portrait drawn in confident black ink lines on warm off-white paper. Quietly chic — made for gallery walls and modern spaces.",
    prompt: `A minimalist fine-line ink illustration of the dog, elegant continuous black ink linework with minimal hatching, on plain warm off-white paper, lots of empty space, modern Scandinavian art print aesthetic, no color fill. ${IDENTITY}`,
    swatch: "#d8cfc0",
    goodFor: ["decor", "memorial"],
  },
  {
    slug: "pop-art",
    name: "Pop Art",
    blurb: "Bold, bright, gallery-wall loud.",
    description:
      "A punchy 1960s pop-art portrait with saturated flat color, halftone dots and graphic shadows. Loud in the best way.",
    prompt: `A bold 1960s pop art portrait of the dog, flat saturated colors (hot pink, electric yellow, cyan, orange), thick black graphic outlines, Ben-Day halftone dot shading, solid bright contrasting background, screen-print aesthetic. ${IDENTITY}`,
    swatch: "#f2b134",
    goodFor: ["funny", "decor", "gift"],
  },
  {
    slug: "storybook",
    name: "Storybook",
    blurb: "A cozy children's-book illustration.",
    description:
      "Warm gouache and colored pencil in the style of a classic picture book, with your dog as the hero. Sweet for nurseries and kids' rooms.",
    prompt: `A whimsical cozy children's picture book illustration of the dog, painted in gouache and colored pencil, warm soft palette, gentle textured paper grain, simple meadow background with a few wildflowers, charming and heartfelt. ${IDENTITY}`,
    swatch: "#c9a66b",
    goodFor: ["gift", "decor"],
    isNew: true,
  },
  {
    slug: "botanical",
    name: "Botanical",
    blurb: "Framed in vintage flowers.",
    description:
      "Your dog surrounded by a wreath of hand-painted botanical flowers and leaves, like a page from a vintage naturalist's journal. Our most-requested style for remembering a best friend.",
    prompt: `A vintage botanical illustration portrait of the dog surrounded by a soft wreath of hand-painted wildflowers, roses, eucalyptus leaves and ferns, muted cream parchment background, fine detailed naturalist illustration style, gentle and serene. ${IDENTITY}`,
    swatch: "#8a9a6c",
    goodFor: ["memorial", "gift", "decor"],
  },
  {
    slug: "astronaut",
    name: "Space Cadet",
    blurb: "One small step for dog.",
    description:
      "A retro-futurist astronaut portrait: a gleaming space suit, a glass helmet and a field of stars and planets. Fun for kids' rooms and anyone who thinks their dog is out of this world.",
    prompt: `A retro-futurist painted portrait of the dog as an astronaut wearing a white and orange vintage space suit with mission patches, clear glass helmet open at the face, deep starry space background with a ringed planet, cinematic rim lighting, highly detailed digital painting. ${IDENTITY}`,
    swatch: "#253055",
    goodFor: ["funny", "gift"],
  },
  {
    slug: "charcoal",
    name: "Charcoal Study",
    blurb: "An expressive hand-drawn sketch.",
    description:
      "A soulful charcoal and graphite study with expressive smudges and fine detail in the eyes. Timeless, monochrome, and surprisingly emotional.",
    prompt: `An expressive charcoal and graphite portrait drawing of the dog on toned cream paper, rich blacks, soft smudged shading, fine detail in the eyes and nose, loose gestural strokes fading out at the edges, fine-art academic drawing. ${IDENTITY}`,
    swatch: "#3a3733",
    goodFor: ["memorial", "decor"],
  },
  {
    slug: "mid-century",
    name: "Mid-Century",
    blurb: "Flat shapes, warm retro palette.",
    description:
      "A graphic mid-century modern poster: simplified shapes, a warm retro palette and subtle paper texture. Pairs beautifully with modern interiors.",
    prompt: `A mid-century modern graphic poster illustration of the dog, simplified geometric flat shapes, warm retro palette of mustard, burnt orange, teal and cream, subtle risograph paper texture, clean composition, 1960s print aesthetic. ${IDENTITY}`,
    swatch: "#d07a3c",
    goodFor: ["decor", "gift"],
  },
  {
    slug: "holiday",
    name: "Holiday Cozy",
    blurb: "A festive portrait by the fire.",
    description:
      "A warm holiday oil painting: a knit scarf, twinkling lights and a crackling fireplace. The holiday card and ornament everyone asks about.",
    prompt: `A warm festive holiday oil painting portrait of the dog wearing a cozy red and green knit scarf, sitting by a glowing fireplace with twinkling string lights, evergreen garland and soft bokeh, rich warm tones, nostalgic and joyful. ${IDENTITY}`,
    swatch: "#7d2b2b",
    goodFor: ["holiday", "gift"],
    isNew: true,
  },
];

export const STYLE_MAP = Object.fromEntries(STYLES.map((s) => [s.slug, s])) as Record<StyleSlug, ArtStyle>;

export function getStyle(slug: string): ArtStyle | undefined {
  return STYLE_MAP[slug as StyleSlug];
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export type ProductType = "digital" | "poster" | "framed" | "canvas";
export type FrameColor = "black" | "white" | "oak";

export type Variant = {
  /** Stable SKU used in checkout metadata + fulfillment mapping. */
  id: string;
  label: string;
  widthIn: number;
  heightIn: number;
  price: number;
  compareAt?: number;
};

export type Product = {
  type: ProductType;
  name: string;
  shortName: string;
  tagline: string;
  details: string[];
  variants: Variant[];
  /** Minimum production + shipping estimate in business days. */
  shipDays: [number, number];
  frameColors?: FrameColor[];
  badge?: string;
};

export const PRODUCTS: Product[] = [
  {
    type: "digital",
    name: "Digital Portrait",
    shortName: "Digital",
    tagline: "The full-resolution file, delivered instantly.",
    details: [
      "Print-ready high-resolution file (up to 24×30\" at 300 DPI)",
      "Unwatermarked, yours to print, share and post",
      "Delivered to your inbox in minutes",
    ],
    variants: [{ id: "digital-hires", label: "High-res file", widthIn: 0, heightIn: 0, price: 2900 }],
    shipDays: [0, 0],
  },
  {
    type: "poster",
    name: "Fine Art Print",
    shortName: "Print",
    tagline: "Archival matte paper, rich gallery color.",
    details: [
      "Museum-grade 200gsm archival matte paper",
      "Fade-resistant pigment inks rated for 100+ years",
      "Shipped flat or in a rigid tube",
    ],
    variants: [
      { id: "poster-8x10", label: "8×10\"", widthIn: 8, heightIn: 10, price: 3900 },
      { id: "poster-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 4900 },
      { id: "poster-18x24", label: "18×24\"", widthIn: 18, heightIn: 24, price: 6900 },
      { id: "poster-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 8900 },
    ],
    shipDays: [3, 7],
  },
  {
    type: "framed",
    name: "Framed Print",
    shortName: "Framed",
    tagline: "Ready to hang. The gift that gets the gasp.",
    details: [
      "Solid wood frame in black, white or natural oak",
      "Shatter-resistant acrylic glazing and hanging hardware included",
      "Archival matte paper with pigment inks",
    ],
    variants: [
      { id: "framed-8x10", label: "8×10\"", widthIn: 8, heightIn: 10, price: 7900 },
      { id: "framed-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 10900 },
      { id: "framed-18x24", label: "18×24\"", widthIn: 18, heightIn: 24, price: 14900 },
      { id: "framed-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 19900 },
    ],
    shipDays: [4, 8],
    frameColors: ["black", "white", "oak"],
    badge: "Most gifted",
  },
  {
    type: "canvas",
    name: "Gallery Canvas",
    shortName: "Canvas",
    tagline: "Hand-stretched canvas with a gallery wrap.",
    details: [
      "Poly-cotton canvas, hand-stretched over a 1.25\" wood frame",
      "Image wraps the edges for a finished gallery look",
      "Arrives ready to hang",
    ],
    variants: [
      { id: "canvas-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 9900 },
      { id: "canvas-16x20", label: "16×20\"", widthIn: 16, heightIn: 20, price: 12900 },
      { id: "canvas-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 18900 },
    ],
    shipDays: [4, 8],
  },
];

export const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.type, p])) as Record<ProductType, Product>;

export function findVariant(variantId: string): { product: Product; variant: Variant } | undefined {
  for (const product of PRODUCTS) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return undefined;
}

/** Lowest price across all products, for "from $X" copy. */
export const STARTING_PRICE = Math.min(...PRODUCTS.flatMap((p) => p.variants.map((v) => v.price)));

/** Add the hi-res digital file to any physical order for this price. */
export const DIGITAL_ADDON_PRICE = 1000;

/** Free US shipping threshold (cents). Orders below pay FLAT_SHIPPING. */
export const FREE_SHIPPING_THRESHOLD = 7500;
export const FLAT_SHIPPING = 795;

/** Guarantee + promise copy, reused across the site. */
export const PROMISES = {
  preview: "See your portrait free before you pay",
  rerolls: "Try every style free — redo as often as you like",
  guarantee: "Love it or we'll remake or refund it",
  shipping: `Free US shipping on orders over $${FREE_SHIPPING_THRESHOLD / 100}`,
};
