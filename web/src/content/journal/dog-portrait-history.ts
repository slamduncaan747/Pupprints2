import type { ArticleInput } from "@/content/types";
import { styleName } from "@/content/helpers";

export const dogPortraitHistory: ArticleInput = {
  slug: "history-of-dog-portraits",
  title: "Dogs in Art: 500 Years of the Dog Portrait",
  metaTitle: "The History of Dog Portraits: 500 Years of Dogs in Art",
  description:
    "From Van Eyck and Titian to Velázquez, Hogarth, Gainsborough and Landseer: how the dog moved from a symbol at someone's feet to the subject of the painting.",
  date: "2026-11-10",
  category: "art-and-style",
  heroStyle: "oil-classic",
  keywords: ["history of dog portraits", "dogs in art", "old master dog painting", "dog portrait painting"],
  related: ["watercolor-vs-oil-vs-line-art", "gift-ideas-for-dog-lovers", "canvas-vs-framed-print-vs-poster"],
  body: [
    {
      type: "paragraph",
      text: "A portrait of a dog on the living-room wall can feel like a modern idea. It isn't. Painters have been putting dogs on canvas for more than five centuries, first as symbols, then as companions to the sitter, and finally as subjects in their own right. Here is how the dog walked from the corner of the picture to the middle of it.",
    },
    { type: "heading", text: "Dogs as symbols: loyalty on four legs" },
    {
      type: "paragraph",
      text: "In early European art, a dog at someone's feet was rarely just a pet. It was a symbol, most often of fidelity. Medieval tomb effigies frequently show a small dog curled at the feet of the person commemorated. In Jan van Eyck's *Arnolfini Portrait* of 1434, a small, shaggy dog stands between the couple, widely read by art historians as a sign of faithfulness, and perhaps of wealth too, since lap dogs were a luxury.",
    },
    {
      type: "paragraph",
      text: "That association never really went away. The classic dog name Fido comes from the Latin *fidus*, meaning faithful.",
    },
    { type: "heading", text: "The Renaissance court: the dog beside the sitter" },
    {
      type: "paragraph",
      text: "By the 16th century, the dog had moved from symbol to co-star. In 1533 Titian painted the Holy Roman Emperor Charles V standing beside a large hound, one hand resting on its collar. The composition followed an earlier portrait by the Austrian court painter Jakob Seisenegger, but Titian's version, now in the Prado in Madrid, is the one that became famous. The hound is painted with as much attention as the emperor.",
    },
    {
      type: "paragraph",
      text: "A century later in Spain, Diego Velázquez gave dogs some of the best supporting roles in art history. In *Las Meninas* (1656), a large mastiff lies in the foreground, utterly unbothered while a young courtier nudges it with his foot. A few years later, Velázquez's portrait of the little Prince Philip Prosper included a tiny dog perched on a chair, gazing straight out at the viewer.",
    },
    { type: "heading", text: "The Stuart spaniels" },
    {
      type: "paragraph",
      text: "In England, the Stuart kings were rarely painted far from a small spaniel. Anthony van Dyck, court painter to Charles I, included little spaniels in his portraits of the king's children, and Charles II was so devoted to his toy spaniels that the dogs ended up named after him. The diarist Samuel Pepys recorded the king playing with his dog during a council meeting when he might have been attending to business.",
    },
    {
      type: "paragraph",
      text: "Those spaniels never really left the frame. In the 1920s, an American named Roswell Eldridge offered prize money at Crufts, the British dog show, for spaniels that looked like the ones in the old paintings, with longer noses than the fashionable toy spaniels of the day. Breeders rose to the challenge, and the result is the breed we now call the [Cavalier King Charles Spaniel](/breeds/cavalier-king-charles-spaniel): a dog revived, quite literally, from paintings.",
    },
    { type: "heading", text: "The 18th century: Hogarth, Gainsborough and Goya" },
    {
      type: "paragraph",
      text: "By the 18th century, dogs had become part of how people chose to be seen. William Hogarth painted himself in 1745 with his pug, Trump, who sits in the foreground almost as prominently as the artist. In Spain, Francisco Goya's 1795 portrait of the Duchess of Alba includes a small white dog at her feet, with a red bow on its leg that echoes the red bows of her dress.",
    },
    {
      type: "paragraph",
      text: "And then the sitter left the picture altogether. Around 1777 Thomas Gainsborough painted a [Pomeranian](/breeds/pomeranian) and her puppy on their own, giving them the same feathery brushwork he gave duchesses. The dog was no longer an accessory. It was the portrait.",
    },
    { type: "heading", text: "Queen Victoria and the golden age of dog painting" },
    {
      type: "paragraph",
      text: "Few people did more for the dog portrait than Queen Victoria. She adored her dogs and had many of them painted, above all by Sir Edwin Landseer, the most celebrated animal painter of the age. Landseer painted her spaniel Dash and Prince Albert's greyhound Eos, and his work helped make dogs respectable subjects for serious art.",
    },
    {
      type: "paragraph",
      text: "What the Victorian painters understood is what anyone who lives with a dog knows: the character is all in the face. A good dog portrait needs very little else.",
    },
    { type: "heading", text: "Beyond oil: paper, ink and print" },
    {
      type: "paragraph",
      text: "Oil was never the only medium. Artists have long drawn animals in charcoal and chalk as studies from life, painted them in watercolor, and cut them into wood and, later, linoleum blocks for printing. Each medium keeps something different: oil holds depth and light, charcoal holds expression, watercolor holds softness, and a relief print reduces a dog to its boldest shapes. Our [style guide](/journal/watercolor-vs-oil-vs-line-art) compares them side by side.",
    },
    { type: "heading", text: "What makes a good dog portrait today" },
    {
      type: "paragraph",
      text: "The lessons of five centuries are simple, and they still hold:",
    },
    {
      type: "list",
      items: [
        "**Likeness first.** It has to be unmistakably their dog. A sharp photo at eye level is the foundation; our [photo guide](/journal/how-to-photograph-your-dog-for-a-portrait) covers the details.",
        "**One soft light.** The old masters lit their sitters from one side against a quiet background. It is still the most flattering light there is.",
        "**Only the dog.** The portraits that last are the ones with nothing to distract from the face.",
        "**A medium that suits the room.** Oil for warmth and weight, paper and ink for lighter, more modern spaces.",
        "**Frame it properly.** A black or natural oak frame, or a gallery canvas, finishes the piece. See [canvas vs. framed print](/journal/canvas-vs-framed-print-vs-poster).",
      ],
    },
    {
      type: "styles",
      slugs: ["oil-classic", "charcoal", "watercolor"],
      caption: "Three mediums with a long history of dogs",
    },
    {
      type: "cta",
      title: "A portrait in that tradition",
      body: "Upload a photo and see your dog as a classical oil portrait, free, in about a minute.",
      href: "/create?style=oil-classic",
      label: `Try ${styleName("oil-classic")} free`,
      style: "oil-classic",
    },
  ],
};
