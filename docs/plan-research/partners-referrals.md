# Partners and referrals: Pup Prints' lead getters

Research and recommended programs, as of Oct 14, 2026. Written for a solo founder with no personal network.

**Companion files**
- `marketing/partners/b2b-prospects.csv`: 65 real US businesses with public contact details only.
- `marketing/partners/b2b-playbook.md`: scripts, one-pagers, objection handling and CAN-SPAM rules.

**Inputs**
- `docs/strategy.md`: prices, margins, creator terms.
- `docs/research/influencers.md`, `docs/research/growth.md` §7.
- `marketing/channels/shelter-partnership.md`, `marketing/FIRST-SALE-RUNBOOK.md`.
- The repo: `partners`, `referral_events` and `gifts` tables, `/api/ref`, `/api/gift-portrait`.

**Method note:** every market count below has a source. Reply and close rates are **planning assumptions** unless a source is given, because no public benchmark exists for this exact offer. Each one has a kill or keep test attached. Web search hit its session limit late in the research, so a few prospect fields come from directory listings rather than the business's own site. The CSV notes say which.

---

## 0. Summary

1. **Hormozi's four lead getters** in *$100M Leads* are customer referrals, employees, agencies, and affiliates/partners.
   - We already have affiliates: the creator program, 15% commission plus a 15% audience code.
   - For a solo founder the next two that pay are **customer referrals** (compounding, nearly free) and **B2B partners** (people who already have dog owners in front of them every day).
   - Employees and agencies come later (§1).
2. **Our unfair advantage with partners is the free instant portrait.**
   - Every pitch can open with a finished portrait of the partner's own dog, made in about a minute in `/admin/partners/[id]/gift`.
   - The gift tool already writes the partner's code into the `pp_ref` cookie, so any order that comes from that reveal is attributed to the partner automatically.
   - Typical portrait shops cannot do this, because their proofs take days.
3. **Margins set hard limits.**
   - Hero 16×20 canvas: $99, 56% gross margin (GM).
   - Break-even CAC is about $55.
   - The existing 15% discount plus 15% commission leaves $28 on that canvas (34% of the discounted price).
   - A partner deal must keep total reward per order (discount + commission + credit) at or below **about $30 on a $99 order**, and promotions stay capped at 20% (strategy §3.2). Every program below fits.
4. **Recommended order of launch.** Today is Oct 14 and peak season is Oct 15 to Dec 10.
   1. Customer give-get referral plus the Gift Reveal loop (engineering, about 2 days).
   2. Groomers and daycares, with a "Holiday Portrait with every groom" offer.
   3. Breeders: "The Breeder's Gift" for holiday litters.
   4. Rescues: adoption portraits, already planned.
   5. Memorial partners (crematories first, then vets): January, slow and careful.
   6. Pet boutiques: Q1, once physical samples and gift certificates exist.
   7. Realtors and corporate gifting: opportunistic in December, then the spring housing season.
5. **US universe (sourced, §3):**
   - 71M dog-owning households.
   - About 185K grooming and boarding businesses.
   - About 138.5K AKC breeders (2019).
   - About 14.4K shelters and rescues.
   - About 13.5K pet stores.
   - About 34K vet establishments.
   - About 360–410 dedicated pet cremation businesses, plus many funeral homes and vet-run crematories.
   - About 1.44M Realtors.
6. **Customer referral design: "Give $15, get $15".**
   - The friend gets $15 off a first physical order of $59 or more.
   - The referrer gets $15 credit once the friend's order passes the 30-day guarantee window.
   - The prompt appears at the three moments of peak delight: order confirmation (the buyer has already seen the final art), the Gift Reveal page, and 7 days after delivery.
   - Benchmarks to beat:
     - average referral share of sales 2.35% (ReferralCandy);
     - share rate 5–15%;
     - referral conversion 3–5%.
   - Target: 2–5% of orders by day 90 (strategy §9).
7. **Recommended B2B offers (economics in §2 and §3):**
   - Groomers, daycares and trainers: 15% client code + 15% commission, a counter QR card, and a free portrait of the salon's own dog.
   - Breeders:
     - **Breeder's Gift**: every puppy family gets a free preview plus 20% off, and the breeder earns 10%.
     - Optional prepaid **Puppy Portrait Certificate**: $15 to the breeder, worth $29 to the family.
   - Crematories: reseller pricing at about 35% partner margin, or 15% commission.
   - Vets: no commission by default. The clinic-paid **Sympathy Portrait** is $15 per family.
   - Rescues: free adoption portraits, a 15% adopter code, and flat pre-announced donations. No per-sale charity claims, because of commercial co-venturer (CCV) laws.
   - Boutiques: a consignment wall sample with QR at 15–20% commission, then wholesale certificates at 40% off face.
   - Realtors: closing-gift trade price at 10% off.
8. **Lists at scale:**
   - Google Maps categories.
   - Breed-club and association directories: AKC Marketplace, GANA, ALAA, BMDCA, breed club PDFs.
   - The IAOPCC and CANA member directories, plus Parting Stone's partner finder for crematories.
   - Petfinder and Adopt-a-Pet for rescues.
   - State "best breeders" roundups that list websites and phones.
   - Use only emails published by the business, and log the source.
9. **Compliance:**
   - CAN-SPAM covers B2B email. Penalty is up to $53,088 per email; the guide's text is in the playbook.
   - FTC rules: partners must disclose that they earn a fee, on the counter card itself.
   - CCV registration states for any "% to charity" claim.
   - RESPA: a closing gift is fine; a reward for referrals is not.
   - CARD Act and state rules apply before we sell gift certificates.
   - AVMA conflict-of-interest principle for vets.
10. **90-day targets (Oct 14 to Jan 11):**
    - About 500 personalized B2B touches, at 10 per weekday.
    - 40+ active B2B partners by Dec 31, 50+ by mid-January.
    - B2B-attributed orders at 5–10% of orders by January.
    - Customer referral at 2–5% of orders by day 90.

---

## 1. Framework: lead getters, and what we already have

