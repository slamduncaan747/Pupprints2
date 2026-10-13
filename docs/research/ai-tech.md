# Pup Prints: technical research on image generation and editing for pet portraits

**Snapshot date:** 2026-10-12. Prices and model IDs change often. Each figure below is labelled by where it came from: **(V)** means I read it on the official docs or pricing page or pulled it from the provider's live OpenAPI schema; **(3P)** means a third-party source; **(E)** means my own estimate. Treat every (E) figure as something to benchmark before relying on it.

---

## 0. TL;DR recommendation

| Decision | Recommendation | Why |
|---|---|---|
| **Primary model** | **Google Nano Banana 2.1** (`gemini-nano-banana-2.1`, released 2026-10-06) | It is #4 on Artificial Analysis' image-editing leaderboard (Elo 1140) at **about 1/6 the price** of the two models above it (GPT Image 2.5 at "max" quality). It outputs 4K natively, including 4:5, 3:4 and 2:3. It accepts up to 14 reference images and, per Google's docs, keeps up to 4 characters consistent. It holds identity well across repeated edits. |
| **Primary provider** | **fal.ai**, endpoint `google/nano-banana-2.1/edit` | One key covers generation, upscaling (Topaz, SeedVR2, ESRGAN), background removal and the fallback models. It has a queue, signed webhooks (Ed25519), per-request file expiry, and a "don't store request payloads" header. It also exposes `system_prompt`, `seed`, `safety_tolerance` and `thinking_level`, which Replicate does not. |
| **Provider fallback (same model)** | **Replicate**, model `google/nano-banana-2.1` | Same model at Google's list price ($0.0336 / $0.0504 / $0.1134 for 1K / 2K / 4K), which is slightly cheaper than fal. Webhooks are signed with HMAC, and Replicate deletes API prediction data after 1 hour. |
| **Model fallback (non-Google)** | **fal** `openai/gpt-image-2.5/flare/edit` (or Replicate `black-forest-labs/flux-2-pro`) | fal and Replicate both proxy Google for Nano Banana, so a Google outage or safety refusal takes out both. The fallback has to be a different vendor. GPT Image 2.5 Flare is #2 on that leaderboard and costs about $0.013 at medium quality or $0.053 at high quality per 1 MP edit. |
| **Masters** | Generate every preview as a **2K master**, store it privately, and show only a watermarked 800 px JPEG | The image the customer approves is the exact image that gets printed, so there is no drift between preview and print. A 2K master upscales cleanly to 16×20 in. at 300 DPI. |
| **Print upscaling** | fal **Topaz** (`fal-ai/topaz/upscale/image`, "High Fidelity V2", `face_enhancement:false`). Budget option: **SeedVR2**. Line art: **Recraft vectorize** | These upscalers stay faithful to the source. Generative upscalers such as Clarity and creative modes invent fur and markings. |
| **Background removal** | fal **BiRefNet v2** (cheap, MIT licence) or **Bria RMBG 2.0** ($0.018, trained on licensed data) | Mainly for merch and cutouts. Nano Banana restyles backgrounds itself. |
| **AI cost per free preview session** | About **$0.24** (4 styles × 2K on fal) | See the unit economics in §6. |

---

## 1. Model and provider landscape (Oct 2026)

