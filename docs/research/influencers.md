# Pup Prints influencer research foundation (as of 2026-10-13)

US market, dog-only AI portraits. The full machine-readable list (67 accounts) is in `/tmp/claude-0/-home-user-Pupprints2/140e5a3a-3eb9-55c7-8a06-9b8950ae13ad/scratchpad/influencers_seed.csv`. Columns: tier, handle, platform, approximate followers and where the count came from, niche, public contact and where it was listed, priority, flags. The raw TikTok data is in `scratchpad/tt1.jsonl`, `tt2.jsonl` and `tt3.jsonl`.

## Key findings

1. **We are at the start of the peak season.** Crown & Paw's own AWIN listing says mid-October to early December brings in more than 50% of its revenue. Small creators who get a gifted portrait need about 2–4 weeks to post. Deals with large accounts that have managers take longer. Start outreach now.
2. **Crown & Paw has no open creator program.**
   - Its affiliate program runs through AWIN with a 60-day cookie. The commission rate is not published.
   - The terms ban bidding on its brand name and ban "medical or exaggerated claims."
   - Its GRIN brand page says it "has not published an open GRIN program" and has no active partnerships.
   - So we can win creators simply with better and clearer terms: higher commission, the same 60-day cookie, a free portrait and print, and fast payouts.
3. **67 accounts verified.** That is 31 macro, 16 mid, 15 micro and 5 nano. 35 of them show a business email on their own public profile. No emails were guessed.
4. **Accounts we should not pitch:**
   - **Tucker Budzyn:** Tucker died on 2026-09-02, per news coverage of the owner's announcement.
   - **@monienature:** the account owner's other dog Otis died in June 2026.
   - **Manny the Frenchie:** died 2023-06-21.
   - **Jiffpom:** I could not confirm the account is still active. @jiffpom on TikTok is not the real account (17 followers).
5. **Recommended tools:**
   - Track referrals ourselves at first. The repo already has `partners` and `referral_events` tables, and Stripe Checkout can carry the referral in its metadata and promo codes.
   - Add Rewardful ($99/mo Growth) or PromoteKit ($29/mo Pro) if we want a creator portal and automatic payouts.
   - For finding creators, use Modash ($199/mo) or GRIN (free plan, or $200/mo Starter). Both are month-to-month.
   - At launch, avoid Aspire and Upfluence (annual contracts), Shopify Collabs (Shopify stores only) and TikTok Shop (see section 3).
6. **FTC compliance:**
   - Every gifted, paid or affiliate post needs a clear disclosure placed in the content itself.
   - The FTC's Consumer Review Rule (16 CFR 465) is now being enforced. Penalties are up to **$53,088 per violation**.
   - The FTC sent warning letters to nearly a dozen companies under this rule in December 2025.

---

## 1. Dog influencers

**How the numbers were collected:**
- **TikTok:** counts come from each creator's public TikTok profile data, pulled on 2026-10-13. Public emails come from the bio.
- **YouTube:** counts come from the channel pages on the same day.
- **Instagram:** Instagram blocked automated requests (HTTP 429). Instagram counts therefore come from dated third-party snapshots: Modash (2026-09-22), iQfluence (2026-09-19), Scrumball (Oct 2026), influencersworship (Sep 2026) and Gulf News (Apr 2025).
- All counts are approximate. Tier is based on the creator's largest platform.

### Macro (500K+)

