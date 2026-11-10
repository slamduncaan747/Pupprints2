import type { ArticleInput } from "@/content/types";
import { styleLink, styleName } from "@/content/helpers";

export const styleGuide: ArticleInput = {
  slug: "watercolor-vs-oil-vs-line-art",
  title: "Watercolor vs. Oil vs. Line Art: How to Choose a Portrait Style for Your Dog",
  metaTitle: "Watercolor vs. Oil vs. Line Art: Choosing a Dog Portrait Style",
  description:
    "A practical guide to dog portrait styles: what makes oil, watercolor and line art look the way they do, which suits your dog and your home, and which work best for gifts and memorials.",
  date: "2026-10-02",
  category: "art-and-style",
  heroStyle: "fine-line",
  keywords: [
    "dog portrait styles",
    "watercolor dog portrait",
    "oil painting of dog",
    "line art dog portrait",
    "linocut dog portrait",
    "charcoal dog portrait",
  ],
  related: ["history-of-dog-portraits", "canvas-vs-framed-print-vs-poster", "what-size-art-for-your-wall"],
  body: [
    {
      type: "paragraph",
      text: "Choosing a portrait style is a bit like choosing a haircut: it's about the dog, and it's about you. The same Labrador can look like a 17th-century oil painting, a loose watercolor or a Scandinavian gallery print. Here's how the main families of style differ, and how to pick the one that fits.",
    },
    {
      type: "tip",
      tone: "note",
      title: "How our portraits are made",
      text: "Our portraits are created digitally by our AI artist in the look of each medium, then checked by a person on our team before printing. They're designed to look like paintings and drawings, but they aren't painted by hand. Knowing how the real mediums behave still helps you choose. More in [how it works](/how-it-works).",
    },
    { type: "heading", text: "Oil: rich, warm and timeless" },
    {
      type: "paragraph",
      text: "Oil paint dries slowly and can be built up in layers, which lets painters blend soft transitions and add thick, textured highlights. The look is rich and deep: warm shadows, glowing light and visible brushstrokes. It's the language of museum portraiture, which is why it reads as serious and permanent.",
    },
    {
      type: "paragraph",
      text: `We have two oil-inspired styles. ${styleLink("oil-classic")} is the classical one: just your dog, in soft old-master light against a warm, dark ground. ${styleLink("modern-oil")} is its contemporary cousin, built from thick palette-knife strokes against one flat, muted color.`,
    },
    {
      type: "list",
      items: [
        "**Choose oil if** you want something that feels like an heirloom.",
        "Your dog has a rich coat: black, chocolate, red or brindle. [Labradors](/breeds/labrador-retriever), [Rottweilers](/breeds/rottweiler) and [Golden Retrievers](/breeds/golden-retriever) glow in it.",
        "Your home leans classic, warm or traditional.",
        `It's a memorial and you'd like something calm and dignified. ${styleName("oil-classic")} is quiet in exactly that way.`,
      ],
    },
    { type: "heading", text: "Watercolor: soft, light and emotional" },
    {
      type: "paragraph",
      text: "Real watercolor is transparent pigment carried in water and painted onto textured paper. Colors bloom and bleed into each other, and the white of the paper becomes part of the image. The result is light, airy and loose, with crisp detail only where it matters, usually the eyes and nose.",
    },
    {
      type: "paragraph",
      text: `${styleLink("watercolor")} is our lightest style, and ${styleLink("botanical")}, with its painted garden stems, shares the same gentle mood. ${styleLink("pastel")} sits between watercolor and oil: velvety layered strokes on warm toned paper, soft in the coat and exact in the eyes.`,
    },
    {
      type: "list",
      items: [
        "**Choose watercolor if** you want something gentle and light.",
        "Your dog has a pale or patterned coat: cream, white, apricot or merle. [Australian Shepherds](/breeds/australian-shepherd) and [Goldendoodles](/breeds/goldendoodle) look lovely in it.",
        "Your room is bright, Scandinavian or coastal.",
        "It's a memorial and you want warmth more than drama.",
      ],
    },
    { type: "heading", text: "Line art: minimal and modern" },
    {
      type: "paragraph",
      text: "Fine line art is drawing pared back to its essentials: confident black ink lines on warm paper, little or no shading and plenty of empty space. It's restrained and graphic, the kind of piece that suits a modern gallery wall.",
    },
    {
      type: "paragraph",
      text: `${styleLink("fine-line")} is our minimalist style. ${styleLink("charcoal")} is its moodier, more expressive cousin, with soft smudges, rich blacks and a lot of feeling in the eyes. ${styleLink("ink-wash")} trades the pen for a brush: a few confident strokes, soft grey washes and a great deal of empty paper.`,
    },
    {
      type: "list",
      items: [
        "**Choose line art if** your home is modern or minimalist.",
        "Your dog has a distinctive outline: big ears, a beard, a sculpted clip. [Miniature Schnauzers](/breeds/miniature-schnauzer), [Border Collies](/breeds/border-collie) and [Poodles](/breeds/poodle) are naturals.",
        "You'd like a portrait that's subtle rather than loud.",
        "You're building a gallery wall with other black-and-white pieces.",
      ],
    },
    { type: "heading", text: "Bold and graphic: linocut and mid-century" },
    {
      type: "paragraph",
      text: `If oil is a museum and watercolor is a sunny studio, these are the printmaker's bench. A linocut is a relief print: the artist carves away everything that should stay white, inks the block and presses it to paper. ${styleLink("linocut")} has that look, with bold carved shapes, one or two matte inks and the small gouge marks left behind. ${styleLink("mid-century")} is flatter and more geometric, with simplified shapes, a warm retro palette and a subtle print texture.`,
    },
    {
      type: "list",
      items: [
        "**Choose graphic styles if** you want something bold that still sits quietly on the wall.",
        "Your interior is modern, eclectic or retro.",
        "Your dog has a strong silhouette. [French Bulldogs](/breeds/french-bulldog), [Dachshunds](/breeds/dachshund) and [Boston Terriers](/breeds/boston-terrier) are made for it.",
      ],
    },
    { type: "heading", text: "Matching the style to the coat" },
    {
      type: "paragraph",
      text: "Your dog's coat has a lot to say about which style will flatter them. A few rules of thumb:",
    },
    {
      type: "list",
      items: [
        `**Black and very dark coats** shine in the oil styles and ${styleLink("charcoal")}, which are built on deep shadows and warm highlights. ${styleName("linocut")} works too, turning a dark coat into a bold graphic shape.`,
        "**White, cream and pale coats** look luminous in watercolor and fine line, where the paper does half the work. In oil, a pale dog glows dramatically against a dark background.",
        "**Merle, brindle and patchwork coats** keep their texture in painterly styles. Graphic styles simplify patterns, so choose those when you want boldness over detail.",
        "**Wiry, curly and fluffy coats** look wonderful in line and charcoal, which emphasize texture. Watercolor softens it into something dreamier.",
      ],
    },
    { type: "heading", text: "Styles for gifts and memorials" },
    {
      type: "paragraph",
      text: `For a gift, think about the wall it will hang on. If you're unsure of their taste, a classic like ${styleName("oil-classic")} or ${styleName("watercolor")} suits almost any home, and ${styleName("linocut")} or ${styleName("ink-wash")} suits a modern one. For a memorial, most people lean toward the gentler styles (${styleName("watercolor")}, ${styleName("charcoal")}, ${styleName("pastel")}), but the only real rule is that it should feel like the dog.`,
    },
    { type: "heading", text: "Three questions to help you decide" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Where will it hang?** Start with the room. Warm, traditional rooms love oil; bright, modern rooms love watercolor and line; rooms with color and pattern love a linocut or a mid-century print.",
        `**What's the mood?** Tender (${styleName("watercolor")}, ${styleName("pastel")}, ${styleName("botanical")}), timeless (${styleName("oil-classic")}, ${styleName("charcoal")}) or modern (${styleName("linocut")}, ${styleName("ink-wash")}, ${styleName("fine-line")})?`,
        "**Who is it for?** For a gift, think about the recipient's home and taste, not your own.",
      ],
    },
    { type: "heading", text: "Or just try them all" },
    {
      type: "paragraph",
      text: "Here's the nice thing about choosing a style with us: you don't have to guess. Upload a photo and you can preview every style free, as many times as you like. The style that looks most like your dog isn't always the one you'd expect. Not sure which suits your breed? Each of our [breed pages](/breeds) suggests a few.",
    },
    { type: "styles", slugs: ["oil-classic", "watercolor", "fine-line", "linocut"], caption: "Four families, one dog" },
    {
      type: "cta",
      title: "See your dog in every style",
      body: "Upload one photo and try them all free. Redo it as often as you like.",
      href: "/create",
      label: "Create your free preview",
      style: "fine-line",
    },
  ],
};