### 1.1 Quality signal: Artificial Analysis image-editing leaderboard (V)
Read 2026-10-12 from [artificialanalysis.ai/image/leaderboard/editing](https://artificialanalysis.ai/image/leaderboard/editing). "$/1k" is the cost of 1,000 images at 1024² with default settings.

| # | Model | Elo | $/1k imgs |
|---|---|---|---|
| 1 | GPT Image 2.5 Sunburst (max) | 1184 | $210.70 |
| 2 | GPT Image 2.5 Flare (max) | 1165 | $210.70 |
| 3 | MAI-Image-2.6 (Microsoft) | 1140 | $38.90 |
| **4** | **Nano Banana 2.1** | **1140** | **$33.60** |
| 6 | GPT Image 2 (high) | 1127 | $211 |
| 10 | Nano Banana 2 (Gemini 3.1 Flash Image) | 1111 | $67 |
| 12 | Seedream 5.0 Pro | 1110 | $90 |
| 13 | GPT Image 1.5 (high) | 1104 | $133 |
| 14 | Nano Banana Pro (Gemini 3 Pro Image) | 1103 | $134 |

- Nano Banana Pro is now **below** 2.1 and costs 4× as much, so don't use it.
- Gemini 2.5 Flash Image (the original "nano banana") **was shut down on Google's side on 2026-10-02** (V). fal still lists `fal-ai/nano-banana/edit` as active. Don't build on it.
- MAI-Image-2.6 and Muse Image are new entrants that I did not evaluate for API access or terms.

### 1.2 Master comparison table

Prices are USD per output image unless noted. "In" means input-image charges.

| Model | Access: endpoint and auth | Price | Latency | Max output | Identity preservation (pets) | Content policy notes | Commercial terms |
|---|---|---|---|---|---|---|---|
| **Nano Banana 2.1** `gemini-nano-banana-2.1` | **Google direct:** `POST https://generativelanguage.googleapis.com/v1beta/interactions`, header `x-goog-api-key`. **fal:** `google/nano-banana-2.1/edit` (alias `fal-ai/nano-banana-2.1/edit`), header `Authorization: Key $FAL_KEY`. **Replicate:** `google/nano-banana-2.1`, header `Authorization: Bearer` | **Google (V):** 1K $0.0336, 2K $0.0504, 4K $0.113. Batch is half price. Input $1.50/M tokens (about $0.002 per input image). **fal (V):** 1K $0.040, 2K $0.059, 4K $0.134; an edit with two 1K inputs adds about $0.004. **Replicate (V):** $0.0336 / $0.0504 / $0.1134 | **(E)** 8–20 s at 1K–2K with `thinking_level: medium`; `minimal` is faster. A third-party test of Nano Banana 2 at 1K measured a 13.9 s median (3P) | 4K. At 4:5 that is 3712×4608; 3:4 is 3584×4800; 2:3 is 3392×5056 (V) | **Best price/quality.** Up to 14 refs (10 object + 5 character); docs: "character resemblance of up to 4 characters" (V). Improved stability across repeated edits (3P). Known failure: it re-stages composition (3P) | SynthID watermark on every output (V). Prohibited Use Policy. **Gemini API terms: users must be 18+ and the app may not be "directed towards or likely to be accessed by" under-18s** (V). Photos containing people or children raise refusal risk, so crop to the dog first | Google "won't claim ownership" of outputs. Paid tier: prompts and outputs are not used for training (V). Free tier: N/A for image models |
| Nano Banana 2 Lite `gemini-3.1-flash-lite-image` | Google; fal `google/nano-banana-lite/edit` | $0.0336 at 1K only (V) | "Sub-2 second" (fal claim) | 1K fixed | Weaker. "Not optimized for multiple reference inputs or multi-turn editing" (V) | Same as above | Same as above |
| Nano Banana 2 `gemini-3.1-flash-image` | Google; fal `fal-ai/nano-banana-2/edit` | Google $0.067 / $0.101 / $0.151; fal $0.08 / $0.12 / $0.16 (V) | Similar to 2.1 | 4K (also 512 px) | Good; superseded by 2.1 | Same | Same |
| Nano Banana Pro `gemini-3-pro-image` | Google; fal `fal-ai/nano-banana-pro/edit`; Replicate `google/nano-banana-pro` | Google $0.134 (1K/2K), $0.24 (4K); fal and Replicate $0.15 / $0.30 (V) | Slower; thinking is always on | 4K | Good (6 object, 3 style refs), but ranks below 2.1 | Same | Same |
| **GPT Image 2.5 Sunburst / Flare** `gpt-image-2.5-sunburst`, `gpt-image-2.5-flare` | **OpenAI:** `POST https://api.openai.com/v1/images/edits`, multipart with repeated `image[]`, Bearer key. **fal:** `openai/gpt-image-2.5/{sunburst\|flare}/edit` (16 refs plus `mask_url`) | Tokens: image in $8/M, out $30/M, text in $5/M (V). **Per image at 1024², including one input (fal table, V):** low $0.006, med $0.013, **high $0.053**, xhigh $0.094, max $0.211. 3840×2160 high: $0.100. Batch is half price | "Complex prompts may take up to 2 minutes" (V). Sunburst is slower than Flare | Max edge 3840 px; 655,360–8,294,400 px total; multiples of 16; aspect ratio ≤3:1. **Above 2560×1440 is "experimental"** (V) | Top editing quality. Sunburst is meant for editing precision, Flare for speed (V). Observed: Flare keeps the original framing best; Sunburst changes pose and adds unrequested text (3P) | `moderation: auto\|low`; blocks return `moderation_blocked` with stage input/output (V). C2PA metadata on outputs (3P/TechCrunch) | OpenAI terms assign the output to you; similar outputs may go to others (3P summary of the ToU). API data is not used for training by default |
| GPT Image 2 `gpt-image-2` (snapshot 2026-04-21) | Same endpoints | High quality at 1024²: $0.211 (V) | Slow | Same limits | Always high input fidelity; `input_fidelity` must be omitted (V) | Same | Same |
| GPT Image 1.5 | Same; supports `input_fidelity: "high"` | $0.009 / $0.034 / $0.133 at 1024² (V) | Medium | 1536 px | Legacy | Same | Same |
| **FLUX 3 Image** (BFL, ~2026-10-01) | fal `blackforestlabs/flux-3/edit-image` (also `fal-ai/flux-3-image/edit`); BFL direct `api.bfl.ai`, header `x-key` | **BFL (V):** 768² $0.041, ~1 MP $0.048, ~4 MP $0.100, ~16 MP $0.607. fal launch promo of $0.024/MP **ended Oct 8**; now about $0.048 at 1K (V) | fal: "4k can take several minutes" (V) | 4k tier. Ratios include **4:5, 5:7, 3:4, 2:3** | Pixel-precise local edits that keep the rest of the image unchanged; 10 refs (V). Not yet benchmarked for pets (E) | `safety_tolerance` 0–4 (default 2) | **BFL ToS:** BFL claims no ownership of outputs. **You may not represent output as "entirely human-generated"** (matters for marketing copy). Consent is required for real people. Outputs may not be used to train other models (V) |
| FLUX.2 [pro] edit | fal `fal-ai/flux-2-pro/edit`; Replicate `black-forest-labs/flux-2-pro`; BFL `POST https://api.bfl.ai/v1/flux-2-pro` + `x-key`, then poll `polling_url` | **fal (V):** $0.03 for the first output MP plus $0.015 per extra MP of input and output (so a 1 MP edit with a 1 MP input costs about $0.045). **Replicate (V):** $0.015/run + $0.015/MP in + $0.015/MP out. BFL: from $0.045 for edits (V) | (E) 5–15 s | 4 MP | Good; up to 8–10 refs | `safety_tolerance` 1–5 | Same as BFL |
| FLUX.2 [max] edit | fal `fal-ai/flux-2-max/edit` | $0.07 for the first MP, $0.03 per additional MP; inputs count (V) | (E) 10–25 s | 4 MP | Best FLUX.2 editing | | |
| FLUX.1 Kontext [pro] / [max] | fal `fal-ai/flux-pro/kontext`, Replicate, BFL | $0.04 / $0.08 (V) | (E) 5–10 s | About 1 MP | Decent; single input image on fal | **Replicate: `safety_tolerance` max is 2 when input images are used** (V) | Replicate: "free to use outputs commercially" (V) |
| Seedream 5.0 Pro edit (ByteDance) | fal `bytedance/seedream/v5/pro/edit` | $0.0675 up to 1536², $0.135 up to 2048², plus $0.0045 per extra input (V) | (E) 10–20 s | About 2K | Good; tends to "beautify" (E). AA Elo 1110 | fal safety checker | Commercial via the fal partner agreement |
| Seedream 5 Flash / Lite edit | fal `bytedance/seedream/v5/flash/edit`, `…/v5/lite/edit` | $0.027 / $0.035 (V) | Fast | | Cheap drafts | | |
| Seedream 4.5 edit | fal `fal-ai/bytedance/seedream/v4.5/edit`; Replicate | **$0.04 flat** (V) | (E) 10–20 s | **Native output 1920–4096 px** (up to 4096²) (V) | Good; cheapest native 4K | | |
| Qwen-Image-Edit-2511 (Alibaba) | fal `fal-ai/qwen-image-edit-2511` (+ `/lora`); weights on Hugging Face | $0.03/MP (V) | (E) 5–15 s | ~1–2 MP | Good identity (official card) | Open weights, so you set your own policy | **Apache-2.0**; self-hosting and LoRA training possible |
| Qwen Image 3 edit / Qwen Image Max edit | fal `alibaba/qwen-image-3/edit`, `fal-ai/qwen-image-max/edit` | $0.04 at 1K, $0.075 at 2K / $0.075 (V) | | 2K | Untested (E) | | |
| Ideogram v4.5 edit / Character | fal `ideogram/v4.5/edit`; `fal-ai/ideogram/character` | v4.5: $0.008–$0.22 depending on quality. Character: $0.10–$0.20 (V) | | | **Character takes one reference and is built for human characters, so it is not suitable for dogs (E).** Strength is typography | | |
| Recraft V3 / V4 image-to-image | `https://external.api.recraft.ai/v1`, Bearer key; fal `fal-ai/recraft/v3/image-to-image` | $0.04 raster, $0.08 vector; V4 Pro 2K $0.25 (V) | | | Style-driven; weak identity, so not suitable as the primary model | | Use Recraft for **vectorize ($0.01)**, **crisp upscale ($0.004)** and **background removal ($0.01)** |
| Stability AI (Stable Image services) | `api.stability.ai`, Bearer key | Conservative Upscale 40 credits (about $0.40) (3P) | | **Upscale output capped at 4K** (3P) | Older generation; weaker identity | | Not recommended |

---

## 2. Upscaling for print

### 2.1 Pixel targets

Printful's guidance is 300 DPI as ideal and 120–150 DPI acceptable for large products (V).

| Print (in.) | Ratio | 300 DPI px | MP | 200 DPI px | 150 DPI px |
|---|---|---|---|---|---|
| 8×10 | 4:5 | 2400×3000 | 7.2 | 1600×2000 | 1200×1500 |
| 11×14 | ≈4:5 (crop 1.8%) | 3300×4200 | 13.9 | 2200×2800 | 1650×2100 |
| 12×16 | 3:4 | 3600×4800 | 17.3 | | |
| **16×20** | 4:5 | **4800×6000** | **28.8** | 3200×4000 | 2400×3000 |
| 18×24 | 3:4 | 5400×7200 | 38.9 | | |
| **24×36** | 2:3 | **7200×10800** | **77.8** | 4800×7200 | 3600×5400 |

### 2.2 Upscale factor needed from Nano Banana 2.1 masters (resolution table from Google docs, V)

| Master | 2K px | 4K px | Factor to target @300 DPI |
|---|---|---|---|
| 4:5 | 1856×2304 | 3712×4608 | 16×20: **2.6×** from 2K, 1.3× from 4K |
| 3:4 | 1792×2400 | 3584×4800 | 18×24: **3.0×** from 2K, 1.5× from 4K |
| 2:3 | 1696×2528 | 3392×5056 | 24×36: **4.25×** from 2K (Topaz on fal maxes at 4×, giving 6784×10112 ≈ 283 DPI; acceptable), 2.13× from 4K |
| 1:1 | 2048×2048 | 4096×4096 | 20×20: 2.9× from 2K |

### 2.3 Upscaler options

| Upscaler | Endpoint | Price | Behaviour | Use for |
|---|---|---|---|---|
| **Topaz** (fal) | `fal-ai/topaz/upscale/image`; output field is `image` | ≤24 MP $0.08, ≤48 MP $0.16, ≤96 MP $0.32, up to $1.36 at 512 MP (V) | Factor 1–4. Models include Standard V2, **High Fidelity V2**, Low Resolution V2, CGI, Redefine (generative) and Wonder 3. Faithful in the precision modes | **Default for painterly styles.** Set `face_enhancement: false` explicitly: it defaults to `true`, and the face enhancer is human-tuned, so it may distort dog faces (E, test it) |
| Topaz (Replicate) | `topazlabs/image-upscale` | Table: 24 MP $0.05, 48 MP $0.10, 96 MP $0.20 (V) | `upscale_factor`: None, 2x, 4x, **6x** | Fallback; can do 6× for 24×36 from a 2K master |
| **SeedVR2** (fal) | `fal-ai/seedvr/upscale/image` | **$0.001/MP** (V), so about $0.08 even at 78 MP | Factor 1–10, or `target_resolution` up to 2160p. Conservative and structure-preserving (3P), but some report over-sharpening | Budget option; A/B it against Topaz |
| Real-ESRGAN (fal) | `fal-ai/esrgan`; models x4plus and x4plus_anime_6B | $0.00111 per compute-second (V), so cents | Non-generative, scale 1–8, `tile` option to avoid running out of GPU memory | **Pop art, flat colour, line art** |
| Recraft crisp (fal / Recraft / Replicate) | `fal-ai/recraft/upscale/crisp` (input must be PNG) | **$0.004** (V) | **Input ≤4096 px per side and ≤16 MP (V)**, so it cannot take a 4K Nano Banana master (17 MP) | Only 1K→ or 2K→ steps |
| Recraft vectorize | `fal-ai/recraft/vectorize`; Recraft API | $0.01 (V) | Raster to SVG, which renders at any DPI | **Line art and minimal styles**: rasterize the SVG with `sharp({density})` at the exact print size |
| Clarity / Crystal / Recraft creative | `fal-ai/clarity-upscaler` ($0.03/MP), `fal-ai/crystal-upscaler` ($0.016/MP), creative $0.25 | Generative; invents detail | **Avoid for identity.** If used, set `creativity` ≤0.2 and `resemblance` ≥0.8 |
| Stability Conservative | | About $0.40, output capped at 4K (3P) | | Not enough for print sizes |

**Canvas note.** A gallery-wrapped canvas needs extra image area beyond the visible front: a 16×20 with a 1.25 in. wrap needs about 18.5×22.5 in. of image. Either prompt for a centred subject with about 8% safe margins and use the print-on-demand provider's "mirror edge" option, or outpaint the edges with `fal-ai/flux-2-pro/outpaint`.

---

## 3. Background removal

| Option | Endpoint | Price | Notes |
|---|---|---|---|
| **BiRefNet v2** | `fal-ai/birefnet/v2` | Compute-billed; the page shows "$0 per compute seconds", so negligible (V) | Models: General Light / Light 2K / Heavy / **Matting** / Portrait / Dynamic. `operating_resolution` up to 2304². MIT-licensed weights. Use Matting or Heavy at 2048 for fur edges |
| **Bria RMBG 2.0** | `fal-ai/bria/background/remove` | $0.018, or $0.03 with a text prompt (V) | "Trained exclusively on licensed data" (V). Commercially safe; good on hair and fur |
| Recraft | `/removeBackground` | $0.01 (V) | 20 MB / 16 MP input limit |
| rembg | `fal-ai/imageutils/rembg` | About $0 (V) | Lowest quality |

Where it is used:
1. **Input preprocessing.** Crop tightly to the dog, which enlarges the subject. It also strips people out, which reduces Gemini and OpenAI refusals and improves likeness.
2. **Merch.** Transparent cutouts for stickers and mugs.
3. **Custom backgrounds.** Composite onto a different scene.

Within the style transfer itself you don't need it; let the model repaint the background.

---

## 4. Recommended architecture (Next.js App Router)

```
Browser (Next.js)
 1. POST /api/uploads          -> presigned PUT URL (Supabase Storage / R2 / Vercel Blob), PRIVATE bucket
 2. PUT photo directly to bucket (avoids Vercel's 4.5 MB request-body limit; iOS file inputs usually transcode HEIC->JPEG)
 3. POST /api/generate {uploadId, styles[<=4], aspect, turnstileToken}
        |
        v
/api/generate (runtime=nodejs)
  - Turnstile + rate limit (IP + email + upload hash), cap re-rolls
  - preprocess once per upload: sharp .rotate() (EXIF) -> long edge <=2048 -> strip EXIF/GPS -> JPEG
    (optional) BiRefNet crop to dog; (optional) cheap vision-LLM "describe the dog" -> dogDescription
  - per style: insert generations row -> fal.queue.submit(google/nano-banana-2.1/edit, webhook)
      on submit error -> Replicate predictions.create(google/nano-banana-2.1, webhook)
        |
        v
fal / Replicate --webhook--> /api/webhooks/{fal|replicate}
  - verify signature (fal: Ed25519 JWKS + check user-id; Replicate: validateWebhook)
  - idempotent on provider request id
  - status ERROR -> resubmit once on model fallback (GPT Image 2.5 Flare via fal)
  - after(): download -> MASTER (private) -> sharp 800px + tiled watermark -> PREVIEW (public CDN)
  - (optional) likeness judge -> auto-retry if score < 4
  - mark ready -> client via Supabase Realtime / SSE / 2s polling
  Cron sweeper (every 1 min): rows "submitted" > 90 s -> poll status_url -> fail over

Stripe Checkout -> webhook checkout.session.completed -> durable job (Inngest / Trigger.dev / Vercel Queues)
  - upscale MASTER per style (Topaz | SeedVR2 | ESRGAN | vectorize) -> exact px, sRGB, 300 DPI, JPEG q95
  - store PRINT file (private) -> signed URL -> print-on-demand API order
  - digital product: email signed URL (7-day expiry)
```

### Key rules

- **Never send a provider URL to the browser.** fal CDN files are **public by default and kept forever unless configured** (V). Send `X-Fal-Object-Lifecycle-Preference: {"expiration_duration_seconds":3600}` and `X-Fal-Store-IO: 0`. The second header stops fal storing request JSON, which is otherwise kept 30 days (V). Copy each output into your own bucket immediately. Replicate removes API prediction inputs and outputs after 1 hour (V). BFL result URLs expire in about 10 minutes (3P). Recraft URLs last about 24 hours (V).
- **Do not deploy `@fal-ai/server-proxy` as-is.** It forwards any fal endpoint with your key, so a visitor could run expensive video models on your bill. If you use it, allowlist the `x-fal-target-url` header. Better: call fal only from your own route handlers, as below.
- **fal webhook signatures prove the request came from fal, not that it came from your account.** Also check that `X-Fal-Webhook-User-Id` equals your fal user ID and that `request_id` exists in your database.
- **Don't let the model render the pet's name.** Overlay it with code (Satori to SVG paths, then a sharp composite) so fonts are exact and stay on-brand. SVG `<text>` in sharp on serverless can render as boxes because system fonts are missing.
- **Aspect ratio.** Generate masters at the ratio of the product the customer is most likely to buy (default 4:5, covering 8×10, 11×14 and 16×20). If they switch to 2:3 or 3:4, re-generate or outpaint; don't crop the face.
- **Re-generating at higher resolution creates a new image.** Seeds don't make Gemini deterministic. That is why masters are generated at 2K up front. An optional 4K "remaster" pass (§7.3) needs a drift check.
- **Privacy policy.** List Google, fal and Replicate (plus OpenAI and BFL if used) as sub-processors. Gemini paid tier: no training on your data (V).
- **Age clause.** The Gemini API terms require users to be 18+ and forbid apps "directed towards or likely to be accessed by" under-18s (V). Have legal review this; at minimum, set a Terms of Service age requirement for purchasing and accounts.

---

## 5. Exact request and response shapes

### 5.1 fal.ai: Nano Banana 2.1 Edit (primary)

**Endpoint ID:** `google/nano-banana-2.1/edit` (identical schema at `fal-ai/nano-banana-2.1/edit`)

- **Sync (avoid in production):** `POST https://fal.run/google/nano-banana-2.1/edit`
- **Queue (use this):** `POST https://queue.fal.run/google/nano-banana-2.1/edit?fal_webhook=<urlencoded>`
- **Auth:** `Authorization: Key $FAL_KEY`

**Input schema** (from the live OpenAPI, V):

```jsonc
{
  "prompt": "string (required)",
  "image_urls": ["https://..."],          // refs; http(s) or data URI
  "system_prompt": "",                    // sent as Gemini system instruction
  "aspect_ratio": "auto",                 // auto|21:9|16:9|3:2|4:3|5:4|1:1|4:5|3:4|2:3|9:16|4:1|1:4|8:1|1:8
  "resolution": "1K",                     // 1K|2K|4K  (no 0.5K on 2.1)
  "output_format": "png",                 // jpeg|png|webp
  "num_images": 1,                        // 1-4
  "seed": null,
  "safety_tolerance": "4",                // "1" (strict) - "6"
  "thinking_level": "medium",             // minimal|medium|high
  "limit_generations": true,
  "enable_web_search": false,             // +$0.015 if used
  "sync_mode": false,                     // true => data URI, not stored
  "video_url": null, "pdf_url": null
}
```

**Submit response:**

```json
{
  "request_id": "764cabcf-b745-4b3e-ae38-1200304cf45b",
  "response_url": "https://queue.fal.run/google/nano-banana-2.1/requests/764cabcf.../response",
  "status_url":   "https://queue.fal.run/google/nano-banana-2.1/requests/764cabcf.../status",
  "cancel_url":   "https://queue.fal.run/google/nano-banana-2.1/requests/764cabcf.../cancel",
  "queue_position": 0
}
```

Use the returned URLs; don't construct them. For sub-path endpoints like `/edit`, the request URLs live under the app root.

**Status** (`GET status_url?logs=1`): `{"status":"IN_QUEUE","queue_position":2,...}`, then `{"status":"IN_PROGRESS","logs":[...]}`, then `{"status":"COMPLETED","metrics":{...},"response_url":"..."}`.

**Result** (`GET response_url`):

```json
{
  "images": [
    { "url": "https://v3b.fal.media/files/b/.../out.png", "content_type": "image/png",
      "file_name": "out.png", "file_size": 4211876, "width": 1856, "height": 2304 }
  ],
  "description": ""
}
```

**Webhook POST to your URL:**

```json
{ "request_id": "764cabcf-...", "gateway_request_id": "764cabcf-...", "status": "OK",
  "payload": { "images": [ { "url": "https://v3b.fal.media/files/...", "width": 1856, "height": 2304 } ], "description": "" } }
```

On failure, `"status": "ERROR"` arrives with an `error` string. Webhook headers are `X-Fal-Webhook-Request-Id`, `X-Fal-Webhook-User-Id`, `X-Fal-Webhook-Timestamp` and `X-Fal-Webhook-Signature` (hex). To verify:
1. Build the message `request_id \n user_id \n timestamp \n sha256_hex(raw_body)`.
2. Check the timestamp is within ±300 s.
3. Verify the Ed25519 signature against any key in `https://rest.fal.ai/.well-known/jwks.json`. Cache the keys for ≤24 h.

fal may retry deliveries, so dedupe on `request_id` (V).

**Fallback model on fal:** `openai/gpt-image-2.5/flare/edit` takes `prompt`, `image_urls` (≤16), `quality` (auto|low|medium|high|xhigh|max, default **high**), `image_size` (enum or `{width,height}`), `output_format`, `output_compression`, `background`, `mask_url`, `num_images` (1–10). It returns `{ images: [...] }`. It has no `system_prompt` field, so prepend the system text to `prompt`.

### 5.2 Replicate: `google/nano-banana-2.1` (fallback provider)

`POST https://api.replicate.com/v1/models/google/nano-banana-2.1/predictions`

Headers: `Authorization: Bearer $REPLICATE_API_TOKEN`, `Content-Type: application/json`. Optional: `Prefer: wait=60` to hold the request open for up to 60 s, and `Cancel-After: 3m`.

**Input schema** (from the embedded schema, V): `prompt` (required); `image_input` (array, ≤14); `aspect_ratio` (`match_input_image` (default), 1:1, 1:4, 1:8, 2:3, 3:2, 3:4, 4:1, 4:3, **4:5**, 5:4, 8:1, 9:16, 16:9, 21:9); `resolution` (1K|2K|4K, default 1K); `output_format` (jpg|png, default jpg); `google_search`; `image_search`. There is **no system_prompt, seed or safety knob.**

```json
{
  "input": {
    "prompt": "SYSTEM...\n\nSTYLE...",
    "image_input": ["https://your-bucket/signed/photo.jpg"],
    "aspect_ratio": "4:5",
    "resolution": "2K",
    "output_format": "png"
  },
  "webhook": "https://pupprints.com/api/webhooks/replicate",
  "webhook_events_filter": ["completed"]
}
```

**Response (prediction object; the webhook body has the same shape):**

```jsonc
{
  "id": "q6hx1v1q9drma0cm9z8b6m0t4w",
  "model": "google/nano-banana-2.1",
  "version": "…",
  "input": { "...": "..." },
  "logs": "",
  "output": null,                         // on success: "https://replicate.delivery/xezq/.../tmpabc.png" (single URI string)
  "data_removed": false,
  "error": null,
  "status": "starting",                   // starting|processing|succeeded|failed|canceled
  "created_at": "2026-10-12T18:04:11.123Z",
  "started_at": null, "completed_at": null,
  "metrics": {},                          // on success e.g. {"predict_time": 11.8}
  "urls": {
    "get": "https://api.replicate.com/v1/predictions/q6hx...",
    "cancel": "https://api.replicate.com/v1/predictions/q6hx.../cancel",
    "stream": "https://stream.replicate.com/...",
    "web": "https://replicate.com/p/q6hx..."
  }
}
```

**Webhook verification:**
- Headers: `webhook-id`, `webhook-timestamp`, `webhook-signature` (space-separated `v1,<base64>` entries).
- Signed content: `${id}.${timestamp}.${rawBody}`, HMAC-SHA256 with the secret after the `whsec_` prefix.
- Get the secret once via `GET https://api.replicate.com/v1/webhooks/default/secret`, which returns `{"key":"whsec_..."}` (V).
- The `replicate` npm package's `validateWebhook(request, secret)` does all of this.

Other Replicate model IDs worth having:
- `black-forest-labs/flux-2-pro`: `input_images[]`, `resolution` (match_input_image | 0.5–4 MP), `aspect_ratio` (includes 4:5, 3:4, 2:3), `safety_tolerance` 1–5, `output_format` webp|jpg|png.
- `black-forest-labs/flux-kontext-pro`: `input_image`; `safety_tolerance` max is 2 with an image.
- `topazlabs/image-upscale`
- `recraft-ai/recraft-crisp-upscale`
- `nightmareai/real-esrgan`
- `bria/remove-background`

### 5.3 Google direct (cheapest at scale; Interactions API)

```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/interactions" \
  -H "x-goog-api-key: $GEMINI_API_KEY" -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-nano-banana-2.1",
    "input": [
      {"type":"text","text":"<system + style prompt>"},
      {"type":"image","mime_type":"image/jpeg","data":"<BASE64>"}
    ],
    "response_format": {"type":"image","aspect_ratio":"4:5","image_size":"2K"}
  }'
# response: interaction.output_image.data  (base64; last image block). Uppercase K is mandatory ("1k" is rejected).
```

JS SDK: `ai.interactions.create({ model, input, response_format })` with `@google/genai`. Batch tier is 50% off; use it for non-interactive work such as marketing assets and gallery seeding.

---

## 6. Unit economics (AI only; excludes printing and shipping)

| Item | Cost |
|---|---|
| Free gallery: 4 styles × 2K master on fal ($0.059 + ~$0.002 input) | **≈ $0.24** (≈ $0.21 via Replicate or Google) |
| Each extra re-roll | $0.06 |
| Optional "describe dog" vision call + likeness judge | < $0.005 |
| Paid order: Topaz 16×20 (28.8 MP) / 24×36 (≤96 MP) | $0.16 / $0.32. SeedVR2 instead: ≈ $0.03 / $0.08 |
| Background removal (merch) | $0.00–$0.018 |
| **AI cost per order at 3% session→order conversion** | ≈ $0.36 / 0.03 + $0.2 ≈ **$12** |

**Levers:**
- Ask for an email after the first gallery (this also builds the marketing list).
- Turnstile CAPTCHA plus per-IP and per-email caps.
- Dedupe identical uploads by hash.
- 1K previews for the first gallery ($0.04 each), with a 2K master generated only for the style the user picks. Saves about 30%.
- Move high volume to Google direct or Replicate (about 15% cheaper than fal for this model).
- Nano Banana Lite ($0.0336, sub-2 s) for an instant teaser thumbnail while the real 2K renders.

---

## 7. TypeScript reference implementation

Versions at time of writing: `@fal-ai/client@1.10.1`, `replicate@1.4.0`, `sharp@0.35.5`, plus `zod`. Assumes Next.js 15+ App Router. `db` and `storage` are thin interfaces you implement (for example Supabase).

### 7.1 Styles and prompts (`lib/ai/styles.ts`)

```ts
export const IDENTITY_SYSTEM_PROMPT = `You are a master portrait artist painting a commissioned portrait of ONE specific, real dog shown in the reference photo(s). Likeness is the top priority: the owner must instantly recognise their own dog.
Preserve exactly: breed or mix; skull and muzzle shape and length; ear shape, size and carriage (including asymmetry, e.g. one ear up); eye colour, shape and spacing (including heterochromia); nose colour; coat colour, length, texture and curl; and EVERY distinctive marking - blaze, mask, eyebrows, spots, ticking, brindle stripes, merle patches, white chest or paws, grey muzzle, scars - on the correct side of the face.
Do not idealise the dog into a generic breed standard. Do not change its age, weight or proportions. Do not add or remove markings.
Change only what the style instructions ask for (medium, costume, background, lighting). Ignore people, other animals, leashes and harnesses in the reference.
Never render text, letters, numbers, signatures, watermarks, logos or frames. Fill the whole canvas with one finished artwork. Keep the dog's head and chest centred with about 8% empty margin on every side so the image can be framed or cropped.`;

export type StyleId =
  | "royal" | "admiral" | "duchess" | "watercolor" | "lineart"
  | "popart" | "oil" | "charcoal" | "storybook" | "deco" | "floral" | "astronaut";

export interface StyleDef {
  id: StyleId;
  label: string;
  prompt: string;
  defaultAspect: "4:5" | "3:4" | "2:3" | "1:1";
  upscaler: "topaz" | "seedvr" | "esrgan" | "vectorize";
}

const face = "The dog's head, face and fur are painted with portrait-level realism and must match the reference exactly.";

export const STYLES: Record<StyleId, StyleDef> = {
  royal: { id: "royal", label: "The Monarch", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Transform the dog into a regal 17th-century European aristocratic oil portrait. The dog sits upright, chest forward, head turned three-quarters toward the viewer with a dignified expression. Below the neck it wears a crimson velvet royal mantle with a white ermine-fur collar with black tails, a heavy gold chain with a jewelled medallion, over a gold brocade doublet. A small gold crown rests on a tasselled velvet cushion beside it. Background: dark olive-brown studio backdrop, draped burgundy curtain, hint of a marble column. Rembrandt-style chiaroscuro from the upper left. Layered oil glazes, fine fur brushwork, rich umber, crimson and gold palette, museum finish. ${face}` },
  admiral: { id: "admiral", label: "The Admiral", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Paint the dog as an 18th-century naval admiral in a formal oil portrait. Below the neck: navy-blue officer's coat with gold epaulettes, brass buttons, a sky-blue silk sash and two gold medals. Background: stormy sea with a distant tall ship under a dramatic sky. Warm directional light, varnished old-master oil technique. ${face}` },
  duchess: { id: "duchess", label: "The Duchess", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Paint the dog as an elegant Renaissance duchess in an oil portrait. Below the neck: sapphire silk gown, white lace ruff collar, triple-strand pearl necklace; a delicate tiara rests on a velvet cushion beside her. Background: deep green damask wall with soft window light. Soft glazing, porcelain-smooth finish, jewel-tone palette. ${face}` },
  watercolor: { id: "watercolor", label: "Watercolor", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Repaint the dog as a loose, luminous watercolor on cold-press cotton paper. Head-and-shoulders view. Wet-on-wet washes that bleed softly at the edges and fade into untouched white paper; faint graphite under-drawing visible; a few deliberate paint splatters. Palette taken from the dog's real coat colours plus one complementary accent. Plain off-white background. Accurate markings expressed through washes, crisp detail only in the eyes and nose.` },
  lineart: { id: "lineart", label: "Minimal Line", defaultAspect: "4:5", upscaler: "vectorize",
    prompt: `Redraw the dog as a minimalist fine-line ink drawing: confident black lines of uniform weight on a pure white (#FFFFFF) background. No shading, no fill, no grey tones, no texture. Capture the dog's distinctive silhouette, ear carriage, eye shape and markings with as few lines as possible (markings indicated by contour lines only). Head and upper chest, centred.` },
  popart: { id: "popart", label: "Pop Art", defaultAspect: "1:1", upscaler: "esrgan",
    prompt: `Create a 2x2 grid of four identical head-and-shoulders portraits of the dog in 1960s silkscreen pop-art style: flat bold colour fields, high-contrast posterised shadows, visible halftone dots, slight colour misregistration. Each panel uses a different saturated palette (hot pink/yellow, cyan/orange, lime/purple, red/teal). Keep the dog's markings' shapes and positions identical in all four panels.` },
  oil: { id: "oil", label: "Gallery Oil", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Repaint the photo as a contemporary impressionist oil painting with thick impasto and palette-knife strokes. The dog sits in a summer garden; background of loose, out-of-focus flowers and foliage; warm golden-hour backlight creating a rim light on the fur. Vibrant but natural colour. ${face}` },
  charcoal: { id: "charcoal", label: "Charcoal Sketch", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Redraw the dog as a realistic charcoal and graphite portrait on warm cream toned paper. Directional hatching that follows fur growth, deep velvety blacks, white chalk highlights in the eyes and nose. Vignetted, unfinished edges that fade into the paper. Monochrome only.` },
  storybook: { id: "storybook", label: "Storybook", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Reimagine the dog as the hero of a charming 3D-animated family film: stylised but clearly the same dog, with soft subsurface-scattered fur, expressive eyes (keep the real eye colour and shape), and gentle cinematic lighting. Cosy whimsical background: a sunlit cottage garden with bokeh. Keep all real coat colours and markings in the same places.` },
  deco: { id: "deco", label: "Art Deco Poster", defaultAspect: "2:3", upscaler: "esrgan",
    prompt: `Render the dog as the heroic subject of a 1930s Art Deco travel poster: bold geometric shapes, flat gouache texture, crisp edges, limited palette of navy, gold, cream and coral. The dog stands proudly in three-quarter view at the bow of an ocean liner against radiating sunburst rays. Leave the bottom 15% as a plain cream band (no text).` },
  floral: { id: "floral", label: "Golden Age Floral", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Paint the dog in the manner of a Dutch Golden Age floral still life: the dog rests among an abundant arrangement of peonies, garden roses, tulips and trailing greenery on a dark stone ledge, deep near-black background, dramatic soft window light, jewel-like colour and meticulous detail. ${face}` },
  astronaut: { id: "astronaut", label: "Space Explorer", defaultAspect: "4:5", upscaler: "topaz",
    prompt: `Portrait of the dog as a retro-futurist astronaut: below the neck an unbranded white 1960s-style spacesuit with orange accents; the helmet is held under one arm so the dog's whole head is visible. Background: Earth rising over the lunar horizon, stars. Cinematic rim lighting, painterly sci-fi illustration finish. ${face}` },
};

export const REMASTER_PROMPT = `Image 1 is the approved artwork. Re-render image 1 at maximum resolution with IDENTICAL composition, pose, framing, colours, costume, background and brushwork. Do not add, remove or move anything. Use image 2 (the original photo) only to sharpen the accuracy of the dog's fur markings, eye colour and facial structure. Increase fine detail: individual fur strands, fabric weave, paint texture.`;

export function buildStylePrompt(style: StyleDef, opts: { dogDescription?: string; keepCollar?: boolean; petCount?: number }) {
  const parts = [style.prompt];
  if (opts.dogDescription) parts.push(`The dog: ${opts.dogDescription}.`);
  if (opts.keepCollar) parts.push("Keep the dog's own collar exactly as in the photo.");
  if (opts.petCount && opts.petCount > 1)
    parts.push(`Include all ${opts.petCount} pets from the reference images together in one composition, each with its exact individual likeness.`);
  return parts.join("\n");
}
```

Optional pre-step: a cheap vision-LLM call per upload ("Describe this dog's breed or mix, coat colour and pattern, markings with side (left/right), ear carriage, eye colour; ≤40 words") fills `dogDescription`. This "describe, then render" step strengthens identity, and the same description can be reused in marketing copy.

### 7.2 Provider adapters (`lib/ai/providers.ts`)

```ts
import { fal } from "@fal-ai/client";
import Replicate from "replicate";
import { IDENTITY_SYSTEM_PROMPT, STYLES, buildStylePrompt, type StyleId } from "./styles";

fal.config({ credentials: process.env.FAL_KEY! });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });

export const MODELS = {
  falPrimary: "google/nano-banana-2.1/edit",
  falFallback: "openai/gpt-image-2.5/flare/edit",
  replicatePrimary: "google/nano-banana-2.1",
} as const;

export const FAL_PRIVACY_HEADERS = {
  "X-Fal-Object-Lifecycle-Preference": JSON.stringify({ expiration_duration_seconds: 3600 }),
  "X-Fal-Store-IO": "0",
};

export type Aspect = "4:5" | "3:4" | "2:3" | "1:1";
export type Resolution = "1K" | "2K" | "4K";

export interface GenerateJob {
  generationId: string;
  styleId: StyleId;
  photoUrls: string[];            // short-lived signed GET URLs to OUR private bucket
  aspectRatio: Aspect;
  resolution: Resolution;
  dogDescription?: string;
  attempt: number;                // 0 = primary, 1 = model fallback
}

export interface Submission {
  provider: "fal" | "replicate";
  model: string;
  providerRequestId: string;
}

const appUrl = () => process.env.APP_URL!; // e.g. https://pupprints.com

export async function submitFalNanoBanana(job: GenerateJob): Promise<Submission> {
  const style = STYLES[job.styleId];
  const { request_id } = await fal.queue.submit(MODELS.falPrimary, {
    input: {
      prompt: buildStylePrompt(style, { dogDescription: job.dogDescription }),
      system_prompt: IDENTITY_SYSTEM_PROMPT,
      image_urls: job.photoUrls,
      aspect_ratio: job.aspectRatio,
      resolution: job.resolution,
      output_format: "png",
      num_images: 1,
      thinking_level: "medium",
      safety_tolerance: "4",
      limit_generations: true,
    },
    webhookUrl: `${appUrl()}/api/webhooks/fal`,
    headers: FAL_PRIVACY_HEADERS,
    startTimeout: 30, // seconds allowed in queue before fal gives up
  });
  return { provider: "fal", model: MODELS.falPrimary, providerRequestId: request_id };
}

