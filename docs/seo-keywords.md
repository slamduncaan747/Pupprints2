# Pup Prints: SEO keyword map

*Team D (SEO + content), Oct 13, 2026. Companion to `docs/research/competitors.md` (sections 3, 6, 7) and `docs/research/cp-site.md` §6.17.*

## How this was built (and how far to trust it)

- **Volumes** come from RankHero keyword pages (rankhero.com/keywords/…), which report Google Ads–style monthly search estimates sampled Sep 2025 to Aug 2026, plus the share of searches from the US. They are bucketed estimates (e.g. 720, 1,300, 2,900) and the tool is Etsy-oriented, so treat them as **directional**. Where the tool had no data we say so rather than guess.
- **Seasonality and rising queries** come from our own Google Trends pulls in `docs/research/competitors.md` §3.
- **Breed popularity** comes from the AKC's 2025 most-popular breeds list (akc.org, published 2026).
- **Next step:** validate the P1 terms in Google Keyword Planner once the Ads account exists, and replace these estimates with real Search Console impressions about 4–6 weeks after launch.

## Headline findings

1. **The head terms are modest and winnable.** "dog portrait(s)" is about 12–15K searches a month worldwide (about 6.6K US), and "custom pet portrait" about 8.1K (about 81% US). Crown & Paw ranks for roughly 12.9K keywords in total, with most of its blog spent on generic dog topics (188 posts such as "Why do dogs sleep so much?"). There is room for a focused, purchase-intent site.
2. **Gift and memorial demand is larger than portrait demand.** "pet memorial gifts" (about 12.1K), "gifts for dog lovers" (about 9.9K, peaking around 40K in December), "dog christmas gift" (about 14.8K, peaking around 90K in December) and "dog memorial" (about 8.1K, flat all year) each rival or beat the portrait head terms. Our gift guides and memorial content are the widest top of the funnel.
3. **Seasonality is extreme for gift terms.** "dog christmas gift" swings from about 880 (June) to about 90.5K (December). "dog dad gift" peaks in June (about 14.8K). "dog mom gift" peaks in December (about 12.1K), with Trends showing its top week in the Mother's Day week. Christmas content has to be indexed **before** Nov 23. That's why the Christmas guide shipped first (Oct 13).
4. **Memorial is evergreen and steady.** "dog memorial" holds at about 8.1K every month and "pet loss gift" at 6.6–8.1K. This steadies revenue between peaks, and it suits an honest, gentle brand.
5. **Easiest win found: "pet sympathy card"** (about 5.4K, keyword difficulty 32/100, the lowest we measured). Our sympathy-card article targets it and hands off to `/gifts/memorial`.
6. **Breed portrait terms are small one by one but add up.** "french bulldog portrait" is about 90 a month (100% US) and other breeds are smaller. Across 32 breeds × (portrait, painting, gift, canvas) modifiers this is a meaningful, low-competition long tail. Breed pages also give paid social and influencers a landing page per breed.
7. **Rising in 2026 (Trends):** "personalized pet portrait" (+500%), "custom pet portrait painting" (+120%), "royal pet portrait" (+110%). Royal/Renaissance is the style to lead SEO with.

## Keyword clusters

Volumes are average monthly searches (global), with the US share where reported. Intent: **T** = transactional, **C** = commercial investigation, **I** = informational. Priority: **P1** = launch-critical, **P2** = next, **P3** = opportunistic.

### 1. Core "custom portrait" terms (commercial head)

| Keyword | Volume | US share | Intent | Priority | Target URL |
|---|---|---|---|---|---|
| pet portrait | 27,100 | n/a | C | P2 (broad; includes cats) | `/` |
| dog portrait / dog portraits | 12,100–14,800 | 55% (~6.6K) | C/T | P1 | `/` |
| custom pet portrait / pet portrait custom | 8,100 | 81% (~6.6K) | T | P1 | `/` (dog-only angle), `/styles` |
| custom dog portrait | not reported separately (listed as related tag) | n/a | T | P1 | `/` |
| pet portrait from photo | 1,300 | 77% | T | P1 | `/create`, `/how-it-works` |
| personalized pet portrait | 1,300 | 77% | T | P1 (rising +500%) | `/` |
| dog portrait from photo | ~720 | n/a | T | P1 | `/create`, `/how-it-works` |
| custom dog art | 590 | n/a | T | P2 | `/styles` |
| custom pet painting | 320 | 81% | T | P2 | `/styles/oil-classic` |

### 2. Style modifiers

