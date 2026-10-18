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
  /** Featured in merchandising. Label it "Featured"/"Staff pick" — never "Popular"/"Best-selling" (no sales data yet). */
  popular?: boolean;
  isNew?: boolean;
  /**
   * A dated edition: the last moment (ISO, with offset) the style can be chosen. After it, the
   * style leaves every picker, its page shows it as retired and /api/generate refuses it. Checked
   * at request time (styleAvailable), so it retires without a redeploy.
   */
  availableUntil?: string;
  /** One honest line about the edition, shown wherever the style is offered. */
  edition?: string;
};

/**
 * House-style clauses (docs/art-direction.md). Identity, composition and "no text" rules are sent by
 * PORTRAIT_SYSTEM_PROMPT in @/lib/ai/prompt.ts, so style briefs only describe the artwork.
 */
const DOG_BODY =
  "A real dog's natural anatomy: its own thick furry neck, deep narrow chest and steeply sloping shoulders; no human shoulders, no human torso, no arms or hands.";
const OIL =
  "Rich oil paint on linen canvas: visible confident brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the thin passages, a satin varnish, not glossy.";
const CALM = "A calm, dignified expression. Quiet, softly graded, empty background.";

export const STYLES: ArtStyle[] = [
  {
    slug: "royal",
    name: "The Royal",
    blurb: "Velvet, ermine and a fine gold chain. Nobility suits them.",
    description:
      "A 17th-century Flemish court portrait in rich oil paint: an oxblood velvet cape trimmed in ermine, a fine gold chain and the quiet umber background of an old-master painting. Dignified, and just a little absurd.",
    prompt: `A 17th-century Flemish court portrait in oil, in the manner of Anthony van Dyck. A dignified seated bust of the dog in a calm three-quarter view. ${DOG_BODY} A deep oxblood velvet cape with a thick white ermine trim is draped over the dog's own shoulders and chest, and a fine plain gold chain rests across the ermine, no pendant, no crown. Plain warm umber background, softly graduated and empty. A single soft window light from the upper left, deep quiet shadows. ${OIL} A museum masterpiece.`,
    swatch: "#7a2e2a",
    goodFor: ["gift", "funny", "decor"],
    popular: true,
  },
  {
    slug: "admiral",
    name: "The Admiral",
    blurb: "An officer of the high seas, in navy and gold.",
    description:
      "An 18th-century naval portrait: a navy coat with gold epaulettes, a white linen stock and a calm grey sea behind. Distinguished, a little absurd, and perfect above a desk.",
    prompt: `An 18th-century British naval portrait in oil, in the manner of Thomas Gainsborough. The dog painted from the top of its head down to its chest in a calm three-quarter view. ${DOG_BODY} A deep navy wool naval coat cut for a dog is fitted over its back and shoulders: gold bullion epaulettes rest on the dog's own sloping shoulders, a high navy collar around its furry neck, a soft white linen stock at the throat; the coat is open at the front, showing the dog's chest fur. No medals, no badges. Behind, a quiet overcast sky in slate and pale ochre over a calm dark sea, one small faint sailing ship far away. Soft daylight from the left, muted warm tones. ${OIL}`,
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
    prompt: `A quiet classical oil portrait of the dog, no costume, no collar, no accessories, in the manner of a 17th-century Dutch old master. A bust portrait in a calm three-quarter view; the fur is described by the brush, every hair direction followed. A single soft north light from the upper left. Plain background of warm umber and muted olive, softly graduated and empty. Restrained palette of umber, bone, slate and ochre. ${OIL}`,
    swatch: "#4b4232",
    goodFor: ["memorial", "decor", "gift"],
    popular: true,
  },
  {
    slug: "watercolor",
    name: "Watercolor",
    blurb: "Soft washes and loose, luminous color.",
    description:
      "Soft watercolor washes that bloom into textured cold-press paper. Light, airy and full of feeling, and well suited to memorial pieces.",
    prompt: `A fine-art watercolor portrait of the dog on heavy white cold-press cotton watercolor paper. Head and chest only. Transparent layered washes with visible pigment granulation and soft blooms, crisp precise detail in the eyes and nose; the painting dissolves into loose dry-brush strokes and bare paper toward the edges, with generous untouched white paper around the dog. The cold-press paper tooth is visible everywhere. Restrained natural palette of umber, sepia, warm ochre and slate grey with a touch of sage in the shadows. Calm and luminous, like a contemporary watercolor hung in a museum.`,
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
    prompt: `A refined fine-line ink drawing of the dog on warm white cotton rag paper. Confident continuous black ink lines with a slight natural ink bleed into the paper fibres, sparse delicate hatching only where shadows fall; no color, no solid fills, no grey wash. A generous field of empty paper around the dog, the soft cotton paper texture visible. ${CALM} A refined contemporary gallery drawing.`,
    swatch: "#d8cfc0",
    goodFor: ["decor", "memorial"],
  },
  {
    slug: "pop-art",
    name: "Pop Art",
    blurb: "Graphic, bold, made for a gallery wall.",
    description:
      "A limited-edition screenprint look: three flat matte inks (blush, ochre and black), a fine halftone in the shadows and a slight off-register on paper. Graphic and bold, never loud.",
    prompt: `A refined limited-edition screenprint portrait of the dog, printed in only three flat matte inks on warm off-white paper: pale blush pink, ochre and black. Bold simplified shapes; the black ink layer carries the features with a fine halftone in the shadows; a slight off-register between the ink layers; visible paper grain and the soft matte texture of hand-pulled screenprint ink. One single flat pale blush pink background. No neon, no gradients, no extra shapes. Calm, graphic and sophisticated, like a 1960s gallery screenprint.`,
    swatch: "#f2b134",
    goodFor: ["funny", "decor", "gift"],
  },
  {
    slug: "storybook",
    name: "Storybook",
    blurb: "A quiet picture-book plate in gouache.",
    description:
      "Matte gouache in the manner of a classic European picture book: your dog sitting in soft grass under a pale sky, with a few wildflowers. Gentle, never saccharine, and lovely for nurseries.",
    prompt: `An elegant gouache picture-book plate of the dog. The dog sits quietly in soft tall grass with a few small wildflowers under a pale bone-colored sky, with lots of calm open space. Matte opaque gouache with visible brush marks and dry-brush texture on toothy watercolor paper, a soft muted palette of sage, ochre, bone and dusty rose. Understated, poetic and refined, like a classic mid-century European picture book illustration, not cute, not cartoonish.`,
    swatch: "#c9a66b",
    goodFor: ["gift", "decor"],
    isNew: true,
  },
  {
    slug: "botanical",
    name: "Botanical",
    blurb: "Framed in vintage flowers.",
    description:
      "Your dog loosely framed by botanical stems (olive, eucalyptus, ferns and a few garden roses), drawn in fine ink and watercolor like a plate from an 18th-century natural-history book. A gentle favorite for remembering a best friend.",
    prompt: `A refined natural-history plate of the dog in fine ink line and transparent watercolor on warm ivory laid paper. The dog sits in the centre, loosely framed by a sparse arrangement of botanical stems drawn with naturalist precision: olive branches, eucalyptus, ferns and a few muted garden roses, with plenty of empty paper. Muted palette of sage, ochre, dusty rose and umber; the laid paper texture is visible. Like an 18th-century botanical plate colored by hand. No labels, no captions.`,
    swatch: "#8a9a6c",
    goodFor: ["memorial", "gift", "decor"],
  },
  {
    slug: "astronaut",
    name: "Space Cadet",
    blurb: "One small step for dog.",
    description:
      "A painterly retro-futurist portrait: an off-white 1960s space suit, a glass dome helmet and a quiet navy sky with one pale planet. Fun for kids' rooms, and still a real painting.",
    prompt: `A painterly mid-century retro-futurist oil portrait of the dog as an astronaut. A calm, dignified bust: the dog wears a simple off-white 1960s space suit with a soft ochre collar ring and a clear glass dome helmet that encloses the whole head, both ears fully inside the glass with space above them. No patches, no flags, no lettering. Behind, a quiet deep navy night sky with a few faint stars and one small pale planet. Muted palette of navy, slate, bone and ochre, a soft warm key light from the left. Visible oil brushwork and canvas texture, like a 1950s magazine illustration painted in oils.`,
    swatch: "#253055",
    goodFor: ["funny", "gift"],
  },
  {
    slug: "charcoal",
    name: "Charcoal Study",
    blurb: "An expressive charcoal sketch.",
    description:
      "A soulful charcoal and graphite study with expressive smudges and fine detail in the eyes. Timeless, monochrome, and surprisingly emotional.",
    prompt: `An expressive charcoal portrait drawing of the dog on warm toned ivory drawing paper. Rich velvety charcoal blacks, soft smudged half-tones, fine sharp detail in the eyes and nose, loose gestural strokes that fade into bare paper at the edges. The paper grain catches the charcoal everywhere, with a few soft finger smudges and lifted highlights. No color. A fine-art academic drawing from a master's studio.`,
    swatch: "#3a3733",
    goodFor: ["memorial", "decor"],
  },
  {
    slug: "mid-century",
    name: "Mid-Century",
    blurb: "Calm geometry, a warm muted palette.",
    description:
      "A 1950s gouache-and-silkscreen print: simplified shapes, an ochre circle, sage and bone, and subtle paper grain. Pairs beautifully with modern interiors.",
    prompt: `A refined 1950s mid-century modern gouache and silkscreen print of the dog. The dog sits calmly with its mouth closed and a serene, dignified expression. Simplified elegant geometric shapes: the dog is set against a large flat ochre circle and a soft sage rectangle on a warm bone background. Muted palette of ochre, sage, oxblood, bone and soft black; matte gouache with visible dry-brush texture, slight print misregistration and paper grain. Sophisticated, restrained and graphic, like a 1950s gallery print, not a cartoon, not vector art.`,
    swatch: "#d07a3c",
    goodFor: ["decor", "gift"],
  },
  {
    slug: "holiday",
    name: "Holiday Cozy",
    blurb: "A quiet, candlelit winter portrait.",
    description:
      "An intimate candlelit oil painting: a soft knit scarf, a sprig of evergreen and one warm glow on a winter evening. Made for mantels, cards and ornaments.",
    prompt: `A quiet candlelit oil painting of the dog resting on a cream knit wool blanket. A soft oatmeal knit scarf lies loosely around its neck. Beside the dog, a single small sprig of evergreen and one candle whose warm glow is the only light, falling softly from the left. Deep quiet umber and dark green shadows, a calm intimate winter evening. Restrained palette of umber, deep green, oxblood and warm ivory. ${OIL} Like an intimate 19th-century interior painting. No string lights, no ornaments, no bokeh.`,
    swatch: "#7d2b2b",
    goodFor: ["holiday", "gift"],
    isNew: true,
    availableUntil: "2026-12-31T23:59:59-08:00",
    edition: "The 2026 holiday edition, available through Dec 31.",
  },
];