// Non-Google fallback: survives a Google outage or a Gemini safety refusal
const GPT_SIZES: Record<Aspect, { width: number; height: number }> = {
  "4:5": { width: 1632, height: 2048 }, "3:4": { width: 1536, height: 2048 },
  "2:3": { width: 1360, height: 2048 }, "1:1": { width: 2048, height: 2048 },
}; // multiples of 16, <= 2560x1440-equivalent pixel budget (non-experimental)

export async function submitFalGptImage(job: GenerateJob): Promise<Submission> {
  const style = STYLES[job.styleId];
  const { request_id } = await fal.queue.submit(MODELS.falFallback, {
    input: {
      prompt: `${IDENTITY_SYSTEM_PROMPT}\n\n${buildStylePrompt(style, { dogDescription: job.dogDescription })}`,
      image_urls: job.photoUrls,
      image_size: GPT_SIZES[job.aspectRatio],
      quality: "medium",          // ~$0.013-0.02; "high" ~$0.05 for paid remasters
      output_format: "png",
      num_images: 1,
    },
    webhookUrl: `${appUrl()}/api/webhooks/fal`,
    headers: FAL_PRIVACY_HEADERS,
  });
  return { provider: "fal", model: MODELS.falFallback, providerRequestId: request_id };
}

export async function submitReplicateNanoBanana(job: GenerateJob): Promise<Submission> {
  const style = STYLES[job.styleId];
  const prediction = await replicate.predictions.create({
    model: MODELS.replicatePrimary,
    input: {
      prompt: `${IDENTITY_SYSTEM_PROMPT}\n\n${buildStylePrompt(style, { dogDescription: job.dogDescription })}`,
      image_input: job.photoUrls,
      aspect_ratio: job.aspectRatio,
      resolution: job.resolution,
      output_format: "png",
    },
    webhook: `${appUrl()}/api/webhooks/replicate`,
    webhook_events_filter: ["completed"],
  });
  return { provider: "replicate", model: MODELS.replicatePrimary, providerRequestId: prediction.id };
}

