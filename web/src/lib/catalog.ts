/**
 * Pup Prints catalog: art styles + physical/digital products.
 * Prices are integer cents (USD). This module is safe to import on client and server.
 *
 * The collection is dog-centred and crafted: every style is a real artist's medium or a clean modern
 * illustration, with the dog
 * as the whole subject. No costumes, props, scenes or novelty styles.
 */

export type StyleSlug =
  | "modern"
  | "modern-sage"
  | "watercolor"
  | "fine-line"
  | "pastel"
  | "modern-oil"
  | "charcoal";

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
  goodFor: ("gift" | "memorial" | "decor")[];
  /** Featured in merchandising. Label it "Featured"/"Staff pick" — never "Popular"/"Best-selling" (no sales data yet). */
  popular?: boolean;
  isNew?: boolean;
  /**
   * Tools with no "add the name" choice of their own (the admin gift studio) letter a given name on
   * these styles. The create flow asks the customer instead (nameOnArt) and letters any style.
   */
  lettering?: boolean;
  /** Flat-ground styles: the exact background color the finished portrait is set to. */
  ground?: string;
  /** The paper color this style is made on; the finished portrait is color-balanced to it. */
  paper?: string;
  /** A black-and-white medium: the finished portrait is made neutral grey on its paper. */
  mono?: boolean;
  /**
   * A dated edition: the last moment (ISO, with offset) the style can be chosen. After it, the
   * style leaves every picker, its page shows it as retired and /api/generate refuses it. Checked
   * at request time (styleAvailable), so it retires without a redeploy. No style uses it today.
   */
  availableUntil?: string;
  /** One honest line about the edition, shown wherever the style is offered. */
  edition?: string;
};

/**
 * House-style clauses (docs/art-direction.md). Identity, composition and "no text" rules are sent by
 * PORTRAIT_SYSTEM_PROMPT in @/lib/ai/prompt.ts, so style briefs only describe the artwork.
 *
 * STYLE PROMPTS LIVE HERE AND ONLY HERE: when the image lead sends final prompt text for a style,
 * replace that style's `prompt` below.
 */
const SUBJECT =
  "The dog itself is the whole subject: no costume, no clothing, no collar, no props, no scene.";
const CALM = "A calm, dignified expression. Quiet, softly graded, empty background.";

/** The Modern portrait: one brief, one flat ground color per style. */
function modernPrompt(ground: string): string {
  return `A modern illustrated portrait of the dog: a soft, contemporary digital painting in the style of a modern pet portrait print. ${SUBJECT} Head and chest bust, centred, facing the viewer, the chest running off the bottom edge. Leave the top fifth of the image as empty background above the ears. The dog is painted with smooth, softly blended fur shading in its true coat colors: gently simplified, with soft gradual transitions of tone, the real structure of the face and the direction of the fur still visible, and softly feathered fur edges; lifelike bright eyes with a small catch-light and a naturally shaded nose. No outline, no black line work, no hard-edged flat shapes, not vector art, not a cartoon, not a photograph. The background is one flat, matte, even ${ground} from edge to edge: no texture, no shadow, no gradient, no vignette, no objects. Soft even front light, no dramatic shadows. No collar, no accessories. Calm, light and refined, like a contemporary print for a modern home.`;
}

