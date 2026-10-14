# Sample portraits: credits and provenance

The images in this folder are example portraits made by our studio to show each style. They are not
customer orders and not customer reviews. Each one is an AI render made from a real dog photo
(listed below), then reviewed by a person before it was published (likeness, anatomy, no garbled
text or jewellery, no watermarks).

## How they were made (current pipeline, Oct 14)

- **Model:** FLUX.2 [klein] 4B (`black-forest-labs/FLUX.2-klein-4B`), run locally on CPU with Hugging Face
  `diffusers` (`Flux2KleinPipeline`, bf16), reference-image editing: the real photo is passed as the
  reference image and the style prompt asks for a portrait of *this exact dog*. 4 steps, guidance 1.0,
  rendered natively at 960×1200 (reference photo at 640×800).
  - License: **Apache-2.0** (https://huggingface.co/black-forest-labs/FLUX.2-klein-4B). Commercial use of
    the model and of its outputs is permitted. The bundled VAE (`vae/` in the same repository) is under
    the same Apache-2.0 license.
- **Text encoder:** Qwen3-4B (`Qwen/Qwen3-4B`, as bundled in the FLUX.2-klein-4B repository), **Apache-2.0**
  (https://huggingface.co/Qwen/Qwen3-4B).
- **Retouching:** on royal.webp and pair-1-after.webp the medallion was re-rendered with the same model's inpainting pipeline
  (`Flux2KleinInpaintPipeline`, masked to the pendant only) to replace engraved pseudo-lettering with a plain gold pendant. On oil-classic.webp a faint painted pseudo-signature in the lower-left corner was removed by cloning
  the adjacent background (we never present these as signed or hand-painted).
- **Finishing:** cropped 1.5% at the edges (removes the faint painted canvas edge), Lanczos resize to
  1200×1500, light unsharp mask, WebP quality 84 (Pillow).
- Style prompts are adapted from `STYLES[].prompt` in `web/src/lib/catalog.ts`.

All files in this folder now come from this pipeline (the earlier DreamShaper 8 / SD 1.5 set was fully
replaced on Oct 14). For gallery-4.webp, fine-line.webp and astronaut.webp the reference photo was first
scaled down and seated on its own extended backdrop, to leave headroom in the composition.

## Source photos

All source photos are from Unsplash and used under the [Unsplash License](https://unsplash.com/license),
which allows free commercial use and modification without attribution. We credit the photographers
anyway. None are Unsplash+ photos. Local copies (4:5 crops) live in `web/scripts/sample-sources/`.

| Sample file(s) | Style | Dog | Source photo | Photographer | Unsplash page | Pipeline |
|---|---|---|---|---|---|---|
| royal.webp | The Royal | Cavalier King Charles Spaniel | cavalier-2.jpg | Tracy Anderson | https://unsplash.com/photos/OktYfwY5ZQI | FLUX.2 klein |
| pair-3-before.webp (photo), pair-3-after.webp | The Admiral | Beagle | beagle.jpg | Nathanaël Desmeules | https://unsplash.com/photos/527_3nFNAPo | FLUX.2 klein |
| admiral.webp | The Admiral | Labrador Retriever | labrador-2.jpg | Not identified yet (free Unsplash CDN image) | https://images.unsplash.com/photo-1761797732084-eed42f058516 | FLUX.2 klein |
| oil-classic.webp | Old Master | Border Collie | border-collie.jpg | Pauline Loroy | https://unsplash.com/photos/XH8A0bvQ7iE | FLUX.2 klein |
| pair-2-before.webp (photo), pair-2-after.webp | Watercolor | French Bulldog | french-bulldog.jpg | Eric Tan | https://unsplash.com/photos/p6qtH9kqjt8 | FLUX.2 klein |
| watercolor.webp | Watercolor | Beagle (tricolour hound) | beagle-2.jpg | Jabez Rodarte | https://unsplash.com/photos/rxFw2zAaUi0 | FLUX.2 klein |
| gallery-2.webp | Pop Art | French Bulldog | french-bulldog-sitting.jpg | Eric Tan | https://unsplash.com/photos/WqveMpe3QTA | FLUX.2 klein |
| fine-line.webp | Fine Line | French Bulldog | french-bulldog.jpg | Eric Tan | https://unsplash.com/photos/p6qtH9kqjt8 | FLUX.2 klein |
| pop-art.webp | Pop Art | Dachshund | dachshund.jpg | Alexandre Daoust | https://unsplash.com/photos/DoMqElrLS5M | FLUX.2 klein |
| storybook.webp | Storybook | Poodle / Doodle puppy | doodle-puppy.jpg | Erick Lee Hodge | https://unsplash.com/photos/U8pgck1dgtQ | FLUX.2 klein |
| botanical.webp | Botanical | Cavapoo | cavapoo.jpg | Leiada Krözjhen | https://unsplash.com/photos/7lahRWgD2qM | FLUX.2 klein |
| astronaut.webp | Space Cadet | Siberian Husky | husky.jpg | Elin Birgisdottir | https://unsplash.com/photos/cwwwHfTytSI | FLUX.2 klein |
| gallery-4.webp | The Admiral | Siberian Husky | husky.jpg | Elin Birgisdottir | https://unsplash.com/photos/cwwwHfTytSI | FLUX.2 klein |
| charcoal.webp | Charcoal Study | Labrador Retriever | labrador.jpg | Aniket Salve | https://unsplash.com/photos/IQ3FjY2Gdho | FLUX.2 klein |
| mid-century.webp | Mid-Century | Pembroke Welsh Corgi | corgi.jpg | Ivana La | https://unsplash.com/photos/tycZhR54Ddk | FLUX.2 klein |
| holiday.webp | Holiday Cozy | Golden Retriever | golden-retriever-2.jpg | Victor G | https://unsplash.com/photos/x5oPmHmY3kQ | FLUX.2 klein |
| pair-1-before.webp (photo), pair-1-after.webp | The Royal | Golden Retriever | golden-retriever.jpg | Faber Leonardo | https://unsplash.com/photos/ktujYJX35-E | FLUX.2 klein |
| gallery-1.webp | Old Master | Golden Retriever | golden-retriever-2.jpg | Victor G | https://unsplash.com/photos/x5oPmHmY3kQ | FLUX.2 klein |
| gallery-3.webp | Watercolor | Cavapoo | cavapoo.jpg | Leiada Krözjhen | https://unsplash.com/photos/7lahRWgD2qM | FLUX.2 klein |
| gallery-5.webp | Storybook | Cavalier King Charles Spaniel | cavalier-3.jpg | Courtney Mihaka | https://unsplash.com/photos/8rdX9FraXug | FLUX.2 klein |
| gallery-6.webp | Charcoal Study | Beagle (tricolour hound) | beagle-2.jpg | Jabez Rodarte | https://unsplash.com/photos/rxFw2zAaUi0 | FLUX.2 klein |

## Site-wide images made from these samples

- `web/public/og-default.jpg` (1200×630): royal.webp on a white page with the "PUP PRINTS" wordmark and the
  line "Your dog, immortalized." set in Bodoni Moda, with a Hanken Grotesk label (both SIL Open Font
  License 1.1, Google Fonts), composed with Pillow.
- `web/public/logo.png`: brand mark only, no photo.
