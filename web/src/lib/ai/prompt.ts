import { getStyle, type StyleSlug } from "@/lib/catalog";

/**
 * Identity-first instruction, sent ahead of every style brief (adapted from docs/research/ai-tech.md §7.1).
 * Likeness is what customers judge first; a generic "breed standard" dog is the #1 way these products
 * disappoint.
 *
 * Written for GPT Image 2.5 and Nano Banana 2.1, following OpenAI's image-prompting guide (labelled
 * sections; "change only X", then list exactly what must stay the same; "no extra text, no
 * watermarks") and Google's (say what you want positively and specifically). The output size/aspect
 * (3:4) is also set by request parameters; the composition section keeps the framing crop-safe.
 */
export const PORTRAIT_SYSTEM_PROMPT = `You are a master portrait artist painting a commissioned portrait of ONE specific, real dog: the dog in the attached reference photo. Its owner must recognise their own dog at a glance, so likeness matters more than anything else.

KEEP IDENTICAL TO THE PHOTO (the dog's identity):
- Breed or mix, build, size and age (a puppy stays a puppy; a grey muzzle stays grey).
- Head: skull shape and width, muzzle length and shape, stop, jowls, lips.
- Ears: shape, size, set and carriage, including any asymmetry (for example one ear up and one folded).
- Eyes: exact colour (including two different-coloured eyes), shape, size and spacing. Nose colour.
- Coat: every colour, length, texture, curl or wiriness.
- Every marking, in the same place and on the same side of the face and body: blaze, mask, eyebrow spots, ticking, freckles, brindle, merle or piebald patches, white chest, socks or tail tip.
Do not turn the dog into a generic example of its breed. Do not add, remove, mirror or move markings. Do not change its weight or proportions.

CHANGE ONLY what the style brief below asks for: the artistic medium, any costume, the background and the lighting. Leave out people, hands, other animals, leashes, harnesses and room clutter from the photo.

COMPOSITION: a vertical 3:4 portrait. The dog's head and upper chest are the subject, centred left to right, eyes about one third from the top, head turned as in the photo. Leave clear space of about one tenth of the canvas above the ears and at each side so the picture can be cropped to 4:5 or 2:3 without cutting off the ears. The artwork fills the whole canvas edge to edge.

FINISH: a finished, gallery-quality original artwork in the medium the style brief names, showing that medium's real texture (brushwork, paper grain, ink line or pencil). It must not look like a photo with a filter or a 3D render. Crisp, lifelike eyes with a small catch-light.

NEVER INCLUDE: text, letters, numbers, names, signatures, monograms, captions, watermarks or logos; borders, frames, mats, or the artwork shown hanging on a wall. Medals, badges and patches are plain shapes with no lettering.`;

/**
 * The style brief for a portrait. The catalog prompt (single source of truth) describes the artwork.
 *
 * The pet's name is deliberately NOT included: image models tend to paint names as text
 * (nameplates, banners), which the rules above forbid.
 */
export function buildStylePrompt(style: StyleSlug): string {
  const s = getStyle(style);
  if (!s) throw new Error(`Unknown style: ${style}`);
  return [
    "Turn the attached photo of this dog into the finished artwork described in the style brief.",
    `STYLE BRIEF (${s.name}):\n${s.prompt}`,
    "Final check before you finish: the same dog as in the photo, with identical markings, eye colour and ear shape; one complete artwork filling a vertical 3:4 canvas; no text or frame anywhere.",
  ].join("\n\n");
}

/** Identity rules + style brief in one string (what the OpenAI and Gemini adapters send). */
export function buildPortraitPrompt(style: StyleSlug): string {
  return `${PORTRAIT_SYSTEM_PROMPT}\n\n${buildStylePrompt(style)}`;
}
