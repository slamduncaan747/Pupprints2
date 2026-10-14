# Pup Prints: Channel Economics for a $100, Solo, No-Network Launch

Prepared Oct 14, 2026 (day 0). Day 90 is **Tue Jan 12, 2027**.

**Constraints:** solo founder; no warm or personal-network outreach; $100 total starting paid budget; goal is first customers fast, then **$1,000/month profit** within about 90 days.

**Channels covered:** Hormozi's Core Four minus warm outreach (cold outreach, free content, paid ads), plus marketplaces, communities and SEO.

**Builds on:**
- `docs/research/growth.md`, which assumes an $11.5K budget. This document is the $100 version.
- `docs/research/competitors.md`
- `docs/research/fulfillment.md` (margins)
- `docs/research/ai-tech.md` (AI cost per preview)
- `docs/research/influencers.md`
- `docs/seo-keywords.md`

## How to read the numbers

| Tag | Meaning |
|---|---|
| **[S]** | Sourced figure from a named dataset or official page (link given). |
| **[S\*]** | Sourced, but from a vendor or agency blog, a secondary summary, or an unclear method. Use it as directional only. |
| **[I]** | Internal: our own repo, catalog, margin model or database. |
| **[A]** | Anecdote: one self-reported case. Shows what is possible, not what is typical. |
| **[E]** | **My estimate or assumption.** Every funnel projection below is [E] unless tagged otherwise. |

My web-search budget ran out before I could confirm a few tool prices (Vercel Pro, Klaviyo free tier, Google Workspace). They are marked [E] and should be checked before you rely on them. Reddit and Etsy's own policy pages blocked automated reading, so those rules come from secondary summaries ([S\*]).

---

## 0. Summary

1. **The binding constraint is not ad money. It is trust and distribution for an unknown brand in peak season.** $100 of Meta ads buys about 4,000 Q4 impressions and roughly one order [E]. That is a signal test, not a channel.
2. **For the first customers (week 1–2), Etsy is the best bet.** Etsy has about 8–15K monthly searches for "custom pet portrait" and 12–22K for "dog portrait" in Nov–Dec [S\*]. Since May 2026 it also has native buyer **photo upload** in personalization fields [S\*]. Next come cold creator outreach that opens with a free portrait of *their* dog, and a daily "send me your dog" short-video series. All three cost $0–70.
3. **The free preview is the hook in every channel**, and it costs about **$0.24 per preview session** [I]. Every channel's call to action should be "see your dog as a painting, free, in about a minute".
4. **$1,000/month profit means about $1,075/month of contribution after acquisition costs**, once fixed costs of about $75/month [E] are covered. That is **about 22 orders/month if they all came free** (about $50 contribution each [I]). It is **about 40 orders/month with a realistic channel mix**, because paid and Etsy orders keep only $8–25 each.
5. **Base case [E]: about 40 orders and about $940/month profit in the Dec 13–Jan 12 window.** Etsy is about 10 of those orders, organic video 6, creators 6, paid boosts funded from revenue 8, Google 4, and the rest local, referral and SEO. December should exceed $1K. Mid-January probably falls to roughly 55–65% of December, because demand drops about 60% (Etsy "custom pet portrait": 14.8K searches in Dec vs 5.4K in Jan [S\*]). **Sustained $1K/month by day 90 is roughly a coin flip [E].** It needs one breakout: a viral post, a creator hit, or Etsy ranking.
6. **Paid ads are a later amplifier, not the engine.** Break-even CAC is about $50 [I]. Q4 Meta costs are about $46–49 median cost per purchase across all advertisers [S\*], and higher for a brand-new account with no reviews [E]. Scale paid only after (a) organic or creator content shows a proven creative and (b) the first 10–20 real reviews exist. Reinvest revenue; never add new cash.
7. **Two channels to skip for now:**
   - **TikTok Shop:** its US made-to-order policy covers "not buyer-customized products", and personalization there is text-only [S].
   - **Amazon:** Handmade is for products made by hand [S\*], and Amazon Custom needs a $39.99/month plan plus a 15% referral fee [S\*].
   
   Facebook and Instagram Shops lost on-platform checkout in Aug 2025 [S\*]. Reddit's big dog subreddits ban picture posts and ads [S\*].
8. **SEO will not pay within 90 days.** Ahrefs' 2025 update found only about 1.74% of new pages reach Google's top 10 within a year [S\*]. Breed and sympathy long-tail pages can bring a trickle by January [E]. The real payoff is Valentine's, Mother's Day and Q4 2027.
9. **Fix these before any channel can work properly:**
   - **There is no custom domain.** The site runs on `pup-prints.vercel.app`.
   - The default support email in `web/src/lib/config.ts` is `hello@pupprints.shop`, but **`pupprints.shop` returned NXDOMAIN on Oct 14** (it is not registered, or not delegated). So the default support and partner address cannot receive mail.
   - `pupprints.com` is parked with a domain marketplace (Atom nameservers).
   
   A real domain is needed for Merchant Center, SEO equity, cold-email deliverability and trust. (DNS check from this session, [I].)
10. **The database shows no real traffic yet:** 17 uploads, 6 generations, 1 lead, and 23 orders that are mostly `pending` test orders [I]. So every conversion rate below is a benchmark or an estimate. Replace them with real data after about 200 preview sessions.

---

## 1. Unit economics every channel is measured against

### 1.1 Contribution per order, before acquisition cost

