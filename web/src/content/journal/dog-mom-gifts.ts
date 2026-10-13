import type { ArticleInput } from "@/content/types";
import { addonPrice, styleLink } from "@/content/helpers";
import { PHYSICAL_SHIP_WINDOW } from "@/components/marketing/commerce";

export const dogMomGifts: ArticleInput = {
  slug: "gifts-for-dog-moms",
  title: "Gifts for Dog Moms: Mother's Day Ideas She'll Actually Love",
  metaTitle: "Gifts for Dog Moms: Mother's Day Ideas She'll Love",
  description:
    "Thoughtful gifts for dog moms, for Mother's Day (Sunday, May 9, 2027) or any day: personal keepsakes, practical upgrades, gifts of time, and how to make it come from the dog.",
  date: "2026-10-09",
  category: "gift-guides",
  heroStyle: "botanical",
  keywords: ["dog mom gifts", "gifts for dog moms", "mother's day gifts for dog moms", "dog mom gift ideas"],
  related: ["gift-ideas-for-dog-lovers", "new-puppy-gift-ideas", "what-to-write-in-a-pet-sympathy-card"],
  body: [
    {
      type: "paragraph",
      text: "Dog moms are a particular kind of mother. They know the vet's receptionist by name, carry treats in every coat pocket and have more photos of the dog than of themselves. Whether she's your mom, your partner, your sister or your best friend, here are gifts that honor both halves of the relationship.",
    },
    {
      type: "paragraph",
      text: "Mother's Day 2027 falls on Sunday, May 9. Everything here works just as well for a birthday or the holidays, which is when dog moms tend to get shopped for most.",
    },
    { type: "heading", text: "First: make it come from the dog" },
    {
      type: "paragraph",
      text: "The single best upgrade to any dog-mom gift costs nothing: sign the card from the dog. A paw-print signature is optional (and messy). If there are kids in the house, let them write it in the dog's voice, spelling mistakes and all. It's very hard to beat.",
    },
    {
      type: "paragraph",
      text: 'Not sure what to write? Something like "Thanks for the walks, the treats and for letting me on the couch (even when you said I wasn\'t allowed). Love, Bailey" does the job beautifully.',
    },
    { type: "heading", text: "Match the gift to the dog mom" },
    {
      type: "paragraph",
      text: "Dog moms come in a few recognizable varieties. Knowing which one you're shopping for narrows things down fast:",
    },
    {
      type: "list",
      items: [
        "**The homebody.** Her dog's favorite place is her lap, and hers is the sofa. Think cozy and beautiful: a framed portrait for the living room, a soft throw that hides dog hair, a candle for the evenings.",
        "**The adventurer.** Weekends are trails, beaches and muddy paws. She'll love gear that makes outings easier: a hands-free leash, a packable water bowl, a car seat cover, or a booked day trip somewhere new.",
        "**The minimalist.** She doesn't want more stuff, so give her one good thing. A single fine-line portrait in a natural oak frame, or an experience with no physical footprint at all.",
        "**The multi-dog household.** Each of our portraits features one dog, so give her a matching set: the same style and size for each dog, hung side by side. Nobody gets left out, and the set looks wonderful as a group.",
        "**The senior-dog mom.** Her dog has a grey muzzle and a slower walk. Comfort gifts (an orthopedic bed, a ramp for the car) mean a lot, and so does a portrait that captures this gentle chapter.",
      ],
    },
    { type: "heading", text: "Personal keepsakes" },
    { type: "heading", level: 3, text: "A portrait of her dog" },
    {
      type: "paragraph",
      text: `A framed portrait is a gift she'll see every day. Match the style to her home: ${styleLink("watercolor")} or ${styleLink("botanical")} for a soft, light-filled space, ${styleLink("fine-line")} for a modern apartment, or ${styleLink("royal")} if her dog is, frankly, in charge. Framed prints arrive ready to hang, and you can send her a Gift Reveal on Mother's Day morning while the print is on its way.`,
    },
    { type: "heading", level: 3, text: "Jewelry with meaning" },
    {
      type: "paragraph",
      text: "A small engraved charm with her dog's name, a paw outline or a nose-print impression. Delicate enough to wear every day, personal enough that she'll be asked about it.",
    },
    { type: "heading", level: 3, text: "A year-with-the-dog photo book" },
    {
      type: "paragraph",
      text: "Raid her social media (or the family group chat) for the best dog photos of the year and have them printed in a book. Add captions in the dog's voice for bonus points.",
    },
    { type: "heading", level: 3, text: "Her dog on her morning coffee" },
    {
      type: "paragraph",
      text: `If you're ordering a portrait from us, you can add an 11oz ceramic mug with the same portrait for ${addonPrice("addon-mug")}. She'll think of you, and the dog, every morning.`,
    },
    { type: "heading", text: "Practical gifts for everyday dog life" },
    { type: "heading", level: 3, text: "A beautiful leash and collar set" },
    {
      type: "paragraph",
      text: "Good leather or waterproof biothane that will last for years, in a color that suits her and the dog. Add an engraved ID tag with her current phone number.",
    },
    { type: "heading", level: 3, text: "A walking bag or treat pouch" },
    {
      type: "paragraph",
      text: "A crossbody bag with room for a phone, keys, treats and bags makes every walk easier, and it looks better than the plastic pouch she's been using since 2019.",
    },
    { type: "heading", level: 3, text: "Weatherproof walking gear" },
    {
      type: "paragraph",
      text: "A genuinely good rain jacket or waterproof boots. Dogs don't check the forecast, so neither can she.",
    },
    { type: "heading", level: 3, text: "Grooming, sorted" },
    {
      type: "paragraph",
      text: "A gift certificate for her dog's groomer, or a quality brush and a gentle dog shampoo suited to the dog's coat.",
    },
    { type: "heading", text: "Gifts of time" },
    { type: "heading", level: 3, text: "A day off" },
    {
      type: "paragraph",
      text: "Book the dog a day of daycare or a few walks with a trusted dog walker, so she can actually rest. Then book her something lovely for that day, too.",
    },
    { type: "heading", level: 3, text: "A day out, together" },
    {
      type: "paragraph",
      text: "A dog-friendly brunch, a new hiking trail or a day at the beach. The best gift for a dog mom is often a great day with her dog.",
    },
    { type: "heading", text: "For a brand-new dog mom" },
    {
      type: "paragraph",
      text: `First Mother's Day with a puppy or a newly adopted dog? A ${styleLink("storybook")} portrait captures how small they are right now. Our guide to [new puppy gifts](/journal/new-puppy-gift-ideas) has more ideas for that chaotic, wonderful first year.`,
    },
    { type: "heading", text: "For a dog mom who's grieving" },
    {
      type: "paragraph",
      text: "Mother's Day can be hard for someone whose dog has recently died. A gentle memorial portrait, a donation in the dog's name or a heartfelt card that says the dog's name can mean a great deal. See our [memorial ideas](/journal/dog-memorial-ideas) and our guide to [what to write in a sympathy card](/journal/what-to-write-in-a-pet-sympathy-card).",
    },
    { type: "heading", text: "When to order for Mother's Day" },
    {
      type: "paragraph",
      text: `Physical pieces take ${PHYSICAL_SHIP_WINDOW} to arrive in the US, so ordering about two weeks ahead is comfortable. Cutting it close? The Gift Reveal can be sent instantly, even on the morning of May 9. See our [Mother's Day gifts page](/gifts/mothers-day) for more.`,
    },
    {
      type: "cta",
      title: "Make her dog's portrait",
      body: "Upload a photo of her dog and see the portrait free in about a minute. Only order if you love it.",
      href: "/create?style=botanical",
      label: "Create a free preview",
      style: "botanical",
    },
  ],
};
