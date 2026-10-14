# How competitors acquire customers (teardown, Oct 14, 2026)

*Scope:* Crown & Paw, West & Willow, Purr & Mutt, Perkie Prints, Gold & Crown, Crown & Canvas, Pet Canvas, Paw & Glory, Cuddle Clones, plus Instapainting and Pop Your Pup (both showed up as active Google advertisers), top Etsy sellers and AI pet-portrait apps.

*Builds on:* `docs/research/competitors.md`, `cp-site.md` §6, `growth.md` and `influencers.md`. Findings already in those files are not repeated except where I re-checked them today. Companion docs in this folder: `channel-economics.md` and `partners-referrals.md`.

*No one was contacted and no app code was changed.*

## How to read the evidence

**Confidence tags**
- **[V]** Pulled directly today (Oct 14, 2026) from the source: Google Ads Transparency Center, public profile data, site HTML, Klaviyo form configs or sitemaps.
- **[3P]** From a third-party tool (Motion, FindNiche, Etsyhunt, Similarweb, Lasso and similar). Modeled or sampled; treat as directional.
- **[E]** Our own estimate or inference.

**What I could not see**
- **Meta Ad Library.** facebook.com/ads/library returns a JS challenge that redirects to login, so I could not count Meta ads directly. Meta numbers below come from Motion's ad library. §9 lists the 10-minute manual check.
- **TikTok Creative Center and TikTok discover pages.** Both are fully client-rendered or need signed API calls, so I have no video-level view counts.
- **Etsy and Amazon search** are blocked by DataDome and 503 errors. Etsy data comes from FindNiche and Etsyhunt.
- **Web search budget.** The shared session limit ran out partway through. Everything after that point came from direct fetches of known URLs.

---

## 0. Summary

1. **Cuddle Clones is the category's acquisition machine, not Crown & Paw.**
   - 545 active Meta ads, about 32 new creatives a week, mostly "yapper" (talking-head) testimonials [3P, Motion, refreshed about June 2026].
   - 1.2M TikTok followers and 21.8M likes [V].
   - 65 Google creatives shown in the last 30 days [V].
   - 31 Klaviyo forms: a popup per product line, plus giveaways and embeds [V].
   - It proves that personalized-pet products can win TikTok and Meta through emotional testimonial volume.
2. **Crown & Paw is the most active portrait brand on Google.**
   - 76 creatives shown in the last 30 days, 61 of them in the last 7 days, and 30 new since mid-July. 33 are Shopping/PMax product-feed creatives [V].
   - Its search ads lean on "Designed by real artists", a 4.3★ seller rating from about 5.3K reviews, price extensions from $26.76 and apparel cross-sells.
   - It is also testing **ChatGPT ads**: 4 creatives observed through Jul 20, 2026, including "Buy 1 Get 1 FREE" gift and memorial ads [3P].
3. **West & Willow's Google creative is stale.** 29 creatives were shown in the last 30 days, but none is newer than Mar 24, 2026. Some of its paid search goes to a cat-behavior blog post [V].
   - Its YouTube/Meta video files are named "Pic To Portrait AI Videos" and "Before & After UGC Videos" (4:5 format) [V].
   - Meta: 29 active ads, about 9 new a week [3P].
4. **"Free preview, no card needed" is almost uncontested as a US ad message.**
   - Only **Gold & Crown** (Italy) runs it. It started US Google ads on Jul 20, 2026: 9 creatives, all active this week. Its ads say "powered by AI" in the description and pair the message with a 40%-off banner [V].
   - Perkie Prints says "Upload a photo, get a preview" but showed only 4 ads in 30 days [V].
   - Crown & Paw and West & Willow cannot make the claim.
5. **Some competitors have gone quiet on US Google.**
   - Purr & Mutt has run no US Google ads since Nov 2025 [V].
   - Pet Canvas, Portrait Union and My Pet Canvas run none [V].
   - DogArt.ai ran 2 ads in April 2026 and has run none since [V].
6. **Every competitor acquires customers with discounts.** Examples: Crown & Paw's "Extra 25% off" plus a free $40 mug and BOGO in ChatGPT ads, Purr & Mutt's "MASSIVE 20% OFF SALE NOW ON", Paw & Glory's 25% off in search ads, Gold & Crown's 40% off, Cuddle Clones' 15–30% / $50–70 popups, and West & Willow's "up to 20% off first order". Honest pricing is a real differentiator, but it means **our hooks must be mechanism hooks (free preview, instant gift) rather than price hooks.**
7. **Portrait brands get almost nothing from organic TikTok** [V]:

   | Brand | TikTok followers | Videos | Followers per video |
   |---|---|---|---|
   | Crown & Paw | 13.9K | 1,307 | about 11 |
   | West & Willow | 3.7K | 476 | about 8 |
   | Paw & Glory | 3.9K | 169 | about 23 |
   | Perkie Prints | 463 | 107 | about 4 |

   Cuddle Clones, by contrast, gets about 1,150 followers per video. **The slot for organic portrait reveals is empty.**
8. **Pinterest is neglected.** Crown & Paw has 1.5K followers, West & Willow 767, Perkie 9 and Purr & Mutt 39, despite large auto-pinned catalogs [V]. Gift and memorial planning happens there, so this is free shelf space.
9. **Etsy is a red ocean and not our channel.**
   - About 245K "custom pet portrait" listings, median price about $18 [3P].
   - The top listings are $3.99–$18 digital and watercolor portraits with 20–40K lifetime sales each [3P].
   - Hand-painted sellers are losing rank to undisclosed AI listings [3P, WIRED via ShopiFreaks].
   - Standalone AI pet-portrait apps have almost no traction (8 and 0 App Store ratings) [V]. The money is in the physical gift.
10. **With $100 we cannot buy scale, but we can buy a clean read** on which honest hook produces the cheapest *preview starts*. Recommended split: **$60 on Google exact/phrase long-tail with the "free preview" message, $40 on Meta Reels for 3 hook families.** Decision rule: scale a hook only if it costs ≤$4 per preview generated (§7.2).

---

## 1. Scoreboard: where each competitor is visible (US)

Google figures are creatives in the Google Ads Transparency Center, region US: shown in the last 30 days, with new creatives first shown since Jul 16 in brackets. "Feed" counts creatives built from a product feed (Shopping/PMax item IDs). These are creative counts, not spend.