| Hormozi lead getter | What it means for us | Status | Recommendation |
|---|---|---|---|
| **Customer referrals** | Buyers and gift recipients bring friends | Planned in growth.md §7, not built | **Build now** (§4). The highest-leverage 2 engineering days left in Q4 |
| **Affiliates** | Creators paid per sale | Built: `partners`, `referral_events`, codes, `/partners`, gift tool | Keep (influencers.md). Extend the same machinery to B2B partners |
| **Partners (B2B)** | Businesses that already serve dog owners recommend or bundle us | Not started (except the shelter plan) | **Start this week** (§3) with groomers, breeders and rescues |
| **Employees** | People doing outreach for us | Solo founder | Later: a part-time VA for list building and first-touch sends, once the scripts convert (≥3 partners/week from founder sends) |
| **Agencies** | Outside firms selling for us | None | Later, and only for corporate gifting (gift-platform marketplaces). Verify their vendor terms before investing |

**What the codebase already gives partners** (verified in the repo; no code changed):
- **Per-partner terms.** `partners.commission_rate` and `partners.discount_percent` are per row. A breeder can be 10% commission with a 20% code while groomers stay at 15/15.
- **Tracked links.** `?ref=CODE` is recorded by `/api/ref`, which de-duplicates and filters bots. It sets a first-touch `pp_ref` cookie, currently 30 days; strategy says change it to 60.
- **Co-branded gifts with attribution.** `gifts.partner_id` plus `sender_name` let us send "A portrait of Bella, from your friends at Earth Pups". Opening the reveal sets `pp_ref` to that partner's code (`/api/gift-portrait`).
- **B2B partners need no schema change.** Store them as `platform = "other"` with `niche` set to one of `breeder`, `groomer`, `daycare`, `trainer`, `rescue`, `memorial`, `vet`, `boutique`, `realtor` or `corporate`.

---

## 2. Unit economics every partner deal must respect

These come from strategy §3.1. Costs are the Printful base price plus US shipping, Stripe (2.9% + $0.30) and $1.50 modeled AI cost.

| Item | Price | Product + ship | GM $ at full price | GM % |
|---|---|---|---|---|
| Fine Art Print 12×16 | $45 | $16.10 | $25.79 | 57% |
| Canvas 8×10 | $59 | $22.60 | $32.89 | 56% |
| Framed 12×16 (default framed) | $95 | $43.09 | $47.35 | 50% |
| **Canvas 16×20 (hero)** | **$99** | **$38.95** | **$55.38** | **56%** |
| Framed 24×36 | $199 | $107.09 | $84.34 | 42% |
| Digital file | $29 | $0 | $26.36 | 91% |

**Guardrails:**
- Break-even first-order CAC is about $55 at a $110 AOV.
- Blended contribution is about 50% before marketing.
- Promotions are capped at 20%.
- Codes never stack.
- Commission is paid on net and locks 30 days after delivery, which is the guarantee window.

### Reward cost per order, hero canvas ($99)

| Structure | Customer pays | Partner/referrer reward | Our GM after rewards | GM % of list |
|---|---|---|---|---|
| Full price, no partner | $99.00 | $0 | $55.38 | 56% |
| **Creator/community: 15% code + 15% commission** | $84.15 | $12.62 | $28.34 | 29% |
| **Breeder's Gift: 20% code + 10% commission** | $79.20 | $7.92 | $28.23 | 29% |
| Breeder's Gift at 15% commission (not recommended) | $79.20 | $11.88 | $24.27 | 25% |
| **Customer give-get: $15 off + $15 credit** | $84.00 | $15 credit, redeemed later | $40.81 now; −$15 when the credit is used | 41% / 26% |
| Crematory reseller: wholesale $65, partner sells at $99 | $65 to us | Partner keeps $34 | ~$24 | 37% of wholesale |
| Breeder-paid certificate ($15) put toward this canvas | $70 + $15 | – | ~$41.75 | 49% of $85 |

All of these leave **$24–41 contribution** on the hero order, inside the ~$55 break-even.

**Worst cases and how to block them:**
- **24×36 framed at 20% off plus 15% commission** leaves only about $22 (11% of list). At 10% commission it leaves about $30 (15%). Cap B2B commission at 10% whenever the code is 20%.
- **Poster 8×10 with $15 off** leaves about $5.60 GM. Set a **$59 minimum** for referral discounts.
- **AI cost.** Gifts made in admin cost about $0.08 per portrait (OpenAI at "high"; FIRST-SALE-RUNBOOK). Uploader galleries cost more (strategy: $3.60–6.00 per order). Partner-sent reveal links are the cheapest leads we have.

---

## 3. B2B partner channels

### Market sizes (US)

