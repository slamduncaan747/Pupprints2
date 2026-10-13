# Pup Prints: print-on-demand fulfillment research, pricing model and order API

**Research date:** 2026-10-12. Printful prices come live from its public catalog API (`api.printful.com/products/{id}`). Crown & Paw prices come from its public Shopify feed (`crownandpaw.com/products.json`, 750 products, 3 pages). Gelato, Prodigi, Printify, CloudPrinter and WHCC hide base prices behind a login, so their figures are third-party estimates or left out. Each one is labelled.

---

## 1. Recommendation

**Primary provider: Printful (API v1 for orders now; move to v2 once it leaves beta).**

1. **Only one integration needed.** Printful is the only provider here that covers every SKU we want in one API: canvas, framed canvas, framed poster, poster, mug, blanket, sherpa blanket, ornament, phone case, puzzle and pillow.
2. **Prices are known in advance.** The catalog API needs no login and the US shipping rates are published flat rates. That means the site can show exact prices with free shipping built in, and the margin math below is exact.
3. **Steady quality.** Production happens in Printful's own facilities across the US, Canada, Mexico, the EU, the UK and Australia. Partner networks like Gelato and Printify are cheaper but less consistent.
4. **White-label and ready for automation.**
   - Packing slips carry no Printful branding, and a logo and message on them are free. Pack-in inserts cost $0.50 per order plus at least $25/month storage.
   - The API includes `/orders/estimate-costs`, `/shipping/rates` and webhooks for shipping, failures, holds and refunds.
   - The `@external_id` lookup makes orders idempotent.
5. **Speed.** Production takes 2–5 business days, then 3–4 days of US standard shipping, so about 5–9 business days door to door.

**Known downsides and how to handle them:**
- There is no sandbox. Test with draft orders, which are not charged until confirmed.
- v1 webhooks are not signed. Put a secret token in the webhook URL path and re-fetch the order from the API before acting on it.
- Framed canvas costs 13–20% more than at Lumaprints.

**Secondary providers, behind a `FulfillmentProvider` interface in our code:**
- **Prodigi** for a later "Museum / Heirloom" tier: Hahnemühle Photo Rag giclée, Fine Art Trade Guild approved. It also suits international expansion: it has a real sandbox, CloudEvents callbacks and production in the US, UK, EU and Australia.
- **Lumaprints** to cut canvas costs at volume. 16x20 canvas is $25.95 vs Printful's $28.56. 24x36 framed canvas is $80.07 vs $99.96. Its API is still in open beta, so it shouldn't be used for launch.

**Not recommended for launch:**
- **Printify:** quality varies from provider to provider.
- **Gooten:** older `api.print.io` API and little price transparency.
- **WHCC:** built for professional photographers, with gated pricing, separate API credentials and a $7.95 minimum drop-ship charge per catalog.
- **CloudPrinter:** good global API, but gated pricing and a thin consumer-gift range in the US.
- **Gelato:** cheapest posters and production in 30+ countries, but print quality varies and branding needs the Gelato+ plan.

---

## 2. Provider comparison