/** Provider failover on submit errors (fal down, 5xx, auth/billing issue). */
export async function submitWithFailover(job: GenerateJob): Promise<Submission> {
  if (job.attempt >= 1) return submitFalGptImage(job); // model failover path
  try {
    return await submitFalNanoBanana(job);
  } catch (err) {
    console.warn("[generate] fal submit failed; failing over to Replicate", err);
    return submitReplicateNanoBanana(job);
  }
}
```

Raw-HTTP equivalent of the Replicate call (useful in a background job without the SDK):

```ts
const res = await fetch("https://api.replicate.com/v1/models/google/nano-banana-2.1/predictions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "wait=60",          // block up to 60 s; status may still come back "starting"/"processing"
    "Cancel-After": "3m",
  },
  body: JSON.stringify({ input: { prompt, image_input: [photoUrl], aspect_ratio: "4:5", resolution: "2K", output_format: "png" } }),
});
const prediction = (await res.json()) as { id: string; status: string; output: string | null; error: string | null };
```

### 7.3 Generate route (`app/api/generate/route.ts`)

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { submitWithFailover, type GenerateJob } from "@/lib/ai/providers";
import { STYLES, type StyleId } from "@/lib/ai/styles";
import { db, storage, verifyTurnstile, rateLimit } from "@/lib/server"; // your implementations

export const runtime = "nodejs";
export const maxDuration = 30;

const STYLE_IDS = Object.keys(STYLES) as [StyleId, ...StyleId[]];
const Body = z.object({
  uploadId: z.string().uuid(),
  styles: z.array(z.enum(STYLE_IDS)).min(1).max(4),
  aspectRatio: z.enum(["4:5", "3:4", "2:3", "1:1"]).default("4:5"),
  turnstileToken: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const { uploadId, styles, aspectRatio, turnstileToken } = parsed.data;

  if (!(await verifyTurnstile(turnstileToken, req))) return NextResponse.json({ error: "captcha" }, { status: 403 });
  const rl = await rateLimit(req, { key: uploadId, max: 12, windowSec: 86_400 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const upload = await db.uploads.get(uploadId);
  if (!upload?.normalizedKey) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const photoUrl = await storage.signedGetUrl(upload.normalizedKey, 15 * 60);

  const generations = await Promise.all(
    styles.map(async (styleId) => {
      const gen = await db.generations.create({ uploadId, styleId, aspectRatio, status: "queued", attempt: 0 });
      const job: GenerateJob = {
        generationId: gen.id, styleId, photoUrls: [photoUrl], aspectRatio,
        resolution: "2K", dogDescription: upload.dogDescription ?? undefined, attempt: 0,
      };
      try {
        const sub = await submitWithFailover(job);
        await db.generations.update(gen.id, { ...sub, status: "submitted", submittedAt: new Date() });
      } catch (e) {
        await db.generations.update(gen.id, { status: "failed", error: String(e) });
      }
      return { generationId: gen.id, styleId };
    }),
  );
  return NextResponse.json({ generations }, { status: 202 });
}
```