export const STYLE_MAP = Object.fromEntries(STYLES.map((s) => [s.slug, s])) as Record<StyleSlug, ArtStyle>;

export function getStyle(slug: string): ArtStyle | undefined {
  return STYLE_MAP[slug as StyleSlug];
}

/** False once a dated edition has passed its availableUntil (evaluate at request time). */
export function styleAvailable(style: Pick<ArtStyle, "availableUntil"> | undefined, now: number = Date.now()): boolean {
  if (!style) return false;
  return !style.availableUntil || now <= Date.parse(style.availableUntil);
}

/** The styles that can be chosen right now, in catalog order. */
export function availableStyles(now: number = Date.now()): ArtStyle[] {
  return STYLES.filter((s) => styleAvailable(s, now));
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
  /** Size preselected in the configurator. */
  defaultVariantId: string;
  /** Production + US shipping estimate in business days. */
  shipDays: [number, number];
  frameColors?: FrameColor[];
  badge?: string;
};

export const PRODUCTS: Product[] = [
  {
    type: "canvas",
    name: "Gallery Canvas",
    shortName: "Canvas",
    tagline: "Hand-stretched canvas with a gallery wrap. Our favorite way to hang a portrait.",
    details: [
      "Poly-cotton canvas, hand-stretched over a solid wood stretcher bar",
      "Image wraps the edges for a finished gallery look",
      "Arrives ready to hang, hardware included",
    ],
    variants: [
      { id: "canvas-8x10", label: "8×10\"", widthIn: 8, heightIn: 10, price: 5900 },
      { id: "canvas-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 7900 },
      { id: "canvas-16x20", label: "16×20\"", widthIn: 16, heightIn: 20, price: 9900 },
      { id: "canvas-18x24", label: "18×24\"", widthIn: 18, heightIn: 24, price: 11500 },
      { id: "canvas-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 14900 },
    ],
    defaultVariantId: "canvas-16x20",
    shipDays: [5, 9],
    badge: "Our pick",
  },
  {
    type: "framed",
    name: "Framed Print",
    shortName: "Framed",
    tagline: "Ready to hang. The gift that gets the gasp.",
    details: [
      "Solid wood frame in black, white or natural oak",
      "Shatter-resistant acrylic glazing and hanging hardware included",
      "Archival matte paper with fade-resistant pigment inks",
    ],
    variants: [
      { id: "framed-8x10", label: "8×10\"", widthIn: 8, heightIn: 10, price: 7500 },
      { id: "framed-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 9500 },
      { id: "framed-16x20", label: "16×20\"", widthIn: 16, heightIn: 20, price: 11900 },
      { id: "framed-18x24", label: "18×24\"", widthIn: 18, heightIn: 24, price: 12900 },
      { id: "framed-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 19900 },
    ],
    defaultVariantId: "framed-12x16",
    shipDays: [5, 9],
    frameColors: ["black", "white", "oak"],
    badge: "Gift-ready",
  },
  {
    type: "poster",
    name: "Fine Art Print",
    shortName: "Print",
    tagline: "Museum-grade matte paper, rich gallery color.",
    details: [
      "Archival, acid-free matte paper (enhanced matte, 189gsm)",
      "Fade-resistant pigment inks",
      "Ships flat or rolled in a protective tube, ready for your own frame",
    ],
    variants: [
      { id: "poster-8x10", label: "8×10\"", widthIn: 8, heightIn: 10, price: 3500 },
      { id: "poster-12x16", label: "12×16\"", widthIn: 12, heightIn: 16, price: 4500 },
      { id: "poster-18x24", label: "18×24\"", widthIn: 18, heightIn: 24, price: 5900 },
      { id: "poster-24x36", label: "24×36\"", widthIn: 24, heightIn: 36, price: 7900 },
    ],
    defaultVariantId: "poster-12x16",
    shipDays: [4, 8],
  },
  {
    type: "digital",
    name: "Digital Portrait",
    shortName: "Digital",
    tagline: "The full-resolution file, delivered instantly. Free with any print.",
    details: [
      "High-resolution, print-ready file",
      "No watermark: yours to print, share and post",
      "Delivered to your inbox right after checkout",
    ],
    variants: [{ id: "digital-hires", label: "High-res file", widthIn: 0, heightIn: 0, price: 2900 }],
    defaultVariantId: "digital-hires",
    shipDays: [0, 0],
  },
];

/** Order bumps: the same portrait on a small gift. Only offered alongside a physical piece. */
export type Addon = { id: string; name: string; description: string; price: number };

export const ADDONS: Addon[] = [
  { id: "addon-ornament", name: "Matching ornament", description: "3\" glossy ceramic ornament with your portrait on both sides", price: 1900 },
  { id: "addon-mug", name: "Matching mug", description: "11oz glossy ceramic mug, dishwasher safe", price: 2500 },
];

export function findAddon(id: string): Addon | undefined {
  return ADDONS.find((a) => a.id === id);
}

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

/** Lowest physical-product price ("prints from $35"). */
export const STARTING_PHYSICAL_PRICE = Math.min(
  ...PRODUCTS.filter((p) => p.type !== "digital").flatMap((p) => p.variants.map((v) => v.price)),
);

/** The hi-res digital file is included free with any physical piece. */
export const DIGITAL_INCLUDED_WITH_PHYSICAL = true;

/** Countries we ship physical products to at launch, with flat shipping per order (cents). US is free. */
export const SHIPPING_RATES: Record<"US" | "CA", number> = { US: 0, CA: 995 };
export const SHIPPING_COUNTRIES = Object.keys(SHIPPING_RATES) as ("US" | "CA")[];

/** Kept for compatibility: US shipping is always free, so the threshold is $0. */
export const FREE_SHIPPING_THRESHOLD = 0;
export const FLAT_SHIPPING = 0;

/** Guarantee + promise copy, reused across the site. */
export const PROMISES = {
  preview: "See your portrait free before you pay",
  rerolls: "Try every style free — redo as often as you like",
  guarantee: "Love it or we'll remake or refund it",
  shipping: "Free US shipping on every order",
  digital: "Free hi-res digital file with every print",
};
