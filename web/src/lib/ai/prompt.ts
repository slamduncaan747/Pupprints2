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
export const PORTRAIT_SYSTEM_PROMPT = `You are a master portrait artist making a portrait of ONE specific, real dog: the dog in the customer's photos. Its owner must recognise their own dog at a glance, so likeness matters more than anything else. Study the dog's face closely before you start: its proportions, the exact shape and position of each marking, and its eye colour.

KEEP IDENTICAL TO THE PHOTO (the dog's identity):
- Breed or mix, build, size and age (a puppy stays a puppy; a grey muzzle stays grey).
- Head: skull shape and width, muzzle length and shape, stop, jowls, lips.
- Ears: shape, size, set and carriage, including any asymmetry (for example one ear up and one folded).
- Eyes: exact colour (including two different-coloured eyes), shape, size and spacing. Nose colour.
- Coat: every colour, length, texture, curl or wiriness.
- Every marking, in the same place and on the same side of the face and body: blaze, mask, eyebrow spots, ticking, freckles, brindle, merle or piebald patches, white chest, socks or tail tip.
Do not turn the dog into a generic example of its breed. Do not add, remove, mirror or move markings. Do not change its weight or proportions.

CHANGE ONLY what the style brief below asks for: the artistic medium, the background and the lighting. No costumes, clothing, props or scenes: the dog itself is the whole subject. Leave out people, hands, other animals, collars, leashes, harnesses and room clutter from the photo.

COMPOSITION: a vertical 3:4 portrait. The dog's head and upper chest are the subject, centred left to right, eyes about one third from the top, head turned as in the main photo. Leave clear space of about one tenth of the canvas above the ears and at each side so the picture can be cropped to 4:5 or 2:3 without cutting off the ears. The artwork fills the whole canvas edge to edge.

FINISH: a finished, gallery-quality original artwork in the medium the style brief names, showing that medium's real texture (brushwork, paper grain, ink line or pencil; for a modern illustration, its clean matte finish). It must not look like a photo with a filter or a 3D render. Crisp, lifelike eyes with a small catch-light, both eyes the same colour as in the photo (never one blue eye unless the photo shows it).

NEVER INCLUDE: text, letters, numbers, names, signatures, monograms, captions, watermarks or logos; borders, frames, mats, or the artwork shown hanging on a wall.`;

/** Added to the brief when we will letter the dog's name at the top afterwards (see @/lib/image/lettering). */
export const NAME_HEADROOM = "Leave the top fifth of the image as calm, empty background above the ears.";

/** One image the model receives, in order. */
export type ImageRoles = { extraPhotos: number; styleSwatch: boolean };

/**
 * Says what each attached image is for, in the order the providers send them: the main photo,
 * then any extra photos of the same dog, then the style swatch.
 */
export function imageGuide({ extraPhotos, styleSwatch }: ImageRoles): string {
  const total = 1 + extraPhotos + (styleSwatch ? 1 : 0);
  if (total === 1) return "You are given ONE image: the customer's photo of their dog.";
  const lines = [`You are given ${total} images, in this order.`];
  lines.push(
    "IMAGE 1 is the MAIN PHOTO of the customer's dog. It sets the pose, the head angle and the expression of the portrait.",
  );
  if (extraPhotos > 0) {
    const range = extraPhotos === 1 ? "IMAGE 2 is" : `IMAGES 2 to ${1 + extraPhotos} are`;
    lines.push(
      `${range} MORE PHOTOS OF THE SAME DOG, from other angles and in other light. Use them only to get the identity exactly right: the true coat colours, every marking (including any not visible in the main photo, on its correct side), the eye colour and the ear shape. Where the photos seem to disagree, trust the one with the most even, natural light. Do not copy their poses or backgrounds.`,
    );
  }
  if (styleSwatch) {
    lines.push(
      `IMAGE ${total} is a STYLE SWATCH: two close-up cuttings from a finished artwork in the required style. It shows only the art materials: how the marks are made, how detailed or simplified the fur is, the palette temperature and saturation, and the exact background colour and treatment. Make the portrait in exactly that medium, with that background and that finish, as if by the same artist. Neutral, natural colour: no yellow or sepia cast unless the swatch has one. The swatch is not a dog to draw: take no shapes, markings, fur colours or composition from it.`,
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
      ? "Turn the dog in IMAGE 1 into a finished head-and-chest artwork in the medium shown by the style swatch, as described in the style brief."
      : "Turn the dog in the photo into the finished artwork described in the style brief.",
    `STYLE BRIEF (${s.name}):\n${opts.withName ? `${s.prompt} ${NAME_HEADROOM}` : s.prompt}`,
    "Final check before you finish: the same dog as in the photos, with identical markings on the same sides, the same eye colour in both eyes and the same ear shape; one complete artwork filling a vertical 3:4 canvas; no text or frame anywhere.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Identity rules + style brief in one string (what the OpenAI and Gemini adapters send). */
export function buildPortraitPrompt(style: StyleSlug, opts: { withName?: boolean } = {}): string {
  return `${PORTRAIT_SYSTEM_PROMPT}\n\n${buildStylePrompt(style, opts)}`;
}
