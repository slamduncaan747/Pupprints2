/**
 * Landing-page copy for each art style (SEO keyword, headline, merchandising hints).
 * Style names, blurbs and descriptions come from @/lib/catalog; this only adds page copy.
 */
import { honestText } from "@/components/marketing/honest";
import { availableStyles, type ArtStyle, type FrameColor, type ProductType, type StyleSlug } from "@/lib/catalog";

export type GoodFor = ArtStyle["goodFor"][number];

export const GOOD_FOR_LABELS: Record<GoodFor, string> = {
  gift: "Gifts",
  memorial: "Memorials",
  decor: "Home decor",
};

export type StyleContent = {
  /** Primary search phrase, e.g. "Watercolor dog portrait from photo". */
  keyword: string;
  /** Page <title> (site name is appended by the layout template). */
  title: string;
  metaDescription: string;
  h1: string;
  /** Three short reasons/notes for the "why this style" list. */
  points: { title: string; body: string }[];
  photoTip: string;
  /** Product types this style looks best on, best first. */
  bestOn: ProductType[];
  frame: FrameColor;
};

const CONTENT: Partial<Record<StyleSlug, StyleContent>> = {
  modern: {
    keyword: "Modern dog portrait from photo",
    title: "Modern Dog Portrait from Your Photo",
    metaDescription:
      "A clean modern illustration of your dog on soft white, made from your photo. See it before you buy, then order a print, framed print or canvas.",
    h1: "Your dog, clean and modern",
    points: [
      { title: "Only the dog", body: "Head and chest on one flat field of soft white. Nothing else in the picture." },
      { title: "True to the coat", body: "Smooth, simplified shading in their real colors, with the eyes kept bright." },
      { title: "Easy to place", body: "Light and graphic. It sits well beside prints, photographs and pale walls." },
    ],
    photoTip: "A front-facing photo in soft, even light, with both ears in the frame, gives the cleanest result.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  "modern-sage": {
    keyword: "Modern dog portrait on a color background",
    title: "Modern Dog Portrait on Sage, from Your Photo",
    metaDescription:
      "A clean modern illustration of your dog on flat sage green, made from your photo. See it before you buy, then order a print, framed print or canvas.",
    h1: "The Modern portrait, on sage green",
    points: [
      { title: "One flat color", body: "Matte sage green from edge to edge, with your dog as the only subject." },
      { title: "Good for pale coats", body: "White and cream coats stand clear of the background; golden and black coats look rich against it." },
      { title: "A little color for the wall", body: "Enough to warm a white room without taking it over." },
    ],
    photoTip: "A front-facing photo in soft, even light, with both ears in the frame, gives the cleanest result.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  watercolor: {
    keyword: "Watercolor dog portrait from photo",
    title: "Watercolor Dog Portrait from Your Photo",
    metaDescription:
      "A soft watercolor portrait of your dog, made from your photo. See it before you buy, then order a print, framed print or canvas.",
    h1: "Your dog in watercolor",
    points: [
      { title: "Light and airy", body: "Transparent washes on textured paper, with plenty of white around your dog." },
      { title: "Soft edges", body: "Sharp in the eyes, loose toward the edges. Often chosen to remember a dog." },
      { title: "Suits bright rooms", body: "Good in a white frame on a pale wall, in a bedroom or a hallway." },
    ],
    photoTip: "Bright, even daylight helps the watercolor stay fresh and clean.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "white",
  },
  "fine-line": {
    keyword: "Line drawing of your dog",
    title: "Line Drawing of Your Dog from a Photo",
    metaDescription:
      "A black ink line drawing of your dog on warm off-white paper, made from your photo. See it before you buy.",
    h1: "Your dog as a line drawing",
    points: [
      { title: "Simple", body: "Black ink lines and a lot of empty paper." },
      { title: "Works on a gallery wall", body: "Pairs easily with photos, prints and other art." },
      { title: "Best with a clear outline", body: "Suits dogs with distinctive ears, a strong silhouette or a clear expression." },
    ],
    photoTip: "A clean background and a clear outline of the head and ears give the crispest lines.",
    bestOn: ["framed", "poster", "digital"],
    frame: "white",
  },
  pastel: {
    keyword: "Pastel dog portrait from photo",
    title: "Pastel Dog Portrait from Your Photo",
    metaDescription:
      "A soft pastel portrait of your dog on warm toned paper, made from your photo. See it before you buy.",
    h1: "Your dog in soft pastel",
    points: [
      { title: "Soft fur", body: "Layered strokes follow the coat, blended in the shadows and left open in the light." },
      { title: "Paper you can see", body: "The warm, sand-colored paper shows through and around the drawing." },
      { title: "Gentle", body: "A good choice for a bedroom, a reading corner or a memorial piece." },
    ],
    photoTip: "A close photo in soft light, with the texture of the coat visible, suits pastel best.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  "modern-oil": {
    keyword: "Oil painting of your dog",
    title: "Oil Portrait of Your Dog from a Photo",
    metaDescription:
      "An oil portrait of your dog in thick palette-knife strokes on one flat color, made from your photo. See it before you buy.",
    h1: "Your dog in oil",
    points: [
      { title: "Thick paint", body: "Broad knife strokes and simple planes of color, with finer work in the eyes and nose." },
      { title: "One flat color behind", body: "A single muted background (sage, slate or ochre) keeps the attention on the dog." },
      { title: "Reads from across the room", body: "Bold enough for a living room, and at its best on canvas." },
    ],
    photoTip: "A three-quarter view in soft daylight gives the knife strokes clear planes to follow.",
    bestOn: ["canvas", "framed", "poster"],
    frame: "oak",
  },
  charcoal: {
    keyword: "Charcoal dog drawing from photo",
    title: "Charcoal Dog Drawing from Your Photo",
    metaDescription:
      "A charcoal drawing of your dog on warm paper, with fine detail in the eyes. Made from your photo. See it before you buy.",
    h1: "Your dog in charcoal",
    points: [
      { title: "Black and white", body: "Deep blacks, soft smudges and loose strokes that fade at the edges." },
      { title: "All about the eyes", body: "The finest detail goes where people look first." },
      { title: "Forgiving of older photos", body: "With no color to match, it copes with color casts and faded prints." },
    ],
    photoTip: "Any photo where their eyes are sharp will do. Color is not important for charcoal.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "black",
  },
};

export function styleContent(style: ArtStyle): StyleContent {
  return (
    CONTENT[style.slug] ?? {
      keyword: `${style.name} dog portrait`,
      title: `${style.name} Dog Portrait from Your Photo`,
      metaDescription: `${style.blurb} A custom ${style.name.toLowerCase()} portrait of your dog, made from your photo. See it before you buy.`,
      h1: style.blurb,
      points: [],
      photoTip: "A sharp, close-up photo in natural light, with both eyes and ears visible, gives the best result.",
      bestOn: ["framed", "canvas", "poster"],
      frame: "black",
    }
  );
}

/** Catalog description minus any popularity claims we can't back up yet. */
export function honestDescription(style: ArtStyle) {
  return honestText(style.description);
}

/** Styles that can be chosen now, ranked by how many of the wanted tags they match (ties keep catalog order). */
export function stylesFor(tags: GoodFor[], limit = 4, exclude?: StyleSlug) {
  return availableStyles().filter((s) => s.slug !== exclude)
    .map((s, i) => ({ s, i, score: s.goodFor.filter((g) => tags.includes(g)).length, lead: tags.includes(s.goodFor[0]) ? 1 : 0 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.lead - a.lead || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.s);
}