| Brand | Meta (active ads) | Google 30d [new 90d] | Feed creatives 30d | TikTok (followers / likes / videos) | Instagram | Pinterest followers |
|---|---|---|---|---|---|---|
| Crown & Paw | Not visible here. History of Snapchat scale-up with MuteSix (`growth.md`) | **76** [30] | **33** | @crownandpawofficial: 13.9K / 1.9M / 1,307 [V] | about 222K [3P, undated, socialveins] | 1,510 [V] |
| West & Willow | 29 active, about 9 new a week [3P] | 29 [0] | 5 | @thewestwillow: 3,660 / 98.8K / 476 [V] | 311K [V] | 767 [V] |
| Cuddle Clones | **545 active, about 32 new a week** [3P] | 65 [3] | 13 | **1.2M / 21.8M / 1,043** [V] | 583K [V] | 17,920 [V] |
| Gold & Crown | n/a | 9 [9], all started Jul 20 to Oct 7, 2026 | 0 | none found | n/a (blocked) | none |
| Paw & Glory (UK) | n/a | 12 [4] | 4 | 3,863 / 23.7K / 169 [V] | 59K [V] | n/a |
| Purr & Mutt (UK) | n/a | **0** (last new creative Nov 4, 2025) | 0 | 610 / 3,256 / 118 [V] | 12K [V] | 39 [V] |
| Perkie Prints | n/a | 4 [0] | 1 | 463 / 1,905 / 107 [V] | 61K [V] | 9 [V] |
| Crown & Canvas | n/a | 0 (2 creatives started Aug 26, 2026) | 0 | no brand account (the handle belongs to an unrelated artist) | 478 [V] | none |
| Pet Canvas | n/a | 0 | 0 | 7 (@petcanvas.art) [V] | 33 [V] | 1 [V] |
| Instapainting | n/a | **65** [0] | 1 | n/a (the handle is an unrelated painting company) | n/a | n/a |
| Pop Your Pup | n/a | 7 [0] | 2 | 11 [V] | n/a | n/a |
| Portrait Union, My Pet Canvas | n/a | 0 | 0 | — | — | — |
| DogArt.ai | n/a | 0 (2 creatives in Apr 2026) | 0 | — | — | — |

**Who pays for the ads** (Transparency Center advertiser names) [V]:
- Crown & Paw: "APR ECOMMERCE LIMITED". This may indicate a holding or operator entity behind the brand; worth verifying.
- Cuddle Clones: "CC Brand Holdings LLC", plus 3 creatives from "Ads Care Agency Global Limited".
- Gold & Crown: "Pacomaro Srl".
- Crown & Canvas and Pop Your Pup: individuals.
- Instapainting: "Likefm Inc".

**Tracking pixels in the site HTML show which channels each brand is buying or testing** [V]:
- **Crown & Paw:** Snapchat, TikTok, Reddit, Bing, Google Ads; Klaviyo.
- **West & Willow:** Snapchat, **AppLovin**, Bing, Google Ads; Attentive and Postscript SMS, Klaviyo.
- **Cuddle Clones:** **AppLovin**, Reddit, Google Ads; Triple Whale, Klaviyo.
- **Paw & Glory:** Google Ads; Triple Whale.
- **Perkie Prints:** Google Ads; Omnisend.
- **Purr & Mutt:** Bing, Google Ads.

AppLovin's e-commerce ads (in-app ad network) are being tested by the two highest-volume players. That is a channel for later, not for $100.

---

## 2. Paid social

### 2.1 West & Willow (Meta: 29 active ads, about 9 new a week) [3P Motion; video files V]

**Formats in the library:** unboxing 15%, before/after 11%, montage 7%. Recent ads are tagged POV, static-to-video hybrid, Us-vs-Them, UGC overlay, split screen, reaction, screen recording, skit, demo and testimonial.

**Lengths:** 13–32 seconds. Memorial ad about 32s, POV unboxing about 24s, montage about 13s.

**CTAs:** "Create yours", "Turn your photo into art", "Order your memorial portrait".

**Video ads on Google/YouTube** (file names via YouTube oEmbed, frames via YouTube thumbnails) [V]:
- *"Pic To Portrait AI Videos" (4:5, last shown Aug 25, 2026).* A woman holds up a phone-photo print, and the dog becomes the illustrated portrait. Overlays: "Best gift for dog parents", "Order yours in minutes". The format shows the photo-to-art transformation, which is our core mechanism.
- *"Before & After UGC Videos" (4:5).* A dog sits beside its framed portrait. Overlay: "We turn your pet photo into the best looking portraits".
- *Evergreen 2020 spots* ("Mashable", "Star Freeze") were still served this week. The creative refresh on Google is slow.

**Offers seen:**
- Free mug when bundled with a portrait (auto-free in cart).
- Free shipping over $100.
- Promotion extension: "Up to 20% off your first order".
- Give $20, Get $20 referral.

### 2.2 Cuddle Clones (Meta: 545 active ads, about 32 new a week) [3P Motion]

- **Mix:** "yapper" 12% of the library but **17 of the 20 most recent ads**; demo 16%; testimonial 13%. Secondary tags: reaction, screen recording, grid swap, greenscreen.
- **Length:** mostly 40–64 seconds, so much longer than portrait brands. Story-led testimonials hold attention.
- **Hooks:** recognition ("Is this Kirby?"), likeness ("This looks just like our dog"), grief ("14 years was not long enough with…"), a grief statistic (about 70% grieve a pet like family), skeptic-first openers, and repeat buyers ("I've ordered four").
- **Themes:** memorial, comfort for elderly parents with dementia, likeness, special-request details (ear position, tongue).
- **CTA:** usually none, or "through the link". Few or no offers inside the video; the offer lives in popups and search.
- **Google video ads** [V]: "CC Hero Video Golf Covers AD", "Custom Stuffed Animal AD", and a pajama "yapper" in a talking-head selfie format.

### 2.3 Crown & Paw [V unless noted]

- **YouTube/Demand Gen videos shown this week:**
  - "Cherish memories of your furry best friend…": a polished Christmas lifestyle spot with a golden retriever, a tree and a gift opening between friends.
  - "How To Order A Crown And Paw Portrait".
  - "Expertly Crafted Pet Portraits – How it Works".
  - "Wear Your Pet In Style": an apparel push uploaded from an ad-only channel.
- **ChatGPT ads** [3P, Tru Commerce, last observed Jul 20, 2026]:
  - "The Gift Pet Lovers Actually Want" + Buy 1 Get 1 FREE.
  - "Gift Their Pet As Custom Art".
  - "Custom Pet Memorial Portraits | Buy 1 Get 1 FREE".
  - "A Gentle Way To Remember Them".
  - This is the first evidence of a portrait brand buying conversational-AI placements. Memorial gets 2 of the 4 creatives.
- **Popups:** unchanged from `cp-site.md` (free $40 mug, SMS VIPs, CPWELCOME 10%).
- **Homepage claims now include** "FREE previews & edits" and "Unlimited FREE revisions". These are still post-purchase proofs, now worded to blunt preview-first rivals.

### 2.4 Gold & Crown (the closest analog to our funnel) [V]

