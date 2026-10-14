# Pup Prints × Hormozi: the frameworks, sourced, and applied

*Prepared Oct 14, 2026. Scope: Alex Hormozi's three "$100M" books ($100M Offers, $100M Leads, $100M Money Models) and the "$100M Lost Chapters" audiobook, applied to Pup Prints. Prices and margins come from `web/src/lib/catalog.ts`, `web/src/lib/offer.ts`, `docs/research/fulfillment.md` and `docs/strategy.md`. The honesty rules in `CLAUDE.md` override Hormozi wherever the two conflict. Section 2 lists every such conflict.*

**How to read this.** Part A is framework notes with sources. Part B applies them, with numbers. Every figure labeled "assumption" is a planning input, not data. We have no sales history yet.

---

## 0. Summary

1. **Our free preview is a textbook Hormozi lead magnet**: a "complete solution to a narrow problem" (what would my dog look like as art?) that reveals the next problem (I want it on the wall / as a gift), which the core offer solves. Each preview costs ~$0.08, so ~$0.40 per uploader.
2. **The money model, in one line:** free preview → core piece on an anchor ladder → checkout bumps → a one-click post-purchase add-on (card on file) → a feature downsell for anyone who says no → annual holiday continuity. Modeled with conservative take rates, this gives **~$54 of 30-day gross profit per buyer** on ~$102 of revenue. During the Founding 100 window (15% off) it is **~$40**.
3. **Client-financed acquisition (CFA)** means 30-day gross profit ≥ CAC. Hormozi's "real life minimum standard" is **2×**. For us that caps CAC at **≤$54 for CFA** and **≤$27 for 2×**. Cold paid social realistically lands at $37–84. **Paid ads alone reach CFA, not 2×.** The 2× has to come from lead getters: commission-only creators and partners, customer referrals and gift-first seeding.
4. **The real lever is CAC, not more SKUs.** Every GP lever we can find together lifts 30-day GP only to ~$66. That makes the 2× ceiling ~$33. Hitting it requires that a large share of orders comes from channels we pay only on results.
5. **The three Grand Slam Offers:**
   - **The Gift** ("The Same-Day Gift Reveal") for gift buyers.
   - **The Remembrance Portrait** for memorials. No urgency, no upsell pressure.
   - **The Statement Portrait**, with a Triptych anchor, for dog moms buying for themselves.
6. **Guarantees:**
   - Keep the unconditional **Love-It Guarantee**.
   - Stack a **likeness service guarantee** ("we don't print until it looks like them").
   - Consider a conditional **Holiday Arrival Promise**, which attacks Crown & Paw's #1 complaint cluster (late Christmas deliveries).
   - Reject anti-guarantees and any "remove the guarantee" downsell.
7. **Honest scarcity and urgency only:**
   - the Founding 100 cap and deadline;
   - real order-by dates;
   - bonus-based urgency in place of discounts ("buy two, get two matching ornaments free", Nov 1–Dec 10);
   - dated limited-edition styles;
   - announced price increases.
   No countdown timers, no fake stock, no invented values.
8. **Correction to the brief:** "free goodwill" is **not** a Money Models attraction offer. In the book, "Free Goodwill" is the page that asks readers for a review. The five attraction offers are Win Your Money Back, Giveaways, Decoy, Buy X Get Y Free, and Pay Less Now or Pay More Later.
9. **Rule of 100 without warm outreach (Oct 15 → Jan 22, 2027):**
   - 100 cold reach-outs a day, mostly email to pet businesses plus 20–30 gift-first creator DMs;
   - 100 minutes of content a day;
   - 100 minutes of ad creative work a day. Move to $100/day of spend only once a 7-day paid CAC is at or below 30-day GP.
10. **Hormozi tactics we refuse**, because they conflict with our rules or with US law:
    - raising base prices to fund "free" items (FTC Free Guide);
    - inflated bonus values;
    - incentives for reviews (FTC 16 CFR 465 and Google policy);
    - negative-option "pay later" billing;
    - trials with penalties.

---

## 1. Unit economics we apply the frameworks to

GP below = price − Printful base − US shipping − Stripe (2.9% + $0.30). **AI preview cost is left out of GP on purpose**, because Hormozi treats the lead magnet's cost as part of acquisition. It sits in CAC as ~$0.40 per uploader (assumption: ~5 previews at ~$0.08). Source rows: `docs/research/fulfillment.md`.

| SKU | Price | COGS + ship | GP $ | GP % |
|---|---|---|---|---|
| Canvas 8×10 | $59 | $22.60 | $34.39 | 58% |
| Canvas 12×16 | $79 | $33.80 | $42.61 | 54% |
| **Canvas 16×20 (hero)** | **$99** | $38.95 | **$56.88** | **57%** |
| Canvas 18×24 | $115 | $44.05 | $67.31 | 59% |
| Canvas 24×36 | $149 | $62.41 | $81.97 | 55% |
| Framed 8×10 | $75 | $31.65 | $40.87 | 54% |
| Framed 12×16 (gift default) | $95 | $43.09 | $48.85 | 51% |
| Framed 16×20 | $119 | $57.10 | $58.15 | 49% |
| Framed 24×36 | $199 | $107.09 | $85.84 | 43% |
| Print 8×10 / 12×16 | $35 / $45 | $12.02 / $16.10 | $21.66 / $27.29 | 62% / 61% |
| Digital file | $29 | – | $27.86 | 96% |
| Ornament bump | $19 | $8.43 best case | $10.02 ($4.83 if it ships separately) | 53% |
| Mug bump | $25 | $9.57 best case | $14.71 | 59% |
| Heirloom Set (ornament + mug, −$10) | $34 | $18.00 | $15.01 | 44% |
| Hero canvas with FOUNDING100 (15% off) | $84.15 | $38.95 | $42.46 | 50% |

---

## 2. The honesty filter: Hormozi as written vs Pup Prints