export const STYLES: ArtStyle[] = [
  {
    slug: "modern",
    name: "Modern",
    blurb: "A clean illustration on soft white.",
    description: "Your dog's head and chest, drawn in smooth, true colors on a flat off-white background.",
    prompt: modernPrompt("warm off-white (#F4F1EA)"),
    swatch: "#F4F1EA",
    lettering: true,
    ground: "#F4F1EA",
    goodFor: ["decor", "gift", "memorial"],
    popular: true,
  },
  {
    slug: "modern-sage",
    name: "Modern Sage",
    blurb: "The same illustration on sage green.",
    description: "The Modern portrait on a flat, muted sage green. A little color for a pale wall.",
    prompt: modernPrompt("muted sage green (#B9C2AE)"),
    swatch: "#B9C2AE",
    lettering: true,
    ground: "#B9C2AE",
    goodFor: ["decor", "gift", "memorial"],
  },
  {
    slug: "watercolor",
    name: "Watercolor",
    blurb: "Soft washes on white paper.",
    description: "Light, transparent washes with sharp detail in the eyes and plenty of white paper around your dog.",
    prompt: `A fine-art watercolor portrait of the dog on heavy white cold-press cotton watercolor paper. ${SUBJECT} Head and chest only. Transparent layered washes with visible pigment granulation and soft blooms, crisp precise detail in the eyes and nose; the painting dissolves into loose dry-brush strokes and bare paper toward the edges, with generous untouched white paper around the dog. The cold-press paper tooth is visible everywhere. Restrained natural palette of umber, sepia, warm ochre and slate grey with a touch of sage in the shadows. Calm and luminous, like a contemporary watercolor hung in a museum.`,
    swatch: "#7fa6b5",
    paper: "#F7F6F2",
    goodFor: ["memorial", "gift", "decor"],
    popular: true,
  },
  {
    slug: "fine-line",
    name: "Line Drawing",
    blurb: "Black ink lines on warm paper.",
    description: "Your dog in black ink lines on off-white paper, with a little hatching in the shadows. No color.",
    prompt: `A refined fine-line ink drawing of the dog on warm white cotton rag paper. ${SUBJECT} Confident continuous black ink lines with a slight natural ink bleed into the paper fibres, sparse delicate hatching only where shadows fall; no color, no solid fills, no grey wash. A generous field of empty paper around the dog, the soft cotton paper texture visible. ${CALM} A refined contemporary gallery drawing.`,
    swatch: "#d8cfc0",
    paper: "#F4F1EA",
    mono: true,
    goodFor: ["decor", "memorial"],
  },
  {
    slug: "pastel",
    name: "Pastel",
    blurb: "Soft pastel on toned paper.",
    description: "Layered pastel strokes on warm, sand-colored paper, with fine detail in the eyes.",
    prompt: `A soft pastel portrait of the dog on warm toned pastel paper (a mid-tone sand or grey-beige). ${SUBJECT} Head and chest in a calm three-quarter view. Velvety layered pastel strokes follow the direction of the fur, softly blended in the shadows and left as open, chalky strokes in the lights; crisp precise detail in the eyes and nose with a small catch-light. The toned paper is left bare around the dog and shows through between strokes, its tooth visible everywhere; the drawing fades out loosely toward the chest. A single soft light from the upper left. Restrained natural palette of umber, bone, ochre and slate with the dog's true coat colors. Matte, powdery surface. Like a fine pastel portrait from an artist's studio.`,
    swatch: "#b3a394",
    paper: "#D2CAC0",
    goodFor: ["memorial", "gift", "decor"],
  },
  {
    slug: "modern-oil",
    name: "Oil",
    blurb: "Thick oil paint on a flat color.",
    description: "Broad palette-knife strokes in your dog's real colors, against one flat, muted background.",
    prompt: `A contemporary oil portrait of the dog painted with a palette knife and broad flat brushes on linen canvas. ${SUBJECT} Head and chest in a calm three-quarter view. The dog's true coat colors are built from thick, simplified planes of impasto paint with crisp knife edges and visible ridges; the eyes and nose are painted with smaller, careful strokes. Behind the dog, one single flat muted color field (a soft sage, slate or dusty ochre chosen to flatter the coat), scraped thin so the canvas weave shows through, with no objects and no horizon. A single soft daylight from the upper left. Restrained palette of bone, umber, slate, sage and ochre; no neon, no saturated primaries. Matte to satin surface, not glossy. Like a contemporary gallery painting, quiet and assured.`,
    swatch: "#8b958a",
    goodFor: ["decor", "gift"],
    popular: true,
  },
  {
    slug: "charcoal",
    name: "Charcoal",
    blurb: "A black-and-white charcoal drawing.",
    description: "Deep blacks, soft grey shading and sharp eyes on warm paper. No color.",
    prompt: `An expressive charcoal portrait drawing of the dog on warm toned ivory drawing paper. ${SUBJECT} Rich velvety charcoal blacks, soft smudged half-tones, fine sharp detail in the eyes and nose, loose gestural strokes that fade into bare paper at the edges. The paper grain catches the charcoal everywhere, with a few soft finger smudges and lifted highlights. No color. A fine-art academic drawing from a master's studio.`,
    swatch: "#3a3733",
    paper: "#EFEBE1",
    mono: true,
    goodFor: ["memorial", "decor", "gift"],
    popular: true,
  },
];

/** The style preselected wherever one is needed (create flow, admin gift/pop-up/batch tools). */
export const DEFAULT_STYLE: StyleSlug = "modern";

/**
 * Styles we used to sell and no longer do. Stored generations, orders and gifts can still carry
 * these slugs, so: lookups must tolerate them (styleLabel), /api/generate refuses them with 410,
 * and next.config.ts redirects their old /styles/<slug> pages to /styles.
 */
export const RETIRED_STYLE_SLUGS = ["royal", "admiral", "astronaut", "pop-art", "storybook", "holiday", "ink-wash", "mid-century", "oil-classic", "botanical", "linocut"] as const;

export function isRetiredStyle(slug: string): boolean {
  return (RETIRED_STYLE_SLUGS as readonly string[]).includes(slug);
}

/** A display name for any stored style slug: the catalog name, or "Retired style" for one we no longer sell. */
export function styleLabel(slug: string | null | undefined): string {
  if (!slug) return "Portrait";
  return STYLE_MAP[slug as StyleSlug]?.name ?? "Retired style";
}

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
    tagline: "Stretched canvas with wrapped edges, ready to hang.",
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
    tagline: "A framed print, ready to hang.",
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
    tagline: "Archival matte paper, for your own frame.",
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
    tagline: "The full-resolution file, sent right after checkout. Included with any print.",
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

