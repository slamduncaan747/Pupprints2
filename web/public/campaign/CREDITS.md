# Campaign images: credits and provenance

The images in this folder are **composited product mockups**. The rooms, furniture, frames, box, phone and
ornament blank are AI-generated scenes. The artwork shown in each one is our actual sample portrait file (from
`web/public/samples/`), placed into the scene by code. The product shown is real and exact; the room is not a real
place, and no customer or real home is shown. No people, logos, brands or text appear in any scene.

## How they were made (Oct 18)

- **Scene model:** FLUX.2 [klein] 4B (`black-forest-labs/FLUX.2-klein-4B`), run locally on CPU with Hugging Face
  `diffusers` (`Flux2KleinPipeline`, bf16), text-to-image, 4 steps, guidance 1.0. The model and its outputs are
  licensed **Apache-2.0** (https://huggingface.co/black-forest-labs/FLUX.2-klein-4B), and commercial use is
  permitted. The text encoder is Qwen3-4B (bundled), also Apache-2.0.
  Each scene was generated with a blank flat grey placeholder where the art goes, or with a bare wall.
- **Compositing (Python: Pillow, NumPy, SciPy; our own code):** the exact portrait file is warped into the
  placeholder by homography and lit by the placeholder's own low-pass luminance, so the scene's light falloff
  crosses the art. Brightness is normalised to the surrounding wall. For framed pieces we add a faint acrylic veil
  and sheen, carry the wall's light field across the frame, add a moulding lip shadow, and unmix occluders where a
  branch crosses the frame. Matching film grain is added. Nothing in the artwork is regenerated or repainted.
- **Gallery-wrap canvas** (format-canvas.webp) is rendered in 3D by our code, not by the model: a true 16×20
  canvas on a 1.25 in stretcher, with the image wrapping its visible right and bottom edges, a cast and contact
  shadow on the wall, and the wall's light field.
- **Phone screen** (format-digital.webp): the screen is a generated switched-off phone. The display content is the
  exact portrait, with the original dark-glass reflection kept on top.
- **Ornament** (heirloom.webp): the generated blank glossy ceramic disc receives a circular crop of the portrait
  through an ellipse mapping. The hanging hole, cord and glaze highlights are kept from the photo. The mug was
  skipped (a cylindrical warp did not meet the "looks real" bar in the time available).
- **Small scene retouches:** a wall outlet was removed from the gallery-wall hallway, and a branch was removed from
  the hero-tall wall (cloned plaster). The dog-and-portrait frame was narrowed to a 4:5 opening by removing a
  vertical strip from its middle, so it matches a real product size.

## Per file

| File | Size | Scene | Artwork shown (exact file) | Artwork's source photo |
|---|---|---|---|---|
| hero-wide.webp | 2400×1350 | Limewashed wall, oak console, ceramic vase with a branch, raking morning light; oak frame, acrylic, no mat | samples/royal.webp | cavalier-2.jpg (Tracy Anderson, Unsplash) |
| hero-tall.webp | 1200×1500 | Same idea composed for phones: large oak frame (about 50% of the width) in the upper middle, calm plaster below | samples/royal.webp | cavalier-2.jpg |
| format-canvas.webp | 1200×1500 | 16×20 gallery-wrap canvas (rendered) above a linen sofa | samples/royal.webp | cavalier-2.jpg |
| format-framed.webp | 1200×1500 | Natural oak frame, no mat, leaning on a travertine mantel with an olive sprig | samples/royal.webp | cavalier-2.jpg |
| format-print.webp | 1200×1500 | Unframed matte fine-art print, overhead on linen and oak with tissue and a pencil | samples/royal.webp | cavalier-2.jpg |
| format-digital.webp | 1200×1500 | Phone on travertine, screen showing the portrait | samples/royal.webp | cavalier-2.jpg |
| gift.webp | 1200×1500 | Black-framed portrait half-unwrapped from tissue in a plain ivory box with a cotton ribbon | samples/royal.webp | cavalier-2.jpg |
| dog-and-portrait.webp | 1800×1200 | A golden retriever on a cream linen sofa beneath its own portrait (oak frame). The scene dog was generated as a reference edit of the same photo the portrait was made from | samples/gallery-1.webp (Old Master) | golden-retriever.jpg (Faber Leonardo, Unsplash): both the portrait and the scene dog |
| gallery-wall.webp | 1800×1200 | Pale hallway, three oak frames (no mat) in a row | samples/oil-classic.webp, samples/watercolor.webp, samples/charcoal.webp | border-collie.jpg (Pauline Loroy), beagle-2.jpg (Jabez Rodarte), labrador.jpg (Aniket Salve) |
| heirloom.webp | 1200×1500 | Matching ceramic ornament on crumpled linen with an evergreen sprig | samples/royal.webp (circular crop) | cavalier-2.jpg |

All source photos are from Unsplash and used under the [Unsplash License](https://unsplash.com/license) (free
commercial use and modification, no attribution required; we credit anyway). See
`web/scripts/sample-sources/CREDITS.md`.

Note for copy: these are mockups of our products in styled rooms. Don't caption them as customer homes or as
photos of shipped orders.