| | **Printful** | **Gelato** | **Prodigi** | **Printify** | **Gooten** | **CloudPrinter** | **Lumaprints** | **WHCC** |
|---|---|---|---|---|---|---|---|---|
| Order API with your own image URL | Yes. `POST /orders`, `items[].files[].url` | Yes. `POST order.gelatoapis.com/v4/orders`, `items[].files[].url` | Yes. `POST /v4.0/Orders`, `items[].assets[].url` | Yes. `POST /v1/shops/{id}/orders.json`, `print_areas.front` = URL (blueprint, provider and variant IDs) | Yes. `POST api.print.io/api/v/5/source/api/orders/?recipeid=`, `Images[].Url` | Yes. `POST api.cloudprinter.com/cloudcore/1.0/orders/add`, `files[].url` (+md5) | Yes, API in open beta | Yes. Order Submit API: import, then submit with ConfirmationID. Separate credentials needed |
| Sandbox | No (draft orders are free) | Draft `orderType` | **Yes** | No (orders wait until `send_to_production`) | `IsInTestMode` | Yes | Not confirmed | Yes (sandbox.apps.whcc.com) |
| Webhooks | Yes. v1: package_shipped/returned, order_created/updated/failed/canceled, holds, refunded (unsigned). v2: signed | Yes. `order_status_updated` (3 retries) | Yes (CloudEvents, `callbackUrl`) | Yes. order:created, updated, sent-to-production, shipment:created, shipment:delivered | Yes (order status) | Yes ("Signals", 40+) | Not confirmed | Yes |
| Canvas 16x20 base | **$28.56** | ~$28.19 (Wood FSC Slim, 3rd-party, Aug 2026) | Gated (3rd-party ~$32) | Gated (Premium plan up to 33% off) | Unverified ~$10.50 (3rd-party, doubtful) | Gated | **$25.95** (1.25") | Gated |
| Canvas 8x10 / 12x16 / 24x36 | $15.81 / $23.41 / $52.02 | ~$11.69 (8x8) / – / ~$62.79 | Gated | Gated | – | Gated | $10.99 / $21.68 / $42.21 | Gated |
| Framed canvas 8x10 / 12x16 / 16x20 / 24x36 | $27.80 / $51.00 / $61.20 / $99.96 | Gated | Gated | Gated | – | Gated | $28.17 / $45.37 / $53.18 / $80.07 | Gated |
| Framed poster 8x10 / 12x16 / 16x20 / 24x36 | $20.76 / $32.20 / $42.61 / $75.90 | Gated | Gated | Gated | – | Gated | Framed fine-art paper: $20.08 / $27.04 / $35.12 / $66.40 | Gated |
| US shipping, canvas (first / extra item) | $6.79 for ≤10x10, $10.39 for 11x14 to 32x32, +$6.49 / +$9.99 | Gated (~$5 for a t-shirt) | Gated, all US orders tracked, largest item sets the rate | Varies by provider | – | Gated | Size and weight based, calculator only | $7.95 minimum drop-ship charge |
| US time to customer | 2–5 business days production + 3–4 shipping | ~3–6 days average delivery | Canvas 72–120h production + shipping | 2–8 business days | – | – | 2–3 days production + transit | Fast (pro lab) |
| Quality reputation | Consistent, in-house | Varies by partner | Best-in-class fine art | Varies by provider | Mixed | Network-dependent | Strong in photographer reviews | Top-tier pro lab |
| White label | Yes. Free logo and message on slip; inserts $0.50 + $25/mo minimum | Branding mostly needs Gelato+ ($19.99–23.99/mo) | Yes. Inserts (75% off on Pro) | Labels and inserts on some products | Yes | Yes | Yes. Blind ship, logo on canvas back, inserts | Yes |
| Global coverage | US, CA, MX, EU, UK, AU (+ partners) | 30+ countries, local production | US, UK, EU, AU | Global network | US/EU network | 100+ countries | US only (international by USPS, limited) | US |
| Gifts (mugs, blankets, ornaments, cases) | **All** | Mugs, cases, some home goods | Mugs, cushions, cases (limited) | All | Many | Limited | **None** (wall art only) | Limited |

---

## 3. Crown & Paw price benchmark (scraped 2026-10-12)

These are medians of variant prices. Most variants have a higher strike-through "compare-at" price, and many were on roughly 33% sale that day (for example, a $139.95 variant selling at $93.76). Crown & Paw takes payment first and delivers the artwork preview later; it charges **$10 for "Preview Your Artwork Sooner"** and **$10 for a digital download** on top of a physical order. The standalone digital download is $39.95. A coupon site (not verified) says shipping is free over $100.

| Crown & Paw product | Median list price |
|---|---|
| Poster, unframed: 8x10 / 12x16 / 18x24 | $39.95 / $59.95 / $59.95 |
| Framed poster: 8x10 / 12x16 / 18x24 / 24x36 | $79.95 / $99.95 / $149.95 / $184.95 |
| Canvas, unframed: 8x10 / 12x18 / 16x24 / 24x36 / 32x48 | $59.95 / $79.95 / $99.95 / $159.95 / $249.95 |
| Canvas, framed: 8x10 / 12x18 / 16x24 / 24x36 / 32x48 | $119.95 / $139.95 / $189.95 / $254.95 / $399.95 |
| Mug 11 oz / 15 oz | $39.95 / $49.95 |
| Blanket 30x40 / 50x60 / 60x80 | $69.95 / $89.95 / $109.95 |
| Ornament | $15.99–$24.95 |
| Phone case | $29.95 (clear) to $49.95 |
| Puzzle (11x14) / throw pillow 14x14 / 18x18 | $99.95 / $49.95 / $59.95 |
| Add-ons: easel $6.95, acrylic case $9.95, clay figurine | $99.95+ |

---

## 4. Pup Prints pricing model

**How the numbers work:**
- **Prices include free US shipping.** Unit cost = Printful base price + Printful US flat shipping (first item) + Stripe fee + AI cost.
- **Stripe fee** is 2.9% + $0.30 for US cards. International cards add 1.5%; Klarna is 5.99% + $0.30.
- **AI cost is $1.50 per order, on purpose conservative.**
  - FLUX Kontext [pro] or Nano Banana run about $0.04 per image on fal; Nano Banana Pro is about $0.15.
  - We assume 4 style previews per uploader (about $0.16–$0.32) and about 20% of uploaders buying, which works out to roughly $0.80–$1.60 per order.
  - On top of that is the final upscale to the print file's pixel size (about $0.05–$0.10) plus storage.
- **"Influencer order" column:** gross margin when the order uses a 15%-off creator code and we pay a 10% commission on the net price.
- **Not included:** sales tax (passed through to the customer), the $0.50 pack-in if we use one, and a remake reserve. Plan about 3% of revenue for remakes.

| Product | Size | **Price** | Base | Ship | Stripe | AI | Total cost | **GM $** | **GM %** | Influencer order GM % | C&P list median |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Fine-art poster | 8x10 | **$35** | 7.03 | 4.99 | 1.32 | 1.50 | 14.83 | 20.16 | 58% | 41% | $39.95 |
| Fine-art poster | 12x16 | **$45** | 11.11 | 4.99 | 1.61 | 1.50 | 19.21 | 25.79 | 57% | 40% | $59.95 |
| Fine-art poster | 16x20 | **$55** | 12.13 | 4.99 | 1.90 | 1.50 | 20.52 | 34.48 | 63% | 47% | – |
| Fine-art poster | 18x24 | **$59** | 13.15 | 4.99 | 2.01 | 1.50 | 21.65 | 37.35 | 63% | 47% | $59.95 |
| Fine-art poster | 24x36 | **$79** | 18.25 | 7.99 | 2.59 | 1.50 | 30.33 | 48.67 | 62% | 45% | – |
| Framed print | 8x10 | **$75** | 20.76 | 10.89 | 2.48 | 1.50 | 35.62 | 39.38 | 52% | 35% | $79.95 |
| Framed print | 12x16 | **$95** | 32.20 | 10.89 | 3.06 | 1.50 | 47.65 | 47.35 | 50% | 32% | $99.95 |
| Framed print | 16x20 | **$119** | 42.61 | 14.49 | 3.75 | 1.50 | 62.35 | 56.65 | 48% | 29% | – |
| Framed print | 18x24 | **$129** | 46.30 | 14.49 | 4.04 | 1.50 | 66.33 | 62.67 | 49% | 30% | $149.95 |
| Framed print | 24x36 | **$199** | 75.90 | 31.19 | 6.07 | 1.50 | 114.66 | 84.34 | 42% | 23% | $184.95 |
| Canvas | 8x10 | **$59** | 15.81 | 6.79 | 2.01 | 1.50 | 26.11 | 32.89 | 56% | 38% | $59.95 |
| Canvas | 12x16 | **$79** | 23.41 | 10.39 | 2.59 | 1.50 | 37.89 | 41.11 | 52% | 34% | $79.95 (12x18) |
| **Canvas (hero)** | **16x20** | **$99** | 28.56 | 10.39 | 3.17 | 1.50 | 43.62 | **55.38** | **56%** | 39% | $99.95 (16x24) |
| Canvas | 18x24 | **$115** | 33.66 | 10.39 | 3.63 | 1.50 | 49.18 | 65.81 | 57% | 40% | – |
| Canvas | 24x36 | **$149** | 52.02 | 10.39 | 4.62 | 1.50 | 68.53 | 80.47 | 54% | 36% | $159.95 |
| Framed canvas | 8x10 | **$99** | 27.80 | 9.89 | 3.17 | 1.50 | 42.36 | 56.64 | 57% | 40% | $119.95 |
| Framed canvas | 12x16 | **$129** | 51.00 | 9.89 | 4.04 | 1.50 | 66.43 | 62.57 | 49% | 30% | $139.95 (12x18) |
| Framed canvas | 16x20 | **$159** | 61.20 | 9.89 | 4.91 | 1.50 | 77.50 | 81.50 | 51% | 33% | $189.95 (16x24) |
| Framed canvas | 18x24 | **$179** | 71.40 | 10.89* | 5.49 | 1.50 | 89.28 | 89.72 | 50% | 32% | – |
| Framed canvas | 24x36 | **$239** | 99.96 | 15.09 | 7.23 | 1.50 | 123.78 | 115.22 | 48% | 30% | $254.95 |
| Mug | 11 oz | **$32** | 6.07 | 6.69 | 1.23 | 1.50 | 15.49 | 16.51 | 52% | 34% | $39.95 |
| Mug | 15 oz | **$38** | 8.11 | 7.29 | 1.40 | 1.50 | 18.30 | 19.70 | 52% | 34% | $49.95 |
| Throw blanket | 30x40 | **$65** | 24.62 | 8.29 | 2.19 | 1.50 | 36.59 | 28.41 | 44% | 24% | $69.95 |
| Throw blanket | 50x60 | **$85** | 29.36 | 8.29 | 2.77 | 1.50 | 41.91 | 43.09 | 51% | 32% | $89.95 |
| Throw blanket | 60x80 | **$109** | 39.76 | 13.99 | 3.46 | 1.50 | 58.71 | 50.29 | 46% | 27% | $109.95 |
| Sherpa blanket | 50x60 | **$99** | 35.76 | 13.99 | 3.17 | 1.50 | 54.42 | 44.58 | 45% | 26% | $99.95 |
| Ornament (ceramic, 2-sided), alone | 3" | **$24** | 7.73 | 5.89 | 1.00 | 1.50 | 16.12 | 7.88 | 33% | 12% | $15.99–24.95 |
| **Ornament, checkout add-on** | 3" | **$19** | 7.73 | 0.70† | 0.85 | 0 | 9.28 | 9.72 | 51% | 33% | – |
| **Mug 11 oz, checkout add-on** | 11 oz | **$25** | 6.07 | 3.50† | 1.03 | 0 | 10.60 | 14.40 | 58% | 41% | – |
| Phone case (Snap) | iPhone 15–17 | **$35** | 13.07 | 5.19 | 1.32 | 1.50 | 21.08 | 13.92 | 40% | 20% | $29.95–49.95 |
| Phone case (Tough) | iPhone 15–17 | **$45** | 14.23 | 5.19 | 1.61 | 1.50 | 22.53 | 22.47 | 50% | 32% | $49.95 |
| HD digital file, alone | – | **$29** (free with any physical order) | 0 | 0 | 1.14 | 1.50 | 2.64 | 26.36 | 91% | 80% | $39.95 / $10 add-on |

\* The tier for 12x16 and 18x24 framed canvas isn't printed on Printful's shipping page. I assumed $9.89 and $10.89; confirm with `/shipping/rates`.
† Printful's "additional item" rate. This only applies if Printful ships the items together. When the items come from different facilities, each shipment pays the first-item rate. The add-on rows are best-case; confirm with `/orders/estimate-costs`.

**Pricing strategy:**
- **Stay at or below Crown & Paw's list price** (0–20% under) with honest everyday pricing: no fake compare-at prices.
- **Win on value Crown & Paw doesn't offer:**
  - An instant AI preview **before** payment. Crown & Paw charges $10 just to see the artwork sooner.
  - Free US shipping built into the price.
  - The free HD digital file with every physical order.
- **Hero SKU: 16x20 canvas at $99** (56% gross margin). Show it as "Most popular" and make it the default selection.
- **Bundle: "Gift Set", 16x20 canvas + 11 oz mug + ornament, for $149.** Cost is about $63.07, giving **$85.93 gross margin (58%)**.
- **Order bumps:** ornament $19, mug $25, extra pet +$15 (almost pure margin), gift message (free through Printful's `gift` field).
- **Discount floor:** sitewide promos should stay at 20% off or less. At 20% off plus a 15% commission, the large framed products (framed print 24x36, framed canvas) fall to about 10–20% gross margin.
- **Breakeven ad return:** expected blended margin is about 53%, assuming a mix of 35% canvas, 25% framed print, 15% framed canvas, 10% poster and 15% gifts. That puts breakeven at about **1.9× return on ad spend** for paid traffic, so target cost per acquisition at or below $35 on an average order of about $110.
- **Cutting costs later:** at about 200+ canvas orders a month, send canvas and framed canvas to Lumaprints. That saves $2.61 on a 16x20 canvas and $8–$20 on framed canvas. Separately, check Printful's plan discounts.

---

## 5. Printful order integration (TypeScript)

**Base URL:** `https://api.printful.com`

**Authentication:**
- Header `Authorization: Bearer <PRINTFUL_TOKEN>`. Create a private token in the Developer Portal with the `orders` and `webhooks` scopes.
- Add `X-PF-Store-Id` only if the token is account-level.
- Rate limit is 120 requests per minute; over the limit you get a 429 with a `Retry-After` header.

**`external_id`:**
- Up to 32 characters: letters, digits, `-` and `_`.
- Must be unique per store.
- You can fetch an order by it with the `@` prefix, e.g. `GET /orders/@pp_123`.

**Print files:**
- File URLs must be public and stay reachable until Printful downloads them. Maximum 50 MB.
- Wall-art print files are defined horizontally; for a portrait print, send the file rotated (for example 1800×2400 instead of 2400×1800).
- Get exact pixel sizes from `GET /mockup-generator/printfiles/{product_id}?technique=DIGITAL`. The documented example is 1800×2400 at 150 DPI for a 12x16 poster.
- Aim for at least 150 DPI, ideally 300.

### 5.1 Raw HTTP: create and confirm an order

```http
POST https://api.printful.com/orders?confirm=true
Authorization: Bearer {PRINTFUL_TOKEN}
Content-Type: application/json

{
  "external_id": "pp_10023",
  "shipping": "STANDARD",
  "recipient": {
    "name": "Jane Doe", "address1": "19749 Dearborn St", "city": "Chatsworth",
    "state_code": "CA", "country_code": "US", "zip": "91311",
    "email": "jane@example.com", "phone": "+15555550123"
  },
  "items": [{
    "external_id": "pp_10023_1",
    "variant_id": 6,
    "quantity": 1,
    "name": "Pup Prints Canvas 16x20 - Renaissance Duke",
    "retail_price": "99.00",
    "files": [{ "type": "default", "url": "https://cdn.pupprints.com/print/ord_10023/canvas-16x20.png" }]
  }],
  "retail_costs": { "currency": "USD", "subtotal": "99.00", "discount": "0.00", "shipping": "0.00", "tax": "0.00" },
  "gift": { "subject": "For Mom", "message": "Happy birthday from Biscuit!" },
  "packing_slip": {
    "email": "hello@pupprints.com", "store_name": "Pup Prints",
    "message": "Made with love for your best friend. Tag @pupprints!",
    "logo_url": "https://cdn.pupprints.com/brand/slip-logo-bw.png",
    "custom_order_id": "PP-10023"
  }
}
```

Leave out `confirm=true` to create a draft, which is free and not charged. Confirm it later with `POST /orders/{id}/confirm` or `POST /orders/@pp_10023/confirm`.

### 5.2 Production client (`lib/fulfillment/printful.ts`)

```ts
// lib/fulfillment/printful.ts
// Printful API v1 client for Pup Prints. Node 18+ (global fetch). No external deps.

const PF_BASE = "https://api.printful.com";
const PF_TOKEN = process.env.PRINTFUL_TOKEN!;
const PF_STORE_ID = process.env.PRINTFUL_STORE_ID; // only for account-level tokens

/** Catalog variant IDs (Printful public catalog, verified 2026-10-12). */
export const PF_VARIANTS = {
  // Enhanced Matte Paper Poster (product 1)
  "poster-8x10": 4463, "poster-12x16": 1349, "poster-16x20": 3877, "poster-18x24": 1, "poster-24x36": 2,
  // Enhanced Matte Paper Framed Poster (product 2)
  "framed-black-8x10": 4651, "framed-black-12x16": 1350, "framed-black-16x20": 4399, "framed-black-18x24": 3, "framed-black-24x36": 4,
  "framed-white-8x10": 10754, "framed-white-12x16": 10751, "framed-white-16x20": 10753, "framed-white-18x24": 10749, "framed-white-24x36": 10750,
  "framed-oak-8x10": 15021, "framed-oak-12x16": 15025, "framed-oak-16x20": 15029, "framed-oak-18x24": 15031, "framed-oak-24x36": 15032,
  // Canvas (product 3)
  "canvas-8x10": 19293, "canvas-12x16": 5, "canvas-16x20": 6, "canvas-18x24": 7, "canvas-24x36": 825,
  // Framed Canvas (product 614)
  "fcanvas-black-8x10": 17627, "fcanvas-black-12x16": 16035, "fcanvas-black-16x20": 16037, "fcanvas-black-18x24": 16038, "fcanvas-black-24x36": 16039,
  "fcanvas-white-8x10": 17641, "fcanvas-white-12x16": 15696, "fcanvas-white-16x20": 15698, "fcanvas-white-18x24": 15699, "fcanvas-white-24x36": 15700,
  "fcanvas-brown-8x10": 17634, "fcanvas-brown-12x16": 16041, "fcanvas-brown-16x20": 16043, "fcanvas-brown-18x24": 16044, "fcanvas-brown-24x36": 16045,
  // Gifts
  "mug-11oz": 1320, "mug-15oz": 4830,
  "blanket-30x40": 22609, "blanket-50x60": 10986, "blanket-60x80": 13222, "sherpa-50x60": 17482,
  "ornament-ceramic2-circle": 23133, "ornament-ceramic2-heart": 23144, "ornament-metal-paw": 20253,
  "case-tough-glossy-iphone17": 33985, "case-tough-glossy-iphone17pro": 33987, "case-tough-glossy-iphone17promax": 33988,
  "case-snap-glossy-iphone17": 34009,
} as const;
export type PupSku = keyof typeof PF_VARIANTS;

export interface PfRecipient {
  name: string; address1: string; address2?: string; city: string;
  state_code?: string; // required for US/CA/AU
  country_code: string; zip: string; email?: string; phone?: string;
}
export interface PfFile { type?: "default"; url: string; filename?: string }
export interface PfItem {
  variant_id: number; quantity: number; files: PfFile[];
  external_id?: string; name?: string; retail_price?: string;
}
export interface PfOrderInput {
  external_id: string;            // <=32 chars [A-Za-z0-9_-], unique per store
  shipping?: string;              // "STANDARD" default; or an id from /shipping/rates
  recipient: PfRecipient;
  items: PfItem[];
  retail_costs?: { currency: string; subtotal: string; discount: string; shipping: string; tax: string };
  gift?: { subject: string; message: string };
  packing_slip?: { email?: string; phone?: string; message?: string; logo_url?: string; store_name?: string; custom_order_id?: string };
}
export interface PfCosts {
  currency: string; subtotal: string; discount: string; shipping: string;
  digitization: string; additional_fee: string; fulfillment_fee: string; tax: string; vat: string; total: string;
}
export interface PfOrder {
  id: number; external_id: string | null;
  status: "draft" | "pending" | "failed" | "canceled" | "inprocess" | "onhold" | "partial" | "fulfilled";
  costs: PfCosts; shipments: Array<{ tracking_number: string; tracking_url: string; carrier: string; service: string }>;
}

export class PrintfulError extends Error {
  constructor(public status: number, message: string, public body?: unknown) { super(message); }
}

async function pf<T>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  const res = await fetch(`${PF_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${PF_TOKEN}`,
      "Content-Type": "application/json",
      ...(PF_STORE_ID ? { "X-PF-Store-Id": PF_STORE_ID } : {}),
      ...(init.headers ?? {}),
    },
  });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const retryAfter = Number(res.headers.get("Retry-After")) || 2 ** attempt;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    return pf<T>(path, init, attempt + 1);
  }
  const json: any = await res.json().catch(() => ({}));
  if (!res.ok) throw new PrintfulError(res.status, json?.error?.message ?? json?.result ?? res.statusText, json);
  return json.result as T;
}

/** Live shipping quote (use to verify flat-rate assumptions per cart). */
export function getShippingRates(recipient: Pick<PfRecipient, "country_code" | "state_code" | "zip" | "city" | "address1">,
                                 items: { variant_id: number; quantity: number }[]) {
  return pf<Array<{ id: string; name: string; rate: string; currency: string; minDeliveryDays: number; maxDeliveryDays: number }>>(
    "/shipping/rates", { method: "POST", body: JSON.stringify({ recipient, items, currency: "USD", locale: "en_US" }) });
}

/** Exact Printful cost for a cart before we charge/confirm (margin guard). */
export function estimateCosts(order: PfOrderInput) {
  return pf<{ costs: PfCosts; retail_costs: unknown }>("/orders/estimate-costs", { method: "POST", body: JSON.stringify(order) });
}

/** Look up by our own id: GET /orders/@{external_id} */
export function getOrderByExternalId(externalId: string) {
  return pf<PfOrder>(`/orders/@${encodeURIComponent(externalId)}`);
}

/**
 * Create (and by default confirm) an order. Idempotent on external_id:
 * Stripe can deliver checkout.session.completed more than once.
 */
export async function createPrintfulOrder(order: PfOrderInput, { confirm = true } = {}): Promise<PfOrder> {
  try {
    const existing = await getOrderByExternalId(order.external_id);
    if (existing) return existing;
  } catch (e) {
    if (!(e instanceof PrintfulError && e.status === 404)) throw e;
  }
  const qs = new URLSearchParams({ confirm: String(confirm) });
  try {
    return await pf<PfOrder>(`/orders?${qs}`, { method: "POST", body: JSON.stringify(order) });
  } catch (e) {
    // Race: a parallel webhook created it first -> return that one
    if (e instanceof PrintfulError && e.status === 400 && /external/i.test(e.message)) {
      return getOrderByExternalId(order.external_id);
    }
    throw e;
  }
}

export const confirmDraft = (externalId: string) =>
  pf<PfOrder>(`/orders/@${encodeURIComponent(externalId)}/confirm`, { method: "POST" });

/** Exact print-file pixel sizes for a product (run once, cache in DB/config). */
export const getPrintfiles = (productId: number) =>
  pf<{ printfiles: Array<{ printfile_id: number; width: number; height: number; dpi: number; fill_mode: string; can_rotate: boolean }>;
       variant_printfiles: Array<{ variant_id: number; placements: Record<string, number> }> }>(
    `/mockup-generator/printfiles/${productId}?technique=DIGITAL`);

/** One-time setup. v1 allows ONE webhook URL per store; v1 payloads are unsigned -> secret in path. */
export function registerWebhooks(siteUrl: string, secret: string) {
  return pf("/webhooks", {
    method: "POST",
    body: JSON.stringify({
      url: `${siteUrl}/api/webhooks/printful/${secret}`,
      types: ["package_shipped", "package_returned", "order_failed", "order_canceled",
              "order_put_hold", "order_put_hold_approval", "order_remove_hold", "order_refunded"],
    }),
  });
}
```

### 5.3 Stripe paid → Printful order (`app/api/webhooks/stripe/route.ts`, Next.js App Router)

```ts
import Stripe from "stripe";
import { createPrintfulOrder, PF_VARIANTS, type PupSku } from "@/lib/fulfillment/printful";
import { db } from "@/lib/db"; // your Supabase/Postgres client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(await req.text(), sig, process.env.STRIPE_WEBHOOK_SECRET!);
  if (event.type !== "checkout.session.completed") return new Response("ignored");

  const session = await stripe.checkout.sessions.retrieve((event.data.object as Stripe.Checkout.Session).id,
    { expand: ["line_items.data.price.product"] });
  // Newer API versions: collected_information.shipping_details; older: shipping_details
  const ship: any = (session as any).collected_information?.shipping_details ?? (session as any).shipping_details;
  const a = ship.address;

  // Our order row holds: sku per line + the upscaled print-file URL (public or long-TTL signed, >= 7 days)
  const order = await db.orders.getByCheckoutSession(session.id);

  const pfOrder = await createPrintfulOrder({
    external_id: `pp_${order.number}`,              // e.g. pp_10023 (<= 32 chars)
    shipping: "STANDARD",
    recipient: {
      name: ship.name, address1: a.line1, address2: a.line2 ?? undefined, city: a.city,
      state_code: a.state, country_code: a.country, zip: a.postal_code,
      email: session.customer_details?.email ?? undefined, phone: session.customer_details?.phone ?? undefined,
    },
    items: order.lines.map((l: { sku: PupSku; qty: number; printUrl: string; title: string; unitPrice: number }, i: number) => ({
      external_id: `pp_${order.number}_${i + 1}`,
      variant_id: PF_VARIANTS[l.sku],
      quantity: l.qty,
      name: l.title,
      retail_price: l.unitPrice.toFixed(2),
      files: [{ type: "default", url: l.printUrl }],
    })),
    gift: order.giftMessage ? { subject: order.giftTo ?? "A gift for you", message: order.giftMessage } : undefined,
    packing_slip: {
      email: "hello@pupprints.com", store_name: "Pup Prints",
      message: "Made with love for your best friend. Share it & tag @pupprints",
      logo_url: "https://cdn.pupprints.com/brand/slip-logo-bw.png",
      custom_order_id: `PP-${order.number}`,
    },
  }, { confirm: true });

  await db.orders.update(order.id, { printful_id: pfOrder.id, printful_status: pfOrder.status, pf_cost_total: pfOrder.costs?.total });
  return new Response("ok");
}
```

### 5.4 Printful webhook receiver (`app/api/webhooks/printful/[secret]/route.ts`)

```ts
import { timingSafeEqual } from "node:crypto";
import { getOrderByExternalId } from "@/lib/fulfillment/printful";
import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { secret: string } }) {
  const expected = Buffer.from(process.env.PRINTFUL_WEBHOOK_SECRET!);
  const got = Buffer.from(params.secret);
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return new Response("forbidden", { status: 403 });

  const evt = await req.json() as { type: string; data: any };
  const externalId: string | undefined = evt.data?.order?.external_id;
  if (!externalId) return new Response("ok");

  // v1 payloads are unsigned: re-fetch the source of truth before acting
  const order = await getOrderByExternalId(externalId);

  switch (evt.type) {
    case "package_shipped":
      await db.orders.markShipped(externalId, {
        tracking_url: evt.data.shipment.tracking_url, tracking_number: String(evt.data.shipment.tracking_number),
        carrier: evt.data.shipment.carrier, status: order.status,
      }); // -> trigger "Your Pup Print is on the way" email + review/UGC request 7 days later
      break;
    case "order_failed":
    case "order_put_hold":
      await db.alerts.create({ externalId, type: evt.type, reason: evt.data?.reason ?? null }); // page ops
      break;
    case "order_canceled":
    case "order_refunded":
    case "package_returned":
      await db.orders.update(externalId, { printful_status: order.status, needs_cs: true });
      break;
  }
  return new Response("ok");
}
```

### 5.5 Printful v2 (beta) equivalent, for later migration

```ts
// POST https://api.printful.com/v2/orders  (creates a draft; costs calculated asynchronously)
const body = {
  external_id: "pp_10023",
  shipping: "STANDARD",
  recipient: { name: "Jane Doe", address1: "19749 Dearborn St", city: "Chatsworth", state_code: "CA", country_code: "US", zip: "91311" },
  order_items: [{
    source: "catalog", catalog_variant_id: 6, quantity: 1,
    placements: [{ placement: "default", technique: "digital",
                   layers: [{ type: "file", url: "https://cdn.pupprints.com/print/ord_10023/canvas-16x20.png" }] }],
  }],
};
// Then confirm once calculation_status !== "calculating": POST https://api.printful.com/v2/orders/{order_id}/confirmation
```

The v2 docs I could read showed the item fields (`source`, `catalog_variant_id`, `placements`, `layers`) but not the wrapper name: the create example only had the recipient, and a PATCH example wrapped items in `items`. So `order_items` and the `/confirmation` path above are unconfirmed. Check both against the v2 reference before migrating.

### 5.6 Optional premium tier: Prodigi (sandbox available)

```ts
// POST https://api.sandbox.prodigi.com/v4.0/Orders   (live: https://api.prodigi.com/v4.0/Orders)
await fetch("https://api.sandbox.prodigi.com/v4.0/Orders", {
  method: "POST",
  headers: { "X-API-Key": process.env.PRODIGI_KEY!, "Content-Type": "application/json" },
  body: JSON.stringify({
    merchantReference: "pp_10023", shippingMethod: "Standard",
    callbackUrl: "https://pupprints.com/api/webhooks/prodigi",
    recipient: { name: "Jane Doe", email: "jane@example.com",
      address: { line1: "19749 Dearborn St", postalOrZipCode: "91311", countryCode: "US", townOrCity: "Chatsworth", stateOrCounty: "CA" } },
    items: [{ merchantReference: "pp_10023_1", sku: "GLOBAL-CFPM-16X20", copies: 1, sizing: "fillPrintArea",
              attributes: { color: "black" },
              assets: [{ printArea: "default", url: "https://cdn.pupprints.com/print/ord_10023/framed-16x20.png" }] }],
  }),
});
```

---

## 6. Assumptions and caveats

- **Printful prices** are the base prices from the public catalog API on 2026-10-12, before any plan discount. Shipping is Printful's published US flat rate as of the same date. Carts with several items can split across facilities, so check real carts with `/shipping/rates` or `/orders/estimate-costs`.
- **Unverified prices:**
  - Gelato canvas prices are from a third-party catalog pull (August 2026).
  - Prodigi, Printify, CloudPrinter and WHCC need a login, so there are no verified prices for them.
  - Lumaprints prices come from its public pricing page; shipping isn't included.
- **Crown & Paw benchmark:** these are median list prices from its Shopify feed, and many SKUs run about 33% off. Crown & Paw's effective sale price can therefore undercut ours on some SKUs (for example, 8x10 canvas at about $40). We compete on the instant preview, free shipping and the free digital file, and run limited promos of 20% off or less.
- **AI cost ($1.50 per order)** is a planning number. Check it against real model pricing and the actual upload-to-purchase rate after launch.
- **Next steps:**
  - Order physical samples from Printful (canvas, framed print, framed canvas) and a Lumaprints 16x20 canvas before launch.
  - Call `GET /mockup-generator/printfiles/{3,614,2,1,19,395,881}` once to save exact print-file pixel sizes.
  - Set print-file URLs to a TTL of 7 days or more.

**Saved data you can reuse** (all in `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/`):
- `dl/pf_*.json` and `dl/pf3.json`: Printful catalog data.
- `dl/cp_products*.json`: Crown & Paw catalog.
- `dl/printify_openapi.json`: Printify OpenAPI spec.
- `scripts/margin2.py`: margin calculator.
- `scripts/cp_agg.py`: Crown & Paw price aggregator.

---

## Sources

- Printful public catalog API: https://api.printful.com/products/3 (also /1, /2, /614, /19, /395, /711, /881, /900, /794, /601, /683, /534, /588, /616)
- Printful API docs (v1): https://developers.printful.com/docs/ · v2 beta: https://developers.printful.com/docs/v2-beta/
- Printful shipping rates: https://www.printful.com/shipping
- Printful branding tools: https://www.printful.com/blog/printful-branding-tools
- Crown & Paw catalog feed: https://www.crownandpaw.com/products.json
- Crown & Paw on Trustpilot: https://nz.trustpilot.com/review/crownandpaw.com?page=2 · coupon/free-shipping claim: https://www.promocodes.com/crownandpaw
- Prodigi API reference: https://www.prodigi.com/print-api/docs/reference/ · shipping FAQ: https://www.prodigi.com/faq/shipping/ · canvas: https://www.prodigi.com/products/wall-art/canvas/stretched-canvas/ · review: https://www.podmadeeasy.com/blog/prodigi-review
- Gelato: https://dashboard.gelato.com/docs/get-started · Orders API endpoints: https://apis.io/apis/gelato/gelato-orders-api/ · webhooks: https://developers.gelato.com/docs/webhooks · canvas specs: https://support.gelato.com/en/articles/8996201-start-selling-canvas
- Gelato vs Printful price pull (Aug 2026): https://apparelhub.ai/blog/best-print-on-demand-supplier-for-posters-wall-art · https://www.printful.com/blog/gelato-vs-printify
- Printify API and OpenAPI spec: https://developers.printify.com/ · https://developers.printify.com/openapi.json
- Gooten: https://www.gooten.com/api-documentation/submitting-an-order · https://gooten.com/api-documentation/order-status-webhooks/
- CloudPrinter: https://docs.cloudprinter.com/client/cloudprinter-core-api-v1-0/ · https://apis.io/apis/cloudprinter/cloudprinter-orders-api/ · https://www.cloudprinter.com/print-api
- Lumaprints: https://www.lumaprints.com/pricing/ · https://www.lumaprints.com/faq/ · https://api-docs.lumaprints.com/ · https://www.photographytalk.com/lumaprints-review-7-products-tested-over-2-years/
- WHCC: https://developer.whcc.com/pages/order-submit-api · https://developer.whcc.com/pages/order-submit-api/order-request-schema/ · https://www.whcc.com/help-sp-integration-faq
- Stripe pricing: https://stripe.com/pricing
- AI image pricing: https://computeprices.com/providers/fal-ai/models/flux-1-kontext-pro · https://pricepertoken.com/fal-ai-pricing
- Market context: https://ecommerce-platforms.com/articles/gelato-vs-prodigi · https://merchtitans.com/blog/printful-vs-gooten