- **9 US Google creatives**, all first shown between Jul 20 and Oct 7, 2026: text, image, and one video.
- **Headlines:** "Free Preview, No Card Needed – See Your Portrait Free", "Made From Your Own Photo – The Bond That Never Fades", "Immortalize Your Loved Ones in Fine Art".
- **Display creative:** "Some love deserves a wall" with a **40% OFF** roundel.
- **Disclosure:** the description says "powered by AI and crafted for eternity". They disclose AI in the body, not the headline, and still scale.
- **Video:** appears AI-generated [E]. A woman in a moody room with a black-and-white portrait of herself and her dog, overlay "See the preview now for free".
- **Product:** people and pets together ("Cheek to Cheek", "Nestled", "Embraced", "Cherished in Colour"). Up to **100 free watermarked previews**; the digital sale is final once delivered; canvas over solid wood. Trustpilot 4.7 from 266 reviews; claims 100,000 portraits.

### 2.5 Others

- **Paw & Glory** [V]: Google video "Awesome reaction captured on camera #Pawcasso" shows a named "happy customer" unwrapping a royal portrait, overlay "More than just a gift ★★★★★". Search ads offer "25% Off Custom Pet Portraits… Free proof included". The site now leads with "Free Preview / Preview before print", so the UK market is moving to preview-first. It has a brand-ambassador program (discount codes, gifting, usage rights, affiliate; terms unpublished).
- **Purr & Mutt** [V]: a permanent "MASSIVE 20% OFF SALE NOW ON" banner, "70,000+ happy customers", free worldwide delivery, free instant previews. No US Google ads in 11 months. Affiliate: Awin, **20% commission, 30-day cookie** [V].
- **Perkie Prints** [V]: the site copy is the most similar to ours ("See your pet in every style, free. Under a minute, no account, no card"; "Artist-reviewed"; "Revision, reprint, or refund"). Paid effort is minimal (4 Google ads in 30 days). **61K Instagram followers** against 463 on TikTok; its blog runs a "Pet of the Month" series (community-led Instagram).
- **Instapainting** [V]: 65 search ads, all **anti-AI** ("100% hand-painted on canvas", "Photo to Oil Painting – $49", "Work directly with your artist", "Featured in Wired, TechCrunch…").
- **Pop Your Pup** [V]: "Real Artists – Real Art", "200,000+ happy customers", price extension from $41.99.

### 2.6 Creative formats ranked by evidence, and fit for us

| Rank | Format | Who runs it (evidence) | Fit for Pup Prints |
|---|---|---|---|
| 1 | **Testimonial "yapper"** (talking head, 40–60s, story-first) | Cuddle Clones (17 of its last 20 ads, 545 active) | High, once we have real customers. Before that, founder and disclosed-creator versions only. |
| 2 | **Photo → portrait transformation** | West & Willow "Pic To Portrait" (4:5); Gold & Crown preview overlay | **Highest.** Our live free preview *is* this format, unedited, in about a minute. |
| 3 | **Dog meets its own portrait** (before/after) | West & Willow UGC before/after; dog-reaction clips | High. Film team or friends' dogs (labelled). |
| 4 | **Gift unwrap with recipient reaction** | Paw & Glory "#Pawcasso"; West & Willow unboxing (15% of its library); Crown & Paw Christmas spot | High in Q4. Only real reactions with permission; creators must disclose. |
| 5 | **Memorial headline / story** | West & Willow memorial ad (32s); Crown & Paw ChatGPT memorial ads; Cuddle Clones grief yappers | High, gentle: no urgency, no discount. |
| 6 | **Us-vs-Them split** (Gen Z copy) | West & Willow ("camera roll pic and straight on ur wall") | Medium. Must say "typical portrait shops", never a brand name. |
| 7 | **Polished lifestyle / holiday spot** | Crown & Paw | Low for us: expensive and the least differentiated. |
| 8 | **Discount-led static** | Gold & Crown 40%, Paw & Glory 25%, Crown & Paw BOGO | Off-brand under our honesty rules. Use dated events only. |

---

## 3. Search (Google)

### 3.1 Who is bidding and what they say [V]

| Brand | Shown 30d / 7d | Mix (30d) | Copy pattern |
|---|---|---|---|
| Crown & Paw | 76 / 61 | 33 text, 33 image/feed, 10 video | Brand + "Custom Dog Portraits". "Classic Pet Art Portraits – Treat Your Pet Like Royalty". "Designed By Real Artists. Fully Tracked Shipping". "The Biggest & Best Pet Portrait Brand On The Internet". Sitelinks: Puppy To Adult Portrait, Classic, Photobooks, Hawaiian shirt, phone cases. **Seller rating 4.3★ (5,334)** and a price extension shown in ads. |
| Cuddle Clones | 65 / 62 | 50 text, 14 image/feed, 1 video | Mostly branded ("Cuddle Clones Deals", "Save up to 50"). Promotion extension "10% off With Email Sign Up". "A portion… donated to shelter animals". Gift extensions (golf headcovers, slippers, socks). |
| Instapainting | 65 / 60 | 63 text | Hand-painted, $49, unlimited revisions, money-back guarantee |
| West & Willow | 29 / 29 | 17 text, 9 image/feed, 3 video | "Custom Pet Portrait Gifts – Save Big", "Affordable Pet Portraits", "We accept 98% of all photos!", "Christmas Gifts For Pet Lovers", **plus paid ads to "5 Weird Things Cats Do When They Love You"** (blog content) and "Up to 20% off your first order". |
| Paw & Glory | 12 / 8 | 7 image/feed, 3 text, 2 video | "Turn Your Pets into Royalty", "25% Off… Free proof included", seller rating 4.6★ (17) |
| Gold & Crown | 9 / 9 | 5 text, 3 image, 1 video | **"Free Preview, No Card Needed"**, "No Sign Up Needed", "powered by AI", seller rating 4.6★ (71) |
| Pop Your Pup | 7 / 6 | 4 text, 3 feed | "Real artists, unlimited edits", "200,000+ happy customers" |
| Perkie Prints | 4 / 4 | 3 text, 1 feed | "Upload a Photo, Get a Preview… Free shipping over $100", "Preview included" |

**What this means [E]:**
- **Incumbents bid mostly on their own brand and broad gift terms, and lean on product feeds.** Crown & Paw has the deepest Shopping presence. Expect to meet Crown & Paw and West & Willow Shopping cards on "custom dog portrait canvas"-type queries.
- **The search message splits two ways:**
  - **Anti-AI:** Instapainting, Crown & Paw "real artists", Pop Your Pup "real art".
  - **Free and AI-forward:** Gold & Crown.
  
  No one says "see it free in a minute, finished and checked by a person, free remake or full refund". That is our honest middle ground.
- **Seller-rating stars are a real asset in these auctions** (Crown & Paw shows 4.3★ from 5,334). We start with none. Turning on Google Customer Reviews from order #1 is the only honest path (already in `growth.md`).
- **I could not verify keyword-level auction overlap** (no SERP or SpyFu access). Breed long-tail ("french bulldog portrait") and "free preview" phrasings are *likely* thin. The $100 test in §7.2 is designed to confirm or refute this.

