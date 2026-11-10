# Art direction: the house style

How every Pup Prints image is made: the sample portraits in `web/public/samples/`, the campaign scenes in
`web/public/campaign/`, and (once aligned) the production prompts in `web/src/lib/catalog.ts`.
Written Oct 18 by the image lead, after the redesign to the luxury fashion-house system. Revised Nov 10 for the
dog-centred collection: the six costume and novelty styles (Royal, Admiral, Space Cadet, Pop Art, Storybook,
Holiday Cozy) are retired and four craft media are added (Modern Oil, Linocut, Pastel, Ink Wash).

The goal: the site should read like a museum or a fashion house photographing its collection, not like a pet
novelty shop. The portraits are the product photography. Treat them like a campaign.

## House rules (apply to every portrait)

**The dog is the subject. No costumes, props, scenes or novelty.** Every piece is simply that dog, beautifully
made in a real craft medium: the kind of work a small-studio painter or printmaker would sell and an interior
designer would hang in a calm living room. No clothing, no collars or accessories, no settings or storylines.
The only permitted surround is a plain ground, bare paper, one flat colour field (Modern Oil, Linocut), the
quiet geometric shapes of Mid-Century, or the sparse naturalist stems of Botanical.

1. **Museum, not novelty.** Each portrait should look like a real artwork photographed straight-on: true medium
   texture. Oils show linen canvas weave, soft impasto and a satin varnish. Watercolour shows cold-press tooth,
   pigment granulation and blooms. Charcoal shows paper grain and smudges. Fine line shows ink bleed on cotton
   paper. Palette-knife oil shows ridges of impasto on a matte field. Linocut shows gouge marks and uneven
   hand-rolled ink. Pastel shows velvety pigment on toned, toothy paper. Ink wash shows wet bleeds and dry-brush
   streaks on soft cotton paper.
2. **The dog is a dog.** Natural canine anatomy, posture and proportions. No human torsos, arms, hands or long
   necks. Bust or seated three-quarter pose. The phrase that fixes this when a body shows:
   *"the deep narrow chest and steeply sloping shoulders of a real dog and its own thick furry neck; no human
   shoulders, no human torso, no arms."*
3. **One soft light.** A single soft window or north light from the upper left. Quiet, empty, softly graded
   backgrounds.
4. **One palette across the suite:** oxblood, umber, bone/ivory, slate, sage, ochre, deep navy. No neon, no
   saturated primaries. Colour fields and second inks are always muted (sage, ochre, slate or oxblood).
5. **Composition 4:5.** Eyes near the upper third. The whole head and both ears sit inside the picture with a calm
   margin; never crop an ear. Centred or classic three-quarter.
6. **Calm expressions.** Mouth closed or nearly closed for the graphic styles (Mid-Century, Fine Line, Linocut). No grins,
   no cartoon eyes.