| Order type | Price paid | Costs | Contribution | Basis |
|---|---|---|---|---|
| **Site, hero 16×20 canvas** | $99 | Printful $28.56 + shipping $10.39 + Stripe $3.17 + AI $1.50 = $43.62; 3% remake reserve $2.97 | **≈ $52** | [I] `fulfillment.md` |
| Site, with true free-preview cost | $99 | Each free preview session costs about $0.24 [I `ai-tech.md`]. At 5–10% upload→order, the AI cost per order is $2.40–4.80, against the $1.50 assumed | **≈ $49–51** → we use **$50** | [I]+[E] |
| Site, blended AOV about $100 | ~$100 | about 50% contribution after reserve | **≈ $50** | [I] `growth.md` §5.2 |
| Site, digital only | $29 | Stripe + AI ≈ $2.64 | **≈ $25** | [I] |
| **Creator-code order** (15% off + 10% commission) | $84.15 | COGS ≈ $43.19 + commission $8.42 + reserve $2.52 | **≈ $30** | [I] calculation (`fulfillment.md` shows 39% GM) |
| **Etsy, $99 canvas** | $99 | Etsy: 6.5% transaction ($6.44) + 3% + $0.25 processing ($3.22) + $0.20 listing. COGS without Stripe ≈ $40.45. Reserve $2.97 | **≈ $46** | [S\*] fees ([Craftybase](https://app.craftybase.com/blog/the-complete-guide-to-etsy-fees)) + [I] COGS |
| Etsy, $99 canvas, Offsite-Ads-attributed | $99 | Add 15% Offsite Ads ($14.85, capped at $100/order) | **≈ $31** | [S] [Etsy Offsite Ads help](https://help.etsy.com/hc/articles/360000338367) |
| Referral (give $15 / get $15) | $84–99 | Credit cost about $15 | **≈ $35** | [I] `growth.md` §7 + [E] |

- **Break-even CAC on the site is about $50.** Break-even ROAS is about 2.0 [I].
- **Fixed monthly costs: about $30–110/month [E, unverified prices].**
  - Vercel Pro about $20. From memory, the Hobby plan is for non-commercial use, so verify the plan.
  - Supabase: $0, or $25 once the project outgrows the free tier.
  - Domain about $1–3/month amortized.
  - Sending mailbox (Google Workspace) about $7–8.
  - Klaviyo free tier while the list is small.
  - Optional Instantly Growth at $47/month ([S\*] [CASRAI](https://www.casrai.org/guides/instantly-ai-pricing)).
  
  The model below uses **$75/month**.

### 1.2 The funnel we model (site traffic)

| Step | Range used | Basis |
|---|---|---|
| Landing → starts upload | 25–35% (paid), 35–50% (organic visitors who clicked a "paint my dog" CTA) | [I] `growth.md` targets; organic uplift [E] |
| Upload → order within 7 days, including email flows | 5–10% in weeks 2–8 | [I]+[E] (`growth.md` plans on about 10%; `fulfillment.md`'s 20% is optimistic) |
| **Visitor → order** | **1.25–3.5%** | [E] from the two rows above |
| Benchmarks | Meta-driven site CVR median 1.57% (2025); DTC click-to-purchase median 1.24% (15-brand panel, Jul 2025–Jun 2026); gifts category 3.1–3.4%; Crown & Paw 2.5–3.0% | [S\*] [Triple Whale via growth.md](https://www.triplewhale.com/blog/facebook-ads-benchmarks); [S] [TopGrowth panel](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/); [S\*] Polar and Grips (in `growth.md`) |

**Orders needed for $1K/month profit:** $1,075 ÷ net per order. At $50 net (organic) that is 22 orders. At $22 net (Etsy with ads) it is 49. At $8 net (paid at $42 CAC) it is 134. **The mix matters more than the volume.** [E]

### 1.3 Seasonality and the day-90 problem

- **Day 90 lands in mid-January, the post-holiday trough.**
- RankHero Etsy-oriented volumes for "custom pet portrait": Oct 6.6K → Nov 12.1K → **Dec 14.8K → Jan 5.4K** [S\*] ([RankHero](https://www.rankhero.com/keywords/custom-pet-portrait)).
- "dog portrait": Nov 18.1K → Dec 22.2K → Jan 12.1K [S\*] ([RankHero](https://www.rankhero.com/keywords/dog-portrait)).
- Memorial demand is the steady floor: "pet memorial gift" runs 9.9–18.1K every month [S\*] ([RankHero](https://www.rankhero.com/keywords/pet-memorial-gift)).
- **Practical rule [E]:** judge "$1K/month by day 90" on the trailing 30 days (Dec 13–Jan 12). Plan for **December to over-deliver** and **January to run on memorial, "treat yourself" and gift-card redemption**.

---

## 2. Channel by channel

Each channel has the same block: cost · time to first sale · funnel · CAC · scalability · effort · verdict.

### 2.1 Paid: Meta (Facebook + Instagram)

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| CPM, median, all industries, global | Oct 2025 **$21.69**, Nov **$25.22** (peak), Dec **$22.04**, Jan 2026 $15.74 | [S\*] [SuperAds via AdMake](https://admakeai.com/blog/cost-per-impression-cpm-explained) |
| CPM, US only | Nov 2025 **$28.09**; Jan 2025 $20.41 | [S\*] same |
| CPM, US sales objective | $20–30 (2025 range) | [S\*] [Affect Group](https://affectgroup.com/blog/meta-ads-cpm-in-the-us-2025-benchmarks-for-facebook-and-instagram/) |
| CPM, DTC panel (Jul 2025–Jun 2026, 15 brands, $2.46M spend) | median $13.52 (P25 $11.04, P75 $22.90) | [S] [TopGrowth](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/) |
| CPC (all clicks) | Nov 2025 $1.29 median (series high), about $1.05 average of monthly medians | [S\*] [SuperAds CPC](https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click) |
| CPC, DTC panel | median $0.57 | [S] TopGrowth |
| CTR (all) | about 2.0–2.7%: SuperAds 2.04% average; Triple Whale 2.39%; TopGrowth median 2.68% | [S\*]/[S] [SuperAds CTR](https://www.superads.ai/facebook-ads-costs/ctr-click-through-rate), TopGrowth |
| Click → purchase | median 1.24% (P25 0.65%, P75 3.24%) | [S] TopGrowth |
| Cost per purchase | SuperAds median about $47.6 (Nov 2025 $46.39); Triple Whale $38.99; TopGrowth median $49.04 | [S\*]/[S] [SuperAds CPP](https://www.superads.ai/facebook-ads-costs/cost-per-purchase), TopGrowth |
| Learning phase | about 50 optimization events per ad set per 7 days. Claims of 10 or 25 events are unconfirmed | [S\*] [PPC Land](https://ppc.land/learning-phase/), [Jon Loomer](https://jonloomer.com/?p=45223), [1clickreport](https://www.1clickreport.com/blog/advantage-plus-shopping-25-conversions-2026-guide) |
| Advantage+ Sales | No official minimum. Agencies suggest $100–150/day to give the algorithm enough data | [S\*] [ATTN](https://www.attnagency.com/blog/meta-advantage-plus-shopping) |
| Partnership ads (creator handle as the ad identity) | Meta reports about 19% lower CPA and 13% higher CTR than standard ads (Meta's own data) | [S\*] [eMarketer](https://www.emarketer.com/content/meta-expands-partnership-ads-turn-creator-content-performance) |

**What $100 buys in Q4 [E]**

| Step | Figure |
|---|---|
| Spend at $25 CPM | about 4,000 impressions |
| All clicks at 2.0–2.7% | 80–108 |
| Landing sessions (about 50–60% of clicks are link clicks [E]) | about 40–65 |
| Uploads at 30% | 12–20 |
| Orders at 5–10% | **about 0.6–2 (call it 1)** |

That makes CAC $50–170. A purchase-optimized ad set can never leave learning at this spend.

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | Any amount. The practical floor for a useful read is about $10/day for 7–10 days [E] |
| Time to first sale | 2–10 days after launch, if it converts at all [E] |
| CAC | New account, no reviews, Q4: **$60–120** [E]. With proven creative, 50+ purchases of pixel data and email recovery: $35–60 [E] |
| Scalability | Highest of any channel, once CAC is at or below $45 |
| Effort | 3–5 h/week for creative and monitoring [E] |
| **Verdict** | **Do not lead with Meta.** Week 2–4: spend $20–30 boosting the best organic Reel (engagement or landing-page-view objective) as a creative test. Scale only on revenue, and only when 7-day CAC is at or below $45. Use Partnership ads as soon as a creator grants rights. |

### 2.2 Paid: TikTok (including Spark Ads)

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| CPM | Triple Whale median **$4.08** (Aug 2025–Jul 2026, 5,900+ brands); the earlier 2025 DTC figure was **$13.26**; Lebesgue ecommerce about $4.80 | [S\*] [Enrich Labs](https://www.enrichlabs.ai/blog/tiktok-ads-complete-guide-2026), [Hawky](https://hawky.ai/blog/tiktok-ads-benchmarks), [Lebesgue](https://lebesgue.io/tiktok-ads/tiktok-ads-benchmarks-for-ctr-cr-and-cpm) |
| CPC | about $0.50 (Lebesgue median) to $1.02 (in-feed cross-industry average); retail $0.79 | [S\*] [TikAdSuite](https://tikadsuite.com/blog/tiktok-ad-benchmarks/) |
| CTR | 0.61% (Triple Whale, Lebesgue) to 1.18% (ecommerce, AdLiftr) | [S\*] |
| CVR / CPA | CVR 1.6–2.45%; median CPA $17.07 (Triple Whale) to $32.74 | [S\*] |
| Minimum budget | **Ad group daily budget above $20; campaign daily budget above $50** if set at campaign level | [S] [TikTok Ads help](https://ads.tiktok.com/help/article/budget) |
| Spark Ads | TikTok's internal 2020–21 data: +142% engagement, +43% CVR vs non-Spark. No newer official comparison | [S\*] [AdMake on Spark](https://admakeai.com/blog/tiktok-spark-ads) |
| New-advertiser match credit | Tiered match ($200 → $6,000) for spend within 30 days of account creation. It only applies when the promo shows at sign-up, and it is not guaranteed | [S\*] [Adcore](https://www.adcore.com/blog/free-tiktok-ad-credits/) |

**What $100 buys [E]**

| Step | Figure |
|---|---|
| Budget | 5 days at $20/day on one ad group |
| Impressions at $5–13 CPM | about 7.7–20K |
| Clicks at 0.6–1.2% | 46–240 |
| Uploads (20–30%; TikTok visitors are browsier) | 9–70 |
| Orders at 3–7% | **about 0.3–5 (call it 1–2)** |

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | $20/day minimum per ad group |
| Time to first sale | 3–10 days [E] |
| CAC | **$40–90** for a $99 considered gift [E]. TikTok's cheap CPMs are offset by lower purchase intent |
| Scalability | High if a creative hits |
| Effort | Shares creative with organic. 1–2 h/week extra [E] |
| **Verdict** | **Only as Spark Ads on organic or creator posts that already beat the account median.** Week 3+, funded from revenue. If you start an ad account, sign up through a page that shows the new-advertiser match, but only once you will genuinely spend the tier amount. |

### 2.3 Paid: Pinterest

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| CPC | Home decor $0.50–0.80 (AdBacklog), $0.10–0.50 (another 2026 guide); ecommerce median $1.50 (IQR $0.70–2.90); US $0.83 vs Meta $1.72 (roundup) | [S\*] [AdBacklog](https://adbacklog.com/blog/pinterest-ads-benchmarks-per-industry-2025), [Stackmatix](https://www.stackmatix.com/blog/pinterest-ads-cost), [Digital Applied](https://www.digitalapplied.com/blog/pinterest-statistics-2026-marketing-data-points) |
| CPM | $2–5; median $5.10; US $9.20 (roundup) | [S\*] same |
| ROAS | median 2.30x | [S\*] [WAJ Digital](https://wajdigital.com/pinterest-ads-benchmarks/) |
| New-advertiser credit | The $60-for-$15 offer **ended Jan 6, 2025**. No confirmed 2026 offer | [S] [Pinterest community](https://community.pinterest.biz/t/oh-hey-heres-how-to-get-60-in-ads-credit-on-us/22706) |

**What $100 buys [E]:** 65–125 clicks → 15–35 uploads → 1–2 orders. Pinterest users plan ahead, so attribution lags.

| Dimension | Assessment |
|---|---|
| CAC | $50–120 within 90 days [E] |
| Time to first sale | 1–3 weeks [E] |
| Scalability | Medium |
| Effort | Low once the catalog syncs |
| **Verdict** | **Skip paid Pinterest until Q1.** Revisit for Valentine's and Mother's Day with catalog ads, once organic pins show which breed × style combinations get saves. |

### 2.4 Paid: Google (Search, Shopping, Performance Max)

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| Keyword CPC estimates | "custom pet portrait" **$1.74**; "dog portrait" **$1.88**; "royal pet portrait" $1.41; "dog memorial gift" $1.25; "custom pet canvas" $1.87; "pet memorial gift" $1.38 | [S\*] RankHero ([custom pet portrait](https://www.rankhero.com/keywords/custom-pet-portrait), [dog portrait](https://www.rankhero.com/keywords/dog-portrait), [royal](https://www.rankhero.com/keywords/royal-pet-portrait), [dog memorial gift](https://www.rankhero.com/keywords/dog-memorial-gift), [custom pet canvas](https://www.rankhero.com/keywords/custom-pet-canvas), [pet memorial gift](https://www.rankhero.com/keywords/pet-memorial-gift)). Etsy-oriented tool: validate in Keyword Planner |
| Search ads, "Shopping, Collectibles & Gifts" | CPC **$3.49**, CVR **3.83%** (WordStream 2025 report, Apr 2024–Mar 2025; CVR counts all conversion types) | [S\*] [Segwise summary](https://segwise.ai/blog/google-ads-benchmarks-industry-insights) |
| Shopping ads, Home & Garden | CPC $0.68, CVR 2.1%. These may trace back to 2018–19 WordStream data | [S\*] [OwlClaw](https://owlclaw.com/benchmarks/google-shopping-benchmarks/), caveat from [The Ad Spend](https://theadspend.com/benchmarks/google-shopping-overall) |
| Performance Max | No official minimum. Agencies suggest $30–100/day, 15–50+ conversions/month, and at least 6 weeks of learning. **Use Standard Shopping or Search first** on a new store | [S\*] [Google PMax tips](https://support.google.com/google-ads/answer/13775728), [DataFeedWatch](https://www.datafeedwatch.com/blog/performance-max-campaign-structure) |
| New-advertiser credit | Typically "spend X within 60 days, get X". US "$500 for $500" per a third party. Up to 35-day verification | [S] [Google Ads promotions](https://support.google.com/google-ads/answer/2393021), [S\*] [Spilno](https://spilnoagency.com.ua/en/instructions-us/google-ads-coupon) |

**What $100 buys [E]:**

| Campaign type | Clicks | Visitor → order (high intent) | Orders |
|---|---|---|---|
| Standard Shopping at $0.70–1.50 CPC | 65–140 | 2–3.5% | **1.3–5** |
| Search at about $2 CPC | about 50 | 2–3.5% | about 1–2 |

**Assessment**

| Dimension | Assessment |
|---|---|
| CAC | Shopping **$35–60**, Search $55–90 [E]. This is the highest-intent paid channel |
| Time to first sale | 1–2 weeks. Merchant Center review and conversion tracking take a few days [E] |
| Scalability | Medium. It is bounded by search demand, which peaks Nov 30–Dec 13 (`competitors.md`) |
| Effort | 2–3 h setup, then about 1 h/week [E] |
| **Verdict** | **Turn on free listings in week 1** (§2.14). Run **Standard Shopping at $5–10/day** from the first revenue, during Nov 15–Dec 13 only. The $500 new-advertiser credit only makes sense if revenue can fund the $500 spend. Do not use PMax inside 90 days. Precondition: a custom domain (Merchant Center must verify and claim the site). |

### 2.5 Paid: Reddit and Nextdoor (brief)

**Reddit Ads**
- CPM $2–8, CPC $0.20–2.00 (wide disagreement), CTR 0.4–0.8% [S\*] ([WebTonic](https://www.webtonic.io/blog/e-commerce-reddit-ads-statistics), [Affect Group](https://affectgroup.com/blog/reddit-ads-average-cpc-2025/)).
- Reddit audiences skew toward hostility to AI art [E].
- **Verdict: skip.**

**Nextdoor**
- Free Business Page. Free business posts: two a month, per 2020 rollout coverage, so they may have changed [S\*] ([Search Engine Land](https://searchengineland.com/nextdoor-rolls-out-free-business-posts-best-practices-advice-336135)).
- Local Deals start "as low as $1" ([Nextdoor](https://business.nextdoor.com/en-us/small-business/resources/blog/the-most-commonly-asked-questions-from-local-businesses-about-nextdoor)); about $75 average per [Tech.co](https://tech.co/digital-marketing/advertising-nextdoor-business) [S\*].
- **Verdict: use the free posts (see §2.16). No paid Nextdoor.**

---

### 2.6 Free content: TikTok, Instagram Reels and YouTube Shorts

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| TikTok views per post, median | **about 500**, roughly flat across posting frequency | [S] [Buffer, 11.4M posts / 150K accounts](https://buffer.com/resources/how-often-should-you-post-on-tiktok/) |
| Frequency effect | Compared with 1 post a week: 2–5/week gives up to +17% views per post, 6–10/week +29%, 11+/week +34%. At 11+/week, top-10% posts reach **31.4×** the median (vs 7.6× at 1/week). "Posting more helps, mostly because it increases your chances of getting lucky" | [S] Buffer |
| Mean views, accounts under 2K followers (90 days, about 6M videos) | TikTok **2,429**, Instagram **1,484**, YouTube Shorts **1,290** (means, skewed by viral posts) | [S\*] [Metricool via NetInfluencer](https://www.netinfluencer.com/tiktok-beats-instagram-and-youtube-on-views-but-instagram-wins-on-engagement-study-finds/) |
| TikTok average views by size | under 5K followers about 740; 5–10K about 1,620 (undated) | [S\*] [Socialinsider](https://socialinsider.io/blog/views-vs-engagement) |
| Instagram Reels, small accounts | under 5K followers: **about 300 views per Reel**, 20% view rate (2023–24 data). Reach rate for 1–5K accounts 9.78% (H1 2026) | [S] [Socialinsider IG 2025](https://www.socialinsider.io/data-geeks/instagram_benchmarks_2025.pdf), [Socialinsider Reels](https://socialinsider.io/blog/instagram-reels-statistics/) |
| View → profile visit → link click | about 2–5% of viewers visit the profile; 1–3% of those click the link. That is **20–150 link clicks per 100K views** | [S\*] [TTCalculator](https://ttcalculator.net/learn/tiktok-conversion-rate-optimization/), vendor-sourced |
| TikTok bio link | Needs **1,000 followers or a Registered Business Account** | [S\*] [Shopify](https://www.shopify.com/blog/how-to-add-link-to-tiktok-bio) |
| YouTube Shorts | Brand Shorts views −20% in 6 months (Dash Social 2025). Links in Shorts descriptions are not clickable (YouTube change in 2023; from memory, verify) | [S\*] [Dash Social](https://www.dashsocial.com/social-media-benchmarks/youtube); [E] |

**Pet-portrait organic examples (anecdotes)**
- **digidoggo (Etsy):** posts daily on TikTok. One video reached **1.8M views and 43K likes**, and the shop was "inundated with orders". It still "took nearly 3 years to go full-time." [A] ([Alura interview](https://www.alura.io/interview/digidoggo))
- **Drew Stirling (UK artist):** one border collie painting went viral, leading to 320K+ followers and quitting her job [A] ([Gazette Live](https://www.gazettelive.co.uk/news/teesside-news/pet-portrait-artist-goes-viral-24582417)).
- **Counter-risk:** a TikTok seller faced backlash for selling AI pet memorial portraits as "fine art" [A] ([Yahoo](https://www.yahoo.com/lifestyle/articles/tiktok-artist-sparks-backlash-selling-085800018.html)). This is why the disclosure rule in `CLAUDE.md` matters.
- I found **no documented, named case of a pet brand going from $0 to a verified revenue figure on organic TikTok alone.** Published "zero to $85K/month" pet stories are unnamed agency write-ups that relied on seeded creators and Spark Ads [S\*] ([Bemomentiq](https://bemomentiq.com/blog/how-pet-brands-crushing-it-tiktok-shop-4-influencer-campaign)).

**Our content engine [E]**
- **"Send me your dog":** followers comment or DM a photo with consent, we post the reveal, and the owner reshares.
- **Breed series:** one dog shown in six styles.
- **Before → after on a wall.**
- **Memorial:** gentle, never with urgency.

Each video costs about $0.24 in AI [I]. We repurpose every TikTok to Reels and Shorts.

**Funnel at 2 posts a day × 3 platforms (about 180 posts a month) [E]**

| Step | Median-based | Mean-based |
|---|---|---|
| Views per month | about 80K | about 310K |
| Site visits at 20–150 link clicks per 100K views | 16 | 470 |
| Orders at 2–3.5% visitor → order (warm, preview-intent traffic) | 0.3 | 16 |
| **Base case by month 2–3** | **4–8 orders/month** | |

Instagram allows a bio link and story link stickers from day 1. That helps until TikTok unlocks its bio link.

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | $0 cash. **1–2 h/day** of the founder's time [E] |
| Time to first sale | 1–4 weeks typical. Same day if a post breaks out [E] |
| CAC | About $0 cash, plus about $3–5 of AI preview cost per order [E] |
| Scalability | Very high variance and compounding. It also produces the only creatives worth paying to boost |
| **Verdict** | **Core channel.** Start day 1, about 2 posts a day. Judge it on weeks 3–6, not week 1. |

### 2.7 Free content: Pinterest organic

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| Outbound click rate | About 0.2–1.5% depending on niche. Static pins **4.8 outbound clicks per 1,000 impressions (0.48%)** vs video 1.6 (0.16%), across 148K pins | [S\*] [GenSumo](https://gensumo.com/research/pinterest-marketing-benchmarks-report/), [PostEverywhere](https://posteverywhere.ai/blog/pinterest-metrics-kpis) |
| Ramp time | 2–3 week "sandbox"; 1–3 months to meaningful traffic; **3–6 months to first direct orders** | [S\*]/[A] [Pinterest community](https://community.pinterest.biz/t/new-pinterest-account-how-long-does-it-take-to-get-noticed/25413) |
| Search volume for pet portraits on Pinterest | No public figure found | — |

**Funnel by day 90 [E]:** 5–10 static pins a day, auto-made from the breed × style images we already have → 20–100K impressions/month by month 3 → 100–480 clicks → **0–4 orders/month**. Memorial and "gift for dog mom" pins are evergreen.

| Dimension | Assessment |
|---|---|
| Cost | $0, plus 2–3 h/week, or a scheduler [E] |
| Time to first sale | 4–12 weeks [E] |
| **Verdict** | **Start now at low effort** (batch-pin weekly). It is a Q1–Q2 2027 asset, not a Q4 rescue. |

---

### 2.8 Cold outreach: creators (gifted or affiliate)

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| Cold reply rate to influencers | Most brands get **5–15%**; with personalization and warm-up, 20–40% | [S\*] [Favikon](https://www.favikon.com/blog/how-to-do-influencer-outreach-templates-and-tips-that-actually-get-replies) |
| Cold Instagram DMs to creators | **30–50%** response, from one practitioner | [A] [Substack comment](https://brandperson.substack.com/p/the-role-of-creative-strategy-in/comments) |
| Comment first, then DM | 50–80% claimed | [A] Favikon (agency claim) |
| Post rate after gifting | Nano **40–75%**; mid-tier 5–10% gift-only, or 20–45% depending on the source | [S\*] vendor guides ([elev8or](https://www.elev8or.io/blog/influencer-gifting-and-product-seeding-guide), [InfluencerFee](https://influencerfee.com/blog/influencer-gifting-program-guide/)) |
| Gifting survey (74 marketers, May 2026) | **90.5%** say creators ghost gifting more than other collaboration types. Post consistency is 50% under barter vs 43.8% with no strings. Creator response is the #2 barrier (43.2%). Nearly 80% say gifting is ROI-positive | [S] [Modash](https://www.modash.io/blog/influencer-gifting-survey) |
| Safe Instagram DM volume | New accounts about **20–50/day**, 5–15/hour. Spikes and identical messages trigger blocks | [S\*] [Inro](https://inro.social/blog/how-many-direct-messages-can-you-send-on-instagram) |
| Paid rates, if needed | Pet nano accounts $50–250/post; micro $400–1,200 per Reel | [I] `growth.md` (LaunchPoint) |

**Our structural edge [E]:** the first message can include a *finished preview of their dog*. That makes the outreach a gift, not an ask. **Ask before using their photo.** For example: "We'd love to paint Biscuit, okay to use the photo from your Sept 3 post?" Only send the result when they say yes. Generating from someone's photo without permission is a privacy and copyright gray area, and it looks spammy at scale.

**Offer ladder [E]**
1. Free hi-res digital portrait plus a 15% follower code. Costs us about $0.25.
2. Free 16×20 canvas, about $44 COGS, for creators who have posted, or who have more than 10K engaged followers.
3. 10–20% affiliate commission on net (`influencers.md` recommends 20%).

Every post carries **#ad / Paid partnership** in the content itself (FTC; `CLAUDE.md`).

**Funnel per 100 creators contacted over about 2 weeks (10/day) [E]**

| Step | Figure |
|---|---|
| Replies | 15–30 |
| Accept (digital-first) | 12–25 |
| Post | 8–15 |
| Views (each 1–5K) | 8–75K total |
| Orders, through codes plus spillover | **4–15 orders in weeks 3–8**, plus UGC with ad rights for Partnership/Spark ads |

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | Digital-first: about $0–25 per 100 creators. With 5 physical seeds: about $220 (fund from revenue, not the $100) [E] |
| Time to first sale | 1–3 weeks (posting lag) [E] |
| CAC | Digital-first **$5–25**; all-physical $60–120 [E] |
| Scalability | Linear with founder hours. Better with an affiliate program and tools (Rewardful $99/month or PromoteKit $29/month, [I] `influencers.md`) |
| Effort | 1–1.5 h/day [E] |
| **Verdict** | **Top-3 channel for both goals.** Start day 1 with nano and micro dog accounts (2K–50K followers). `influencers.md` has 15 micro and 5 nano accounts verified; skip the 31 macro accounts for now. |

### 2.9 Cold outreach: small businesses, shelters, press (cold email and walk-in)

**Benchmarks**

| Metric | Figure | Tag / source |
|---|---|---|
| Cold email reply rate | Instantly 2025 data: average **3.43%**, top quartile at or above 5.5%, top 10% at or above 10.7%. 58% of replies come from the first email | [S\*] [lemlist summary](https://lemlist.com/blog/cold-email-benchmarks/), [Instantly](https://instantly.ai/blog/email-sequence-benchmarks-2026-whats-a-good-open-rate-reply-rate-and-cost-per-meeting/) |
| Hunter (11M emails, 2024 sends) | average **4.1%**; **5.8% for campaigns of 50 or fewer recipients** vs 2.1% for 1,000+; 4.9% with follow-ups vs 3% without | [S] [Hunter](https://hunter.io/the-state-of-cold-email-2025) |
| Belkins (7.5M emails, 2025) | **0.45%** overall; companies with 0–10 employees 0.72% | [S\*] [Something Inc](https://somethinginc.com/blog/cold-email-response-rates-2026-data/) |
| Veterinary campaigns | 0.5–4% reply | [S\*] [LeadHaste](https://leadhaste.com/blog/cold-email-template-for-veterinary) |
| Deliverability rules | SPF, DKIM and DMARC alignment, one-click unsubscribe, and a spam rate under 0.3% (target under 0.1%) for 5K+/day senders to Gmail and Yahoo. Gmail enforcement ramped up from Nov 2025. Microsoft has rejected non-compliant bulk mail since May 5, 2025 | [S\*] [Red Sift](https://redsift.com/blog/gmails-enforcement-ramps-up-what-bulk-senders-need-to-know), [GMass](https://www.gmass.co/blog/gmail-bulk-sender-guidelines/), [dmarcian](https://dmarcian.com/yahoo-and-google-dmarc-required/) |
| Warm-up | 2–3 weeks on an aged domain; 4–8 weeks on a brand-new one. Start at 5–10 cold sends a day; cap mature mailboxes at about 20–50/day. Use a secondary domain | [S\*] [SyncGTM](https://syncgtm.com/blog/how-long-to-warm-up-email), [Smartlead](https://www.smartlead.ai/blog/how-many-cold-emails-per-day), [LeadHaste](https://leadhaste.com/blog/warm-up-email-domains) |
| Tools | Instantly Growth $47/month ($37.60 annual) with unlimited mailboxes and warm-up; Smartlead Base about $32/month (single source) | [S\*] [CASRAI](https://www.casrai.org/guides/instantly-ai-pricing), [CostBench](https://costbench.com/software/sales-engagement/smartlead/) |
| CAN-SPAM (applies to B2B too) | Accurate headers, a non-deceptive subject line, a **valid physical postal address**, a working opt-out honored **within 10 business days**. Up to **$53,088 per violating email** | [S\*] [Prospeo](https://prospeo.io/s/can-spam-penalties-per-email). Primary: [FTC CAN-SPAM guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) |

**Targets [E]**
- Groomers, daycares, trainers, dog walkers: QR cards reading "Free portrait preview of your dog", with 10% commission.
- Shelters: free portraits of adoptable dogs, plus a Giving Tuesday tie-in.
- Pet-loss and crematorium services: memorial referrals.
- Gift-guide editors and dog bloggers. Most holiday guides close by early November [E].

**Funnels [E]**

| Route | Funnel | Result by day 90 |
|---|---|---|
| Cold email | 200 businesses at 20/day from a hand-written, warmed mailbox → 2–6% reply → 4–12 replies → 2–6 partners | **1–5 orders/month** |
| Walk-in to 20 local businesses (2 afternoons) | 20–40% agree to display cards → 4–8 partners | **1–3 orders/month**, slow |
| Press | One gift-guide placement can be worth 5–50 orders. Hit rate on cold pitches is low (1–5%) | Lottery |

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | Cold email: $0 hand-sent from Gmail or Workspace at 20 or fewer a day; or about $50–60/month with a tool plus a mailbox. Walk-in: about $20 for 250 printed cards [E] |
| Time to first sale | **3–6 weeks**. Any new domain needs 2–4 weeks of warm-up before volume [E] |
| CAC | $5–20 cash, but high founder time [E] |
| Scalability | Low to medium |
| **Verdict** | **Secondary.** Hand-send 10–20 high-fit emails a day from week 2 (no bulk tool needed at this volume). Do one walk-in afternoon in week 2. Put the shelter program on the press list. Don't buy Instantly or Smartlead until there is a list of more than 500 and a warmed domain. |

---

### 2.10 Marketplace: Etsy

**Demand and competition** (RankHero, Etsy-oriented, Sep 2025–Aug 2026 [S\*])

| Keyword | Avg monthly searches (peak) | US share | Competing listings | Price median / average |
|---|---|---|---|---|
| custom pet portrait | 8,100 (Dec 14.8K; Jan 5.4K) | 81% | **260,504** | $28 / $45.83 (32% of listings at $10–25) |
| dog portrait | 12,100 (Dec 22.2K) | 55% | 380,812 | $30 / $48.53 (38% at $25–50) |
| pet memorial gift | 12,100 (Dec 18.1K) | 66% | 472,600 | $30.55 / $36.50 |
| dog memorial gift | 3,600 (Dec 5.4K) | 67% | 330,538 | $34.08 / $47.70 |
| royal pet portrait | 720 (Nov–Dec 1,300) | 54% | about 15K | $15.99 / $23.71 |
| custom pet canvas | 170 | 65% | 28,744 | n/a |

Listifyai reports **about 50% of the first page for "custom pet portrait" is paid placement** [S\*] ([Listifyai](https://www.listifyai.net/keyword/custom-pet-portrait)). Sources: [RankHero custom pet portrait](https://www.rankhero.com/keywords/custom-pet-portrait), [dog portrait](https://www.rankhero.com/keywords/dog-portrait), [pet memorial gift](https://www.rankhero.com/keywords/pet-memorial-gift), [dog memorial gift](https://www.rankhero.com/keywords/dog-memorial-gift), [royal pet portrait](https://www.rankhero.com/keywords/royal-pet-portrait), [custom pet canvas](https://www.rankhero.com/keywords/custom-pet-canvas).

**Fees (US)**

| Fee | Amount | Tag / source |
|---|---|---|
| Listing | $0.20 per listing; renews every 4 months or on sale | [S\*] [Craftybase](https://app.craftybase.com/blog/the-complete-guide-to-etsy-fees) |
| Transaction | 6.5% of item + shipping + gift wrap | [S\*] |
| Payment processing | 3% + $0.25 | [S\*] |
| Offsite Ads | 15% if under $10K sales in 12 months (**can opt out**); 12% mandatory at $10K+. **Capped at $100 per order** | [S] [Etsy help](https://help.etsy.com/hc/articles/360000338367) |
| Shop setup | One-time **$15–29** (introduced Sep 2024; verify the US amount at sign-up) | [S\*] Craftybase |
| Etsy Ads | $1/day minimum (secondary). Etsy's handbook suggests **$3–5/day** for a useful test. New sellers' cap starts at $25/day | [S] [Etsy Ads help](https://help.etsy.com/hc/articles/360033701174), [Etsy Seller Handbook](https://www.etsy.com/seller-handbook/article/667698209245) |
| Share & Save | Transaction fee drops to 2.5% on sales that come through our own trackable link | [S\*] Craftybase |

**Rules that matter for us**
- **AI is allowed, with disclosure.**
  - Etsy rewrote its Creativity Standards on Jun 10, 2025. AI-generated designs fit under "**Designed by**" when the seller adds meaningful creative input.
  - **AI use must be disclosed in the listing description.**
  - Prompt-only products are banned.
  
  [S\*] ([RankHero summary](https://www.rankhero.com/blog/etsy-policy-changes-2025-what-you-need-to-know), [Listadum](https://www.listadum.com/blog/etsy-creativity-standards)). Official page: [etsy.com/legal/creativity](https://www.etsy.com/legal/creativity), which blocked automated reading. Our honest line already fits: "Created with our AI artist, finished and checked by our team."
- **Production partners (Printful) must be disclosed**, and the ship-from location must be accurate. Undisclosed partners are reportedly a common reason for deactivation [S\*] ([Beancount](https://beancount.io/blog/2026/07/09/etsy-2026-fee-hike-ai-disclosure-rules-handmade-sellers-guide)).
- **Photos must show the real product.** Production-partner mockups are allowed only narrowly [S\*] (Listadum).
- **Photo upload at checkout now exists.**
  - Etsy's new personalization (reported May 11, 2026) allows up to 5 questions, including a **file upload of up to 10 photos** [S\*] ([Listadum](https://www.listadum.com/blog/etsy-just-made-personalization-way-better-heres-how-to-actually-use-it)).
  - Etsy's help page describes it as a **beta** [S] ([Etsy help](https://help.etsy.com/hc/en-gb/articles/33478801738519-How-to-Offer-Personalised-Listings-as-a-Beta-Participant)).
  - Until it is confirmed on our shop, fall back to the old personalization text box plus "send your photo in Messages after ordering".
- **No fee avoidance.** We can't use Etsy (messages, listings) to steer buyers to buy the same items on pup-prints. A shop About-page link is reported to be fine [S\*] ([Etsy forum](https://community.etsy.com/t5/Etsy-Success/Can-I-have-a-web-site-besides-etsy/td-p/52113144)). So Etsy customers mostly stay Etsy's customers.
- **Our wedge changes on Etsy.** There is no free preview before payment. Instead we offer **"proof within the hour, unlimited revisions before we print, ships in 2–4 days"**. That still beats the 1–3-day proof most sellers offer (`competitors.md`).

**Conversion and outcomes**
- Typical Etsy shop CVR is 1–3%; above 4–5% is top tier [S\*] ([Gelato](https://www.gelato.com/blog/etsy-conversion-rate)).
- **UniquePetPrints:** 14,325 sales, **£9,100/month average**, 5% CVR, 62% margin. **First sale the same night the shop opened.** Uses Etsy Ads plus page-1 rankings [A] ([Alura](https://www.alura.io/interview/uniquepetprints)).
- **digidoggo:** 4.3% CVR, 3,584 sales [A].
- Time to first sale for new shops ranges from the same night to several months [A] ([Etsy forum](https://community.etsy.com/t5/Etsy-Success/How-Long-Did-It-Take-to-Get-Your-First-Sale/td-p/79570841)).
- No reliable Etsy Ads CPC benchmark exists. One unverified guide says $0.20–0.50 [S\*] ([Insight Agent](https://www.insightagent.app/guides/etsy-ads-minimum-daily-budget-2026)).

**Price-position risk [E]:** the category's median listing price is $28–35, often for a digital file. A $99 canvas is 2–3× that. Lead with physical canvas and framed listings where the price comparison is fairer (Etsy averages $45–48 include physical), and use **$29 digital** as the entry listing. Test a **$79 12×16 canvas** as the Etsy hero.

**Funnel by month 2–3 [E]**

| Step | Figure |
|---|---|
| Listings | 20 (top-10 breeds × Royal and memorial styles × canvas, framed and digital) |
| Etsy Ads | $3–5/day ($90–150/month, revenue-funded after the first $45) |
| Ad clicks at $0.30–0.60 CPC | 150–500 |
| Organic listing visits | 100–500 |
| Total listing visits | 250–1,000 |
| Orders at 1–2.5% CVR | **3–20/month**; base **10** |

**Assessment**

| Dimension | Assessment |
|---|---|
| Cost | About $20 setup + $4 listings + $3/day ads [S\*]+[E] |
| Time to first sale | **2–14 days** with ads in November [E] (anecdotes range from the same night to months) |
| CAC | Etsy Ads **$15–60**, base about $30 [E]. Net per order is about $46 − $30 = **$16** on ad orders and $46 on organic orders. A blended **about $22–26** at a 2:1 ad-to-organic mix [E] |
| Scalability | Medium. Capped by Etsy demand and ranking, and shoppers anchor on price |
| Effort | 6–10 h setup; 3–5 h/week (messages, proofs, listing tests) [E] |
| **Verdict** | **#1 for first customers; #1–2 contributor to the $1K goal.** Turn Offsite Ads **off** while we are under the $10K threshold (it costs 15% of an order, about $15, when it fires). Reconsider once margin is proven. |

### 2.11 Marketplace: TikTok Shop

- **Custom orders:** TikTok's US Custom Order Requirements allow made-to-order, pre-order, backorder and custom handling time. Made-to-order products are "**not buyer-customized products** and can be resold if returned". The page has no personalization policy. Custom handling time is capped at **7 business days**, and made-to-order requires seller performance score ≥3.5 and other thresholds [S] ([TikTok Seller Center](https://seller-us.tiktok.com/university/essay?knowledge_id=6719693841286958&default_language=en)).
- **Personalization:** Printify's automated personalization on TikTok Shop US is text-only, and it notes **ship within 3 days, deliver within 6** [S] ([Printify](https://help.printify.com/hc/en-us/articles/28903711308177-How-does-Printify-s-personalization-feature-work)).
- **AI content:** AI-generated content is allowed if it complies with TikTok's guidelines [S] ([TikTok content policy](https://seller-us.tiktok.com/university/essay?knowledge_id=6837891779151617&lang=en)).
- **Fees:** referral about 6%. Some 2026 guides report an increase; unverified [S\*] ([Printful](https://www.printful.com/blog/tiktok-shop-fees), [FastMoss](https://www.fastmoss.com/blog/tiktok-shop-seller-costs-in-the-us-2026-fees-creator-commissions-fulfillment-returns-real-profit/)).
- **Affiliate commissions:** sellers set 1–80%, averaging about 13% [I] `influencers.md`.
- **Verdict: not viable for a photo-personalized product in 90 days.** Use TikTok for organic and Spark Ads that link to the site. Recheck in Q2 2027.

### 2.12 Marketplace: Amazon (Handmade, Custom)

- **Handmade:** items must be "made entirely by hand, hand-altered, or hand-assembled"; mass-produced items are not eligible [S\*] (2015 coverage, [ChannelX](https://channelx.world/2015/11/etsy-v-amazon-7-questions-you-need-to-answer/)). AI-generated print-on-demand art is very unlikely to qualify [E]. I could not retrieve Amazon's current policy text.
- **Amazon Custom:**
  - Supports buyer image upload ("customise your product by uploading their own image").
  - Requires a **Professional account** ($39.99/month [S\*] [Printify](https://help.printify.com/hc/en-us/articles/43556915343633-What-are-the-costs-associated-with-selling-on-Amazon)).
  - No FBA for customized products.
  - Setup is manual, product by product.
  
  [S] ([Amazon Custom, EU page](https://sell.amazon.de/programme/custom)).
- **Referral fee:** about **15%** for home décor and wall art, $0.30 minimum [S\*] ([Printful help](https://help.printful.com/hc/en-us/articles/360014067159-What-are-Amazon-s-referral-fees)).
- **Assessment [E]:** time to first sale is weeks, and a new listing with no reviews converts poorly. Cost is $40/month fixed plus 15%.
- **Verdict: skip for 90 days.**

### 2.13 Google Merchant Center free listings

- **Cost:** $0. The product feed already exists: `web/src/app/feeds/google.xml/route.ts` with 23 items [I].
- **Data (launch era, dated):**
  - Google said free listings drove "more than 50%" more clicks for advertisers.
  - A UK agency saw +10% Shopping clicks.
  - One expert put the Shopping tab at "5, maybe 10%" of traffic and called it "irrelevant for smaller merchants".
  
  [S\*] ([OMR](https://omr.com/en/daily/google-shopping-free), [Summit](https://www.summit.co.uk/opinions-news/drive-up-to-6-more-traffic-with-googles-new-free-shopping-listings/)).
- **Expected [E]:** 50–300 unpaid clicks/month in Nov–Dec → **1–6 orders/month**. It also unlocks Google Customer Reviews (seller ratings later) and Standard Shopping.
- **Precondition:** a verified and claimed website, so get a custom domain. Merchant Center also checks for clear contact details, returns and shipping policies [E].
- **Verdict: week 1, always on.**

### 2.14 Facebook and Instagram Shops, Facebook Marketplace

- **Shops:** Meta phased out on-platform checkout for Facebook and Instagram Shops. Most shops moved to **website checkout by end of Aug 2025**, and Commerce Manager order tools were removed [S\*] ([PPC Land](https://ppc.land/meta-phases-out-facebook-and-instagram-shops-checkout-by-august-2025/), [Value Added Resource](https://www.valueaddedresource.net/meta-phases-out-native-checkout-facebook-instagram-shops/)). A Shop is now a free catalog for **product tags on organic posts and Reels**. That is worth 30 minutes, and it reuses the Google feed [E].
- **Marketplace:** business shipping on Marketplace ran through Shops checkout (about a 10% fee) [S\*] ([Target Internet](https://www.targetinternet.com/what-is-facebook-marketplace/)), so the route is unclear or gone after 2025. **Verdict: skip.**

### 2.15 Communities: Reddit, Facebook groups, Nextdoor

| Community | Rules and evidence | Expected yield [E] | Verdict |
|---|---|---|---|
| **Reddit** | **r/dogs** wiki: "Picture posts are not allowed" and a separate Advertisement/Spam rule (seen via a mirror; reddit.com blocked automated reading) [S\*]. Sitewide: spam ban; the "about 10% of activity may be self-promotion" heuristic; each subreddit sets its own rules; new accounts that promote are filtered fast [S\*] ([Redship](https://redship.io/blog/reddit-self-promotion-rules)). Strong anti-AI-art sentiment [E] | 0 orders; real risk of brand damage | **No promotion.** Listen and answer questions only |
| **Facebook groups** (breed groups, dog moms, local pet groups) | Most ban selling; some run weekly promo threads. No public data | 0–3 orders/month for 20–30 min/day in groups that allow it | **Low priority.** Only where rules explicitly allow it, with full disclosure |
| **Nextdoor** | Free Business Page plus free posts (2/month per older info) [S\*]; neighbors gift locally | 0–2 orders per post | **Yes, 2 posts/month.** Shelter story and "free preview of your dog". Also recruits local partners |

### 2.16 SEO

- **Time to rank:**
  - Ahrefs' 2025 update (secondary sources): **about 1.74% of new pages reach the top 10 within a year**, down from 5.7% in the 2017 study.
  - Of the pages that do rank, about 41% got there within the first month.
  - About 73% of top-10 pages are more than 3 years old.
  
  [S\*] ([Whitehat SEO](https://www.whitehat-seo.co.uk/knowledge/how-long-does-it-take-to-rank-on-google), [Crowdo](https://crowdo.net/blog/how-long-to-rank-in-google-2025/)).
- **Our position [I]:** 84 URLs are built (32 breed pages, 12 styles, 6 gift occasions, 12 articles; `docs/seo-keywords.md`). They sit on a **`vercel.app` subdomain**. Any links and rankings earned there must be 301-migrated later, so **move to the real domain before link building** [E].
- **Winnable in 90 days [E]**, using `seo-keywords.md` volumes [S\*]:
  - Breed long tail: "french bulldog portrait" about 90/month (100% US), similar for "[breed] portrait", "custom [breed] painting".
  - **"what to write in a pet sympathy card"** (5.4K, KD 32, the easiest measured).
  - "royal [breed] portrait".
  - Google Images for breed × style.
  - Bing and AI-answer citations.
  - **Not winnable:** "custom pet portrait" (KD 55), "dog portrait" (KD 56), "pet memorial gift" (KD 58).
- **Expected [E]:** 100–600 organic visits/month by day 90 → **1–5 orders/month**. The payoff is Valentine's (order-by about Feb 1), Mother's Day and Q4 2027.

| Dimension | Assessment |
|---|---|
| Cost | $0 cash, plus domain registration [E] |
| Time to first sale | 4–10 weeks [E] |
| **Verdict** | **Keep it running; don't count on it for the 90-day goal.** Week 1: register the domain, set up Search Console and Bing Webmaster, and submit the sitemap. |

---

## 3. Channels for first customers (week 1–2: Oct 14–28)

The goal is the first 1–10 paying strangers and the first real reviews, spending at most $100.

| Rank | Channel | Cash, weeks 1–2 | Founder hours, weeks 1–2 | Expected orders by day 14 [E] | Why it ranks here |
|---|---|---|---|---|---|
| **1** | **Etsy shop**: 15–20 physical-first listings, AI and Printful disclosed, photo-upload personalization, Etsy Ads $3/day, Offsite Ads off | about $20 setup + $4 listings + $40 ads = **about $64** | 10–12 h | **0–4 (base 1–2)** | The only channel with existing buyer intent (8–15K monthly searches in Q4 [S\*]) and platform trust that doesn't depend on our brand. First sales can land the same night [A] |
| **2** | **Creator outreach that opens with their dog**: 10 personalized DMs or emails a day to 2K–50K dog accounts, digital-first gift plus 15% code | **$0** (digital) | 10–14 h | **0–3 (base 1)** | Highest replies per message thanks to the free personalized gift. Posts also become ad creative and social proof. Lag of 1–3 weeks |
| **3** | **"Send me your dog" short video**: 2/day on TikTok, cross-posted to Reels and Shorts. Instagram bio link and story links from day 1. Apply for a TikTok Registered Business Account to unlock the bio link | $0 (+$0.24 AI per video) | 14–20 h | **0–5 (base 1)** | Zero cash. Builds the creative bank. Fat-tailed upside (a 1.8M-view example [A]) |
| **4** | **Google Merchant free listings**, after registering a custom domain (about $10–15 [E]) | about **$10–15** | 3–4 h | **0–2 (base 0–1)** | Free, high-intent, and needed for Shopping later. Approval takes several days |
| **5** | **Micro paid boost of the best organic post**: Meta/Instagram at about $8/day for 3 days, landing-page-view objective, US dog owners 25–65. Only once a post beats the account median | **about $21** | 1 h | **0–1** | A read on cost per landing view and CTR, nothing more |
| **6** | **Local cold**: one walk-in afternoon (10–15 groomers and daycares, QR cards), one Nextdoor post, and a shelter offer to 3–5 shelters | **$0–20** (cards; outside the $100 if needed) | 5–6 h | **0–1** | Cheap. Builds a partner pipeline and a press story for December |
| — | *Not in weeks 1–2:* cold email at volume (needs domain warm-up), SEO, Pinterest (organic or ads), Google paid, TikTok ads ($20/day minimum), Amazon, TikTok Shop, Reddit | — | — | — | Too slow, too costly per test, or not viable (§2) |

**The $100 [E]:** Etsy about $64 (setup + listings + 14 days of ads) · domain about $10–15 · Meta boost about $21. **Total about $95–100.**

**Week 1–2 math [E]:** expected orders by day 14 are 1–10, with a **median of about 3**. At about $46–50 contribution each, that is about $140–150 of contribution. **Reinvest 100% of it** into whichever channel shows the lowest cost per order. Etsy Ads and creator seeds are the likely winners.

**Rules [E]**
- Never spend the next dollar on paid until 3 orders exist.
- Ask every buyer for an honest review: Etsy reviews, plus Trustpilot/Google invites on site, never incentivized ([I] `growth.md` §3.3).
- Track source on every order. Use the post-purchase "How did you hear about us?" survey, creator codes, and Etsy vs site.

---

## 4. Channels to reach $1,000/month profit by day 90

### 4.1 Target math

**Required net:** $1,000 profit + about $75 fixed costs = **about $1,075/month of contribution after acquisition costs** [E].

Net per order by channel, from §1–2 [E]:

| Channel | Net per order | Derivation |
|---|---|---|
| Owned organic (video, SEO, Pinterest, Nextdoor) | $48 | $50 minus a little AI |
| Local partners | $45 | After 10% commission |
| Referral and repeat | $35 | After the $15 give-get credit |
| Etsy, blended | $22–26 | $46 contribution minus Etsy Ads on about 2/3 of orders |
| Creator-code orders | $20 | $30 minus amortized seeding |
| Google Shopping, blended with free listings | $15 | $50 minus about $35 |
| Paid social at a $42 CAC | $8 | $50 minus $42. It also adds list and creative value |

### 4.2 Ranked table: channel plan for month 3 (Dec 13–Jan 12)

| Rank | Channel | Month-3 orders, low / **base** / high [E] | Net per order [E] | **Base net/month [E]** | Spend/month in month 3 (all revenue-funded) [E] | Why this rank |
|---|---|---|---|---|---|---|
| **1** | **Organic short video → site** (+ email and abandoned-preview flows) | 2 / **6** / 25 | $48 | **$288** | $0 cash; about $10 of AI | Highest net per order. Only channel with a viral upside. Feeds rank 5 |
| **2** | **Etsy** (ads + organic, physical-first) | 5 / **10** / 25 | $22 | **$220** | Etsy Ads about $150 ($5/day) | Reliable Q4 demand, fast. Lower margin, can't remarket |
| **3** | **Creators**: affiliate codes, digital-first seeding, 3–5 physical seeds a month | 2 / **6** / 15 | $20 | **$120** | Physical seeds about $130–220 | Adds reach plus UGC and ad rights. The likeliest "breakout" source |
| **4** | **Local partners + Nextdoor + shelter story** | 0 / **2** / 5 | $45 | **$90** | Cards about $20 | Slow but nearly free. Shelter angle can earn press and links |
| **5** | **Paid social boosts** of proven organic and creator posts: Meta Partnership ads, TikTok Spark. Only while 7-day CAC ≤ $45 | 0 / **8** / 30 | $8 | **$64** | About $340 (8 × $42) | Low net per order, but it scales, builds the list and lifts referrals. Stop if CAC > $50 |
| **6** | **Referral, Gift Reveal recipients, repeat** ("paint a friend's dog", give $15 / get $15) | 1 / **2** / 8 | $35 | **$70** | Credits are inside the net | Grows with the customer count. 2.35% of orders is the industry average [S\*] (`growth.md`) |
| **7** | **Google free listings + Standard Shopping** ($5–10/day, Nov 15–Dec 13 only) | 1 / **4** / 12 | $15 | **$60** | About $100–140 | High intent, but demand falls after the Dec 13 shipping cutoff |
| **8** | **SEO + Pinterest organic** | 0 / **2** / 8 | $50 | **$100** | $0 | Mostly a 2027 asset |
| — | **Total** | **11 / 40 / 128** | | **$1,012** | about $750–1,000 of recycled revenue | |
| — | **Minus fixed costs** | | | **−$75** | | |
| — | **Profit, month 3** | **≈ $220 (low)** / **≈ $940 (base)** / **≈ $3,300 (high)** | | | | |

Notes on the table [E]:
- **Base revenue is about $3.9K/month** at about $97 average AOV across channels.
- **Base profit of about $940 is just under the goal.** Upsells close the gap: ornament/mug bumps, "gift two", and Dec 16–24 Gift Reveal digital orders at about 90% margin. They lift contribution by about 10–15% (= +$100–150 [E]).
- **In December alone the base case runs about 1.3–1.5× this level** (search demand 1.2–2.7× Oct levels [S\*]). **In mid-January it runs about 0.6×.**
- **Sensitivity [E]:**
  - If organic video stays at the *median* (about 2 orders/month) **and** Etsy converts at 1% (about 5 orders), month 3 lands near $600–650 profit. If creators also fall to the low case (2 orders), it lands near $550. Paid boosts would then also stop, because there are no proven creatives, which takes it to about $490.
  - **One** creator post or video above 300K views adds roughly 10–40 orders in that month (+$300–1,500).
  - The $1K goal therefore depends on running 3–4 channels at once so that at least one breaks out.

### 4.3 What has to be true by day 30 and day 60 (kill/keep gates) [E]

| Gate | By day 30 (Nov 13) | By day 60 (Dec 13) | If missed |
|---|---|---|---|
| Etsy | ≥5 orders; ad cost per order ≤ $40; ≥3 reviews | ≥15 orders cumulative; listing CVR ≥1.5% | Cut ads to $1–2/day. Test the $79 hero and memorial listings. Keep organic listings |
| Organic video | ≥60 posts; ≥1 post at 5× the account median; ≥100 site visits from social | ≥10 social-sourced orders cumulative; bio link live on TikTok | Change the format (more reply videos, breed carousels). Keep posting through Dec |
| Creators | ≥100 contacted; ≥10 posts live | ≥25 posts; ≥1 creator with ≥3 attributed orders → Partnership/Spark ad | Change the tier (5–20K accounts) and the pitch |
| Site funnel | Visitor→upload ≥25%; upload→order ≥5% (7 days) | Upload→order ≥7% | Fix the funnel before any paid spend (`growth.md` §3) |
| Paid | Only boosts of proven posts, ≤ $50 total | 7-day CAC ≤ $45 at $10–20/day | Pause paid. Put the money into seeds and Etsy |

### 4.4 Precondition checklist (week 1) [I/E]

1. **Register a brand domain** and point the site at it.
   - `pupprints.shop` returned NXDOMAIN on Oct 14, yet it is the default support email domain in `web/src/lib/config.ts`. The domain may be unregistered.
   - `pupprints.com` is parked with a domain marketplace.
   
   Then set up a mailbox, SPF/DKIM/DMARC, Search Console, and Merchant Center verification.
2. **Collect a valid postal address** for the CAN-SPAM footer (a PO box or virtual mailbox) before any cold email.
3. **Confirm that Etsy's photo-upload personalization is available** on the shop. Disclose AI use and Printful in every listing and on the shop page.
4. **Check that the holiday cutoffs agree** across content. `growth.md` says Dec 10; `seo-keywords.md` cites Dec 12 for the Christmas guide. Etsy listings need the same date.

---

## 5. Sources

**Internal ([I])**
- `docs/research/growth.md` (funnel targets, Meta structure, benchmarks)
- `docs/research/fulfillment.md` (per-SKU costs and margins)
- `docs/research/ai-tech.md` (about $0.24 AI cost per preview session)
- `docs/research/influencers.md` (creator lists, affiliate economics)
- `docs/research/competitors.md` (seasonality, competitor process)
- `docs/seo-keywords.md` (keyword map, built URLs)
- `web/src/lib/catalog.ts` (prices)
- `web/src/lib/config.ts` (site URL, support email)
- Supabase row counts, Oct 14, 2026
- DNS lookups via dns.google, Oct 14, 2026

**Paid**
- [TopGrowth DTC Meta panel](https://topgrowthmarketing.com/dtc-ecommerce-benchmarks/meta-ads-benchmarks/)
- SuperAds: [CPM](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille) · [CPC](https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click) · [CTR](https://www.superads.ai/facebook-ads-costs/ctr-click-through-rate) · [cost per purchase](https://www.superads.ai/facebook-ads-costs/cost-per-purchase)
- [AdMake: CPM by month](https://admakeai.com/blog/cost-per-impression-cpm-explained)
- [Affect Group: US Meta CPM](https://affectgroup.com/blog/meta-ads-cpm-in-the-us-2025-benchmarks-for-facebook-and-instagram/)
- [Influee: Triple Whale 2025 summary](https://influee.co/nl/blog/facebook-ads-benchmarks)
- Learning phase: [PPC Land](https://ppc.land/learning-phase/) · [Jon Loomer](https://jonloomer.com/?p=45223) · [1clickreport](https://www.1clickreport.com/blog/advantage-plus-shopping-25-conversions-2026-guide) · [ATTN Advantage+](https://www.attnagency.com/blog/meta-advantage-plus-shopping)
- Partnership ads: [eMarketer](https://www.emarketer.com/content/meta-expands-partnership-ads-turn-creator-content-performance) · [PPC Land](https://ppc.land/meta-says-partnership-ads-cut-incremental-purchase-costs-45-in-emea-tests/)
- TikTok: [budget help](https://ads.tiktok.com/help/article/budget) · [Lebesgue](https://lebesgue.io/tiktok-ads/tiktok-ads-benchmarks-for-ctr-cr-and-cpm) · [Enrich Labs](https://www.enrichlabs.ai/blog/tiktok-ads-complete-guide-2026) · [Hawky](https://hawky.ai/blog/tiktok-ads-benchmarks) · [TikAdSuite](https://tikadsuite.com/blog/tiktok-ad-benchmarks/) · [AdMake Spark](https://admakeai.com/blog/tiktok-spark-ads) · [Adcore credits](https://www.adcore.com/blog/free-tiktok-ad-credits/)
- Pinterest: [Stackmatix](https://www.stackmatix.com/blog/pinterest-ads-cost) · [AdBacklog](https://adbacklog.com/blog/pinterest-ads-benchmarks-per-industry-2025) · [Digital Applied](https://www.digitalapplied.com/blog/pinterest-statistics-2026-marketing-data-points) · [WAJ Digital](https://wajdigital.com/pinterest-ads-benchmarks/) · [Pinterest credit offer ended](https://community.pinterest.biz/t/oh-hey-heres-how-to-get-60-in-ads-credit-on-us/22706)
- Google: [Segwise (WordStream 2025)](https://segwise.ai/blog/google-ads-benchmarks-industry-insights) · [OwlClaw Shopping](https://owlclaw.com/benchmarks/google-shopping-benchmarks/) · [The Ad Spend caveat](https://theadspend.com/benchmarks/google-shopping-overall) · [Google PMax tips](https://support.google.com/google-ads/answer/13775728) · [DataFeedWatch](https://www.datafeedwatch.com/blog/performance-max-campaign-structure) · [Google promotions](https://support.google.com/google-ads/answer/2393021) · [Spilno](https://spilnoagency.com.ua/en/instructions-us/google-ads-coupon)
- Reddit and Nextdoor ads: [WebTonic](https://www.webtonic.io/blog/e-commerce-reddit-ads-statistics) · [Affect Group Reddit](https://affectgroup.com/blog/reddit-ads-average-cpc-2025/) · [Nextdoor FAQ](https://business.nextdoor.com/en-us/small-business/resources/blog/the-most-commonly-asked-questions-from-local-businesses-about-nextdoor) · [Tech.co](https://tech.co/digital-marketing/advertising-nextdoor-business) · [Search Engine Land](https://searchengineland.com/nextdoor-rolls-out-free-business-posts-best-practices-advice-336135)

**Free content**
- [Buffer TikTok frequency study](https://buffer.com/resources/how-often-should-you-post-on-tiktok/)
- [Metricool via NetInfluencer](https://www.netinfluencer.com/tiktok-beats-instagram-and-youtube-on-views-but-instagram-wins-on-engagement-study-finds/)
- Socialinsider: [views vs engagement](https://socialinsider.io/blog/views-vs-engagement) · [Instagram 2025](https://www.socialinsider.io/data-geeks/instagram_benchmarks_2025.pdf) · [Reels](https://socialinsider.io/blog/instagram-reels-statistics/)
- [TTCalculator funnel](https://ttcalculator.net/learn/tiktok-conversion-rate-optimization/)
- [Shopify: TikTok bio link](https://www.shopify.com/blog/how-to-add-link-to-tiktok-bio)
- [Dash Social YouTube](https://www.dashsocial.com/social-media-benchmarks/youtube)
- Pinterest organic: [GenSumo](https://gensumo.com/research/pinterest-marketing-benchmarks-report/) · [PostEverywhere](https://posteverywhere.ai/blog/pinterest-metrics-kpis) · [Pinterest community timeline](https://community.pinterest.biz/t/new-pinterest-account-how-long-does-it-take-to-get-noticed/25413)
- Anecdotes: [Alura: digidoggo](https://www.alura.io/interview/digidoggo) · [Alura: UniquePetPrints](https://www.alura.io/interview/uniquepetprints) · [Gazette Live](https://www.gazettelive.co.uk/news/teesside-news/pet-portrait-artist-goes-viral-24582417) · [Yahoo AI backlash](https://www.yahoo.com/lifestyle/articles/tiktok-artist-sparks-backlash-selling-085800018.html) · [Bemomentiq](https://bemomentiq.com/blog/how-pet-brands-crushing-it-tiktok-shop-4-influencer-campaign) · [Flippa: PetPortraits.com](https://flippa.com/11921562-729k-revenue-82-margins-featured-in-inc-ny-post-more-petportraits-com-the-ultimate-pod-brand) (SEO-led POD pet-portrait store, about $729K over about 2 years, $2,551/month profit) · [Starter Story](https://www.starterstory.com/ideas/pet-portrait-business)

**Cold outreach**
- Creators: [Favikon](https://www.favikon.com/blog/how-to-do-influencer-outreach-templates-and-tips-that-actually-get-replies) · [Modash gifting survey](https://www.modash.io/blog/influencer-gifting-survey) · [elev8or](https://www.elev8or.io/blog/influencer-gifting-and-product-seeding-guide) · [InfluencerFee](https://influencerfee.com/blog/influencer-gifting-program-guide/) · [Inro DM limits](https://inro.social/blog/how-many-direct-messages-can-you-send-on-instagram) · [Substack anecdote](https://brandperson.substack.com/p/the-role-of-creative-strategy-in/comments)
- Cold email: [Hunter 2025](https://hunter.io/the-state-of-cold-email-2025) · [lemlist](https://lemlist.com/blog/cold-email-benchmarks/) · [Instantly](https://instantly.ai/blog/email-sequence-benchmarks-2026-whats-a-good-open-rate-reply-rate-and-cost-per-meeting/) · [Something Inc (Belkins)](https://somethinginc.com/blog/cold-email-response-rates-2026-data/) · [LeadHaste vet](https://leadhaste.com/blog/cold-email-template-for-veterinary)
- Tools: [CASRAI Instantly pricing](https://www.casrai.org/guides/instantly-ai-pricing) · [Woodpecker](https://woodpecker.co/blog/instantly-ai-pricing/) · [CostBench Smartlead](https://costbench.com/software/sales-engagement/smartlead/)
- Deliverability: [Red Sift](https://redsift.com/blog/gmails-enforcement-ramps-up-what-bulk-senders-need-to-know) · [GMass](https://www.gmass.co/blog/gmail-bulk-sender-guidelines/) · [dmarcian](https://dmarcian.com/yahoo-and-google-dmarc-required/) · [Smartlead](https://www.smartlead.ai/blog/how-many-cold-emails-per-day) · [SyncGTM](https://syncgtm.com/blog/how-long-to-warm-up-email) · [LeadHaste warm-up](https://leadhaste.com/blog/warm-up-email-domains)
- CAN-SPAM: [Prospeo](https://prospeo.io/s/can-spam-penalties-per-email) · [FTC compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)

**Marketplaces**
- Etsy data: RankHero ([custom pet portrait](https://www.rankhero.com/keywords/custom-pet-portrait) · [dog portrait](https://www.rankhero.com/keywords/dog-portrait) · [pet memorial gift](https://www.rankhero.com/keywords/pet-memorial-gift) · [dog memorial gift](https://www.rankhero.com/keywords/dog-memorial-gift) · [royal pet portrait](https://www.rankhero.com/keywords/royal-pet-portrait) · [custom pet canvas](https://www.rankhero.com/keywords/custom-pet-canvas)) · [Listifyai](https://www.listifyai.net/keyword/custom-pet-portrait)
- Etsy fees and help: [Craftybase fees](https://app.craftybase.com/blog/the-complete-guide-to-etsy-fees) · [Etsy Offsite Ads help](https://help.etsy.com/hc/articles/360000338367) · [Etsy Ads help](https://help.etsy.com/hc/articles/360033701174) · [Etsy Seller Handbook](https://www.etsy.com/seller-handbook/article/667698209245) · [Insight Agent (Etsy Ads CPC, unverified)](https://www.insightagent.app/guides/etsy-ads-minimum-daily-budget-2026)
- Etsy policy: [RankHero policy summary](https://www.rankhero.com/blog/etsy-policy-changes-2025-what-you-need-to-know) · [Listadum Creativity Standards](https://www.listadum.com/blog/etsy-creativity-standards) · [Beancount](https://beancount.io/blog/2026/07/09/etsy-2026-fee-hike-ai-disclosure-rules-handmade-sellers-guide) · [Etsy Creativity Standards (official)](https://www.etsy.com/legal/creativity) · [Listadum personalization](https://www.listadum.com/blog/etsy-just-made-personalization-way-better-heres-how-to-actually-use-it) · [Etsy personalization beta help](https://help.etsy.com/hc/en-gb/articles/33478801738519-How-to-Offer-Personalised-Listings-as-a-Beta-Participant)
- Etsy outcomes: [Gelato Etsy CVR](https://www.gelato.com/blog/etsy-conversion-rate) · [Etsy forum: off-Etsy links](https://community.etsy.com/t5/Etsy-Success/Can-I-have-a-web-site-besides-etsy/td-p/52113144) · [Etsy forum: first sale](https://community.etsy.com/t5/Etsy-Success/How-Long-Did-It-Take-to-Get-Your-First-Sale/td-p/79570841)
- TikTok Shop: [Custom Order Requirements](https://seller-us.tiktok.com/university/essay?knowledge_id=6719693841286958&default_language=en) · [Content Policy](https://seller-us.tiktok.com/university/essay?knowledge_id=6837891779151617&lang=en) · [Printify personalization](https://help.printify.com/hc/en-us/articles/28903711308177-How-does-Printify-s-personalization-feature-work) · [Printful TikTok fees](https://www.printful.com/blog/tiktok-shop-fees) · [FastMoss](https://www.fastmoss.com/blog/tiktok-shop-seller-costs-in-the-us-2026-fees-creator-commissions-fulfillment-returns-real-profit/)
- Amazon: [Amazon Custom (EU)](https://sell.amazon.de/programme/custom) · [Printful Amazon fees](https://help.printful.com/hc/en-us/articles/360014067159-What-are-Amazon-s-referral-fees) · [Printify Amazon costs](https://help.printify.com/hc/en-us/articles/43556915343633-What-are-the-costs-associated-with-selling-on-Amazon) · [ChannelX Handmade](https://channelx.world/2015/11/etsy-v-amazon-7-questions-you-need-to-answer/)
- Google free listings: [OMR](https://omr.com/en/daily/google-shopping-free) · [Summit](https://www.summit.co.uk/opinions-news/drive-up-to-6-more-traffic-with-googles-new-free-shopping-listings/)
- Meta Shops and Marketplace: [PPC Land](https://ppc.land/meta-phases-out-facebook-and-instagram-shops-checkout-by-august-2025/) · [Value Added Resource](https://www.valueaddedresource.net/meta-phases-out-native-checkout-facebook-instagram-shops/) · [Target Internet](https://www.targetinternet.com/what-is-facebook-marketplace/)

**Communities and SEO**
- [Redship: Reddit self-promotion](https://redship.io/blog/reddit-self-promotion-rules)
- r/dogs wiki rules, seen via mirror search results (reddit.com blocked automated reading)
- Ahrefs time-to-rank: [Whitehat SEO](https://www.whitehat-seo.co.uk/knowledge/how-long-does-it-take-to-rank-on-google) · [Crowdo](https://crowdo.net/blog/how-long-to-rank-in-google-2025/)
