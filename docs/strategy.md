# Pup Prints Strategy Brief

**As of:** 2026-10-13 (launch week 1 of 13)
**Inputs:** research reports `cp-site`, `cp-reviews`, `competitors`, `ai-tech`, `fulfillment`, `influencers`, `growth` (all in `docs/research/`), plus a read of the current repo at commit `d63a695` (`web/src/lib/catalog.ts`, `lib/env.ts`, `lib/ai/*`, `components/partners/program.ts`, the route tree).
**Status:** the decisions here are final unless §10 lists them as open. Where the reports disagree, this brief picks one answer and says why.

---

## 0. The decision in one paragraph

Pup Prints is a dog-only portrait brand. The line is **"See it now. Give it now. Hang it in days."** A customer uploads one photo and sees their dog in 4 curated styles in about 30 seconds, free and with no card. They can redo or switch styles at no cost and pay only for a portrait they love. Every price includes US shipping and the hi-res file. Each print is checked by a person before production, an "Arrives by" date is shown before payment, and a Gift Reveal link goes out instantly so a gift can be "given" the same day.

Crown & Paw (C&P) charges first, makes customers wait 1–3 days for a proof (or pay $10 to see it sooner), and misses Christmas. Its Trustpilot score is 3.8, it has an F on two BBB profiles, and 55% of its 20 most recent reviews are 1-star. We attack every one of those complaint clusters at once. We launch into the category peak: C&P tells affiliates that mid-Oct to early Dec brings in over 50% of its revenue. The plan has three parts:
- Launch on a tight wall-art catalog at or below C&P's list prices.
- Fund growth from a $11.5K 90-day budget, with creators seeded by **Nov 6**.
- Measure by blended MER and preview-to-purchase rate.

---

## 1. Crown & Paw teardown summary

### 1.1 Snapshot

| Metric | Value | Source / confidence |
|---|---|---|
| Platform | Shopify (likely Plus) behind Cloudflare. Customized Debut 16.6.0 theme by Thatworks Agency, with a Vue cart | Site HTML |
| HQ / founder | 1321 Upland Dr, Unit 4744, Houston TX 77043. Adam Reed. "Since 2019" | Site, TechRound |
| Catalog | **1,963 public products / 30,402 variants / 597 collections** ("Shop All" reports 4,756) | `/products.json` |
| Volume claims | Conflicting: 850,000+ (homepage) vs 650,000 (product pages) vs "over 1 million" (Awin) | Their own pages |
| On-site rating | 4.8 from "58K+" (homepage) or "55k+" (PDP) via Loox, which they control | Site |
| **Trustpilot** | **3.8/5 from 20,195 reviews**: 72% 5★, 10% 1★. **Only 33 reviews in the last 12 months.** 11 of the latest 20 are 1★ | trustpilot.com/review/crownandpaw.com |
| BBB | **F**, not accredited, on two profiles: LA (15 complaints in 3 years) and Houston (7) | bbb.org |
| Traffic / revenue (Aug 2026) | $263.1K/mo, 56.3K sessions, 1,535 transactions, 2.5–3.0% CVR, $150–175 AOV, ~$3M GMV in 2025 | Grips, **low confidence; treat as a floor** |
| Brand demand | US Google searches for "crown and paw" fell **−88%** from 2021 to 2025, while "pet portrait" rose **+69%** and "dog portrait" rose **+32%** | Google Trends (pulled directly) |
| Peers | West & Willow ~$398K/mo, 61K sessions, $250–275 AOV, ~$3.7M in 2025. Cuddle Clones ~$788K/mo | Grips |

### 1.2 Catalog and prices

- **The model is costume templates, not art styles.** Each costume (The General, Admiral, Queen of Roses…) is its own product on canvas, poster, mug, blanket, pillow, phone case and puzzle.
  - Theme tags: Film & TV 615, Renaissance 447, Sports 176, Jobs 175, Christmas 89, and more.
  - **Much of it parodies trademarked IP** (Star Wars, LOTR, Stranger Things, Bridgerton, football clubs). We will not copy this.
- **Flagship Renaissance canvas** (e.g. "The General"), unframed / black-white frame / gold-silver frame:

  | Size | Unframed | Black / white frame | Gold / silver frame |
  |---|---|---|---|
  | Digital | $39.95 | – | – |
  | 8×10 | $69.95 | $129.95 | $149.95 |
  | 12×18 | $89.95 | $149.95 | $169.95 |
  | 16×24 (their stated top seller) | $119.95 | $199.95 | $209.95 |
  | 24×36 | $179.95 | $259.95 | $269.95 |
  | 32×48 | $269.95 | $409.95 | – |

  The most common ladder (218 of 452 canvases) runs $10 lower: $59.95 / $79.95 / $99.95 / $159.95 / $249.95.
