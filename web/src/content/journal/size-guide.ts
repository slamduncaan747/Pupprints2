import type { ArticleInput } from "@/content/types";
import { ALL_SIZES, styleLink } from "@/content/helpers";
import { PRODUCTS } from "@/lib/catalog";

/** Where each catalog size tends to work. Unknown future sizes fall back to a neutral line. */
const SIZE_USE: Record<string, string> = {
  "8×10\"": "Desks, bookshelves, bedside tables and gallery walls",
  "12×16\"": "Small walls, hallways, above a desk, or hung in pairs",
  "16×20\"": "Above a console or nightstand; a strong single piece on a medium wall",
  "18×24\"": "Above a dresser or a small sofa, or as a pair above a bed",
  "24×36\"": "A statement piece above a sofa, bed or fireplace, or on a large open wall",
};

function formatsFor(label: string) {
  return PRODUCTS.filter((p) => p.type !== "digital" && p.variants.some((v) => v.label === label))
    .map((p) => p.shortName.toLowerCase())
    .join(", ");
}

const SIZE_ROWS = ALL_SIZES.map((v) => [
  v.label,
  `${Math.round(v.widthIn * 2.54)} × ${Math.round(v.heightIn * 2.54)} cm`,
  formatsFor(v.label),
  SIZE_USE[v.label] ?? "A versatile size for many walls",
]);

