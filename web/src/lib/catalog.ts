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
  | "watercolor"
  | "modern-sage"
  | "fine-line"
  | "pastel"
  | "modern-oil"
  | "charcoal"
  | "oil-classic"
  | "botanical"
  | "linocut";

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
  /** The dog's name is lettered on the portrait (small capitals at the top) when the customer gives one. */
  lettering?: boolean;
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
const OIL =
  "Rich oil paint on linen canvas: visible confident brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the thin passages, a satin varnish, not glossy.";
const CALM = "A calm, dignified expression. Quiet, softly graded, empty background.";

/** The Modern portrait: one brief, one flat ground color per style. */
function modernPrompt(ground: string): string {
  return `A modern illustrated portrait of the dog: a clean contemporary digital illustration, like a Scandinavian art print. ${SUBJECT} Head and chest bust, centred, facing the viewer, the chest ending in a soft straight edge near the bottom. Leave the top fifth of the image as empty background above the ears. The dog is drawn with smooth, simplified but faithful fur shading in its true coat colors: soft tonal shapes, no outline, no black line work, no brush texture; bright natural eyes with a small catch-light. The background is one flat, matte, even ${ground} from edge to edge: no texture, no shadow, no gradient, no vignette, no objects, no text. Soft even front light, no dramatic shadows. No collar, no accessories. Calm, light and graphic, like a contemporary print for a modern home, not a cartoon.`;
}

