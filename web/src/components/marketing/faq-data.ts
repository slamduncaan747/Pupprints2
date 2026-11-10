/**
 * The site FAQ. Every number is pulled from @/lib/catalog (via ./commerce) so answers match checkout.
 * Answers are plain text (blank line = new paragraph) because they also feed FAQPage JSON-LD.
 */
import { availableStyles, PRODUCT_MAP, PRODUCTS } from "@/lib/catalog";
import { site } from "@/lib/config";
import { formatPrice } from "@/lib/utils";
import type { FaqItem } from "@/components/marketing/faq";
import {
  ADDON_LINE,
  CANADA_SHIPPING_LABEL,
  CHRISTMAS_CA_CUTOFF,
  CHRISTMAS_US_CUTOFF,
  PHYSICAL_PRODUCTS,
  SHIP_REGIONS,
  fromPrice,
  joinWords,
  shipWindow,
} from "@/components/marketing/commerce";

const print = PRODUCT_MAP.poster;
const framed = PRODUCT_MAP.framed;
const canvas = PRODUCT_MAP.canvas;

const priceLine = PRODUCTS.map(
  (p) => `${p.name}: ${p.variants.length > 1 ? "from " : ""}${formatPrice(fromPrice(p))}`,
).join(". ");

const shipLines = PHYSICAL_PRODUCTS.map((p) => `${p.name}: ${shipWindow(p)}`).join(". ");

const sizeLines = PHYSICAL_PRODUCTS.map((p) => `${p.name}: ${joinWords(p.variants.map((v) => v.label))}`).join(". ");

