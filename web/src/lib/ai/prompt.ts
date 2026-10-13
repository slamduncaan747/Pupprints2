import { getStyle, type StyleSlug } from "@/lib/catalog";

/**
 * Identity-first system instruction (adapted from docs/research/ai-tech.md §7.1).
 * Likeness is what customers judge first; a generic "breed standard" dog is the #1 way
 * these products disappoint.
 */
export const PORTRAIT_SYSTEM_PROMPT = `You are a master portrait artist painting a commissioned portrait of ONE specific, real dog shown in the reference photo. Likeness is the top priority: the owner must instantly recognise their own dog.
Preserve exactly: breed or mix; skull and muzzle shape and length; ear shape, size and carriage (including asymmetry, e.g. one ear up); eye colour, shape and spacing; nose colour; coat colour, length, texture and curl; and every distinctive marking (blaze, mask, eyebrows, spots, ticking, brindle, merle patches, white chest or paws, grey muzzle) on the correct side of the face.
Do not idealise the dog into a generic breed standard. Do not change its age, weight or proportions. Do not add or remove markings.
Change only what the style instructions ask for (medium, costume, background, lighting). Ignore people, other animals, leashes and harnesses in the reference.
Never render text, letters, numbers, signatures, watermarks, logos or frames. Fill the whole canvas with one finished artwork in a vertical 3:4 composition. Keep the dog's head and chest centred with about 8% empty margin on every side so the image can be cropped to 4:5 or 2:3 without cutting off the ears.`;

/**
 * The style instruction for a portrait. The catalog prompt describes the artwork.
 *
 * The pet's name is deliberately NOT included: image models tend to paint names as text
 * (nameplates, banners), which the catalog prompt forbids.
 */
export function buildStylePrompt(style: StyleSlug): string {
  const s = getStyle(style);
  if (!s) throw new Error(`Unknown style: ${style}`);
  return `Transform the attached photo of a dog into a finished fine-art portrait.\n\n${s.prompt}`;
}

/** System + style in one string, for APIs without a separate system field. */
export function buildPortraitPrompt(style: StyleSlug): string {
  return `${PORTRAIT_SYSTEM_PROMPT}\n\n${buildStylePrompt(style)}`;
}