| Keyword | Volume | US share | Intent | Priority | Target URL |
|---|---|---|---|---|---|
| royal pet portrait / royal dog portrait / renaissance dog portrait | 720 (Nov–Dec 1,300) | 54% | T | P1 (rising +110%) | `/styles/royal`; support: `/journal/history-of-royal-pet-portraits` |
| custom watercolor pet portrait / watercolor dog portrait | 140 / no data | 79% | T | P2 | `/styles/watercolor` |
| oil painting of dog / dog oil painting | no data | n/a | T | P2 | `/styles/oil-classic` |
| line art dog portrait / minimalist dog portrait | no data | n/a | T | P3 | `/styles/fine-line` |
| pop art dog portrait | no data | n/a | T | P3 | `/styles/pop-art` |
| admiral dog portrait / dog in military uniform painting | no data | n/a | T | P3 | `/styles/admiral` |
| dog portrait styles (how to choose) | no data | n/a | I/C | P2 | `/journal/watercolor-vs-oil-vs-line-art` |

### 3. Product / format

| Keyword | Volume | US share | Intent | Priority | Target URL |
|---|---|---|---|---|---|
| pet portrait canvas / custom dog canvas | 720 (Dec 1,300) | 82% | T | P1 | `/shop/canvas` |
| framed dog portrait / framed pet portrait | no data | n/a | T | P2 | `/shop/framed` |
| dog portrait print | no data | n/a | T | P2 | `/shop/poster` |
| digital pet portrait | no data | n/a | T | P3 | `/shop/digital` |
| canvas vs framed print | no data | n/a | I | P2 | `/journal/canvas-vs-framed-print-vs-poster` |
| what size art above sofa / wall art size guide | no data | n/a | I | P3 | `/journal/what-size-art-for-your-wall` |
| how to hang a canvas / how high to hang art | no data | n/a | I | P3 | `/journal/how-to-hang-a-canvas-or-framed-print` |

### 4. Breed long tail (32 pages)

| Keyword pattern | Volume | Intent | Priority | Target URL |
|---|---|---|---|---|
| `<breed> portrait`, `custom <breed> portrait`, `<breed> painting`, `<breed> portrait from photo` | ~90/mo for "french bulldog portrait" (100% US); smaller for most breeds | T | P1 for the AKC top 10, P2 for the rest | `/breeds/<slug>` |
| `<breed> gifts`, `gifts for <breed> lovers` | no data | C | P2 | `/breeds/<slug>` (gift section links `/gifts/*`) |
| dog portraits by breed | no data | C | P3 | `/breeds` |
| rescue dog portrait, mixed breed dog portrait, gotcha day gift | no data | T/C | P2 | `/breeds/mixed-breed` |

Breeds covered (AKC 2025 rank order): French Bulldog (1), Labrador Retriever (2), Golden Retriever (3), German Shepherd (4), Dachshund (5), Poodle (6), Beagle (7), Rottweiler (8), German Shorthaired Pointer (9), Bulldog (10), Cane Corso (11), Cavalier King Charles Spaniel (12), Yorkshire Terrier (13), Australian Shepherd (14), Doberman (15), Pembroke Welsh Corgi (16), Miniature Schnauzer (17), Boxer (18), Pomeranian (19), Bernese Mountain Dog (20), Shih Tzu (21), Great Dane (22), Boston Terrier (23), Chihuahua (24), Havanese (25), Border Collie (26), English Springer Spaniel (27), Shetland Sheepdog (29), Siberian Husky (30), plus Goldendoodle, Labradoodle and Mixed breed / rescue.

### 5. Gifts (seasonal)

| Keyword | Volume | US share | Peak | Intent | Priority | Target URL |
|---|---|---|---|---|---|---|
| gifts for dog lovers / dog lover gift | 9,900 | 44% | Dec ~40.5K | C | P1 | `/journal/gift-ideas-for-dog-lovers` (listicle intent); hub `/gifts` |
| dog christmas gift / christmas gifts for dog owners / christmas gifts for dog lovers | 14,800 / no data / no data | 36% | Dec ~90.5K | C | P1 (time-critical) | `/journal/christmas-gifts-for-dog-owners`; transactional `/gifts/christmas` |
| personalized dog gift | 2,900 | 83% | Dec ~9.9K | T/C | P1 | `/gifts` |
| dog mom gift / gifts for dog moms | 4,400 | 82% | Dec ~12.1K; Mother's Day week | C | P1 (Apr–May, Dec) | `/journal/gifts-for-dog-moms`; `/gifts/mothers-day` |
| dog dad gift | 4,400 | 43% | Jun ~14.8K | C | P2 (May–Jun) | `/gifts/fathers-day` |
| new puppy gift / gifts for new puppy owners | ~800 | 60% | flat | C | P2 | `/journal/new-puppy-gift-ideas`; `/gifts/new-puppy` |
| birthday gift for dog lover | no data | n/a | n/a | C | P3 | `/gifts/birthday` |

### 6. Memorial and sympathy (evergreen)