### 7.4 fal webhook with Ed25519 verification (`app/api/webhooks/fal/route.ts`)

```ts
import crypto from "node:crypto";
import { after } from "next/server";
import { db } from "@/lib/server";
import { finalizePreview, handleGenerationFailure } from "@/lib/images/pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;

type FalJwk = { x: string };
let jwks: { keys: FalJwk[]; at: number } | null = null;

async function falKeys(): Promise<FalJwk[]> {
  if (!jwks || Date.now() - jwks.at > 12 * 3600_000) {
    const r = await fetch("https://rest.fal.ai/.well-known/jwks.json", { cache: "no-store" });
    if (!r.ok) throw new Error(`fal JWKS ${r.status}`);
    jwks = { keys: ((await r.json()) as { keys: FalJwk[] }).keys, at: Date.now() };
  }
  return jwks.keys;
}

async function verifyFal(headers: Headers, raw: Buffer): Promise<boolean> {
  const id = headers.get("x-fal-webhook-request-id");
  const user = headers.get("x-fal-webhook-user-id");
  const ts = headers.get("x-fal-webhook-timestamp");
  const sigHex = headers.get("x-fal-webhook-signature");
  if (!id || !user || !ts || !sigHex) return false;
  if (user !== process.env.FAL_USER_ID) return false;                 // must be OUR account
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;   // replay window
  const msg = Buffer.from([id, user, ts, crypto.createHash("sha256").update(raw).digest("hex")].join("\n"), "utf8");
  const sig = Buffer.from(sigHex, "hex");
  for (const k of await falKeys()) {
    try {
      const key = crypto.createPublicKey({ key: { kty: "OKP", crv: "Ed25519", x: k.x }, format: "jwk" });
      if (crypto.verify(null, msg, key, sig)) return true;
    } catch { /* try next key */ }
  }
  return false;
}

type FalWebhook = {
  request_id: string;
  gateway_request_id?: string;
  status: "OK" | "ERROR";
  payload?: { images?: { url: string; width?: number; height?: number }[] } | null;
  error?: string;
};

export async function POST(req: Request) {
  const raw = Buffer.from(await req.arrayBuffer());
  if (!(await verifyFal(req.headers, raw))) return new Response("invalid signature", { status: 401 });

  const evt = JSON.parse(raw.toString("utf8")) as FalWebhook;
  const gen = await db.generations.findByProviderRequestId("fal", evt.request_id);
  if (!gen || gen.status === "ready") return new Response("ok"); // unknown or duplicate delivery -> ack

  after(async () => {
    const url = evt.payload?.images?.[0]?.url;
    if (evt.status !== "OK" || !url) return handleGenerationFailure(gen, evt.error ?? "no image");
    await finalizePreview(gen, url);
  });
  return new Response("ok"); // ack fast; fal retries non-2xx
}
```

