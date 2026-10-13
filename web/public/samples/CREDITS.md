# Sample portraits: credits and provenance

The images in this folder are example portraits made by our studio to show each style. They are not
customer orders and not customer reviews. Each one is an AI image-to-image render of a real dog photo,
reviewed by a person before it was published (anatomy, likeness, no text or watermarks).

## How they were made

- **Model:** DreamShaper 8 (`Lykon/dreamshaper-8`, a Stable Diffusion 1.5 fine-tune), run locally on CPU
  with Hugging Face `diffusers`, img2img at 512×640, DPM++ 2M Karras, 14 steps, CFG 6, strength 0.5–0.68.
  - License: **CreativeML OpenRAIL-M** (https://huggingface.co/Lykon/dreamshaper-8). It allows commercial
    use of the generated images, subject to the license's use-based restrictions (none apply here).
- **Upscaling:** Real-ESRGAN `realesr-general-x4v3` (BSD-3-Clause, https://github.com/xinntao/Real-ESRGAN),
  blended 60/40 with a Lanczos resize, then downsampled to 960×1200 and saved as WebP (quality 82).
- **Background masks** for the pre-composited costumes/backdrops: rembg with the U²-Net model
  (rembg MIT, U²-Net Apache-2.0).

To regenerate these with the production pipeline (the same provider chain customers get), run
`web/scripts/generate-samples.ts`. It reads the source photos in `web/scripts/sample-sources/`.

## Source photos

All source photos are from Unsplash and used under the [Unsplash License](https://unsplash.com/license),
which allows free commercial use and modification without attribution. We credit the photographers
anyway. None are Unsplash+ photos. Local copies (4:5 crops) live in `web/scripts/sample-sources/`.

| Sample file(s) | Style | Dog | Photographer | Unsplash page |
|---|---|---|---|---|
| royal.webp | The Royal | Cavalier King Charles Spaniel | Tracy Anderson | https://unsplash.com/photos/OktYfwY5ZQI |
| admiral.webp, pair-3-before/after.webp | The Admiral | Beagle | Nathanaël Desmeules | https://unsplash.com/photos/527_3nFNAPo |
| oil-classic.webp | Old Master | Labrador Retriever | Aniket Salve | https://unsplash.com/photos/IQ3FjY2Gdho |
| watercolor.webp, pair-2-before/after.webp, gallery-2.webp | Watercolor / Pop Art | French Bulldog | Eric Tan | https://unsplash.com/photos/p6qtH9kqjt8 |
| fine-line.webp | Fine Line | Labrador Retriever | Not identified yet (free Unsplash CDN image) | https://images.unsplash.com/photo-1761797732084-eed42f058516 |
| pop-art.webp | Pop Art | Dachshund | Alexandre Daoust | https://unsplash.com/photos/DoMqElrLS5M |
| storybook.webp | Storybook | Poodle / Doodle puppy | Erick Lee Hodge | https://unsplash.com/photos/U8pgck1dgtQ |
| botanical.webp | Botanical | Cavalier King Charles Spaniel | Izabelly Marques | https://unsplash.com/photos/-d-q58LA1ds |
| astronaut.webp, gallery-4.webp | Space Cadet / Admiral | Siberian Husky | Elin Birgisdottir | https://unsplash.com/photos/cwwwHfTytSI |
| charcoal.webp | Charcoal Study | Border Collie | Chung Nguyen | https://unsplash.com/photos/kJlk-jW2nLI |
| mid-century.webp, holiday.webp | Mid-Century / Holiday Cozy | Pembroke Welsh Corgi | Ivana La | https://unsplash.com/photos/tycZhR54Ddk |
| pair-1-before/after.webp | The Royal | Golden Retriever | Faber Leonardo | https://unsplash.com/photos/ktujYJX35-E |
| gallery-1.webp | Old Master | Golden Retriever | Victor G | https://unsplash.com/photos/x5oPmHmY3kQ |
| gallery-3.webp | Watercolor | Cavapoo | Leiada Krözjhen | https://unsplash.com/photos/7lahRWgD2qM |
| gallery-5.webp | Storybook | Cavalier King Charles Spaniel | Courtney Mihaka | https://unsplash.com/photos/8rdX9FraXug |
| gallery-6.webp | Charcoal Study | Beagle (tricolour hound) | Jabez Rodarte | https://unsplash.com/photos/rxFw2zAaUi0 |

Site-wide images made from these samples: `web/public/og-default.jpg` (uses admiral, pair-1-after and
pop-art) and `web/public/logo.png` (brand mark only, no photo).
