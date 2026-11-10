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
      "A clean modern illustration of your dog on soft white, made from your photo. See it free in about a minute, then order a print, framed print or canvas.",
    h1: "Your dog, clean and modern",
    points: [
      { title: "Only the dog", body: "Head and chest on one flat field of soft white. Nothing else in the picture." },
      { title: "True to the coat", body: "Smooth, simplified shading in their real colors, with the eyes kept bright." },
      { title: "Easy to place", body: "Light and graphic. It sits beside prints, photographs and pale walls without asking for attention." },
    ],
    photoTip: "A front-facing photo in soft, even light, with both ears in the frame, gives the cleanest result.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  "modern-sage": {
    keyword: "Modern dog portrait on a color background",
    title: "Modern Dog Portrait on Sage, from Your Photo",
    metaDescription:
      "A clean modern illustration of your dog on a flat, muted sage ground, made from your photo. Preview it free, then order a print, framed print or canvas.",
    h1: "The Modern portrait, on quiet sage",
    points: [
      { title: "One calm color", body: "A flat, matte sage from edge to edge, with your dog as the only subject." },
      { title: "Kind to pale coats", body: "White and cream coats stand clear of the ground; golden and black coats look rich against it." },
      { title: "A little color for the wall", body: "Enough to warm a white room, quiet enough to live with for years." },
    ],
    photoTip: "A front-facing photo in soft, even light, with both ears in the frame, gives the cleanest result.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  "oil-classic": {
    keyword: "Oil painting of your dog",
    title: "Classic Oil Painting of Your Dog from a Photo",
    metaDescription:
      "A classical oil portrait of your dog, with one soft light and a warm, quiet background. Just them, made from your photo. Preview it free, then order a print, framed print or canvas.",
    h1: "Your dog, in the manner of an old master",
    points: [
      { title: "Only the dog", body: "The focus stays on their face, their coat and the look in their eyes." },
      { title: "Sits well in any room", body: "Muted olive and umber tones are quiet next to everything from antiques to modern furniture." },
      { title: "A natural choice for remembering", body: "Calm and dignified, it is often chosen for a memorial portrait." },
    ],
    photoTip: "Soft window light from one side gives the classic old-master glow.",
    bestOn: ["canvas", "framed", "poster"],
    frame: "oak",
  },
  watercolor: {
    keyword: "Watercolor dog portrait from photo",
    title: "Watercolor Dog Portrait from Your Photo",
    metaDescription:
      "A soft, luminous watercolor portrait of your dog, made from your favorite photo. See it free in about a minute, then order a print, framed print or canvas.",
    h1: "Soft washes, loose color, your dog",
    points: [
      { title: "Light and airy", body: "Translucent washes bloom into textured paper with plenty of white space around your dog." },
      { title: "Gentle for memorials", body: "Soft edges and quiet color make it a comforting way to remember a best friend." },
      { title: "Bright rooms suit it", body: "Lovely in a white frame on a pale wall, in a bedroom or a sunny hallway." },
    ],
    photoTip: "Bright, even daylight helps the watercolor stay fresh and clean.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "white",
  },
  "modern-oil": {
    keyword: "Modern oil painting of your dog",
    title: "Modern Oil Dog Portrait from Your Photo",
    metaDescription:
      "A contemporary oil portrait of your dog in thick palette-knife strokes on a flat, muted color field. Made from your photo and previewed free before you buy.",
    h1: "Thick paint, a quiet field of color",
    points: [
      { title: "Painterly up close", body: "Broad knife strokes and simple planes of paint, with the care kept for the eyes and nose." },
      { title: "One calm color behind", body: "A single muted ground (sage, slate or ochre) lets the dog carry the picture." },
      { title: "Made for a living room", body: "Reads clearly from across the room, and sits easily with modern furniture." },
    ],
    photoTip: "A three-quarter view in soft daylight gives the knife strokes clear planes to follow.",
    bestOn: ["canvas", "framed", "poster"],
    frame: "oak",
  },
  charcoal: {
    keyword: "Charcoal dog drawing from photo",
    title: "Charcoal Dog Drawing from Your Photo",
    metaDescription:
      "An expressive charcoal portrait of your dog on warm toned paper, with fine detail in the eyes. Custom from your photo, previewed free.",
    h1: "A charcoal study of your dog",
    points: [
      { title: "Monochrome and quiet", body: "Rich blacks, soft smudges and loose strokes that fade at the edges." },
      { title: "All about the eyes", body: "Fine detail where it matters most, which is why it so often moves people." },
      { title: "Kind to older photos", body: "Because it is monochrome, it forgives color casts and faded prints." },
    ],
    photoTip: "Any photo where their eyes are sharp will do. Color is not important for charcoal.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "black",
  },
  linocut: {
    keyword: "Linocut dog portrait",
    title: "Linocut Dog Portrait from Your Photo",
    metaDescription:
      "Your dog in the manner of a carved relief print: one or two matte inks on cream paper, carving marks and all. Made from your photo and previewed free.",
    h1: "Your dog as a relief print",
    points: [
      { title: "Bold, carved shapes", body: "Confident cuts that follow the fur, with the small gouge marks a block print leaves behind." },
      { title: "One or two inks", body: "A soft black, sometimes with one muted color beneath it, on warm cream paper." },
      { title: "Warm and graphic", body: "At home in a kitchen, a hallway or a gallery wall of prints." },
    ],
    photoTip: "A clear silhouette with strong light and shadow carves best. Side light helps.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  pastel: {
    keyword: "Pastel dog portrait from photo",
    title: "Soft Pastel Dog Portrait from Your Photo",
    metaDescription:
      "A soft pastel portrait of your dog on warm toned paper, with velvety fur and visible paper tooth. Made from your photo and previewed free before you buy.",
    h1: "Velvety pastel on toned paper",
    points: [
      { title: "Soft where they are soft", body: "Layered strokes follow the coat, blended in the shadows and left open in the lights." },
      { title: "Paper you can see", body: "The warm toned sheet shows through and around the drawing, like a studio portrait." },
      { title: "Gentle company", body: "A tender choice for a bedroom, a reading corner or a memorial piece." },
    ],
    photoTip: "A close photo in soft light, with the texture of the coat visible, suits pastel best.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  "fine-line": {
    keyword: "Minimalist line art dog portrait",
    title: "Minimalist Line Art Dog Portrait",
    metaDescription:
      "A fine-line ink portrait of your dog on warm off-white paper. Minimal, quiet and made from your photo. Preview free before you buy.",
    h1: "Minimal ink lines, all of their character",
    points: [
      { title: "Quiet and modern", body: "Confident black linework and lots of breathing room." },
      { title: "Gallery-wall friendly", body: "Pairs easily with photos, prints and other art without competing." },
      { title: "A clear, simple likeness", body: "Works best for dogs with a distinctive silhouette, ears or expression." },
    ],
    photoTip: "A clean background and a clear outline of the head and ears give the crispest lines.",
    bestOn: ["framed", "poster", "digital"],
    frame: "white",
  },
  botanical: {
    keyword: "Floral dog portrait",
    title: "Botanical Floral Dog Portrait",
    metaDescription:
      "Your dog loosely framed by botanical stems and garden roses, in the manner of a naturalist's plate. Made from your photo and previewed free.",
    h1: "Framed by garden stems",
    points: [
      { title: "Serene and detailed", body: "Olive, eucalyptus, ferns and garden roses in fine ink and watercolor on ivory paper." },
      { title: "A gentle tribute", body: "Often chosen to remember a dog who has passed." },
      { title: "Lasting decor", body: "At home in a cottage, a bedroom or a reading nook." },
    ],
    photoTip: "A calm, front-facing photo lets the stems frame your dog's face well.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
};

export function styleContent(style: ArtStyle): StyleContent {
  return (
    CONTENT[style.slug] ?? {
      keyword: `${style.name} dog portrait`,
      title: `${style.name} Dog Portrait from Your Photo`,
      metaDescription: `${style.blurb} A custom ${style.name.toLowerCase()} portrait of your dog, made from your photo and previewed free before you buy.`,
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