Hormozi says honesty is "the easiest scarcity strategy." He also writes that inflated bonus values "destroy trust" ([Offers pt 5](#s-offers5), [Money Models pt 7](#s-mm7)). Most of his playbook survives our rules. These parts do not:

| Hormozi tactic | Why we change it | Pup Prints version |
|---|---|---|
| Buy X Get Y Free: "raise your base prices permanently" so the free items don't erode profit ([MM pt 4](#s-mm4)) | The FTC Guide on "Free" (16 CFR 251.1) treats a "free" item as deceptive if the price of the required purchase was raised to cover it. It also limits a "free" offer to 6 months in any 12 ([LII](#s-ftcfree)). | Keep list prices fixed and fund the free item from margin. Run it seasonally (Nov 1–Dec 10). |
| Assign a dollar value to every bonus ([Offers pt 6](#s-offers6)) | `CLAUDE.md` and `offer.ts`: no invented "worth $X" | Use a real price only for things we sell separately (file $29, ornament $19, mug $25). Everything else reads "Included". |
| Giveaway prize "stated value" as an anchor ($5,000 value for $1,800) ([MM pt 3](#s-mm3)) | Fake value anchors | The prize is a real catalog item at its real price ($199 framed 24×36). |
| Win Your Money Back with criteria such as posting, tagging or **reviewing** ([MM pt 3](#s-mm3)) | The FTC Consumer Review Rule (16 CFR 465, effective Oct 21, 2024) bans review incentives tied to sentiment ([FTC](#s-ftcreview)). Google bans *any* incentive for reviews ([Google](#s-google)). Rewarded posts are endorsements that need disclosure. | Never reward reviews. A credit for a *reaction video sent to us* is allowed only with permission and a disclosure label if we publish it (§B6.1). |
| Pay Less Now or Pay More Later: $0 today, card on file, billed later unless the customer cancels ([MM pt 4](#s-mm4)) | Custom physical goods are printed on day 0, so there is nothing to "cancel". Negative-option billing also runs into state auto-renewal laws (§B8.4). | Not used. The free preview already does this job: the customer sees the product before paying. |
| Trial with penalty ([MM pt 6](#s-mm6)) | No ongoing compliance behavior to attach a penalty to | Not used. |
| Feature downsell by **removing the guarantee** ([MM pt 6](#s-mm6)) | The guarantee is a brand promise on every order | Not used. Downsell by size, material and format instead. |
| Anti-guarantee ("all sales final") ([Offers pt 6](#s-offers6)) | It is the competitor's policy and our wedge against it | Not used. |
| Scarcity counters, "X left" | Our rule: only real counts, no countdown timers | Show the real Founding count from Stripe only (`OfferStatus.remaining`), and real dates, not timers. |
| Discount the same item to close a "no" (WELCOME10) | **Hormozi agrees with us here:** "Offer different things for less, never the same thing for less" ([MM pt 6](#s-mm6)) | A/B test a bonus (a free ornament for 48 hours) against the 10% code in nurture step 3. |

---

# Part A: The frameworks (sourced notes)

**Source quality.**
- Primary sources are the free audiobook releases on Hormozi's podcast *The Game*, read through podscripts.co transcripts, plus the publisher's description.
- The transcripts are machine-made, and I read them through a summarizing fetch tool. Quotes are close to verbatim; spot-check against the books before reusing them in public copy.
- Third-party summaries are marked "(secondary)". The web search quota ran out before two operational facts could be checked: Printful's charge timing and Stripe's payout schedule. Both are flagged where they are used.

## A1. $100M Offers (2021)

### A1.1 Value equation
**Value = (Dream Outcome × Perceived Likelihood of Achievement) ÷ (Time Delay × Effort & Sacrifice)** ([Offers pt 3](#s-offers3)).

| Driver | Direction | Hormozi's notes |
|---|---|---|
| Dream outcome | ↑ | Tie it to status. "Frame benefits in terms of status gained from the viewpoint of others." |
| Perceived likelihood | ↑ | People pay for certainty: proof, track record, guarantees. A surgeon's 10,000th patient pays more than the first. |
| Time delay | ↓ | "A big emotional win early, as close as possible to their purchase." Always build in short-term wins. "The only thing that beats free is fast." |
| Effort & sacrifice | ↓ | Done-for-you beats DIY. Remove friction (Apple, Amazon, Netflix). |

He adds that as the denominator approaches zero, value approaches infinity ("If you can make the bottom part… zero, you are golden").

### A1.2 Market and pricing
- **The commodity problem:** "If all products are equal, then the cheapest one is the most valuable by default." The fix is an offer that can't be compared, sold "in a category of one" ([Offers pt 2](#s-offers2)).
- **A starving crowd.** Four tests: massive **pain**, **purchasing power**, **easy to target**, and **growing**. Starving crowd > offer strength > persuasion skill. "The pain is the pitch."
- **Charge what it's worth.** Aim for a large price-to-value gap, raising value first. "There's no strategic benefit to being the second cheapest in the marketplace." Price cuts are "a one-way road to destruction for most."
- **Virtuous cycle of price.** A higher price brings more invested buyers, better results and more margin. That margin funds better delivery, which brings better results. Low prices run the same loop downward.
- **Charge far above fulfillment cost** ("up to a hundred times more"), but "never charge more than your product is worth" ([Offers pt 3](#s-offers3)).

### A1.3 Grand Slam Offer construction ([Offers pt 4](#s-offers4))
1. **Identify the dream outcome**, with a timeframe. The offer is the destination, not the vehicle.
2. **List every problem**, step by step, from just before to just after using the offer, "in insane detail". Sort each one under the four value drivers.
3. **Turn each problem into a solution** phrased as "How to…". Example: "healthy food is expensive" becomes "how to buy healthy food for less than your current grocery bill".
4. **Create delivery vehicles**, the "how", along these axes:
   - personal attention: 1:1, small group or 1:many;
   - effort: DIY, done-with-you or done-for-you;
   - medium: in person, phone, chat, email;
   - format: audio, video or written;
   - response speed and hours;
   - the **10× / 1/10th test**: what would you deliver at 10× the price, and at a tenth of it?
5. **Trim and stack.** Cut high-cost/low-value items first, then low/low. Keep low-cost/high-value and high-cost/high-value. Favor one-to-many assets with near-zero marginal cost. Bundle the rest and state the total value.

### A1.4 Enhancing the offer
**Scarcity** ([Offers pt 5](#s-offers5)):
- **Limited supply of seats:**
  - a total business cap with a waitlist;
  - a **growth-rate cap** ("X new clients a week", stating how many openings remain);
  - a cohort cap.
- **Limited bonuses.**
- **Never available again:** limited releases, flavors or batches. "Sell out consistently."
- Free lead magnets can be capped per week.
- Honesty: "The easiest scarcity strategy is honesty." Announce when you're sold out. Fake scarcity is unethical and costs money long-term.

**Urgency** ([Offers pt 5](#s-offers5)):
- **Rolling cohorts.**
- **Rolling seasonal urgency:** a promotion named for the season, with a real end date.
- **Pricing-based urgency:** a time-limited discount.
- **Bonus-based urgency:** a time-limited extra.
- **Exploding opportunity.**
- "Deadlines drive decisions." "Never raise your prices without letting people know."

**Bonuses** ([Offers pt 6](#s-offers6)):
- "Add bonuses instead of discounting whenever possible."
- Each bonus answers a specific objection (or the next problem), carries a benefit-led name and comes with proof.
- Prefer tools and checklists to more training.
- The total bonus value should exceed the core price.
- Bonuses can carry scarcity or urgency, and can come from partner businesses.

**Guarantees** ([Offers pt 6](#s-offers6)):
- "Reversing risk is the number one way to increase conversion."
- **Unconditional:** full refund, partial refund, refund plus extra ("better than money back"), or satisfaction-based.
- **Conditional:** tied to customer actions or outcomes. Named sub-types:
  - **outsized refund** (2–3× back);
  - **service guarantee** (we keep working free until the result);
  - **modified service** (≥2× more time);
  - **credit-based** (refund as credit toward another service);
  - **personal service**;
  - **hotel + airfare**;
  - **wage payment**;
  - **release of service**;
  - **delayed second payment**;
  - **first-outcome**.
- **Anti-guarantee:** all sales final, with a compelling reason. Suits consumables and high-ticket custom work.
- **Implied:** performance pay, i.e. per-sale fees, revenue or profit share, **ratchets**, **bonuses/triggers**. He calls these "one of, if not the most desirable setups."
- **Stacking:** e.g. a 30-day unconditional plus a 90-day conditional, or sequential conditional guarantees.
- **Refund math:** 100 sales at 5% refunds = 95 net. 130 sales at 10% refunds = 117 net. "Don't be emotional. Just do the math."
- **Naming:** avoid "vanilla" words like "satisfaction"; name the guarantee vividly.

**Naming: the MAGIC formula** ([Offers pt 7](#s-offers7), [Ep 562](#s-magic)):
- **M**ake a magnetic reason why: free, discount, season, occasion.
- **A**nnounce your avatar.
- **G**ive them a goal.
- **I**ndicate a time interval. Check platform rules on time-bound claims.
- **C**omplete with a container word: challenge, blueprint, system, sprint, kickoff, bundle.

Use 3–5 components, "as short as possible, but no shorter". Rhyme "counts for two". Test names against a control. When an offer fatigues, change the **wrapper** in this order: creative → body copy → headline/name → duration → enhancer → whole monetization.

## A2. $100M Leads (2023)

### A2.1 Leads and lead magnets ([Leads pt 2](#s-leads2))
- A **lead** is someone you can contact. An **engaged lead** has shown interest in what you sell.
- **"A lead magnet is a complete solution to a narrow problem."** Solving it should reveal a related problem that the core offer solves.
- **Three types:**
  1. reveal their problem (a diagnostic);
  2. samples and trials;
  3. one step of a multi-step process.
- **Four delivery vehicles:** software, information, services, physical products.
- **Seven steps:**
  1. Pick the narrow problem and the person.
  2. Pick the type.
  3. Pick the delivery.
  4. Name it (headline first).
  5. Make it easy to consume.
  6. Make it so good "people feel stupid saying no". "Give away the secrets, sell the implementation."
  7. Make it easy to tell you they want more, with one clear CTA. "Don't be clever, be clear."
- The CTA's reason to act: honest scarcity, real urgency, or "any reason".
- Economics: a better magnet lowers total CAC even when it costs more to deliver. His example has $25 per magnet cutting acquisition cost by about two-thirds.

### A2.2 The Core Four ([Leads pt 3](#s-leads3))
Two axes, **warm/cold** × **one-to-one/one-to-many**, give four methods:

| | One-to-one | One-to-many |
|---|---|---|
| **Warm** | Warm outreach | Posting free content |
| **Cold** | Cold outreach | Paid ads |

Warm benchmark: 100 warm reach-outs → ~20 replies → ~1 in 5 of those take the free offer. Follow up up to 3 times. *(Our founder excludes warm outreach. See §B12.)*

### A2.3 Free content: hook, retain, reward ([Leads pt 4](#s-leads4))
- A **content unit** is "the smallest amount of material it takes to hook, retain, and reward attention."
- **Hook:**
  - **Topics:** far past, recent past, present, trending, manufactured.
  - **Headlines:** use ≥2 of recency, relevancy, celebrity, proximity, conflict, unusualness, ongoing story.
  - **Format:** native to the platform.
- **Retain:** open loops through **lists, steps, stories**.
- **Reward:** pay off the hook. Judge by value per second.
- **Give vs ask:**
  - Hormozi cites TV at ~3.5:1 and Facebook at ~4 organic posts per ad.
  - Gary Vaynerchuk's "jab, jab, jab, right hook" is cited as the simplified version.
  - His own rule: **"Give until they ask"** and **"Give in public, ask in private."**
  - Asks come two ways: **integrated** (a CTA inside the content) or **intermittent** (an occasional pure ask). Promote either the core offer or a lead magnet; the magnet is safer.
  - Use P.S. lines, and one CTA at a time.
- **Lessons:**
  - "How I" beats "how to".
  - Repetition beats novelty.
  - Go from puddles to oceans.
  - "No such thing as too long, only too boring."
  - Make content for strangers.

### A2.4 Rule of 100, and More / Better / New ([Leads pt 7](#s-leads7), [Ep 248](#s-r100))
- **Rule of 100: do 100 primary actions every day for 100 days.** Examples: 100 reach-outs, 100 minutes of content, or 100 minutes of ad work / $100 a day in ads.
- "Volume begets skill." "You can add zeros, you can remove zeros." The Ep 248 version says 90 days.
- **More:** max out volume first. The top advertisers test ~11× more creative, so "more ads means better ads means more leads."
- **Better:**
  - Fix the biggest drop-off (the constraint).
  - Run **one test per week per platform** and log every result.
  - Stop if you can't beat the control "in four tries or one month."
- **New**, only when more and better plateau, in this order: new placement on a known platform → known placement on a new platform → a new Core Four activity.
- Under ~$1M profit the order is more → better → new. Above it, better → more → new.

### A2.5 Lead getters ([Leads pt 8](#s-leads8), [pt 10](#s-leads10))
- **Four types:** customers (referrals), employees, agencies, affiliates and partners. The highest leverage is lead getters who recruit other lead getters.
- **Referral math:** referral % − churn % = compounding growth. If each customer brings two more, CAC as a share of LTGP falls from 25% to ~8.3% in his example.
- **Give more value first:**
  - set lower expectations, then exceed them;
  - require what top customers did, and attach the guarantee to it;
  - create more frequent small wins;
  - always tell customers what to buy next.
- **Seven ways to ask for referrals:**
  1. one-sided reward (pay the referrer ~CAC);
  2. **two-sided** (split CAC between the two);
  3. **ask at purchase**, "not if, but who";
  4. a negotiation chip;
  5. **referral events** of 1–4 weeks;
  6. an ongoing mention in all content;
  7. **unlockable bonuses**.
- "Asking for referrals only works when you treat it like an offer." He reports that asking at signup added 25–30% more signups (his businesses).
- **Affiliates, in six steps:**
  1. **Find** businesses with warm audiences of your buyers, grouped as software, products, equipment, services, groups, events.
  2. **Offer** "a fast, simple, and easy way to make commissions."
  3. **Qualify** by making them a customer or an expert.
  4. **Pay** from max allowable CAC, in tiers of ~25% / 50% / 100% of CAC as they sign up, activate and sustain. Pay with product where possible.
  5. **Launch** with "Whisper, Tease, Shout."
  6. **Integrate**, easiest first: they give away your lead magnet → they sell your magnet → they sell your core offer.
- Benchmark: LTGP:CAC ≥ 3:1, ideally 5–10:1+.

## A3. $100M Money Models (Aug 2025) and the Lost Chapters (Nov 2025)

### A3.1 Definition, stages, build order
- "A Money Model is a deliberate sequence of offers. It's what you offer, when you offer, and how you offer it to make as much money as you can as fast as you can. **Ideally, to make enough money from one customer to get and service at least two more customers in less than thirty days**" (publisher description, [Audible](#s-audible)).
- **Stage I, Get Cash:** attraction offers. **Stage II, Get More Cash:** upsells and downsells. **Stage III, Get the Most Cash:** continuity.
- **Build order** ([MM pt 8](#s-mm8)):
  1. Get customers reliably.
  2. Each customer pays for their own acquisition and delivery.
  3. Each customer pays for others' acquisition.
  4. Maximize lifetime value.
  5. Spend more on ads.
- **Rules:**
  - Perfect one offer at a time.
  - Measure in quarters.
  - Start cheaper and raise prices as the yeses come.
  - Scale through "more ways to sell the same product", not more products.
- Doubling customer value, conversion speed and lead volume gives 2 × 2 × 2 = **8×** the growth ([MM pt 2](#s-mm2)).
- His physical-goods example (dog food, [MM pt 8](#s-mm8)):
  - attraction: buy 4 months, get 2 free;
  - upsell: monthly delivery, toys, vitamins;
  - downsell: food only;
  - continuity: auto-renew after the bulk buy.

### A3.2 Client-financed acquisition (CFA) ([Lost Chapters §7](#s-lc7), [§8](#s-lc8))
- **Definition:** "Customer financed acquisition or CFA is when 30 days of GP [gross profit] from a customer is greater than CAC."
- **His standard:** "What if every customer injects enough cash in the first 30 days to pay for two new customers?" He calls **2×** his "real life minimum standard."
- The book's ideal, "get **and service** at least two more", is stricter still. Secondary summaries render it as 30-day GP > 2 × (CAC + COGS).
- **Three levers:** lower **CAC**, raise **LTGP**, and shorten the **payback period** (PPD).
- Rationale: "If customers pay you fast enough, you can eliminate cash as a bottleneck to grow." "You only have to buy your first customer."

### A3.3 Attraction offers (the five) ([MM pt 3](#s-mm3), [pt 4](#s-mm4))
"Free and discount work interchangeably." Free is "the greatest discount of all."

| Offer | Mechanics and rules (Hormozi) |
|---|---|
| **Win Your Money Back** | The customer pays up front and earns it back (cash or store credit) by hitting a result and/or completing actions. Criteria should be trackable and ideally advertise the business. ~10% claim it. Use only if refunds are <5%. Pay out as credit toward a longer offer. |
| **Giveaways** | A grand prize collects leads. Everyone else gets a discount worth ~10–30% of gross margin. Run 3–7 days with urgency at entry, claim and use. Referral variant: if a referred friend wins, the referrer wins too. Heavily regulated, so get legal advice. |
| **Decoy offer** | Advertise a stripped-down free or cheap version, then present the premium version beside it. "The bigger the contrast, the better the deal." Ask: "are you here for free stuff or lasting results?" Surprise decoy buyers with small premium extras: it "builds goodwill… increases the chances they take your upsells later." |
| **Buy X Get Y Free** | Frame the discount as free items. Give more free than paid items; cheaper free items can beat one expensive one. (His "raise base prices" step is rejected in §2.) |
| **Pay Less Now or Pay More Later** | $0 now with a card on file and full price later, or pay now at 20–50% off plus bonuses. Conditional on qualifying actions. If >10% of pay-later customers cancel, fix the promise. |

**About "free goodwill":** the "Free Goodwill" section of the audiobook is a request for book reviews ("He who said money can't buy happiness hasn't given enough away"). It is not an offer type ([MM pt 4](#s-mm4)).

### A3.4 Upsells ([MM pt 5](#s-mm5))
"Often, upsells make the majority of the profit." "Offer as many solutions as there are problems you can solve." "The worst thing is if they would have said yes, but you never asked."
- **Classic:** "You can't have X without Y." Offer it the moment the next problem appears. Use the phrasing "You don't want…, do you?" Put the higher-profit option first.
- **Menu:**
  - **unsell** (say what they don't need);
  - **prescribe** (exactly what they do need);
  - **A/B** (which one, not whether);
  - **card on file** (one tap).
- **Anchor:** show a real premium offer at 5–10× first, wait for "the gasp", then present the core offer. "Don't treat the anchor like a fake or the customers will too."
- **Rollover:** credit a past purchase toward a next offer worth ≥4× the credit, which keeps the effective discount ≤25%. Targets: lapsed, upset or current customers, and competitors' customers. "Roll over for a do-over."

### A3.5 Downsells ([MM pt 6](#s-mm6))
**Rules:**
- "They said no to this offer, not all offers."
- **Never the same thing for less.**
- Trade, don't give.
- Never negotiate price. Use payment plans to "pay less now" and feature cuts to "pay less overall."

**The three types:**
- **Payment plans:** a 7-step cascade from a prepay discount → financing → half now → a desire check on a 1–10 scale → 3 payments → … Watch that plans *add* buyers rather than shift paid-in-full buyers.
- **Trial with penalty:** offered only after a no, with a card on file and fees for skipped required actions.
- **Feature downsells:** reduce quantity, quality or service model, or remove the guarantee. Remove the least-valued feature first. Removing the guarantee lifted one close rate from 25% to 75%.

### A3.6 Continuity ([MM pt 7](#s-mm7))
Continuity comes last because it brings little day-one cash ("I make them last").
- **Continuity bonus:**
  - A bonus, usually worth more than the first payment, if they join today.
  - "Advertise the bonus, not the membership."
  - Use believable values; "inflated values destroy trust."
  - His example: pet food at $59/mo with toys.
- **Continuity discount:**
  - Free time or a discount for a commitment: up front, at the end, spread across the term, or after the first payment.
  - Bill every 4 weeks (13 cycles a year).
  - Set the cancellation fee equal to the discount received.
  - Gift cards can carry the discount.
  - A lifetime discount at the churn point.
- **Waived fee:** a setup fee of 3–5× the monthly price for month-to-month, waived on a 12-month commitment.
- **Standalone vs continuity price, to steer the share that picks continuity:** 1.33× → ~50%, 1.66× → 60%, 2× → 70%, 2.33× → 80%, 2.66× → 90%.

---

# Part B: Applied to Pup Prints

## B1. Market check (starving crowd) and value-equation audit

**Starving crowd:**

| Test | Pup Prints | Verdict |
|---|---|---|
| Pain | Gift deadline pressure in Q4 (C&P's own affiliate note says mid-Oct to early Dec is >50% of its revenue, per `docs/research/growth.md`). Grief for memorial buyers. | Strong, seasonal |
| Purchasing power | The category supports $150–275 AOVs (C&P, West & Willow; `growth.md`) | Strong |
| Easy to target | Dog owners self-identify by breed, in groups, through creators and pet businesses | Strong |
| Growing | Search demand roughly doubles in Nov–Dec (`growth.md`) | Strong in Q4 |

**Value-equation audit** (current state → gap → fix):

| Driver | What we already have | Gap | Hormozi fix |
|---|---|---|---|
| Dream outcome | A couture campaign aesthetic. "Their dog as a museum-worthy portrait." | Copy describes the object, not the status moment | Frame it as **status in others' eyes**: the recipient's gasp ("you're the one who *gets* them"), the most-complimented piece in the room. Memorial: "them, exactly as they were." |
| Perceived likelihood | See it before paying, human check, Love-It Guarantee | **Zero reviews**, and AI skepticism (Ohio State 2023 in `strategy.md`) | Stack guarantees (§B5). Show the process: a real "checked by a person" note naming a true detail. A photo-quality check before generation. A reviews block that appears only once real reviews exist. |
| Time delay | Preview in ~1 minute, Gift Reveal instantly | The physical piece takes 5–9 business days | Make the **Gift Reveal** the "early emotional win". Show "Arrives by [date]" before payment. Send status updates. |
| Effort & sacrifice | One photo, no account, no card, ready to hang, free US shipping | Choosing a style and size; no good photo of the recipient's dog | Prescribe a size by wall (§B7 menu). Photo tips and multi-photo upload. **Gift cards** for "I don't have a photo." |

## B2. Grand Slam Offer construction (Hormozi's 5 steps, run for us)

**Step 1, dream outcome:** *"See your dog as a work of art in about a minute, give it today, and have it on the wall in days."*

**Steps 2–3, problems → "how to" solutions:**

| # | Stage | Problem (driver) | Solution, "How to…" |
|---|---|---|---|
| 1 | Before | "My photo isn't good enough" (likelihood, effort) | …get a true likeness from the photo you have (photo check, tips, multi-photo upload) |
| 2 | Before | "Will it really look like my dog?" (likelihood) | …see the exact piece before you pay, and have a person check it before print |
| 3 | Before | "AI art feels cheap or impersonal" (dream, likelihood) | …own a piece that reads as couture: curated styles, archival materials, honest about how it's made |
| 4 | Before | "Which style? Which size?" (effort) | …try every style free and know the right size for your wall |
| 5 | Before | "Is it worth $99?" (likelihood) | …compare against the real alternative (hand-painted commissions run $150–500 and take weeks); the file is included ($29 sold alone) |
| 6 | Before | "Will it arrive by Christmas?" (time) | …know the arrival date before paying, and give it today with the Gift Reveal |
| 7 | Before | "What if they don't like it?" (likelihood) | …give a gift that can't miss: the recipient can choose another style |
| 8 | Before | "I don't have a photo of their dog" (effort) | …give the portrait without the photo (gift card, coming) |
| 9 | During | "Checkout tricks or surprise fees" (likelihood) | …pay exactly the price shown (all-in, nothing pre-checked) |
| 10 | During | "$119 at once is a lot" (sacrifice) | …pay over time (Klarna ≥$100), or get the same portrait as a print or a file |
| 11 | After | "The gift moment is weeks away" (time) | …unveil it the same day (Gift Reveal) |
| 12 | After | "Hanging is a hassle" (effort) | …hang it out of the box (hardware included) |
| 13 | After | "It arrived damaged" (likelihood) | …get a free replacement from a photo alone |
| 14 | After | "I want it on my phone and socials" (dream) | …have the hi-res file instantly |
| 15 | After | "We have two dogs" / "Mom wants one too" (dream) | …add the second dog (+$15) or send a family copy |
| 16 | Memorial | "I'm afraid it won't be *them*" (likelihood, emotion) | …keep refining, unhurried, until it is |

**Step 4, delivery vehicles.** The 10× / 1/10th test shows both ends of the ladder:
- **At 10× (~$990):** a concierge remembrance service. We restore an old or blurry photo, the founder curates several versions, and it ships museum-framed with a handwritten card. Today we can honestly offer only part of this (founder curation plus a note). A real premium tier is possible in Q1 (Prodigi Hahnemühle giclée, per `strategy.md`).
- **At 1/10th (~$10):** a phone lockscreen of their portrait. That becomes a free lead magnet (§B10).
- The vehicles mix **DIY** (preview software), **done-with-you** (photo coaching by email, "help me choose") and **done-for-you** (human check, retouch on remake).

**Step 5, trim and stack:**

| Keep (low cost, high value) | Keep (high cost, high value) | Cut |
|---|---|---|
| Unlimited free restyles (~$0.08 each, rate-limited) · Gift Reveal · hi-res file · Arrives-by date · photo check · room/wall mockup · recipient's style choice · gift note and ship-to-recipient · free US shipping (already in price) | Human check on every print · Love-It remake/refund · Holiday Arrival Promise (if adopted, §B5) | Blankets, socks and other low-quality merch (C&P's 1★ trap) · paid "preview sooner" (our whole wedge is free) · pre-checked add-ons · invented "worth $X" values |

## B3. Three Grand Slam Offer variants

The luxury design system and Hormozi's naming pull in opposite directions. The fix: **MAGIC names go in ads and hooks** (performance surfaces), and **couture names go on site** (product surfaces). Both describe the same real offer.

### B3.1 For the gift buyer: "The Gift"
- **Ad name (MAGIC):** "**The Same-Day Gift Reveal** for the dog lover on your list."
  - Magnet: same-day, and from Nov 1, Christmas.
  - Avatar: the dog lover on your list.
  - Goal: the reveal.
  - Interval: same day.
  - Container: "Reveal".
  - Alternative to test: "Free 1-Minute Christmas Portrait of Their Dog."
- **Dream outcome:** the gasp when they open it, and being the person who "gets" them.
- **Core:** 12×16 Framed Print, **$95** (GP $48.85), or 16×20 canvas, $99 (GP $56.88). No discount needed.
- **Stack** (each line answers an objection from §B2):

| Item | Objection it kills | Value shown |
|---|---|---|
| Free preview, every style, before paying | #2, #4 | Free |
| **Gift Reveal**, sent the moment you order | #6, #11 | Included |
| Hi-res digital file | #14 | **$29** (sold separately) |
| **Recipient's Choice**: they can ask for a different style within 30 days of delivery, remade free (*new; extends the Love-It Guarantee to the recipient*) | #7 | Included |
| Gift note, gift receipt with no prices, ship to recipient | effort | Included |
| Arrives-by date at checkout; Holiday Arrival Promise (if adopted) | #6 | Included |
| Checked by a person before printing | #2 | Included |
| Nov 1–Dec 10 only: **buy two portraits, get two matching ornaments free** (§B6.1) | multi-gift buyers | $19 each (real price) |

- **Guarantee:** Love-It (unconditional) + Recipient's Choice + Holiday Arrival Promise.
- **Urgency (real):** FOUNDING100 until Oct 31 or 100 orders. "Order by Dec 12" (`offer.ts`; see §B5 on Dec 10 vs Dec 12). The Gift Reveal works through Christmas Day.
- **Cost of Recipient's Choice:** assume 3% of gift orders use it at ~$40 reprint COGS, so ~$1.20 per gift order. That is small against a likelihood lift we can't otherwise buy without reviews.

### B3.2 For memorials: "The Remembrance Portrait"
- **Name:** "The Remembrance Portrait." Magnet and Interval are left out on purpose. Hormozi says components are optional, and urgency is wrong here.
- **Ad and hook rules:** no urgency, no "free!" shouting, no countdowns. Calm proof of likeness only. This follows the memorial email track already in `marketing/email/flows.md`.
- **Dream outcome:** "Them, exactly as they were." Likelihood is the whole game.
- **Core:** 16×20 canvas **$99** (GP $56.88), or Framed 16×20 **$119** (GP $58.15). Recommended styles: Old Master, Watercolor, Charcoal Study, Botanical.
- **Stack:**
  - unlimited previews and several photos;
  - **"Help me choose"**: the founder replies with the version that best keeps the eyes and markings (done-with-you);
  - human likeness check;
  - a personal note from the person who checked it (email, $0);
  - the hi-res file ($29, included);
  - Klarna on ≥$100.
- **Guarantee, a service guarantee:** "We'll keep refining until it's them." Unlimited free remakes within 60 days of delivery, and a full refund is always available.
  - Budget exposure: memorial remakes may run higher than average. Assume 6% × ~$40 = ~$2.40 per order.
- **Money model here:** one gentle bump ("a small ornament for the tree, $19"). No post-purchase upsell, no referral ask in the first 30 days, no continuity marketing except one opt-in anniversary note.

### B3.3 For the dog mom buying for herself: "The Statement Portrait"
- **Ad name (MAGIC):** "**Free 1-Minute Gallery Portrait** for dog moms."
  - Magnet: free.
  - Interval: 1-minute.
  - Goal: gallery portrait.
  - Avatar: dog moms.
  - Alternative to test for May: "The Dog Mom's Day Portrait Set."
- **Dream outcome:** the piece every guest asks about.
- **Anchor first (§B7):**
  - **The Triptych**: three styles of one dog on three 12×16 canvases, **$199** (separately $237, a real $38 saving). GP ~$91.53 (46%).
  - **The Statement**: 18×24 canvas **$115** (GP $67.31), prescribed for above a sofa.
  - **Our pick**: 16×20 canvas $99.
- **Stack:**
  - try every style free;
  - a wall-fit preview at true size;
  - the hi-res file ($29) for a phone wallpaper and posts;
  - ready to hang;
  - Heirloom Set bump (save $10).
  - Two-dog homes: extra dog +$15, or **The Diptych** (two dogs, two 12×16 canvases, one style), **$139** vs $158 separately. GP ~$67.
- **Urgency (real):** seasonal styles retire on a published date; Founding until Oct 31.

## B4. Pricing: should we "charge more"?

Hormozi's advice, judged for our market:
- **We are not the cheap option, and shouldn't become it.** We list at or just below C&P (`fulfillment.md`). His "no benefit to being second cheapest" supports holding price. Discounts stay capped (Founding 15%, BFCM ≤20%, preferably bonuses instead; §B6).
- **But perceived likelihood is our weakest driver** (zero reviews, AI skepticism). Hormozi says to raise *value* before *price*. So the order is: stack guarantees and bonuses now, and test price after the holidays.
- **Price test (Jan 15–Feb 15, 2027, after the Founding window and Q4):**
  - Move the hero 16×20 canvas from $99 to **$109**. GP goes from $56.88 to **$66.59** (+17%).
  - Break-even: we can lose up to **14.6%** of buyers and earn the same GP. At $105 the figure is 9.3%.
  - Announce the date in advance. "Never raise your prices without letting people know" gives us real urgency for the existing list.
- **Add real high-ticket anchors** (5–10× is Hormozi's anchor; ours will be ~2–2.5×, which is fine as long as it's real):
  - Triptych $199;
  - Framed 24×36 $199;
  - Framed Triptych (3 × framed 12×16) **$249** vs $285 separately. GP ~$112.
  - Q1: an Heirloom giclée tier.
- **Extra dog:** launch at +$15 (`strategy.md`), then test +$25 (GP ~$24). Two-dog homes value it highly, and the marginal cost is ~$0.50 of AI.
- **Virtuous cycle:** a higher GP pays for the human check, a faster remake turnaround and the Holiday Arrival Promise. Each of those raises likelihood, which is the driver we're short on.

## B5. Guarantees: wording options

**Stack (recommended):**
1. Unconditional Love-It.
2. Likeness service guarantee (before print).
3. Holiday Arrival Promise (conditional, seasonal).
4. For partners only: implied (performance) pay.

| Type (Hormozi) | Wording option | Cost and exposure | Use |
|---|---|---|---|
| **Unconditional** (live today) | "**The Love-It Guarantee.** If you don't love your piece, tell us within 30 days of delivery. We'll remake it in any style or refund you in full. No forms, no hoops." | Planned 3% reserve | Keep as the core. |
| Unconditional, **better than money back** | "Love it, or it's free, and keep the digital file." | ~$0 marginal. Abuse risk: someone refunds and prints the file. Cap at one refund per customer. | Optional test. |
| Conditional, **service** (likeness) | "**We don't print until it looks like them.** A person checks every portrait against your photo before it's printed. If something's off, we fix it first." | Ops time | Add to PDP and the memorial page. |
| Conditional, **service** (memorial) | "**We'll keep refining until it's them.** Free remakes for 60 days after delivery, or a full refund." | ~$2.40 per memorial order (assumption) | Memorial only. |
| Conditional, **first outcome** (gift) | "**Recipient's Choice.** If they'd prefer another style, they can tell us within 30 days of delivery and we'll remake it free." | ~$1.20 per gift order (assumption) | Gift offer. |
| Conditional, **outsized/credit** (late delivery) | "**The Holiday Arrival Promise.** US orders placed by Dec 10 with standard shipping arrive by Dec 24, or we refund you in full, and you keep the portrait." | If ~3% of eligible orders are late: 3% × ~$100 ≈ **$3 per eligible order**. Cap the program; insure it with the Prodigi standby. | **Decision needed.** It attacks C&P's biggest complaint cluster (40–50% of their 1★, `cp-reviews.md`). Use Dec 10, not the Dec 12 in `offer.ts`: Printful's standard cutoff is Dec 11 (`strategy.md` W9). |
| **Anti-guarantee** | – | – | Rejected (§2). |
| **Implied** (performance) | Creators and partners are paid only on sales: 15% commission locked 30 days after delivery | Self-funding | Partner program (§B11). |

- **Refund math, Hormozi-style:** if the stacked guarantee lifts conversion 10% and refunds go from 3% to 5%, net orders per 100 visitors go from 1.50 × 0.97 = **1.455** to 1.65 × 0.95 = **1.568** (+7.7%). Do the math, not the emotion.
- **Naming:** keep "The Love-It Guarantee" because it is vivid and not "satisfaction". For the memorial line, use "Until it's them."

## B6. Attraction offers (Stage I: get cash)

| Offer (Hormozi type) | Pup Prints version | Dates | Unit economics | Status |
|---|---|---|---|---|
| **Lead magnet** (sample + reveal; software) | The free preview: one photo, ~1 minute, every style, no card | Always | ~$0.40 per uploader in CAC | Live |
| **Discount attraction** (scarcity + urgency enhancer) | **FOUNDING100**: 15% off, real cap of 100, ends Oct 31 11:59pm PT. Show the real Stripe count only. | Oct 13–31 | Hero GP $42.46 (vs $56.88) | Live. Never extend or restart. |
| **Decoy** | Advertise "Your dog as a museum portrait, **$29**" (the hi-res file). On the result page, put it beside the 16×20 canvas, which **includes the file free**, the Gift Reveal and hanging hardware: "Are you after a file, or a piece for the wall?" Keep the guarantee on both (deviation from Hormozi; see §2). | Test in Nov ads | A decoy buyer is still 96% GM ($27.86) and feeds the rollover (§B7) | Test |
| **Buy X Get Y Free** | "**Buy two portraits, get two matching ornaments free**" (Hormozi: more free items than paid ones; cheap free items beat one big one). List prices unchanged. | Nov 1–Dec 10 (≤6 months a year, per the FTC Free Guide) | 2 × canvas 16×20 + 2 ornaments: GP **$92.01** (46%), conservative shipping. "25% off the 2nd" (in `strategy.md`) gives $90.03, so the cost is the same and the framing is stronger. | Replace "gift two, 25% off" with this |
| **Giveaway** | "**The Monthly Portrait Draw**": make a free preview to enter (no purchase necessary). One winner a month gets their dog as a 24×36 framed print (real retail $199, cost $107). Everyone else gets a **$15 voucher valid 5 days** (~26% of hero GM, inside Hormozi's 10–30%). Winner announced publicly, with permission. | Monthly from Nov; a bigger edition on National Dog Day (Aug 26) | Prize ~$107 a month. Voucher order GP $42.31. | Needs official rules. Total prize <$5,000, so NY/FL registration doesn't apply ([Olshan](#s-sweeps)). Consider US-only entry. |
| **Win Your Money Back** (honest version) | "**Reaction credit**": send us the gift-opening video, and if you let us share it you get **$15 store credit** toward your next piece. Never tied to a review, and never "post a positive…". If we republish it, we label it "Customer video. They received store credit." | From the first deliveries | $15 off a later order (paid as credit, Hormozi's own payout rule) | Optional |
| **Pay Less Now or Pay More Later** | – | – | – | Rejected (§2) |

**"Free goodwill" done right:** use Hormozi's decoy-section idea of surprising buyers with small no-cost premium extras (a founder note naming a true detail of their dog, a printable care card). Separately, ask for honest reviews with **no incentive** (this mirrors the "Free Goodwill" page in his books).

## B7. Upsells and downsells (Stage II: get more cash)

### B7.1 Upsells, in the order the customer meets them

| Moment | Type | Offer | Price | Incremental GP |
|---|---|---|---|---|
| Result page / configurator | **Anchor** | Show the Triptych ($199) or the Framed 24×36 ($199) first, then "Our pick" 16×20 canvas $99. Real products; some people will buy them. | $199 | +$43 vs a blended single |
| Configurator | **Menu: unsell + prescribe** | Unsell: "You don't need framed for a canvas wall; canvas is lighter and ready to hang." Prescribe by wall: above a sofa → 18×24 or 24×36; desk or console → 16×20; shelf → 8×10 framed. | – | Step-up to 18×24: +$10.43 |
| Configurator | **Menu: A/B** | "Black, white or oak frame?" instead of "Do you want a frame?" (framed only) | – | – |
| Configurator | **Classic** | "Two dogs? Add the second to the same portrait." "You can't hang Bella without Max." | **+$15** | ~$14.06 |
| Checkout (never pre-checked) | **Classic** order bumps | Matching ornament $19 · mug $25 · **Heirloom Set** both for $34 (save $10) | $19 / $25 / $34 | $10.02 / $14.71 / $15.01 |
| Thank-you page (card on file) | **Classic + card on file** | "**Family Copy**: send the same portrait to someone else, 20% off, shipped to them." This is a different item, so it isn't the same-item discount Hormozi warns against. | $79.20 (canvas 16×20) | $37.65 |
| Thank-you page | **Classic** | "A second style of [Dog] as an 8×10 fine-art print" | $29 | $16.14 |
| Day 3–30 (digital-only buyers) | **Rollover** | "Your $29 counts in full toward any canvas or framed piece $99+, for 30 days." This is ~29% effective, just above Hormozi's ≤25% guide. Note it is **margin-neutral**: digital GP $27.86 + canvas GP at $70 ($28.72) = $56.58, the same as a straight canvas sale ($56.88). | $70 net | $28.72 |
| Remake requests | **Rollover ("roll over for a do-over")** | Offer, never push: "Or put the full amount toward a larger size." The refund is always available. | – | – |

Card-on-file one-click requires Stripe `setup_future_usage` on the checkout session (build item, §B14).

### B7.2 Downsells (for "no" and for abandoned previews)
- **Payment plan:** Klarna / Afterpay on orders ≥$100. On a framed 16×20 at $119, GP falls from $58.15 to ~$54.47 (fee 5.99% + $0.30). Check Hormozi's test: plans must **add** buyers, not shift paid-in-full ones.
- **Feature downsell, in the nurture flow.** Order: canvas → framed → **fine-art print from $35** → **the file alone, $29**. The quantity lever is size; the quality lever is paper vs canvas; the service lever is ships-flat vs ready-to-hang. This is the same portrait at a lower scope, never a discount on the same item.
- **Nurture step 3, Hormozi-aligned:** A/B test the personal **WELCOME10** code (a discount on the same item, which Hormozi advises against) against **bonus-based urgency**: "Order in the next 48 hours and the matching ornament is on us" (real expiry). The ornament costs ~$8.40 if it ships with the order and ~$13.60 if it ships separately, vs ~$9.60 of GP lost to 10% off a $99 canvas. Memorial previews get neither.
- **Not used:** trial with penalty; removing the guarantee.

## B8. Continuity (Stage III: get the most cash)

Portraits are not a natural subscription, and Hormozi himself puts continuity last. Recommended, smallest first:

### B8.1 The Holiday Portrait (annual)
- **Mechanic:** at checkout, opt in to "Send me [Dog]'s holiday portrait each year." Every late October we generate **this year's new holiday edition** of their dog (free preview, ~$0.08).
- **Member offer:** "**The Holiday Set**": 8×10 framed + matching ornament, **$79** (separately $94; a real $15 saving). GP **$31–36**.
- **Continuity bonus:** "Founding member price, locked for life" (Hormozi's lifetime-rate continuity discount). Hormozi says to "advertise the bonus, not the membership."
- **Billing:** **one-tap approval with the card on file. We never charge without the customer approving that year's art.** This is a deliberate deviation from auto-renew: custom art plus negative-option billing invites unwanted shipments and auto-renewal liability (§B8.4).
- **Year-1 math (assumption):**
  - 300 customers by January × 30% opt-in × 40% approval next October ≈ **36 orders, ~$1.2K GP** in Q4 2027.
  - Small, but it compounds with the base and costs almost nothing to run.

### B8.2 Birthday and "gotcha day" capture
Collect the dog's birthday at checkout (optional). Each year, send a free new-style preview ("Happy 5th, Biscuit"). Each send is a recurring free lead magnet with a member price on the piece. Memorial orders get **one** opt-in anniversary note at most.

### B8.3 Gift cards (planned; `/gift-cards` is "coming soon")
- **Classic need:** solves problem #8, "I don't have a photo of their dog."
- **Continuity-discount carrier:** "Buy a $100 gift card, get a $20 card for yourself, valid Jan 1–Mar 31." The bonus card is **promotional**, so label it clearly. Promotional cards fall outside the CARD Act's 5-year expiry rule; purchased cards may not expire within 5 years ([Reg E](#s-carda)), and our page already plans "don't expire."
- **Economics:** a $100 card redeemed on a $99 canvas returns GP $56.88. A $20 bonus redeemed in Q1 still leaves ~$37 GP on a hero canvas. It builds Q1 demand.

### B8.4 Seasonal Print Club (Q1–Q2 2027 test, only after Stages I–II are stable)
- **Offer:** four seasonal 8×10 fine-art prints a year (spring, summer, autumn, holiday styles).
- **Price:** members pay $26 a quarter; the standalone seasonal print stays $35, a 1.35× ratio, which Hormozi's table puts at ~50% choosing continuity. GP ~$12.93 a quarter.
- **Continuity bonus:** a free 8×10 frame with the first print (~$19.60 incremental cost).
- **Year-1 GP per member:** ~$32.
- **Compliance:** state auto-renewal laws apply. California's amended ARL (AB 2863, in force July 1, 2025) requires express affirmative consent, annual reminders and online "click to cancel" ([DWT](#s-caarl)). The FTC's federal click-to-cancel rule was vacated by the 8th Circuit on July 8, 2025, but state laws still stand ([GT Law](#s-c2c)). Build to California's standard.

## B9. The full money model (one sequence, with numbers)

**Sequence:**
1. Ad, content or partner QR.
2. **Free preview** (lead magnet).
3. Email capture to "save my portraits" (engaged lead).
4. Result page: **anchor** → **prescribed** size → **A/B** frame → **extra dog**.
5. Checkout: **bumps**, never pre-checked.
6. Thank-you page: **Gift Reveal** + one-click **Family Copy / 2nd style** + "**who** else's dog?" referral (§B11).
7. Non-buyers: nurture → **feature downsell** → **bonus-urgency**.
8. Day 3–30: **rollover** for digital-only buyers; Give $15/Get $15 after delivery.
9. Opt-ins: **Holiday Portrait** and birthday continuity.

**30-day GP per buyer.** Take rates are assumptions to replace with data after ~100 orders. Core mix:
- 40% canvas 16×20;
- 10% canvas 12×16;
- 20% framed 12×16;
- 10% framed 16×20;
- 10% print 12×16;
- 10% digital.

| Layer | Take rate | +Revenue per buyer | +GP per buyer |
|---|---|---|---|
| Core first piece (mix above) | 100% | $85.80 | **$48.11** |
| Ornament bump | 13.5% | $2.57 | $1.35 |
| Mug bump | 7.2% | $1.80 | $1.06 |
| Heirloom Set | 4.5% | $1.53 | $0.68 |
| Extra dog +$15 | 9.0% | $1.35 | $1.27 |
| Size step-up (anchor ladder), avg +$18 | 13.5% | $2.43 | $1.42 |
| Family Copy (one-click) | 5.0% | $3.96 | $1.88 |
| 2nd-style 8×10 (one-click) | 4.0% | $1.16 | $0.65 |
| Digital → canvas rollover | 1.5% | $1.05 | $0.43 |
| **Total** | | **$101.64** | **$56.84** |
| − remake/refund reserve (3% of revenue) | | | −$3.05 |
| **30-day GP per buyer** | | | **≈ $53.79** |
| During FOUNDING100 (15% off core + bumps) | | | **≈ $39.89** |

## B10. 30-day client-financed acquisition: can we hit it?

**Thresholds** (Hormozi, [Lost Chapters](#s-lc7)):

| Level | Rule | Our max CAC (regular) | Max CAC (Founding window) |
|---|---|---|---|
| CFA | 30-day GP ≥ CAC | **$54** | $40 |
| Hormozi's "real life minimum standard" | 30-day GP ≥ 2 × CAC | **$27** | $20 |
| Book ideal, strict reading | 30-day GP ≥ 2 × (CAC + COGS) | Not reachable at ~50% GM (needs GP > 2 × ~$47 of COGS before any CAC) | – |

**Why the strict version matters less for us.** The customer pays at checkout, before we pay Printful. That timing still needs checking: Printful charges when an order is confirmed, and Stripe pays out on a rolling schedule. If it holds, COGS is already customer-financed, and the binding constraint is CAC.

**Payback** (the third CFA lever) is effectively ~day 0–3, not 30 days:
- GP lands at checkout.
- Creator commissions are paid 30 days *after delivery* (`strategy.md` §8.2), so they come straight out of collected cash.
- Ad platforms bill in arrears.

So the game is the **ratio**, not the timing.

**CAC by channel vs the thresholds** (CAC estimates are assumptions unless cited):

| Channel | How the cost works | Est. CAC per new buyer | CFA ($54) | 2× ($27) |
|---|---|---|---|---|
| Creator affiliates (commission only) | 15% of net (~$12.62 on the hero) + 15% buyer code (−$14.85 GP) | **~$27.50** effective | Yes | Borderline |
| Local partners (groomers, vets, trainers, daycares; QR cards) | Same commission; cards ~$0.10 each | ~$27.50 | Yes | Borderline |
| Customer referrals, Give $15 / Get $15 | $15 off the friend's order + $15 credit when redeemed | **$15–30** | Yes | Yes |
| Gift-first creator seeding | ~$42 COGS per gifted print + AI | $42 ÷ orders per seed: **1 → $42, 2 → $21** | Yes | Yes, only at ≥1.6 orders per seed |
| Monthly Portrait Draw | $107 prize per month + $15 vouchers | Promotion cost depends on reach | Yes, if ≥10 orders a month | Yes, if ≥20 a month |
| Retargeting uploaders (paid) | Cheap: the audience already made a preview | Likely $10–25 | Yes | Yes |
| **Cold paid social** (Q4 CPM $18–28) | See the grid below | **$37–84** typical | Yes, only with a good funnel | No, unless CPC ≤$1 and upload→buy ≥12% |

**Cold paid funnel sensitivity.** CAC = CPC ÷ (landing→upload) ÷ (upload→buy within 30 days) + $0.40 AI ÷ (upload→buy):

| CPC | Landing→upload | Upload→buy 8% | 10% | 12% |
|---|---|---|---|---|
| $1.00 | 25% / 35% | $55 / $41 | $44 / $33 | $37 / **$27** |
| $1.50 | 25% / 35% | $80 / $59 | $64 / $47 | $53 / $39 |
| $2.00 | 25% / 35% | $105 / $76 | $84 / $61 | $70 / $51 |

**Where we stand.** The 90-day base case in `strategy.md` (MER ~3.0, AOV ~$112) implies ~$37 of marketing per order. That is **CFA at ~1.5×, short of Hormozi's 2×.**

**Path to 2×:**
1. **Mix shift (biggest lever).** Get ≥50% of orders from commission-only and referral channels (CAC ~$15–28). Then blended CAC falls to ~$27–33 even with paid at ~$45.
2. **GP levers.** Every lever below together lifts 30-day GP from $53.79 to **~$66.06**, which raises the 2× ceiling to ~$33:

| Lever | +30-day GP per buyer |
|---|---|
| Gift Two offer at 15% take | +$5.27 |
| Hero at $109 (no conversion loss) | +$3.88 |
| Family Copy from 5% to 8% | +$1.13 |
| Anchor ladder from 13.5% to 20% | +$0.68 |
| Triptych at 3% take | +$1.30 |

3. **CAC levers.** More hooks tested (Hormozi's 11×), retargeting uploaders, and Spark/partnership ads built from creator posts that already won organically.

**Scaling rule (Hormozi's build order):**
- Raise paid spend only while **trailing-7-day paid CAC ≤ 30-day GP per buyer** (CFA).
- Fund paid growth from the surplus of the 2× channels.
- If paid CAC is above $54 for 7 days, cut it back to retargeting plus creator whitelisting. This matches the downside trigger in `strategy.md`.

## B11. Lead magnets beyond the preview

| Lead magnet (MAGIC-ish name) | Hormozi type / delivery | Cost | Next problem it reveals → offer | CTA |
|---|---|---|---|---|
| **Free Phone Portrait**: their preview as a 1080×1920 lockscreen, no watermark, sent by email | Sample / software | ~$0 | "I see it 80 times a day and want it on the wall" → canvas | "Hang it" |
| **Free 1-Minute Holiday Card of Your Dog** (Nov–Dec): the Holiday Cozy portrait on a digital card to text or post (text sits outside the art) | One step of a multi-step process / software | ~$0.08 | Wants the physical version → ornament, Holiday Set, Gift Reveal | "Make it an ornament" |
| **Surprise a Friend**: make a free portrait of a friend's dog and send it privately (gift-first) | Reveal / software | ~$0.40 (rate-limited, Turnstile) | The friend wants it; the sender wants to gift it | "Give it to them" |
| **Wall Fit**: upload a photo of your wall and see the piece at true size | Reveal / software | Build cost | Size → anchor and step-up | "This size" |
| **Is My Photo Good Enough?** check | Reveal / software | ~$0 | Fixes likelihood before generating | "Make my portrait" |
| **The Monthly Portrait Draw** | Giveaway (attraction) | $107 a month | Voucher → core | "Enter free" |
| **[Breed] in 12 Styles** gallery pages | Information | Content time | "What would *mine* look like?" → preview | "See yours" |
| **Partner card**: "A free portrait preview of your dog, courtesy of [Groomer]" (white-label QR) | Sample via an affiliate (Hormozi integration level 1) | ~$0.10 a card | Preview → core; partner earns 15% | "Scan for yours" |
| Memorial: **Choosing the photo** (a gentle guide) + the free preview with a memorial toggle | Information + sample | ~$0 | Likeness confidence → Remembrance Portrait | "Take your time" |

Honest scarcity for magnets is allowed (Hormozi: cap per week). Use it only where a real cost exists. Example: "Surprise a Friend: 3 free per day per person", which is a real rate limit.

## B12. Core Four without warm outreach, and content

**What changes without warm outreach.** Hormozi treats warm outreach as the fastest, cheapest start. Without it, the load moves to **cold outreach** (pet businesses and creators, gift-first), **content**, **lead getters** and (later) **paid**.

`marketing/00-week1-war-plan.md` ranks "Warm network, gift-first" as the #1 channel (6–12 of 15–33 orders). With warm excluded, cut week-1 expectations accordingly, or move those hours to creator and partner outreach.

**Content: hook, retain, reward, applied:**

| Hook (topic + ≥2 headline components) | Retain (list, steps or story) | Reward | Ask |
|---|---|---|---|
| *Manufactured, ongoing, proximity:* "Day 12 of painting every dog at [park]" (owners' consent) | Story: three dogs, three reactions | The reveals | Integrated: "Comment your dog's name; I'll paint the next 10" (a magnet ask, so still a give) |
| *Present, unusualness:* "POV: you show your mom her dog in a velvet robe" | Steps: photo → 1 minute → reveal | Mom's reaction | "Make yours free" |
| *Trending, relevancy:* "Which style is [breed]?" | List: 4 styles, vote | Winner reveal | "Comment A/B/C/D" |
| *Recent past, conflict:* "Ordered a pet portrait in December and it came after Christmas? Here's how ours works" (no brand names) | Steps: Arrives-by date + Gift Reveal | The guarantee | "Order-by date in bio" |
| *Far past (founder story):* "Why I started this after [true story]" | Story | Honest "how it's made" (AI artist, checked by a person) | Intermittent: Founding count update |

- **Give : ask ratio.** Roughly **4 give : 1 pure ask** (Hormozi cites ~4:1 on Facebook and ~3.5:1 on TV). Every post can carry an *integrated* magnet CTA.
- **"Give in public, ask in private":** answer every commenter by DM with their dog's free portrait.

## B13. The Rule-of-100 operating system (solo founder, 100 days: **Thu Oct 15, 2026 → Fri Jan 22, 2027**)

Hormozi: "100 primary actions a day for 100 days… you can add zeros, you can remove zeros." Below is the version for one person who also runs QA and support.

**Daily (≈8.5 hours):**

| Block | Time | Primary actions (the 100s) |
|---|---|---|
| 07:30–09:10 | **100 minutes of content** | Film, edit and post 3 shorts (TikTok → Reels → Shorts). Reply to comments. DM every commenter their free portrait. |
| 09:15–12:15 | **100 cold reach-outs**, new contacts only. Follow-ups are extra. | **25 gift-first creator DMs** (Admin → Gifts → reveal link; ~3–4 minutes each, batched). IG and TikTok throttle new accounts, so keep DMs at ~20–30 a day. **75 partner pitches by email** (groomers, vets, trainers, daycares, boarding, pet photographers, boutiques, breed clubs, shelters, dog-mom group admins), with a personalized first line and the QR-card offer (~45 seconds each with mail merge). **Follow-ups:** up to 3 per contact, at day 2, 4 and 7 (~20 minutes). |
| 13:00–14:40 | **100 minutes of paid ad work** | Turn yesterday's top organic posts into ads (Spark / partnership codes). Write 5 new hooks. Retarget uploaders. **Move to $100/day of spend only once trailing-7-day paid CAC ≤ $54** (CFA). |
| 14:40–16:40 | Operations (protects the promise) | Human check of every print. Support. Remakes. Gift Reveal sends. Partner onboarding. |
| 16:40–17:00 | Scorecard | Log the day (below). |

**Minimum dose on bad days:** 50 reach-outs + 50 minutes of content + QA. Never skip QA, because "Every print is checked by a person."

**Weekly cadence ("Better"):**
- **Monday, 30 minutes:** find the funnel step with the biggest drop. Candidates: landing→upload, upload→email, preview→checkout, checkout→purchase. Pick **one test per platform** for the week and log it. Stop after 4 tries or a month without beating the control.
- **Friday:** rank the week's content, promote the top 2 to ads, and pick the 10 best partners for a follow-up call.

**Partner launch ("Whisper, Tease, Shout") for the Holiday Cozy 2026 Edition (Nov 1):**
- **Whisper:** Oct 18–24, behind-the-scenes posts.
- **Tease:** Oct 25–29, the style reveal plus partner assets in a plug-and-play kit.
- **Shout:** Oct 30–Nov 2, twice daily from 3 days out.

**Daily scorecard (admin dashboard, build item):**

| Inputs | Leads | Outputs | Quality |
|---|---|---|---|
| Reach-outs (new, follow-ups) · gifts sent · content minutes and posts · ad minutes and $ | Uploads · previews · emails captured · partner signups · referral sends | Orders · AOV · **30-day GP per buyer** · **CAC by channel** · **CFA ratio (30-day GP ÷ CAC)** | Remake/refund % · on-time % · AI $ per order |

**100-day input totals:** 10,000 reach-outs, ~10,000 content minutes (~300 shorts), and 10,000 minutes of ad work.

**Expected yields** (assumptions; replace with week-1 data):
- Creator gift DMs: 20–35% reply, because the gift is their own dog's portrait.
- Partner emails: 3–8% reply and ~1–2% activate.
- At ~1.5% activation, 7,500 partner emails ≈ **110 active partners** by Jan 22.

**More → Better → New:**
- **More** through Dec 10.
- **Better** from week 3 onward.
- **New**, only once more and better plateau, in this order:
  1. a new placement on a known platform (Stories, Spark);
  2. Pinterest (gift search intent);
  3. Google Shopping at scale.

## B14. Lead getters plan

**Customers (referrals). Hormozi's seven ways, mapped:**

| # | Way | Pup Prints |
|---|---|---|
| 1 | One-sided | Referrer gets $20 store credit when a friend's first order ships |
| 2 | **Two-sided** (default) | **Give $15 / Get $15** (already planned at delivery + 7 days), paid as credit |
| 3 | **Ask at purchase, "who"** | Thank-you page: "**Who else's dog deserves this?** Send them a free private preview." Gift-first, no discount needed. |
| 4 | Negotiation chip | Not used (no price negotiation) |
| 5 | Referral events | "**Bring a Dog Week**" (around National Dog Day and Dog Mom's Day): both friends get matching ornaments |
| 6 | Ongoing | Every post: "make one for a friend". The Gift Reveal page's CTA, "Make one of your dog", credits the giver. |
| 7 | Unlockable bonus | 3 referred orders → a free 8×10 framed second-style print (~$32 cost, ≈$10.55 per referred order) |

**Never** reward reviews or ratings (§2).

**Affiliates and partners (Hormozi's six steps):**
1. **Find:** services (groomers, vets, trainers, daycares, boarding, walkers, pet photographers); groups (breed clubs, dog-mom group admins); events (adoption days, dog-friendly markets); products (boutiques, dog bakeries); creators (`marketing/creators/prospects.csv`).
2. **Offer:** "A fast, simple way to give your clients something they'll love, and earn 15% on every portrait. No inventory, no work: we send QR cards and a link."
3. **Qualify (make them a customer):** creators get a gifted portrait (already). Businesses get a free 12×16 print of the *shop dog* to hang in-store. That costs ~$16 and is also an ad.
4. **Pay** from max allowable CAC ($27–54):
   - **15% base** (~$12.62 per hero order);
   - **20%** for Founding Partners and anyone above $1,500 a quarter (already in `strategy.md`);
   - **pay with product**: 10 sales in a quarter → a free 24×36 framed of their dog (~$107, ≈$10.70 per order).
   - Commission locks 30 days after delivery, so it is client-financed by construction.
5. **Launch:** Whisper / Tease / Shout (§B13).
6. **Integrate:** level 1 is QR cards handed out with every groom or visit; level 3 is a sample canvas on the counter with a QR code.
   - FTC: partners disclose (#ad / Paid partnership) per `CLAUDE.md`, and partner materials say so.

**Employees:** the first hire is a part-time VA who runs the 75 partner emails a day. Hormozi: even at a third of the founder's output, leverage wins. **Agencies:** later, only for UGC and whitelisting at scale.

## B15. Honest scarcity and urgency calendar

| Window | Lever (Hormozi type) | Real basis | Copy (no timers) |
|---|---|---|---|
| Oct 15–31 | Scarcity + urgency (cap and deadline) | Stripe: 100 redemptions, expires Oct 31 11:59pm PT | "Founding offer: 15% off for our first 100 orders, through Oct 31." Show the real "X of 100 claimed" from Stripe only. |
| Nov 1–Dec 31 | "Never available again" (limited release) | **Holiday Cozy 2026 Edition** retires Dec 31. Next year's edition is a new design. | "The 2026 holiday edition, available through Dec 31." |
| Nov 1–Dec 10 | Bonus-based urgency | GWP ends at the standard cutoff | "Buy two portraits, get two matching ornaments free, through Dec 10." |
| Nov 27–30 | Seasonal (rolling) | BFCM | Prefer a **bonus** to the 20% in `strategy.md`: free Heirloom Set (cost ~$18) vs 20% off a $99 canvas ($19.80). Same cost, price integrity kept. **Decision needed.** |
| Nov 1–Dec 10/12 | Real deadline | Printful standard cutoff Dec 11 (`strategy.md`) | "Order by Dec 10 for Christmas delivery in the US." Align `offer.ts`, which says Dec 12. |
| Dec 11–25 | Exploding-opportunity framing, honestly | The Gift Reveal is instant | "The Gift Reveal can be sent instantly, right up to Christmas Day." (live in `offer.ts`) |
| Jan 15 | Announced price change (only if the test is approved) | Real new price | "On Feb 15 the 16×20 canvas moves to $109." |
| Valentine's / Mother's Day / Aug 26 | Rolling seasonal | Real order-by dates; Dog Day draw | "Order by Feb 1 / May 1…" |
| Any time | Growth-rate cap | **Only if enforced in code:** a daily human-check capacity | "We check every portrait by hand, so we take N orders a day in December." |

**Banned:** countdown timers; fake "X left"; restarting the Founding offer; "compare at" prices; invented values; urgency in any memorial context.

## B16. Build list (for the integration owner; this doc changes no code)

1. `catalog.ts`: **extra dog +$15**, **Triptych $199**, **Diptych $139**, Framed Triptych $249. Implement as bundles with server-side real-saving logic, like the Heirloom Set.
2. Stripe `setup_future_usage` + **post-purchase one-click** (Family Copy, 2nd-style print) on the thank-you page.
3. **Referral program**: Give $15 / Get $15 credit, the "who" ask on the thank-you page, and Gift Reveal page credit.
4. **GWP rule**: buy two pieces → two ornaments free, Nov 1–Dec 10 (server-side, date-gated).
5. Guarantee copy: likeness service guarantee, Recipient's Choice, memorial "until it's them", and the Holiday Arrival Promise (if approved). Align the cutoff to Dec 10.
6. **Rollover credit** for digital-only buyers ($29, 30 days, on $99+).
7. Lead magnets: phone lockscreen, holiday card, "Surprise a Friend" (rate-limited), photo check, Wall Fit.
8. **Monthly Portrait Draw** page with official rules (US-only entry recommended; counsel review).
9. Birthday capture + Holiday Portrait opt-in (one-tap annual approval; ARL-compliant).
10. Gift cards with a promotional bonus card (labeled; Reg E).
11. Nurture step 3 A/B: WELCOME10 vs 48-hour free ornament.
12. Admin scorecard: CAC by channel, 30-day GP per buyer, CFA ratio.

## B17. Decisions for the founder
1. Adopt the **Holiday Arrival Promise** (~$3 per eligible order at 3% late)? If yes, the cutoff is **Dec 10**.
2. Replace BFCM 20% with a **free Heirloom Set**?
3. Replace "gift two, 25% off the second" with "**buy two, get two ornaments free**"?
4. Test **$109** on the hero canvas, Jan 15–Feb 15?
5. Adopt **Recipient's Choice** (~$1.20 per gift order)?
6. Test "keep the file" on refunds (better than money back)?
7. With warm outreach excluded, re-baseline the week-1 targets in `00-week1-war-plan.md`.

---

## Sources

**Primary: Hormozi's own audiobook releases on *The Game* (podscripts.co transcripts) and publisher text**
- <a id="s-offers2"></a>$100M Offers, Part 2 (pricing, market): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-2-100m-offers-book
- <a id="s-offers3"></a>$100M Offers, Part 3 (value equation): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-3-100m-offers-book
- <a id="s-offers4"></a>$100M Offers, Part 4 (Grand Slam Offer, trim and stack): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-4-100m-offers-book
- <a id="s-offers5"></a>$100M Offers, Part 5 (scarcity, urgency): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-5-100m-offers-book
- <a id="s-offers6"></a>$100M Offers, Part 6 (bonuses, guarantees): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-6-100m-offers-book
- <a id="s-offers7"></a>$100M Offers, Part 7 (naming, MAGIC): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-7-100m-offers-book
- <a id="s-magic"></a>The M.A.G.I.C. Offer Formula, Ep 562: https://podscripts.co/podcasts/the-game-with-alex-hormozi/the-magic-offer-formula-ep-562
- <a id="s-leads2"></a>$100M Leads, Part 2 (engage your leads, lead magnets): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-2-engage-your-leads-100m-leads-book
- <a id="s-leads3"></a>$100M Leads, Part 3 (Core Four, warm outreach): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-3-warm-outreach-100m-leads-book
- <a id="s-leads4"></a>$100M Leads, Part 4 (post free content): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-4-post-free-content-100m-leads-book
- <a id="s-leads7"></a>$100M Leads, Part 7 (Core Four on steroids: Rule of 100, More/Better/New): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-7-core-four-on-steroids-100m-leads-book
- <a id="s-leads8"></a>$100M Leads, Part 8 (customer referrals, lead getters): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-8-customer-referrals-100m-leads-book
- <a id="s-leads10"></a>$100M Leads, Part 10 (affiliates and partners): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-10-affiliates-and-partners-100m-leads-book
- <a id="s-r100"></a>The Rule of 100, Ep 248: https://podscripts.co/podcasts/the-game-with-alex-hormozi/the-rule-of-100-ep-248
- <a id="s-audible"></a>$100M Money Models, publisher description: https://www.audible.com/pd/B0FN4VZJGK
- <a id="s-mm2"></a>Money Models, Part 2 (what is a money model): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-2-what-is-a-money-model-100m-money-models-audiobook
- <a id="s-mm3"></a>Money Models, Part 3 (attraction: Win Your Money Back, Giveaways): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-3-attraction-offers-100m-money-models-audiobook
- <a id="s-mm4"></a>Money Models, Part 4 (attraction: Decoy, Buy X Get Y, Pay Less Now; "Free Goodwill"): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-4-attraction-offers-continued-100m-money-models-audiobook
- <a id="s-mm5"></a>Money Models, Part 5 (upsells): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-5-upsell-offers-100m-money-models-audiobook
- <a id="s-mm6"></a>Money Models, Part 6 (downsells): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-6-downsell-offers-100m-money-models-audiobook
- <a id="s-mm7"></a>Money Models, Part 7 (continuity): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-7-continuity-offers-100m-money-models-audiobook
- <a id="s-mm8"></a>Money Models, Part 8 (making your money model): https://podscripts.co/podcasts/the-game-with-alex-hormozi/part-8-making-your-money-model-100m-money-models-audiobook
- <a id="s-lc7"></a>$100M Lost Chapters §7 (CFA definition, the 2× "real life minimum standard"): https://pod.wave.co/podcast/the-game-with-alex-hormozi/7-section-b-the-expensive-customer-problem-100m-lost-chapters-audiobook
- <a id="s-lc8"></a>$100M Lost Chapters §8 (the three levers: CAC, LTGP, payback): https://pod.wave.co/podcast/the-game-with-alex-hormozi/8-the-three-levers-of-cfa-100m-lost-chapters-audiobook
- Acquisition.com free Money Models course page (marketing claims, e.g. "5–10×", "Fast Cash"): https://www.acquisition.com/mm-oo

**Secondary summaries (cross-checks only)**
- Business Book Club, $100M Money Models summary: https://businessbookclub.substack.com/p/100m-money-models-by-alex-hormozi
- howtoes.blog, $100M Money Models summary: https://howtoes.blog/2026/07/24/100m-money-models-alex-hormozi-complete-book-summary-all-key-ideas/
- ursummary.com, $100M Money Models: https://ursummary.com/100-million-dollar-money-models-summary-alex-hormozi/
- My First Million wiki, Money Models: https://myfirstmillion.wiki/articles/money-models

**Legal and compliance (not legal advice; confirm with counsel)**
- <a id="s-ftcfree"></a>FTC Guide Concerning Use of the Word "Free", 16 CFR 251.1: https://www.law.cornell.edu/cfr/text/16/251.1
- <a id="s-ftcreview"></a>FTC Consumer Reviews and Testimonials Rule, 16 CFR 465 (effective Oct 21, 2024): https://search.ftc.gov/system/files/ftc_gov/pdf/2025-Fake-Review-Warning-Template.pdf · https://crowell.com/en/insights/client-alerts/final-rule-announced-the-ftc-strengthens-its-enforcement-capacity-against-deceptive-reviews-and-testimonials
- <a id="s-google"></a>Google Business Profile, prohibited content (incentivized reviews): https://support.google.com/business/answer/3474122
- <a id="s-sweeps"></a>Olshan, sweepstakes law basics (NY/FL registration above $5,000): https://www.olshanlaw.com/sweepstakes-law-basics
- <a id="s-carda"></a>Reg E gift card rule (CARD Act), Federal Register, Apr 1, 2010: https://www.govinfo.gov/content/pkg/FR-2010-04-01/html/2010-6759.htm
- <a id="s-c2c"></a>Greenberg Traurig, "Eighth Circuit Vacates FTC's Click-to-Cancel Rule" (July 2025): https://www.gtlaw.com/en/insights/2025/7/eighth-circuit-vacates-ftcs-click-to-cancel-rule
- <a id="s-caarl"></a>Davis Wright Tremaine, "AB 2863 Updates California Automatic Renewal Law": https://www.dwt.com/insights/2024/10/ab-2863-updates-california-automatic-renewal-law

**Unverified (search quota ran out):** Printful's charge timing on order confirmation, and Stripe's US payout schedule. Both affect only the payback-timing note in §B10, not the CFA ratios.
