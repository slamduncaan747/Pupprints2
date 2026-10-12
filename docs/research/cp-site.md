# Crown & Paw (crownandpaw.com): Competitive Teardown for Pup Prints

Research was done on 2026-10-12. I pulled the live storefront HTML, the Shopify `/products.json` endpoint (8 pages), `/collections.json` (3 pages), per-product `.js` endpoints, the policy pages, the live Klaviyo form config and the web-pixel and Elevar configs. A few external sources (Trustpilot, Grips Intelligence, Awin, GRIN) fill gaps the site can't show.

Raw data saved in the scratchpad:
- Full catalog JSON: `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/cp/all_products.json`
- Every variant as CSV (30,402 rows): `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/cp/crownandpaw_variants.csv`
- Klaviyo popup config: `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/cp/klav_forms.json`

---

## 1. Snapshot

| Metric | Value (source) |
|---|---|
| Platform | Shopify behind Cloudflare. The theme is a heavily customized **Debut 16.6.0** ("Crown-and-Paw/main"), built by **Thatworks Agency**, with a custom Vue cart drawer |
| HQ / returns address | 1321 Upland Dr, Unit 4744, Houston TX 77043 |
| Founder | Adam Reed (TechRound). Trustpilot profile claimed Sept 2019; the site says "since 2019" |
| Catalog size | **1,963 public products / 30,402 variants**. 597 collections. The "Shop All" collection reports 4,756 products |
| Portraits made (self-reported) | Three conflicting figures: **850,000+** (homepage), "over 650,000" (product pages), "over 1 million" (Awin profile) |
| On-site reviews (Loox) | "Rated 4.8 from **58K+** reviews" on the homepage and "55k+" on product pages. Awin says "30,000 5-star". Examples: The General has 2,934 reviews, Modern Portrait 1,203, Vintage T-shirt 540 |
| Trustpilot | **3.8/5 from 20,195 reviews**: 72% 5★, 10% 4★, 5% 3★, 3% 2★, **10% 1★** |
| Instagram | About 222K followers (third-party Socialveins figure, unverified) |
| Traffic and revenue (Grips Intelligence, Aug 2026, **low confidence**) | $263.1K/month revenue, 56.3K sessions, 1,535 transactions, 2.5–3.0% conversion, $150–175 AOV, about $3M GMV in 2025. In the same set, Cuddle Clones is at $788K/month and West & Willow at $398K/month. This panel data looks too low next to 850K portraits since 2019, so treat it as a floor |
| Charity claim | "$250,000+ donated" to Humane World for Animals and Best Friends |
| Sister brands / regional sites | Masterpiece Me (masterpieceme.co, human portraits), crownandpaw.co.uk, crownandpaw.ca |

---

## 2. Product catalog and pricing

### 2.1 Catalog by product type (from `products.json`)

| Type | # products | Price range |
|---|---|---|
| Canvas | 452 | $29.00–$599.00 |
| Poster | 280 | $29.95–$169.95 |
| Mug | 217 | $18.99–$99.95 |
| Blanket | 215 | $19.95–$149.95 |
| Throw Pillow | 197 | $24.99–$129.95 |
| Framed Poster | 140 | $19.95–$499.95 |
| Phone Case | 116 | $29.95–$64.95 |
| Puzzle | 63 | $79.95–$109.95 |
| Sticker | 58 | $20–$40 |
| Sweatshirt | 32 | $39.95–$89.95 |
| Socks | 32 | $19.95–$39.95 |
| T-Shirt | 30 | $29.95–$42.95 |
| Knitwear | 20 | $129.95 |
| Ornament | 19 | $12.99–$29.95 |
| Greeting Card | 17 | $9.95–$32.95 |
| Custom Clothing | 11 | $59.95–$99.95 |
| Replica (plush "pet clone") | 6 | $199–$349 |

Smaller lines: hats, wrapping paper, Christmas sacks, hoodies, baby tees, doormats, hooded blankets, hand-painted ceramics, a Hawaiian shirt, pajamas, boxer briefs, a tote, a golf towel, a $34.95 photobook, a clay figurine, and a $159.95 loungewear set.

