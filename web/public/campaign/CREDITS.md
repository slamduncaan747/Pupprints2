# Campaign images: credits and provenance

The images in this folder are **composited product mockups**. The rooms, furniture, frames, box and phone
are AI-generated scenes. The artwork shown in each one is our actual sample portrait file (from
`web/public/samples/`), placed into the scene by code. The product shown is real and exact; the room is not a real
place, and no customer or real home is shown. No people, logos, brands or text appear in any scene.

## How they were made (scenes Oct 18; artwork recomposited Nov 10)

- **Nov 10 change:** the rooms are unchanged. Only the artwork was swapped, by rerunning the same compositing
  code: the one hero portrait became the Old Master golden retriever (replaced again in the Modern round below), used
  consistently in every single-portrait scene, and the gallery wall shows three pieces from the dog-centred
  collection. No costume portraits remain.
- **Modern round (later Nov 10):** the hero portrait is now the Modern golden retriever "Biscuit"
  (`samples/pair-1-after.webp`, off-white ground, name set by our lettering code before compositing). For this pale
  artwork the placeholder's shading is compressed, paper white is set just above the wall's brightness and the art
  takes the wall's light colour. hero-tall uses a true 2:3 version of the portrait (more flat ground above the dog).
  The gallery wall now shows three light pieces.
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
- **Living-room scene (dog-and-portrait.webp, redone Nov 10):** a new generated room with a bare wall. The frame
  is not generated: a 24×30 in solid oak frame is rendered by our code, lit by the wall's own light, with a cast
  and contact shadow. A second lead cut off by the right edge and an empty peg were painted out with wall texture.
  heirloom.webp (the ornament scene) was deleted; the site no longer uses it.
- **Small scene retouches:** a wall outlet was removed from the gallery-wall hallway, and a branch was removed from
  the hero-tall wall (cloned plaster). The dog-and-portrait frame was narrowed to a 4:5 opening by removing a
  vertical strip from its middle, so it matches a real product size.

## Per file

| File | Size | Scene | Artwork shown (exact file) | Artwork's source photo |
|---|---|---|---|---|
| hero-wide.webp | 2400×1350 | Limewashed wall, oak console, ceramic vase with a branch, raking morning light; oak frame, acrylic, no mat | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg (Faber Leonardo, Unsplash) |
| hero-tall.webp | 1200×1500 | Same idea composed for phones: large oak frame (about 50% of the width, a 24×36 opening; the portrait's plain ground is extended above the dog instead of cropping it) in the upper middle, calm plaster below | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| format-canvas.webp | 1200×1500 | 16×20 gallery-wrap canvas (rendered) above a linen sofa | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| format-framed.webp | 1200×1500 | Natural oak frame, no mat, leaning on a travertine mantel with an olive sprig | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| format-print.webp | 1200×1500 | Unframed matte fine-art print, overhead on linen and oak with tissue and a pencil | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| format-digital.webp | 1200×1500 | Phone on travertine, screen showing the portrait | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| gift.webp | 1200×1500 | Black-framed portrait half-unwrapped from tissue in a plain ivory box with a cotton ribbon | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg |
| dog-and-portrait.webp | 1800×1200 | Bright living room: linen two-seat sofa, a dog bed with a toy and blanket, a lead on a hook. No live dog (generated dogs did not pass review). The oak-framed portrait (about 24×30 in, no mat) is rendered and hung by our code above the sofa | samples/pair-1-after.webp (Modern, "Biscuit") | golden-retriever.jpg (Faber Leonardo, Unsplash) |
| gallery-wall.webp | 1800×1200 | Pale hallway, three oak frames (no mat) in a row | Modern cavalier "Olive" (2:3 version of samples/modern.webp), samples/watercolor.webp, samples/fine-line.webp | cavalier.jpg (Izabelly Marques), beagle-2.jpg (Jabez Rodarte), french-bulldog.jpg (Eric Tan) |

All source photos are from Unsplash and used under the [Unsplash License](https://unsplash.com/license) (free
commercial use and modification, no attribution required; we credit anyway). See
`web/scripts/sample-sources/CREDITS.md`.

Note for copy: these are mockups of our products in styled rooms. Don't caption them as customer homes or as
photos of shipped orders.
