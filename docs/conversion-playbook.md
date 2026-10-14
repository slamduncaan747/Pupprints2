# Conversion Playbook: the Grand Slam Offer, in couture

**As of:** 2026-10-14 (launch week 1)
**Scope:** the marketing site (`web/src/app/(site)/**`, `components/home|marketing|site/**`). The create flow and checkout are owned separately; requests for them are at the end.
**Sources of truth:** offer copy and data in `web/src/lib/offer.ts` (OFFER, GUARANTEE, VALUE_STACK, HEIRLOOM_SET, FOUNDING_OFFER, HOLIDAY, FORMAT_SHOWCASE) and `web/src/lib/launch.ts` (FOUNDING). Prices, sizes and ship times come from `web/src/lib/catalog.ts`. Nothing on the site restates a number by hand.

The brief from the founder: use marketing and design principles (Alex Hormozi's *$100M Offers* and *$100M Leads*) to improve conversion drastically, keep the luxury fashion-house look, and show every format with the same picture so people compare formats, not pictures.

---

## 1. The value equation, applied

Hormozi's value equation:

> **Value = (Dream outcome × Perceived likelihood of achievement) ÷ (Time delay × Effort and sacrifice)**

Raise the top, shrink the bottom. Our product is unusually strong on all four, because the free preview turns "trust us" into "see for yourself". The old site hid most of that behind couture silence: the home page said "Your dog, immortalized." and "Commission yours", and never said *free*, *a minute* or *guaranteed* above the fold. The audit below compares the site before this change (commit `453e508`) and after.

### 1.1 Dream outcome: "my dog, as art on my wall (or a gift that makes someone cry)"

| | Before | After |
|---|---|---|
| Hero | Triptych and "Your dog, immortalized." Nothing about what you get or how. | Same triptych and headline, plus `OFFER.promise` ("See your dog as a work of art in about a minute — free. Love it, or it's free.") and one black button, `OFFER.cta`. |
| Styles | 12-tile grid linking to /create, no framing. | The same 12 portraits as one strip (swipe on phones, 6×2 on desktop), headed "12 styles. Try every one with your own photo, free." Each tile still opens /create in that style. |
| The finished object | Four pieces, each shown with a **different** style, so you compared dogs, not formats. | **"Same portrait, four ways"**: canvas, framed, print and digital all show `FORMAT_SHOWCASE.src`. On /shop each format lists what it is, sizes, arrival time and from-price, aligned row by row. Product pages show that same portrait in each frame color (framed), or as the piece plus a to-scale room view (canvas, print). Gift price bands show it hung to scale at the size each band buys. |
| Gifts | "A portrait of their dog". | "Give it today. Hang it in days.", with the Gift Reveal steps moved straight under the hero. |

### 1.2 Perceived likelihood: "will it actually look like *my* dog, and what if it doesn't?"

| | Before | After |
|---|---|---|
| Proof | Portrait/photo diptych with a caption-style statement. | The same diptych, reframed as **"An example from our studio"** (honest: it is not a customer), with three timed steps: the photo, the preview (about a minute, free, redo as often as you like) and the piece (Gift Reveal the moment you order, at your door in 4–9 business days). |
| Guarantee | One grey line in the home page's closing section; the /guarantee page called it "Love it, or it's on us." | Named everywhere as **The Love-It Guarantee** (`GUARANTEE.name`). It closes the value stack, gets its own full-width section on the home page ("You see it before you pay. Then you're covered after."), sits in the purchase column of every product and style page, and the /guarantee page now leads with the name and `GUARANTEE.body`. |
| Objections | None on the home page. | Five-question FAQ: *Will it look like my dog? Is it AI? What if I don't love it? When will it arrive? Is my photo private?* Answers are plain and honest (the AI answer says what it is, "finished and checked by our team", never hand-painted). |
| Style pages | "Commission in this style", "Pay only if you love it". | "You'll see your own dog in {style} before you pay.", then the CTA, the effort line and the guarantee. |
| Social proof | None (we have zero reviews). | Still none, by rule. Likelihood comes from the free preview, the studio example and the guarantee. |

### 1.3 Time delay: "how long until I have it?"

| | Before | After |
|---|---|---|
| Preview | "See it in a minute" appeared once, mid-page. | "About a minute" is in the hero promise, the effort line under every primary CTA, the proof steps, and the /how-it-works headline ("One photo. About a minute."). |
| The gift moment | Gift Reveal was one clause in the /gifts lede; its steps sat below six occasion stories. | Gift Reveal is in the value stack ("Instant Gift Reveal to send the same day"), the proof steps, the top of /gifts, and the home FAQ. |
| Delivery | Ship windows on product pages and the /shop price list. | Ship windows (from `catalog.shipDays`) in the /shop comparison, the proof steps and the FAQ. `HOLIDAY.label` and `HOLIDAY.reveal` lead /gifts until the Dec 10 cutoff. |

### 1.4 Effort and sacrifice: "what do I have to do, and what does it cost me to find out?"

| | Before | After |
|---|---|---|
| Effort | Implicit. | Said plainly under every primary CTA: **"No account. No card. About a minute."** /how-it-works opens with four facts in large type: *One photo · About a minute · Nothing (to sign up) · Free, no card*. |
| Cost to try | "Free" never appeared above the fold, and the CTA ("Commission yours") sounded like a paid commission. | "Free" is in the hero promise, the CTA itself ("Create your free portrait"), the header link ("Create free") and the first two value-stack rows. |
| Decision load | Four products, four pictures, prices on separate pages. | One portrait across the formats, one comparison grid, "From $35" next to everything included. |
| CTA clarity | "Commission", "Commission yours", "Commission a portrait", "Commission in this style", "Start a gift portrait", "Start now". | One CTA site-wide: `OFFER.cta` ("Create your free portrait"). The header says "Create free". The top line says `OFFER.ctaShort` ("Start free"). |

### 1.5 The offer levers beyond the equation

| Lever | Before | After |
|---|---|---|
| **Value stack** | A 5-row "With every physical piece" list on /shop only. | `VALUE_STACK` as a hairline list (item left, value right: *Free* / *Included*) on the home page, /shop and every physical product page, closing with The Love-It Guarantee, then the price and the CTA. No invented "worth $X" figures: items we don't sell alone say *Included*, and the digital file's real standalone price ($29) is stated. |
| **Price anchor** | None. | `OFFER.anchor` beside "From $35": hand-painted commissions typically cost $150–$500 and take weeks (from `docs/research/competitors.md`). The anchor is a real market range, not a fake "compare at" price. |
| **Scarcity** | None. | **The Founding 100**: 15% off our first 100 orders, a real cap counted by Stripe. A black band on the home page, a line near prices on /shop and physical product pages, and the top line. When `/api/offer` returns a real `remaining` number we show "N of 100 founding spots left"; otherwise no count at all. |
| **Urgency** | None. | Real deadlines only: founding ends Oct 31 at 11:59pm PT ("Never extended"); from Nov 1 the top line switches to "Order by Dec 10 for Christmas delivery in the US"; after Dec 10, "Gift Reveal can be sent instantly, right up to Christmas Day". No timers. Pages regenerate hourly, and the browser hides founding copy the moment the API says the offer is closed. |
| **Bonuses / bundle** | Add-ons listed on /shop. | **The Heirloom Set** (`HEIRLOOM_SET`): the portrait plus the matching ornament ($19) and mug ($25), $34 together instead of $44. Shown as a premium option on the home page and /shop, always "added at checkout, never pre-selected". |
| **Naming** | Generic. | Named things are easier to remember and believe: *The Love-It Guarantee*, *The Founding 100*, *The Heirloom Set*, *Gift Reveal*. |
| **Free value up front** (*$100M Leads*: give away the best thing for free) | Present, under-sold. | The free preview is the lead magnet and now the headline promise. Every CTA leads to it. |

---

## 2. The Grand Slam Offer, as built

> **Create your free portrait.** See your dog as a work of art in about a minute, free. No account, no card.
>
> **Everything included, from $35:**
>
> | | |
> |---|---|
> | Your portrait, previewed before you pay | Free |
> | Try every style, redo as often as you like | Free |
> | Hi-res digital file (sold alone for $29) | Included |
> | Instant Gift Reveal to send the same day | Included |
> | Checked by a person before it's printed | Included |
> | Free US shipping | Included |
> | The Love-It Guarantee | Included |
>
> *Hand-painted pet commissions typically cost $150–$500 and take weeks.*
>
> **The Founding 100:** 15% off for our first 100 orders, through Oct 31. Applied automatically. Never extended.
>
> **The Heirloom Set:** add the matching ornament and mug together and save $10.
>
> **The Love-It Guarantee:** if you don't love your piece, tell us within 30 days of delivery. We'll remake it in any style or refund you in full. No forms, no hoops. *You see it before you pay. Then you're covered after.*

### Home page, top to bottom (each section moves one lever)

1. **Top line** (site-wide, dismissible): the single best real offer right now. Founding (to Oct 31), then the Christmas cutoff (Nov 1 to Dec 10), then Gift Reveal (to Dec 25), then the standing promise.
2. **Hero**: dream outcome ("Your dog, immortalized."), free and fast (`OFFER.promise`), one button, the effort line. On phones the image is cropped square so the button sits above the fold at 390×844.
3. **Proof**: a real phone photo beside its portrait, labelled as a studio example, plus the three timed steps.
4. **The Collection**: 12 styles, each a one-tap start.
5. **Same portrait, four ways**: the formats, compared honestly.
6. **Everything included**: the value stack, "From $35", the anchor, the CTA.
7. **The Founding 100**: real scarcity and a real deadline, with the live count when it exists.
8. **The Heirloom Set**: the premium bundle.
9. **The Love-It Guarantee**: risk reversal, said once and large.
10. **Questions, answered**: five objections.
11. **Closing**: "Begin with a photograph.", the CTA and the effort line.

Removed: the standalone "Process" block (its content now lives in the proof steps) and the "Objects" block (replaced by the same-picture comparison).

### Other pages

- **/shop**: "Same portrait, four ways" comparison (what it is / sizes / arrives / from), founding line, value stack with price and anchor, the guarantee, the price list, and the Heirloom Set.
- **/shop/[type]**: same-portrait gallery (all frame colors, or the piece plus a to-scale room view). The CTA now comes before the size table. Below it: effort line, ship line, founding line, sizes, guarantee. Then a value stack block with "Your price". The "other ways to hang it" row uses the same portrait.
- **/styles/[slug]**: the see-it-first promise, CTA, effort line and guarantee. The "Made to hang" row shows every format with *that style's* sample (one picture per row; showing The Royal on the Watercolor page would read as the wrong style).
- **/guarantee**: titled The Love-It Guarantee, `GUARANTEE.body` as the lead.
- **/how-it-works**: "One photo. About a minute.", with the CTA and four effort facts before anything else.
- **/gifts**: "Give it today. Hang it in days.", the holiday cutoff and Gift Reveal lines, the CTA, and the Gift Reveal steps first. Price bands show the same portrait hung to scale.
- **Everywhere**: CtaBand defaults to `OFFER.cta` plus the effort line. The header link says "Create free". The footer and running copy use the guarantee's name.

---

## 3. Guardrails we kept

All of these are binding (CLAUDE.md):

- **No fabricated proof.** No reviews, ratings, customer counts, press or "as seen on". The proof section is labelled as a studio example.
- **Scarcity and urgency are real.** The founding cap is counted by Stripe and the count shows only when the API returns a number. Deadlines come from `launch.ts` and `offer.ts`. Nothing is extended or restarted, there are no countdown timers, and copy disappears when the offer closes.
- **No fake value.** The value stack uses *Free*, *Included* or a real price. The anchor is a real market range, not a "compare at" price.
- **Honest about AI.** The home FAQ answers "Is it AI?" with "Yes. Our AI artist creates your portrait… our team finishes and checks every piece… It's never hand-painted."
- **Luxury look kept.** Bodoni and `.label` type, hairlines, zero radius, no badges or chips, no accent colors (the founding band is ink on paper inverted), functional icons only (the top-line close ×).

---

## 4. Measurement: what to watch before testing

Funnel events already exist (`track()` in `lib/analytics.ts`): `ViewContent`, `UploadPhoto`, `GeneratePreview`, `PreviewReady`, `SelectProduct`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`.

Read these weekly by landing page and by device:

1. **Preview-start rate**: sessions reaching /create ÷ sessions. This is the home page's job.
2. **Upload rate**: `UploadPhoto` ÷ /create sessions.
3. **Preview → checkout**: `InitiateCheckout` ÷ `PreviewReady`.
4. **CVR**: `Purchase` ÷ sessions. **AOV** and **Heirloom Set attach rate** (both add-ons in one order).
5. **Guardrails**: remake/refund rate (≤3%), support tickets about "this isn't what I expected", unsubscribe rate.

**Traffic reality** (from `docs/research/growth.md`): at 5–10K sessions a month, an A/B test can only detect big effects, roughly a 25%+ relative change. So:

- Use **upstream primary metrics**: preview-start rate, with a baseline in the 15–30% range, needs about 1–3K sessions per arm for a 25% lift. Purchases at 1–2% CVR would need 15K+ per arm.
- Run one test per page at a time, for at least 2 full weeks (weekday/weekend mix) or until the planned sample is reached. Never stop early on a "win".
- Split with a first-party cookie in `proxy.ts` and log the variant as a property on every `track()` call. Vercel Flags or Edge Config work too. Keep variants server-rendered so there's no flicker.
- Missing instrumentation, to add first: a `variant` property on funnel events, and a `cta` source on links to /create (e.g. `?src=home-hero`, read and dropped in the create flow) so we can see which CTA earns the click.

---

## 5. Ten A/B tests to run once traffic exists

These complement the create-flow backlog in `docs/research/growth.md` §3.4 (email ask placement, room mockup default, default product, style count, bundle placement, ad-angle landers, December messaging). These are marketing-site tests.

| # | Test | Hypothesis | Variant(s) | Primary metric | Success = | Guardrail |
|---|---|---|---|---|---|---|
| 1 | **Hero headline** | Stating the mechanism (free + a minute) in the headline beats the poetic line, because cold Instagram traffic doesn't yet know what we do. | A: "Your dog, immortalized." + promise line. B: "See your dog as a work of art. Free, in a minute." | Preview-start rate (home) | B ≥ +20% relative, p < 0.05 | Bounce rate; brand-search share (don't cheapen the brand) |
| 2 | **Proof in the hero** | Showing the before/after *in* the hero raises perceived likelihood at the moment of decision. | A: campaign triptych. B: phone photo → portrait diptych as the hero image, same copy. | Preview-start rate; upload rate | +20% preview starts with upload rate flat or up | Scroll depth |
| 3 | **CTA wording** | "Free" and "your dog" in the button beat a generic verb. | A: "Create your free portrait". B: "See your dog as art, free". C: "Start free". | Click-through to /create from the hero | Best arm +15% over A | Upload rate (B/C mustn't attract low-intent clicks) |
| 4 | **Effort line** | Removing perceived effort and risk under the button lifts clicks. | A: "No account. No card. About a minute." B: no line. C: "No card. About a minute. Love it, or it's free." | Hero CTA click-through | A or C ≥ +10% over B | none |
| 5 | **Value stack position** | Seeing everything included *before* the formats frames the price as a bargain. | A: formats → stack (current). B: stack → formats. | Preview → checkout (sessions that saw the section) | +10% | AOV |
| 6 | **Price anchor** | The hand-painted anchor ($150–$500, weeks) makes "From $35" feel like a steal without making us look cheap. | A: anchor shown. B: anchor hidden. | InitiateCheckout ÷ PreviewReady | A ≥ B + 10% | AOV (anchor shouldn't push people to the cheapest print) |
| 7 | **Founding count** (only while the API returns a real count) | A visible, real, shrinking count adds urgency beyond the deadline. | A: line + "N of 100 founding spots left". B: line only. | Purchase CVR during the offer window | A ≥ B + 15% | Refund rate; support "is this real?" questions |
| 8 | **Heirloom Set on the home page** | Introducing the bundle before the preview raises attach rate at checkout. | A: Heirloom section on home. B: no section (checkout only). | Orders with both add-ons ÷ physical orders | +25% attach | Preview-start rate (mustn't fall) |
| 9 | **Guarantee placement** | Risk reversal next to the price beats a separate section. | A: separate section (current). B: guarantee block inside the value-stack section, separate section removed. | Preview → checkout | +10% | Page length / scroll completion |
| 10 | **/shop default order** | Leading with the most giftable, ready-to-hang piece raises revenue per session vs. leading with canvas. | A: Canvas, Framed, Print, Digital (current). B: Framed, Canvas, Print, Digital. C: by price (Print first). | Revenue per /shop session (CVR × AOV) | Best arm +10% RPS | CVR (C may lift CVR but cut AOV) |

**Seasonal follow-ups** (run as sequential before/after reads, not splits, because the calendar changes demand):

- **Nov 1**: the top line switches from founding to the Christmas cutoff. Compare week-over-week preview starts and CVR.
- **Dec 13**: the line switches to Gift Reveal. Watch last-minute CVR. The growth doc forecasts Gift Reveal-led December demand.

---

## 6. Dependencies and open requests

- `/api/offer` (built separately) returns `{ founding: { open, remaining, percentOff, deadline } }`. The site reads it once per page view and degrades quietly. With no Stripe key, `remaining` is null and no count is shown.
- **The founding line says "Applied automatically."** `/api/checkout` auto-applies FOUNDING100 while Stripe says it's redeemable (`pickCheckoutDiscount`); a better creator discount wins. If that logic ever changes, change `FOUNDING_OFFER.line` with it.
- **The Heirloom Set saving** ($10 off when both add-ons are in an order with a physical piece) is applied by `/api/checkout` (`heirloomSets()`). The home page and /shop quote it from `HEIRLOOM_SET`.
- **Value-stack rows are literally true per product.** Physical product pages use `valueStackFor({ productType, shipCountry: "US" })`, so the Fine Art Print says "Free US shipping, tracked" rather than "ready to hang". The home page and /shop use the generic `VALUE_STACK`.
- **The top line's holiday logic** uses `holidayNotice()`: the cutoff line from Nov 1 to Dec 10, then Gift Reveal until Dec 25. /gifts shows the Dec 10 cutoff now, because gift planners want it early.