export type FaqGroup = { id: string; title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "ordering",
    title: "Ordering",
    items: [
      {
        q: "How does ordering work?",
        a: "Upload a photo of your dog, pick a style and see your portrait. If you like it, choose a digital file, fine art print, framed print or canvas and check out.",
        link: { href: "/how-it-works", label: "See how it works" },
      },
      {
        q: "Do I have to pay to see my portrait?",
        a: "No. You see your portrait before you pay, and you can try other styles and photos as often as you like.",
      },
      {
        q: "How much does a portrait cost?",
        a: `${priceLine}.\n\nThe price you see is the price you pay: US shipping is free on every order, and the hi-res digital file is included with every print, framed print and canvas. Shipping to Canada is a flat ${CANADA_SHIPPING_LABEL} per order.`,
        link: { href: "/shop", label: "See every size and price" },
      },
      {
        q: "Are there any hidden fees or add-ons?",
        a: `No. US shipping is free and the high-resolution digital file is included with every physical order. With a print, framed print or canvas you can choose to add a matching ${ADDON_LINE}; nothing is added for you.`,
      },
      {
        q: "Can I change or cancel my order?",
        a: `Yes, just email us as soon as you can. If your piece hasn't gone to print yet, we'll update or cancel it at no charge. Once it's printed, our returns policy applies.`,
        link: { href: "/guarantee", label: "Returns" },
      },
      {
        q: "What payment methods do you accept?",
        a: "All major credit and debit cards, plus Apple Pay and Google Pay where your device supports them. Payments are processed securely by Stripe; we never see or store your full card number.",
      },
      {
        q: "Can I put more than one dog in a portrait?",
        a: "Right now each portrait features one dog, which is how we get the likeness right. For two or more dogs, a matching set in the same style and size looks lovely hung side by side.",
      },
      {
        q: "Can you add my dog's name to the portrait?",
        a: "Yes. When you create your portrait you can choose to have your dog's name lettered on it, or leave it without.",
      },
    ],
  },
  {
    id: "photos",
    title: "Photos",
    items: [
      {
        q: "What kind of photo works best?",
        a: "A sharp, close-up photo taken at your dog's eye level, in soft natural light, with both eyes and ears in the frame. A phone photo is perfect.",
        link: { href: "/how-it-works#photo-tips", label: "See our photo tips" },
      },
      {
        q: "Can I use an old, blurry or low-resolution photo?",
        a: "Usually, yes. Older and slightly blurry photos often work better than you'd expect, so try it and see. If you'd like a second opinion on which photo to use, email us and we'll help.",
      },
      {
        q: "Can I make a portrait of a dog who has passed away?",
        a: "Yes. Any photo you treasure is a good place to start, and you'll see the portrait before you pay anything. If you're unsure which photo to use, email us and we'll gladly help.",
        link: { href: "/gifts/memorial", label: "Memorial portraits" },
      },
      {
        q: "What file types can I upload?",
        a: "JPG, PNG, WebP and HEIC (the default on iPhone). Photos straight from your camera roll are ideal, and large photos are fine: we resize them on your device before uploading.",
      },
      {
        q: "Can you change my dog's pose or background?",
        a: "Each style creates its own setting, so the background is part of the art. Your dog's pose comes from your photo, so if you'd like a different pose, try a different photo.",
      },
      {
        q: "Do you do cats or other pets?",
        a: "Not yet. We're dog people through and through, and focusing on dogs lets us get every breed's details right.",
      },
    ],
  },
  {
    id: "styles",
    title: "Styles & art",
    items: [
      {
        q: "How is the art made?",
        a: "Our AI artist creates your portrait from your photo in the style you choose, and our team finishes it. You see the art before you pay.",
        link: { href: "/how-it-works#how-its-made", label: "More on how the art is made" },
      },
      {
        q: "Is it hand-painted?",
        a: "No. Your portrait is created digitally by our AI artist and printed with archival pigment inks. It's designed to look like a painting or drawing.",
      },
      {
        q: "Will it actually look like my dog?",
        a: "Our styles are built to keep your dog's face shape, markings, eye color and ears. You see the portrait before paying, so you can judge for yourself.",
      },
      {
        q: "How many styles are there, and can I try more than one?",
        // A getter, so the count is read at render time (a dated edition leaves on its last day).
        get a() {
          const names = availableStyles().map((s) => s.name);
          return `There are ${names.length} styles right now: ${joinWords(names)}. You can try as many as you like with your photo.`;
        },
        link: { href: "/styles", label: "Browse all styles" },
      },
      {
        q: "What if I don't love the preview?",
        a: "Generate it again, or try another style or a different photo. It costs nothing.",
      },
      {
        q: "Can I ask for small changes?",
        a: "If something small is off, like a marking or eye color, try regenerating first; each version is a little different. If you're still not happy, email us and we'll help.",
      },
    ],
  },
  {
    id: "printing",
    title: "Printing & products",
    items: [
      {
        q: "What can I order?",
        a: `${priceLine}. Every physical piece comes with the hi-res digital file at no extra cost.`,
        link: { href: "/shop", label: "Compare products" },
      },
      {
        q: "What sizes are available?",
        a: `${sizeLines}.`,
      },
      {
        q: "What paper and inks do you use?",
        a: `${print.details.slice(0, 2).join(". ")}.`,
      },
      {
        q: "What are the frames like?",
        a: `${framed.details.slice(0, 2).join(". ")}. Framed prints arrive ready to hang.`,
        link: { href: "/shop/framed", label: "Framed print details" },
      },
      {
        q: "What's the canvas like?",
        a: `${canvas.details.join(". ")}.`,
        link: { href: "/shop/canvas", label: "Canvas details" },
      },
      {
        q: "Is the digital file really included?",
        a: "Yes. Every print, framed print and canvas includes the high-resolution, unwatermarked digital file, delivered by email. Share it, post it, make it your lock screen.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    items: [
      {
        q: "Where do you ship?",
        a: `We ship to ${SHIP_REGIONS}. Digital files are delivered by email anywhere.`,
      },
      {
        q: "How long will it take?",
        a: `Estimated production plus delivery times in the US: ${shipLines}. Digital files arrive by email right after checkout. Canadian orders usually take a few extra business days.`,
        link: { href: "/shipping", label: "Shipping details" },
      },
      {
        q: "How much is shipping?",
        a: `US shipping is free on every order, with no minimum. Shipping to Canada is a flat ${CANADA_SHIPPING_LABEL} per order. Digital files are always free to deliver.`,
      },
      {
        q: "How do I track my order?",
        a: "We email you a tracking link as soon as your order ships. You can also check its status any time on our order tracking page.",
        link: { href: "/track", label: "Track an order" },
      },
      {
        q: "When should I order for Christmas?",
        a: `For standard US delivery before Christmas, we recommend ordering physical pieces by ${CHRISTMAS_US_CUTOFF} (${CHRISTMAS_CA_CUTOFF} for Canada). That's guidance, not a promise, since carriers get busy in December.`,
        link: { href: "/shipping#holidays", label: "Holiday order dates" },
      },
    ],
  },
  {
    id: "guarantee",
    title: "Returns",
    items: [
      {
        q: "What if I don't love my printed piece?",
        a: "Tell us within 30 days of delivery and we'll remake it or refund you in full.",
        link: { href: "/guarantee", label: "Returns policy" },
      },
      {
        q: "What if the person I give it to would prefer a different style?",
        a: "They can ask for a different style within 30 days of delivery and we'll remake it at no charge. They (or you) just write to us; no receipt or return needed.",
        link: { href: "/guarantee", label: "Returns policy" },
      },
      {
        q: "My order arrived damaged. What now?",
        a: "Email us a photo of the damage and we'll send a replacement at no charge.",
      },
      {
        q: "Custom items are usually final sale. Is that true here?",
        a: "No. The same returns policy applies to every piece, and there are no restocking fees.",
      },
      {
        q: "Do I need to send the piece back?",
        a: "Usually not. For damaged or defective pieces a photo is all we need. If we ever do need something back, we'll cover the return shipping.",
      },
    ],
  },
  {
    id: "gifts",
    title: "Gifts & gift cards",
    items: [
      {
        q: "Can I ship the portrait straight to the recipient?",
        a: "Yes. Just enter their address at checkout.",
      },
      {
        q: "How do I get a photo of their dog without spoiling the surprise?",
        a: "A clear photo from their Instagram or a group chat usually works well. You see the portrait before you buy.",
      },
      {
        q: "Do you sell gift cards?",
        a: "Digital gift cards are coming soon, so the recipient can choose their own photo and style. Join the list on our gift card page and we'll let you know the moment they're ready.",
        link: { href: "/gift-cards", label: "Gift cards" },
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    items: [
      {
        q: "What do you do with my photos?",
        a: "We use your photos only to make your portrait and fulfill your order. We never sell them. We don't use your photos or portraits in our marketing unless you give us permission.",
        link: { href: "/privacy", label: "Privacy policy" },
      },
      {
        q: "Can I ask you to delete my photos?",
        a: `Yes. Email ${site.supportEmail} and we'll delete your photos and previews from our systems.`,
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items);

export function faq(q: string) {
  const item = ALL_FAQS.find((i) => i.q === q);
  if (!item) throw new Error(`Unknown FAQ: ${q}`);
  return item;
}
