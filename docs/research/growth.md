# Pup Prints: Go-To-Market and Conversion Playbook (90-Day Launch, Oct 12, 2026 – Jan 10, 2027)

Prepared 2026-10-13. Fits the product decisions already in the repo: catalog prices in `web/src/lib/catalog.ts`, margins in `docs/research/fulfillment.md`, and the honesty rules in `CLAUDE.md`: no fake compare-at prices, no countdown timers, no fabricated reviews, and we never lead with "AI".

---

## 0. Executive summary

1. **We launch at the start of the category's peak.** Crown & Paw tells affiliates that mid-October to early December brings in over 50% of its revenue ([Awin](https://ui.awin.com/merchant-profile/57823)). Search demand roughly doubles in Nov–Dec. "pet portrait" goes from 27.1K to 40.5K a month, "gifts for dog lovers" from 8.1K to 40.5K, and "custom dog ornament" from 590 to 8.1K ([RankHero](https://www.rankhero.com/keywords/pet-portrait)). Every week of delay in October costs real revenue.
2. **The wedge is "See it free before you pay. Give it tonight. Hang it in days."** Crown & Paw makes you pay first, waits 1–3 days for a proof, and charges $10 to "preview sooner" (internal `docs/research/cp-site.md`). Its Trustpilot score is 3.8 from 20,195 reviews, and most recent reviews are 1-star. The main complaints are late holiday orders, a confusing proof process, surprise fees and slow support (`docs/research/cp-reviews.md`). We answer every one of these in the funnel and the messaging.
3. **The funnel is built around the free preview, not the product page.** Visitor, then photo upload, then the instant portrait, then email capture ("save my portraits"), then checkout. The abandoned-preview flow, which emails people the actual portraits of their own dog, is the most important retention tool we have. Crown & Paw cannot copy it without changing its whole operation.
4. **Budget is about $11.5K over 90 days, weighted toward the peak** ($3.5K / $5.0K / $3.0K). The split is about 50% Meta, 22% creators/UGC, 14% Google, 6% TikTok/Pinterest tests and 7% tools.
5. **Base case for 90 days:** about 300 orders, about $34K revenue, AOV about $112, blended MER about 3.0, positive contribution after marketing, and 2.5–4K email/SMS subscribers going into Valentine's and Mother's Day. The stretch case (a creator or TikTok hit) is about 2x.
6. **North-star metrics:** blended MER (revenue ÷ all marketing spend) and preview-to-purchase rate. Platform-reported ROAS is a diagnostic only.

---

## 1. What we learned about the competition

