import type { ArticleInput } from "@/content/types";
import { styleLink } from "@/content/helpers";

export const newPuppyGifts: ArticleInput = {
  slug: "new-puppy-gift-ideas",
  title: "New Puppy Gift Ideas: What to Give a Brand-New Dog Parent",
  description:
    "Practical, thoughtful gifts for a friend with a new puppy or a newly adopted dog: what they'll need in week one, what they won't think of, and a keepsake for later.",
  date: "2026-10-10",
  category: "gift-guides",
  heroStyle: "storybook",
  keywords: ["new puppy gifts", "gifts for new puppy owners", "new dog owner gift", "puppy gift ideas"],
  related: ["gift-ideas-for-dog-lovers", "how-to-photograph-your-dog-for-a-portrait", "gifts-for-dog-moms"],
  body: [
    {
      type: "paragraph",
      text: "A new puppy turns a household upside down in the best possible way. There are tiny teeth on everything, alarms at 3 a.m. and more photos taken in a week than in the whole previous year. If someone you love just brought home a puppy (or adopted an adult dog, which deserves every bit as much celebration), here are gifts that actually help.",
    },
    { type: "heading", text: "Before you buy: ask two questions" },
    {
      type: "paragraph",
      text: "New dog parents often receive duplicates of the basics, so a quick check helps. Ask what they already have, and ask about size: a collar for a [Chihuahua](/breeds/chihuahua) puppy and one for a [Great Dane](/breeds/great-dane) puppy are very different things, and big breeds outgrow gear fast. When in doubt, experiences, consumables and keepsakes are always the right size.",
    },
    { type: "heading", text: "The week-one essentials" },
    { type: "heading", level: 3, text: "An enzyme cleaner" },
    {
      type: "paragraph",
      text: "Accidents will happen. Enzyme-based cleaners break down the odor compounds that ordinary cleaners leave behind, which helps discourage repeat accidents in the same spot. Not glamorous. Deeply appreciated.",
    },
    { type: "heading", level: 3, text: "Chew toys in the right size" },
    {
      type: "paragraph",
      text: "Puppies teethe, and they will chew something. Give them a few good options: a rubber chew toy, a rope toy and something soft to snuggle. Match the size to the puppy so nothing can be swallowed.",
    },
    { type: "heading", level: 3, text: "A cozy crate setup" },
    {
      type: "paragraph",
      text: "If they're crate training, a washable crate pad and a breathable cover can help turn the crate into a calm, den-like space.",
    },
    { type: "heading", level: 3, text: "Baby gates" },
    {
      type: "paragraph",
      text: "For keeping a puppy out of the kitchen, off the stairs and away from the shoe rack. Every puppy household needs at least one.",
    },
    { type: "heading", level: 3, text: "Tiny training treats" },
    {
      type: "paragraph",
      text: "Small, soft treats are the currency of puppy training, and they go fast. A big bag is a gift that gets used every single day.",
    },
    { type: "heading", level: 3, text: "A long training line" },
    {
      type: "paragraph",
      text: "A lightweight long lead makes practicing recall in open spaces safer while the puppy learns to come back.",
    },
    { type: "heading", text: "Gifts of time and help" },
    { type: "heading", level: 3, text: "A puppy class" },
    {
      type: "paragraph",
      text: "Group classes teach basic manners and give puppies safe, supervised time with people and other dogs. Many classes ask for proof of first vaccinations, so the trainer and the puppy's vet can advise on timing.",
    },
    { type: "heading", level: 3, text: "Prepaid walks or a sitter visit" },
    {
      type: "paragraph",
      text: "Young puppies need frequent bathroom breaks. A few midday visits from a dog walker or sitter are a lifesaver for anyone who works away from home.",
    },
    { type: "heading", level: 3, text: "Dinner" },
    {
      type: "paragraph",
      text: "Seriously. The first weeks with a puppy are a lot like the first weeks with a newborn, minus most of the diapers. A dropped-off meal is always welcome.",
    },
    { type: "heading", text: "Keepsakes for a moment that won't last" },
    {
      type: "paragraph",
      text: "Puppies grow astonishingly fast. The oversized paws, the floppy ears and the way they fit in one arm are gone within months. That's what makes a keepsake gift so special.",
    },
    { type: "heading", level: 3, text: "A portrait of the puppy" },
    {
      type: "paragraph",
      text: `A ${styleLink("storybook")} or ${styleLink("watercolor")} portrait captures how small they are right now, and ${styleLink("royal")} is very funny on a tiny puppy. With us, you can preview it free from any phone photo, then order a framed print or canvas. A lovely tradition: order another portrait in the same style and size a year later, and hang them side by side.`,
    },
    { type: "heading", level: 3, text: "A first-year photo book" },
    {
      type: "paragraph",
      text: "Promise to make it, then actually make it: a photo book of the first twelve months, from the car ride home to the first birthday.",
    },
    { type: "heading", level: 3, text: "A paw print kit" },
    {
      type: "paragraph",
      text: "Capture a paw print in the first weeks and another at one year. The difference is astonishing, and a little bit emotional.",
    },
    {
      type: "tip",
      title: "Photographing a puppy for a portrait",
      text: "Wait until they're sleepy, sit near a window and get down to their eye level. A sharp face matters more than a perfect pose. Our [photo guide](/journal/how-to-photograph-your-dog-for-a-portrait) has more tricks.",
    },
    { type: "heading", text: "For a newly adopted adult dog" },
    {
      type: "paragraph",
      text: "Adopting an adult or senior dog is a big, generous thing to do. The gifts are similar, minus the teething: a comfortable bed, a good collar with an ID tag, and something to celebrate the gotcha day. A portrait is a beautiful way to mark the start of a new life together. See our [rescue and mixed-breed portraits](/breeds/mixed-breed).",
    },
    { type: "heading", text: "What not to give" },
    {
      type: "list",
      items: [
        "**A surprise second animal.** Even for obvious dog people, the decision to add another pet should be theirs.",
        "**Very hard chews for very young puppies.** Baby teeth are delicate; the puppy's vet can advise on what's appropriate.",
        "**Too many squeaky toys.** One or two is fun. Twelve is a cry for help from the neighbors.",
      ],
    },
    {
      type: "paragraph",
      text: "More ideas on our [new puppy gifts page](/gifts/new-puppy) and in our list of [25 gifts for dog lovers](/journal/gift-ideas-for-dog-lovers).",
    },
    {
      type: "cta",
      title: "Capture them while they're tiny",
      body: "Upload a puppy photo and see the portrait free in about a minute.",
      href: "/create?style=storybook",
      label: "Create a free preview",
      style: "storybook",
    },
  ],
};
