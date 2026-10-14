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
  funny: "A good laugh",
  decor: "Home decor",
  holiday: "Holidays",
};

export type StyleContent = {
  /** Primary search phrase, e.g. "Royal dog portrait". */
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
  royal: {
    keyword: "Royal dog portrait",
    title: "Royal Dog Portrait from Your Photo",
    metaDescription:
      "Turn your dog into royalty: a Renaissance-style royal portrait with velvet, ermine and a crown, made from your photo. Preview it free, then order a print, framed print or canvas.",
    h1: "Your dog, painted as royalty",
    points: [
      { title: "Old-master drama", body: "Candlelit shadows, rich crimson and gold, and a pose fit for a palace wall." },
      { title: "Funny and beautiful", body: "It makes people laugh, then it makes them stare. The best kind of gift." },
      { title: "Big personalities welcome", body: "Especially good for confident dogs, smooshy faces and anyone who already acts like they own the place." },
    ],
    photoTip: "A front-facing photo where your dog looks straight at the camera gives the most regal result.",
    bestOn: ["framed", "canvas", "poster"],
    frame: "black",
  },
  admiral: {
    keyword: "Admiral dog portrait",
    title: "Admiral Dog Portrait — Naval Officer Pet Painting",
    metaDescription:
      "Your dog as a decorated naval admiral, with gold epaulettes, medals and a stormy sea behind. Custom from your photo, previewed free before you buy.",
    h1: "A decorated officer of the high seas",
    points: [
      { title: "Classic oil painting", body: "Warm varnished tones and painterly detail, in the tradition of 18th-century officer portraits." },
      { title: "Made for a study", body: "Looks right at home above a desk, a bar cart or a bookshelf." },
      { title: "A gift for dog dads", body: "Distinguished, a little absurd, and very easy to love." },
    ],
    photoTip: "Pick a photo with your dog sitting tall and looking slightly off to one side, like they are surveying the fleet.",
    bestOn: ["framed", "canvas", "poster"],
    frame: "oak",
  },
  "oil-classic": {
    keyword: "Oil painting of your dog",
    title: "Classic Oil Painting of Your Dog from a Photo",
    metaDescription:
      "A timeless oil-painting portrait of your dog with Rembrandt lighting and a warm, quiet background. No costume, just them. Preview free from your photo.",
    h1: "Just your dog, painted like a museum piece",
    points: [
      { title: "No costume, no gimmick", body: "The focus stays on their face, their fur and the look in their eyes." },
      { title: "Fits any room", body: "Muted olive and umber tones sit quietly next to everything from antiques to modern furniture." },
      { title: "A favorite for remembering", body: "Calm and dignified, it is a natural choice for a memorial portrait." },
    ],
    photoTip: "Soft window light from one side gives the classic Rembrandt glow.",
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
      { title: "Bright rooms love it", body: "Beautiful in a white frame on a pale wall, in a nursery or a sunny hallway." },
    ],
    photoTip: "Bright, even daylight helps the watercolor stay fresh and clean.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "white",
  },
  "fine-line": {
    keyword: "Minimalist line art dog portrait",
    title: "Minimalist Line Art Dog Portrait",
    metaDescription:
      "A modern fine-line ink portrait of your dog on warm off-white paper. Minimal, chic and made from your photo. Preview free before you buy.",
    h1: "Minimal ink lines, all of their character",
    points: [
      { title: "Quietly chic", body: "Confident black linework and lots of breathing room, made for modern spaces." },
      { title: "Gallery-wall friendly", body: "Pairs easily with photos, prints and other art without competing." },
      { title: "Clear, simple likeness", body: "Works best for dogs with a distinctive silhouette, ears or expression." },
    ],
    photoTip: "A clean background and a clear outline of the head and ears give the crispest lines.",
    bestOn: ["framed", "poster", "digital"],
    frame: "white",
  },
  "pop-art": {
    keyword: "Pop art dog portrait",
    title: "Pop Art Dog Portrait from Your Photo",
    metaDescription:
      "A bold, bright 1960s pop-art portrait of your dog with halftone dots and saturated color. Custom from your photo, previewed free.",
    h1: "Bold, bright and gallery-wall loud",
    points: [
      { title: "Screen-print energy", body: "Flat saturated color, thick graphic outlines and Ben-Day dots." },
      { title: "Made to pop", body: "Brings color to a kid's room, an office or a minimal white wall." },
      { title: "Fun to gift", body: "Instantly recognizable and impossible to walk past." },
    ],
    photoTip: "A close-up with a strong expression (head tilt, tongue out) makes the boldest pop art.",
    bestOn: ["canvas", "framed", "poster"],
    frame: "black",
  },
  storybook: {
    keyword: "Storybook illustrated dog portrait",
    title: "Storybook Illustrated Dog Portrait",
    metaDescription:
      "Your dog as the hero of a cozy children's picture book, in warm gouache and colored pencil. Custom from your photo, previewed free.",
    h1: "The hero of their own picture book",
    points: [
      { title: "Warm and whimsical", body: "Gouache and colored pencil on textured paper, with a gentle meadow behind." },
      { title: "Sweet for kids' rooms", body: "A lovely way to put the family dog on the nursery wall." },
      { title: "New puppy, new chapter", body: "A favorite for celebrating a new arrival." },
    ],
    photoTip: "A happy, relaxed photo outdoors fits the storybook mood perfectly.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "white",
  },
  botanical: {
    keyword: "Floral dog portrait",
    title: "Botanical Floral Dog Portrait",
    metaDescription:
      "Your dog framed by a wreath of vintage botanical flowers and leaves, like a page from a naturalist's journal. Made from your photo and previewed free.",
    h1: "Framed in vintage flowers",
    points: [
      { title: "Serene and detailed", body: "Wildflowers, roses, eucalyptus and ferns on soft cream parchment." },
      { title: "A gentle tribute", body: "Often chosen to remember a dog who has passed." },
      { title: "Timeless decor", body: "At home in a cottage, a bedroom or a reading nook." },
    ],
    photoTip: "A calm, front-facing photo lets the wreath frame your dog's face beautifully.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  astronaut: {
    keyword: "Astronaut dog portrait",
    title: "Astronaut Dog Portrait — Space Pet Art",
    metaDescription:
      "Send your dog to space: a retro-futurist astronaut portrait with a glass helmet and a field of stars. Custom from your photo, previewed free.",
    h1: "One small step for dog",
    points: [
      { title: "Retro-futurist", body: "A vintage space suit, mission patches and a ringed planet in a deep starry sky." },
      { title: "Kids' room favorite", body: "Pairs well with posters, maps and anything out of this world." },
      { title: "Made for a laugh", body: "A fun gift for the friend whose dog is clearly a genius." },
    ],
    photoTip: "A photo looking slightly upward makes for a heroic launch-day portrait.",
    bestOn: ["canvas", "poster", "framed"],
    frame: "black",
  },
  charcoal: {
    keyword: "Charcoal dog drawing from photo",
    title: "Charcoal Dog Drawing from Your Photo",
    metaDescription:
      "An expressive charcoal and graphite portrait of your dog on toned paper, with fine detail in the eyes. Custom from your photo, previewed free.",
    h1: "An expressive charcoal study",
    points: [
      { title: "Monochrome and soulful", body: "Rich blacks, soft smudges and loose strokes that fade at the edges." },
      { title: "All about the eyes", body: "Fine detail where it matters most, which is why it often feels so emotional." },
      { title: "Works with older photos", body: "Because it is monochrome, it is forgiving of color casts and faded prints." },
    ],
    photoTip: "Any photo where their eyes are sharp will do. Color is not important for charcoal.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "black",
  },
  "mid-century": {
    keyword: "Mid-century modern dog art",
    title: "Mid-Century Modern Dog Art Print",
    metaDescription:
      "A graphic mid-century modern poster of your dog in a warm retro palette of mustard, orange and teal. Custom from your photo, previewed free.",
    h1: "Flat shapes, warm retro palette",
    points: [
      { title: "Graphic and clean", body: "Simplified shapes and subtle risograph texture, like a 1960s print." },
      { title: "Made for modern homes", body: "Pairs beautifully with walnut, teak, linen and plants." },
      { title: "Bold from across the room", body: "Reads clearly even at small sizes." },
    ],
    photoTip: "A side profile or a clear three-quarter view gives the strongest graphic shapes.",
    bestOn: ["framed", "poster", "canvas"],
    frame: "oak",
  },
  holiday: {
    keyword: "Christmas dog portrait",
    title: "Christmas Dog Portrait — Holiday Pet Painting",
    metaDescription:
      "A cozy holiday oil painting of your dog by the fire, with a knit scarf and twinkling lights. Made from your photo and previewed free. Perfect for gifts and holiday cards.",
    h1: "A festive portrait by the fire",
    points: [
      { title: "Warm and nostalgic", body: "A knit scarf, evergreen garland and the glow of a crackling fireplace." },
      { title: "Holiday cards, sorted", body: "Order the digital file and print your own cards, or hang it every December." },
      { title: "Last-minute friendly", body: "Send a Gift Reveal the moment you order. The print follows." },
    ],
    photoTip: "A cozy indoor photo with warm light suits the fireside mood.",
    bestOn: ["framed", "canvas", "digital"],
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