Launch cadence: 704 products were created in 2020, 546 in 2022, about 140 a year since, and 98 so far in 2026. Of those, **70 were added in Sept–Oct 2026** (holiday push: Christmas cards, Santa mugs, sweatshirts, "Sleeping Poses").

### 2.2 Flagship price ladders (exact variant prices)

**Renaissance canvas, e.g. "The General" or "The Queen of Roses"** (24 variants: Size × Frame). Each cell shows price, then compare-at price.

| Size | Unframed | Black / White frame | Gold / Silver frame |
|---|---|---|---|
| Digital Download | $39.95 (cmp $79.95) | – | – |
| 8"×10" | $69.95 ($79.95) | $129.95 ($149.95) | $149.95 ($169.95) |
| 12"×18" | $89.95 ($99.95) | $149.95 ($169.95) | $169.95 ($189.95) |
| 16"×24" (their stated top seller) | $119.95 ($129.95) | $199.95 ($219.95) | $209.95 ($239.95) |
| 24"×36" | $179.95 ($199.95) | $259.95 ($299.95) | $269.95 ($309.95) |
| 32"×48" | $269.95 ($299.95) | $409.95 ($439.95) | n/a |

The most common canvas ladder (218 of 452 canvases, e.g. "Penelope") has no digital option and runs $10 lower: 8×10 unframed **$59.95**, 12×18 $79.95, 16×24 $99.95, 24×36 $159.95, 32×48 $249.95. Framed 8×10 is $119.95 in black/white and $139.95 in gold/silver; framed 32×48 is $399.95.

Homepage display is "~~$79.95~~ Save $40 **From $39.95**". The "From" price is the **digital download**, not a physical product. Trustpilot complaints say customers received a digital file when they expected a canvas.