export const STYLES: ArtStyle[] = [
  {
    slug: "modern",
    name: "Modern",
    blurb: "A clean illustrated portrait on soft white.",
    description:
      "A contemporary illustration of your dog: head and chest, drawn in smooth, true-to-coat tones on one flat field of soft white. No line work, no drama. Light, graphic and easy to place in any room.",
    prompt: modernPrompt("warm off-white (#F4F1EA)"),
    swatch: "#F4F1EA",
    lettering: true,
    goodFor: ["decor", "gift", "memorial"],
    popular: true,
    isNew: true,
  },
  {
    slug: "watercolor",
    name: "Watercolor",
    blurb: "Soft washes on cotton paper, light and luminous.",
    description:
      "Transparent washes that bloom into cold-press paper, crisp in the eyes and loose at the edges, with plenty of white around your dog. Light, airy and gentle, and a natural choice for a memorial piece.",
    prompt: `A fine-art watercolor portrait of the dog on heavy white cold-press cotton watercolor paper. ${SUBJECT} Head and chest only. Transparent layered washes with visible pigment granulation and soft blooms, crisp precise detail in the eyes and nose; the painting dissolves into loose dry-brush strokes and bare paper toward the edges, with generous untouched white paper around the dog. The cold-press paper tooth is visible everywhere. Restrained natural palette of umber, sepia, warm ochre and slate grey with a touch of sage in the shadows. Calm and luminous, like a contemporary watercolor hung in a museum.`,
    swatch: "#7fa6b5",
    goodFor: ["memorial", "gift", "decor"],
    popular: true,
  },
  {
    slug: "modern-sage",
    name: "Modern Sage",
    blurb: "The Modern portrait on a quiet sage ground.",
    description:
      "The same clean illustration, set on one flat field of muted sage. A little color for a pale wall, and a ground that flatters golden, cream and black coats alike.",
    prompt: modernPrompt("muted sage green (#B9C2AE)"),
    swatch: "#B9C2AE",
    lettering: true,
    goodFor: ["decor", "gift", "memorial"],
    isNew: true,
  },
  {
    slug: "fine-line",
    name: "Fine Line",
    blurb: "Minimal ink lines on warm paper.",
    description:
      "A minimalist portrait in confident black ink lines on warm off-white paper, with only a little hatching where the shadows fall. Quiet, modern and made for a gallery wall.",
    prompt: `A refined fine-line ink drawing of the dog on warm white cotton rag paper. ${SUBJECT} Confident continuous black ink lines with a slight natural ink bleed into the paper fibres, sparse delicate hatching only where shadows fall; no color, no solid fills, no grey wash. A generous field of empty paper around the dog, the soft cotton paper texture visible. ${CALM} A refined contemporary gallery drawing.`,
    swatch: "#d8cfc0",
    goodFor: ["decor", "memorial"],
  },
  {
    slug: "pastel",
    name: "Soft Pastel",
    blurb: "Velvety pastel on toned paper.",
    description:
      "Soft pastel in the manner of a studio portrait: velvety layers for the coat, a few crisp marks in the eyes and the tooth of warm toned paper showing through. Gentle, tactile and very easy to live with.",
    prompt: `A soft pastel portrait of the dog on warm toned pastel paper (a mid-tone sand or grey-beige). ${SUBJECT} Head and chest in a calm three-quarter view. Velvety layered pastel strokes follow the direction of the fur, softly blended in the shadows and left as open, chalky strokes in the lights; crisp precise detail in the eyes and nose with a small catch-light. The toned paper is left bare around the dog and shows through between strokes, its tooth visible everywhere; the drawing fades out loosely toward the chest. A single soft light from the upper left. Restrained natural palette of umber, bone, ochre and slate with the dog's true coat colors. Matte, powdery surface. Like a fine pastel portrait from an artist's studio.`,
    swatch: "#b3a394",
    goodFor: ["memorial", "gift", "decor"],
  },
  {
    slug: "modern-oil",
    name: "Modern Oil",
    blurb: "Thick, confident oil on a quiet field of color.",
    description:
      "A contemporary oil portrait in broad palette-knife strokes: your dog built from thick, simple planes of paint against one flat, muted color. Painterly up close, calm from across the room.",
    prompt: `A contemporary oil portrait of the dog painted with a palette knife and broad flat brushes on linen canvas. ${SUBJECT} Head and chest in a calm three-quarter view. The dog's true coat colors are built from thick, simplified planes of impasto paint with crisp knife edges and visible ridges; the eyes and nose are painted with smaller, careful strokes. Behind the dog, one single flat muted color field (a soft sage, slate or dusty ochre chosen to flatter the coat), scraped thin so the canvas weave shows through, with no objects and no horizon. A single soft daylight from the upper left. Restrained palette of bone, umber, slate, sage and ochre; no neon, no saturated primaries. Matte to satin surface, not glossy. Like a contemporary gallery painting, quiet and assured.`,
    swatch: "#8b958a",
    goodFor: ["decor", "gift"],
    popular: true,
  },
  {
    slug: "charcoal",
    name: "Charcoal Study",
    blurb: "A charcoal drawing, all eyes and soft shadow.",
    description:
      "A monochrome study on warm paper: velvety blacks, soft smudged half-tones and fine detail in the eyes, with loose strokes that fade into bare paper. Timeless, and often the most moving of all.",
    prompt: `An expressive charcoal portrait drawing of the dog on warm toned ivory drawing paper. ${SUBJECT} Rich velvety charcoal blacks, soft smudged half-tones, fine sharp detail in the eyes and nose, loose gestural strokes that fade into bare paper at the edges. The paper grain catches the charcoal everywhere, with a few soft finger smudges and lifted highlights. No color. A fine-art academic drawing from a master's studio.`,
    swatch: "#3a3733",
    goodFor: ["memorial", "decor", "gift"],
    popular: true,
  },
  {
    slug: "oil-classic",
    name: "Old Master",
    blurb: "Your dog in oil, lit like a museum portrait.",
    description:
      "A quiet classical oil portrait: one soft light from the side, a warm umber ground and brushwork that follows every turn of the coat. It sits as easily above a mantel as beside modern furniture.",
    prompt: `A quiet classical oil portrait of the dog, in the manner of a 17th-century Dutch old master. ${SUBJECT} A bust portrait in a calm three-quarter view; the fur is described by the brush, every hair direction followed. A single soft north light from the upper left. Plain background of warm umber and muted olive, softly graduated and empty. Restrained palette of umber, bone, slate and ochre. ${OIL}`,
    swatch: "#4b4232",
    goodFor: ["decor", "memorial", "gift"],
    popular: true,
  },
  {
    slug: "botanical",
    name: "Botanical",
    blurb: "Framed by garden stems, like a naturalist's plate.",
    description:
      "Your dog in fine ink and watercolor, loosely framed by olive, eucalyptus, ferns and a few garden roses, in the manner of a plate from an 18th-century natural-history book. A gentle way to remember a best friend.",
    prompt: `A refined natural-history plate of the dog in fine ink line and transparent watercolor on warm ivory laid paper. The dog wears nothing: no costume, no clothing, no collar. The dog sits in the centre, loosely framed by a sparse arrangement of botanical stems drawn with naturalist precision: olive branches, eucalyptus, ferns and a few muted garden roses, with plenty of empty paper. Muted palette of sage, ochre, dusty rose and umber; the laid paper texture is visible. Like an 18th-century botanical plate colored by hand. No labels, no captions.`,
    swatch: "#8a9a6c",
    goodFor: ["memorial", "gift", "decor"],
  },
  {
    slug: "linocut",
    name: "Linocut",
    blurb: "A relief print in one or two inks, carving marks and all.",
    description:
      "The look of a block print pulled on cream paper: bold carved shapes, one or two matte inks and the small gouge marks that make a relief print feel made. Graphic and warm, at home on a kitchen or hallway wall.",
    prompt: `A hand-carved linocut relief print of the dog, printed by hand from two carved linoleum blocks on cream cotton printmaking paper: first one flat block of muted ochre, then the key block in dense black relief ink. ${SUBJECT} Head and chest only. Every mark is either solid opaque black ink or bare paper: the dark fur is solid black with thin white lines carved out of it, the light fur is bare cream paper with short black gouge cuts, and the fur is described by tapering V-shaped cuts that follow the direction of the hair. Bold simplified shapes with slightly rough, hand-cut edges. The muted ochre ink is one flat rectangular block behind the dog, with the same dry, slightly mottled hand-rolled texture as the black. A few stray chatter marks left by the gouge in the cleared areas, a slight misregistration between the two blocks. Empty cream paper around the print. No grey tones, no washes, no gradients, no pen lines, no watercolour. Like a limited-edition relief print from a small printmaker's studio, not a cartoon, not vector art.`,
    swatch: "#2f3a35",
    goodFor: ["decor", "gift"],
  },
];

/** The style preselected wherever one is needed (create flow, admin gift/pop-up/batch tools). */
export const DEFAULT_STYLE: StyleSlug = "modern";

/**
 * Styles we used to sell and no longer do. Stored generations, orders and gifts can still carry
 * these slugs, so: lookups must tolerate them (styleLabel), /api/generate refuses them with 410,
 * and next.config.ts redirects their old /styles/<slug> pages to /styles.
 */
export const RETIRED_STYLE_SLUGS = ["royal", "admiral", "astronaut", "pop-art", "storybook", "holiday", "ink-wash", "mid-century"] as const;

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