| Handle | Approx. followers (source) | Niche / breed | Public business contact (where listed) | Why they fit |
|---|---|---|---|---|
| @aguyandagolden | TikTok 9.5M; YouTube 5.45M (profiles, 10/13) | Golden retriever (Teddy), comedy and charity; Greenville SC | Cam@matl-ent.com (TikTok bio, MATL Entertainment) | Huge US audience. His "Shelter Dog Saturday" series suits a portrait-for-adoptable-dogs tie-in. Same manager as @adventuringwithnala, so both could be one deal. |
| @tuckerbudzyn | TikTok 11.9M; YouTube 5.97M | Goldens (Tucker and son Todd) | tuckerbudzyn@gmail.com (YouTube description) | **Do not pitch.** Tucker died 2026-09-02. Only engage if the family reaches out first. |
| @whataboutbunny | TikTok 8.5M | Talking-button dog, bestselling author | bunny@select.co (TikTok bio) | A video of Bunny "responding" to her portrait with her buttons would be a strong hook. |
| @adventuringwithnala | TikTok 7.8M | Dog comedy ("Nala stomps"); breed not in bio | adventuringwithnala@matl-ent.com (TikTok bio) | Can be bundled with AGuyandAGolden through MATL. |
| @brodiethatdood | TikTok 7.5M; IG ~1.5M (Gulf News 2025) | Goldendoodle, service dog | via beacons.ai/brodiethatdood | Doodle owners skew toward high-spend gift buyers. |
| @hammyandolivia | TikTok 7.1M | Corgis, "talking" family | hammyandolivia@gmail.com (TikTok bio) | Already runs a pet-brand affiliate code, so used to this kind of deal. |
| @meekathehusky | TikTok 6.1M | Talking/singing husky | via beacons.ai/meekathehusky | Strong personality; reaction videos. |
| @dougthepug | TikTok 6.0M; IG ~3.6M; YouTube 682K | Pug; Nashville TN | info@dougthepug.com (TikTok bio) | The best-known celebrity dog. Pitch costume-style portraits, but no trademarked characters. |
| @huxleythepandapuppy | TikTok 5.9M | Panda-patterned dog, costumes | via beacons.ai link | Founder of Pandaloon (a Shark Tank pet brand), so a co-marketing angle. |
| @shaqthepug | TikTok 5.5M | Pug, family videos | info@allstarshaq.com (TikTok bio) | Lower priority: Scrumball measures engagement at 0.4%. |
| @mayapolarbear | TikTok 5.4M; IG ~1.7M | Samoyeds (Maya & Michi) | via beacons.ai/mayapolarbear | Very photogenic; ideal for showing off portraits. |
| @madmax_fluffyroad | TikTok 4.2M | Corgi (Maxine); NYC; "adoption rides" | none in bio (Instagram DM) | Rescue/adoption tie-in. |
| @weratedogs | TikTok 4.1M; YouTube 1.13M | Dog ratings; runs the 15/10 Foundation nonprofit | via tt-links.weratedogs.com | Natural "we rate the portrait" concept plus a charity angle. |
| @tikatheiggy | TikTok 3.2M; IG ~1.6M | Italian greyhounds, fashion | tikatheiggy@gmail.com (TikTok bio) | Editorial look matches ours. Canada-based, so check how much of the audience is in the US. |
| @life.with.a.landcloud | TikTok 3.2M | Large fluffy dogs (Boomer + Diya) | lifewithalandcloud@undercurrent.net (TikTok bio) | Warm, morning-hug content suits reveal videos. |
| @thedogist | IG ~7.7M; TikTok 2.2M; YouTube 150K | Dog photographer Elias Weiss Friedman | via linktr.ee/TheDogist | Photography credibility. Premium price, and he sells his own products. |
| @crusoe_dachshund | TikTok 2.2M; IG ~886K | Dachshunds; posting since 2011 | via official site or Instagram | Long-running, storytelling-led account. |
| @arrowtotherescue | TikTok 2.2M | Rescue dog with a missing jaw | Arrowtotherescue@gmail.com (TikTok bio) | Heartwarming rescue content. |
| @wolfgang2242 | IG ~1.3M | Senior rescue dogs (Steve Greig, Newark OH) | via Instagram | Audience familiar with dog loss. Portraits of his current pack plus a donation. Handle with care. |
| @gonetothesnowdogs | YouTube 1.51M; TikTok 803K | Siberian huskies | via beacons.ai link | YouTube long-form integration. |
| @RockyKanaka | YouTube 5.69M | Shelter dogs ("Sitting with Dogs") | YouTube About page | "First portrait in their forever home" adoption campaign. |
| @minidoodlebentley | TikTok 1.3M; IG ~338K | Mini doodle with young kids | bentley@verticaltalent.co (TikTok bio) | Family gifting. Kids appear in videos, so check child-creator laws (section 4). |
| @kingsleythedoood | TikTok 1.0M | Goldendoodles | via msha.ke/kingsleyandchai | Already promotes custom pet products (per iQfluence). |
| @lacorgi | TikTok 1.0M; IG ~605K | Corgi brothers; Los Angeles | hello@lacorgi.co (TikTok bio) | Show/agility dogs; sells own merch. |
| @willys360world | TikTok 955K; IG 725K (Modash, 3.7% engagement) | Golden; national parks; Montana | willys360world@gmail.com (TikTok and IG bios) | Outdoor dog-parent gift buyers. |
| @the_doggie_days | TikTok 859K | Maltese (Dior & Obi-Wan); NYC | via Instagram | Dior is a cancer survivor, so be sensitive. |
| @dognamedstella | TikTok 841K | Labradors; Maine | dognamedstella207@gmail.com (TikTok bio) | Already uses affiliate links. |
| @whenashmetbowser | IG 647K (iQfluence, 5.5% engagement, 56% US); TikTok 640K | Boston terriers | none listed | Strong engagement. |
| @sammcgraww | TikTok 612K | Beagle; Florida | sam@famfluencetalent.com (TikTok bio) | Family content. |
| @ambertheseniorrescuedchi | TikTok 591K | 17-year-old senior rescue Chihuahua | amberthechi@gmail.com (TikTok bio) | "Portrait while she's still here." Be sensitive. |
| @eltonthegoldenretriever | TikTok 548K | Golden; supports a puppy rescue | Eltongoldenretriever@gmail.com (TikTok bio) | Rescue tie-in. |

