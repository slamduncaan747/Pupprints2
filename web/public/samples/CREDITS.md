# Sample portraits: credits and provenance

The images in this folder are example portraits made by our studio to show each style. They are not
customer orders and not customer reviews. Each one is an AI render made from a real dog photo
(listed below), then reviewed by a person at 100% before it was published (likeness, anatomy, no garbled
text or jewellery, no watermarks).

## How they were made (current set, Oct 18: house-style redesign)

- **Model:** FLUX.2 [klein] 4B (`black-forest-labs/FLUX.2-klein-4B`), run locally on CPU with Hugging Face
  `diffusers` (`Flux2KleinPipeline`, bf16). Reference-image editing: the real photo is passed as the
  reference image, and the style prompt asks for a portrait of *this exact dog*. 4 steps, guidance 1.0,
  rendered natively at 1152×1440 (reference photo at 640×800).
  - License: **Apache-2.0** (https://huggingface.co/black-forest-labs/FLUX.2-klein-4B). Commercial use of
    the model and of its outputs is permitted. The bundled VAE is under the same license.
- **Text encoder:** Qwen3-4B (`Qwen/Qwen3-4B`, as bundled in the FLUX.2-klein-4B repository), **Apache-2.0**.
- **Prompts:** one shared house style (museum surfaces, natural canine anatomy, one soft light, one restrained
  palette, no text). The exact prompt used for each style is in `docs/art-direction.md`.
- **Retouching:**
  - mid-century.webp: the open mouth was re-rendered closed with the same model's inpainting pipeline
    (`Flux2KleinInpaintPipeline`, masked to the muzzle only).
  - pop-art.webp: a stray dark shape below the jaw (a malformed tongue) was painted out with the plain
    background ink.
  - charcoal.webp: the reference photo was first scaled down and seated on its own extended backdrop, to leave
    headroom.
- **Finishing:** up to 1.2% edge trim (removes faint painted canvas edges), centre crop to 4:5, Lanczos resize to
  1200×1500, light unsharp mask. Then a very light surface pass: linen weave for oils, paper tooth for paper media.
  Tiny isolated specks are removed, and near-white trim on The Royal is warmed to ivory. WebP quality 80–86
  (Pillow), each file under 400 KB.

We never present these as hand-painted or signed. "Made by our AI artist, finished and checked by our team."

## Source photos

All source photos are from Unsplash and used under the [Unsplash License](https://unsplash.com/license),
which allows free commercial use and modification without attribution. We credit the photographers
anyway. None are Unsplash+ photos. Local copies (4:5 crops) live in `web/scripts/sample-sources/`.

| Sample file(s) | Style | Dog | Source photo | Photographer | Unsplash page |
|---|---|---|---|---|---|
| royal.webp | The Royal | Cavalier King Charles Spaniel | cavalier-2.jpg | Tracy Anderson | https://unsplash.com/photos/OktYfwY5ZQI |
| pair-1-before.webp (photo), pair-1-after.webp | The Royal | Golden Retriever | golden-retriever.jpg | Faber Leonardo | https://unsplash.com/photos/ktujYJX35-E |
| admiral.webp | The Admiral | Labrador Retriever | labrador-2.jpg | Not identified yet (free Unsplash CDN image) | https://images.unsplash.com/photo-1761797732084-eed42f058516 |
| pair-3-before.webp (photo), pair-3-after.webp | The Admiral | Beagle | beagle.jpg | Nathanaël Desmeules | https://unsplash.com/photos/527_3nFNAPo |
| gallery-4.webp | The Admiral | Siberian Husky | husky.jpg | Elin Birgisdottir | https://unsplash.com/photos/cwwwHfTytSI |
| oil-classic.webp | Old Master | Border Collie | border-collie.jpg | Pauline Loroy | https://unsplash.com/photos/XH8A0bvQ7iE |
| gallery-1.webp | Old Master | Golden Retriever | golden-retriever.jpg | Faber Leonardo | https://unsplash.com/photos/ktujYJX35-E |
| watercolor.webp | Watercolor | Beagle (tricolour hound) | beagle-2.jpg | Jabez Rodarte | https://unsplash.com/photos/rxFw2zAaUi0 |
| pair-2-before.webp (photo), pair-2-after.webp | Watercolor | French Bulldog | french-bulldog.jpg | Eric Tan | https://unsplash.com/photos/p6qtH9kqjt8 |
| gallery-3.webp | Watercolor | Cavapoo | cavapoo.jpg | Leiada Krözjhen | https://unsplash.com/photos/7lahRWgD2qM |
| fine-line.webp | Fine Line | French Bulldog | french-bulldog.jpg | Eric Tan | https://unsplash.com/photos/p6qtH9kqjt8 |
| pop-art.webp | Pop Art | Dachshund | dachshund.jpg | Alexandre Daoust | https://unsplash.com/photos/DoMqElrLS5M |
| gallery-2.webp | Pop Art | French Bulldog | french-bulldog-sitting.jpg | Eric Tan | https://unsplash.com/photos/WqveMpe3QTA |
| storybook.webp | Storybook | Poodle / Doodle puppy | doodle-puppy.jpg | Erick Lee Hodge | https://unsplash.com/photos/U8pgck1dgtQ |
| gallery-5.webp | Storybook | Cavalier King Charles Spaniel | cavalier-3.jpg | Courtney Mihaka | https://unsplash.com/photos/8rdX9FraXug |
| botanical.webp | Botanical | Cavapoo | cavapoo.jpg | Leiada Krözjhen | https://unsplash.com/photos/7lahRWgD2qM |
| astronaut.webp | Space Cadet | Siberian Husky | husky.jpg | Elin Birgisdottir | https://unsplash.com/photos/cwwwHfTytSI |
| charcoal.webp | Charcoal Study | Labrador Retriever | labrador.jpg | Aniket Salve | https://unsplash.com/photos/IQ3FjY2Gdho |
| gallery-6.webp | Charcoal Study | Beagle (tricolour hound) | beagle-2.jpg | Jabez Rodarte | https://unsplash.com/photos/rxFw2zAaUi0 |
| mid-century.webp | Mid-Century | Pembroke Welsh Corgi | corgi.jpg | Ivana La | https://unsplash.com/photos/tycZhR54Ddk |
| holiday.webp | Holiday Cozy | Cavalier King Charles Spaniel | cavalier.jpg | Izabelly Marques | https://unsplash.com/photos/-d-q58LA1ds |

Changes from the Oct 14 set: holiday.webp now uses cavalier.jpg (was golden-retriever-2.jpg). gallery-1.webp
now uses golden-retriever.jpg (was golden-retriever-2.jpg), so it is the same dog as pair-1 and as the dog in
`campaign/dog-and-portrait.webp`. The style and dog labels in `web/src/lib/samples.ts` are unchanged.

## Site-wide images made from these samples

- `web/public/campaign/`: product mockups that composite these exact files into generated interiors (see
  `web/public/campaign/CREDITS.md`).
- `web/public/og-default.jpg` (1200×630): the current royal.webp on a white page with the "PUP PRINTS" wordmark and the line "Your dog, immortalized." set in Bodoni Moda, with a Hanken Grotesk label (both SIL Open Font License 1.1), composed with Pillow (regenerated Oct 18).
- `web/public/logo.png`: brand mark only, no photo.