- **Modern Pet Portrait (their #1):** 1 pet costs $59.95 unframed / $79.95 framed at 8×10, $69.95 / $99.95 at 12×16, and $79.95 / $149.95 at 18×24. Framed 4-pet 18×24 is $229.95.
- **Gifts:**

  | Product | C&P price |
  |---|---|
  | Mug | $39.95 (11 oz) / $49.95 (15 oz) |
  | Blanket | $69.95 / $89.95 / $109.95 |
  | Pillow | $49.95 / $59.95 / $99.95 |
  | Phone case | $39.95 |
  | Puzzle | $79.95 |
  | Ornament | $15.99–$17.99 |
  | Plush "pet clone" | $199–$349 |
- **Add-ons:**

  | Add-on | Price |
  |---|---|
  | "Preview Your Artwork Sooner" | **$10** |
  | Digital download | **$10** |
  | Certificate of Authenticity | $4.99 |
  | Gift message card | $4.99 |
  | Easel | $6.95 |
  | Acrylic case | $9.95 |
- **Discount posture:**
  - 85% of products (1,678 of 1,963) show a compare-at price, so the "sale" never ends.
  - The homepage "From $39.95" is the **digital download** price.
  - A rolling countdown ("ORDER BY [TIMER] FOR 25% OFF") runs, and has been seen displaying "00:00:00:00".
  - Free-shipping banners for $75 and $100 appear at the same time.

### 1.3 Ordering flow

1. The PDP builder runs **Sizing → Framing → [Background] → Upload (UploadKit; "send photos later" allowed) → Extras**.
2. In the cart, **Onward "Checkout+" is auto-inserted** (`legacyAutoInsertCheckoutPlus: true`, $0.98–$140.30). The customer has to click "continue without Checkout+".
3. Shopify checkout: Shop Pay, PayPal, Apple Pay, Google Pay, Klarna, USDC. **No Afterpay.**
4. **The customer pays before seeing anything.**
   - Photo QC "within 1 hour"; proof in 1–2 days (the FAQ says 2–3), or 24 hours with the $10 queue jump.
   - Only **one** free photo or costume swap; each later change costs $10.
   - **72-hour auto-approve:** silence sends the order to print.
5. Print within 48 hours of approval, then 3–5 working days of US transit. The total is "usually up to 2 weeks." The Christmas guidance is "order by Dec 10," with no guarantee.
6. **The work is template compositing.** Marketing says "Hand-illustrated by real artists," but the FAQ says "We do not paint from scratch. We are a digital design studio." They can't change backgrounds, open closed mouths or colorize black-and-white photos.
7. Apparel uses the Teeinblue personalizer with a **live preview**. The portraits, their core product, have none.

### 1.4 Ranked weaknesses (evidence → our counter)

| # | Weakness | Evidence | Our counter |
|---|---|---|---|
| 1 | Pay first, see the proof days later, or pay $10 to see it sooner | FAQ flow. Reviews cite 13–19-day proof waits. "Should be able to preview before your artists send a draft" (1★, Apr 2026) | Free instant preview before paying |
| 2 | Late or missed holiday delivery (40–50% of negative reviews) | "Why guarantee Christmas delivery only to deliver a week late??" (Dec 2025). "15 weeks after order" | "Arrives by" date per ZIP, real cutoffs, an on-time promise, and the Gift Reveal |
| 3 | Confusion between the digital file and a physical product | The newest 1★ review (Oct 3, 2026): an 8×10 canvas order arrived as a digital file | Physical product is the default; the digital file is included free with prints and shown last |
| 4 | Dark-pattern checkout | Auto-added Checkout+, an unrequested queue-jump charge, a "required tip" (2024), conflicting $75/$100 banners, a broken timer | "No surprise fees. Ever." Nothing pre-checked |
| 5 | No returns, a 24-hour cancellation window, cancellation fees | Refund policy | Love-it guarantee: remake or full refund |
| 6 | Unreachable support | "3 emails. No response" (Nov 2025) | A human replies within 2 hours (8am–10pm ET); proactive status messages |
| 7 | Inconsistent likeness and quality | "Crosseyed," "HORRIBLE proportions," dark canvases. TheVetDesk noted a plastic pane and frame gaps | Likeness-first pipeline, a human check on every print, frame close-ups on PDPs |
| 8 | Contradictory claims and collapsed trust | "Hand-illustrated" vs "do not paint from scratch" vs a hidden "AI-generated" SKU. 650K vs 850K portraits | Radical transparency; reviews collected from order #1 |
| 9 | Clunky UX | Cart can't be edited, selections disappear, pet-count step is confusing | A 3-step mobile flow with an editable cart |
| 10 | Catalog bloat (430+ canvas styles) | Hepper: "search filters could be better" | 12 curated styles; style first, product second |
| 11 | "Silly" brand leaves memorial buyers underserved | Hepper: "sillier than some of the other options." 3 of 6 homepage testimonials are memorial | Dedicated memorial mode |
| 12 | Weak merch quality | Thin blankets, poor socks, "embroidered" shirts arriving screen-printed | Launch with wall art only |

### 1.5 What they do well (we must match)

- Style variety and the gift moment.
- Easy ordering, which is their #2 theme in 5★ reviews.
- Emotional and memorial reactions.
- Klarna.
- A free-mug gift-with-purchase (worth $39.95) as the main popup offer.
- Loox photo reviews.
- Seasonal collections.
- "$250,000+ donated" to shelters.
- Heavy paid-acquisition tooling: Elevar, Triple Whale, Intelligems, and pixels for Meta, TikTok, Pinterest, Snapchat, Reddit, Bing and OpenAI ads.

### 1.6 The threat

C&P is already testing instant AI previews.
- `custom-ai-pet-portrait` was created **Apr 9, 2026**: "Instant Live Previews: See your vision come to life before you commit." Prices: $29 digital, $59 for an 8×10 print, $79 for an 8×10 canvas.
- Two World Cup AI SKUs followed (Jun 15, 2026).
- All three are tagged `SEARCHANISE_IGNORE`, so they look like hidden ad-landing tests.

**The "preview first" window is open but closing.** Our moat therefore also has to rest on likeness, delivery reliability, honesty and the Gift Reveal.

### 1.7 Other competitors (for context)

- **West & Willow:**
  - Prices: 8×10 framed $77 ("was $105"), 12×16 $99, 18×24 $154.
  - Charges **$10 for a preview**, $20 rush and $15 for the digital file. Items are final sale.
  - Trustpilot 3.9 (19.6K reviews, 13% 1★).
  - About 29 active Meta ads, with about 9 new creatives a week.
- **Perkie Prints:** free 4-style preview in under a minute, artist-reviewed, framed $75–$124. This is the closest model to ours, but it is small and not dog-focused.
- **Purr & Mutt:** UK, free instant previews, from about $45. Similarweb's closest audience overlap to C&P.
- **AI-natives** (Gold & Crown, Portrait Union, Pet Canvas, DogArt.ai, MirloPaw at $0.99): instant but digital-first, with weak likeness and weak physical products.
- **ChatGPT / Gemini:** make plain digital pet art essentially free.

So we do not sell the image file. We sell likeness, the object on the wall and the gift.

---

## 2. Positioning and differentiators

**Hero line:** "Your dog, painted like royalty. See it free in 30 seconds."
**Wedge:** "See it now. Give it now. Hang it in days."
**Audience split for Q4:** about 70% gifters, plus self-purchasers and the memorial segment (about 25–35% of demand, all year).

| # | Differentiator | Exact commitment (what we ship) | C&P today |
|---|---|---|---|
| 1 | **Free instant preview before paying** | Upload → **4 styles in ≤30s at p50** (target ≥95% success). No account, no card. | Pay first, proof in 1–3 days, $10 to see it sooner |
| 2 | **Free redos and style switches** | Any style, any time, free. Abuse caps: 12 generations/IP/day for anonymous users (`DAILY_GENERATION_LIMIT_PER_IP`) and 40/day after email capture, plus Turnstile. **Copy never says "unlimited"**; it says "Try every style free. Redo any portrait free." | 1 free swap, then $10 per change |
| 3 | **What you approve is what we print** | The 2K master you approve is the exact file that gets upscaled. A person checks every print within 4 business hours. Orders before 2pm ET go to production the same day. | Proof differs from the product (reviews) |
| 4 | **"Arrives by" before you pay** | ETA computed per ZIP: canvas and framed 5–9 business days, prints 4–8. Real cutoffs: **standard Thu Dec 10, express Dec 15**. | "Usually up to 2 weeks" |
| 5 | **Holiday on-time promise** | Pre-cutoff US orders that arrive after Dec 24 get **25% refunded automatically**, and the Gift Reveal is auto-sent Christmas morning. | None |
| 6 | **Instant Gift Reveal** | A shareable reveal page (`/reveal/[token]`) sent at checkout or scheduled. We sell gifts through **Dec 24**. | None |
| 7 | **Honest, all-in pricing** | Free US shipping on every order. No compare-at prices, no timers, nothing pre-checked, no protection add-ons, no change or cancellation fees. **Hi-res digital file free with every print** ($29 value). | The opposite of each |
| 8 | **Love-it guarantee** | Free remake (any style) or a full refund within 30 days of delivery. Damage reported with a photo within 30 days gets a free reprint. A 3% revenue reserve covers it. | No returns; 48 hours to report damage |
| 9 | **Human support** | A human replies within 2 hours, 8am–10pm ET. Proactive emails and texts: Approved → Printing → Shipped → Out for delivery → Delivered, with a delay notice before the customer has to ask. | 4-day replies, canned answers |
| 10 | **Likeness-first** | Dog-only identity prompt, up to 3 photos, a vision-LLM "same dog?" judge with a silent re-roll below 4/5, and a markings checklist. | Head pasted onto a template |
| 11 | **Curated and dog-only** | 12 styles, no trademarked IP, and a memorial mode that softens copy and email. | 1,963 SKUs, IP parodies |
| 12 | **Honest about how it's made** | FAQ and PDP: "our AI artist, finished and checked by our team." **Never "hand-painted."** Headlines lead with the outcome, not "AI." | Contradictory claims |

**Proof stack** (repeat on the home page, PDP, checkout and every ad end card):
1. See it free before you pay.
2. Free US shipping, and the digital file is included.
3. Love it or we remake or refund it.
4. "Arrives by [date]" shown before you pay.
5. A person checks every print.

---

## 3. Product catalog and price ladder

**Launch with wall art plus two gift add-ons.** The source of truth is `web/src/lib/catalog.ts`. Other merch is deferred because C&P's thin blankets and bad socks are a reputational trap.

All prices include free US shipping. Costs are Printful base price + US flat shipping (first item) + Stripe (2.9% + $0.30) + $1.50 AI. The "Creator order" column assumes 15% off for the buyer and 15% commission on net (our base program).

### 3.1 Launch SKUs

| SKU (`catalog.ts` id) | Size | **Price** | Printful variant | Base + ship | GM $ | **GM %** | Creator order GM % | BFCM −20% GM % | C&P comparable |
|---|---|---|---|---|---|---|---|---|---|
| `poster-8x10` | 8×10 | **$35** | 4463 | 7.03 + 4.99 | 20.16 | 58% | 36% | 48% | $39.95 |
| `poster-12x16` | 12×16 | **$45** | 1349 | 11.11 + 4.99 | 25.79 | 57% | 35% | 47% | $59.95 |
| `poster-18x24` | 18×24 | **$59** | 1 | 13.15 + 4.99 | 37.35 | 63% | 42% | 55% | $59.95 |
| `poster-24x36` | 24×36 | **$79** | 2 | 18.25 + 7.99 | 48.67 | 62% | 40% | 53% | – |
| `framed-8x10` | 8×10 | **$75** | 4651 (black) / 10754 (white) / 15021 (oak) | 20.76 + 10.89 | 39.38 | 52% | 30% | 41% | $79.95 |
| `framed-12x16` (default framed) | 12×16 | **$95** | 1350 / 10751 / 15025 | 32.20 + 10.89 | 47.35 | 50% | 27% | 38% | $99.95 |
| `framed-16x20` | 16×20 | **$119** | 4399 / 10753 / 15029 | 42.61 + 14.49 | 56.65 | 48% | 24% | 35% | – |
| `framed-18x24` | 18×24 | **$129** | 3 / 10749 / 15031 | 46.30 + 14.49 | 62.67 | 49% | 25% | 36% | $149.95 |
| `framed-24x36` | 24×36 | **$199** | 4 / 10750 / 15032 | 75.90 + 31.19 | 84.34 | 42% | 18% | 29% | $184.95 |
| `canvas-8x10` | 8×10 | **$59** | 19293 | 15.81 + 6.79 | 32.89 | 56% | 33% | 45% | $59.95 |
| `canvas-12x16` | 12×16 | **$79** | 5 | 23.41 + 10.39 | 41.11 | 52% | 29% | 41% | $79.95 (12×18) |
| **`canvas-16x20` (hero, default)** | 16×20 | **$99** | 6 | 28.56 + 10.39 | **55.38** | **56%** | 34% | 46% | $99.95 (16×24) |
| `canvas-18x24` | 18×24 | **$115** | 7 | 33.66 + 10.39 | 65.81 | 57% | 35% | 47% | – |
| `canvas-24x36` | 24×36 | **$149** | 825 | 52.02 + 10.39 | 80.47 | 54% | 31% | 43% | $159.95 |
| `digital-hires` | file | **$29** (free with any physical piece) | – | 0 | 26.36 | 91% | 75% | 89% | $39.95, or a $10 add-on |

### 3.2 Add-ons, bundles and rules

| Item | Price | GM % | Rule |
|---|---|---|---|
| `addon-ornament` (3" ceramic, 2-sided, variant 23133) | **$19** | 51% (best case) | Order bump only, never pre-checked |
| `addon-mug` (11 oz, variant 1320) | **$25** | 58% (best case) | Order bump only |
| Extra pet in one portrait | **+$15** | ~95% | Nano Banana 2.1 holds up to 4 characters. **Not yet in `catalog.ts`; add it.** |
| **Gift Set:** 16×20 canvas + mug + ornament | **$139** | **55%** (49% if items ship from separate facilities) | **Decision: $139, not $149.** The parts cost $143 bought separately, so $149 was dishonest. |
| Standalone ornament | **$24** | 33% | Live **Nov 1 – Dec 15** only. It exists for the "custom dog ornament" SEO page (590 → 8.1K searches/mo). **Excluded from creator codes** (7% margin with a code). |
| Gift message / gift receipt | Free | – | Via Printful's `gift` field |
| Canada shipping | $9.95 flat | – | As in `catalog.ts`. Other countries come later via Prodigi. |

**Badges:** the canvas currently says "Most popular" and the framed print "Most gifted." With zero orders, both are fabricated claims. Use **"Our pick"** for the 16×20 canvas and **"Great for gifting"** for the framed print until real sales data (≥100 orders) supports the original wording.

**Promotion rules:**
1. Sitewide promotions are capped at **20%** and only for dated events: Founding 100 (15%, real counter), BFCM Nov 27–30 (20%).
2. **Codes never stack** with sitewide events; the customer gets the better of the two.
3. In December and around Valentine's, prefer a gift-with-purchase (free ornament with a canvas) over deeper discounts.

**Economics:**
- **Blended gross margin:** ~53% on the planned mix (35% canvas, 25% framed print, 15% framed canvas-equivalent, 10% poster, 15% gifts). After a 3% remake reserve and the AI true-up below, plan on **~50% contribution before marketing**.
- **Break-even:** at $110 AOV, first-order CAC ≈ **$55** and ROAS ≈ **1.9–2.0**. During BFCM, break-even ROAS rises to 2.2–2.4.
- **AI cost true-up (conflict resolved):**
  - `fulfillment` assumed $1.50 AI per order at 20% uploader→purchase.
  - `growth` says to plan on 10% for cold traffic, and 6–8% in the first weeks.
  - At ~$0.36 per uploader (a 4-style 2K gallery on fal at $0.24, plus re-rolls), real AI cost is **$3.60–$6.00 per order**, which takes 2–4 points off GM.
  - **Target ≤$3/order by W8**, through email capture before galleries beyond the first, upload-hash dedupe, and moving volume to Replicate or Google direct (about 15% cheaper).
  - We will not drop to 1K previews: a later 2K re-render creates a different image and breaks the "what you approve is what we print" promise.

**Deferred to Q1 2027, each after physical sample QC:**
- Framed canvas: $99 / $129 / $159 / $179 / $239, 48–57% GM.
- A Prodigi "Heirloom" Hahnemühle giclée tier.
- Blankets: $65 / $85 / $109.
- Tough phone case: $45.
- At 200+ canvas orders a month, move canvas to Lumaprints: 16×20 at $25.95 vs $28.56; 24×36 framed canvas at $80.07 vs $99.96.

---

## 4. Style catalog (12 launch styles)

The full prompts live in `catalog.ts` (`STYLES`). Every prompt gets the identity block appended:

> "Preserve its exact breed, face shape, eye color, ear shape, fur color, markings and proportions… no text, no letters, no signature, no watermark, no frame."

Upgrade it with the stronger `IDENTITY_SYSTEM_PROMPT` from `ai-tech` §7.1 (sent as `system_prompt` on fal), which covers:
- markings on the correct side of the face;
- asymmetric ears and heterochromia;
- no breed-standard idealizing;
- ignoring people, leashes and harnesses;
- an 8% margin.

| # | Slug / name | Good for | Prompt seed | Upscaler |
|---|---|---|---|---|
| 1 | `royal` **The Royal** | gift, funny, decor | 17th-c. Dutch/Flemish court oil portrait; crimson velvet robe with ermine trim, gold chain with jeweled medallion, small jeweled crown; dark umber ground, candlelit chiaroscuro | Topaz HF V2 |
| 2 | `admiral` **The Admiral** | gift, funny, decor | 18th-c. naval admiral oil portrait; navy dress coat, gold epaulettes and buttons, medals; stormy sea with a tall ship; warm varnish | Topaz |
| 3 | `oil-classic` **Old Master** | memorial, decor, gift | No costume; timeless oil with Rembrandt lighting, olive/umber ground, subtle glazing, visible brushwork | Topaz |
| 4 | `watercolor` **Watercolor** | memorial, gift, decor | Loose luminous watercolor on cold-press paper; translucent washes, blooms, lots of white space, crisp eyes and nose | Topaz |
| 5 | `fine-line` **Fine Line** | decor, memorial | Minimalist continuous black ink line on warm off-white; no fill, Scandinavian print aesthetic | Recraft vectorize → rasterize at print DPI |
| 6 | `pop-art` **Pop Art** | funny, decor, gift | 1960s screen print; flat saturated hot pink/yellow/cyan/orange, thick outlines, Ben-Day dots | Real-ESRGAN |
| 7 | `storybook` **Storybook** | gift, decor (kids, nursery) | Gouache and colored-pencil picture-book illustration; warm palette, meadow with wildflowers | Topaz |
| 8 | `botanical` **Botanical** | memorial, gift, decor | Vintage naturalist plate; wreath of wildflowers, roses, eucalyptus and ferns on cream parchment | Topaz |
| 9 | `astronaut` **Space Cadet** | funny, gift | Retro-futurist astronaut; white/orange 1960s suit, **unbranded, no agency logos or patches with text**, helmet open or under the arm, starfield and ringed planet | Topaz |
| 10 | `charcoal` **Charcoal Study** | memorial, decor | Charcoal and graphite on toned cream paper; rich blacks, hatching along fur growth, chalk highlights in eyes, edges fading out | Topaz |
| 11 | `mid-century` **Mid-Century** | decor, gift | Flat geometric 1960s poster; mustard, burnt orange, teal and cream; risograph texture | Real-ESRGAN |
| 12 | `holiday` **Holiday Cozy** (seasonal, Nov 1 – Dec 31) | holiday, gift | Warm holiday oil; red/green knit scarf, glowing fireplace, string lights, garland, bokeh | Topaz |

**First-gallery sets** (4 styles generated on upload, chosen by entry point):

| Entry point | Styles |
|---|---|
| Default / gift | Royal, Admiral, Old Master, Watercolor |
| Memorial toggle | Watercolor, Botanical, Old Master, Charcoal |
| Holiday (Nov 1 – Dec 25) | Holiday Cozy, Royal, Watercolor, Admiral |
| Creator / funny landing pages | Royal, Admiral, Space Cadet, Pop Art |
| Decor | Fine Line, Mid-Century, Old Master, Charcoal |

**Style rules:**
- No named living artists, studios (Pixar, Ghibli, Disney), franchises or logos.
- The model never renders text. Pet names are overlaid in code (Satori → SVG paths → sharp composite).
- Copy audit: remove the unsupported claims in the descriptions:
  - Royal: "Our best-selling style for a reason."
  - Botanical: "Our most-requested style for remembering a best friend."
  - Holiday: "everyone asks about."
- **Q1 rotation candidates** (prompts already drafted in `ai-tech` §7.1): The Duchess (Valentine's and Mother's Day), Golden Age Floral, Art Deco Poster. Retire the weakest launch style based on preview→purchase data at W12.

---

## 5. Tech architecture decisions

| Layer | **Decision** | Fallback / later | Notes |
|---|---|---|---|
| App / hosting | **Next.js 16.4 App Router on Vercel**; `runtime = "nodejs"` for sharp and Stripe; `maxDuration = 60` on AI routes | – | Already scaffolded. Performance budget: LCP < 2.5s on 4G, minimal client JS. C&P ships 1–2 MB of HTML. |
| Database and storage | **Supabase** (project `zygdrgljhfuhrmfgbnkj`). Server-only access with the `x-pp-server-key` RLS pattern. Private buckets for uploads, masters and print files; public CDN bucket for watermarked previews | – | Tables: uploads, generations, orders, leads, partners, referral_events, contact_messages, gifts. Delete original photos after 30 days unless the user saves them. |
| AI: primary | **Nano Banana 2.1 on fal**, `google/nano-banana-2.1/edit`. #4 on Artificial Analysis editing (Elo 1140) at about 1/6 the price of the two GPT Image 2.5 "max" models above it. fal 2K = $0.059 | – | Supports `system_prompt`, `seed`, `safety_tolerance`, `thinking_level: medium` |
| AI: provider fallback | **Replicate** `google/nano-banana-2.1` (2K $0.0504) | – | Same model. Replicate auto-deletes prediction data after 1 hour. |
| AI: model fallback | **GPT Image 2.5 Flare on fal**, `openai/gpt-image-2.5/flare/edit` (~$0.013 at medium) | Google direct `gemini-nano-banana-2.1`; OpenAI direct | Survives a Google outage or safety refusal. `AI_PROVIDER_ORDER=fal,replicate,fal-gpt,gemini,openai` (already the repo default). |
| AI: batch | **Google direct (Interactions API), batch tier at 50% off** | – | For SEO breed × style sample images and ad creative |
| Masters | **3:4 at 2K (1792×2400)**, the repo default. 3:4 sits between 4:5 (8×10, 16×20) and 2:3 (24×36), so each product crops at most ~11% inside the 8% safe margin | 4K remaster + drift check (>6% mean pixel diff → discard) for 24×36 only, if quality demands | Previews: 800px watermarked JPEG. Masters never leave private storage. |
| Likeness guard | **Vision-LLM judge on every preview** ("same individual dog? 1–5"). Silent re-roll once below 4. Optional "describe the dog" pre-step | DINOv2 embedding similarity | **Gate before scaling paid traffic:** 40-photo eval set (black, white, brindle, merle, heterochromia, one ear up, doodles, grey muzzles, two-dog photos) |
| Print upscale | **Topaz HF V2** `fal-ai/topaz/upscale/image` with `face_enhancement: false` (it defaults to true and is tuned for human faces). Cost: ≤24 MP $0.08, ≤48 MP $0.16, ≤96 MP $0.32 | SeedVR2 (`fal-ai/seedvr/upscale/image`, $0.001/MP) as an A/B; Real-ESRGAN for flat styles; Recraft vectorize for Fine Line | Output: sRGB JPEG q95, 4:4:4, 300 DPI, exact Printful print-file pixel sizes. 24×36 reaches ~267 DPI because Topaz caps at 4×. |
| Background removal | **BiRefNet v2** (Matting or Heavy at 2048) to crop to the dog before generating | Bria RMBG 2.0 ($0.018) | Cuts refusals on photos with people and children and improves likeness |
| Fulfillment | **Printful API v1.** Set `FULFILLMENT_PROVIDER=printful`; the repo default is `manual`. `external_id` makes orders idempotent; `/orders/estimate-costs` acts as a margin guard; webhook secret in the URL path, and we re-fetch the order before acting | **Prodigi** (real sandbox; env keys already exist) wired as a **hot standby by Nov 15** for Q4 capacity; **Lumaprints** for canvas at 200+/mo | Not used: Printify, Gooten, WHCC, CloudPrinter, Gelato. Test with free draft orders. |
| Payments | **Stripe Checkout.** Apple Pay, Google Pay and Link; Klarna (5.99% + $0.30) shown on orders ≥ $100; Afterpay if Stripe enables it for the account. Promotion codes for creators; referral stored in session metadata / `client_reference_id` | – | Webhook `checkout.session.completed` → durable job → upscale → Printful order |
| Sales tax | **Stripe Tax**, registered in the home state at launch | – | See §10 |
| Email | **Resend** for transactional email and the in-house lifecycle cron (`/api/cron/lifecycle`: abandoned preview, Gift Reveal, nurture; built) | **Klaviyo**: account opened in **W1** only to start SMS toll-free verification; campaigns and SMS move there at the W5 review if the list is ≥1,000 | CAN-SPAM footer; one-click unsubscribe exists |
| Analytics | Vercel Analytics + Speed Insights; GA4; **Meta Pixel + Conversions API** (deduplicated with `event_id`); TikTok and Pinterest tags; first-party funnel events via `/api/track`; post-purchase "How did you hear about us?" survey | – | Custom events `PreviewGenerated` and `PreviewLead` |
| Abuse and cost control | Cloudflare **Turnstile**; per-IP and per-email caps; upload-hash dedupe; fal privacy headers (`X-Fal-Store-IO: 0`, 1-hour object expiry). **Never deploy `@fal-ai/server-proxy`.** | – | Verify fal webhooks with Ed25519 and **check `X-Fal-Webhook-User-Id`**; Replicate webhooks with HMAC |
| Affiliates | **In-house** `partners` + `referral_events` (built: admin CRUD, CSV import, gifting, partner stats page). Stripe promo codes. Change the `pp_ref` attribution window from **30 to 60 days** | Rewardful Growth ($99/mo) once there are more than 30 active partners | See §8 |
| Reviews | Trustpilot automatic invites (free tier) and **Google Customer Reviews**; on-site reviews come only from real orders | – | Never incentivized, never gated |
| Merchant feed | `/feeds/google.xml` (built) → Merchant Center free listings + Shopping | – | – |

**Gaps found in the repo (commit `d63a695`), launch-blocking:**
- `/order/success` is the Stripe `success_url` target but has no page.
- `/reveal/[token]` is built by `lib/orders.ts` but has no page.
- Extra-pet pricing is missing from `catalog.ts`.
- Unsupported badges and claims in `catalog.ts` (see §3 and §4).

---

## 6. Site map and conversion funnel

### 6.1 Funnel

```
Ad / creator / SEO / referral
  → Landing (upload CTA above the fold)
  → Upload (camera roll; photo tips; optional up to 3 photos; memorial toggle)
  → Generating (≤30s p50: real samples, honest progress steps, photo tips)
  → Gallery of 4 styles (1st shown instantly) → "Email me my portraits" (unlocks save + more styles + room mockups)
  → Pick a style → Configure (product / size / frame shown in a room mockup; "Arrives by [date]"; all-in price)
  → Bumps (ornament $19, mug $25, extra pet +$15, gift message; never pre-checked)
  → Stripe Checkout (express pay; BNPL ≥ $100)
  → /order/success (Gift Reveal link + digital file now + survey + Google Customer Reviews opt-in + optional one-click upsell)
  → Status emails and SMS → Delivered + 3 days: review and UGC request → + 7 days: Give $15 / Get $15 → + 21 days: cross-sell
```

| Step | Target (W2–5 → W6–10) |
|---|---|
| Landing → starts upload | 25% → 35% |
| Upload → preview delivered | ≥95%, p50 < 30s |
| Preview → email captured | ≥50% (generic popups average 4.82%) |
| Preview → checkout start | 15% → 22% |
| Checkout start → purchase | ≥50% |
| Upload → purchase within 7 days, including flows | 6–8% → 10–12% |
| Site CVR | 1.3% → 2.2% (benchmarks: gifts 3.13–3.38%, C&P 2.5–3.0%, Meta-driven traffic 1.57%) |

### 6.2 Pages and their jobs

| Route | Job | Primary CTA / must-haves | Status |
|---|---|---|---|
| `/` | Turn a scroll into an upload | Upload button is the hero; "Canvas from $59 · Prints from $35 · Free US shipping"; before/after strip (team dogs labeled samples); 5-promise trust row; empty-state reviews block; "Arrives by" banner through Dec 15 | Exists |
| `/create` | The whole conversion engine | Upload → gallery → email → configure → bumps → checkout; memorial toggle; "Ask friends to vote" share link with an OG image; marketing-use opt-in **unchecked by default** | Exists |
| `/styles`, `/styles/[slug]` | Style SEO and choosing a style | "See your dog in [style] free"; sample grid by breed | Exists |
| `/shop`, `/shop/[type]` | Product details and price transparency | Size ladder ($79 → **$99** → $115, "+$16 for 44% more canvas"); frame close-ups; materials | Exists |
| `/gifts`, `/gifts/[occasion]` | Occasion landing pages (Christmas, memorial and sympathy, dog mom, dog dad, new puppy, last-minute) | Occasion-specific first gallery; Gift Reveal explained | Exists. Map the SEO URLs below onto it. |
| `/gift-cards` | Gifts for people who don't have the dog's photo | Recipient picks the photo and style later | Exists |
| `/how-it-works` | Remove doubt | 3 steps, the honest AI-plus-human process, timeline | Exists |
| `/guarantee` | Make risk feel like zero | Remake or refund terms in plain words; holiday on-time promise | Exists |
| `/shipping` | Holiday trust | Cutoff table (Dec 10 standard / Dec 15 express / Gift Reveal through Dec 24); production + transit | Exists |
| `/faq` | Handle objections, including the AI disclosure | "Our AI artist, finished and checked by our team"; photo tips; 18+ purchase requirement | Exists |
| `/about` | Founder and brand trust; shelter program | Real story, no inflated counters | Exists |
| `/contact` | Support promise | Reply within 2 hours, 8am–10pm ET | Exists |
| `/partners`, `/partners/stats` | Creator recruiting and self-serve stats | Terms, FTC disclosure rules, apply form | Exists |
| `/privacy`, `/terms` | Legal | Sub-processors (Google, fal, Replicate, OpenAI, Printful, Stripe, Supabase, Resend); photo retention; 18+ purchase | Exists |
| **`/order/success`** | Deliver the instant win | Gift Reveal link, digital download, ETA, survey, review opt-in | **Build** |
| **`/reveal/[token]`** | Gift moment and viral loop | Animated reveal → "Make one of your dog, free preview" + give-get code | **Build** |
| `/order/[id]` (or a status section on success) | Prevent "is this a scam?" | Approved → Printing → Shipped → Out for delivery → Delivered | **Build** (timeline component exists) |
| SEO P1 landing pages | Capture search intent | `/custom-dog-portrait`, `/pet-portrait`, `/pet-portrait-from-photo`, `/dog-memorial-gifts`, `/pet-sympathy-gifts`, `/gifts-for-dog-lovers`, `/custom-dog-ornament`, `/ai-dog-portrait` (KD 27, easiest win), `/christmas-gifts-for-dog-owners`, `/dog-mom-gifts`, `/last-minute-dog-lover-gifts`; then `/breeds/[breed]` (top 16, each with unique sample portraits and copy) | **Build** (W2–W8) |
| `/blog/*` | Long-tail search and getting cited in AI answers | Photo tips (P1, W2), gift guide, memorial pillar (link to the Rainbow Bridge poem, don't republish it), honest "AI vs hand-painted" comparison | Build |
| `/admin/*` | Operations | Orders, fulfillment, generations, leads, partners, gifts, messages | Exists |
| `/feeds/google.xml` | Merchant Center | Product feed with lifestyle images | Exists |

---

## 7. Brand voice and visual direction

### 7.1 Voice

The voice is **warm, witty, plain-spoken and confident.** The dog is the hero, the customer is the gift-giver, and we are the trustworthy studio. Sentences are short. Humor lives in style names and costume copy; trust lives in plain promises.

| Do | Don't |
|---|---|
| Lead with the outcome: "Your dog, painted like royalty." | Lead with "AI-generated" in headlines or ads |
| State real promises: "Love it or we'll remake or refund it." | "Hand-painted," "hand-illustrated," "our artists painted" |
| Use real dates: "Order by Thu Dec 10 for Christmas." | Countdown timers, "only 2 left," "ends tonight" (unless a real dated event ends tonight), permanent sales |
| Say "typical portrait shops" for comparisons | Competitor names in UI or ads |
| Disclose AI honestly in the FAQ and PDP: "our AI artist, finished and checked by our team" | "Best-selling," "most popular," "#1," "as seen on," customer counts, until real data exists |
| Use a gentle, unhurried memorial tone ("For the one who still deserves a spot on the wall.") | Urgency or jokes anywhere in memorial flows |

**Copy bank:**
- **Hero:** "Your dog, painted like royalty. See it free in 30 seconds."
- **Sub-line:** "Upload a photo, try every style free, and only pay for the one you love."
- **Gift:** "The gift that gets the gasp."
- **Self-purchase:** "Finally, art worthy of them."
- **December:** "Forgot a gift? Give the portrait tonight. The canvas arrives after."
- **Price card:** "$99. Free shipping. Digital file included. Love it or it's free."

### 7.2 Visual direction

- **Mood:** a calm, warm, editorial gallery. Generous whitespace, big serif headlines, a cream paper background and a subtle `.grain` texture.
- **Type:** Fraunces (`font-display`) for headings, Inter (`font-sans`) for UI.
- **Color tokens:** `bg-paper` / `bg-paper-2`, `text-ink` / `-2` / `-3`, `bg-clay` (CTA only), `bg-butter`, `bg-sage`, `bg-moss`, `bg-blush`. Each style card uses its `swatch`. Contrast must meet 4.5:1.
- **Portraits always appear in realistic frames or room mockups:** `.frame-black`, `.frame-white`, `.frame-wood`, `.frame-gold`, `.mat`, `.canvas-wrap`, and `shadow-frame`. Show **frame and canvas close-ups** to answer the "plastic pane, gapped corners" critique.
- **Imagery:**
  - Real team and friends' dogs across 12+ breeds, labeled "sample."
  - Customer dogs only with the explicit, unchecked-by-default opt-in.
  - No stock "happy family" photos.
- **Mobile first** (most traffic comes from Instagram and TikTok). Motion (`motion/react`) only for the reveal moment.
- **Social and ads:**
  - 9:16 video, captions always on, hook within 1.5 seconds.
  - End card shows the proof stack plus "See yours free."
  - Statics in 4:5, one dog shown in six styles.

---

## 8. Influencer program design

### 8.1 Why we can win creators

- C&P's affiliate program runs on Awin with a 60-day cookie and an **unpublished commission**.
- It bans brand-name bidding, and its GRIN page shows **"No active partnerships."**
- Its creator brief says "pen and tablet, no AI or filters," so expect an anti-AI counter-message.
- Our instant preview gives creators content C&P can't offer: **trying every style on their dog live on camera**.

### 8.2 Terms (decision)

| Term | Decision | Rationale and margin check |
|---|---|---|
| Base commission | **15% of net** (repo default `PROGRAM.commissionRate = 0.15`) | Hero canvas creator order: 34% GM. Category norms are 8–15% (Memorialize Art 10/15, Photo2Painting 8, Nexbie 15). |
| Founding Partner rate | **20%** for the first 25 creators who post by **Dec 8**, and for anyone above **$1,500** attributed net sales in a quarter | Hero canvas creator order at 20%: 29% GM. Paid only on proven volume. |
| Audience discount | **15%** code (`BELLA15`-style; `generatePartnerCode` exists) | Codes exclude the standalone ornament and **don't stack** with BFCM 20% |
| Cookie / attribution | **60 days** first-touch (change `attributionDays` from 30); code use always wins | Matches C&P's Awin terms |
| Payout | Commission locks **30 days after delivery** (guarantee window); paid monthly on the 15th via PayPal or Wise; **W-9 required**; 1099-NEC above **$2,000** (2026 threshold) | Faster than Awin's network cycle |
| Gifted portrait | Free 16×20 canvas or 12×16 framed print (COGS ~$40–45), plus the digital file and a Gift Reveal | The portrait itself is the content |

### 8.3 Tiers

| Tier | Followers | Offer | Cash | Deliverables | Usage rights | 90-day target |
|---|---|---|---|---|---|---|
| **Community** (open signup, customers, groomers, vets, trainers, daycares) | Any | 15% commission, 15% code; QR cards for local businesses | $0 | None required | – | 50+ approved |
| **Nano** | 1–10K | Gifted portrait, no posting obligation; code | $0 | Organic, if they love it | Ask for a repost license | 15 seeded |
| **Micro** | 10–100K | Gift + code; hybrid fee for the best fits | $0 gift-only, or **$150–500** for 1 TikTok or Reel (benchmark $250–800 for US IG micro) | Live preview on camera → reveal or unboxing | **60 days** of partnership-ad rights in the fee | 20 seeded, 3–5 paid |
| **Mid** | 100–500K | Gift + 20% Founding rate + flat fee | **$1,000–3,000** package (benchmark $1,200–10,000 per Reel) | TikTok + Reel + Story | 60–90 days whitelisting (+50–100% of base per market rates) | 3–5 |
| **Macro** | 500K+ | Charity or rev-share structures first; paid only on the stretch trigger | **$0 in the base budget.** Up to $5K each only if blended CAC ≤ $35 by Nov 20 | Negotiated through the manager | Required | 1–2 |

**Charity structures that lower fees and give a better story:**
- WeRateDogs: 15/10 Foundation donation per order.
- Rocky Kanaka: "first portrait in their forever home."
- Whitney's Dogs / Hearts & Bones Rescue: adoption-day portraits.
- AGuyandAGolden: "Shelter Dog Saturday."
- Plus our Giving Tuesday (Dec 1) shelter program.

### 8.4 Wave-1 targets

Source: the 67 verified accounts in `scratchpad/influencers_seed.csv` (35 with public business emails), imported via `/admin/partners/import`.

**Mid and micro, pitch now:**

| Handle | Why |
|---|---|
| @booplethesnoot | Home decor; Partnerships@booplethesnoot.com |
| @thatgoldendog | Dog photographer; info@thatgoldendog.com |
| @tstarch | Four dogs, so multi-pet AOV; IG 94% US |
| @whitneysdogs | IG 92% US; foster and rescue |
| @willys360world | IG 3.7% engagement |
| @dognamedstella | Already uses affiliate links |
| @novathegoldengal | IG 6.9% engagement |
| @polothepittie | Bully-breed audience |
| @reggie_my_wedgie | IG 21.9% engagement |
| @belleandmurphy | IG 17.8% engagement |
| @hergentlegiants | IG 16.5% engagement |
| @littlecooperbear, @jerrybichon, @mooseandpoppy, @atlasgolden, @goldengirlpacha, @noatherescuedoodle, @chaoswithkoda, @itskevintheberner, @titotherescue | Wave-1 micro and mid fits |
| @kumapupper, @styledwithpaws | Nano |

**Macro conversations, through managers:**

| Creator(s) | Contact | Angle |
|---|---|---|
| @aguyandagolden + @adventuringwithnala + @adventuringwitharchie_ | MATL Entertainment (one deal) | Shelter Dog Saturday tie-in |
| @whataboutbunny | bunny@select.co | Talking-button reaction |
| @dougthepug | info@dougthepug.com | Costume styles, no trademarked characters |
| @hammyandolivia | – | Already runs a pet-brand affiliate code |
| @weratedogs | – | Charity angle |

**Do not pitch:**
- @tuckerbudzyn: Tucker died 2026-09-02.
- @monienature: on hold after a loss in June 2026.
- Manny the Frenchie: died 2023.
- Jiffpom: account status unverified.
- @cartithefrenchy: minor-run account, excluded.

**Handle with care** (opt-in, gentle briefs only): @wolfgang2242, @ambertheseniorrescuedchi, @the_doggie_days, @booplethesnoot (pregnancy-after-loss mention).

**Kids on camera** (@minidoodlebentley): check the Illinois, California (AB 1880) and Minnesota rules. Never contract minors.

### 8.5 Content brief (3 beats)

1. **Live preview on camera:** "I uploaded one photo of my dog and…" Screen-record the 30-second reveal of 4 styles and react.
2. **Reveal or unboxing** when the canvas arrives, or the "dog meets portrait" sniff test.
3. **Call to action:** "See yours free. Code [CODE] for 15% off."

Rules for every brief:
- **#ad / "Paid partnership with Pup Prints"** (or "Gifted by Pup Prints" when product is the only compensation) **inside the content itself**, spoken and on screen. Platform labels alone are not enough.
- Turn on TikTok's AI-generated content (AIGC) label when the generation step is shown.
- Never "hand-painted."
- No trademarked characters.
- No guaranteed-positive language.
- No cold memorial pitches, and no "make them cry" hooks.

### 8.6 Pipeline and timing

| Stage | Target | By |
|---|---|---|
| Accounts contacted | 200 | Nov 1 |
| Replies | ~60 | Nov 3 |
| **Partnerships secured** (terms accepted + code issued + gift shipped) | **40** | **Nov 6** |
| Posts live | 25+ | Nov 16 – Dec 8 |
| Partnership or whitelisted ads | 5 | From W5 (Nov 9) |
| Creator-attributed share of orders (codes + links + survey) | 10–15% | Peak weeks |

### 8.7 Tooling

- **Use:**
  - In-house partners system with Stripe promo codes ($0).
  - **Modash Essentials** at $199/mo for 1–2 months (150 email unlocks, month-to-month) for nano and micro discovery.
  - **Collabstr** to buy UGC fast (10% brand fee).
  - **TikTok One** for Spark Ads codes.
- **Add later:** Rewardful Growth ($99/mo, $15K/mo affiliate-revenue cap, PayPal and Wise payouts, confirmed one-time Stripe Checkout support) when there are 30+ active partners or payout operations take more than 2 hours a week. Cheaper alternative: PromoteKit Pro ($29/mo).
- **Skip at launch:**
  - Aspire and Upfluence (annual contracts).
  - Shopify Collabs (requires Shopify).
  - **TikTok Shop** (photo-upload personalization isn't supported; 3-day ship requirement).
  - GRIN paid plans.

### 8.8 Compliance (non-negotiable)

- **FTC Endorsement Guides (16 CFR 255)**: disclosure in the content itself. We train creators, monitor posts and pre-approve paid posts.
- **Consumer Review Rule (16 CFR 465)**: creator posts are never presented as customer reviews, and gifted creators are free to give honest opinions. Penalty is up to **$53,088 per violation**; the first warning letters went out in Dec 2025.
- **Contract checklist:**
  - disclosure wording and placement;
  - pre-approval of posts;
  - usage and whitelisting term and fee;
  - exclusivity;
  - AI-description rule;
  - no trademarked characters;
  - W-9;
  - takedown and morals clause;
  - minors clause.

---

## 9. 90-day launch plan (Oct 12, 2026 – Jan 10, 2027) and KPI targets

### 9.1 Launch blockers (W1, by Sun Oct 18)

- [ ] Production domain live on Vercel, plus Resend sending domain (SPF/DKIM). Confirm we own `pupprints.com`; the env default is `pupprints.vercel.app`.
- [ ] Stripe live keys and webhook; Stripe Tax; Apple Pay domain verification.
- [ ] Printful account, token and webhook registered; **order physical samples today** (16×20 canvas, 12×16 framed, 8×10 poster, mug, ornament); **3 real end-to-end test orders**.
- [ ] fal, Replicate and OpenAI keys; `FAL_USER_ID` for webhook checks; rate-limit increases requested; the 40-photo likeness eval run.
- [ ] `/order/success` and `/reveal/[token]` built; extra-pet SKU added; copy audit (badges and unsupported claims) done.
- [ ] Meta Pixel + CAPI, GA4, TikTok and Pinterest tags, UTM conventions, post-purchase survey.
- [ ] Merchant Center + free listings + Google Customer Reviews; Trustpilot automatic invites; Klaviyo SMS toll-free verification submitted.
- [ ] 30+ labeled sample portraits across 12 breeds; creative batch #1 (12 concepts); 200-creator list loaded in admin; 30 gift-guide and dog-blogger PR pitches sent.

### 9.2 Weekly plan

| Week | Dates | Milestones | Exit gate |
|---|---|---|---|
| W1 | Oct 12–18 | Launch blockers above | Funnel events fire end to end; preview p50 < 30s; test order shipped |
| W2 | Oct 19–25 | **Soft launch** + Founding 100 (15% off, real counter). Meta Advantage+ Sales $40–60/day + preview-lead test $15/day. Google brand + Shopping $15/day. Daily TikTok/Reels "send me your dog" series. First 10 creator seeds. SEO pages: custom-dog-portrait, pet-portrait, from-photo, royal, photo-tips | ≥1,000 sessions, ≥150 previews, ≥10 orders; preview → email ≥40% |
| W3 | Oct 26–Nov 1 | Kill the bottom half of creatives and add 4 new concepts. Experiments: email-ask placement; room mockup vs flat frame. SEO: memorial, sympathy, gifts-for-dog-lovers, ornament, ai-dog-portrait. Pinterest catalog + 50 pins | CVR ≥1.2%; Meta CPA ≤$60; first 5 reviews |
| W4 | Nov 2–8 | Holiday Cozy + standalone ornament live; Gift Set $139; "gift two, 25% off the second"; static "Order by Dec 10" banner. **All 40 creator seeds shipped by Nov 6.** TikTok Spark starts | ≥60 orders cumulative; AOV ≥$100; list ≥600 |
| W5 | Nov 9–15 | Scale Meta to $80–110/day on winners. First partnership ads. BFCM early-access signup. Breed pages batch 1. **Decide on the Meta preview-lead test, Klaviyo migration and the Prodigi standby** | Blended CAC ≤$45; 7-day ROAS ≥1.8 |
| W6 | Nov 16–22 | BFCM creative batch (6 concepts). Gift guides publish. Microsoft Ads import. Angle landing pages (gift / memorial / funny) | ≥15 reviews; flows ≥12% of revenue |
| W7 | Nov 23–29 | **BFCM:** early access Thu Nov 26; **20% off Fri Nov 27 – Mon Nov 30, 11:59pm PT**, no extension. Meta $150–170/day. 5 email/SMS sends. Support staffed for 2-hour replies; daily print QA | Peak-week CVR ≥2.5%; weekly MER ≥3.0 |
| W8 | Nov 30–Dec 6 | Cyber Monday; full price from Dec 1; Giving Tuesday shelter tie-in. Cutoff emails Dec 3. Last-minute and Gift Reveal pages. Breed batch 2 | Blended CAC ≤$35; AOV ≥$115 |
| W9 | Dec 7–13 | **Standard cutoff Thu Dec 10** (Printful's US standard deadline is Dec 11; we keep a 1-day buffer). Cutoff emails Dec 8 and 10. Express upgrade (cost passed through) from Dec 11 | ≥200 orders cumulative; late-order rate <3% |
| W10 | Dec 14–20 | **Express cutoff Dec 15** (Printful express Dec 16; USPS Ground Advantage Dec 17, Priority Dec 18). Pivot to Gift Reveal, digital and gift cards; Meta −40%; Green Monday Dec 14; proactive updates on every open order | Gift Reveal ≥30% of Dec 16–24 orders |
| W11 | Dec 21–27 | Christmas-morning Gift Reveal sends; on-time promise refunds processed automatically; review and UGC requests | ≥40 public reviews, rating ≥4.6 |
| W12 | Dec 28–Jan 3 | Retrospective: MER by channel, creative winners, funnel leaks; memorial evergreen campaigns; reset Meta to $40–50/day | Forecast vs actual written up |
| W13 | Jan 4–10 | Q1 plan: Valentine's (physical order-by **Feb 1**), Duchess style, referral push, affiliate program opened to all | Q1 plan approved; list ≥2,500 |

**Weekly rhythm:**

| Day | Focus |
|---|---|
| Mon | KPI review |
| Tue | Creative sprint |
| Wed | Launch new concepts and experiments |
| Thu | Creator and PR outreach |
| Fri | Support and fulfillment QA review |

**Workstream pods:** Paid, Creative, CRO, Lifecycle, SEO/Content, Partnerships, Analytics, CX/Ops.

### 9.3 Budget ($11.5K over 90 days, weighted to the peak)

Creator seeding is front-loaded because all 40 gifts must ship by Nov 6. That changes the `growth` monthly split; the line totals stay the same.

| Line | M1 (Oct 12–Nov 8) | M2 (Nov 9–Dec 13) | M3 (Dec 14–Jan 10) | Total | Share |
|---|---|---|---|---|---|
| Meta (Advantage+ Sales, preview-lead test, partnership ads) | $1,200 | $3,000 | $1,600 | $5,800 | 50% |
| Creators / UGC (40 seeds at ~$42 COGS ≈ $1,700; paid micro, UGC and whitelisting $850) | $1,700 | $600 | $250 | $2,550 | 22% |
| Google (brand, Shopping, high-intent search) | $300 | $750 | $550 | $1,600 | 14% |
| TikTok Spark + Pinterest tests | $100 | $400 | $200 | $700 | 6% |
| Tools (Klaviyo/SMS, Modash 1 month, Canva/CapCut, Pinterest scheduler) | $350 | $250 | $250 | $850 | 7% |
| **Total** | **$3,650** | **$5,000** | **$2,850** | **$11,500** | 100% |

**Budget rules:**
- Commissions and discounts are variable costs paid out of revenue.
- Up to 20% can move between lines each week, based on blended CAC.
- **Stretch trigger:** if M2 blended CAC is ≤$35 by Nov 20, raise Meta to $200/day through Dec 10 and fund 1–2 macro deals.
- **Downside trigger:** if CAC stays above $55 through Nov 15, cut the preview-lead test and bottom creatives, move 30% of spend to creator whitelisting and Shopping, and push gift-with-purchase offers through the flows.

**Meta cost expectations:**
- Median CPM $13.48, ROAS 1.93, CVR 1.57% (Triple Whale, 2025).
- DTC panel median ROAS 2.96 (TopGrowth).
- Plan for **Q4 CPMs of $18–28**.

### 9.4 KPI targets

| KPI | W2–5 (learn) | W6–10 (peak) | W11–13 (post) |
|---|---|---|---|
| Site CVR | 1.2–1.5% | 2.0–2.5% | 1.3–1.6% |
| AOV | $100–105 | $115–125 | $105–110 |
| Meta new-customer CPA | ≤$55 | ≤$40 | ≤$50 |
| Meta ROAS (7-day click / 1-day view) | ≥1.8 | ≥2.5 | ≥2.0 |
| Google Shopping + non-brand ROAS | ≥2.5 | ≥3.5 | ≥3.0 |
| **Blended MER** (north star) | ≥2.0 | ≥3.5 | ≥2.5 (90-day ≥3.0) |
| Blended new-customer CAC | ≤$50 | ≤$32 | ≤$40 |
| Preview → email | ≥45% | ≥50% | ≥50% |
| **Upload → purchase (7 days)** (north star) | 6–8% | 10–12% | 7–9% |
| Abandoned-preview revenue per recipient | ≥$3 | ≥$6 | ≥$4 |
| Email + SMS share of revenue | 10–15% | 20–25% | 25–30% |
| Creator-attributed share of orders | 5% | 10–15% | 10% |
| Referral share of orders | – | 1–2% | 2–5% |
| Public review rating | – | ≥4.6 | ≥4.7 |
| On-time delivery (pre-cutoff orders) | – | ≥97% | – |
| Remake / refund rate | ≤4% | ≤3% | ≤3% |
| AI cost per order | ≤$6 | ≤$4 | ≤$3 |

### 9.5 Base-case forecast

| Period | Sessions | CVR | Orders | AOV | Revenue | Spend | MER |
|---|---|---|---|---|---|---|---|
| M1 | ~5,000 | 1.3% | ~65 | $102 | ~$6.6K | $3,650 | 1.8 |
| M2 | ~8,000 | 2.0% | ~160 | $118 | ~$18.9K | $5,000 | 3.8 |
| M3 | ~6,000 | 1.35% | ~80 | $108 | ~$8.6K | $2,850 | 3.0 |
| **90 days** | **~19,000** | **1.6%** | **~305** | **~$112** | **~$34K** | **$11,500** | **~3.0** |

- At ~50% contribution, that is about **+$5.5K after marketing**, plus 2.5–4K email/SMS subscribers and ~300 customers going into Valentine's.
- **Stretch case** (a top creative, a creator or TikTok hit, or a gift-guide placement): ~600 orders and ~$70K.
- For scale: C&P runs ~56K sessions a month, so a new brand at ~60K a month would reach parity with it.

---

## 10. Risks and open questions

### 10.1 Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **C&P rolls out its hidden AI live-preview SKU** (`custom-ai-pet-portrait`, Apr 2026) | Erodes the "preview first" wedge | Compete on likeness, the on-time promise, Gift Reveal, honest pricing and the guarantee. Ship fast; Q4 2026 is the window. |
| **Likeness failures** (the known AI failure mode: smoothed wrinkles, markings on the wrong side, breed drift) | Remakes, refunds, 1★ reviews | Run the 40-photo eval before scaling spend; vision judge and auto re-roll; multi-photo upload; human check on every print; guarantee with a 3% reserve |
| **Q4 print capacity and delays** (Printful at peak) | Missed Christmas, which is C&P's #1 complaint | Cutoff Dec 10 with a 1-day buffer before Printful's Dec 11; Prodigi hot standby by Nov 15; daily monitoring of `order_put_hold` and `order_failed`; Gift Reveal covers late orders |
| **Anti-AI backlash** (Ohio State 2023: gifts known to involve AI are rated less thoughtful; Savings.com 2025: 36% would question how well the giver knows them; C&P's creator brief says "no AI or filters") | Lower CVR on gifts | Lead with the outcome and the human check; honest FAQ disclosure; "AI vs hand-painted" transparency page |
| **AI cost runs above plan** ($3.60–6.00 per order vs the $1.50 modeled) | −2 to −4 GM points | Email gate before galleries beyond the first; caps; dedupe; move volume to Replicate or Google direct; experiment #4 (3 vs 6 styles) |
| **Gemini API terms**: users must be 18+, and apps may not be "directed towards or likely to be accessed by" under-18s | Provider terms breach | 18+ requirement in the Terms for purchases and accounts; nothing marketed to kids; **legal review**; GPT Image fallback already wired |
| **FTC exposure** (Endorsement Guides; Consumer Review Rule at $53,088 per violation) | Fines, reputational damage | No fabricated or gated reviews; disclosures in contracts and briefs; post monitoring; remove unsupported claims from `catalog.ts` |
| **Promotions stacking with commissions** (framed 24×36 at 15% off + 20% commission = 13% GM; with BFCM it goes negative) | Margin loss | No stacking; ornament excluded from codes; promotions capped at 20% |
| **Fal key abuse or runaway cost** | Unbounded bill | No server proxy; Turnstile; per-IP and per-email caps; spend alerts; webhook user-id check |
| **Bad SEO or market data** (Grips is low confidence; RankHero volumes are Etsy-oriented; the Feb–Jun 2026 Trends surge looks like an artifact) | Misallocated effort | Validate in Google Keyword Planner or Ahrefs before building breed pages; use our own data from W3 |
| **Chargebacks from late gifts** | Payment-processor risk | Arrives-by dates, the on-time promise and Gift Reveal |

### 10.2 Open questions (need a human decision or verification)

1. **Trademark:** run a USPTO search on "Pup Prints" before major brand spend; searches found no conflicting dog-portrait brand. Confirm ownership of `pupprints.com`, `@pupprints` handles and the sending domain.
2. **Securing partnerships needs a human.**
   - Outreach must come from a real company mailbox, and creators must accept terms.
   - Gifts need real recipient addresses and funded shipping.
   - Fees need a signer and a payout account (PayPal or Wise) and W-9 collection.
   - Agents can draft, sequence and track all of this in `/admin/partners`, but **cannot honestly report "partnerships secured" until creators actually accept.**
   - Who sends, and from which inbox?
3. **Sales tax:** home-state registration, Stripe Tax setup and fee, and whether to file a Printful resale certificate so wholesale costs aren't taxed. Verify.
4. **Live chat tool** (not researched): default to email + contact form + SMS replies at launch; choose a chat widget by W2.
5. **Holiday on-time promise** (25% refund if a pre-cutoff order misses Dec 24): approved in this brief; confirm the finance owner and the carrier-exception wording.
6. **Unconfirmed Printful values** to check through the API:
   - Shipping tiers for 12×16 and 18×24 framed canvas.
   - Multi-item cart shipping when items come from different facilities (affects bump and Gift Set margins).
   - Whether wall art falls under Printful's "Home & living" holiday deadline.
   - That product claims match the specs ("hand-stretched," "solid wood frame," "acrylic glazing," "189gsm").
7. **AI open items to verify with real calls:**
   - p50/p95 latency for Nano Banana 2.1 at 2K on fal vs Replicate vs Google direct.
   - Topaz `face_enhancement` off vs on for dog faces, and Topaz HF V2 vs SeedVR2 on fur.
   - Refusal rates on photos that include people.
   - Rate-limit increases before creator-driven traffic spikes (OpenAI GPT Image defaults to 20 images/min at the Build tier).
8. **Klaviyo vs staying on Resend** for campaigns and SMS: decide at the W5 review.
9. **Child-creator laws** for any account where kids appear: legal sign-off before contracting.

---

## Sources

**Crown & Paw (own pages and data):**
- https://crownandpaw.com
- https://crownandpaw.com/products.json
- https://crownandpaw.com/pages/faq
- https://crownandpaw.com/pages/how-it-works
- https://crownandpaw.com/policies/refund-policy
- https://crownandpaw.com/products/the-general-custom-pet-canvas
- Klaviyo forms API: fast.a.klaviyo.com/forms/api/v7/full-forms?company_id=NXithY
- Raw data: `scratchpad/cp/all_products.json`, `scratchpad/cp/crownandpaw_variants.csv`, `scratchpad/cp/klav_forms.json`

**Crown & Paw (reputation and third-party):**
- Trustpilot: https://www.trustpilot.com/review/crownandpaw.com (sorted by recency, and the 1★ / 2–3★ / 5★ filters)
- BBB Los Angeles: https://www.bbb.org/us/ca/los-angeles/profile/online-retailer/crown-and-paw-1216-1082689
- BBB Houston: https://www.bbb.org/us/tx/houston/profile/art-and-culture/crown-and-paw-0915-90061763
- Loox: https://loox.io/s/4JlbYtGjwL?page=2
- Grips: https://gripsintelligence.com/insights/retailers/crownandpaw.com
- Awin merchant profile: https://ui.awin.com/merchant-profile/57823
- Awin terms: https://ui.awin.com/merchant-profile-terms/57823
- GRIN: https://app.grin.ai/brands/crownandpaw.com
- MuteSix case study: https://mutesix.com/case-study/crown-paw/
- Dogster: https://www.dogster.com/lifestyle/crown-paw-pet-portraits-review
- TheVetDesk: https://thevetdesk.com/pet-lifestyle/general/crown-paw-pet-portraits-review
- Hepper: https://articles.hepper.com/best-pet-portraits/
- Thingtesting: https://thingtesting.com/brands/crown-and-paw/products
- TechRound: https://techround.co.uk/techround-100/crown-paw/

**Competitors and market:**
- West & Willow: https://westandwillow.com
- West & Willow on Trustpilot: https://www.trustpilot.com/review/westandwillow.com
- West & Willow ad library (Motion): https://motionapp.com/library/west-and-willow
- Grips, West & Willow: https://gripsintelligence.com/insights/retailers/westandwillow.com
- Perkie Prints: https://www.perkieprints.com
- Purr & Mutt: https://purrandmutt.com
- Paw & Glory: https://www.pawandglory.com
- Gold & Crown: https://www.goldandcrown.com
- Portrait Union: https://www.portraitunion.com
- Pet Canvas: https://create.petcanvas.art
- Stork: https://www.stork.ai/tools/pet-portrait
- QYResearch via Valuates: https://reports.valuates.com/market-reports/QYRE-Auto-18Z19307/global-custom-pet-portraits
- APPA: https://americanpetproducts.org/news/u.s.-pet-industry-reaches-158-billion-in-2025-poised-for-continued-growth-in-2026
- AKC breed rankings: https://www.akc.org/expert-advice/dog-breeds/most-popular-dog-breeds-2025/
- AI and gift perception:
  - https://news.osu.edu/ai-can-help-write-a-message-to-a-friend--but-dont-do-it/
  - https://www.savings.com/insights/ai-holiday-shopping-study

**AI and tech:**
- Artificial Analysis editing leaderboard: https://artificialanalysis.ai/image/leaderboard/editing
- Gemini pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini image generation docs: https://ai.google.dev/gemini-api/docs/image-generation
- Gemini API terms: https://ai.google.dev/gemini-api/terms
- fal, Nano Banana 2.1 Edit: https://fal.ai/models/google/nano-banana-2.1/edit
- fal, GPT Image 2.5 Flare Edit: https://fal.ai/models/openai/gpt-image-2.5/flare/edit
- fal, Topaz upscale: https://fal.ai/models/fal-ai/topaz/upscale/image/llms.txt
- fal, SeedVR2 upscale: https://fal.ai/models/fal-ai/seedvr/upscale/image/llms.txt
- fal docs: https://fal.ai/docs/llms-full.txt
- Replicate, Nano Banana 2.1: https://replicate.com/google/nano-banana-2.1
- Replicate webhook verification: https://replicate.com/docs/topics/webhooks/verify-webhook
- OpenAI pricing: https://developers.openai.com/api/docs/pricing
- BFL terms of service: https://bfl.ai/legal/terms-of-service

**Fulfillment:**
- Printful catalog API: https://api.printful.com/products/3
- Printful API docs: https://developers.printful.com/docs/
- Printful shipping rates: https://www.printful.com/shipping
- Printful holiday deadlines: https://www.printful.com/blog/your-holiday-shipping-and-order-deadlines-guide-free-visuals-included
- Prodigi API reference: https://www.prodigi.com/print-api/docs/reference/
- Lumaprints pricing: https://www.lumaprints.com/pricing/
- USPS holiday dates: https://www.usps.com/holiday/holiday-shipping-dates.htm
- Stripe pricing: https://stripe.com/pricing

**Influencers and compliance:**
- Seed list: `scratchpad/influencers_seed.csv`
- Modash, US dog influencers: https://www.modash.io/find-influencers/united-states/dog
- iQfluence dog influencers: https://iqfluence.io/public/top-influencers/dog-influencers
- Scrumball US pet TikTok: https://www.scrumball.com/ranking/top-pet-influencers-on-tiktok-in-united-states
- InfluencerFee pet pricing: https://influencerfee.com/blog/pet-influencer-pricing/
- LaunchPoint pet micro rates: https://www.launchpointhq.com/guides/rates/how-much-do-pets-micro-influencers-charge
- Collabstr rate calculator: https://collabstr.com/influencer-price-calculator/animals-%26-pets
- Rewardful pricing: https://www.rewardful.com/pricing
- PromoteKit pricing: https://www.promotekit.com/pricing
- Modash pricing: https://www.modash.io/pricing
- FTC Disclosures 101: https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers
- FTC Endorsement Guides FAQ: https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- Benesch on Part 465 enforcement: https://www.beneschlaw.com/insight/five-stars-zero-tolerance-ftc-turns-up-enforcement-under-consumer-review-rule/pdf/
- 2026 penalty levels (Federal Register): https://public-inspection.federalregister.gov/2026-18853.pdf
- Child-influencer laws (Davis+Gilbert): https://www.dglaw.com/new-laws-protecting-child-influencers-what-marketers-and-influencers-need-to-know/
- 1099 threshold: https://www.patriotsoftware.com/blog/accounting/1099-reporting-threshold/

**Growth benchmarks:**
- Triple Whale, Meta: https://www.triplewhale.com/blog/facebook-ads-benchmarks
- Triple Whale, TikTok: https://www.triplewhale.com/blog/tiktok-benchmarks
- TopGrowth, Meta DTC: https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/
- AdMake, CPM by month: https://admakeai.com/blog/cost-per-impression-cpm-explained
- Jon Loomer, Andromeda creative diversification: https://www.jonloomer.com/meta-andromeda-creative-diversification/
- Polar Analytics benchmarks: https://www.polaranalytics.com/ecommerce-benchmarks
- Klaviyo flow benchmarks: https://www.klaviyo.com/blog/abandoned-cart-benchmarks
- ReferralCandy referral rates: https://www.referralcandy.com/blog/referral-rates
- Wisepops popups: https://wisepops.com/use-cases/welcome-popups
- RankHero keywords: https://www.rankhero.com/keywords/pet-portrait (and the related keyword pages listed in `growth` §9.1)
- NRF Valentine's 2026 via LGR: https://lgrmag.com/news/valentines-day-2026-spending-to-reach-new-records/