### Mid (100K–500K)

| Handle | Approx. followers | Niche | Contact | Why they fit |
|---|---|---|---|---|
| @booplethesnoot | TikTok 492K; IG 225K | Pet-friendly home; Austin TX | Partnerships@booplethesnoot.com | **Home-decor angle**: the portrait as wall art. Her bio mentions pregnancy after loss, so be sensitive. |
| @sundaythegoldenretriever | TikTok 405K | Golden ("awoos") | none in bio | Uses affiliate links. |
| @hudsonthefluffyco | TikTok 388K | Fluffy corgi | hudsonthefluffycorgi@gmail.com | Likely Canada-based (Amazon.ca storefront). |
| @goldengirlpacha | TikTok 376K | Goldens | goldengirlpacha@gmail.com | Comedy and lifestyle. |
| @whitneysdogs | IG 316K (Modash, 92% US); TikTok 107K | Foster dogs; founder of Hearts & Bones Rescue; Dallas | whitneysdogs@gmail.com (IG bio) | "Adoption day portrait" program. |
| @thatgoldendog | IG ~299K; TikTok 194K | **Dog photographer** with her golden; Los Angeles | info@thatgoldendog.com (TikTok bio) | "My photo vs. the portrait" content; credible on quality. |
| @chaoswithkoda | IG 257K; TikTok 76K | Colorado | chaoswithkoda@gmail.com | Couple-and-dog content. |
| @noatherescuedoodle | IG 257K | Rescue doodle and foster stories; Tulsa | noatherescuedoodle@gmail.com (IG bio) | Rescue stories. |
| @itskevintheberner | TikTok 226K; IG 140K | Bernese mountain dog | dionna@hickoxmediagroup.com | Big fluffy dog. |
| @atlasgolden | TikTok 219K | Golden | atlasgoldenretriever@gmail.com | Golden audience. |
| @tstarch | TikTok 216K; IG 85K (94% US) | Four-dog household | dog@tstarch.com (IG bio) | **Multi-pet portraits**, so a higher order value. |
| @adventuringwitharchie_ | IG 181K (7.3% engagement) | Rescues; married to @aguyandagolden | via linktr.ee | Could be bundled with the MATL deal. |
| @hergentlegiants | IG 152K (16.5% engagement) | Irish wolfhounds | none listed | Exceptional engagement. |
| @ripleyandrue | IG 135K; TikTok 12.8K | "OG Dog Mom Brand" | via RipleyandRue.com | Possible co-branded product. |
| @the_daily_howl | TikTok 120K | Pomeranian/Japanese Chin mix | none in bio | Howl-reaction videos. |
| @mooseandpoppy | TikTok 109K | English labs; Massachusetts | mooseandpoppy@gmail.com | Pair of dogs. |