| Keyword | Volume | US share | Seasonality | Intent | Priority | Target URL |
|---|---|---|---|---|---|---|
| pet memorial gifts | 12,100 | 67% (~8.1K) | Dec ~18.1K | C/T | P1 | `/gifts/memorial` |
| dog memorial / dog memorial ideas | 8,100 | 67% | flat | I/C | P1 | `/journal/dog-memorial-ideas` |
| pet loss gift | 6,600–7,300 | 74% | Sep–Jan high | C/T | P1 | `/gifts/memorial` |
| dog memorial gift | 3,600 | 67% | Dec ~5.4K | T | P1 | `/gifts/memorial` |
| pet sympathy card / what to write in a pet sympathy card | 5,400 (KD 32) | 67% | Feb–May slightly higher | I | P1 (easiest win) | `/journal/what-to-write-in-a-pet-sympathy-card` |

### 7. Photo how-to (top of funnel that feeds conversion)

| Keyword | Volume | Intent | Priority | Target URL |
|---|---|---|---|---|
| how to photograph your dog for a portrait / best photo for pet portrait | no data | I | P2 | `/journal/how-to-photograph-your-dog-for-a-portrait` |
| can I use an old/blurry photo for a pet portrait | no data | I | P2 | same article + `/faq` |

### Deliberately not targeted

- **Cat terms** ("cat portrait", "custom cat portrait"): we're dog-only. "pet portrait" pages should still rank, but copy stays about dogs.
- **"free AI pet portrait" / "ai pet portrait"**: low purchase intent, and positioning says not to lead with AI. We answer it honestly in the FAQ and how-it-works instead.
- **Necklace, tattoo and embroidery modifiers** (rising in Trends): not in the catalog.
- **Competitor brand terms**: no on-site use (hard rule). Comparisons stay in `docs/`.

## Avoiding cannibalization

- **Journal gift guides target listicle intent** ("gifts for dog lovers", "christmas gifts for dog owners"), because those SERPs are dominated by lists. **`/gifts/*` pages target transactional intent** ("custom dog portrait christmas gift", "dog memorial gift"). Each journal guide links to its matching `/gifts/<occasion>` page, and each gift page should link back to the guide.
- **Breed pages own `<breed> portrait`.** Style pages own `<style> dog portrait`. Breed pages link to their 4 recommended styles; style pages (Team C2) should link to 3–6 breeds that suit them (`breedsForStyle()` in `src/content/breeds.ts` returns them).
- **The home page owns "custom dog portrait(s)"**, and no other page should use it as its H1.

## Seasonal publishing calendar

| When | Action |
|---|---|
| **Now (Oct 13)** | Christmas guide live (cutoff Sat Dec 10 US / Dec 5 CA, Gift Reveal until Dec 25). Submit sitemap to Search Console. Submit `/feeds/google.xml` to Merchant Center. |
| Nov 1–20 | Refresh the Christmas guide (`updated` date) if the cutoffs or carrier guidance change. Internal links from the home page and `/gifts` to the guide. |
| Dec 13–25 | Shift messaging to Gift Reveal (last-minute). Content is already in place. |
| Jan | Memorial content push (first holidays without a pet). Refresh the sympathy-card article. |
| By Apr 1, 2027 | Refresh the dog-mom guide for Mother's Day (Sun May 9, 2027). |
| By May 15, 2027 | Father's Day content (Sun Jun 20, 2027) for "dog dad gift" (June peak). |
| Aug 26 | National Dog Day is a social moment, not a search one. No SEO action needed. |

## Technical SEO shipped (Team D)

- `src/app/sitemap.ts`: 84 URLs (18 static routes, 12 styles, 4 product types, 6 gift occasions, 32 breeds, 12 articles). Private routes are excluded. Static pages omit `lastmod` rather than faking "today".
- `src/app/robots.ts`: allow all; disallow `/admin`, `/api`, `/reveal`, `/order`, `/partners/stats`; points to the sitemap.
- `src/app/feeds/google.xml/route.ts`: Merchant Center RSS feed (23 items: 15 variants plus 4 styles × default canvas/framed sizes). Static, revalidated daily, crawlable.
- `src/app/opengraph-image.tsx`: generated site-wide 1200×630 OG image.
- `src/lib/seo.ts`: JSON-LD builders (Organization, WebSite, Product with AggregateOffer from the catalog, BreadcrumbList, FAQPage, Article, ItemList), plus `pageMetadata()` (canonical, OG, Twitter, default OG image). **No ratings or review markup**, because we have no reviews.

### Asks for other teams

1. **Home page:** render `organizationJsonLd()` and `websiteJsonLd()` from `@/lib/seo`. It currently sets `openGraph` without `images`, so it loses the generated OG image. Use `pageMetadata()` or add `images: [DEFAULT_OG_IMAGE]`.
2. **Any page that sets `openGraph`** has the same issue. Next only applies `app/opengraph-image` to pages that don't override `openGraph`.
3. **Footer/nav:** add a "Shop by breed" link to `/breeds` (the footer already links `/journal`).
4. **Style pages:** link to suitable breeds via `breedsForStyle(slug)`.
5. **`/reveal/*` and `/order/*`:** add `robots: { index: false }` metadata too. robots.txt stops crawling, but a disallowed URL that's shared publicly can still be listed as a bare link. If that ever happens, allow crawling of those paths so Google can see the noindex.