### 7.5 Replicate webhook (`app/api/webhooks/replicate/route.ts`)

```ts
import { after } from "next/server";
import { validateWebhook } from "replicate";
import { db } from "@/lib/server";
import { finalizePreview, handleGenerationFailure } from "@/lib/images/pipeline";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ok = await validateWebhook(req.clone(), process.env.REPLICATE_WEBHOOK_SECRET!); // "whsec_..."
  if (!ok) return new Response("invalid", { status: 401 });

  const p = (await req.json()) as { id: string; status: string; output: string | string[] | null; error: string | null };
  const gen = await db.generations.findByProviderRequestId("replicate", p.id);
  if (!gen || gen.status === "ready") return new Response("ok");

  after(async () => {
    const url = Array.isArray(p.output) ? p.output[0] : p.output;
    if (p.status !== "succeeded" || !url) return handleGenerationFailure(gen, p.error ?? p.status);
    await finalizePreview(gen, url); // output is deleted after ~1 h, so copy now
  });
  return new Response("ok");
}
```

### 7.6 Preview watermarking, failover and print file (`lib/images/pipeline.ts`)

```ts
import sharp from "sharp";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fal } from "@fal-ai/client";
import { db, storage, type Generation } from "@/lib/server";
import { submitWithFailover, FAL_PRIVACY_HEADERS } from "@/lib/ai/providers";
import { STYLES } from "@/lib/ai/styles";

// 512x512 transparent PNG: diagonal "PUP PRINTS · PREVIEW" logo at ~22% opacity.
// Include in the function bundle: next.config.ts -> outputFileTracingIncludes: { "/api/webhooks/**": ["./assets/**"] }
let tile: Buffer | null = null;

export async function makeWatermarkedPreview(master: Buffer, longEdge = 800): Promise<Buffer> {
  tile ??= await readFile(path.join(process.cwd(), "assets/watermark-tile.png"));
  const { data } = await sharp(master)
    .resize({ width: longEdge, height: longEdge, fit: "inside", withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  return sharp(data)
    .composite([{ input: tile, tile: true, blend: "over" }])
    .jpeg({ quality: 72, mozjpeg: true })   // metadata stripped by default
    .toBuffer();
}

export async function finalizePreview(gen: Generation, sourceUrl: string) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`download ${res.status}`);
  const master = Buffer.from(await res.arrayBuffer());
  const meta = await sharp(master).metadata();

  const masterKey = `masters/${gen.id}.png`;
  const previewKey = `previews/${gen.id}.jpg`;
  await storage.putPrivate(masterKey, master, "image/png");
  await storage.putPublic(previewKey, await makeWatermarkedPreview(master), "image/jpeg");
  await db.generations.update(gen.id, {
    status: "ready", masterKey, previewKey, masterWidth: meta.width, masterHeight: meta.height,
  });
}

export async function handleGenerationFailure(gen: Generation, reason: string) {
  if (gen.attempt >= 1) return db.generations.update(gen.id, { status: "failed", error: reason });
  // Model failover (e.g. Gemini safety refusal / Google outage) -> GPT Image 2.5 Flare on fal
  const upload = await db.uploads.get(gen.uploadId);
  const sub = await submitWithFailover({
    generationId: gen.id, styleId: gen.styleId, aspectRatio: gen.aspectRatio, resolution: "2K",
    photoUrls: [await storage.signedGetUrl(upload.normalizedKey, 900)],
    dogDescription: upload.dogDescription ?? undefined, attempt: 1,
  });
  await db.generations.update(gen.id, { ...sub, attempt: 1, status: "submitted", lastError: reason });
}

// ---------- after purchase (run in a durable job, >=3 GB memory for 24x36) ----------
export const PRINT_PX = {
  "8x10": [2400, 3000], "11x14": [3300, 4200], "12x16": [3600, 4800],
  "16x20": [4800, 6000], "18x24": [5400, 7200], "24x36": [7200, 10800],
} as const;
export type PrintSize = keyof typeof PRINT_PX;

export async function buildPrintFile(gen: Generation, size: PrintSize): Promise<string> {
  const [w, h] = PRINT_PX[size];
  const masterUrl = await storage.signedGetUrl(gen.masterKey!, 600);
  const need = Math.max(w / gen.masterWidth!, h / gen.masterHeight!) * 1.02;
  const style = STYLES[gen.styleId];

  let upscaledUrl: string;
  if (style.upscaler === "esrgan") {
    const r = await fal.subscribe("fal-ai/esrgan", {
      input: { image_url: masterUrl, model: "RealESRGAN_x4plus", scale: Math.min(8, Math.ceil(need)), tile: 400, output_format: "png" },
      headers: FAL_PRIVACY_HEADERS,
    });
    upscaledUrl = (r.data as { image: { url: string } }).image.url;
  } else if (style.upscaler === "seedvr") {
    const r = await fal.subscribe("fal-ai/seedvr/upscale/image", {
      input: { image_url: masterUrl, upscale_mode: "factor", upscale_factor: Math.min(10, +need.toFixed(2)), output_format: "png" },
      headers: FAL_PRIVACY_HEADERS,
    });
    upscaledUrl = (r.data as { image: { url: string } }).image.url;
  } else {
    // topaz (default). For "vectorize" styles, run fal-ai/recraft/vectorize and rasterize the SVG with sharp({ density }) instead.
    const r = await fal.subscribe("fal-ai/topaz/upscale/image", {
      input: {
        image_url: masterUrl, model: "High Fidelity V2", upscale_factor: Math.min(4, +need.toFixed(2)),
        face_enhancement: false,          // default is true; human-face tuned
        output_format: "png",
      },
      headers: FAL_PRIVACY_HEADERS,
    });
    upscaledUrl = (r.data as { image: { url: string } }).image.url;
  }

  const big = Buffer.from(await (await fetch(upscaledUrl)).arrayBuffer());
  const print = await sharp(big)
    .resize(w, h, { fit: "cover", position: "centre", kernel: "lanczos3" })
    .toColorspace("srgb")
    .withMetadata({ density: 300 })
    .withIccProfile("srgb")
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toBuffer();

  const key = `prints/${gen.id}-${size}.jpg`;
  await storage.putPrivate(key, print, "image/jpeg");
  return storage.signedGetUrl(key, 7 * 24 * 3600); // hand to POD API / email
}
```

**Optional 4K "remaster" for 24×36 and larger.** Call `google/nano-banana-2.1/edit` with `image_urls: [masterUrl, originalPhotoUrl]`, `resolution: "4K"`, `thinking_level: "high"` and `REMASTER_PROMPT` (about $0.14). Then run a drift check before printing:
1. Downscale both images to 256 px.
2. Compute the mean absolute pixel difference with sharp.
3. If it exceeds about 6%, discard the remaster and print the upscaled 2K master.

---

## 8. Identity quality: evaluation plan before launch

1. **Test set.** 40 real photos covering the hard cases: black dogs (detail loss), white dogs, brindle, merle, heterochromia, one ear up, curly doodles, grey senior muzzles, partial occlusion, bad phone lighting, two-pet photos.
2. **Matrix.** Nano Banana 2.1 vs GPT Image 2.5 Flare and Sunburst vs FLUX 3 vs FLUX.2 [pro] vs Seedream 5 Pro, across the 12 styles above, 1 attempt each, 2K.
3. **Metrics.**
   - Blind owner-style likeness rating (1–5).
   - Art quality (1–5).
   - Failure rate: refusals, extra limbs, markings on the wrong side, generic-breed drift, unrequested text.
   - p50/p95 latency.
   - $/image.