### Micro (10K–100K)

| Handle | Approx. followers | Niche | Contact | Notes |
|---|---|---|---|---|
| @novathegoldengal | IG 96K (6.9% engagement) | Goldens; coastal life | nova@verticaltalent.co (IG bio) | Same manager as Bentley. |
| @henryandpenny | TikTok 88K; IG 120K+ (per bio) | Frenchies; van life; Pittsburgh | via direct.me link | |
| @henrythecoloradodog | TikTok 83K | Rescues Baloo + Pancake | via tag.gs link | Account keeps the name of the original dog, Henry. |
| @polothepittie | TikTok 45K; IG 72K | Pit bull ambassador; Massachusetts | Polothepittie@gmail.com (IG bio) | Bully-breed audience. |
| @mydogmargot | TikTok 50K | Cane corso; Waco TX | via linktr.ee | |
| @seniordogdoc | TikTok 34.6K | Senior dog care | via seniordogrevolution.com | Senior and memorial audience. |
| @evasblindadventures | TikTok 33.6K | Blind dog; glaucoma awareness | bio shows an incomplete address, so do not guess | |
| @reggie_my_wedgie | IG 32K (21.9% engagement); TikTok 4.1K | Frenchie, spinal (IVDD) survivor; NYC | reggiemywedgie@gmail.com | |
| @littlecooperbear | TikTok 30K; IG ~57K | Corgis | hello@littlecooperbear.com | |
| @jerrybichon | IG ~28–31K | Bichon; Los Angeles | jerrybichonfrise@gmail.com (TikTok bio) | |
| @belleandmurphy | IG 29K (17.8% engagement, 64% US) | Golden | none listed | |
| @thesamoyedsummit | TikTok 26K | Samoyed | none | |
| @leaningonlabs | TikTok 17.1K | Labs and a service dog; Colorado | via linktr.ee | |
| @titotherescue | TikTok 11.5K | Rescue lab mix | titotherescue@gmail.com | Has an Amazon storefront, so used to affiliate work. |
| @monienature | TikTok 48.7K | Boston terriers | via Instagram | **On hold.** Recent loss (June 2026). |

### Nano (1K–10K)

Nano creators are best found in bulk (see section 3). These are the verified examples:

| Handle | Approx. followers | Niche | Contact |
|---|---|---|---|
| @kumapupper | IG 9.7K (10.2% engagement); TikTok 1.3K | Shiba Inu; Los Angeles | Kumapupper@gmail.com (TikTok bio) |
| @styledwithpaws | IG 9.1K; TikTok 1.0K | Dog mom, fashion and home | styledwithpaws@gmail.com (TikTok bio) |
| @udonnoodlethechi | IG 2.6K | Chihuahua | none captured |
| @mydoodrhett | IG 10.4K | Doodle | none captured |
| @knoxandbear | TikTok 4.2K (IG ~87.5K) | Goldador; memorial for Bear | via TheKBHShop.com |

**Managers seen in creator bios:** MATL Entertainment, Select Management, Vertical Talent, Hickox Media Group, Undercurrent and Famfluence Talent. The Dog Agency (founded 2015 by Loni Edwards, runs PetCon) is the main dedicated pet-talent agency. Negotiating with one manager for several creators lowers cost per creator and saves time.

---

## 2. Rates (2025–2026) and how to pay creators

### Typical rate ranges per deliverable (USD)

These combine several vendor benchmarks, which disagree by about 2x. Treat them as a floor.

| Tier | IG feed post | IG Reel / video | IG Story | TikTok video | YouTube integration |
|---|---|---|---|---|---|
| Nano (1–10K) | $20–200 | $40–300 | $20–70 | $30–280 | $75–450 |
| Micro (10–100K) | $100–1,000 (US micro: $250–800) | $200–2,000 (US micro Reel: $400–1,200) | $70–500 | $150–1,500 | $400–2,500 |
| Mid (100–500K) | $600–5,000 | $1,200–10,000 | $250–1,400 | $700–5,000 | $2,000–12,000 |
| Macro (500K–1M) | $3,000–15,000 | $6,000–30,000 | $1,400–4,500 | $3,500–15,000 | $10,000–35,000 |
| Mega (1M+) | $10,000+ | $20,000+ | — | $12,000+ | $30,000+ |

