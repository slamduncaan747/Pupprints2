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
export const PORTRAIT_SYSTEM_PROMPT = `You are a master portrait artist making a portrait of ONE specific, real dog: the dog in the customer's photos, painted to match the example portrait of the chosen style. Its owner must recognise their own dog at a glance, so likeness matters more than anything else. Study the dog's face closely before you start: its proportions, the exact shape and position of each marking, and its eye colour.

KEEP IDENTICAL TO THE PHOTO (the dog's identity):
- Breed or mix, build, size and age (a puppy stays a puppy; a grey muzzle stays grey).
- Head: skull shape and width, muzzle length and shape, stop, jowls, lips.
- Ears: shape, size, set and carriage, including any asymmetry (for example one ear up and one folded).
- Eyes: exact colour (including two different-coloured eyes), shape, size and spacing. Nose colour.
- Coat: every colour, length, texture, curl or wiriness.
- Every marking, in the same place and on the same side of the face and body: blaze, mask, eyebrow spots, ticking, freckles, brindle, merle or piebald patches, white chest, socks or tail tip.
Do not turn the dog into a generic example of its breed. Do not add, remove, mirror or move markings. Do not change its weight or proportions.

TAKE FROM THE EXAMPLE PORTRAIT, NOT FROM THE PHOTOS: the pose, head angle, crop, composition, artistic medium, background and lighting. No costumes, clothing, props or scenes: the dog itself is the whole subject. Leave out people, hands, other animals, collars, leashes, harnesses and room clutter from the photo.

COMPOSITION: a vertical 3:4 portrait matching the example portrait: the same pose and head angle, the same crop of head and upper chest, the dog the same size and in the same place on the canvas. The pose, angle and framing of the customer's photos do not matter. Leave clear space of about one tenth of the canvas above the ears and at each side so the picture can be cropped to 4:5 or 2:3 without cutting off the ears. The artwork fills the whole canvas edge to edge.

FINISH: a finished, gallery-quality original artwork in the medium the style brief names, showing that medium's real texture (brushwork, paper grain, ink line or pencil; for a modern illustration, its clean matte finish). It must not look like a photo with a filter or a 3D render. Crisp, lifelike eyes with a small catch-light, both eyes the same colour as in the photo (never one blue eye unless the photo shows it).

NEVER INCLUDE: text, letters, numbers, names, signatures, monograms, captions, watermarks or logos; borders, frames, mats, or the artwork shown hanging on a wall.`;

/** Added to the brief when we will letter the dog's name at the top afterwards (see @/lib/image/lettering). */
export const NAME_HEADROOM = "Leave the top fifth of the image as calm, empty background above the ears.";

/** The images the model receives, in order: the customer's photos, then the style's example portrait. */
export type ImageRoles = { extraPhotos: number; styleSwatch: boolean };

export function imageGuide({ extraPhotos, styleSwatch }: ImageRoles): string {
  const photos = 1 + extraPhotos;
  const total = photos + (styleSwatch ? 1 : 0);
  const photoRange = photos === 1 ? "IMAGE 1 is a photo" : `IMAGES 1 to ${photos} are photos`;
  const lines = [
    total === 1 ? "You are given ONE image: the customer's photo of their dog." : `You are given ${total} images, in this order.`,
    `${photoRange} of the customer's dog. Use ${photos === 1 ? "it" : "them"} ONLY to know what this dog looks like: breed or mix, head and muzzle shape, coat colours, every marking and which side it is on, eye colour, ears and age. Ignore ${photos === 1 ? "its" : "their"} pose, head angle, expression of the moment, background, lighting and camera colour.${photos > 1 ? " Where the photos disagree, trust the one with the most even, natural light." : ""}`,
  ];
  if (styleSwatch) {
    lines.push(
      `IMAGE ${total} is the EXAMPLE PORTRAIT: a finished portrait of a different dog in the style the customer chose. It is the template. Make a new portrait that looks like a sister piece to it, by the same artist: the same pose and head angle, the same crop and framing, the same medium and mark-making, the same level of detail, the same palette, background colour, lighting and finish. Change only the dog, which must be the customer's dog. Copy nothing about the example's dog itself: not its breed, head shape, coat colours, markings, eyes or ears.
DO NOT REPLICATE ANY FEATURE OF THE EXAMPLE'S DOG. Take only the style from the example portrait. Every physical feature of the dog you paint (its face, muzzle, nose, eye colour, ears, coat colours, coat length and texture, and every marking, white patch, blaze or spot) must come from the customer's photos alone. If the example's dog has a feature the customer's dog does not, leave it out; if the customer's dog has a feature the example's dog does not, include it.`,
    );
  }
  return lines.join("\n");
}

/** The identity notes, written by a vision model from the customer's photos (see ./describe). */
export function identityNotes(notes: string): string {
  return `THIS DOG, AS DESCRIBED FROM ITS PHOTOS (follow these exactly; they override any breed habit):\n${notes.trim()}`;
}

/**
 * The style brief for a portrait. The catalog prompt (single source of truth) describes the artwork.
 *
 * The pet's name is deliberately NOT included: image models tend to paint names as text
 * (nameplates, banners), which the rules above forbid. `withName` only asks for room above the
 * head, so the name can be set there in our own type afterwards.
 */
export function buildStylePrompt(
  style: StyleSlug,
  opts: { withName?: boolean; withReference?: boolean; extraPhotos?: number; identity?: string | null } = {},
): string {
  const s = getStyle(style);
  if (!s) throw new Error(`Unknown style: ${style}`);
  const extraPhotos = opts.extraPhotos ?? 0;
  return [
    imageGuide({ extraPhotos, styleSwatch: Boolean(opts.withReference) }),
    opts.identity ? identityNotes(opts.identity) : null,
    opts.withReference
      ? "Generate this style of portrait, the example portrait, with this dog, the customer's dog. Replicate only the style of the example portrait, never any feature of its dog."
      : "Generate a portrait of the customer's dog in the style described in the style brief.",
    `STYLE BRIEF (${s.name}):\n${opts.withName ? `${s.prompt} ${NAME_HEADROOM}` : s.prompt}`,
    opts.withReference
      ? "Final check before you finish: the pose, crop, background and medium match the example portrait; the dog is unmistakably the customer's dog, with its own head shape, markings on the same sides, eye colour and ears, and nothing taken from the example's dog; one complete artwork filling a vertical 3:4 canvas; no text or frame anywhere."
      : "Final check before you finish: the same dog as in the photos, with identical markings on the same sides, the same eye colour in both eyes and the same ear shape; one complete artwork filling a vertical 3:4 canvas; no text or frame anywhere.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Identity rules + style brief in one string (what the OpenAI and Gemini adapters send). */
export function buildPortraitPrompt(style: StyleSlug, opts: { withName?: boolean } = {}): string {
  return `${PORTRAIT_SYSTEM_PROMPT}\n\n${buildStylePrompt(style, opts)}`;
}