**Modern Pet Portrait (their #1 best seller; framed poster with White, Charcoal or Rainbow "LIMITED EDITION" backgrounds)**

| Size | 1 pet: unframed / framed | 2 pets | 3 pets | 4 pets |
|---|---|---|---|---|
| Digital | $39.95 | $49.95 | $49.95 | $49.95 |
| 8×10 | $59.95 / $79.95 | $69.95 / $99.95 | $79.95 / $109.95 | $79.95 / $129.95 |
| 12×16 | $69.95 / $99.95 | $79.95 / $129.95 | $89.95 / $139.95 | $89.95 / $159.95 |
| 18×24 | $79.95 / $149.95 | $89.95 / $169.95 | $99.95 / $209.95 | $99.95 / $229.95 |

Frame colors: Black, Walnut, White. Modern portraits show no compare-at price.

**Other common ladders (the dominant pattern for each type)**
- **Poster**: Digital $39.95 (cmp $59.95), 8×10 $39.95 (cmp $49.95), 12×16 $49.95, 18×24 $59.95. That means digital and an 8×10 print cost the same.
- **Restroom/Bathroom portrait** (canvas or poster, 7 background colors): digital $39.95, canvas $69.95 / $89.95 / $109.95, poster $49.95 / $59.95 / $69.95.
- **LED Night Light portrait**: 9×13 $59.95 (cmp $79.95), 13×19 $119.95 (cmp $139.95). Black or Oak frame; themes Green Aurora, Purple Aurora, Rainbow, Nature, Tie Dye, 4th of July.
- **Watercolor Sketch**: digital or 8×10 unframed $39.95, framed 8×10 $79.95, framed 12×16 $99.95, framed 18×24 $149.95.
- **Mug**: 11oz $39.95 (cmp $49.95), 15oz $49.95 (cmp $59.95). Multi-pet versions are $10 more.
- **Blanket**: 30×40 $69.95, 50×60 $89.95, 60×80 $109.95 (each cmp +$10).
- **Throw pillow**: 14×14 $49.95, 18×18 $59.95, 26×26 $99.95.
- **Phone case**: $39.95 (cmp $49.95) across iPhone 12–16.
- **Puzzle**: 11×14 $79.95 (cmp $89.95).
- **Stickers**: 3 for $20, 5 for $20, 10 for $30.
- **T-shirt**: $29.95 (cmp $39.95). **Socks**: $19.95, or $22.95 with black tips. **Embroidered sweatshirt**: $69.95. **Premium Christmas sweatshirt**: $79.95 (cmp $99.95). **Knit sweater**: $129.95. **Embroidered hats**: $39.95.
- **Ornaments**: $15.99–$17.99. **Greeting cards**: $9.95–$17.95.
- **Human Royal Portrait**: digital $29.95; canvas $69.95–$349.95.
- **Premium handmade items** (marked up 50% or more):
  - Plush "pet clone": 7.8" or 13.8" $199, 16.1" $249, 21.6" $349. Standard production 6 weeks, rush 4 weeks. Optional "memory pouch" for ashes.
  - Felt 3D face in frame: $299–$319.
  - Leather or felt keychains: $279.
  - Felt ornament: $329.
  - Hand-painted ceramic mug or plate: $89.95.
  - Clay figurine: $99.95, or $174.95 with the owner.
- **Gift cards**: $10, $25, $50, $100, $200, $250, $500.

**Add-on SKUs:**
- "Preview Your Artwork Sooner" (queue jump): $10
- "Digital Download of Your Artwork": $10 (cmp $39.95)
- Certificate of Authenticity: $4.99
- Gift Message Insert, a printed 6×4 card (SKU `GMI-CUSTOM`): $4.99
- Metal card easel: $6.95
- Acrylic case: $9.95
- Frame upsell SKUs: $24.17–$146.37

### 2.3 Discount posture
- **85% of products (1,678 of 1,963) show a compare-at price above the sale price.** The "sale" is permanent.
- A "Sale: 30% Off" collection holds 31 products, mostly newer illustration styles at $49.95–$59.95.

---

## 3. Art styles and themes

They sell **costume templates** rather than art styles. Each "costume" (The General, The Admiral, The Queen of Roses, and so on) is its own product, made in canvas, poster, mug, blanket, pillow, phone case and puzzle versions. That is why the catalog has 1,963 products.

Theme tags across the catalog:
- Film-and-TV: 615 products
- Renaissance: 447
- Other: 366
- Sports & Hobbies: 176
- Jobs: 175
- Christmas: 89
- Military: 64
- "A Galaxy Far Far Away": 62
- American Football: 34
- Halloween: 30
- Formula One: 30
- The Office: 30
- LOTR: 25
- Stranger Things: 25
- Game of Thrones: 23
- Coffee-Shop Friends (Friends parody): 22
- Modern Family: 22
- Bridgerton: 20
- Downton: 18
- Baseball: 16
- Super Pets: 14
- Music: 14
- House of the Dragon: 12
- Toy Story: 11
- Soccer: 11
- Pets-With-Food: 11
- Floral Crown: 10
- Jurassic Park: 9
- Big Bang: 8
- Glastonbury: 7
- Bathroom: 5
- Top Gun: 4
- Video Games: 4
- Squid Game: 1

Style tags: Vector (Modern), Cutout, Watercolor, Premium Watercolor, Embroidery, Knit, Illustration, Line Art, Kawaii, Two-Tone, Funny Cartoon, Cute, Ugly, Airbrush, Luxury, Hungry Pets.

Named costume examples:
- **Male**: The General, Admiral, Colonel, Ambassador, Noble, Astronaut, Young King, Veteran, Aristocrat, Count, Peaky Blinder, King in the North, Bark Knight
- **Female**: Queen, Queen of Roses, Sapphire Queen, Princess, Duchess, Dame, Queen Regent, Golden Girl, Baroness, Ballerina
- **Groups**: Step Brothers, Brothers in Arms, Rulers, American Gothic, Mean Girls (3 or 4 pets), Family of Three, Jim & Pam, Simon & Daphne
- **Sports parodies**: Real Pawdrid, Pawyern Munich, Liverpawl, Pawchester City, Boston Paw Sox, Seattle Scratchers
- **Newer non-costume styles**: Modern (vector, 3 backgrounds), Watercolor Sketch, Pet Poses Sketch, Sleeping Poses, Dog Walk, Big Stretch, Asian-style (Eating Noodles, Drinking Tea, In The Kitchen), Night Light, Magazine Cover, Restroom/Bathroom, Spa Day, Kitten-to-Adult, Puppy-to-Adult, Mom & Pet, Dad & Pet, gold or silver foil, Luxury Trunk

Supported pet counts: 1, 2, 3, 4, 5 and 6 pets (collections exist for each). Navigation also splits by Male and Female pets.

Observation: a lot of the catalog is **parody of trademarked IP** (Star Wars, LOTR, Stranger Things, Squid Game, Bridgerton, football clubs). That is a legal risk Pup Prints should not copy.

---

## 4. Ordering flow, step by step

1. **Discover.** Homepage hero: "One-of-a-kind Custom Pet Portraits — Hand-illustrated custom portraits made from your pet photos." The "Love Lasts Forever" mega-menu card says "A best selling gift for 3 years running. Upload a pet photo and we'll do the rest!" Navigation splits by style, pet count, gender and product type.
2. **Product page with a tabbed builder: `SIZING → FRAMING → [BACKGROUND] → UPLOAD → Extras`.**
   - *Size*: Digital Download, 8×10, 12×18, 16×24, 24×36, 32×48, plus a size guide.
   - *Frame*: No Frame, or Black / Gold / White / Silver for canvas (Black / Walnut / White for posters). Frames carry "Bestseller" badges and the line "Handcrafted wooden frame from renewable forests… ready to hang."
   - *Background* (Modern only): White, Charcoal or Rainbow, each labelled "LIMITED EDITION".
   - *Upload*: handled by the **UploadKit** app. Options are "Upload photo(s) now" or "**Send photo(s) later**" (they email an upload link). There is an optional "Pet's Name / Custom Text" field. Photo guide: close-up, eye level, natural light, no blur, ears in frame, minimum 500×500 px.
   - *Extras*:
     - Preview Sooner, +$10 ("see a preview within 24 hours")
     - Digital Download, +$10 ("SAVE $29.95")
     - Certificate of Authenticity, +$4.99
     - FREE matching mug, "Save $39.95", with any framed portrait or canvas
     - Gift message card, +$4.99
   - A subtotal shows strike-through savings ("$79.95 → $39.95, SAVING $40.00"), a free-shipping progress line ("You're only $X away from FREE SHIPPING"), and "Order now to see your artwork proof in 1–2 days". The button reads **NEXT STEP → ADD TO CART**.
3. **Cart.** A custom Vue slide-out drawer injects **Onward "Checkout+"**: shipping protection plus cashback, priced in tiers from $0.98 to $140.30 by cart value. The customer has to click "continue without Checkout+" to opt out. Trustpilot reviews call it auto-added.
4. **Checkout.** Shopify checkout with Shop Pay, PayPal (no Venmo), Apple Pay, Google Pay, Klarna (US instalments), Visa, Mastercard, Amex, Discover, Diners, Maestro, UnionPay and **USDC**. **There is no Afterpay.**
5. **After purchase.**
   - Photo QC "within 1 hour".
   - Digital proof by email in **1–2 days**. Some pages say 2–3 days, and apparel proofs take 2–3 days. With the $10 queue jump, 24 hours.
   - The proof is viewed in a customer portal at `orders.crownandpaw.com` ("Track My Order" requires sign-in).
   - "Unlimited" small edits are free, but only **one** photo or costume swap is free. After that each change costs **$10**.
   - **72-hour auto-approval**: if the customer doesn't reply, it goes to print.
6. **Production and shipping.** Printing starts within 48 hours of approval. Shipments are tracked through `crownandpaw.aftership.com`, with updates by email or SMS. The shipping page frames the realistic total as "usually up to 2 weeks".

**Apparel works differently.** Clothing uses the **Teeinblue** personalizer, which shows a "**Live Preview**" of the uploaded photo on the garment before purchase ("Ships in 2–3 Days"). Portraits, their core product, have **no instant preview**. Customers pay first and wait 1–2 days for a human-made proof.

**What the work actually is.** Marketing says "Hand-illustrated by real artists" and "Designed by hand". The FAQ says: *"We do not paint from scratch. We are a digital design studio and we use a range of proprietary photo editing techniques, professional photo re-touching…"*. In other words, they paste the pet's head onto a costume template. They also can't change backgrounds, add accessories, open a closed mouth or colorize black-and-white photos.

---

## 5. Turnaround, shipping and policies

**Turnaround**
- Proof: 1–2 days (24 hours with the $10 add-on).
- Print and ship: within 48 hours of approval. The shipping page says "2–5 days to be created and shipped".

**Transit times**

| Destination | Working days |
|---|---|
| USA | 3–5 (the FAQ says 2–5) |
| Canada, Australia, UK | 5–7 |
| Europe | 5–10 |
| Rest of world | 10–15 |

**Shipping fees and thresholds**
- Flat fee per order: $9.95 for US, CA, AU, UK and EU. Rest of world is $17.95 in the FAQ and $19.95 on the shipping page (they contradict each other).
- **Free shipping threshold: $75 in the US** (the theme sets `__themeFreeShippingThresholdCents = 7500`). The header also shows "Free Shipping Over $100", apparently the threshold for other markets.
- Christmas guidance: order by **Dec 10**. They offer no guaranteed-Christmas option, only the queue jump. Trustpilot reviews say December orders arrived after Christmas.

**Returns and guarantees**
- No returns on custom portraits. The "100% satisfaction guarantee" means **redo and replace** if the customer is unhappy with the item they received.
- Wrong or damaged items must be reported within 48 hours.
- Warranty: 30 days, "one-time courtesy" refund or reship.
- Clothing: 30-day returns, customer pays return shipping, "no pet hair", first exchange free within 14 days.

**Order changes and fees**
- Changes are allowed within 24 hours of ordering.
- Cancelling after the artwork is made costs a $10 fee.
- No refund if the customer refuses to supply a better photo.
- No refund for black-and-white output from a black-and-white photo.

**Support**
- Gorgias chat, support@crownandpaw.com, and a contact form promising a reply within 24 hours. The FAQ says "within a couple of hours" and claims "24/7 support".
- A Trustpilot reviewer said a reply took 4 days.

---

## 6. Conversion, AOV and retention tactics

1. **Announcement bar**: "EXTRA 25% OFF OUR BEST SELLERS".
2. **Countdown timer section**: "ORDER BY [TIMER] FOR 25% OFF". The target date was 2026-10-12T05:00:00 and the section hides when it expires, so it is a rolling deadline.
3. **Permanent compare-at pricing**: "Save $40" badges on 85% of SKUs, and a "From $39.95" price that is really the digital download.
4. **Free mug gift (worth $39.95–$40)** with any framed portrait or canvas, claimed at the Extras step. This is the main offer in their popups.
5. **Klaviyo popups** (company ID `NXithY`; each popup shows at most once a day):
   - *Desktop, US*: "CLAIM YOUR FREE PET FACE MUG TODAY", shown after 6 seconds. Email first, then a second step, "JOIN SMS VIPS". The success message is "Get a FREE mug (worth $40) when you order any portrait today."
   - *Mobile, US* (A/B "Treatment" variant): shown at 39% scroll. Free mug offer, then SMS opt-in, then "**Use the code CPWELCOME for 10% off**".
   - *Outside the US*: free mug popup after 8–9 seconds.
   - *Desktop exit intent*: "ARE YOU SURE? DON'T MISS YOUR CHANCE TO CLAIM YOUR FREE MUG".
   - *Embroidered clothing and loungewear pages*: "CLAIM YOUR 10% OFF CLOTHING TODAY", shown after 6 seconds.
6. **Extras-step upsells**: queue jump $10, digital file $10, certificate $4.99, gift card insert $4.99.
7. **Frame upsell**: framing adds $60–$80 on 8×10 canvas ($69.95 unframed vs $129.95–$149.95 framed). Frames carry "Bestseller" badges, and backgrounds are labelled "LIMITED EDITION".
8. **Multi-pet ladders**: each extra pet adds $10–$20 unframed, and framed prices step from $79.95 for one pet to $129.95 for four.
9. **Free-shipping progress bar** at $75.
10. **Onward Checkout+**, sold as an "upgrade" covering shipping protection, cashback rewards, free returns, priority support, carbon-neutral shipping and a $10 charity gift. It is effectively opt-out.
11. **Kaching Bundles** app, which handles bundles and quantity breaks. The cart also has "free gift options" (digital download and queue jump) and a "Free Socks" collection.
12. **Loyalty**: "Crown & Paw Rewards", run through Shopify customer accounts, plus Onward cashback.
13. **Referral and affiliate**: Social Snowball referral script. Affiliates are on **Awin** (advertiser 57823, **60-day cookie**, influencer codes allowed). The footer still links "Affiliate Sign Up" to **ShareASale** (merchant 144318), which suggests they migrated. Their GRIN marketplace listing shows "No active partnerships".
14. **Email and SMS**: Klaviyo for both, plus **OneText** SMS. The SMS consent copy mentions cart reminders.
15. **Gifting angle** throughout ("What do you buy the person who has everything?") and **memorial** angle in reviews: 3 of the 6 homepage testimonials are about pets that died or were sick.
16. **Seasonal collections**: Christmas, Halloween, Mother's Day, Father's Day, Valentine's, St Patrick's, Super Bowl, 4th of July, "Black Friday 2026 Personalized Gifts" (61 products), and gift collections by price ($20, $30, $40, $60).
17. **Content and SEO**: 188 blog articles, mostly generic dog topics such as "Why Do Dogs Sleep So Much?" and "Best Dog Movies". Long SEO copy blocks sit at the bottom of the homepage. They expose `/.well-known/ucp` and `sitemap_agentic_discovery.xml` for Shopify agentic-commerce discovery.

---

## 7. Trust signals

- "Rated 4.8 from 58K+ reviews", served by **Loox** (photo reviews). Each product page shows its own count, e.g. 2,934 for The General.
- Volume claims: "850,000+ created since 2019" and "Over 800,000 Happy Pet Parents".
- Badges: "Free proofs + revisions", "Handmade by Real Artists", "Unlimited FREE Revisions", "Artwork ready in 1–2 Days", "100% happiness guarantee", "$250,000+ donated to shelters!"
- Press: **text only, no logo bar**. Product descriptions include "As seen on TV, HuffPost, Forbes, Buzzfeed, Reddit and more". Third-party coverage I could find: Apartment Therapy, Oddity Central, Dogster review, 9&10 News, TechRound 100.
- "As Seen on Insta" collection, and a prompt to tag @crownandpaw to be featured.
- Trustpilot widgets are installed, but the public score is **3.8/5** (20,195 reviews, 10% 1★). That score is well below the on-site 4.8 and is an opening for Pup Prints.
- Recurring Trustpilot complaints: holiday lateness, getting a digital file instead of a canvas, Checkout+ auto-added, a misleading free-shipping threshold, a confusing preview and approval process, and slow support.

---

## 8. Visible tech stack (from app blocks, script loaders and web-pixel config)

| Function | Tool |
|---|---|
| Platform / CDN | Shopify (probably Plus, given server-side tagging and checkout extensions), Cloudflare |
| Theme / agency | Custom Debut 16.6.0, Thatworks Agency, custom Vue cart |
| Photo upload | **UploadKit** (getuploadkit.com) |
| Product personalizer / live preview (apparel) | **Teeinblue** |
| Reviews | **Loox** (primary), Trustpilot widgets, leftover Yotpo CSS |
| Email / SMS / popups | **Klaviyo** (NXithY), **OneText** SMS |
| Bundles | **Kaching Bundles** |
| Shipping protection / cashback | **Onward** (Checkout+) |
| A/B and price testing | **Intelligems**, **Convert Experiments** |
| Attribution / server-side tracking | **Elevar** (GTM-58SHVHZ, `sstagging.crownandpaw.com`), **Triple Whale** pixel (whale.camera / config-security) |
| Analytics | GA4 `G-H3GRCHP13G`, Microsoft Clarity |
| Ad pixels | Google Ads `AW-438835963`, Meta, TikTok, Pinterest (tag 2613952173521), Snapchat, Reddit, Bing UET, and an **OpenAI/ChatGPT ads pixel** (`pixel-for-openai-ads.fly.dev`) |
| Affiliate / referral | **Awin** (57823; earlier ShareASale 144318), **Social Snowball** |
| Search | **Searchanise** |
| Support / tracking | **Gorgias** chat, **AfterShip** tracking page, `orders.crownandpaw.com` proof portal |
| Print-on-demand suppliers (vendor field) | Crown & Paw in-house (1,369 products), **PTG** (433: mugs and blankets), **Gooten** (86), **Merchize** (32), Printful (7), Printify (5), Prodigi (4), HDF (metal cards) |

Performance: HTML alone is about **1.0 MB on the homepage and 1.5–2.0 MB on product pages**, before any assets. There are 15 Shopify web pixels plus GTM. Two product pages returned **503** on first fetch. The site is heavy and old-fashioned.

---

## 9. Where Pup Prints can clearly beat them

1. **Instant AI preview before payment.** Crown & Paw makes portrait buyers pay, then wait 1–2 days (or pay $10) to see the art. An "upload, see your pet in 6 styles in about 30 seconds, then buy" flow removes their biggest friction point and directly targets the "confusing preview/approval" complaints. It also kills the queue-jump upsell.
2. **Be honest about how the art is made.** They say "hand-illustrated" while the FAQ admits template compositing. Pup Prints can say plainly "AI-crafted, human-checked" and win on transparency and speed.
3. **Faster delivery.** Their total is up to 2 weeks and holiday reviews complain. Pup Prints should guarantee ship dates with a visible cutoff calendar and use POD partners that print within 24–48 hours (Gooten, Prodigi and Printful all have US facilities).
4. **Simpler, honest pricing.** No fake strike-throughs. Make the "From" price a physical print, not a digital file. No pre-ticked insurance, no $10 change fees, no 72-hour auto-approve trap.
   - Price targets: undercut their framed 8×10 ($79.95–$129.95) and 16×24 canvas ($99.95–$119.95 unframed).
   - Example tiers: digital $19, 8×10 print $39, framed 12×16 $89, 16×24 canvas $99.
5. **Curated catalog instead of 1,963 SKUs.** Offer roughly 12–20 strong styles, each available on every product, so the customer chooses style first and product second. Avoid trademarked-IP parodies.
6. **AI does what their artists won't**: change the background color, add accessories, fix closed eyes, colorize black-and-white photos, place several pets from separate photos, and add custom names and text, all previewed live.
7. **Speed and design.** A modern headless or lean storefront can beat their 1–2 MB pages, and a clean aesthetic can beat their cluttered Debut theme.
8. **Matching AOV offers without dark patterns.** Bundle a framed print with a mug or ornament, use the gift message insert, offer a digital file with every print, and keep the free-shipping threshold around $75 to match theirs.
9. **Influencers.** Their GRIN listing shows "No active partnerships" and the program runs on Awin (60-day cookie). Pup Prints can win creators with gifted portraits, live-reveal content (the AI preview makes this possible on camera), and higher commissions through a direct affiliate app such as Social Snowball, UpPromote or GoAffPro.
10. **Reviews.** Target Trustpilot or Google ratings above 4.5 from the start, to undercut their 3.8.

---

## Sources
- crownandpaw.com: homepage; `/products.json` pages 1–8; `/collections.json`; `/products/{the-general-custom-pet-canvas, modern-pet-portrait-one-pet, modern-pet-portrait-four-pets, pet-portrait-night-light-one-pet, restroom-pet-portrait-custom-canvas, personalized-vintage-style-pet-t-shirt, onward-package-protection}.js`; `/pages/{faq-new, shipping-and-delivery, returns-policy, how-it-works, our-mission-new, good-photo-gallery, contact-us, press-and-brand-partnerships}`; `/blogs/news.atom`; `/sitemap.xml`
- Klaviyo forms API: fast.a.klaviyo.com/forms/api/v7/full-forms?company_id=NXithY
- Elevar config: shopify-gtm-suite.getelevar.com/configs/4c7a4a15…/config.js
- [Trustpilot – crownandpaw.com](https://www.trustpilot.com/review/crownandpaw.com)
- [Grips Intelligence – crownandpaw.com](https://gripsintelligence.com/insights/retailers/crownandpaw.com)
- [Awin merchant profile 57823](https://ui.awin.com/merchant-profile/57823)
- [GRIN brand page](https://app.grin.ai/brands/crownandpaw.com)
- [TechRound 100 – Crown & Paw](https://techround.co.uk/techround-100/crown-paw/)
- [Dogster review](https://dogster.com/lifestyle/crown-paw-pet-portraits-review)
- [9&10 News](https://www.9and10news.com/2023/07/26/ordering-fun-custom-artwork-of-your-pet-can-benefit-animals-worldwide/)
- [Socialveins – @crownandpaw](https://socialveins.com/influencer/instagram/crownandpaw)
- [Stork – best AI pet portrait](https://www.stork.ai/blog/es/best-ai-pet-portrait)