Sources: InfluencerFee (reviewed 10/13/2026), Snippet (June 2026), LaunchPoint (March 2026).

**Extra costs on top of the base rate:**
- 30-day whitelisting (running their post as an ad): 50–100% of the base fee.
- 60-day exclusivity: +30–50%.
- Rare breeds or service dogs: +20–30%.
- Typical pet-creator cost per 1,000 views: $12–30.
- Scrumball's algorithm estimates $8.8–13.3K per post for @shaqthepug (5.5M on TikTok). Managed top accounts in the 5–12M range will quote higher.

### Payment models

| Model | When to use it | Notes |
|---|---|---|
| **Gift only** | Nano and small micro (under about 30K) | Give a free portrait and print with no posting obligation, then offer paid work to those who respond well. One benchmark advises paying at least a partial fee above 50K. The cost to us is low: we produce the portrait instantly and only pay for the print. |
| **Affiliate** | Every tier, as a base layer | Category benchmarks: Memorialize Art 10% for creators / 15% VIP; Photo2Painting 8%; Nexbie 15%; ReferralCandy's suggested DTC start 10–15%; TikTok Shop average about 13%. **Recommendation: 20% commission, 60-day cookie (matching Crown & Paw), plus a 15% discount code for followers.** That beats category norms. |
| **Hybrid: flat fee + commission** | Micro and mid | Example: $250–2,500 plus 15–20%. This rewards the creator for sales and lowers the risk on the upfront fee. |
| **Paid flat fee + usage rights** | Mid and macro | Package TikTok + Reel + Story. Negotiate through the manager. Include 30–90 days of ad rights in the price. |
| **Charity tie-in** | Rescue-focused accounts (WeRateDogs, Rocky Kanaka, Whitney's Dogs) | A donation per order or donated portraits for adoptable dogs. Often lowers the fee and makes for a stronger story. |

### Content that sells gift and personalized products

- **Reveal and reaction videos.** West & Willow, a direct competitor, runs about 29 active Meta ads. Its main formats:
  - unboxing (15%)
  - before/after (11%)
  - montage (7%)
  - owner reaction and crying
  - one memorial testimonial
  - a screen-recorded upload demo
- **Our own advantage: the instant free preview.** A creator can screen-record "trying every style on my dog" live. Competitors cannot do this, because their proofs take 1–3 days.
- **"Dog meets portrait."** The dog sniffs or reacts to its own portrait. Pet-reaction clips regularly reach tens of millions of views (for example, one dog-reaction clip had about 20.9M views).
- **Q4 gift angle.** "Gift for the dog mom who has everything" and gift-guide roundups. Our digital Gift Reveal gives creators a real last-minute angle for late December.
- **Pet-loss and memorial stories.** These convert strongly but carry ethical risk. Our rules:
  - only with creators who bring it up themselves;
  - no cold pitches to recently bereaved accounts;
  - no countdown or urgency tactics;
  - no "make them cry" hooks in the brief.
- **Run creator posts as ads.** Meta reports 19% lower cost per acquisition for partnership ads than standard ads. An independent analysis of $130M in spend found 5% lower CPA than brand-run creator footage. TikTok reports Spark Ads get 134% higher completion than standard in-feed ads.
- **Copy rules (from CLAUDE.md, also an FTC issue):** never call the art "hand-painted." Describe it as "our AI artist, finished and checked by our team." Lead with the outcome, not with "AI."

---

## 3. Tools for a Next.js + Stripe store

### Affiliate tracking

| Tool | Price | Works with Stripe one-time payments? | Notes |
|---|---|---|---|
| **In-house** (existing `partners` + `referral_events` tables) | $0 | Yes. Put the referral ID in the Checkout Session metadata and give each creator a Stripe promotion code. | Simplest launch option. Payouts by PayPal or Wise. |
| **Rewardful** | $49 / **$99** / $149+ per month; caps on affiliate revenue of $7.5K / $15K / $30K per month; 0% transaction fee | Yes. Pass `client_reference_id` and set `customer_creation:'always'` in payment mode. | 14-day trial; coupon tracking; PayPal and Wise payouts; branded portal on Growth. Managed payouts cost 3%. |
| **PromoteKit** | Free (3 referrals) / **$29** Pro (up to $10K/mo) / Enterprise | Yes, both one-time and subscription. | Optional one-click payouts cost 5% (bank) or 8% (card). |
| **Tolt** | $69 / $99 / $199 per month (caps $10K / $20K / $50K) | Uses a `tolt_referral` metadata field. Docs only show subscription examples, so confirm one-time support. | 2% fee on automatic payouts; W-9 and 1099 handling on Growth and above; 14-day trial, no card. |
| **FirstPromoter** | $49 / $99 / $149 per month (caps $5K / $15K / above $15K) | Yes | 14-day trial, no card. |
| **Partnero** | $59/mo ($49 annual) / $199 / Enterprise from $599 | Stripe plug-in | 30-day trial; managed payouts cost 7%. |
| **Tapfiliate** | $89 / $179 per month | Stripe pre-built | Cheapest plan caps at 500 conversions a month. |
| **Refersion** | $39 + 3% of affiliate sales / $199 + 2% | Stripe via code | Built mainly for Shopify. |
| **LeadDyno** | $49–749 per month | Stripe | 30-day trial. |
| **Dub Partners** | $90 / $300 / Enterprise; 5% payout fee (3% Enterprise) | Pricing page does not mention Stripe; confirm | Good branded link analytics. |
| **GoAffPro** | Free / $49 / $99+ | Stripe not listed (Shopify, WooCommerce and similar) | Poor fit. |

### Finding and managing creators

| Tool | Price | Notes |
|---|---|---|
| **Modash** | $199/mo Essentials (150 email unlocks); $499 Performance; Enterprise from $14.7K/yr | Searches about 380M profiles; 14-day trial; month-to-month. Its sales tracking assumes Shopify, so we would track sales ourselves. |
| **GRIN** | Free / $200 / $500 / $1,000 per month (credit-based) | Month-to-month; 30-day Starter trial; offers a tracking SDK and signed order webhooks for stores not on Shopify. |
| **Upfluence** | Custom quote | 12-month minimum on annual plans; built around Shopify and WooCommerce. |
| **Aspire** | Not published; third parties estimate about $2,000–2,500/mo with an annual commitment | Too heavy for launch. |
| **Collabstr** | Marketplace: 10% fee charged to the brand (5% on Premium); reported Pro price varies from $149 to $299/mo | Good for buying nano/micro content quickly. |
| **TikTok One** (includes the former Creator Marketplace) | No fee mentioned in sources; confirm | TikTok's own creator discovery, plus access for Spark Ads. |
| **Shopify Collabs** | Requires a Shopify store | **Not compatible** with our Next.js + Stripe checkout. |
| **TikTok Shop affiliate** | Referral fee about 6%; several 2026 guides say it rose to 8% from Aug 4, 2026, which needs checking. Sellers set commission from 1–80% (average about 13%). | **Not recommended at launch.** Our product needs a photo upload, and TikTok Shop personalization is text-based. Printify reports TikTok's 3-day ship / 6-day delivery requirements. |

**Payouts and tax:** collect a W-9 from every US creator. For payments made in 2026, the 1099-NEC reporting threshold is now **$2,000** (up from $600). Payments made through PayPal or a card processor are reported by the processor on a 1099-K instead.

---

## 4. FTC disclosure requirements

### Endorsement Guides (16 CFR Part 255, revised 2023)

- **What needs disclosing:** any payment, free product, discount, affiliate commission, or family or employment tie. A free portrait counts.
- **Where:** in the post itself, impossible to miss. Not only in the profile, behind "more", buried in hashtags or at the end.
- **Video:** say it out loud and show it on screen. Livestreams must repeat it periodically.
- **Wording that works:** "Ad", "Sponsored", "Paid partnership with Pup Prints", "Gifted by Pup Prints" (only when the creator received nothing but the product), and "paid link" placed next to an affiliate link.
- **Wording that is not enough on its own:** "sp", "spon", "collab", "thanks", "#ambassador", "partner", "affiliate link".
- **Platform labels:** Meta's paid-partnership label, TikTok's disclosure toggle and YouTube's paid-promotion setting are required by those platforms. The FTC says these labels alone are not enough, so creators also need their own disclosure.
- **Our responsibility:** the brand is liable too. We must train creators, monitor posts and approve paid posts before they go live. Creators may not make claims we cannot back up, and may not promote a product they have not tried.

### Consumer Review Rule (16 CFR 465, in force since 2024-10-21)

- **Banned:**
  - fake or AI-written reviews;
  - incentives that depend on a positive review;
  - undisclosed reviews from insiders (staff, family, creators);
  - company-run "independent" review sites;
  - suppressing negative reviews;
  - buying fake followers or views.
- **Penalty:** up to **$53,088 per violation**. That is the 2025 level, which stays unchanged for 2026 under the Federal Register notice published 2026-09-15.
- **Enforcement:** first warning letters went out in December 2025 to nearly a dozen companies.
- **For us:** creator posts can never be shown as "customer reviews." Gifted creators must be free to post honest opinions. This matches the "never fabricate" rule in CLAUDE.md.

### Other rules

- **AI and honest description:** describe how the art is made truthfully, never "hand-painted." TikTok asks creators to label realistic AI-generated content with its AI-generated content (AIGC) label. Asking creators to turn it on when they show the generation step is low-risk and consistent with our "honest AI" positioning.
- **Children on camera:** check child-creator laws for accounts where kids appear (for example @minidoodlebentley).
  - Illinois (since July 2024): earnings must be put in a trust when a child is in at least 30% of paid content.
  - California (AB 1880): 15% Coogan trust deposit when a brand contracts a minor directly.
  - Minnesota (since July 2025): children under 14 may not do content-creation work.
  - Do not contract minors. Skip accounts run by minors; @cartithefrenchy's bio says "monitored by parents," so it was excluded.
- **Contract checklist:**
  - exact disclosure wording and placement;
  - pre-approval of posts;
  - usage and whitelisting term and fee;
  - exclusivity;
  - no guaranteed-positive language;
  - no trademarked characters;
  - AI-description rules;
  - W-9;
  - takedown and morals clause;
  - a minors clause.

---

## Sources

**Influencer data**
- TikTok public profiles (fetched 2026-10-13), e.g. https://www.tiktok.com/@dougthepug
- YouTube channel pages (fetched 2026-10-13), e.g. https://www.youtube.com/@TuckerBudzyn
- [Modash US dog influencers (2026-09-22)](https://www.modash.io/find-influencers/united-states/dog)
- [Modash US dog affiliates](https://www.modash.io/find-influencers/united-states/dog/affiliates)
- [iQfluence dog influencers (2026-09-19)](https://iqfluence.io/public/top-influencers/dog-influencers)
- [iQfluence dog micro creators](https://iqfluence.io/public/top-influencers/top-dog-micro-influencers)
- [iQfluence dog mom influencers](https://iqfluence.io/public/top-influencers/dog-mom-influencers)
- [iQfluence NY pet influencers](https://iqfluence.io/public/top-influencers/new-york-pet-influencers)
- [iQfluence dog TikTok](https://iqfluence.io/public/top-tiktok-influencers/dog-influencers-on-tiktok)
- [Scrumball US pet TikTok](https://www.scrumball.com/ranking/top-pet-influencers-on-tiktok-in-united-states)
- [Scrumball US pet Instagram](https://www.scrumball.com/ranking/top-pet-influencers-on-instagram-in-united-states)
- [Feedspot pet TikTok (Aug 2026)](https://creators.feedspot.com/pet_tiktok_influencers/)
- [influencersworship dog IG (Sep 2026)](https://influencersworship.com/dog_instagram_influencers/)
- [Gulf News (Apr 2025)](https://gulfnews.com/lifestyle/pets/meet-the-canine-celebrities-top-10-dog-influencers-taking-over-social-media-in-2025-1.500080671)
- [Dexerto on Tucker Budzyn](https://www.dexerto.com/entertainment/viral-golden-retriever-tucker-budzyn-dies-aged-8-following-complications-from-cancer-treatment-3406195/)
- [Manny the Frenchie (Wikipedia)](https://en.wikipedia.org/wiki/Manny_the_Frenchie)
- [The Dog Agency](https://yespress.io/the-dog-agency.md)

**Competitors**
- [Crown & Paw on AWIN](https://ui.awin.com/merchant-profile/57823)
- [Crown & Paw AWIN terms](https://ui.awin.com/merchant-profile-terms/57823)
- [Crown & Paw on GRIN](https://app.grin.ai/brands/crownandpaw.com)
- [West & Willow ad library (Motion)](https://motionapp.com/library/west-and-willow)

**Rates and ad performance**
- [InfluencerFee pet pricing](https://influencerfee.com/blog/pet-influencer-pricing/)
- [LaunchPoint pets micro rates](https://www.launchpointhq.com/guides/rates/how-much-do-pets-micro-influencers-charge)
- [Snippet pet rates](https://usesnippet.app/tools/influencer-rates/pet)
- [ReferralCandy commission rates](https://www.referralcandy.com/blog/affiliate-commission-rates)
- [Meta partnership ads data (Net Influencer)](https://www.netinfluencer.com/meta-partnership-ads-outperform-licensed-ugc-across-130m-usd-in-ad-spend-report-finds/)
- [TikTok Spark Ads 101](https://ads.tiktok.com/business/en-US/blog/spark-ads-101-make-tiktoks-into-ads)
- [TikTok holiday playbook](https://ads.tiktok.com/business/library/NA_SMB_Holiday_Playbook_2025.pdf)

**Tools**
- [Rewardful pricing](https://www.rewardful.com/pricing)
- [Rewardful Stripe server-side checkout](https://help.rewardful.com/en/articles/9014067-stripe-server-side-checkout)
- [Tolt pricing](https://tolt.com/pricing)
- [Tolt Stripe setup](https://help.tolt.com/en/articles/6843411-how-to-set-up-stripe-with-tolt)
- [FirstPromoter pricing](https://firstpromoter.com/pricing)
- [PromoteKit pricing](https://www.promotekit.com/pricing)
- [Dub pricing](https://dub.co/pricing)
- [Refersion pricing](https://www.refersion.com/pricing/)
- [Partnero pricing](https://www.partnero.com/pricing)
- [Tapfiliate pricing](https://tapfiliate.com/pricing/)
- [LeadDyno pricing](https://www.leaddyno.com/pricing)
- [GoAffPro pricing](https://www.goaffpro.com/pricing)
- [GRIN pricing](https://grin.co/pricing/)
- [Upfluence pricing](https://www.upfluence.com/pricing)
- [Modash pricing](https://www.modash.io/pricing)
- [Aspire estimates (Capterra)](https://www.capterra.com/p/187445/AspireIQ)
- [Collabstr pricing review](https://frontdeskreview.com/software/influencer-marketing/collabstr/)
- [TikTok One](https://ads.tiktok.com/business/en-US/blog/tiktok-one-creative-platform)
- [TikTok Shop fees](https://moras.ai/blog/tiktok-shop-fees)
- [Printify TikTok personalization](https://help.printify.com/hc/en-us/articles/28903711308177-How-does-Printify-s-personalization-feature-work)
- [1099 threshold (Patriot Software)](https://www.patriotsoftware.com/blog/accounting/1099-reporting-threshold/)

**FTC and legal**
- [FTC Disclosures 101](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers)
- [FTC Endorsement Guides FAQ](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)
- [Benesch on Part 465 enforcement (Apr 2026)](https://www.beneschlaw.com/insight/five-stars-zero-tolerance-ftc-turns-up-enforcement-under-consumer-review-rule/pdf/)
- [FR 2026-18853 (2026 penalty levels)](https://public-inspection.federalregister.gov/2026-18853.pdf)
- [Meta paid-partnership label vs TikTok toggle](https://www.makeinfluence.com/en/academy/metas-paid-partnership-label-vs-tiktoks-branded-content-toggle-explained)
- [TikTok AI-generated content labels](https://www.creativebloq.com/news/tiktok-tool-labels-ai-content)
- [Davis+Gilbert on child-influencer laws](https://www.dglaw.com/new-laws-protecting-child-influencers-what-marketers-and-influencers-need-to-know/)