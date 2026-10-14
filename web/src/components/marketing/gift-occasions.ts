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
  /** Closing call to action. The button itself is always OFFER.cta. */
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
    card: "The gift that gets the gasp on Christmas morning.",
    title: "Christmas Dog Portraits — Custom Gifts for Dog Lovers",
    metaDescription:
      "A custom portrait of their dog is the Christmas gift they'll keep forever. Preview it free, send a Gift Reveal instantly, and get holiday order-by dates for US delivery.",
    eyebrow: "Christmas 2026",
    h1: "The Christmas gift they'll hang forever",
    lede: "A portrait of their dog, in a style that suits them, framed and ready for the wall. See it free before you buy, and send a Gift Reveal the moment you order.",
    goodFor: ["holiday", "gift"],
    feature: "holiday",
    ideas: [
      { title: "For the one who's hard to shop for", body: "Nobody else will give them this. A framed print of their own dog is personal in a way a gift card never is." },
      { title: "For the whole family", body: `Hang ${n("holiday")}, our 2026 holiday edition, by the fire this December, or choose a classic style that stays up all year.` },
      { title: "For the tree, too", body: `Add a matching ornament${ORNAMENT ? ` (${formatPrice(ORNAMENT.price)})` : ""} to any print, frame or canvas, and use the included digital file for your holiday cards.` },
    ],
    timing: {
      title: "Holiday order-by dates",
      body: `For standard US delivery before Christmas, we recommend ordering physical pieces by ${CHRISTMAS_US_CUTOFF} (${CHRISTMAS_CA_CUTOFF} for Canada). That's our honest guidance, not a guarantee, because carriers get busy in December. After that, order anyway and send a Gift Reveal instantly, any time up to Christmas Day. The print follows.`,
    },
    faq: [
      {
        q: "Is it too late to order for Christmas?",
        a: `For standard US delivery before Christmas, we recommend ordering physical pieces by ${CHRISTMAS_US_CUTOFF}. After that, you can still order: send the Gift Reveal on Christmas morning and the print arrives soon after.`,
      },
      {
        q: "Can I ship it directly to the person I'm gifting?",
        a: "Yes. Enter their address at checkout and keep the Gift Reveal for yourself to send or show on the day.",
      },
      {
        q: "Can I order portraits of several dogs as gifts?",
        a: "Of course. Each portrait features one dog, so make a preview for each, then order them together.",
      },
    ],
    cta: {
      title: "Start their Christmas portrait",
      body: "Upload a photo of their dog and see it free in about a minute.",
    },
  },
  {
    slug: "memorial",
    forLabel: "remembering them",
    name: "In memory",
    card: "A gentle, lasting way to remember a best friend.",
    title: "Pet Memorial Portraits — Remember Your Dog",
    metaDescription:
      "A gentle memorial portrait of the dog you miss, made from a photo you treasure. Older or blurry photos usually work. See it free before you decide, and a person checks every print.",
    eyebrow: "Memorial portraits",
    h1: "A gentle way to remember them",
    lede: "When a dog has been part of your life, they stay part of it. A portrait made from a photo you love can bring a little of them back into the room. Take your time. You'll see it before you decide anything.",
    goodFor: ["memorial"],
    feature: "watercolor",
    ideas: [
      { title: "Any photo you treasure", body: "Older, blurry or low-resolution photos usually work. If the photo is precious to you, it's a good place to start. If you're unsure, try a few; previews are free." },
      { title: "We put memorial orders first", body: "Let us know it's a memorial piece by replying to your order confirmation, and we'll move it to the front of our queue." },
      { title: "We're here to help", body: "If you'd like a hand choosing a photo or a style, write to us. A real person will reply, gently and without any pressure." },
    ],
    faq: [
      {
        q: "My only photos are old or a bit blurry. Will they work?",
        a: "Usually, yes. Many of our styles, like watercolor and charcoal, are forgiving of older photos. Try the one you love most; the preview is free, and you'll see the result before you decide anything.",
      },
      {
        q: "Which style is best for a memorial portrait?",
        a: `Many people choose softer styles like ${n("watercolor")}, ${n("botanical")}, ${n("oil-classic")} or ${n("charcoal")}. There's no wrong answer; try a few and see which one feels like them.`,
      },
      {
        q: "Can you help me choose a photo?",
        a: "Of course. Send us a few photos and we'll tell you which one we think will work best.",
        link: { href: "/contact", label: "Write to us" },
      },
      {
        q: "Is this a good sympathy gift for a friend?",
        a: "It can be a deeply kind one. If you can, quietly find a favorite photo from their social media or ask a family member. You can ship it to them directly, or send the Gift Reveal with a note when the moment feels right.",
      },
    ],
    cta: {
      title: "Whenever you're ready",
      body: "Upload a photo you treasure and see their portrait, free. There's no rush and no obligation.",
    },
  },
  {
    slug: "mothers-day",
    forLabel: "Mother's Day",
    name: "Mother's Day",
    card: "For the dog mom who has everything (except this).",
    title: "Mother's Day Gifts for Dog Moms — Custom Dog Portraits",
    metaDescription:
      "The Mother's Day gift for dog moms: a custom fine-art portrait of her dog. Preview free, send a Gift Reveal instantly, and ship a framed print to her door.",
    eyebrow: "Mother's Day",
    h1: "For the dog mom who has everything",
    lede: "She already has the mug and the tote. Give her a real piece of art of the one who follows her from room to room. Mother's Day is Sunday, May 9, 2027.",
    goodFor: ["gift", "decor"],
    feature: "botanical",
    ideas: [
      { title: "For a mom who loves her home", body: `A framed ${n("watercolor")} or ${n("botanical")} portrait feels like it was always meant to hang there.` },
      { title: "From the dog, obviously", body: "Sign the card from the dog. Send the Gift Reveal on the morning. Wait for the happy tears." },
      { title: "For a new dog mom", body: `First Mother's Day with a puppy? A ${n("storybook")} portrait captures how small they are right now.` },
    ],
    timing: {
      title: "Plan ahead (a little)",
      body: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US, so ordering two weeks ahead is comfortable. Cutting it close? Send a Gift Reveal on the day.`,
    },
    faq: [
      {
        q: "When should I order for Mother's Day?",
        a: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} in the US, so about two weeks before is a comfortable buffer. The Gift Reveal can be sent instantly, even on the day.`,
      },
      {
        q: "Can I ship it straight to my mom?",
        a: "Yes. Enter her address at checkout.",
      },
    ],
    cta: {
      title: "Make Mom's portrait",
      body: "Upload a photo of her dog and see it free in about a minute.",
    },
  },
  {
    slug: "birthday",
    forLabel: "birthdays",
    name: "Birthday",
    card: "Their birthday, or their dog's. Both deserve a portrait.",
    title: "Birthday Gifts for Dog Lovers — Custom Dog Portraits",
    metaDescription:
      "A birthday gift dog lovers actually want: a custom portrait of their dog. Preview free, send a Gift Reveal on the day, and ship the print to their door.",
    eyebrow: "Birthday gifts",
    h1: "A birthday gift with a wagging tail",
    lede: "For the friend who shows you their dog before they say hello. Make a portrait from a photo you already have, send the Gift Reveal on their birthday, and let the print follow.",
    goodFor: ["gift", "funny"],
    feature: "royal",
    ideas: [
      { title: "For a good laugh", body: `${n("royal")}, ${n("admiral")} or ${n("astronaut")}. Funny, but still a real piece of art.` },
      { title: "For their new apartment", body: `${n("fine-line")} or ${n("mid-century")} in a natural oak frame looks right at home on a modern wall.` },
      { title: "For the dog's birthday", body: "Gotcha day, first birthday, sweet sixteen. A portrait marks the moment." },
    ],
    timing: {
      title: "Forgot it was this week?",
      body: "Order today and send a Gift Reveal instantly. It's a real, beautiful gift on the day, with the print on its way.",
    },
    faq: [
      {
        q: "Can I get a photo of their dog without them knowing?",
        a: "Usually, yes. Their Instagram, a group chat or a friend is a good source. Pick a clear, close-up photo and check it with the free preview.",
      },
      {
        q: "What if their birthday is tomorrow?",
        a: "Order today and send the Gift Reveal on the day. They'll see their portrait instantly, and the print follows in the mail.",
      },
    ],
    cta: {
      title: "Make a birthday portrait",
      body: "Upload a photo of their dog and see it free in about a minute.",
    },
  },
  {
    slug: "new-puppy",
    forLabel: "a new puppy",
    name: "New puppy",
    card: "They're only this small for a few weeks.",
    title: "New Puppy Gifts — A Portrait of Their First Weeks",
    metaDescription:
      "Celebrate a new puppy with a custom portrait made from a photo. Preview free in about a minute, then order a print, framed print or canvas.",
    eyebrow: "New puppy",
    h1: "Their very first portrait",
    lede: "Puppies grow up astonishingly fast. Capture the oversized paws and floppy ears now, while they still fit in your lap.",
    goodFor: ["gift", "decor"],
    feature: "storybook",
    ideas: [
      { title: "A welcome-home gift", body: `For a friend's new arrival, a ${n("storybook")} or ${n("watercolor")} portrait is sweet without being silly.` },
      { title: "For the nursery or kids' room", body: "Puppy and kids growing up together? Hang their portrait where the kids can see it." },
      { title: "Then and now", body: "Order one now and another in a year, in the same style and size, and hang them side by side." },
    ],
    faq: [
      {
        q: "Puppies never sit still. What photo should I use?",
        a: "Catch them when they're sleepy, at their eye level, near a window. A sharp face matters more than a perfect pose. You can try several photos free.",
        link: { href: "/how-it-works#photo-tips", label: "Photo tips" },
      },
      {
        q: "Which style suits a puppy?",
        a: `${n("storybook")} and ${n("watercolor")} feel especially sweet, and ${n("royal")} is very funny on a tiny puppy. Try them all free.`,
      },
    ],
    cta: {
      title: "Capture them while they're tiny",
      body: "Upload a puppy photo and see the portrait free in about a minute.",
    },
  },
  {
    slug: "fathers-day",
    forLabel: "Father's Day",
    name: "Father's Day",
    card: "For the dog dad and his best friend.",
    title: "Father's Day Gifts for Dog Dads — Custom Dog Portraits",
    metaDescription:
      "The Father's Day gift for dog dads: a custom portrait of his dog as an admiral, a king or a classic oil painting. Preview free, then order a print, frame or canvas.",
    eyebrow: "Father's Day",
    h1: "For the dog dad and his best friend",
    lede: "He'll say he doesn't need anything. Then he'll hang a portrait of his dog as a decorated naval admiral above his desk and show everyone who visits. Father's Day is Sunday, June 20, 2027.",
    goodFor: ["gift", "funny"],
    feature: "admiral",
    ideas: [
      { title: "For the office", body: `${n("admiral")} or ${n("oil-classic")} in a natural oak frame, above the desk where the dog naps all day.` },
      { title: "For a good laugh", body: `${n("royal")} or ${n("astronaut")}. He'll pretend it's silly. He'll hang it anyway.` },
      { title: "For a modern space", body: `${n("mid-century")} or ${n("fine-line")} for a garage, den or workshop wall.` },
    ],
    timing: {
      title: "Plan ahead (a little)",
      body: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US, so ordering two weeks ahead is comfortable. Cutting it close? Send a Gift Reveal on the day.`,
    },
    faq: [
      {
        q: "When should I order for Father's Day?",
        a: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} in the US, so about two weeks ahead is a comfortable buffer. The Gift Reveal can be sent instantly, even on the day.`,
      },
      {
        q: "Which style do dog dads like?",
        a: `${n("admiral")} and ${n("royal")} are fun picks, and ${n("oil-classic")} is a classic that suits any room. Try them all free with his dog's photo.`,
      },
    ],
    cta: {
      title: "Make Dad's portrait",
      body: "Upload a photo of his dog and see it free in about a minute.",
    },
  },
];

export const OCCASION_MAP = Object.fromEntries(OCCASIONS.map((o) => [o.slug, o])) as Record<OccasionSlug, Occasion>;

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASION_MAP[slug as OccasionSlug];
}

/** Gift-guide card for "dog lovers who have everything" (no landing page; it points at styles). */
export const EVERYTHING_CARD = {
  name: "Dog lovers who have everything",
  card: "Nobody else will give them a portrait of their own dog.",
  href: "/styles",
  cta: "Browse styles",
};
