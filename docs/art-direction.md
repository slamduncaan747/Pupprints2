# Art direction: the house style

How every Pup Prints image is made: the sample portraits in `web/public/samples/`, the campaign scenes in
`web/public/campaign/`, and (once aligned) the production prompts in `web/src/lib/catalog.ts`.
Written Oct 18 by the image lead, after the redesign to the luxury fashion-house system.

The goal: the site should read like a museum or a fashion house photographing its collection, not like a pet
novelty shop. The portraits are the product photography. Treat them like a campaign.

## House rules (apply to every portrait)

1. **Museum, not novelty.** Each portrait should look like a real artwork photographed straight-on: true medium
   texture. Oils show linen canvas weave, soft impasto and a satin varnish. Watercolour shows cold-press tooth,
   pigment granulation and blooms. Charcoal shows paper grain and smudges. Fine line shows ink bleed on cotton
   paper. Screenprint shows matte layered inks and a slight off-register.
2. **The dog is a dog.** Natural canine anatomy, posture and proportions. No human torsos, arms, hands or long
   necks. Costumes are draped over the dog's own back, shoulders and chest (cape, mantle, a naval coat cut for a
   dog). Bust or seated three-quarter pose. The phrase that fixed this in testing:
   *"the deep narrow chest and steeply sloping shoulders of a real dog and its own thick furry neck; no human
   shoulders, no human torso, no arms."*
3. **One soft light.** A single soft window or north light from the upper left. Quiet, empty, softly graded
   backgrounds.
4. **One palette across the suite:** oxblood, umber, bone/ivory, slate, sage, ochre, deep navy. No neon, no
   saturated primaries. Even Pop Art is a refined 2–3 ink screenprint (pale blush pink, ochre, black).
5. **Composition 4:5.** Eyes near the upper third. The whole head and both ears sit inside the picture with a calm
   margin; never crop an ear. Centred or classic three-quarter.
6. **Calm expressions.** Mouth closed or nearly closed for the graphic styles (Mid-Century, Fine Line). No grins,
   no cartoon eyes.
7. **No text of any kind.** No letters, numbers, signatures, monograms, watermarks, engraved medallions, painted
   frames or borders. Every prompt ends with the CLEAN clause below.
8. **Likeness is real.** Every portrait is a reference edit of a real photo of that dog (FLUX.2 klein image
   reference). The prompt asks for *this exact dog* and lists what to keep (KEEP clause).

### Reusable clauses (exact text used)

- **KEEP:** "Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length,
  fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and
  proportions, two eyes."
- **COMP:** "Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of
  background above the ears and at both sides, the eyes near the upper third."
- **CLEAN:** "The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no
  monogram, no watermark, no frame, no border."
