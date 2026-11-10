/** Gift-guide occasions: copy for /gifts and the /gifts/[occasion] landing pages. */
import { ADDONS, STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { formatPrice } from "@/lib/utils";
import type { FaqItem } from "@/components/marketing/faq";
import type { GoodFor } from "@/components/marketing/style-content";
import { CHRISTMAS_CA_CUTOFF, CHRISTMAS_US_CUTOFF, PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";

export type OccasionSlug = "christmas" | "memorial" | "mothers-day" | "birthday" | "new-puppy" | "fathers-day";

export type Occasion = {
  slug: OccasionSlug;
  /** Short name for cards and breadcrumbs. */
  name: string;
  /** Used in "Styles we love for …". */
  forLabel: string;
  /** One line for gift-guide cards. */
  card: string;
  title: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lede: string;
  goodFor: GoodFor[];
  /** Styles shown first, if present in the catalog. */
  feature: StyleSlug;
  ideas: { title: string; body: string }[];
  timing?: { title: string; body: string };
  faq: FaqItem[];
  /** Closing call to action (`body` may be empty). The button itself is always site.cta. */
  cta: { title: string; body: string };
};


/** Style name from the catalog, so copy never drifts if a style is renamed. */
const n = (slug: StyleSlug) => STYLE_MAP[slug]?.name ?? slug;

const ORNAMENT = ADDONS.find((a) => a.id === "addon-ornament");

export const OCCASIONS: Occasion[] = [
  {
    slug: "christmas",
    forLabel: "Christmas",
    name: "Christmas",
    card: "A portrait of their dog, framed for the wall.",
    title: "Christmas Dog Portraits — Custom Gifts for Dog Lovers",
    metaDescription:
      "A custom portrait of their dog as a Christmas gift, made from a photo. Holiday order-by dates for US and Canadian delivery.",
    eyebrow: "Christmas 2026",
    h1: "A portrait of their dog, for Christmas",
    lede: "Made from a photo of their dog, in a style that suits their home. You see it before you buy.",
    goodFor: ["gift", "decor"],
    feature: "modern-oil",
    ideas: [
      { title: "For someone hard to shop for", body: "A framed print of their own dog. Nobody else will give them this." },
      { title: "For the whole family", body: `A piece that stays up all year: ${n("modern-oil")} above the mantel, or ${n("watercolor")} in the hallway.` },
      { title: "For the tree", body: `A matching ornament${ORNAMENT ? ` (${formatPrice(ORNAMENT.price)})` : ""} can be added to any print, frame or canvas.` },
    ],
    timing: {
      title: "Holiday order-by dates",
      body: `For standard US delivery before Christmas, we recommend ordering physical pieces by ${CHRISTMAS_US_CUTOFF} (${CHRISTMAS_CA_CUTOFF} for Canada). That's guidance, not a promise, because carriers get busy in December. The digital file arrives by email right after checkout.`,
    },
    faq: [
      {
        q: "Is it too late to order for Christmas?",
        a: `For standard US delivery before Christmas, we recommend ordering physical pieces by ${CHRISTMAS_US_CUTOFF}. After that you can still order: the digital file arrives by email straight away and the print follows.`,
      },
      {
        q: "Can I ship it directly to the person I'm gifting?",
        a: "Yes. Enter their address at checkout.",
      },
      {
        q: "Can I order portraits of several dogs as gifts?",
        a: "Yes. Each portrait features one dog, so make one for each, then order them together.",
      },
    ],
    cta: { title: "Start with a photo of their dog.", body: "" },
  },
  {
    slug: "memorial",
    forLabel: "remembering them",
    name: "In memory",
    card: "A quiet way to remember a dog.",
    title: "Pet Memorial Portraits — Remember Your Dog",
    metaDescription:
      "A memorial portrait of your dog, made from a photo you treasure. Older or blurry photos usually work, and you see it before you decide.",
    eyebrow: "Memorial portraits",
    h1: "A portrait to remember them",
    lede: "Made from a photo you love. Take your time. You'll see it before you decide anything.",
    goodFor: ["memorial"],
    feature: "watercolor",
    ideas: [
      { title: "Any photo you treasure", body: "Older, blurry or low-resolution photos usually work. If you're unsure, try a few." },
      { title: "Memorial orders go first", body: "Reply to your order confirmation to tell us it's a memorial piece, and we'll move it to the front of our queue." },
      { title: "Help choosing", body: "If you'd like a hand choosing a photo or a style, write to us. A person will reply." },
    ],
    faq: [
      {
        q: "My only photos are old or a bit blurry. Will they work?",
        a: `Usually, yes. Styles like ${n("watercolor")} and ${n("charcoal")} are forgiving of older photos. Try the one you love most; you'll see the result before you decide anything.`,
      },
      {
        q: "Which style is best for a memorial portrait?",
        a: `Many people choose quieter styles like ${n("watercolor")}, ${n("charcoal")}, ${n("pastel")} or ${n("modern")}. Try a few and see which one feels like them.`,
      },
      {
        q: "Can you help me choose a photo?",
        a: "Yes. Send us a few photos and we'll tell you which one we think will work best.",
        link: { href: "/contact", label: "Write to us" },
      },
      {
        q: "Is this a good sympathy gift for a friend?",
        a: "It can be. If you can, find a favorite photo from their social media or ask a family member. You can ship it to them directly.",
      },
    ],
    cta: { title: "Whenever you're ready.", body: "" },
  },
  {
    slug: "mothers-day",
    forLabel: "Mother's Day",
    name: "Mother's Day",
    card: "A portrait of her dog.",
    title: "Mother's Day Gifts for Dog Moms — Custom Dog Portraits",
    metaDescription:
      "A Mother's Day gift for dog moms: a custom portrait of her dog, made from a photo and shipped to her door.",
    eyebrow: "Mother's Day",
    h1: "A portrait of her dog, for Mother's Day",
    lede: "Made from a photo of her dog and shipped to her door. Mother's Day is Sunday, May 9, 2027.",
    goodFor: ["gift", "decor"],
    feature: "watercolor",
    ideas: [
      { title: "For her home", body: `A framed ${n("watercolor")} or ${n("pastel")} portrait sits quietly in a living room or hallway.` },
      { title: "From the dog", body: "Sign the card from the dog." },
      { title: "For a new dog mom", body: `First Mother's Day with a puppy? A ${n("pastel")} portrait keeps how small they are right now.` },
    ],
    timing: {
      title: "When to order",
      body: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US, so ordering two weeks ahead is comfortable. The digital file arrives by email right after checkout.`,
    },
    faq: [
      {
        q: "When should I order for Mother's Day?",
        a: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} in the US, so about two weeks before is a comfortable buffer.`,
      },
      {
        q: "Can I ship it straight to my mom?",
        a: "Yes. Enter her address at checkout.",
      },
    ],
    cta: { title: "Start with a photo of her dog.", body: "" },
  },
  {
    slug: "birthday",
    forLabel: "birthdays",
    name: "Birthday",
    card: "Their birthday, or their dog's.",
    title: "Birthday Gifts for Dog Lovers — Custom Dog Portraits",
    metaDescription:
      "A birthday gift for dog lovers: a custom portrait of their dog, made from a photo and shipped to their door.",
    eyebrow: "Birthday gifts",
    h1: "A portrait of their dog, for a birthday",
    lede: "Made from a photo you already have, and shipped to you or straight to them.",
    goodFor: ["gift", "decor"],
    feature: "modern-oil",
    ideas: [
      { title: "For their living room", body: `${n("modern-oil")} or ${n("charcoal")}, framed or on canvas.` },
      { title: "For a new apartment", body: `${n("modern")}, ${n("modern-sage")} or ${n("fine-line")} in a natural oak frame.` },
      { title: "For the dog's birthday", body: "A gotcha day or a first birthday is a good reason too." },
    ],
    timing: {
      title: "When to order",
      body: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US. The digital file arrives by email right after checkout, so there is something to give on the day.`,
    },
    faq: [
      {
        q: "Can I get a photo of their dog without them knowing?",
        a: "Usually, yes. Their Instagram, a group chat or a friend is a good source. Pick a clear, close-up photo.",
      },
      {
        q: "What if their birthday is tomorrow?",
        a: "Order today: the digital file arrives by email straight away, and the print follows in the mail.",
      },
    ],
    cta: { title: "Start with a photo of their dog.", body: "" },
  },
  {
    slug: "new-puppy",
    forLabel: "a new puppy",
    name: "New puppy",
    card: "They're only this small for a few weeks.",
    title: "New Puppy Gifts — A Portrait of Their First Weeks",
    metaDescription:
      "A custom portrait of a new puppy, made from a photo. Order it as a print, framed print or canvas.",
    eyebrow: "New puppy",
    h1: "A first portrait",
    lede: "Puppies grow fast. A portrait from a photo taken now keeps the oversized paws and floppy ears.",
    goodFor: ["gift", "decor"],
    feature: "pastel",
    ideas: [
      { title: "A welcome-home gift", body: `For a friend's new arrival, a ${n("pastel")} or ${n("watercolor")} portrait.` },
      { title: "For a kids' room", body: "Hang it where the kids can see it." },
      { title: "Then and now", body: "Order one now and another in a year, in the same style and size, and hang them side by side." },
    ],
    faq: [
      {
        q: "Puppies never sit still. What photo should I use?",
        a: "Catch them when they're sleepy, at their eye level, near a window. A sharp face matters more than a perfect pose. You can try several photos.",
        link: { href: "/how-it-works#photo-tips", label: "Photo tips" },
      },
      {
        q: "Which style suits a puppy?",
        a: `${n("pastel")} and ${n("watercolor")} suit soft puppy fur, and ${n("modern")} keeps oversized ears clean and clear.`,
      },
    ],
    cta: { title: "Start with a puppy photo.", body: "" },
  },
  {
    slug: "fathers-day",
    forLabel: "Father's Day",
    name: "Father's Day",
    card: "A portrait of his dog.",
    title: "Father's Day Gifts for Dog Dads — Custom Dog Portraits",
    metaDescription:
      "A Father's Day gift for dog dads: a custom portrait of his dog, made from a photo. Order it as a print, framed print or canvas.",
    eyebrow: "Father's Day",
    h1: "A portrait of his dog, for Father's Day",
    lede: "Made from a photo of his dog. Father's Day is Sunday, June 20, 2027.",
    goodFor: ["gift", "decor"],
    feature: "charcoal",
    ideas: [
      { title: "For the office", body: `${n("charcoal")} in a natural oak frame, above the desk.` },
      { title: "For the den", body: `${n("modern-oil")} on canvas.` },
      { title: "For a modern space", body: `${n("modern")} or ${n("fine-line")} for a study or workshop wall.` },
    ],
    timing: {
      title: "When to order",
      body: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US, so ordering two weeks ahead is comfortable. The digital file arrives by email right after checkout.`,
    },
    faq: [
      {
        q: "When should I order for Father's Day?",
        a: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} in the US, so about two weeks ahead is a comfortable buffer.`,
      },
      {
        q: "Which style suits a gift for a dog dad?",
        a: `${n("charcoal")} is quiet above a desk, ${n("modern-oil")} has the most color, and ${n("fine-line")} is the simplest. Try them with his dog's photo.`,
      },
    ],
    cta: { title: "Start with a photo of his dog.", body: "" },
  },
];

export const OCCASION_MAP = Object.fromEntries(OCCASIONS.map((o) => [o.slug, o])) as Record<OccasionSlug, Occasion>;

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASION_MAP[slug as OccasionSlug];
}

/** Gift-guide card for "dog lovers who have everything" (no landing page; it points at styles). */
export const EVERYTHING_CARD = {
  name: "Dog lovers who have everything",
  card: "A portrait of their own dog.",
  href: "/styles",
  cta: "Browse styles",
};