### 3.2 SEO footprint from sitemaps [V]

| Site | URLs | What the URLs are | Read |
|---|---|---|---|
| Paw & Glory | 23,723 | 7,450 products + localized copies, 536 blog posts, 477 URLs containing "christmas", 224 "royal" | Volume SEO: a SKU per costume × product, plus seasonal pages |
| Crown & Paw | 2,855 | 1,963 products, **598 collections**, 189 blog posts (grief posts such as "what to say when someone loses a pet"), 113 "christmas" URLs | Collection-page sprawl by occasion, gender and theme; grief content for memorial |
| Cuddle Clones | 1,034 | 587 products, 212 blog posts, 146 collections, 118 "christmas" URLs | Gift-occasion collections |
| West & Willow | 393 | 150 blog posts (decor and lifestyle: "how to decorate a long narrow living room"), 126 products | Decor-led content, small product set |
| Crown & Canvas | 194 | 87 style pages, **48 breed pages** (`/portraits/golden-retriever`…), occasion pages (Labor Day, Veterans Day, July 4th), **"crown-and-paw-alternative", "gold-and-crown-alternative", "west-and-willow-alternative", "Etsy pet portrait alternative"** | Programmatic breed × style × occasion pages plus competitor-alternative pages |
| Gold & Crown | 265 | 4 languages × about 53 pages, 30 help articles | Barely any SEO; paid-led |
| Perkie Prints | 260 | 99 pages, 93 products, a small blog including "Pet of the Month" | Light |
| Purr & Mutt | 321 | Mostly localized product copies | Light |

**Notes:**
- Every Shopify store here exposes `/agents.md`. It is a Shopify default, not a competitive edge.
- We cannot copy Crown & Canvas's competitor-name pages on-site; CLAUDE.md forbids competitor names in UI. The legitimate version is a "typical portrait shops vs. Pup Prints" page plus breed and occasion pages.

---

## 4. Organic social

### 4.1 What the numbers say

- **TikTok:** portrait brands post a lot and get little.

  | Brand | Videos | Followers | Likes | Avg likes per video [E] |
  |---|---|---|---|---|
  | Crown & Paw | 1,307 | 13.9K | 1.9M | about 1,450 |
  | West & Willow | 476 | 3.7K | 98.8K | about 210 |
  | Paw & Glory | 169 | 3.9K | 23.7K | about 140 |
  | Cuddle Clones | 1,043 | 1.2M | 21.8M | **about 20,900** |

  The difference is format, not category. Cuddle Clones posts recognition, reaction and testimonial stories about the *owner's emotion*. Portrait brands post product montages.
- **Instagram is where the portrait brands built audiences:** West & Willow 311K, Crown & Paw about 222K [3P], Perkie 61K, Paw & Glory 59K, Purr & Mutt 12K. Perkie's 61K on a tiny paid budget suggests a community engine (Pet of the Month, customer features, giveaways) [E].
- **Pinterest:** all portrait brands are under 1.6K followers, against Cuddle Clones' 17.9K. Pin counts are huge (Crown & Paw about 2.5M, Purr & Mutt about 1.5M) because Shopify catalogs are auto-pinned. Nobody runs a real organic Pinterest program.

### 4.2 Viral formats, 2025–2026 (verified view counts unavailable; see "What I could not see")