| Signal | Finding | Implication for Pup Prints |
|---|---|---|
| Scale | Crown & Paw: about 56K sessions, about $263K revenue, 2.5–3.0% CVR and $150–175 AOV in Aug 2026. Roughly $3M GMV in 2025. Cuddle Clones about $788K/mo, West & Willow about $398K/mo with $250–275 AOV ([Grips](https://gripsintelligence.com/insights/retailers/crownandpaw.com), modeled estimates) | The category supports high AOVs. Crown & Paw is beatable on experience, not on brand awareness. |
| Seasonality | More than 50% of Crown & Paw revenue lands mid-Oct to early Dec ([Awin](https://ui.awin.com/merchant-profile/57823)) | Launch now. Front-load creative and creators for Nov 9–Dec 10. |
| Funnel | Pay first, proof in 1–3 days, $10 "Preview Sooner", "From $39.95" is really the digital price, Checkout+ auto-added (internal research) | "Free preview before you pay", all-in pricing, nothing pre-checked |
| Trust | Trustpilot 3.8/5 with about 10% 1-star. Two BBB "F" profiles. Main complaint is late holiday delivery (internal `cp-reviews.md`) | Show a per-ZIP "Arrives by" date, use real cutoffs, collect reviews from order #1 |
| Positioning | Crown & Paw's creator brief says "made with a pen and tablet, no AI or filters" ([GRIN](https://app.grin.ai/brands/crownandpaw.com)) | Expect an anti-AI counterattack. Lead with outcome, speed and the guarantee. Disclose AI plainly in the FAQ ("our AI artist, finished and checked by our team"). |
| Paid social | Crown & Paw scaled Snapchat with MuteSix: retargeting first, then acquisition and lookalikes ([MuteSix](https://mutesix.com/case-study/crown-paw/)). West & Willow runs about 29 active Meta ads with about 9 new creatives a week. Its angles are social proof, memorial, before/after, unboxing, home decor and humor; videos run 13–32s; the CTA is "Create Yours" ([Motion](https://motionapp.com/library/west-and-willow)) | We need high creative volume and real variety in concepts (see §4) |
| Influencers | Crown & Paw's affiliate program is on Awin with a 60-day cookie. GRIN shows no active managed creator program | There is room to own creator partnerships with gifted portraits and live preview reveals |
| AI substitutes | Free or cheap AI generators exist, e.g. Stork at $9.99 per digital download ([Stork](https://www.stork.ai/tools/pet-portrait)) | Don't sell ourselves as a generator. Sell the **gift and the object on the wall**: print quality, likeness, delivery promise, guarantee. Digital is a free extra, not the product. |
| Consumer sentiment on AI | A small US survey found 62% would like art less if AI made it with no human involvement ([CO/AI](https://getcoai.com/news/survey-62-of-americans-want-ai-as-creative-tool-not-replacement/)), directional only | Make "Every print is checked by a person before it's printed" visible on site |

---

## 2. Positioning and messaging

**Promise (hero line):** "Your dog, painted like royalty. See it free in 30 seconds."

**Proof stack (repeat on the home page, PDP, checkout and every ad end card):**
1. See your portrait free before you pay. Try every style, redo as often as you like.
2. Free US shipping on every order, plus the hi-res digital file free with every print.
3. Love it or we remake or refund it.
4. "Arrives by [date]" shown before you pay. Real holiday cutoffs.
5. Every print checked by a person before it's printed.

**On-site comparison** (say "typical portrait shops", never a brand name in UI):

| | Typical portrait shops | Pup Prints |
|---|---|---|
| See it before paying | No, pay then wait 1–3 days | Yes, about 30 seconds |
| Fake "sale" prices | Common | Never |
| Shipping | Often a threshold | Always free in the US |
| Digital file | Extra charge | Included free |
| If you don't love it | Limited | Remake or refund |

**Message by audience:**
- **Gifters (about 70% of Q4):** "The gift that gets the gasp." Show reactions, the Gift Reveal and arrival dates.
- **Dog moms and dads buying for themselves:** "Finally, art worthy of them." Show home decor and humor (Royal, Admiral, Space Cadet).
- **Memorial (all year, about 25–35% of demand):** "For the one who still deserves a spot on the wall." Use Watercolor, Botanical, Old Master and Charcoal. Gentle tone, no urgency, no jokes.

---

## 3. Conversion system (CRO for a personalized product)

### 3.1 Target funnel and benchmarks

| Step | Target (wk 2–5 → wk 6–10) | Why / benchmark |
|---|---|---|
| Landing → starts upload | 25% → 35% | Upload button above the fold on mobile is the whole job of the page |
| Upload → preview delivered | ≥95% success, p50 < 30s | A failed or slow preview is a lost sale. Show sample portraits and progress steps while it generates. |
| Preview → email captured ("save my portraits") | ≥50% | Gating is light: the first style shows instantly, the email unlocks "save + all styles + room mockups". Generic pop-ups average 4.82% ([Wisepops](https://wisepops.com/use-cases/welcome-popups)), so the preview is a far stronger opt-in. |
| Preview → checkout start | 15% → 22% | |
| Checkout start → purchase | ≥50% | The global cart abandonment average is about 70% ([Baymard via Red Stag](https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/)). Our all-in pricing removes the top reason, extra costs. |
| Upload → purchase within 7 days (including flows) | 6–8% → 10–12% | `fulfillment.md` assumes 20%, which is optimistic for cold paid traffic. Plan on 10%. |
| Site CVR (orders ÷ sessions) | 1.3% → 2.2% | Gifts & Occasions 3.38% ([Polar](https://www.polaranalytics.com/ecommerce-benchmarks)), gifts 3.13% ([Grips](https://gripsintelligence.com/insights/rankings/top-ecom-stores-gifts)), Crown & Paw 2.5–3.0%, Meta-driven traffic median 1.57% ([Triple Whale](https://www.triplewhale.com/blog/facebook-ads-benchmarks)) |

### 3.2 Page-by-page checklist

**Home and landing pages (mobile first):**
- [ ] The hero is the upload button ("Upload your dog's photo, free preview"), with a camera-roll picker. The style choice comes after upload: show 4–6 styles at once.
- [ ] Show price early: "Canvas from $59 · Prints from $35 · Free US shipping". This avoids sticker shock after the preview.
- [ ] Before/after strip (phone photo → canvas on a wall) using our own team dogs, labeled as samples.
- [ ] Trust row with the five promises (§2). Leave an empty-state-ready reviews block that only appears when real reviews exist.
- [ ] "Arrives by" date on the landing page (ZIP-based or national estimate) through Dec 15.
- [ ] LCP < 2.5s on 4G. Hero image via `next/image`. No heavy JS before the upload button.

**Preview / create flow:**
- [ ] While generating: rotating real samples, honest progress steps ("Studying your dog's markings...") and photo tips.
- [ ] Show the result inside a **realistic frame or room mockup**, with canvas/framed/print toggles that update the mockup. Seeing the finished object is the conversion moment.
- [ ] One-tap "Try another style" and "Redo this one". Free and unlimited, rate-limited per session against abuse.
- [ ] Light watermark on previews. The hi-res file comes with the purchase.
- [ ] Email capture: "Email me my portraits so I don't lose them". Optional SMS checkbox (unchecked, TCPA-compliant wording).
- [ ] Marketing-use opt-in, **unchecked by default**: "Can we feature [Dog name] on our wall of good dogs?" This builds a legitimate UGC gallery.
- [ ] Memorial toggle: "Is this portrait in memory of your dog?" It changes copy, suppresses playful or urgent messages and routes to the gentle email track.
- [ ] "Ask friends to vote" share link with a public OG image of the portrait. This is a social decision loop and a free acquisition channel (§7).

**PDP / configurator:**
- [ ] Default selection: **16×20 Gallery Canvas, $99** ("Most popular").
- [ ] A size ladder that makes the next size up feel cheap: 12×16 $79 → **16×20 $99** → 18×24 $115 ("+$16 for 44% more canvas").
- [ ] Order bumps (never pre-checked): matching ornament $19, mug $25, extra pet +$15, gift message (free).
- [ ] Gift options: ship to recipient, gift receipt (no prices), schedule a Gift Reveal e-card.
- [ ] Express checkout: Apple Pay, Google Pay, Link. BNPL (Klarna/Afterpay via Stripe) shown on orders ≥$100. Note Klarna's fee is about 5.99% + $0.30.

**Checkout and post-payment:**
- [ ] No surprise fees, no auto-added protection. The price shown is the price paid plus sales tax.
- [ ] One-click post-purchase upsell (saved payment method): "Add the matching ornament for $15" or "Second style of [Dog], 25% off". Target 8–12% take rate (our assumption, not a benchmark).
- [ ] The thank-you page delivers the **Gift Reveal link and the digital file instantly**, plus a Google Customer Reviews opt-in.
- [ ] A short post-purchase survey, "How did you first hear about us?", which is the main way to attribute creators and organic.

### 3.3 Social proof when we have zero reviews (honest version)
- The promises are the trust signals: free preview, guarantee, free shipping, a human checks every print.
- **"Founding 100" launch framing:** "Be one of our first 100 customers. 15% off and your pup on our Founders Wall." Show a real counter from the database.
- Real portrait gallery from opted-in users, plus our team's dogs labeled as such.
- Collect reviews from order #1. Trustpilot automatic invites (we aim for >4.5 against Crown & Paw's 3.8), Google Customer Reviews (feeds Shopping seller ratings), on-site photo reviews. **Never incentivize Trustpilot or Google reviews. Never gate reviews by sentiment.** The FTC Consumer Review Rule allows civil penalties up to about $53K per violation, and enforcement started in 2025 ([Crowell](https://www.crowell.com/en/insights/client-alerts/keeping-it-real-ftc-targets-fake-reviews-in-first-consumer-review-rule), [JD Supra](https://www.jdsupra.com/legalnews/five-stars-zero-tolerance-ftc-turns-up-3594404/)).
- Disclosed creator content (#ad / Paid partnership) as social proof.
- Visible support: a real email, live chat with "a human replies within 2 hours (8am–10pm ET)", and an order tracker (Approved → Printing → Shipped → Out for delivery).

### 3.4 Experiment backlog (ranked)
With 5–10K sessions a month, A/B tests can only detect big effects (roughly 25%+ relative). Test bold changes and use sequential before/after reads for the rest.

| # | Test | Primary metric | Week |
|---|---|---|---|
| 1 | Email ask placement: after first style vs. before revealing styles 2–6 | Upload → purchase (7d) | 3 |
| 2 | Room mockup vs. flat frame as the default preview view | Preview → checkout start | 3 |
| 3 | Default product: 16×20 canvas vs. 12×16 framed | AOV × CVR (revenue per session) | 4 |
| 4 | 3 vs. 6 styles generated at first load (cost vs. delight) | Preview → checkout, AI cost per order | 5 |
| 5 | Gift Set bundle shown on PDP vs. only at bump | AOV | 5 |
| 6 | Landing pages by ad angle (gift / memorial / funny) vs. one home page | CVR by angle | 6 |
| 7 | December: Gift Reveal-first messaging vs. "arrives by" first | CVR Dec 11–24 | 9 |

---

## 4. Paid acquisition

### 4.1 Meta (Facebook and Instagram): primary paid channel

**Setup (week 1):** Pixel plus **Conversions API from the Next.js server**, deduplicated with event_id. Standard events: ViewContent, AddToCart, InitiateCheckout, Purchase (with value). Custom events: `PreviewGenerated` and `PreviewLead` (preview plus email). Verify the domain and set Aggregated Event Measurement priorities.

**Structure for a $50–170/day budget:**
- **Campaign A, Advantage+ Sales, optimizing Purchase (about 75% of Meta spend).** One campaign, broad US (adults 25–65 to start), 10–20 ads, existing-customer budget cap of about 10%. Since Andromeda, *creative diversity does the targeting work*: ads that say the same thing are effectively treated as one creative, and many advertisers now run 10–20+ ads per ad set ([Jon Loomer](https://www.jonloomer.com/meta-andromeda-creative-diversification/)). Advantage+ Sales caps at 50 ads per ad set.
- **Campaign B, test, optimizing `PreviewLead` (about 25%, weeks 2–6).** At our budget the purchase campaign gets about 10–25 purchases a week, below the roughly 50 needed to exit learning. Previews with email are 5–10x more frequent and are our real "value moment", and email/SMS flows convert them. Judge B on **blended cost per purchase within 7 days**, not cost per lead. Keep it only if it beats A.
- Scaling rule: raise budgets 20–30% every 3–4 days while 3-day CPA is on target. Cut ads after about 2x target CPA spend with no purchase. Add 3–6 *new concepts* weekly (not just variations).
- **Partnership ads** (creator handle as the identity) from week 4 using creator content with usage rights.

**Cost expectations:** median CPM $13.48, ROAS 1.93 and CVR 1.57% in 2025 ([Triple Whale](https://www.triplewhale.com/blog/facebook-ads-benchmarks)). A 15-brand DTC panel shows median CPM $13.52, CPC $0.57, CTR 2.68%, ROAS 2.96 ([TopGrowth](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/)). One dataset puts the 2025 median CPM at $21.69 in Oct, a $25.22 peak in Nov and $22.04 in Dec, about +16% Oct→Nov ([AdMake/SuperAds](https://admakeai.com/blog/cost-per-impression-cpm-explained)). Plan for Q4 CPMs of $18–28.

**Format mix:** about 60% 9:16 video (9–20s, captions, hook in 1.5s), 25% 4:5 statics and carousels (one dog shown in six styles), 15% creator/partnership ads.

### 4.2 Creative concept library (15 diverse concepts for Andromeda)

| # | Concept / angle | Hook (first 1–2s) | Format | Use |
|---|---|---|---|---|
| 1 | **Live preview demo** (our unique mechanism) | "I uploaded one blurry photo of my dog and..." Screen recording: upload → 30s → six portraits | 9:16 screen record + face cam | Always on |
| 2 | **Gift reaction** | "My dad doesn't cry. Then he opened this." | UGC unboxing | Q4 core |
| 3 | **Royal / Admiral humor** | "He has never worked a day in his life. Now he's an Admiral." Dog looks at its own portrait. | Skit / UGC | Always on |
| 4 | **Before → after split** | Phone photo, then wipe to canvas on a mantel | 6–9s loop, static | Always on |
| 5 | **"See it before you pay"** (contrast with typical shops, no brand names) | "Most portrait shops make you pay and wait 3 days to see it. We show you in 30 seconds." | Talking head | Always on |
| 6 | **Honest price card** | "$99. Free shipping. Digital file included. Love it or it's free." | Static | Retargeting |
| 7 | **Memorial** (gentle) | "For the one who still deserves a spot on the wall." Watercolor/Botanical reveal, no urgency | 20–30s emotional | Evergreen |
| 8 | **Breed-specific** (top 10 breeds) | "Golden retriever owners, this is for you." Six goldens in six styles | Carousel / montage | Always on |
| 9 | **"Which one should I hang?"** (comment bait) | "I turned my dog into 12 paintings. Pick one for me." | Carousel / Reel | Engagement → retarget |
| 10 | **Multi-pet** | "All three. Finally in one frame." | Static / video | Q4 |
| 11 | **Home decor** | "The art above our couch is our dog and nobody can tell" (Old Master / Mid-Century) | Room tour | Self-purchase |
| 12 | **Holiday Cozy + ornament** | "The ornament everyone asks about" | Product montage | Nov 1–Dec 10 |
| 13 | **Gift Reveal for last-minute gifting** | "Forgot a gift? Give the portrait tonight. The canvas arrives after." | Screen record of e-card | Dec 11–25 |
| 14 | **Founder / new brand** | "We're new. Be one of our first 100 customers and your dog goes on our Founders Wall." | Talking head | Weeks 2–5 |
| 15 | **"Send me your dog"** (TikTok reply series, recut for Meta) | "You sent me Biscuit. Here's Biscuit as a Renaissance duke." | Reply video | Always on |

Don't: claim "hand-painted"; use strikethrough prices, timers or "only 2 left"; show real customers' dogs without opt-in; use trademarked characters.

### 4.3 Google
- **Week 1:** Merchant Center with a product feed (canvas, framed, print, ornament, mug, Gift Set) showing lifestyle images of sample dogs. Turn on **free listings** and **Google Customer Reviews**.
- **Standard Shopping** (manual CPC / Max Clicks with a cap) for the first 30 days, then test PMax after about 30 conversions.
- **Search, exact and phrase:** brand (cheap insurance), "custom dog portrait" (CPC est. $1.98), "pet portrait from photo", "royal pet portrait" ($1.41), "dog memorial gift" ($1.25), "pet sympathy gift" ($2.14), "custom dog ornament" (Nov–Dec, $0.95). CPC estimates from [RankHero](https://www.rankhero.com/keywords/custom-dog-portrait), directional. The broad 2025 average is $5.42; gifts and arts sit lower, around $2–3 ([WordStream via ShopiFreaks](https://www.shopifreaks.com/google-ads-cpcs-rose-to-5-42-in-2025-with-87-of-industries-seeing-increases-but-conversion-rates-climbed-to-8-18-as-automation-improves/)).
- Competitor-keyword bidding is legal in the US but trademarks must stay out of ad copy. Optional and low priority. Don't do it until brand terms are covered.
- Microsoft Ads: import the Google campaigns in week 6 for cheap, older, gift-heavy clicks.

### 4.4 TikTok
- **Mostly organic first:** 1–2 posts a day of the "Send me your dog" reply series, live preview reveals and breed carousels. The instant preview lets us make content at a speed Crown & Paw can't match.
- **Spark Ads** ($10–15/day) from week 4, only on organic or creator posts that already beat the account median.
- 2025 benchmarks: CPM $13.26, CVR 2.01%, ROAS 2.21 ([Triple Whale](https://www.triplewhale.com/blog/tiktok-benchmarks)).

### 4.5 Pinterest
- People plan gifts and decor here, and memorial content is evergreen. Upload the catalog for Product Pins. Post 5–10 pins a day: breed × style images, "gallery wall with dog portrait", "pet memorial ideas", "dog mom gift" boards.
- Small ad test ($5–10/day) Nov 9–Dec 10 on catalog plus memorial. I found no reliable public Pinterest CPC benchmark, so judge on our own CPA.

---

## 5. Budget: $3–5K/month starting budget

### 5.1 Monthly plan (90 days ≈ $11.5K)

| Line | M1: Oct 12–Nov 8 (launch/learn) | M2: Nov 9–Dec 13 (peak) | M3: Dec 14–Jan 10 (post-cutoff) | 90-day total | Share |
|---|---|---|---|---|---|
| Meta (Advantage+ Sales + preview-lead test + partnership ads) | $1,600 ($40→70/day) | $2,700 ($80→160/day, peak Nov 24–Dec 10) | $1,500 (Gift Reveal Dec 14–24, then $40–50/day) | $5,800 | 50% |
| Creators / UGC (seeded portraits at about $45 COGS each, UGC videos $100–200, select paid micro posts) | $1,000 (about 15 seeds + 2 UGC) | $1,000 (about 10 seeds + 1–2 paid micro posts / usage rights) | $550 (whitelisting, commissions are variable) | $2,550 | 22% |
| Google (brand + Shopping + high-intent search) | $400 | $700 | $500 | $1,600 | 14% |
| TikTok Spark + Pinterest tests | $150 | $350 | $200 | $700 | 6% |
| Tools (Klaviyo email/SMS, SMS registration and sends, Trustpilot/reviews, Canva/CapCut, Pinterest scheduler) | $350 | $250 | $250 | $850 | 7% |
| **Total** | **$3,500** | **$5,000** | **$3,000** | **$11,500** | 100% |

Rules:
- Affiliate and creator commissions (10% of net) and discount codes are **variable costs paid from revenue**. Track them separately from the media budget.
- Move up to 20% between lines weekly, based on blended CAC.
- If M2 blended CAC is ≤$35 by Nov 20, extend Meta to $200/day through Dec 10. Peak weeks justify going over $5K.

### 5.2 Unit economics guardrails
- Blended gross margin after Printful, shipping, Stripe and AI is about 52–56% (`fulfillment.md`). After a 3% remake reserve, that is **about 50% contribution before marketing**.
- At a $110 AOV the **break-even first-order CAC is about $55** and **break-even ROAS is about 2.0**.
- Under BFCM 20% off, hero canvas margin drops from 56% to about 45%, so break-even ROAS rises to about 2.2–2.4.
- Profit comes from email/SMS recovery, bumps, the second portrait, referral, and the Valentine's/Mother's Day repeat. Do **not** require paid media alone to be profitable on the first order in weeks 2–5.

---

## 6. Email and SMS lifecycle (Klaviyo via API from the Next.js server)

Flow benchmarks from Klaviyo's 2026 data ([Klaviyo](https://www.klaviyo.com/blog/abandoned-cart-benchmarks)), average / top 10%:
- **Revenue per recipient:** abandoned cart email $6.77 / $13.70, abandoned cart SMS $4.48 / $8.69, welcome email $5.75 / $13.27, browse abandonment email $2.08 / $4.32, post-purchase email $1.80 / $2.77.
- **Placed-order rate, abandoned cart:** 3.33% average, 7.69% top 10% (2023 data).
- **Abandoned-cart SMS:** about $8.11 per message at 9.1% conversion ([Postscript via Eightx](https://eightx.co/blog/average-ecommerce-sms-revenue-share-by-vertical-2026), secondary source).

**Target:** flows plus campaigns reach 20–30% of revenue by week 8.

### 6.1 Flows to build in week 1, in priority order

**1. Abandoned Preview** (unique to us; trigger: preview + email, no checkout within 1h)
- E1, 1h: "[Dog]'s portraits are ready." Show **their actual portraits**, a "Choose your favorite" button, and a room mockup.
- SMS, 3–4h (opted in only): "[Dog] is still waiting in his velvet robe. Pick your favorite: [link]"
- E2, 24h: How it's made (honest), the guarantee, the free shipping and digital file, and photo tips.
- E3, 48h: "We painted one more for you." Auto-generate a new style, e.g. Holiday Cozy in Q4 or Watercolor on the memorial track.
- E4, 96h, Q4 only: the real cutoff date ("Order by Dec 10 for Christmas"). A gift-with-purchase (free ornament with canvas), not a % discount.
- **Memorial track:** same images, gentle copy, no urgency, no humor, one fewer message.

**2. Abandoned Checkout:** E1 at 45 min, SMS at 2–4h, E2 at 24h, E3 at 48h with the cutoff date. Incentive only on carts ≥$100 and only from E3.

**3. Browse Abandonment** (viewed style or occasion pages, no upload): 2 emails, "See [style] on your dog free".

**4. Welcome** (pop-up or footer signups without a preview): 3 emails. "Upload in 30 seconds", then styles and occasions, then the guarantee and Founding 100.

**5. Post-purchase:**
- Immediately: confirmation, Gift Reveal link, digital file, an "Arrives by" date.
- Status emails and texts: Approved → Printing → Shipped (tracking) → Delivered. Send a proactive delay notice if production slips, because silence is what drives Crown & Paw's 1-star reviews.
- Delivered +3 days: review request (Trustpilot / Google / on-site, **no incentive**) and a separate UGC request ("share a photo on your wall"). An incentive is OK for photo or UGC permission only, disclosed.
- Delivered +7 days: referral, "Give $15, get $15".
- Delivered +21 days: one-click cross-sell. "[Dog] on a mug or ornament, no new photo needed."
- +45–60 days: the next occasion (Valentine's / Mother's Day) and "paint a friend's dog".

**6. Campaigns:** BFCM (early access + 4–5 sends), shipping cutoffs (Dec 3, 8, 10, 14, 15), Gift Reveal (Dec 16–24), post-holiday "gift card redemption" and "treat yourself".

**SMS compliance:** start toll-free / 10DLC verification in **week 1**, because approval can take days to weeks. Collect explicit TCPA consent. Observe quiet hours. Every message carries STOP/HELP.

---

## 7. Referral and viral loops

1. **Gift Reveal page.** Every gift reaches a recipient and their household. The page ends with "Make one of your dog, free preview" plus a give-get code. This should be our biggest loop in December.
2. **"Ask friends to vote".** A shareable preview link ("Which one should I hang?") sends free visitors who all own dogs, or know people who do.
3. **Give $15 / Get $15** (or 15% off for the friend, $15 credit for the referrer). Benchmarks: 5–15% of buyers share, about 2.35% of orders come from referrals on average, strong programs reach 10–30% ([ReferralCandy](https://www.referralcandy.com/blog/referral-rates), [2025 benchmarks](https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025)). Target: 2–5% of orders by day 90. Use the in-house `partners` / `referral_events` tables.
4. **Local partners:** groomers, vets, dog walkers, trainers and daycares get QR cards ("Free portrait preview of your dog") and 10% commission. Printing about 500 cards costs very little and fits the "send me your dog" positioning.
5. **Shelter program:** free portraits of adoptable dogs for partner shelters' listings, plus a Giving Tuesday (Dec 1) donation per order. This is real impact and a strong local-press story. Crown & Paw's version is "$250K+ donated"; ours is visible, specific and immediate.
6. **Instagram "Add Yours" sticker / TikTok replies:** "Drop your dog" → we paint a few daily (with permission) → owners reshare.

---

## 8. Influencer and creator partnerships (channel plan)

- **90-day pipeline targets:** 200 accounts contacted → about 60 replies → 40 seeded → 25+ posts live → 5 partnership/whitelisted ads → creators drive 10–15% of orders (measured by codes, links and the post-purchase survey).
- **Who:** dog accounts with 5K–150K followers and real engagement, breed-specific accounts (goldens, frenchies, doodles, dachshunds), dog-mom lifestyle accounts, trainers and groomers. Memorial and pet-loss creators only with a careful, opt-in brief.
- **Offer:** free canvas or framed portrait (about $45 COGS). The audience gets **15% off**, the creator earns **10% commission on net**; the influencer-order gross margin of 23–41% is modeled in `fulfillment.md`. Paid fees only for proven performers.
- **Rate benchmarks:** pet nano accounts $50–250 per post; micro (10–100K) $400–1,200 for an IG Reel and $300–1,000 for a TikTok ([LaunchPoint nano](https://www.launchpointhq.com/guides/rates/how-much-do-pets-nano-influencers-charge), [micro](https://www.launchpointhq.com/guides/rates/how-much-do-pets-micro-influencers-charge)). Vendor-sourced, so treat as a ceiling.
- **Deliverable:** live preview on camera ("watch my dog become a duke"), then the reveal or unboxing when it arrives. Ask for 60–90 days of paid-usage rights for partnership ads.
- **Timing:** seed by **Nov 6** so posts land Nov 16–Dec 8, before the cutoff.
- **Compliance:** #ad / "Paid partnership" in the content itself, not just the platform label. Required in the brief and in the partner terms.

---

## 9. SEO (groundwork in Q4, payoff in Q1–Q2 and Q4 2027)

**Realistic expectation:** a new domain will not rank for KD 55–60 head terms within 90 days. The aim is to get indexed, rank long-tail and low-KD pages (breed pages, "ai pet portrait" at KD 27), win image search, and be fully ready for Valentine's, Mother's Day and Q4 2027. Target: organic search at 5–10% of sessions by day 90.

**Technical (week 1–2):**
- Server-rendered pages, sitemap, canonical tags.
- Product, Breadcrumb and FAQ schema; Review schema only for real reviews.
- Descriptive image alt text and file names ("golden-retriever-royal-portrait.jpg"), OG images.
- Google Search Console + Bing Webmaster Tools.
- Programmatic **breed × style pages** with unique AI-generated sample portraits per breed. This is a real AI advantage, but pages need unique copy so they aren't thin.

**Getting cited in AI answers:** clear comparison and FAQ pages, plus authentic forum presence, help us get named in answers from ChatGPT, Perplexity and Google AI Overviews.

**Links:** shelter partners, breed clubs, local news (the shelter story), gift-guide PR, dog bloggers, expert-quote request platforms.

### 9.1 Thirty SEO pages, with target keywords

All volumes are RankHero estimates, US-weighted, shown as average monthly / peak ([custom pet portrait](https://www.rankhero.com/keywords/custom-pet-portrait), [pet portrait](https://www.rankhero.com/keywords/pet-portrait), [dog portrait](https://www.rankhero.com/keywords/dog-portrait), [custom dog portrait](https://www.rankhero.com/keywords/custom-dog-portrait), [royal pet portrait](https://www.rankhero.com/keywords/royal-pet-portrait), [pet memorial gift](https://www.rankhero.com/keywords/pet-memorial-gift), [dog memorial gift](https://www.rankhero.com/keywords/dog-memorial-gift), [gifts for dog lovers](https://www.rankhero.com/keywords/gifts-for-dog-lovers), etc.). RankHero is an Etsy-oriented tool whose figures look like Google Keyword Planner buckets, so **validate in Google Keyword Planner or Ahrefs before committing**. "Verify" means no public figure was found.

| # | Type | Page (URL) | Primary keyword (secondary) | Volume avg / peak | Priority · publish |
|---|---|---|---|---|---|
| 1 | Landing | Custom Dog Portraits From Your Photo (`/custom-dog-portrait`) | custom dog portrait (dog portrait) | 2.4K / 5.4K Dec (dog portrait 12.1K / 22.2K) | P1 · W2 |
| 2 | Landing hub | Pet Portraits, See Yours Free (`/pet-portrait`) | pet portrait (custom pet portrait) | 22.2K / 40.5K (8.1K / 14.8K) | P1 · W2 |
| 3 | Landing | Pet Portrait From Photo (`/pet-portrait-from-photo`) | pet portrait from photo (dog portrait from photo) | 1.3K / 2.9K (720 / 1K) | P1 · W2 |
| 4 | Style | Royal Dog Portrait (`/styles/royal`) | royal pet portrait (renaissance dog portrait) | 720 / 1.3K (verify) | P1 · W2 |
| 5 | Occasion | Dog Memorial Portraits (`/dog-memorial-gifts`) | dog memorial gift (dog memorial) | 3.6K / 5.4K (8.1K flat) | P1 · W3 |
| 6 | Occasion | Pet Loss & Sympathy Gifts (`/pet-sympathy-gifts`) | pet memorial gift (pet loss gift, pet sympathy gift) | 12.1K / 18.1K (6.6–8.1K; 1.3K / 1.6K) | P1 · W3 |
| 7 | Occasion | Gifts for Dog Lovers (`/gifts-for-dog-lovers`) | gifts for dog lovers (dog lover gift) | 9.9K / 40.5K Dec | P1 · W3 |
| 8 | Seasonal product | Custom Dog Ornament (`/custom-dog-ornament`) | custom dog ornament | about 150 off-season / 8.1K Nov–Dec | P1 · W3 (needs ornament as a standalone product, $24) |
| 9 | Landing | AI Dog Portrait, Honest and Instant (`/ai-dog-portrait`) | ai pet portrait | 720 / 1.3K (KD 27, easiest win) | P1 · W3 |
| 10 | Seasonal | Christmas Gifts for Dog Owners (`/christmas-gifts-for-dog-owners`) | dog christmas gift (mixed intent: target the owner-gift slice) | 14.8K / 90.5K Dec | P1 · W4 |
| 11 | Style | Watercolor Dog Portrait (`/styles/watercolor`) | watercolor pet portrait | 1.3K / 1.9K | P2 · W4 |
| 12 | Style | Line Art Dog Portrait (`/styles/fine-line`) | line art dog | 2.9K / 3.6K (KD 40) | P2 · W4 |
| 13 | Breed (template) | Golden Retriever Portraits (`/breeds/golden-retriever`) | golden retriever gifts (golden retriever portrait) | 2.4K / 8.1K Dec | P1 · W4 |
| 14 | Breed batch 1 | French Bulldog, Labrador, Dachshund, Goldendoodle, German Shepherd (`/breeds/*`) | "[breed] gifts" / "[breed] portrait" | verify per breed | P2 · W5 |
| 15 | Breed batch 2 | Corgi, Pit Bull, Australian Shepherd, Beagle, Husky, Poodle, Cavalier, Boxer, Shih Tzu, Bernese | "[breed] gifts" / "[breed] portrait" | verify | P2 · W7 |
| 16 | Occasion | Dog Mom Gifts (`/dog-mom-gifts`) | dog mom gift | 4.4K / 12.1K Dec, 9.9K May | P1 · W5 (refresh Apr) |
| 17 | Occasion | Dog Dad Gifts (`/dog-dad-gifts`) | dog dad gift | 4.4K / 14.8K Jun | P2 · W6 (refresh May) |
| 18 | Product | Custom Dog Canvas (`/custom-dog-canvas`) | custom pet canvas | 170 / 260 (high intent, Shopping landing page) | P2 · W5 |
| 19 | Occasion | New Puppy Gifts (`/new-puppy-gifts`) | new puppy gift | 720 / 880 (evergreen) | P3 · W10 |
| 20 | Landing | Two (or More) Dogs in One Portrait (`/multi-dog-portrait`) | two dog portrait / family portrait with dog | verify | P2 · W6 |
| 21 | Seasonal | Last-Minute Gifts for Dog Lovers (`/last-minute-dog-lover-gifts`) | last minute gifts for dog lovers | verify (Dec 10–24 spike) | P1 · W8 |
| 22 | Blog (memorial pillar) | The Rainbow Bridge: Meaning, the Poem's History and Ways to Remember Your Dog | rainbow bridge (rainbow bridge poem) | 135K / 165K (KD 28 per RankHero; SERP is competitive) | P2 · W5. The poem's authorship and copyright are disputed: link to it or quote briefly, don't republish it |
| 23 | Blog | What to Write in a Pet Sympathy Card (60 Messages) | pet sympathy card message | verify | P2 · W6 |
| 24 | Blog | 25 Thoughtful Pet Loss Gift Ideas | pet loss gift ideas | part of the 6.6–8.1K cluster | P2 · W6 |
| 25 | Blog (CVR / remakes) | How to Take the Perfect Photo for a Dog Portrait | dog portrait photo tips | verify (low; supports CVR, cuts remakes) | P1 · W2 |
| 26 | Blog (gift guide) | The Best Gifts for Dog Lovers in 2026 (incl. non-competing picks) | best gifts for dog lovers | part of the 9.9K / 40.5K cluster | P1 · W4 |
| 27 | Blog (linkbait/PR) | Why We Paint Dogs as Royalty: A Short History of Renaissance Pet Portraits | renaissance pet portrait / royal dog painting | verify | P2 · W7 |
| 28 | Blog | Canvas vs. Framed Print vs. Fine-Art Paper: Which Is Best for a Pet Portrait? | canvas vs framed print | verify | P3 · W9 |
| 29 | Blog (decor) | What Size Art Goes Above a Couch, Mantel or Bed? | what size canvas over couch | verify | P3 · W11 |
| 30 | Blog (transparency) | AI Pet Portraits vs. Hand-Painted: An Honest Comparison | ai pet portrait / hand painted pet portrait | 720 / 1.3K | P2 · W8 |

Q1 additions: Valentine's ("valentine gift for dog lover"), National Pet Day, a Mother's Day refresh, and a "Dog holidays calendar 2027" page.

---

## 10. Holiday and occasion calendar

### 10.1 Q4 2026 (inside this plan)

| Date | Moment | Action |
|---|---|---|
| Oct 12–18 | Launch week | Foundations; Founding 100; pitch gift guides now (outlets close holiday guides in Oct/early Nov) |
| Oct 31 | Halloween | Organic-only costume-style content (no trademarked characters) |
| Nov 2–8 | Gifting season opens | Holiday Cozy style + ornament live; "Order by Dec 10" first appears |
| **Nov 26** | Thanksgiving | BFCM early access for email/SMS subscribers |
| **Nov 27–30** | Black Friday → Cyber Monday | **20% off sitewide**, a real event that ends Nov 30 at 11:59pm PT (no timers, no extensions). Gift-category AOV fell about 7% in Cyber Week 2025 ([Eightx/Impact](https://eightx.co/blog/bfcm-aov-lift-benchmarks-by-vertical)), so push Gift Sets and "gift two" |
| Dec 1 | Giving Tuesday | Shelter portrait program + donation per order |
| **Thu Dec 10** | **Our standard-shipping Christmas cutoff** | Printful's 2026 US standard deadline is Dec 11 ([Printful](https://www.printful.com/blog/your-holiday-shipping-and-order-deadlines-guide-free-visuals-included)); we keep a one-day buffer. Confirm wall art is covered by Printful's "Home & living" category. |
| Dec 11–15 | Express window | Paid express upgrade (cost pass-through). Printful express deadline is Dec 16. USPS Ground Advantage cutoff Dec 17, Priority Dec 18 ([USPS](https://www.usps.com/holiday/holiday-shipping-dates.htm)) |
| Dec 14 | Green Monday | Express + Gift Reveal push |
| Dec 16–25 | Last-minute | **Gift Reveal** (e-card scheduled for Christmas morning, print ships after), digital-only, portrait gift cards. Cut Meta spend about 40% and switch creative to concept #13 |
| Dec 26–Jan 10 | Post-holiday | Gift-card redemption; "treat yourself" (own dog); memorial evergreen; review collection |

### 10.2 2027 occasions (plan in weeks 12–13)

| Date | Occasion | Notes |
|---|---|---|
| **Feb 14** (Sun) | Valentine's Day | A record 35% of consumers planned pet gifts in 2026, about $2.1B ([NRF via LGR](https://lgrmag.com/news/valentines-day-2026-spending-to-reach-new-records/)). Physical order-by about **Feb 1**, then Gift Reveal |
| Mar 23 | National Puppy Day | New-puppy angle |
| Apr 11 | National Pet Day | Brand moment, UGC contest |
| **May 9** | Mother's Day (and National Dog Mom's Day, May 8) | "dog mom gift" peaks Apr–May (9.9K). Order-by about **Apr 26** |
| Jun 8 | World Pet Memorial Day | Gentle memorial content |
| **Jun 20** | Father's Day | "dog dad gift" peaks in June (14.8K). Order-by about **Jun 7** |
| Aug 26 | National Dog Day | Biggest owned-media moment of summer |
| Aug 28 | Rainbow Bridge Remembrance Day | Memorial |
| Sep 12 | National Pet Memorial Day | Memorial ([Awareness Days](https://www.awarenessdays.com/awareness-days-calendar/national-pet-memorial-day/)) |
| Sep–Oct 2027 | Q4 prep | Creators seeded by Oct; SEO pages refreshed |

---

## 11. Pricing and offer psychology (within our honesty rules)

1. **Default to the hero:** 16×20 canvas at $99 is preselected and labeled "Most popular". Crown & Paw's comparable list price is $99.95 for 16×24.
2. **Value stack instead of fake anchors:** "$99 includes free US shipping, the hi-res digital file ($29 value) and the love-it guarantee." The digital price ($29 standalone) is a real, honest anchor.
3. **Size ladder that makes the next size feel small:** $79 → **$99** → $115.
4. **Charm prices** ($99, $119, $149) are fine. Never show strikethrough prices except during a real, dated event.
5. **Event promos at ≤20%, plus honest scarcity:**
   - Founding 100: 15% off, with a real counter.
   - BFCM: 20% off for 4 days.
   - Valentine's and December: a gift with purchase (free ornament with canvas) protects margin and brand better than a deeper discount.
6. **Multi-gift in Q4:** "Gift two, save 25% on the second", which works because AI preview cost is close to zero.
7. **Fix the Gift Set price.** It is currently $149, but canvas + mug + ornament with the add-on prices comes to $99 + $25 + $19 = $143. Either:
   - price it at **$135–139** ("save $4–8 vs. separately"; about 55% gross margin at $139 on about $63 COGS), or
   - keep $149 and include a real extra (gift box and card).
8. **Digital as an honest downsell:** shown last, at $29, with a "credit your $29 toward a print within 30 days" upgrade path. Test $19 against the cheap AI apps only if digital-only orders fall below about 5%.
9. **BNPL** shown at ≥$100 ("or 4 payments of $24.75"). It lifts conversion on gifts, but watch the fee.
10. **Guarantee as a conversion lever:** customers approve the art before paying, so remake and refund risk is low. Reserve 3%.
11. **On-time promise for the holidays** (approve before launch): orders placed by our cutoff that miss Dec 24 get a 25% refund, and the Gift Reveal goes out automatically on Christmas morning.

---

## 12. 90-day launch plan: weekly milestones

Workstream teams (sub-agent pods): **Paid** (Meta/Google/TikTok/Pinterest), **Creative** (ads, UGC edits, organic), **CRO** (funnel + experiments), **Lifecycle** (email/SMS/referral), **SEO/Content**, **Partnerships** (creators, PR, shelters, local), **Analytics**, **CX/Ops** (support, fulfillment QA).

| Week | Dates | Milestones | Exit gate (KPI) |
|---|---|---|---|
| **W1** | Oct 12–18 | Site live on domain, Stripe live, 3 real test orders placed through Printful. Meta Pixel + CAPI, GA4, UTM conventions, post-purchase survey. Merchant Center + free listings + Google Customer Reviews. Klaviyo flows 1–5 live. SMS verification submitted. Trustpilot invites on. Social handles. 30+ sample portraits of team/friends' dogs across 12 breeds (labeled samples). Creative batch #1 (12 concepts). Creator list of 200. PR pitches to 30 gift-guide editors and dog bloggers. | Funnel events fire end to end. Preview p50 < 30s. Test order shipped. |
| **W2** | Oct 19–25 | **Soft launch**: friends and family + Founding 100. Meta A $40–60/day, Meta B $15/day. Google brand + Shopping $15/day. Daily TikTok/Reels "send me your dog". 10 creator seeds sent. SEO P1 pages 1–4 and 25 live. | ≥1,000 sessions, ≥150 previews, ≥10 orders. Preview→email ≥40% |
| **W3** | Oct 26–Nov 1 | First creative read: kill the bottom half, add 4 new concepts. Experiments #1–2. SEO pages 5–9 live (ornament, memorial, gifts). Pinterest catalog + 50 pins. First creator posts. | CVR ≥1.2%. Meta CPA ≤$60. First 5 reviews |
| **W4** | Nov 2–8 | Holiday Cozy + ornament push. Gift Set (repriced) + "gift two". "Order by Dec 10" sitewide (static banner). SEO pages 10, 13, 26. All 40 creator seeds shipped by **Nov 6**. TikTok Spark starts. | ≥60 orders cumulative. AOV ≥$100. Email list ≥600 |
| **W5** | Nov 9–15 | Scale Meta to $80–110/day on winners. Partnership ads with the first creator content. BFCM early-access signup (email/SMS). Experiments #4–5. Breed batch 1. Decide whether to keep Meta B. | Blended CAC ≤$45. 7-day ROAS ≥1.8 |
| **W6** | Nov 16–22 | BFCM creative batch (6 concepts). Gift guides publishing. Microsoft Ads import. Landing pages by angle (#6). Pinterest ads on. | ≥15 reviews. Flows ≥12% of revenue |
| **W7** | Nov 23–29 | **BFCM**: early access Nov 26, 20% off Nov 27–30. Meta $150–170/day. Daily email/SMS (5 sends). CX staffed for 2-hour replies. Watch production capacity and print QA daily. | Peak-week CVR ≥2.5%. MER ≥3.0 for the week |
| **W8** | Nov 30–Dec 6 | Cyber Monday (ends Nov 30). Back to full price Dec 1 + Giving Tuesday shelter tie-in. Cutoff emails Dec 3. Last-minute and Gift Reveal pages built (SEO #21). Breed batch 2. | Blended CAC ≤$35. AOV ≥$115 |
| **W9** | Dec 7–13 | **Standard cutoff Thu Dec 10.** Cutoff emails Dec 8 and 10. Express upgrade from Dec 11. Gift Reveal creative ready. Last week of full-throttle spend. | ≥200 orders cumulative. Late-order rate <3% |
| **W10** | Dec 14–20 | Express cutoff Dec 15. Pivot to Gift Reveal, digital and gift cards. Meta −40%. Green Monday. Proactive shipping updates to every open order. | Gift Reveal share ≥30% of Dec 16–24 orders |
| **W11** | Dec 21–27 | Christmas-morning Gift Reveal sends. Dec 26+: gift-card redemption and "treat yourself". Review and UGC asks to all delivered orders. | ≥40 public reviews, rating ≥4.6 |
| **W12** | Dec 28–Jan 3 | Retro: channel MER, creative winners, funnel leaks, cohort AOV. Memorial evergreen campaigns. SEO pages 28 and 30. Reset Meta to $40–50/day. | 90-day forecast vs. actual written up |
| **W13** | Jan 4–10 | Q1 plan: Valentine's (order-by Feb 1), creative batch #6, referral push to all customers, affiliate program opened to all creators. Set Q1 targets. | Q1 plan approved. List ≥2,500 |

**Weekly rhythm:**
- Mon: KPI review (MER, CAC, CVR by step, AOV, flow revenue, creative leaderboard).
- Tue: creative sprint.
- Wed: launch new concepts and experiments.
- Thu: creator and PR outreach.
- Fri: CX and fulfillment QA review.

---

## 13. KPI targets and benchmark sources

| KPI | W2–5 (learn) | W6–10 (peak) | W11–13 (post) | Benchmark / basis |
|---|---|---|---|---|
| Site CVR (orders ÷ sessions) | 1.2–1.5% | 2.0–2.5% | 1.3–1.6% | Gifts 3.38% [Polar](https://www.polaranalytics.com/ecommerce-benchmarks); gifts 3.13% [Grips](https://gripsintelligence.com/insights/rankings/top-ecom-stores-gifts); Crown & Paw 2.5–3.0% [Grips](https://gripsintelligence.com/insights/retailers/crownandpaw.com); Meta median 1.57% [Triple Whale](https://www.triplewhale.com/blog/facebook-ads-benchmarks) |
| AOV | $100–105 | $115–125 | $105–110 | Gifts $86–87 (Polar/Grips); Crown & Paw $150–175, West & Willow $250–275 (Grips); Cyber Week gifts AOV −7% [Eightx](https://eightx.co/blog/bfcm-aov-lift-benchmarks-by-vertical) |
| Meta new-customer CPA | ≤$55 | ≤$40 | ≤$50 | Break-even is about $55 at $110 AOV and about 50% contribution (internal margin model) |
| Meta ROAS (7d click / 1d view) | ≥1.8 | ≥2.5 | ≥2.0 | Median 1.93 (Triple Whale 2025); DTC panel median 2.96 [TopGrowth](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/) |
| Google Shopping + non-brand search ROAS | ≥2.5 | ≥3.5 | ≥3.0 | Our assumption: higher intent than social |
| TikTok Spark ROAS | ≥1.5 | ≥2.0 | — | 2025 median 2.21 [Triple Whale](https://www.triplewhale.com/blog/tiktok-benchmarks) |
| **Blended MER** | ≥2.0 | ≥3.5 | ≥2.5 | **90-day ≥3.0** |
| Blended new-customer CAC | ≤$50 | ≤$32 | ≤$40 | |
| Preview → email | ≥45% | ≥50% | ≥50% | Generic pop-ups 4.82% avg [Wisepops](https://wisepops.com/use-cases/welcome-popups) |
| Upload → purchase (7d) | 6–8% | 10–12% | 7–9% | Internal assumption |
| Abandoned-preview RPR (email) | ≥$3 | ≥$6 | ≥$4 | Abandoned cart $6.77 avg / $13.70 top 10% [Klaviyo](https://www.klaviyo.com/blog/abandoned-cart-benchmarks) |
| Email + SMS share of revenue | 10–15% | 20–25% | 25–30% | |
| Referral share of orders | — | 1–2% | 2–5% | 2.35% avg [ReferralCandy](https://www.referralcandy.com/blog/referral-rates) |
| Creator-attributed orders | 5% | 10–15% | 10% | Codes + links + survey |
| Public review rating | — | ≥4.6 | ≥4.7 | Crown & Paw Trustpilot 3.8 (internal research) |
| On-time delivery (orders placed before cutoff) | — | ≥97% | — | Crown & Paw's top complaint |
| Remake/refund rate | ≤4% | ≤3% | ≤3% | 3% reserve |

### 13.1 Base-case forecast

| Period | Sessions | CVR | Orders | AOV | Revenue | Spend | MER |
|---|---|---|---|---|---|---|---|
| M1 (Oct 12–Nov 8) | about 5,000 | 1.3% | about 65 | $102 | about $6.6K | $3,500 | 1.9 |
| M2 (Nov 9–Dec 13) | about 8,000 | 2.0% | about 160 | $118 | about $18.9K | $5,000 | 3.8 |
| M3 (Dec 14–Jan 10) | about 6,000 | 1.35% | about 80 | $108 | about $8.6K | $3,000 | 2.9 |
| **90 days** | **about 19,000** | **1.6%** | **about 305** | **about $112** | **about $34K** | **$11,500** | **about 3.0** |

At about 50% contribution, that is roughly $17K, or about **+$5.5K after marketing**, plus a list of 2.5–4K subscribers and about 300 customers going into Valentine's.

How the M2 orders break down:
- Meta: $2.7K at about $40 CPA ≈ 68 orders.
- Google: about 18.
- TikTok/Pinterest: about 5.
- Creators, email/SMS, referral, organic and direct: about 70.

**Stretch case** (a top-quartile creative, one creator or TikTok hit, or a gift-guide placement): about 600 orders and about $70K.
**Downside trigger:** if blended CAC stays above $55 through Nov 15, cut Meta B and the bottom-tier creatives, move 30% of spend to creator whitelisting and Shopping, and push GWP offers through the flows.

---

## 14. Compliance and brand guardrails (non-negotiable)

- **No fabricated social proof:** no fake reviews, counts, press logos or "as seen on". No review gating. No incentives on Trustpilot or Google reviews (FTC 16 CFR Part 465).
- **No fake urgency:** no countdown timers, no permanent sales, no fake stock levels. Use real dates only: cutoffs, BFCM end, the Founding 100 counter.
- **Influencers:** #ad / "Paid partnership" in the content itself. Material connection disclosed in Stories frames.
- **SMS:** TCPA express written consent, quiet hours, STOP/HELP. **Email:** CAN-SPAM footer and address.
- **Customer dogs** appear in marketing only with explicit, unchecked-by-default opt-in.
- **No trademarked characters or franchises** in styles or ads. **No competitor names** in UI or ad copy.
- **AI transparency:** never claim "hand-painted". The FAQ explains the process; headlines lead with the outcome.

---

## Sources

Competitors and market:
- [Grips: crownandpaw.com Aug 2026](https://gripsintelligence.com/insights/retailers/crownandpaw.com) · [Grips: gifts category](https://gripsintelligence.com/insights/rankings/top-ecom-stores-gifts)
- [Awin: Crown & Paw program](https://ui.awin.com/merchant-profile/57823) · [MuteSix: Crown & Paw case study](https://mutesix.com/case-study/crown-paw/) · [GRIN: Crown & Paw](https://app.grin.ai/brands/crownandpaw.com) · [Crown & Paw home](https://www.crownandpaw.com/) · [How it works](https://www.crownandpaw.com/pages/how-it-works)
- [Trustpilot: Crown & Paw](https://uk.trustpilot.com/review/crownandpaw.com?page=9) · [Motion: West & Willow ad library](https://motionapp.com/library/west-and-willow) · [West & Willow pricing](https://westandwillow.com/products/custom-one-pet-portrait)
- [Stork AI pet portrait](https://www.stork.ai/tools/pet-portrait) · [APPA 2025 industry](https://americanpetproducts.org/news/u.s.-pet-industry-reaches-158-billion-in-2025-poised-for-continued-growth-in-2026) · [NRF Valentine's 2026 via LGR](https://lgrmag.com/news/valentines-day-2026-spending-to-reach-new-records/) · [CO/AI survey on AI art](https://getcoai.com/news/survey-62-of-americans-want-ai-as-creative-tool-not-replacement/)

Benchmarks:
- [Polar Analytics benchmarks](https://www.polaranalytics.com/ecommerce-benchmarks) · [Triple Whale Meta](https://www.triplewhale.com/blog/facebook-ads-benchmarks) · [TopGrowth Meta DTC](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/) · [Triple Whale TikTok](https://www.triplewhale.com/blog/tiktok-benchmarks)
- [AdMake CPM by month](https://admakeai.com/blog/cost-per-impression-cpm-explained) · [WordStream 2025 via ShopiFreaks](https://www.shopifreaks.com/google-ads-cpcs-rose-to-5-42-in-2025-with-87-of-industries-seeing-increases-but-conversion-rates-climbed-to-8-18-as-automation-improves/) · [Jon Loomer: Andromeda creative diversification](https://www.jonloomer.com/meta-andromeda-creative-diversification/)
- [Klaviyo flow benchmarks](https://www.klaviyo.com/blog/abandoned-cart-benchmarks) · [Postscript SMS via Eightx](https://eightx.co/blog/average-ecommerce-sms-revenue-share-by-vertical-2026) · [Baymard via Red Stag](https://redstagfulfillment.com/percentage-of-online-shoppers-abandon-their-cart/) · [Wisepops pop-ups](https://wisepops.com/use-cases/welcome-popups)
- [ReferralCandy referral rates](https://www.referralcandy.com/blog/referral-rates) · [ReferralCandy 2025 benchmarks](https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025) · [Eightx BFCM AOV](https://eightx.co/blog/bfcm-aov-lift-benchmarks-by-vertical)
- [LaunchPoint pet micro rates](https://www.launchpointhq.com/guides/rates/how-much-do-pets-micro-influencers-charge) · [LaunchPoint pet nano rates](https://www.launchpointhq.com/guides/rates/how-much-do-pets-nano-influencers-charge)

Keywords (RankHero):
- [pet portrait](https://www.rankhero.com/keywords/pet-portrait) · [custom pet portrait](https://www.rankhero.com/keywords/custom-pet-portrait) · [dog portrait](https://www.rankhero.com/keywords/dog-portrait) · [custom dog portrait](https://www.rankhero.com/keywords/custom-dog-portrait) · [pet portrait from photo](https://www.rankhero.com/keywords/pet-portrait-from-photo) · [royal pet portrait](https://www.rankhero.com/keywords/royal-pet-portrait)
- [pet memorial gift](https://www.rankhero.com/keywords/pet-memorial-gift) · [dog memorial gift](https://www.rankhero.com/keywords/dog-memorial-gift) · [dog memorial](https://www.rankhero.com/keywords/dog-memorial) · [pet loss gift](https://www.rankhero.com/keywords/pet-loss-gift) · [pet sympathy gift](https://www.rankhero.com/keywords/pet-sympathy-gift) · [rainbow bridge](https://www.rankhero.com/keywords/rainbow-bridge)
- [gifts for dog lovers](https://www.rankhero.com/keywords/gifts-for-dog-lovers) · [dog lover gift](https://www.rankhero.com/keywords/dog-lover-gift) · [dog christmas gift](https://www.rankhero.com/keywords/dog-christmas-gift) · [custom dog ornament](https://www.rankhero.com/keywords/custom-dog-ornament) · [dog mom gift](https://www.rankhero.com/keywords/dog-mom-gift) · [dog dad gift](https://www.rankhero.com/keywords/dog-dad-gift)
- [ai pet portrait](https://www.rankhero.com/keywords/ai-pet-portrait) · [watercolor pet portrait](https://www.rankhero.com/keywords/watercolor-pet-portrait) · [line art dog](https://www.rankhero.com/keywords/line-art-dog) · [golden retriever gifts](https://www.rankhero.com/keywords/golden-retriever-gifts) · [new puppy gift](https://www.rankhero.com/keywords/new-puppy-gift) · [custom pet canvas](https://www.rankhero.com/keywords/custom-pet-canvas) · [dog portrait from photo](https://www.rankhero.com/keywords/dog-portrait-from-photo)

Calendar and compliance:
- [USPS 2026 holiday dates](https://www.usps.com/holiday/holiday-shipping-dates.htm) · [Printful 2026 holiday deadlines](https://www.printful.com/blog/your-holiday-shipping-and-order-deadlines-guide-free-visuals-included) · [National Pet Memorial Day](https://www.awarenessdays.com/awareness-days-calendar/national-pet-memorial-day/)
- [FTC Consumer Review Rule (Crowell)](https://www.crowell.com/en/insights/client-alerts/keeping-it-real-ftc-targets-fake-reviews-in-first-consumer-review-rule) · [FTC enforcement (JD Supra)](https://www.jdsupra.com/legalnews/five-stars-zero-tolerance-ftc-turns-up-3594404/)

Internal research:
- `/home/user/Pupprints2/docs/research/cp-site.md`, `/home/user/Pupprints2/docs/research/cp-reviews.md`, `/home/user/Pupprints2/docs/research/fulfillment.md`, `/home/user/Pupprints2/web/src/lib/catalog.ts`