7. **No text of any kind.** No letters, numbers, signatures, monograms, watermarks, seals or stamps (ink wash), painted
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
- **OIL (surface):** "Painted with loose, confident, buttery brushstrokes and soft impasto; fur is suggested by visible brushwork rather than photographic detail; thin glazes in the shadows; the linen canvas
  weave shows through the thin passages; a soft satin varnish, not glossy."
  (The first-pass variant used for oil-classic: "Rich oil paint on linen canvas: visible confident
  brushstrokes, soft impasto on the highlights, thin glazes in the shadows, the canvas weave showing through the
  thin passages, a satin varnish.")
- **DOGBUST (only when the chest and shoulders show):** "Painted from the top of its head down to its chest, in a calm three-quarter view, with the deep
  narrow chest and steeply sloping shoulders of a real dog and its own thick furry neck; no human shoulders, no
  human torso, no arms."

`{breed}` is filled with a plain description of the dog (for example "Blenheim Cavalier King Charles Spaniel",
"tricolour Beagle"). In production this can come from the customer's answer or be left as "dog".

## Per-style prompts (as rendered for the samples)

### Old Master

Used for: oil-classic.webp (Border Collie), pair-1-after.webp (Golden Retriever; also the hero portrait in every campaign scene).

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

### Botanical

Used for: botanical.webp (Cavapoo).

```text
Turn this photo into a refined natural-history plate of this exact {breed} in fine ink line and transparent watercolour on warm ivory laid paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. The dog sits in the centre, loosely framed by a sparse arrangement of botanical stems drawn with naturalist precision: olive branches, eucalyptus, ferns and a few muted garden roses, with plenty of empty paper. Muted palette of sage, ochre, dusty rose and umber; the laid paper texture is visible. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Like an 18th-century botanical plate coloured by hand. No labels, no captions. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Charcoal Study

Used for: charcoal.webp (Labrador), gallery-6.webp (Beagle, beagle-2.jpg), pair-3-after.webp (Beagle, beagle.jpg).

```text
Turn this photo into an expressive charcoal portrait drawing of this exact {breed} on warm toned ivory drawing paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Rich velvety charcoal blacks, soft smudged half-tones, fine sharp detail in the eyes and nose, loose gestural strokes that fade into bare paper at the edges. The paper grain catches the charcoal everywhere, a few soft finger smudges and lifted highlights. No colour. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. A fine-art academic drawing from a master's studio. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Mid-Century

Used for: mid-century.webp (Corgi; mouth then closed with a masked inpaint, prompt below).

```text
Turn this photo into a refined 1950s mid-century modern gouache and silkscreen print of this exact {breed}. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. The dog sits calmly with its mouth closed and a serene, dignified expression. Simplified elegant geometric shapes: the dog is set against a large flat ochre circle and a soft sage rectangle on a warm bone background. Muted palette of ochre, sage, oxblood, bone and soft black; matte gouache with visible dry-brush texture, slight print misregistration and paper grain. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Sophisticated, restrained and graphic, like a 1950s gallery print, not a cartoon. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Modern Oil

Used for: modern-oil.webp (Dachshund, field "muted ochre"), gallery-1.webp (Cavalier, field "muted slate blue").
`{field}` is the one flat background colour: "muted sage green" (production default), "muted ochre", "muted slate blue" or "muted oxblood".

```text
Turn this photo into a contemporary palette-knife oil portrait of this exact {breed}, no costume, no collar, no accessories. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Head and chest only, in a calm pose. Thick, confident impasto laid with a palette knife and a broad flat brush: the fur is built from simplified planes of broken colour, with ridges of paint that catch the light, and crisp detail only in the eyes and nose. The background is one flat, matte colour field of {field}, thinly brushed and empty. A single soft light from the upper left. Restrained palette of umber, bone, ochre, slate and sage. The linen canvas weave shows through the thin passages; matte, unvarnished surface. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Like a painting by a contemporary small-studio painter, hung in a calm living room. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Linocut

Used for: linocut.webp (Husky, second ink "muted sage green"), gallery-2.webp (French Bulldog, second ink "muted ochre").
The second ink is printed as one flat block behind the dog; the dog itself is black on bare paper, so coat colour is carried by shape, not hue.
`{field}` (it appears twice) is the second ink: "muted ochre" (production default), "muted sage green", "muted slate blue" or "muted oxblood".

```text
Turn this photo into a hand-carved linocut relief print of this exact {breed}, printed by hand from two carved linoleum blocks on cream cotton printmaking paper: first one flat block of {field}, then the key block in dense black relief ink. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Head and chest only. Every mark is either solid opaque black ink or bare paper: the dark fur is solid black with thin white lines carved out of it, the light fur is bare cream paper with short black gouge cuts, and the fur is described by tapering V-shaped cuts that follow the direction of the hair. Bold simplified shapes with slightly rough, hand-cut edges. The {field} ink is one flat rectangular block behind the dog, with the same dry, slightly mottled hand-rolled texture as the black. A few stray chatter marks left by the gouge in the cleared areas, a slight misregistration between the two blocks. Empty cream paper around the print. No grey tones, no washes, no gradients, no pen lines, no watercolour. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Like a limited-edition relief print from a small printmaker's studio. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Pastel

Used for: pastel.webp (Cavalier), gallery-4.webp (Poodle puppy).

```text
Turn this photo into a soft pastel portrait of this exact {breed}, no collar, no accessories, drawn on warm grey-buff toned pastel paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Head and chest only. Velvety blended fur built from layered strokes of soft pastel, crisp chalky accents in the eyes, on the nose and in the brightest fur, and loose open hatching strokes that fade into the bare toned paper toward the edges. The tooth of the paper shows through the pastel everywhere. A single soft light from the upper left. Restrained palette of umber, bone, ochre, dusty rose and slate. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Tender and quiet, like a late 19th-century Impressionist pastel in a museum. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Ink Wash

Used for: ink-wash.webp (Border Collie), gallery-5.webp (Labrador).

```text
Turn this photo into a sumi ink-wash brush painting of this exact {breed}, no collar, no accessories, on warm off-white handmade cotton rice paper. Keep this exact dog from the photo: the same face, eye colour, nose, muzzle, ear shape, fur length, fur colours and markings, so the owner instantly recognises their own dog. Natural canine anatomy and proportions, two eyes. Head and chest only. Painted with a few confident brushstrokes in black ink: soft diluted grey washes that bleed into the paper for the fur, dry-brush strokes with streaks of bare paper, and the darkest crisp ink kept for the eyes and nose. The lightest fur is simply bare paper. Monochrome black and grey ink with at most one faint warm sepia tone. Generous empty paper around the dog, no background. The soft fibres of the paper are visible. No seal, no stamp, no calligraphy. Composition: the whole head and both ears sit comfortably inside the picture with a calm margin of background above the ears and at both sides, the eyes near the upper third. Quiet and spare, like a contemporary ink painting in a gallery. The artwork fills the entire image edge to edge. No text, no letters, no numbers, no signature, no monogram, no watermark, no frame, no border.
```

### Mid-Century mouth fix (inpaint prompt, masked to the muzzle only)

```text
A refined 1950s mid-century modern gouache and silkscreen print of a Pembroke Welsh Corgi with its mouth closed, lips together, a calm serene expression, no tongue, no teeth. Flat matte gouache shapes, muted ochre, bone, soft black, slight paper grain.
```

## Hard rejects (check every image at 100%)

- Any text, letters, numbers, signatures, monograms, seals, stamps, watermarks.
- A frame, border, mat or canvas edge painted into the image (the export trims 1–1.5% to remove faint edges).
- Human anatomy: square human shoulders, a human torso, arms or hands, an elongated neck.
- Extra or missing limbs/paws, merged or doubled ears, malformed eyes (scleral white "googly" eyes), malformed
  teeth or tongues, a second dog.
- Merged fur artefacts, "melted" fur blobs, stray dark specks on bare paper or bright specks in dark oil
  passages (the export removes tiny isolated specks automatically; anything larger is a reject).
- Cropped ears or head, the dog crammed against an edge.
- Any costume, clothing, collar, prop, scene or storyline. Cartoon or novelty finish: neon colour, glossy plastic
  sheen, airbrushed vector look, bokeh.
- Off-palette colour that breaks the 10-up collection.
- Likeness drift: wrong markings, eye colour or ear shape compared with the source photo.

## Finishing (export)

`export2.py` (scratchpad pipeline) per portrait: optional 1.2–1.5% edge trim, centre crop to exactly 4:5, Lanczos
resize to 1200×1500, light unsharp mask, then a very light physical-surface pass. For oils that is a linen weave
modulation, stronger in thin dark passages. For paper media it is a fine multi-scale paper tooth, stronger on bare
paper. Then tiny isolated speck removal and WebP at quality 83–86 (< 400 KB).

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