| Trend | What happened | Why it worked |
|---|---|---|
| **ChatGPT "pet as a human" / AI pet portraits** | Peaked April 2025, amplified by ChatGPT's own Instagram (`competitors.md`). TikTok topic pages now exist for "chatgpt dog portraits", "dog ai portraits" and "pet portrait generator". | Instant transformation, a shareable "guess who" reveal, zero cost to try. **It also taught the market that a digital AI portrait is free**, so we sell the object, the likeness check and the gift moment. |
| **Dog reacts to its own portrait** | Dog-reaction clips regularly reach tens of millions of views; one cited clip had about 20.9M (`influencers.md`) | A pet's reaction is unpredictable and comments ask "did he recognize himself?" |
| **Hair-and-fur portrait trend** (owner's hair plus dog fur in one artwork) | TikTok topic page "dog and owner hair drawing" | Owner-and-dog bond plus process ASMR |
| **Recipient recognition** ("Is that… Kirby?") | Cuddle Clones' top testimonial hook | The emotional turn happens in the first second |
| **Hand-painted process** | The most engaged item on the "pet portrait" topic page was a human artist's process video (search-tool summary, unverified) | Craft and time-lapse; this is the anti-AI camp's content |

---

## 5. Marketplaces

### 5.1 Etsy

**Market** [3P]:
- About 245K listings target "custom pet portrait"; median price about $18 (range $15.50–$30.90).
- About half of page-one results are paid placements.
- Page-one shops have a median of about 4,250 reviews (Listifyai snapshot, Aug 16, 2026, via search snippet; the page has since changed).
- RankHero puts the keyword at about 8.1K searches and about 234K listings.

**Top listings** (FindNiche estimates) [3P]:

| Shop | Listing | Price | Lifetime sales | Revenue | Reviews | Now selling |
|---|---|---|---|---|---|---|
| RiverryStudio | Mini custom watercolor pet portrait (since Oct 2021) | $18.37 | 41,536 | about $763K | 8,395 (4.9★) | about 71/mo |
| ModPawsUS | Watercolor digital portrait (since Oct 2023) | $3.99 | 29,517 | about $118K | 5,663 | about 59/mo |
| ArtsifOfficial | Royal dog/regal cat, framed or digital (since Jun 2021) | $9.99 | 21,507 | about $215K | 5,727 | about 57/mo |
| JesseHotshoePhoto | Watercolor portrait | $12.95 | 6,796 | about $88K | — | — |

**Current weekly movers** (Etsyhunt paintings ranking, Oct 1, 2026) [3P]:
- "Custom Hand-Painted Pet Portrait… Baroque Frame, **Pet Loss Gift**" (PawgetherArt, 27/wk).
- "Mini Custom Watercolor Pet Portrait… **Pet Memorial Art**" (onemooregift, 21/wk).
- "Hand Painted… **Pet Memorial Portrait**… **Pet Loss Gift**" (DuduStudioUS, 20/wk).

**Memorial keywords dominate the titles that are moving now.**

**A UK poster seller (UniquePetPrints)** reports [3P, Alura interview]:
- More than 14,300 lifetime sales and about £9.1K/month revenue.
- 62% margin and a 5% conversion rate.
- Traffic comes from Etsy Ads plus page-one ranking.
- Its best seller is a simple pet-only design.

**Listing-photo conventions** (images surfaced on FindNiche pages for top listings and their related listings) [V]:
- First image: the portrait in a light wood frame on linen with props, with the pet's name in script.
- Badge overlays: "SHIPS NEXT DAY", "FAST SHIPPING", "UNLIMITED PROOFS", "READY IN 6 HRS", "1,000,000 COMBINATIONS".
- Option grids showing a style collage.
- Adjacent personalized formats: 90s "bootleg" rap-tee prints of the pet, stained-glass suncatchers, engraved pet-face necklaces, golf towels, blankets.
- Buyers on Etsy pay for **speed and proof certainty**, and the badges sell exactly that.

**AI on Etsy** [3P, ShopiFreaks summarizing WIRED, Jul 22, 2026]:
- Etsy has allowed AI art with disclosure since 2024, and even names a custom AI pet portrait as an allowed example. Enforcement is weak by Etsy's own admission.
- A Boulder pet-watercolor artist's sales fell 30% in 2022 and another 50% the following year, as cheaper AI portraits ranked above hers.
- A rival marketplace, Fybe, bans AI.

**For us [E]:** not a launch channel.
- Etsy's median is about $18 against our $59+ physical products.
- We can't move buyers off-platform to our preview.
- AI listings must be disclosed, which puts us in the cheapest bucket.
- Revisit only for a digital-plus-print SKU once we have reviews.

### 5.2 Amazon (Handmade / Custom)

Not verified: Amazon returned 503 to every fetch. No portrait competitor in this set links to Amazon from its site [V, homepage HTML]. Treat this as low priority. Amazon Custom supports text and image personalization, but the free-preview mechanism can't live there.

### 5.3 TikTok Shop

Not verified (client-rendered). Structural blocker from `influencers.md`: TikTok Shop personalization is text-based and fulfilment SLAs are 3-day ship. A photo-upload, approve-then-print product doesn't fit. **Use TikTok for content and Spark Ads, not the Shop.**

### 5.4 AI pet-portrait apps [V]

| App | Ratings | Released | Notes |
|---|---|---|---|
| "Pet Portrait AI: Dog & Cat Art" | 8 (5.0★) | Nov 2025 | 100+ styles |
| "PetStudio – Dog & Cat Portrait" | 0 | Feb 2026 | Sells canvas, framed and mugs in-app |

- A search-engine summary claimed an AI pet-art product earns about $858K a month. Its TrustMRR page shows **$2 lifetime revenue**, so the claim was false and is excluded.
- **Read [E]:** standalone AI generators don't capture spend. ChatGPT and Gemini make them free. The money is in physical gifts and trust.

---

## 6. Offers and funnels

### 6.1 Offer matrix (what each brand uses to acquire customers now)

| Brand | Headline offer | Lead capture | Urgency | Upsells / AOV | Guarantee | Referral / affiliate |
|---|---|---|---|---|---|---|
| Crown & Paw | "Extra 25% off best sellers"; BOGO (ChatGPT ads, Jul); free $40 mug with framed or canvas | Klaviyo: free-mug popup → SMS "VIPs" → CPWELCOME 10%; exit intent; 10% clothing popup [V] | Rolling countdown "order by [timer] for 25% off" (`cp-site.md`) | Extras step (queue jump, digital, certificate, gift card); Kaching bundles; Onward Checkout+; free shipping $75 | "100% happiness guarantee" | Social Snowball referral; Awin, 60-day cookie |
| West & Willow | Free mug with portrait (bundle); "Up to 20% off first order"; "Save Big" | Attentive / Postscript SMS (Klaviyo forms disabled) [V] | — | **Paid preview ($10)**, "Skip the line" product, digital download, two-pet, walnut/birch frames; free shipping $100 | Final sale except within 30 min | **Give $20, Get $20** [V] |
| Cuddle Clones | 25% off PJs, slippers, socks; $50 off plush | **31 Klaviyo forms** [V]: "Tap a bone to unlock" → pet name + **pet age (incl. "Pet passed away")** → email → SMS with OTP code → code valid **10 days**; giveaways with **+5 entries for SMS** | 10-day code expiry; "new subscribers only" | 25+ product lines (golf covers, PJs, bobbleheads, jewelry, memorial box) | 100% money-back | Awin + UpPromote; about 10%, 30-day cookie [3P Lasso] |
| Gold & Crown | **100 free previews, no card**; 40% off banner | Account and downloads | — | Size ladder priced after preview, digital included with most prints | Digital final; damaged canvas replaced | — |
| Paw & Glory | 25% off (search); "Limited-time offer" | Klaviyo; Loox | 10-min cart reservation (`competitors.md`) | **Cart-reward ladder:** free mug £65 → free digital £95 → free "First in Line" £120 | Free proof, unlimited revisions | Awin; brand-ambassador program |
| Purr & Mutt | Permanent "MASSIVE 20% OFF SALE" | Loox | Permanent sale | Free worldwide delivery | — | **Awin 20%, 30-day cookie** [V] |
| Perkie Prints | Free preview; $6.95 flat shipping, free $100+ | Omnisend; Junip | — | Mugs, apparel, stationery, "Ready-to-Ship" | Revision, reprint or refund | — |
| Crown & Canvas | From $29.99; free shipping US/CA | Newsletter ("11,000+ pet parents") | — | Gift wrap $9.99 | 14-day refund | — |

### 6.2 Patterns worth noting [E]

1. **Lead capture is product-specific and collects zero-party data.**
   - Cuddle Clones asks for the pet's name and age, with "Pet passed away" as an option. That one field segments the memorial buyer before the first email.
   - Our preview flow already collects the dog photo and name, so adding a single "in memory?" toggle gives the same segmentation without a discount popup.
2. **Two-step email → SMS with OTP is standard** at Crown & Paw and Cuddle Clones. The SMS step is framed as "order updates" (Crown & Paw) or more savings (Cuddle Clones). Our honest version: "Text me when it ships / send the gift reveal by text".
3. **Gifts-with-purchase beat %-off for the incumbents' hero offer.** Crown & Paw and West & Willow both lead with a free mug, and Paw & Glory with a reward ladder. A GWP protects the perceived price of the art.
4. **Urgency is mostly fake or rolling:** permanent sales, rolling timers, 10-day codes, cart reservations. Only Cuddle Clones puts "Holiday Shipping Cutoffs" in the main nav [V], which is honest, date-based urgency.
5. **Referral and affiliate rates to beat:** Purr & Mutt 20% / 30 days; Crown & Paw 60-day cookie (rate unpublished); Cuddle Clones about 10% / 30 days; West & Willow $20/$20 give-get.

---

## 7. Gaps we can exploit with $100 and zero brand

### 7.1 The gaps

| # | Gap | Evidence | How we use it |
|---|---|---|---|
| G1 | **"See it free first, no card" is nearly uncontested in US ads.** | Only Gold & Crown (since Jul 20) and a trickle from Perkie. Crown & Paw and West & Willow cannot claim it. | Make it the headline of every search ad and the first 2 seconds of every video. |
| G2 | **Organic TikTok is unowned by portrait brands.** | About 4–23 followers per video for portrait brands vs about 1,150 for Cuddle Clones | Daily "send me your dog" reveals; the dog's reaction to its portrait; recipient recognition. Owner emotion, not product montage. |
| G3 | **Incumbents' Google creative is stale or wasted.** | West & Willow: no new creative since Mar 24, cat-blog ads, 2020 videos still serving. Purr & Mutt off US Google. Perkie at 4 ads. | Tight exact/phrase long-tail with a fresh "free preview" message can win cheap clicks [E, to be tested]. |
| G4 | **Every competitor discounts; trust is low.** | 20–40% offs, BOGO, timers. Trustpilot 3.8–3.9 for the leaders (`competitors.md`). | Mechanism plus guarantee hooks: "See it free first. Love it, or a free remake or full refund." No strikethroughs. |
| G5 | **Pay first, then wait for a proof, is still the leaders' model.** | Crown & Paw proofs in 1–3 days; West & Willow charges $10 to preview. Even Paw & Glory moved to "preview before print". | The screen-recorded preview *is* the ad (format #2 in §2.6). |
| G6 | **Pinterest is neglected.** | All portrait brands under 1.6K followers | 5–10 pins a day: breed × style, gallery wall, memorial ideas. $0. |
| G7 | **Nobody sells instant gifting.** | All offers are shipping-bound. Only Cuddle Clones even surfaces cutoffs. | Gift Reveal from Dec 11 to 24 is uncontested creative territory. |
| G8 | **The AI middle ground is open.** | One camp says "100% hand-painted / real artists" (Instapainting, Crown & Paw, Pop Your Pup). The other says "powered by AI, 40% off" (Gold & Crown). | "Made by our AI artist, finished and checked by our team. Love it, or a free remake or full refund." Honest and defensible. |
| G9 | **Dog and breed specificity.** | Everyone sells "pet". Crown & Paw has only about 20 golden-related URLs; Crown & Canvas has 48 thin breed pages. | Breed ads and pages ("Frenchie owners…") with real breed samples. |

### 7.2 The $100 test (run once tracking fires end to end: PreviewGenerated, PreviewLead, Purchase)

**Goal:** a clean read on which honest hook gives the lowest **cost per preview generated**. This is not profit; $100 cannot buy enough data to optimize for purchases.

**$60 on Google Search** (one campaign, 5–7 days, max CPC $1.75, US, mobile first):
- **Ad groups, exact and phrase:**
  1. "dog portrait from photo", "custom dog portrait", "pet portrait from photo".
  2. Royal and Renaissance: "royal dog portrait", "renaissance dog portrait".
  3. Breeds: "french bulldog portrait", "golden retriever portrait", "goldendoodle portrait", "dachshund portrait", "labrador portrait".
  4. "dog memorial portrait" (separate gentle copy).
- **RSA headlines:** "See Your Dog's Portrait Free" · "Free Preview. No Card Needed." · "Canvas From $59. Free US Shipping" · "Free Remake or Full Refund" · "Checked by a Person Before Print". Prices pulled from `@/lib/catalog`.
- **Extensions:** price extension (print $35, canvas $59, framed $75, digital $29); structured snippet (free preview · digital file included · remake or refund); sitelinks (Royal, Memorial, Breeds, How it works).
- **Negatives:** hand painted, oil painting, drawing, tattoo, jobs, how to draw, cat.
- **Expected [E]:** at $1.25–2.00 CPC, about 30–48 clicks. At a 35–50% upload-start rate (assumed, high intent), about 10–24 previews.

**$40 on Meta** (Instagram and Facebook Reels and Stories, one ABO campaign, 3 ads at about $13 each, 4–5 days, objective landing-page views or the PreviewGenerated custom conversion):
1. **Screen-recorded live preview**: "one phone photo → six portraits in a minute".
2. **A team dog meeting its own canvas** (labelled as our dog).
3. **Gift Reveal** (e-card opening on a phone, then the canvas).

- **Expected [E]:** at $18–28 CPM, about 1.4–2.2K impressions per ad. At 1.5–2.7% CTR, about 25–60 clicks in total. At 25–35% upload starts, about 6–20 previews.

**Decision rules:**
- Over the whole $100, we expect about 16–44 previews and **0–4 orders**.
- Scale only a hook with **≤$4 per preview**. At about 10% preview-to-order within 7 days that implies about $40 CAC, under the about $55 break-even in `growth.md`.
- Kill any ad above $8 per preview after $15 of spend.
- Re-run the winning hook as organic posts. Boost only posts that beat our organic median hold rate.

**$0 moves to run alongside:** Merchant Center free listings (sample-dog imagery), Pinterest pins, a daily TikTok/Reel in the "send me your dog" series, and Google Customer Reviews from order #1.

---

## 8. The 15 tactics to steal (adapted honestly for Pup Prints)

| # | Tactic | Seen at (evidence) | Our honest version | Cost / when |
|---|---|---|---|---|
| 1 | **Lead search ads with the mechanism, not a discount** | Gold & Crown "Free Preview, No Card Needed"; Perkie "Upload a photo, get a preview" | "See your dog's portrait free, no card" in headline 1, plus price and guarantee extensions. "AI" only in the body or FAQ, never the headline. | In the $100 test; week 2 |
| 2 | **Photo-in-hand → portrait transformation video** (4:5 and 9:16) | West & Willow "Pic To Portrait AI Videos" | Real screen recording of our preview plus the print on a wall. Label sample and team dogs. No AI-animated "fake reality". | $0; 3 cuts in week 1 |
| 3 | **Dog meets its own portrait** | West & Willow before/after UGC; dog-reaction virality | Film team and friends' dogs with their canvases. Caption honestly ("our dog Biscuit"). | About $45 COGS per print |
| 4 | **Recipient-recognition hook in the first second** | Cuddle Clones "Is this Kirby?"; Paw & Glory "#Pawcasso" unwrap | Gift-reveal reactions only from real recipients with written permission. Creator versions carry #ad. | Q4; seeded creators |
| 5 | **Talking-head "yapper" testimonials, 40–60s** | Cuddle Clones: 17 of its last 20 ads | Before reviews: founder yapper ("why we show you the art before you pay") and disclosed creator yappers. After: real customers only, never scripted fakes. | $0–200 per creator |
| 6 | **Creative velocity: 3–6 new concepts a week** | West & Willow about 9/week, Cuddle Clones about 32/week | Our previews cost cents, so we can out-produce everyone on *real* transformations. Weekly kill/keep. | Ongoing |
| 7 | **Zero-party data at capture, including memorial status** | Cuddle Clones popup asks pet age with "Pet passed away" | In the preview flow: dog's name plus "Is this in memory?" toggle. That routes the gentle track and suppresses urgency. No discount gate. | Build once |
| 8 | **Two-step email → SMS with OTP, framed as service** | Crown & Paw "SMS VIPs / order updates"; Cuddle Clones OTP step | "Text me when it ships / send the gift reveal by text". Unchecked by default, TCPA wording. | Klaviyo |
| 9 | **Gift-with-purchase instead of %-off** | Crown & Paw free $40 mug; West & Willow mug bundle; Paw & Glory reward ladder | Always included: hi-res digital file plus Gift Reveal (state the real $29 digital price). Dated events only: free ornament with canvas (Nov 27–30, Dec 1–10). | Margin, not cash |
| 10 | **Product-feed coverage and seller stars** | Crown & Paw 33 feed creatives in 30 days and 4.3★ seller rating in ads | Merchant Center feed with sample-dog lifestyle images; free listings first, Shopping after 30 conversions; Google Customer Reviews from order #1. | $0 → Shopping later |
| 11 | **Memorial as a parallel funnel with its own creative** | Crown & Paw ChatGPT memorial ads ("A gentle way to remember them"); West & Willow memorial ad; Etsy movers titled "Pet Loss Gift" | Memorial landing page, Watercolor/Botanical styles, no countdowns or discounts, gentle search ad group, and sympathy-gift mode in Gift Reveal. | Week 2–3 |
| 12 | **Programmatic breed × style × occasion pages** | Crown & Canvas 48 breed pages plus Veterans Day / Labor Day pages; Crown & Paw 598 collections | Breed pages with real breed samples and unique copy; occasion pages on real dates. No competitor-name pages on-site (CLAUDE.md); use "typical portrait shops". | SEO team |
| 13 | **Give/get referral surfaced at the emotional peak** | West & Willow Give $20 / Get $20; Crown & Paw Social Snowball | $15/$15 in-house (`partners` / `referral_events`), shown on the Gift Reveal page and the post-delivery email. The recipient is the next buyer. | Variable |
| 14 | **Creator terms that beat the category** | Purr & Mutt 20% / 30-day; Crown & Paw 60-day; Cuddle Clones about 10% / 30-day | 20% commission, 60-day cookie, free print, fast payouts, mandatory #ad. Already planned in `influencers.md`; these comps confirm it beats market. | Variable |
| 15 | **Community feature series on Instagram** | Perkie's "Pet of the Month" (61K Instagram followers on minimal ad spend) | "Dog of the Month" from opted-in customers and followers (consent checkbox unchecked by default). The winner gets a free canvas. Builds a real, honest gallery. | About $45 a month |

**Not stolen:**
- Permanent sales, rolling timers, BOGO "limited time", 10-minute cart reservations and auto-added protection (Crown & Paw, Purr & Mutt, Paw & Glory, Gold & Crown).
- Fake-looking review blocks such as "5.0/5 from 6 verified pet parents".
- Competitor-name "alternative" pages on-site.
- "Hand-painted" or "real artists only" claims.
- Gamified "tap a bone" random rewards. They are fine legally, but off-brand for a luxury house.

---

## 9. The 20 best hooks seen (paraphrased, not copied)

| # | Hook (paraphrased) | Seen at / format | Why it works | Pup Prints-safe adaptation |
|---|---|---|---|---|
| 1 | "It went up on the wall the same night." | West & Willow headline ad | Instant gratification plus decor proof | "On your phone in a minute. On your wall in days." |
| 2 | "They still deserve a place on the wall." | West & Willow memorial | Gentle permission to remember | Memorial track headline, no urgency |
| 3 | "Camera roll → wall." | West & Willow Us-vs-Them (Gen Z) | Shows effortlessness in 3 words | "Phone photo in. Portrait out. Free to see." |
| 4 | "The gift dog parents actually want." | West & Willow overlay; Crown & Paw ChatGPT ad | Solves gift anxiety | "For the dog person who has everything." |
| 5 | "Your everyday phone photo, turned into the best picture of them ever." | West & Willow before/after UGC | Elevation of the ordinary | Use with a real before/after of our own dog |
| 6 | "Wait… is that [dog's name]?" | Cuddle Clones testimonial | Recognition in second one | Real gift-reveal reaction, permissioned |
| 7 | "It's literally him." | Cuddle Clones testimonial | Likeness is the #1 fear | Pair with our likeness guarantee |
| 8 | "[N] years wasn't long enough." | Cuddle Clones memorial yapper | Grief honesty; the viewer self-identifies | Only creator- or customer-told, never in a cold brief |
| 9 | "I didn't think this would actually work." | Cuddle Clones skeptic yapper | Disarms the "AI slop / bad likeness" objection | Founder: "Don't trust us. Upload one photo and look." |
| 10 | "Completely unnecessary. Strangely emotional." | Paw & Glory homepage | Self-aware gift humor with a twist | Royal and Admiral humor ads |
| 11 | "First a laugh, then a lump in the throat." | Paw & Glory | Describes the gift reaction arc | Gift-reaction compilation caption |
| 12 | "More than just a gift." (named customer unwrapping) | Paw & Glory video | Social proof through a real person | Real customers only, after launch |
| 13 | "Some love needs a wall." | Gold & Crown display | Premium, emotional, short | Fits our couture voice almost as-is |
| 14 | "Keep them exactly like this." | Gold & Crown homepage | Captures the fear of time passing | Senior-dog and puppy angles |
| 15 | "See it first, free. No card." | Gold & Crown ad headline; Perkie | Removes the risk of paying first | Our core hook (tactic 1) |
| 16 | "Opened once, kept forever." | Gold & Crown | Heirloom framing justifies price | Canvas and framed premium copy |
| 17 | "They're not a pet. They're family." | Crown & Canvas hero | Identity validation | Breed-community ads |
| 18 | "The gift that proves you were paying attention." | Crown & Canvas | Flatters the giver | Gifting landing page |
| 19 | "A gentle way to remember them." | Crown & Paw ChatGPT memorial ad | Soft, non-salesy memorial entry | Memorial search ad group |
| 20 | "Puppy then, grown dog now, in one frame." | Crown & Paw "Puppy to Adult Portrait" sitelink | Then-and-now nostalgia | Two-photo "then and now" style test (product decision) |

Runners-up:
- "Why does every home with this portrait get asked about it?" (West & Willow's million-homes curiosity hook; we can't use the number).
- "Matching pajamas with your dog" (West & Willow and Cuddle Clones; we have no apparel).
- "Treat your dog like royalty" (Crown & Paw search copy).

---

## 10. Open items and a 15-minute manual verification checklist

1. **Meta Ad Library** (logged-in browser, US, active, all ads). Record the active count, oldest running ad, top formats and offers for each:
   - `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q=crown%20and%20paw`
   - Repeat with `west%20and%20willow`, `cuddle%20clones`, `gold%20and%20crown`, `perkie%20prints`, `paw%20and%20glory`, `purr%20and%20mutt`.
   - For the UK and EU brands, switch the country to GB to see reach data published under the EU Digital Services Act (DSA).
   - Ads running more than 30 days are the proven winners. Note their first 3 seconds.
2. **TikTok Creative Center → Top Ads**: keywords "pet portrait" and "custom dog portrait", US, last 180 days. Sort by likes and by CTR.
3. **Instagram follower counts** for @crownandpaw and @goldandcrown (blocked here; Crown & Paw is about 222K per a third-party aggregator, undated).
4. **Google SERP spot-check** (incognito, US) for the 12 keywords in §7.2. Record who shows Shopping cards and text ads. This confirms or kills the "thin long-tail" assumption before spending.
5. **Amazon:** search "custom dog portrait from photo" and note whether any of these brands sell there.

---

## Sources

**Ad libraries and transparency**
- Google Ads Transparency Center, US, queried Oct 14, 2026 by domain: https://adstransparency.google.com/?region=US&domain=crownandpaw.com
  - Same form for westandwillow.com, cuddleclones.com, goldandcrown.com, pawandglory.com, purrandmutt.com, perkieprints.com, crownandcanvas.us, instapainting.com, popyourpup.com, dogart.ai, petcanvas.art, portraitunion.com, mypetcanvas.com.
  - Raw JSON is in the scratchpad at `gat/*.json`; rendered ad images are in `acq/gimg/`.
- Motion, West & Willow Meta ads: https://motionapp.com/library/west-and-willow
- Motion, Cuddle Clones Meta ads: https://motionapp.com/library/cuddle-clones
- Tru Commerce, Crown & Paw ChatGPT ads: https://trucommerce.ai/chatgpt-ads/library/crown-and-paw
- YouTube video ads referenced by the Transparency Center (titles via oEmbed, frames via i.ytimg.com):
  - Crown & Paw: https://www.youtube.com/watch?v=8AIlybAZ_i8 · https://www.youtube.com/watch?v=T4ytvnEmfAE · https://www.youtube.com/watch?v=ZHTMm-_5UnU · https://www.youtube.com/watch?v=iTIZQJw4w0M
  - West & Willow: https://www.youtube.com/watch?v=JkdPZP9bUxA · https://www.youtube.com/watch?v=U47xdzXbtc4 · https://www.youtube.com/watch?v=xEGuOdEEgVA · https://www.youtube.com/watch?v=Yz6Rt6WwUaE
  - Gold & Crown: https://www.youtube.com/watch?v=VOpADIQJET0
  - Paw & Glory: https://www.youtube.com/watch?v=L5hxeXNyeCM
  - Cuddle Clones: https://www.youtube.com/watch?v=Vks6PFDgrAU · https://www.youtube.com/watch?v=8CbA1T9uTxY · https://www.youtube.com/watch?v=klBbMQPPu7I

**Competitor sites, funnels and popups** (fetched Oct 14, 2026)
- Homepages: https://www.crownandpaw.com · https://westandwillow.com · https://www.cuddleclones.com · https://www.goldandcrown.com · https://www.pawandglory.com · https://purrandmutt.com · https://www.perkieprints.com · https://crownandcanvas.us · https://create.petcanvas.art
- Klaviyo form configs:
  - Crown & Paw: https://static-forms.klaviyo.com/forms/api/v7/NXithY/full-forms
  - Cuddle Clones: https://static-forms.klaviyo.com/forms/api/v7/VmTcH4/full-forms
  - West & Willow (forms disabled): https://static-forms.klaviyo.com/forms/api/v7/Q4V4Ay/full-forms
- Sitemaps: `https://<domain>/sitemap.xml` for each site above.
- Paw & Glory brand ambassador: https://www.pawandglory.com/pages/brand-ambassador

**Affiliate terms**
- Purr & Mutt on Awin: https://ui.awin.com/merchant-profile/30883
- Cuddle Clones (third-party listing): https://getlasso.co/affiliate/cuddle-clones-preferred/
- Crown & Paw on Awin: https://ui.awin.com/merchant-profile-terms/57823 (via `growth.md`)

**Organic social** (profile data fetched Oct 14, 2026)
- TikTok: https://www.tiktok.com/@crownandpawofficial · https://www.tiktok.com/@thewestwillow · https://www.tiktok.com/@cuddleclones · https://www.tiktok.com/@pawandglory · https://www.tiktok.com/@purrandmutt · https://www.tiktok.com/@perkieprints · https://www.tiktok.com/@petcanvas.art
- Instagram: https://www.instagram.com/thewestwillow/ · https://www.instagram.com/cuddleclones/ · https://www.instagram.com/perkieprints/ · https://www.instagram.com/pawandglory/ · https://www.instagram.com/purrandmutt/ · https://www.instagram.com/crownandcanvas.us/ · https://www.instagram.com/create.petcanvas/
- Crown & Paw Instagram (third-party, undated): https://socialveins.com/influencer/instagram/crownandpaw
- Pinterest: https://www.pinterest.com/crownandpaw/ · https://www.pinterest.com/westandwillow/ · https://www.pinterest.com/cuddleclones/ · https://www.pinterest.com/purrandmutt/ · https://www.pinterest.com/perkieprints/ · https://www.pinterest.com/petcanvasart/
- TikTok topic pages (existence only): https://www.tiktok.com/discover/chatgpt-dog-portraits · https://www.tiktok.com/discover/dog-ai-portraits · https://www.tiktok.com/discover/pet-portrait · https://www.tiktok.com/discover/dog-and-owner-trend-of-hair-drawing

**Traffic**
- Similarweb, West & Willow (competitor affinity, keyword split): https://www.similarweb.com/website/westandwillow.com/

**Marketplaces and apps**
- FindNiche listing pages:
  - https://findniche.com/etsy-product/mini-custom-watercolor-pet-portrait-dog--1106950363
  - https://findniche.com/etsy-product/custom-pet-portrait-royal-dog-and-regal--1027798180
  - https://findniche.com/etsy-product/custom-watercolor-paint-portraits-using--1582219017
  - https://findniche.com/etsy-product/custom-pet-portrait-watercolor-using-pet-1811762605
- Etsyhunt paintings ranking (Oct 1, 2026): https://etsyhunt.com/best-etsy-paintings
- Listifyai keyword snapshot (as reported Aug 16, 2026; page since changed): https://www.listifyai.net/keyword/custom-pet-portrait
- RankHero: https://www.rankhero.com/keywords/custom-pet-portrait
- Etsy shop example: https://etsy.com/shop/robertphelpsart
- Alura interview, UniquePetPrints: https://www.alura.io/interview/uniquepetprints
- ShopiFreaks on Etsy AI listings (Jul 22, 2026, summarizing WIRED): https://www.shopifreaks.com/?p=20989
- App Store lookups: https://apps.apple.com/us/app/-/id6752898507 · https://apps.apple.com/us/app/-/id6758592916
- TrustMRR, Pet Characters ($2 lifetime revenue): https://trustmrr.com/startup/pet-characters

**Internal**
- `docs/research/competitors.md`, `cp-site.md`, `growth.md`, `influencers.md`, `docs/seo-keywords.md`
- `web/src/lib/catalog.ts` (prices used in §7.2)