export const sizeGuide: ArticleInput = {
  slug: "what-size-art-for-your-wall",
  title: "How to Choose the Right Size Art for Your Wall",
  description:
    "The simple rules designers use to size art above a sofa, bed, console or desk, with real measurements, plus how portrait sizes from 8×10\" to 24×36\" work in actual rooms.",
  date: "2026-10-03",
  category: "home-and-framing",
  heroStyle: "mid-century",
  keywords: ["what size art for wall", "art size above sofa", "how big should art be above a bed", "canvas size guide", "wall art size guide"],
  related: ["how-to-hang-a-canvas-or-framed-print", "canvas-vs-framed-print-vs-poster", "watercolor-vs-oil-vs-line-art"],
  body: [
    {
      type: "paragraph",
      text: "The most common art mistake isn't the wrong style or the wrong frame. It's the wrong size. Art that's too small floats awkwardly on a big wall and looks like an afterthought. Art that's too big crowds a small room. Fortunately, a few simple rules get you to the right answer almost every time.",
    },
    { type: "heading", text: "The two-thirds rule" },
    {
      type: "paragraph",
      text: "When art hangs above furniture, aim for it to be about **two-thirds to three-quarters the width of the furniture below it**. Above an 84-inch sofa, that's a piece (or a group of pieces) roughly 56 to 63 inches wide. Above a 60-inch dresser, it's about 40 to 45 inches.",
    },
    {
      type: "paragraph",
      text: "That's wider than most people expect, which is why one small print above a sofa so often looks lost. If a single piece can't reach that width, a pair or a group can. The rule applies to the whole arrangement, gaps included.",
    },
    { type: "heading", text: "The eye-level rule" },
    {
      type: "paragraph",
      text: "Galleries usually hang art so its center sits about **57 to 60 inches from the floor**, roughly average eye level. At home, that's a good starting point for art on an open wall. Above furniture, the furniture sets the height instead: leave about **6 to 10 inches** between the top of the sofa or headboard and the bottom of the art, so the two feel connected rather than floating separately.",
    },
    { type: "heading", text: "A note on portraits" },
    {
      type: "paragraph",
      text: "Dog portraits are vertical: taller than they are wide. Above a long sofa, a single portrait becomes a focal point rather than filling the width, and that can look great on a tall wall or flanked by lamps or plants. If you want to fill the width, hang two or three portraits side by side. It's also a lovely way to display more than one dog, in matching styles and sizes.",
    },
    { type: "heading", text: "Our sizes, and where they work" },
    {
      type: "table",
      caption: "Sizes are for the artwork. A frame adds a little to the overall size.",
      head: ["Size", "Approx. cm", "Available as", "Works well"],
      rows: SIZE_ROWS,
    },
    { type: "heading", text: "Room by room" },
    { type: "heading", level: 3, text: "Above a sofa" },
    {
      type: "paragraph",
      text: "Most sofas are somewhere between 72 and 90 inches wide. For a single portrait, go big: a 24×36\" canvas or framed print. To fill more of the width, try three 16×20\" portraits in a row with 3 inches between them. They span about 54 inches, close to two-thirds of an 84-inch sofa.",
    },
    { type: "heading", level: 3, text: "Above a bed" },
    {
      type: "paragraph",
      text: "A queen bed is about 60 inches wide, so two-thirds is roughly 40 inches. A 24×36\" portrait centered above the headboard makes a calm focal point; a pair of 18×24\" pieces with a 4-inch gap spans almost exactly 40 inches.",
    },
    { type: "heading", level: 3, text: "Above a console, dresser or fireplace" },
    {
      type: "paragraph",
      text: "Consoles and dressers are often 36 to 60 inches wide, which suits a single 16×20\" to 24×36\" piece. A mantel is also a great place to lean a framed portrait instead of hanging it, especially if you like to swap art seasonally.",
    },
    { type: "heading", level: 3, text: "Home office" },
    {
      type: "paragraph",
      text: `Art above a desk is usually seen from close up, so 16×20" or 18×24" works well. On the desk itself, an 8×10" frame is perfect. A ${styleLink("admiral")} portrait above a desk is, we'd argue, a productivity tool.`,
    },
    { type: "heading", level: 3, text: "Hallways and stairs" },
    {
      type: "paragraph",
      text: "Narrow spaces suit 12×16\" pieces, or a vertical stack of 8×10\"s. On a staircase, follow the angle of the stairs and keep each piece the same height above its step.",
    },
    { type: "heading", level: 3, text: "Gallery walls" },
    {
      type: "paragraph",
      text: "Mix sizes from 8×10\" up to 18×24\", keep the gaps consistent (2 to 3 inches is typical), and stick to one or two frame colors for a calm, collected look. Lay everything out on the floor first, or tape paper templates to the wall.",
    },
    { type: "heading", text: "The most common sizing mistakes" },
    {
      type: "list",
      items: [
        "**Hanging too high.** This is the big one. Art hung near the ceiling feels disconnected from the room. Bring it down toward eye level, or closer to the furniture beneath it.",
        "**Going too small above furniture.** A lone 8×10\" above a sofa looks like it wandered off from somewhere else. Size up, or group several pieces.",
        "**Forgetting the sight lines.** Think about where the art is seen from: the doorway, the sofa, the bed. A piece seen from across the room needs more presence.",
        "**Crowding.** Art needs breathing room. Avoid squeezing a large piece between windows or right up against a corner.",
      ],
    },
    { type: "heading", text: "Tricks for getting it right before you buy" },
    {
      type: "list",
      items: [
        "**Tape it out.** Mark the size on the wall with painter's tape or a sheet of paper and live with it for a day.",
        "**When in doubt, go bigger.** Art that's slightly too large almost always looks better than art that's slightly too small.",
        "**Think about viewing distance.** Pieces seen from across a room need to be bigger than pieces seen up close.",
        `**Let the style guide you.** Detailed styles like ${styleLink("fine-line")} reward a closer look; bold styles like ${styleLink("pop-art")} read beautifully from across the room.`,
      ],
    },
    {
      type: "paragraph",
      text: "Still deciding on a finish? Read [canvas vs. framed print vs. poster](/journal/canvas-vs-framed-print-vs-poster). Ready to put it up? Here's [how to hang it without wrecking your wall](/journal/how-to-hang-a-canvas-or-framed-print).",
    },
    {
      type: "cta",
      title: "Find the right portrait for your wall",
      body: "Create your portrait free, then choose the size and finish that fits your room.",
      href: "/create",
      label: "Create your free preview",
      style: "mid-century",
    },
  ],
};