- **OIL (surface):** "Painted with loose, confident, buttery brushstrokes and soft impasto; fur, velvet and fabric
  are suggested by visible brushwork rather than photographic detail; thin glazes in the shadows; the linen canvas
  weave shows through the thin passages; a soft satin varnish, not glossy."
  (The first-pass variant used for royal/oil-classic/holiday: "Rich oil paint on linen canvas: visible confident
  brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the
  thin passages, a satin varnish.")
- **DOGBUST:** "Painted from the top of its head down to its chest, in a calm three-quarter view, with the deep
  narrow chest and steeply sloping shoulders of a real dog and its own thick furry neck; no human shoulders, no
  human torso, no arms."

`{breed}` is filled with a plain description of the dog (for example "Blenheim Cavalier King Charles Spaniel",
"tricolour Beagle"). In production this can come from the customer's answer or be left as "dog".

## Per-style prompts (as rendered for the samples)

### The Royal

Used for: royal.webp (Cavalier), pair-1-after.webp (Golden Retriever).

```text
Turn this photo into a 17th-century Flemish court portrait in oil of this exact {breed}. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. A dignified seated bust of a real dog in a calm three-quarter view, with its own natural canine neck, chest and small rounded shoulders, no human body. A deep oxblood velvet cape with a thick white ermine trim is draped over the dog's own shoulders and chest, and a fine plain gold chain rests across the ermine, no pendant. Plain warm umber background, softly graduated and empty. A single soft window light from the upper left, deep quiet shadows. Rich oil paint on linen canvas: visible confident brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the thin passages, a satin varnish. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A museum masterpiece in the manner of Anthony van Dyck. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### The Admiral

Used for: admiral.webp (Labrador), pair-3-after.webp (Beagle), gallery-4.webp (Husky).

```text
Turn this photo into an 18th-century British naval portrait in oil of this exact {breed}. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Painted from the top of its head down to its chest, in a calm three-quarter view, with the deep narrow chest and steeply sloping shoulders of a real dog and its own thick furry neck; no human shoulders, no human torso, no arms. A deep navy wool naval coat cut for a dog is fitted over its back and shoulders: gold bullion epaulettes rest on the dog's own sloping shoulders, a high navy collar around its furry neck, a soft white linen stock at the throat; the coat is open at the front, showing the dog's chest fur. No medals, no badges. Behind, a quiet overcast sky in slate and pale ochre over a calm dark sea, one small faint sailing ship far away. Soft daylight from the left, muted warm tones. Painted with loose, confident, buttery brushstrokes and soft impasto; fur, velvet and fabric are suggested by visible brushwork rather than photographic detail; thin glazes in the shadows; the linen canvas weave shows through the thin passages; a soft satin varnish, not glossy. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A museum masterpiece in the manner of Thomas Gainsborough. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Old Master

Used for: oil-classic.webp (Border Collie), gallery-1.webp (Golden Retriever).

```text
Turn this photo into a quiet classical oil portrait of this exact {breed}, no costume, no collar, no accessories. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. A bust portrait in a calm three-quarter view. The fur is described by the brush, every hair direction followed. A single soft north light from the upper left. Plain background of warm umber and muted olive, softly graduated and empty. Restrained palette of umber, bone, slate and ochre. Rich oil paint on linen canvas: visible confident brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the thin passages, a satin varnish. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A museum-quality 17th-century Dutch old master painting. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Watercolor

Used for: watercolor.webp (Beagle), pair-2-after.webp (French Bulldog), gallery-3.webp (Cavapoo).

```text
Turn this photo into a fine-art watercolour portrait of this exact {breed}, painted on heavy white cold-press cotton watercolour paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Head and chest only. Transparent layered washes with visible pigment granulation and soft blooms, crisp precise detail in the eyes and nose, the painting dissolves into loose dry-brush strokes and bare paper toward the edges, generous untouched white paper around the dog. The cold-press paper tooth is visible everywhere. Restrained natural palette of umber, sepia, warm ochre and slate grey with a touch of sage in the shadows. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Calm, luminous, gallery-quality, like a contemporary watercolour hung in a museum. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Fine Line

Used for: fine-line.webp (French Bulldog).

```text
Turn this photo into a refined fine-line ink drawing of this exact {breed} on warm white cotton rag paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Confident continuous black ink lines with a slight natural ink bleed into the paper fibres, sparse delicate hatching only where shadows fall, no colour, no solid fills, no grey wash. A generous field of empty paper around the dog. The soft cotton paper texture is visible. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A refined contemporary gallery drawing. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Pop Art

Used for: pop-art.webp (Dachshund), gallery-2.webp (French Bulldog).

```text
Turn this photo into a refined limited-edition screenprint portrait of this exact {breed}, printed in only three flat matte inks on warm off-white paper: pale blush pink, ochre and black. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Bold simplified shapes; the black ink layer carries the features with a fine halftone in the shadows; a slight off-register between the ink layers; visible paper grain and the soft matte texture of hand-pulled screenprint ink. One single flat pale blush pink background. No neon, no gradients, no extra shapes. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Calm, graphic and sophisticated, like a 1960s gallery screenprint. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Storybook

Used for: storybook.webp (Poodle puppy), gallery-5.webp (Cavalier).

```text
Turn this photo into an elegant gouache picture-book plate of this exact {breed}. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. The dog sits quietly in soft tall grass with a few small wildflowers under a pale bone-coloured sky, lots of calm open space. Matte opaque gouache with visible brush marks and dry-brush texture on toothy watercolour paper, soft muted palette of sage, ochre, bone and dusty rose. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Understated, poetic and refined, like a classic mid-century European picture book illustration, not cute, not cartoonish. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Botanical

Used for: botanical.webp (Cavapoo).

```text
Turn this photo into a refined natural-history plate of this exact {breed} in fine ink line and transparent watercolour on warm ivory laid paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. The dog sits in the centre, loosely framed by a sparse arrangement of botanical stems drawn with naturalist precision: olive branches, eucalyptus, ferns and a few muted garden roses, with plenty of empty paper. Muted palette of sage, ochre, dusty rose and umber; the laid paper texture is visible. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Like an 18th-century botanical plate coloured by hand. No labels, no captions. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Space Cadet

Used for: astronaut.webp (Husky).

```text
Turn this photo into a painterly mid-century retro-futurist oil portrait of this exact {breed} as an astronaut. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. A calm, dignified bust: the dog wears a simple off-white 1960s space suit with a soft ochre collar ring, and a clear glass dome helmet that encloses the whole head, both ears fully inside the glass with space above them. No patches, no flags, no lettering. Behind, a quiet deep navy night sky with a few faint stars and one small pale planet. Muted palette of navy, slate, bone and ochre, a soft warm key light from the left. Visible oil brushwork and canvas texture, like a 1950s magazine illustration painted in oils. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Charcoal Study

Used for: charcoal.webp (Labrador), gallery-6.webp (Beagle).

```text
Turn this photo into an expressive charcoal portrait drawing of this exact {breed} on warm toned ivory drawing paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Rich velvety charcoal blacks, soft smudged half-tones, fine sharp detail in the eyes and nose, loose gestural strokes that fade into bare paper at the edges. The paper grain catches the charcoal everywhere, a few soft finger smudges and lifted highlights. No colour. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A fine-art academic drawing from a master's studio. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Mid-Century

Used for: mid-century.webp (Corgi; mouth then closed with a masked inpaint, prompt below).

```text
Turn this photo into a refined 1950s mid-century modern gouache and silkscreen print of this exact {breed}. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. The dog sits calmly with its mouth closed and a serene, dignified expression. Simplified elegant geometric shapes: the dog is set against a large flat ochre circle and a soft sage rectangle on a warm bone background. Muted palette of ochre, sage, oxblood, bone and soft black; matte gouache with visible dry-brush texture, slight print misregistration and paper grain. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Sophisticated, restrained and graphic, like a 1950s gallery print, not a cartoon. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Holiday Cozy

Used for: holiday.webp (Cavalier).

```text
Turn this photo into a quiet candlelit oil painting of this exact {breed} resting on a cream knit wool blanket. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. A soft oatmeal knit scarf lies loosely around its neck. Beside the dog, a single small sprig of evergreen and one candle whose warm glow is the only light, falling softly from the left. Deep quiet umber and dark green shadows, a calm intimate winter evening. Restrained palette of umber, deep green, oxblood and warm ivory. Rich oil paint on linen canvas: visible confident brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the thin passages, a satin varnish. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Like an intimate 19th-century interior painting. No string lights, no ornaments, no bokeh. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Mid-Century mouth fix (inpaint prompt, masked to the muzzle only)

```text
A refined 1950s mid-century modern gouache and silkscreen print of a Pembroke Welsh Corgi with its mouth closed, lips together, a calm serene expression, no tongue, no teeth. Flat matte gouache shapes, muted ochre, bone, soft black, slight paper grain.
```

### What changed from the current production prompts (to align `catalog.ts`)

- Royal: drop the crown and the jewelled medallion (both produced engraved pseudo-text and costume kitsch). Use the
  cape over the dog's own shoulders, the ermine trim and a plain fine chain. Add the DOGBUST anatomy clause.
- Admiral: drop medals and braided cords. Use the DOGBUST clause, a coat "cut for a dog", and a calm overcast sea,
  not a storm.
- Pop Art: replace hot pink/electric yellow/cyan/orange with a 2–3 ink screenprint (pale blush pink, ochre, black)
  on paper.
- Mid-Century: muted ochre/sage/oxblood/bone/soft black, "calm, mouth closed", and "not a cartoon, not vector art".
- Holiday: no fireplace, no string lights, no bokeh. One candle, one evergreen sprig, a knit scarf.
- Space Cadet: no mission patches (they grow lettering). Off-white suit, ochre collar ring, a dome helmet that
  encloses the ears, a quiet navy sky, painted in oils.
- Storybook: "understated, poetic, mid-century European picture book, not cute, not cartoonish", muted palette.
- All styles: add the KEEP, COMP and CLEAN clauses verbatim, plus the medium-surface sentence for that medium.


## Hard rejects (check every image at 100%)

- Any text, letters, numbers, signatures, monograms, pseudo-engraving on medallions or buttons, watermarks.
- A frame, border, mat or canvas edge painted into the image (the export trims 1–1.5% to remove faint edges).
- Human anatomy: square human shoulders, a human torso, arms or hands, an elongated neck.
- Extra or missing limbs/paws, merged or doubled ears, malformed eyes (scleral white "googly" eyes), malformed
  teeth or tongues, a second dog.
- Merged fur artefacts, "melted" fur blobs, stray dark specks on bare paper or bright specks in dark oil
  passages (the export removes tiny isolated specks automatically; anything larger is a reject).
- Cropped ears or head, the dog crammed against an edge.
- Cartoon or novelty finish: neon colour, glossy plastic sheen, airbrushed vector look, string lights, bokeh,
  busy props.
- Off-palette colour that breaks the 12-up collection.
- Likeness drift: wrong markings, eye colour or ear shape compared with the source photo.

## Finishing (export)

`export2.py` (scratchpad pipeline) per portrait: optional 1.2–1.5% edge trim, centre crop to exactly 4:5, Lanczos
resize to 1200×1500, light unsharp mask, then a very light physical-surface pass. For oils that is a linen weave
modulation, stronger in thin dark passages. For paper media it is a fine multi-scale paper tooth, stronger on bare
paper. Then tiny isolated speck removal and WebP at quality 83–86 (< 400 KB). For The Royal, near-white trim is
warmed toward ivory so the ermine does not read cold or iridescent.

## Campaign scenes (how the product is shown)

- Scenes are FLUX.2 klein text-to-image interiors in the same palette: limewashed plaster, oak, linen,
  travertine, soft morning or north light, no people, no logos, no text.
- The product is never generated. The scene contains a blank flat mid-grey placeholder (or a bare wall). The
  exact portrait file is composited in programmatically:
  homography into the opening, lit by the placeholder's own low-pass luminance (so the scene's light falloff
  falls across the art) and normalised to the wall's brightness, the wall's light field carried across frame and
  glass, a faint acrylic veil and sheen for framed pieces, occluder unmixing where a branch crosses the frame,
  a moulding lip shadow, and matching film grain.
- The canvas is rendered in 3D. It is a true 16×20 gallery wrap with the wrapped image bands on the visible
  1.25 in edges, a camera principal point outside the crop so one side and the bottom show, a cast and contact
  shadow, and the wall's light field.
- Product accuracy: canvas = gallery wrap (image continues around the edge). Framed = solid wood (black, white,
  natural oak), acrylic glazing, no mat. Print = flat matte fine-art paper. Digital = on a phone screen.
  Generated frames whose opening did not match a product aspect were corrected (the dog-and-portrait frame was
  narrowed to 4:5 by removing a strip from its middle). Tall 2:3 openings show the 24×36 size; there the art is
  extended with its own plain ground instead of cropping the dog.