4. **Automated likeness guard** at runtime, for every preview. A cheap vision-LLM judge gets the reference crop and the output with this prompt: "Is this the same individual dog? Score 1–5; list any mismatched markings, ear carriage, eye colour." If the score is below 4, re-roll silently once. Alternative: cosine similarity of DINOv2 embeddings on BiRefNet-segmented crops.
5. **Multi-photo input.** Let users add up to 3 photos of the same dog (Nano Banana 2.1 accepts multiple character refs). Expect a likeness gain; measure it.
6. **Later.** If one house style becomes the bestseller, train a style LoRA on about 30 curated outputs for consistent branding. Paths: Qwen-Image-Edit-2511 (Apache-2.0, `/lora` endpoint on fal) or FLUX.2 [klein] 9B edit LoRA.

---

## 9. Content-policy and compliance checklist

- **Upload flow.** Ask for pet-only photos. Auto-crop to the dog with BiRefNet before generation; this cuts person and child-related refusals on both Gemini and OpenAI. Hold any image flagged by a provider's safety checker; don't retry it on a laxer model.
- **Marketing honesty.** The BFL ToS forbids representing outputs as "entirely human-generated", and FTC rules point the same way. Say "AI-crafted, artist-curated" and do not claim "hand-painted" unless a human actually paints it.
- **Provenance.** Gemini outputs carry SynthID and OpenAI outputs carry C2PA metadata. Neither affects print quality. Disclose AI use in the FAQ.
- **Trademarks and IP in prompts.** Avoid named living artists, studios (Pixar, Ghibli, Disney) and logos (NASA); the templates above are already generic.
- **Age.** The Gemini API terms say 18+ and not directed at minors. Put an 18+ purchase and account requirement in the Terms of Service and have legal review it.
- **Data.** Paid tiers only (Gemini paid tier = no training). fal: `X-Fal-Store-IO: 0` plus 1 h file expiry. Replicate: auto-deletes after 1 h. Delete originals from your bucket after N days unless the user saves them to an account.

---

## 10. Open items to verify with real calls (cannot be confirmed from docs)

- Real p50/p95 latency for Nano Banana 2.1 at 2K on fal vs Replicate vs Google direct.
- Topaz `face_enhancement` on vs off for dog faces, and Topaz HF V2 vs SeedVR2 on fur.
- FLUX 3 Image edit quality on pets; it is too new for independent benchmarks.
- Replicate's `google/nano-banana-2.1` behaviour with `aspect_ratio: "match_input_image"` vs explicit 4:5, and refusal rates for photos that include people.
- Whether your Google, fal and Replicate accounts need rate-limit increases. OpenAI GPT Image 2's default is 20 images/min at the Build tier (V); request higher tiers before any influencer-driven traffic spike.

---

### Sources
- Google Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini image generation docs (models, Interactions API, resolution tables, limitations): https://ai.google.dev/gemini-api/docs/image-generation
- Gemini API terms: https://ai.google.dev/gemini-api/terms
- fal Nano Banana 2.1 Edit: https://fal.ai/models/google/nano-banana-2.1/edit (OpenAPI: https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=google/nano-banana-2.1/edit)
- fal Nano Banana 2 Edit: https://fal.ai/models/fal-ai/nano-banana-2/edit
- fal Nano Banana Pro Edit: https://fal.ai/models/fal-ai/nano-banana-pro/edit/llms.txt
- fal GPT Image 2.5 Sunburst / Flare Edit: https://fal.ai/models/openai/gpt-image-2.5/sunburst/edit and https://fal.ai/models/openai/gpt-image-2.5/flare/edit
- fal FLUX 3 Image Edit: https://fal.ai/models/blackforestlabs/flux-3/edit-image and https://fal.ai/models/fal-ai/flux-3-image/edit/llms.txt
- fal FLUX.2 pro/max/flex edit, Kontext: https://fal.ai/models/fal-ai/flux-2-pro/edit/llms.txt, https://fal.ai/models/fal-ai/flux-2-max/edit/llms.txt, https://fal.ai/models/fal-ai/flux-pro/kontext/llms.txt, https://fal.ai/flux-2
- fal Seedream v5 Pro / Flash / 4.5: https://fal.ai/models/bytedance/seedream/v5/pro/edit/llms.txt, https://fal.ai/models/bytedance/seedream/v5/flash/edit/llms.txt, https://fal.ai/models/fal-ai/bytedance/seedream/v4.5/edit/llms.txt
- fal Qwen: https://fal.ai/models/fal-ai/qwen-image-edit-2511/llms.txt, https://fal.ai/models/alibaba/qwen-image-3/edit/llms.txt
- fal Ideogram: https://fal.ai/models/ideogram/v4.5/edit/llms.txt, https://fal.ai/models/fal-ai/ideogram/character/llms.txt
- fal upscalers: https://fal.ai/models/fal-ai/topaz/upscale/image/llms.txt, https://fal.ai/models/fal-ai/seedvr/upscale/image/llms.txt, https://fal.ai/models/fal-ai/esrgan/llms.txt, https://fal.ai/models/fal-ai/recraft/upscale/crisp/llms.txt, https://fal.ai/models/fal-ai/clarity-upscaler/llms.txt
- fal background removal: https://fal.ai/models/fal-ai/birefnet/v2/llms.txt, https://fal.ai/models/fal-ai/bria/background/remove/llms.txt
- fal docs (queue, webhooks and verification, platform headers, retention, Next.js proxy): https://fal.ai/docs/llms-full.txt, https://fal.ai/docs/examples/integrations/nextjs.md, https://fal.ai/docs/api-reference/client-libraries/javascript/queue.md
- Replicate models and pricing (embedded on model pages): https://replicate.com/google/nano-banana-2.1, https://replicate.com/google/nano-banana-pro, https://replicate.com/black-forest-labs/flux-2-pro, https://replicate.com/black-forest-labs/flux-kontext-pro, https://replicate.com/topazlabs/image-upscale
- Replicate HTTP API: https://replicate.com/docs/reference/http ; webhook verification: https://replicate.com/docs/topics/webhooks/verify-webhook ; JS client README: https://github.com/replicate/replicate-javascript
- OpenAI: https://developers.openai.com/api/docs/pricing, https://developers.openai.com/api/docs/guides/image-generation, https://developers.openai.com/api/docs/models/gpt-image-2
- OpenAI ToU summary (3P): https://conductatlas.com/platform/openai/openai-terms-of-use/user-content-ownership-and-output-rights/ ; C2PA (3P): https://techcrunch.com/2025/04/23/openai-makes-its-upgraded-image-generator-available-to-developers/
- BFL pricing: https://docs.bfl.ai/quick_start/pricing ; BFL ToS: https://bfl.ai/legal/terms-of-service ; BFL integration: https://docs.bfl.ai/api_integration/integration_guidelines
- FLUX 3 release coverage (3P): https://openrouter.ai/black-forest-labs/flux-3-image, https://digg.com/ai/9mex7e8e
- Recraft pricing and upscale limits: https://www.recraft.ai/docs/api-reference/pricing, https://www.recraft.ai/docs/api-reference/tools/upscale
- Stability pricing (3P): https://stability.ai/api-pricing-update-25, https://getpulsesignal.com/changes/stability-ai
- Artificial Analysis editing leaderboard: https://artificialanalysis.ai/image/leaderboard/editing ; Arena changelog: https://arena.ai/company/leaderboard-changelog
- Nano Banana 2.1 vs GPT Image 2.5 (3P): https://www.atlascloud.ai/blog/tips/nano-banana-2.1-vs-gpt-image-2.5 ; Nano Banana 2.1 changes (3P): https://artlist.io/blog/nano-banana-2-1-what-changed/
- Nano Banana 2 latency (3P): https://magichour.ai/blog/nano-banana-2-vs-nano-banana-pro-we-benchmarked-both-on-the-same-5-prompts
- Qwen-Image-Edit-2511 licence: https://huggingface.co/Qwen/Qwen-Image-Edit-2511
- Printful file requirements: https://support.printful.com/hc/en-us/articles/41396495537553 , https://printful.com/create-digital-print-file

Working files (downloaded schemas and docs, not deliverables) are under `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/`.