| Partner type | Count | Source and caveat |
|---|---|---|
| Dog-owning households (end customers) | **~71M** (53% of households) | APPA 2026 Dog Report from the 2025 survey, via [press release](https://www.webull.com/news/15271938404803584) and [Pet Worldwide](https://www.petworldwide.net/content-1/news/2026/07/30/free/appa-publishes-new-dog-report.html) |
| Dog breeders | **~138,500** active breeders subject to AKC inspection, including ~11,000 Breeders of Merit (Nov 2019); AKC breeders produce ~1.3M puppies/yr | AKC spokesperson via [The Canine Review](https://thecaninereview.com/?p=6840) and [Pure Dog Talk](https://puredogtalk.com/captivate-podcast/akc-dog-registration-trend-reversal/). Excludes non-AKC doodle breeders, a large and marketing-savvy segment |
| Pet grooming and boarding businesses | **~185,051** (2025) | [IBISWorld](https://img3.ibisworld.com/united-states/number-of-businesses/pet-grooming-boarding/1735). An older IBISWorld page says ~169K. Includes daycares and kennels |
| Dog trainers | **2,323** employer businesses (2025) | [IBISWorld](https://www.ibisworld.com/united-states/number-of-businesses/dog-training-services/6480/). A big undercount, since most trainers are solo. Use APDT/CCPDT directories for real reach |
| Veterinary establishments | **~34,296** (Census 2023, NAICS 541940); an older AVMA figure is 27,123 practices; ~30% corporate-owned | Via [Causo](https://hub.causo.ai/guides/veterinary-clinics-list-2026), [dvm360](https://www.dvm360.com/view/whos-your-team) and [PangoVet](https://info.pangovet.com/statistics/veterinarian-statistics). Target independents; corporate groups need head-office approval |
| Pet cremation | **357** cremation-only (2024) / **411** funeral and cremation (2024) | [IBISWorld 6364](https://www.ibisworld.com/united-states/industry/pet-cremation-services/6364/) and [6528](https://www.ibisworld.com/united-states/industry/pet-funeral-cremation-services/6528/). Undercounts: many pet crematories are divisions of human funeral homes (e.g. Faithful Companion, Starkson, Cline & Hanson in the CSV) or vet-owned |
| Shelters and rescues | **14,429** organizations (4,915 shelters + 9,514 rescues) | [Shelter Animals Count](https://shelteranimalscount.org/stats). Rescues are often home-based and breed-specific |
| Pet stores | **~13,483** (2025) | [IBISWorld](https://img3.ibisworld.com/united-states/number-of-businesses/pet-stores/1103). Includes chains; independents are the target |
| Realtors | **~1.44M** NAR members (June 2026) | [NAR](https://www.nar.realtor/news/real-estate-news/nar-membership-remains-above-forecast), [Real Estate News](https://www.realestatenews.com/2026/01/23/nar-report-touts-transparency-but-a-key-omission-remains) |
| Corporate gifting | $312B US (forecast for 2025) | [Coresight/GiftNow via Synchrony](https://investors.synchrony.com/news-events/financial-news/detail/37/rapidly-growing-corporate-gifting-market-estimated-to-reach-312-billion-by-2025-according-to-a-new-study-from-coresight-research-and-giftnow). A 2022 forecast, not a measured figure |

### Comparison and priority

| Channel | Why they say yes | Best model | Orders per active partner per month (assumption) | Sales cycle | Priority now |
|---|---|---|---|---|---|
| Groomers, daycares, trainers | Delight clients; free content; small fee | Referral 15/15 + counter QR + gift portraits | 1–3 (higher in Dec) | Days (walk-in) | **1** |
| Breeders | A premium touch in the go-home pack; marketing art of their dogs | Breeder's Gift (20% + 10%), or a prepaid certificate | 0.5–2 (litter-driven) | 1–2 weeks | **2** |
| Shelters and rescues | Free help that gets dogs adopted; content | Free adoption portraits + 15% adopter code; flat donations | 0.5–3 | Days | **3** (PR and content) |
| Crematories, memorial | They already sell memorial products; new margin line | Reseller (wholesale) or 15% commission | 1–5 | Weeks to months | 4 (January) |
| Vets | A thoughtful sympathy touch at low cost | Clinic-paid Sympathy Portrait; no commission by default | 0.5–2 | Months | 5 |
| Pet boutiques | Wall art that sells itself; no inventory | Consignment sample + QR, then wholesale certificates | 0.5–2 | Weeks | 6 (Q1) |
| Realtors, corporate | A memorable closing or holiday gift | Trade price; bulk invoice | Bursty | Days to weeks | Opportunistic |

---

### 3a. Dog breeders

**Why they would say yes**
- Breeders compete on the experience they give puppy families. Go-home packs ("puppy packs") are standard.
- Other brands already use breeders as a distribution channel at no cost to the breeder:
  - **Trupanion's Breeder Support Program** lets breeders give buyers a "Go Home Day" offer that waives waiting periods. Breeders are not paid for taking part ([Trupanion](https://www.trupanion.com/breeder/interested-rab)).
  - **Eukanuba's UK Breeders Club** supplies free puppy kits ([terms](https://eukanuba.eu/breeders-club/terms-conditions)).
- So **inclusion in the pack is a known, accepted behavior.** Our version is more emotional than an insurance leaflet: the family's own puppy as art.
- A breeder also gets marketing assets: portraits of their sire and dam for the website and Instagram.

**Offer and economics**

| Option | How it works | Breeder cost | Economics for us (hero canvas) | When to use |
|---|---|---|---|---|
| **A. The Breeder's Gift** (co-branded, default) | Insert card in every go-home pack: "Your puppy's first portrait, from [Kennel]. See it free. 20% off any piece, for 12 months." Unique code per kennel. Breeder earns **10%** of net, or chooses a flat donation to their breed rescue (our donation, decided in advance) | $0 (we print cards, ~$0.20 each) | 20% off + 10% commission → **$28.23 GM (29%)** | Most breeders. Easy yes |
| **B. Puppy Portrait Certificate** (breeder-paid) | Breeder buys prepaid certificates: **$15 each, packs of 10** (Stripe invoice). Each is worth $29 toward any piece, i.e. the digital portrait outright | $150 per 10 families | Digital redemption ~$13 GM; put toward a canvas ~$41.75 GM (49%). No breakage assumed | Premium breeders who want to "give" something tangible. **Needs the certificate feature and a legal check (§7)** |
| **C. Litter portraits for marketing** (sweetener) | We portrait the sire, dam or a litter photo for their site, with the credit "Portrait by Pup Prints" | $0 | ~$0.08 AI per image | Opener for A or B |

**Timing hook:** litters going home in late November and December become "Puppy's first Christmas" portraits in the Holiday Cozy style. Make the code valid for 12 months so "first birthday" and "gotcha day" orders count too.

**Finding contacts at scale**
- **AKC Marketplace:** Breeder of Merit and Bred with H.E.A.R.T. listings ([AKC](https://www.akc.org/expert-advice/lifestyle/9-tips-finding-working-responsible-breeder/)). Contact goes through the platform, so use it to find names, then the breeder's own website.
- **National breed club breeder directories,** often public PDFs or pages with websites and emails:
  - [Irish Setter Club of America regional directories](https://irishsetterclub.org/wp-content/uploads/2026/03/Breeder-Directory-2026-ONLINE-Reg-1.pdf)
  - [BMDCA breeder directory](https://www.bmdca.org/olbr-litters)
  - GRCA and LRC regional contacts
- **Doodle associations** (big gift buyers):
  - GANA (Goldendoodle Association of North America) blue-ribbon breeders.
  - The [ALAA member breeder search](https://breeders.alaa-labradoodles.com/guest/breedersearch.aspx). It warns that some non-members display its logo.
- **State roundups** that print websites and phones, e.g. [OodleLife CA](https://www.oodlelife.com/best-goldendoodle-breeders-in-california/), [TX](https://www.oodlelife.com/goldendoodle-breeders-in-texas/), [FL](https://www.oodlelife.com/goldendoodle-breeders-in-florida/) and [OH](https://www.oodlelife.com/golden-retriever-breeders-in-ohio/). Most breeders in the CSV came from these and were checked on their own sites where possible; the CSV notes say which fields came from the list.
- **Good Dog and PuppyFind:** platform messaging only, so use them to discover names.
- **Instagram:** search `#[breed]puppies`, `#goldendoodlebreeder`. Breeders answer DMs.

**Expected rates (assumption):** reply 12–25%; active (cards in packs) 5–10% of contacted.
- Basis: owner-operators who reply to buyers all day. Personalized subject lines and bodies lift replies about 30% ([Backlinko, 12M emails](https://backlinko.com/email-outreach-study)), and our sample is a portrait of their own dog.
- **Kill or keep test:** below 8% replies after 50 sends, switch the opener to Option C first.

**Watch-outs**
- Avoid puppy mills and high-volume brokers: brand risk with our rescue partners.
- Prefer health-testing breeders.
- Never imply we endorse the breeder.
- Don't use AKC or club logos.

---

### 3b. Groomers, doggy daycares, boarding and trainers

**Why they would say yes**
- They see the same dogs every 4–8 weeks and **already photograph freshly groomed dogs** for Instagram and client texts.
- A free portrait of the client's dog, sent "from" the salon, is a delight touch that costs them nothing and earns a referral fee.
- December is the holiday grooming rush, which makes "Holiday Portrait with every groom" timely.
- Strategy §8.3 already defines a "Community" tier (15% commission, 15% code, QR cards for local businesses), and growth.md §7 lists groomers, vets, walkers, trainers and daycares.

**Offer and economics**
- **Referral partner:** 15% client code + 15% commission, the same as creators.
  - Hero canvas → **$28.34 GM (29%)**.
  - Payout: monthly, PayPal or bank, after the 30-day lock.
- **Counter card + QR:** about 200 cards per salon (~$20) plus a small framed portrait of the salon's own dog. A 12×16 framed print costs us ~$45, so give it only after the partner has sent their first 10 links.
- **"Groomed Portrait Day":**
  1. The groomer forwards 10–30 after-photos a month.
  2. We batch them in Admin → Gifts with `sender_name = "[Salon]"`.
  3. The salon texts each client their reveal link.
  - Cost is about $0.08–0.36 per portrait.
  - If 5–10% buy (assumption, consistent with strategy's 6–12% upload→purchase planning and the gift-first loop in FIRST-SALE-RUNBOOK), 30 links make 1.5–3 orders a month.
  - All-in acquisition cost per order (discount + commission + AI) is about **$28–31**, versus $55 break-even.
- **Trainers:** a "graduation portrait" for puppy-class graduates. Same terms.
- **Daycares:** a "Pup of the Month" portrait on the lobby wall. Same terms.

**Finding contacts at scale**
- **Google Maps** categories "Pet groomer" and "Dog day care center" by ZIP.
- **Booking-platform pages** (MoeGo, Gingr) show which salons are independent.
- **Directories:**
  - NDGAA (acquired by Barkleigh in Dec 2022; check the directory's status ([Pets+](https://petsplusmag.com/barkleigh-acquires-national-dog-groomers-association-of-america/)))
  - IPG certified groomers (ipgicmg.com)
  - APDT trainer search and the CCPDT certificant directory
  - IBPSA for boarding and daycare
- **City "best groomers" roundups:** e.g. [Sploot Chicago](https://www.splootvets.com/post/dog-grooming-salons-chicago-il), [Sploot Denver](https://www.splootvets.com/post/dog-grooming-salons-denver-co).
- **Work in clusters.** One city at a time, so one walk-in afternoon covers 6–8 salons. The CSV has clusters in Chicago (6), Seattle (3), Denver (3), Austin (2) and Charlotte (2).

**Expected rates (assumption):** email reply 10–20%; with a walk-in plus a printed sample, 30–50% will talk; active 4–8% of contacted cold, 15–25% of walk-ins.

**Watch-outs**
- Chains (PetSmart, Petco, franchises such as Scenthound) need head-office approval. Skip them.
- The counter card must carry an FTC disclosure (§7).
- Never post client dogs without the client's OK.

---

### 3c. Veterinary clinics, pet crematoriums and memorial services

**Why they would say yes**

*Crematories:*
- They already sell keepsakes: urns, clay paw prints, glass, jewelry. See the CSV notes for Companah, Charm City, Forever Faithful and Loving Paws.
- Several partner with premium memorial brands. Loyal Companion, for example, is a [Parting Stone partner](https://find.partingstone.com/partner/734405).
- A memorial portrait is a new, high-margin line with no inventory.

*Vets:*
- Memorializing patients is standard practice. AAHA calls the sympathy card perhaps the most common memorial item ([AAHA](https://www.aaha.org/newstat/publications/memorializing-deceased-patients-an-opportunity-to-strengthen-the-bond/)).
- Clinics already pay for memorial programs: university vet-school pet memorial programs send condolence cards when a clinic donates. Ohio State lists 686 participating clinics ([OSU](https://buckeyefunder.osu.edu/project/18978); [MSU](https://cvm.msu.edu/vetschool-tails/clinic-pet-memorial-program)).
- So there is a **budget line and a habit** for sympathy gestures.

**Demand:** memorial is about 25–35% of category demand, all year (growth.md §2).

**Ethics first (non-negotiable)**
- We never contact grieving families directly. The partner offers our card, with the family's choice.
- No discount-led headline, no urgency, no expiry pressure, no humor.
  - Copy: "When you're ready, a portrait of [Name]. The preview is free."
  - Any courtesy discount sits in small print and is valid for 12 months.
- Memorial styles only: Watercolor, Old Master, Botanical, Charcoal, Fine Line.
- The reveal and email use the gentle memorial track (growth.md §5).
- Likeness checked by a person. Remake or refund, always.
- **Vets: no commission by default.**
  - The AVMA *Principles of Veterinary Medical Ethics* say decisions should rest on patient welfare and client needs, and conflicts of interest or their appearance should be avoided ([AVMA PVME](https://www.avma.org/policies/principles-veterinary-medical-ethics-avma)).
  - If a clinic wants a referral fee, the card must say so. Check the state board rules.

**Offer and economics**

| Partner | Model | Terms | Our GM |
|---|---|---|---|
| Crematory or aftercare (default) | **Reseller** | The partner sells the Memorial Portrait at our list price inside its packages. We invoice wholesale: Canvas 16×20 **$65** (partner keeps $34), Framed 12×16 **$65** (keeps $30), Digital **$15** (keeps $14). Stripe ACH or invoice | ~$24 / ~$20 / ~$13 per unit |
| Crematory (simpler start) | Referral | A card in the remains-return bag with QR; family code **10% courtesy**; partner earns **15%** commission | Canvas: ~$32 |
| Vet clinic | **Sympathy Portrait** (clinic-paid) | Clinic pays **$15 per family** (min 10, prepaid). Each family gets a reveal link "With sympathy from [Clinic]", a free digital memorial portrait, and an optional 10% courtesy on prints | ~$13 per digital, plus print upsell at near-full margin |
| Vet clinic (free option) | Card only | Card in the sympathy mailing; free preview; no fee to the clinic | Full margin on orders |
| In-home euthanasia networks (e.g. Lap of Love) | Network deal | Card in the keepsake packet; same as the crematory referral | – |

**Finding contacts at scale**
- [IAOPCC member directory](https://iaopc.com/). It blocks automated readers; browse by hand.
- The CANA pet cemetery member list (members.cremationassociation.org).
- [Parting Stone's partner finder](https://find.partingstone.com/partner/734405): crematories already buying premium memorial products.
- Funeral.com state guides; county resource PDFs (e.g. Franklin County OH).
- Each vet hospital's "aftercare" page names its crematory, which gives a warm intro.
- **Networks multiply reach:**
  - Faithful Companion: 14 offices in 9 states.
  - Pet Meadow: 13 locations.
  - Final Gift: 13 locations in 8 states.
  - Lap of Love: national.
  - All four are in the CSV.

**Expected rates (assumption):**
- Crematories: reply 6–12%; active 2–5%; sales cycle 2–8 weeks. **Must have a physical sample in hand.**
- Vets: reply 3–8%; active 1–3%. Best reached through the practice manager, and by a warm intro from a partner crematory.

**Timing:** start in **January**, after we have physical samples of each memorial style, real customer reviews and the memorial reveal mode. Holidays are hard for grieving families. A gentle "first holiday without them" ornament is fine, but only through partners who ask for it.

---

### 3d. Shelters and rescues

The playbook already exists: `marketing/channels/shelter-partnership.md`. It covers free portraits of adoptable dogs, the "pair image" with the real photo, the press release and no cause-marketing claims. This section adds the **adopter** side.

**Why they would say yes**
- Free, fast help that gets long-stay dogs seen.
- Content for their social channels.
- A feel-good "adoption day" moment for adopters.

**Offer and economics**
- **Adoption Portrait:**
  - Every adopter receives a reveal link "Welcome home, [Dog]. From your friends at [Rescue]".
  - It is made from the photo the rescue already has, via the gift tool with `partner_id` set. Cost is about $0.08 per adopter.
- **Adopter code:** 15% off for adopters, valid 12 months.
- **Money to the rescue, two compliant options:**
  1. **Flat donation we decide in advance,** announced after it is made, e.g. Giving Tuesday, Dec 1. This is the default, and it is how the existing plan works.
  2. **Affiliate referral fee** (15% of net) paid to the organization, with the rescue disclosing "we earn a referral fee". Never market it as "a portion of every sale goes to…".
     - Many states regulate those claims as commercial co-ventures.
     - Registration states commonly cited are **AL, CA, HI, IL, MA, MS, SC**. Lists differ, so verify ([Verrill](https://verrill-law.com/you-might-be-a-winner/what-you-need-to-know-about-commercial-co-ventures), [Perlman & Perlman chart](https://perlmanandperlman.com/ccv-registration-chart/)).
     - **Get a lawyer's OK before option 2.**
- **Economics:** most of the value is PR, content and goodwill. Adopter orders at 15% off with no commission leave about $41 GM on a canvas.

**Finding contacts at scale**
- Petfinder and Adopt-a-Pet organization pages. Shelter Animals Count built its own list from Adopt-a-Pet.
- Breed rescues: Golden, Lab and Beagle rescues are in the CSV, and they pair naturally with breed audiences.
- Senior-dog groups, via the [srdogs.com directory](https://srdogs.com/?p=30).
- The Best Friends network.
- For CSV row selection, small foster-based groups answer fastest.

**Expected rates (assumption):** reply 20–35%; active 10–20%. Free help with no catch is the easiest yes in this whole plan.

---

### 3e. Pet stores and boutiques

**Why they would say yes**
- A framed portrait of the shop's own dog on the wall sells itself.
- With consignment there is no inventory risk.
- Gift certificates are high-margin, small and giftable at the register in Q4.

**Offer and economics**
- **Phase 1 (now): consignment sample + QR.**
  - We supply a framed 12×16 of the shop dog (COGS ~$45) and a QR card stand.
  - The shop earns **15–20%** commission (20% only with a 10% code). Customers get a 15% code.
  - Payback on the sample takes about 2 orders.
- **Phase 2 (Q1): wholesale certificates.**
  - Physical cards at **40% off face** ($100 card → $60 to us). That is below the keystone margin retailers expect, but there is no inventory risk.
  - On a $99 canvas redemption we keep about $18–19 GM. Only worth it with volume.
  - **Blocked until gift cards exist** (FAQ says "coming soon") and the legal check in §7 is done.
- **Faire** (wholesale marketplace): 15% commission on marketplace orders and **0% on Faire Direct** orders from retailers we bring ourselves ([Faire help](https://www.faire.com/support/articles/360040446591)). Consider it once a physical product exists. Check whether Faire allows certificate-style products.

**Finding contacts:** Google Maps "pet supply store" (independents only), the Pet Age and PIDA member lists, and boutique Instagram accounts.

**Expected rates (assumption):** reply 8–15%; active 3–6%.

---

### 3f. Realtors (closing gifts) and corporate gifting

**Why they would say yes**
- Agents give closing gifts and look for ones clients keep.
- Typical budgets are 1–5% of commission, or about $50–300 depending on price point. These are rules of thumb, not survey data ([McKissock](https://www.mckissock.com/?p=78911), [AgentFire](https://agentfire.com/blog/creative-real-estate-closing-gifts/)).
- A portrait of the family's dog, revealed at the closing table and hung first in the new home, fits "See it now. Give it now. Hang it in days."

**Offer and economics**
- **Closing Portrait:**
  - Agents get **10% trade pricing**: framed 12×16 at $85.50 → **$38 GM (45%)**.
  - The instant Gift Reveal link is shown at closing, and the print ships to the new address.
  - Co-branded "From [Agent]".
- **Corporate:**
  - Bulk pricing: 10+ portraits at 10% off, 25+ at 15% off.
  - Invoice billing.
  - Use cases: employee "pet appreciation" gifts, client gifts from pet-industry companies, and digital Gift Reveals for remote teams.
- **Rules:**
  - RESPA allows a genuine closing gift to a client, but not a gift that rewards referrals ([RealTrends](https://www.realtrends.com/articles/consumer-incentives-are-generally-ok-under-respa/), [Alabama REALTORS](https://www.alabamarealtors.com/posts/2020/11/17/gifts-referral-fees-and-msas---respa-updates-and-more)).
  - IRS business-gift deductions are limited to $25 per recipient per year. That is the agent's tax question; we don't advise on it.

**Finding contacts:** brokerage rosters, agents' Instagram accounts that show pets, and pet-friendly-housing specialists. Corporate: HR and people-ops leads at dog-friendly companies.

**Expected rates (assumption):** reply 5–10%; first purchase 2–5%. December client-gift season, then the spring market.

---

## 4. Customer referral program for a personalized-gift brand

### What the evidence says

| Finding | Number | Source |
|---|---|---|
| Average share of a store's sales from referrals (6+ months running) | **2.35%**; software and digital goods 4.75%; best programs 20%+ | [ReferralCandy](https://referralcandy.com/blog/referral-rates) |
| Median referral conversion (friend visits → buys), 2025 | **3–5%**; top quartile 8%+ | [ReferralCandy 2025](https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025) |
| Healthy share rate (buyers who send their link) | **5–15%** | Same |
| Extole share rate (consumer products) | ~4.9% of people shown the referral offer | [Extole](https://docs.extole.com/docs/extole-dashboards-metrics) |
| Prompting right after a delight moment | 43% advocacy rate after prompting right after a 5-star review (Olipop, vendor case study) | [Talkable](https://get.talkable.com/case-studies/olipop) |
| Reward sizing guidance | Advocate 10–25% of AOV; friend at least 10%; use a fixed $ amount when AOV is over $100; ask right after purchase | [ReferralCandy](https://referralcandy.com/blog/referral-rates) |
| Referred customers are worth more | **At least 16% higher** customer value; better retention (bank study, ~10K customers) | [Schmitt, Skiera & Van den Bulte, *J. Marketing* 2011](https://faculty.wharton.upenn.edu/wp-content/uploads/2012/04/Schmitt-Skiera-vandenBulte-2011-Referral-Programs-Customer-Value.pdf) |
| Mature DTC programs' share of revenue | 5–10% median, 12–30% top quartile (consultancy estimate) | [Eightx](https://eightx.co/blog/average-ecommerce-referral-revenue-share-by-vertical-2026) |

**Category examples:**
- **Chatbooks** (photo books): give $10, get $10 ([help center](https://help.chatbooks.com/en/articles/8217310-how-can-i-refer-my-friends-to-chatbooks)).
- **Framebridge** (custom framing): friend gets 15% off, referrer gets $15 credit, no cap. This is per a coupon site, so verify ([Groupon](https://www.groupon.com/coupons/framebridge)).
- **Mint Mobile:** an example of asymmetric rewards with a cap ($45 to the advocate, $15 to the friend, 4 per year) ([terms](https://www.mintmobile.com/referral-terms/)).
- **Artifact Uprising:** runs a 10% affiliate program, not a customer give-get ([Affilimate](https://affilimate.com/programs/artifact-upraising-affiliate-program/)).
- **Crown & Paw:** we found no public refer-a-friend program. That is a gap we can own.

### Why personalized gifts are different

1. **The best referral is the gift itself.** Every Gift Reveal puts our art in front of a new household with a dog (growth.md §7). The recipient doesn't need a code to want one. They need a one-tap "Make one of your dog, free" and a reason to act now.
2. **Our buyer has already seen the final art before paying.** Competitors' customers wait 1–3 days for a proof. Our order confirmation page is a real moment of delight, with the actual portrait on screen. That is where the share prompt goes.
3. **Repeat purchase is occasion-driven:** holidays, birthdays, memorial, a second dog. A referral credit gives the advocate a reason to come back at the next occasion.

### Recommended design: "Give $15, get $15"

| Element | Decision | Why |
|---|---|---|
| Friend reward | **$15 off a first physical order of $59+** | ~15% of AOV, a fixed $ amount as guidance suggests for AOVs near $100; $59 minimum protects poster margin |
| Advocate reward | **$15 credit**, issued when the friend's order passes the 30-day guarantee window; stacks up to $60 per year | Blocks refund fraud; a credit brings the advocate back |
| Where it's shown | (1) **Order confirmation**, with the portrait on screen. (2) **Gift Reveal page**, for recipients: "Make one of [your dog], free". (3) **Delivered + 7 days** email ("Give $15, get $15"). (4) The review-request thank-you | Asking right after purchase converts best; the reveal is our viral loop |
| Share mechanics | Personal link plus code, e.g. `?ref=MAYA-7Q`; native share sheet; prefilled text with the portrait image | Mobile-first (Instagram and TikTok traffic) |
| Honest copy | Prefilled share text ends "(we both get $15)". The terms page states the reward | FTC: someone who earns something for recommending us has a material connection, and a short disclosure covers it |
| Rules | No stacking with sitewide events or partner codes (the better one wins); no self-referral (same email, card or address); credits are not cash; codes don't apply to the standalone ornament | Strategy §3.2 rules |
| Gift Reveal recipients | The recipient gets the friend reward too. The giver gets a quiet "thank-you" credit only if the recipient orders | Keeps gifting feeling like gifting, not marketing |
| Launch boost (dated, real) | **Through Dec 10:** $20 / $20 for the "Founding 100" customers | A dated event, not a fake permanent sale |

**Economics on the hero canvas:**
- The friend's order earns $40.81 GM after the $15 off.
- The advocate's $15 credit is only spent on a **new** order, which earns $40+ GM itself.
- Effective acquisition cost of a referred order is **$15–30**, versus about $55 break-even for paid. Referred customers are also worth about 16% more over time (Schmitt et al.).
- At 2–5% of orders, the program costs about 0.5–1.5% of revenue.

**Funding it honestly:** rewards come out of contribution margin, not price inflation. No compare-at prices and no fake "regular" price, ever (CLAUDE.md).

**Engineering asks.** I did not change any code.
1. Generate a referral code for every paying customer, either as a `partners` row with `niche = "customer"`, 0% commission and a credit ledger, or as a new `referrals` table.
2. Show the share block on order success and the Gift Reveal page.
3. Add a credit ledger and Stripe promotion codes for the friend reward.
4. Issue credits on day 30 after delivery.
5. Add fraud checks.
6. Extend `pp_ref` to 60 days.

---

## 5. 90-day plan (solo founder, about 90 minutes a day on partners)

| Week | Dates | Focus | Output |
|---|---|---|---|
| W1 | Oct 14–18 | Import the CSV into `/admin/partners` (platform `other`, niche set). Order 500 counter cards and 500 puppy-pack cards (generic QR to `/?ref=` per partner, printed on demand). Send the first 25 gift-first emails: rescues and groomers | 25 touches; 2–3 rescue yeses (shelter plan) |
| W2 | Oct 19–25 | Groomer cluster walk-ins (pick the founder's metro, or mail samples to the Chicago cluster). Start breeders (Breeder's Gift). Engineering: customer referral | 50 touches; first 3 groomer partners |
| W3–W4 | Oct 26–Nov 8 | 10 sends/day. "Holiday Portrait with every groom" offer from Nov 1. Breeders with Dec litters | 100 touches; 10 active partners |
| W5–W8 | Nov 9–Dec 6 | Keep the cadence. Partner newsletter #1 (one-pager on holiday cutoffs: order by Dec 10). Giving Tuesday Dec 1 donation | 200 touches; 30 active partners; partner share ≥5% of orders |
| W9–W10 | Dec 7–20 | Digital Gift Reveal push through partners after the print cutoffs (Dec 10 standard, Dec 15 express) | 40 active |
| W11–W13 | Dec 21–Jan 11 | Retro on reply and activation rates by category. Memorial partner prep (samples, memorial mode). Pet boutique and realtor pilots | 50 active; Q1 plan |

**Kill or keep rules:**
- After 50 sends in a category, if replies are below half the assumed low end, change the opener (sample first, then offer) or drop the category for Q4.
- A partner with no orders after 60 days and fewer than 10 links sent moves to `paused`. Send one friendly "anything we can make easier?" note first.

**KPIs, tracked in `/admin/partners` and `referral_events`:**
- Touches → replies → active (sent their first link or put cards out) → first attributed order.
- Orders per active partner per month.
- Reward cost per order.
- For customer referral: share rate, referral conversion and referral share of orders.

---

## 6. Expected reply and close rates (summary, all assumptions)

Baseline for cold outreach: an **8.5%** average reply rate across 12M emails. One follow-up lifts replies **65.8%**, personalization about **30%**, and emailing multiple contacts at one organization **93%** ([Backlinko](https://backlinko.com/email-outreach-study)).

| Channel | Reply rate | Active partner (of contacted) | Why |
|---|---|---|---|
| Rescues | 20–35% | 10–20% | Free help, no catch |
| Groomers, daycares (email) / walk-in | 10–20% / 30–50% talk | 4–8% / 15–25% | Local, visual, low effort to say yes |
| Breeders | 12–25% | 5–10% | Owner-operators; portrait of their own dog |
| Crematories | 6–12% | 2–5% | Vendor-cautious; need a physical sample |
| Vets | 3–8% | 1–3% | Gatekeepers; ~30% corporate-owned |
| Boutiques | 8–15% | 3–6% | Need a sample on the wall |
| Realtors | 5–10% | 2–5% (bought) | Many pitches; seasonal |

---

## 7. Compliance checklist

- **CAN-SPAM covers cold B2B email.** "The law makes no exception for business-to-business email." Requirements ([FTC guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)):
  - accurate From and headers;
  - a non-deceptive subject line;
  - identify the message as an ad;
  - include a valid physical postal address (a USPS-registered PO box or a registered private mailbox is acceptable);
  - give a clear opt-out and honor it within 10 business days;
  - keep the opt-out working for 30 days or more;
  - we stay responsible for anyone sending on our behalf.
  - Penalty: up to **$53,088 per email**.
  - The footer template and process are in the playbook. `BUSINESS_POSTAL_ADDRESS` must be set before any send.
- **FTC Endorsement Guides apply to businesses too.** A groomer, breeder or rescue that earns a fee or credit for recommending us has a material connection, and the card or post must say so ("[Salon] earns a referral fee"). Creator rules are unchanged (strategy §8).
- **Commercial co-ventures:** no "a portion of every purchase goes to [charity]" without registration in the states that require it (§3d). Flat, pre-decided donations are the default.
- **RESPA:** realtor closing gifts are fine. Paying a realtor for referring a *settlement service* is not, and we aren't one. Keep realtor terms to trade pricing, not referral fees tied to home sales.
- **Gift certificates and gift cards:**
  - The federal CARD Act and Regulation E generally bar gift card expiry within 5 years and limit dormancy fees.
  - Some states (e.g. CA) restrict expiry further, and unclaimed-property laws can apply to unredeemed balances.
  - Promotional cards given away free have different rules.
  - **Lawyer check before selling the Puppy Portrait Certificate, Sympathy Portrait or wholesale cards.** Until then, use prepaid single-use codes sold as *services for a named family* (digital portrait delivered on demand), not stored value.
- **Vets:** the AVMA principle on conflicts of interest applies. Default to no fees, or disclosed fees.
- **Texting and calls:** no automated or bulk marketing texts to numbers that may be mobile (TCPA and state mini-TCPA laws). Email or DM first; call by hand.
- **Taxes and payouts:**
  - W-9 from every paid partner; 1099-NEC above the 2026 threshold (strategy: $2,000).
  - Resale certificates for wholesale partners in states where they apply.
- **Brand and trademark:** don't use AKC, club or competitor marks in partner materials. Don't claim endorsements.

---

## 8. Engineering asks (for the integration owner; not done here)

1. Customer referral: codes, share UI, credit ledger, day-30 issuing (§4).
2. A QR code (SVG/PNG) for each partner's `?ref=` link on `/admin/partners/[id]`, so cards can be printed.
3. A batch gift tool: upload N photos, get N reveal links with `sender_name` set to the partner (for Groomed Portrait Day and adoption portraits).
4. Memorial mode on the reveal and in emails (strategy's memorial toggle), required before memorial partners go live.
5. Prepaid "certificate" codes plus Stripe Invoicing for breeder, vet and corporate prepaid orders, after legal review.
6. `pp_ref` attribution from 30 to 60 days (strategy §7).
7. Admin filter by `niche`, plus a partner-type report (B2B vs creator vs customer).

---

## 9. Sources

- Hormozi, A. *$100M Leads* (2023): the four lead getters (customer referrals, employees, agencies, affiliates).
- APPA dog ownership: https://www.webull.com/news/15271938404803584 ; https://www.petworldwide.net/content-1/news/2026/07/30/free/appa-publishes-new-dog-report.html
- AKC breeder counts: https://thecaninereview.com/?p=6840 ; https://puredogtalk.com/captivate-podcast/akc-dog-registration-trend-reversal/
- IBISWorld:
  - grooming & boarding: https://img3.ibisworld.com/united-states/number-of-businesses/pet-grooming-boarding/1735
  - pet stores: https://img3.ibisworld.com/united-states/number-of-businesses/pet-stores/1103
  - dog training: https://www.ibisworld.com/united-states/number-of-businesses/dog-training-services/6480/
  - pet cremation: https://www.ibisworld.com/united-states/industry/pet-cremation-services/6364/
  - pet funeral & cremation: https://www.ibisworld.com/united-states/industry/pet-funeral-cremation-services/6528/
- Vets: https://hub.causo.ai/guides/veterinary-clinics-list-2026 ; https://www.dvm360.com/view/whos-your-team ; https://info.pangovet.com/statistics/veterinarian-statistics
- Shelter Animals Count: https://shelteranimalscount.org/stats
- NAR membership: https://www.nar.realtor/news/real-estate-news/nar-membership-remains-above-forecast
- Corporate gifting: https://investors.synchrony.com/news-events/financial-news/detail/37/rapidly-growing-corporate-gifting-market-estimated-to-reach-312-billion-by-2025-according-to-a-new-study-from-coresight-research-and-giftnow
- Breeder programs: https://www.trupanion.com/breeder/interested-rab ; https://eukanuba.eu/breeders-club/terms-conditions
- Directories:
  - https://irishsetterclub.org/wp-content/uploads/2026/03/Breeder-Directory-2026-ONLINE-Reg-1.pdf
  - https://www.bmdca.org/olbr-litters
  - https://breeders.alaa-labradoodles.com/guest/breedersearch.aspx
  - https://iaopc.com/
  - https://find.partingstone.com/partner/734405
  - https://petsplusmag.com/barkleigh-acquires-national-dog-groomers-association-of-america/
  - https://www.oodlelife.com/best-goldendoodle-breeders-in-california/
  - https://www.splootvets.com/post/dog-grooming-salons-chicago-il
- Vet memorial practice: https://www.aaha.org/newstat/publications/memorializing-deceased-patients-an-opportunity-to-strengthen-the-bond/ ; https://buckeyefunder.osu.edu/project/18978 ; https://cvm.msu.edu/vetschool-tails/clinic-pet-memorial-program ; AVMA PVME https://www.avma.org/policies/principles-veterinary-medical-ethics-avma
- Referral benchmarks:
  - https://referralcandy.com/blog/referral-rates
  - https://www.referralcandy.com/blog/referral-program-benchmarks-whats-a-good-conversion-rate-in-2025
  - https://docs.extole.com/docs/extole-dashboards-metrics
  - https://get.talkable.com/case-studies/olipop
  - https://eightx.co/blog/average-ecommerce-referral-revenue-share-by-vertical-2026
  - Schmitt et al. 2011: https://faculty.wharton.upenn.edu/wp-content/uploads/2012/04/Schmitt-Skiera-vandenBulte-2011-Referral-Programs-Customer-Value.pdf
- Referral examples:
  - https://help.chatbooks.com/en/articles/8217310-how-can-i-refer-my-friends-to-chatbooks
  - https://www.groupon.com/coupons/framebridge
  - https://www.mintmobile.com/referral-terms/
  - https://affilimate.com/programs/artifact-upraising-affiliate-program/
- Cold email benchmark: https://backlinko.com/email-outreach-study
- CAN-SPAM: https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- Commercial co-ventures: https://verrill-law.com/you-might-be-a-winner/what-you-need-to-know-about-commercial-co-ventures ; https://perlmanandperlman.com/ccv-registration-chart/
- RESPA and closing gifts: https://www.realtrends.com/articles/consumer-incentives-are-generally-ok-under-respa/ ; https://www.alabamarealtors.com/posts/2020/11/17/gifts-referral-fees-and-msas---respa-updates-and-more ; https://www.mckissock.com/?p=78911 ; https://agentfire.com/blog/creative-real-estate-closing-gifts/
- Faire fees: https://www.faire.com/support/articles/360040446591
