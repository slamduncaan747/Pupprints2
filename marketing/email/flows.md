# Email Flows: copy + what the site actually sends

This doc covers two kinds of copy:
- Copy that **matches what the site already sends**, from `web/src/lib/email/templates.ts` via Resend. The lifecycle cron is `/api/cron/lifecycle`.
- Copy for the flows the site **doesn't send yet**, which you either send by hand or hand to engineering.

**Voice:** warm, witty, confident, outcome-first. Never lead with "AI."

**Honesty rules for every email:**
1. Only real codes with real limits.
2. Never invent an expiry, and never call it the "last chance" unless it actually is.
3. No review incentives.
4. Physical-goods timing is always "about 1–2 weeks" or the computed "Arrives by" date. Never "tomorrow."

---

## 0. Status board (as of Oct 13)

| Flow | Trigger | Sent by the site today? | Action |
|---|---|---|---|
| Order confirmation (+ Gift Reveal + hi-res file) | Payment succeeds | ✅ Yes (`orderConfirmationEmail`) | None |
| Gift Reveal email to recipient | Buyer chose "send now" with a recipient email | ✅ Yes (`giftRevealEmail`) | None |
| Shipped | Order marked shipped | ✅ Yes (`shippedEmail`) | None |
| Review request | 7 days after the shipped email | ✅ Yes (`reviewRequestEmail`) | **Set the `REVIEW_URL` env var** to the Google review or Trustpilot link. Today it falls back to a `mailto:`. |
| Preview nurture, 3 steps | Lead saved a preview (or AI/checkout was down), no order | ✅ Yes (`nurtureEmail`, at ~2h / ~24h / ~72h) | See §2 for the Founding-100 conflict on step 3 |
| **Welcome (WELCOME10)** | Footer or newsletter signup | ❌ **No.** The form *says* "Your code WELCOME10 is on its way," but no email is sent | **Engineering:** send §1 E1 on signup. Until then, send it by hand daily from the Admin → Leads export, or change the form copy to show the code on screen. |
| Win-back | 14+ days after the nurture ends / 45+ days after delivery | ❌ No | Manual sends from week 3 (§5). Nobody has lapsed yet. |

**Compliance gaps to fix this week (engineering, 15 minutes):**
- CAN-SPAM requires a **physical postal address** in marketing emails (nurture, welcome, review, win-back). The footer has unsubscribe but no address. Add a PO box or virtual mailbox address to `lib/email/layout.ts`.
- **Check the sender domain.** `EMAIL_FROM` and `NEXT_PUBLIC_SUPPORT_EMAIL` default to `@pupprints.com`. Point them at a domain you own and have verified in Resend (SPF/DKIM), e.g. `hello@pupprints.shop`.

---

## 1. Welcome series (WELCOME10)

**About the code:**
- **WELCOME10** is a real Stripe promotion code: 10% off, first order only, no expiry. **Don't invent one.**
- While **Founding 100** is live (until 100 redemptions or Oct 31, 11:59pm PT), mention it as well. It's the better deal, and codes don't stack.

### E1: immediately
- **Subject:** Your 10% code is inside (plus a free portrait of your dog)
- **Preheader:** WELCOME10 takes 10% off your first order. The preview is free either way.
- **Body:**
  > Welcome to Pup Prints! 🐾
  >
  > Here's your code: **WELCOME10**, 10% off your first order.
  >
  > *Founding bonus:* while it lasts, **FOUNDING100** takes **15%** off instead (first 100 customers, through Oct 31). Use whichever is better. Only one code per order.
  >
  > The best part is free: upload one photo and see your dog as a fine-art portrait in about 30 seconds. No card, no catch.
  >
  > **[Make my dog's portrait →]** (`/create?utm_source=email&utm_medium=email&utm_campaign=welcome_e1`)
  >
  > Every price includes free US shipping and the hi-res file, and if you don't love it, we remake it or refund you.

### E2: day 2 (skip if they've made a preview)
- **Subject:** Royal, watercolor, or "museum serious"?
- **Preheader:** Try every style on your dog. It's free and takes 30 seconds.
- **Body:**
  > Can't decide what your dog is? You don't have to. Previews are free, so try them all.
  >
  > 👑 **The Royal**, for dogs with a nickname that includes a title
  > 🎖️ **The Admiral**, for the distinguished gentleman
  > 🎨 **Watercolor**, soft, luminous, and a favorite for memorial pieces
  > ✍️ **Fine Line**, minimalist ink for modern walls
  >
  > **[Try them on my dog →]**
  >
  > Tip: a sharp, eye-level photo in daylight gives the best likeness.

### E3: day 5 (skip if they've ordered)
- **Subject:** The gift you can give today (it arrives later)
- **Preheader:** Send a Gift Reveal the moment you order. The print follows.
- **Body:**
  > Shopping for a dog person? Here's our favorite trick: order their dog's portrait and **send the Gift Reveal link right away**. It's a beautiful little unveiling they can open on their phone today, while the canvas is printed and shipped.
  >
  > • Free preview first, so you only pay for one you love
  > • Free US shipping, hi-res file included
  > • Every portrait checked by a person before printing
  > • Love it, or we remake it or refund you
  >
  > **[Make a gift →]** (`/gifts`)
  >
  > Your code **WELCOME10** is still good for your first order.

---

## 2. Preview-abandon nurture (3 steps, already live)

**Triggers:** a lead with `source` = `save_preview` / `ai_unavailable` / `checkout_unavailable`, consent given, no order. The steps run at **~2h, ~24h and ~72h**, at least 20h apart. Leads older than 10 days are never emailed. Each email shows **their actual preview**.

| Step | Subject (live copy) | What it says | Notes |
|---|---|---|---|
| 1 (~2h) | **"Your portrait of [Pet] is waiting"** (or "Our studio is ready for [Pet]" if the AI was busy, or a "checkout is open again" variant) | "We saved [Pet]'s portrait for you. Pick a size and finish whenever you're ready." + the framed preview + **See my portrait** + "Not quite right? Try another style. Previews are always free." | No discount. Calm, no pressure. |
| 2 (~24h) | **"What's included with every Pup Prints portrait"** | The preview + free US shipping · free hi-res file · checked by a person · love-it guarantee → **Choose a size** | The trust email. |
| 3 (~72h) | **"10% off [Pet]'s portrait, until [weekday]"** | A **personal single-use code** `WELCOME10-XXXXX`, valid **48 hours** (a real Stripe expiry) → **Use my code**. "After it expires, this is our last email about this preview." | If Stripe isn't configured, it sends "Still thinking about [Pet]'s portrait?" as the last reminder, with no code. |

**Founding-100 conflict (fix for Oct 13–31):** step 3 offers a personal **10%** code while the public FOUNDING100 gives **15%**. A customer who has seen both will feel short-changed. Two options:
- **(a) Engineering, ~5 min, best:** while FOUNDING100 is active, create the personal code on a 15% coupon. Same expiry and single-use rules.
- **(b) Copy-only:** add one line to step 3: "Or use **FOUNDING100** for 15% off. It's for our first 100 customers, through Oct 31."

**Suggested copy upgrades** (optional, for engineering when there's time):
- **Step 1 subject A/B:** "[Pet] is still in the velvet robe 👑" vs the current subject. Keep the current one for memorial-style previews.
- **Step 2:** add a room mockup of their preview above the list ("Here's how [Pet] looks above a sofa").
- **Memorial track** (style = watercolor/old-master + memorial occasion): drop step 3's discount, change the step 1 subject to "We saved [Pet]'s portrait for you," and never use urgency.

---

## 3. Post-purchase (already live)

### Order confirmation (immediately)
- **Subject:**
  - Physical: **"Your Pup Prints order [#] is confirmed"**. Preheader: "Thank you! We'll check [Pet]'s portrait by hand, then print and ship it (arrives [date])."
  - Digital: **"Your portrait of [Pet] is ready to download"**
- **Body (live):**
  - "Thank you, [Name]."
  - **Your Gift Reveal**: "A beautiful, shareable reveal of the finished portrait, no prices, just the art."
  - **Your free hi-res file** (download link)
  - Order summary
  - **What happens next:** we check your portrait by hand within one business day → printed and finished with archival inks → shipped with tracking, expected [Arrives by].

### Gift Reveal (to the recipient, when "send now" is chosen)
- **Subject:** **"[Sender] made you something"**
- **Preheader:** "A portrait of [Pet], made just for you. Tap to open."
- **Body:** "[Recipient], [Sender] made you something." → **Open your gift** → "Something you can hold is on its way, too."

### Shipped
- **Subject:** **"[Pet]'s portrait is on its way"**
- **Preheader:** "Order [#] has shipped with [carrier]. Expected [date]."

### Founder's personal touch (manual, week 1 only; huge for trust)
Within a few hours of each of the first ~30 orders, reply to the customer from your own inbox:

> Hi [Name]! I'm [First name], the founder. I just checked [Pet]'s portrait myself before it goes to print, and [one specific true detail: "the little white patch on his chest came out perfectly"]. It'll ship in the next few days and you'll get tracking by email. If anything at all isn't right when it arrives, just reply here and I'll make it right. Thank you for being one of our very first customers. 🐾

---

## 4. Review request (already live: 7 days after the shipped email)

- **Subject:** **"How does [Pet] look on the wall?"**
- **Preheader:** "An honest review (and a photo, if you're up for it) helps a small studio more than you'd think."
- **Body (live):**
  - "[Name], how did we do? [Pet]'s portrait should have arrived by now. We're a new, small studio, and an honest review, good or not, helps other dog people decide and helps us get better."
  - **Leave an honest review**
  - "A photo of it on the wall (with the real dog nearby, ideally) would make our week. Just reply with it attached."
  - Callout: "Something not right? Don't leave it. Reply and we'll remake it or refund you."
- **To do:** set `REVIEW_URL` to the Google Business Profile review link (or Trustpilot). Never offer anything in exchange for a review (FTC 16 CFR 465).
- **UGC ask (separate, manual, after a happy reply):** "Could we share your photo on @pupprints? Reply YES and we'll credit you (first name only unless you say otherwise)." Keep the YES on file.

---

## 5. Win-back (manual from week 3; engineering later)

**Send rules:**
- Only to people with marketing consent who haven't unsubscribed. Use the Admin → Leads export.
- Include the unsubscribe link and postal address.
- At most one win-back per person per occasion.

### W1: previewed, never bought, nurture finished (day 14+)
- **Subject:** We painted [Pet] in a new style
- **Preheader:** It's free to look. The holiday style just arrived.
- **Body:**
  > [Pet]'s first portrait is still saved, and from Nov 1 there's a brand-new **Holiday Cozy** style (knit scarf, fireplace, twinkle lights). Want to see [Pet] in it? It's free and takes 30 seconds.
  >
  > **[See [Pet] in Holiday Cozy →]**
  >
  > Planning gifts? Physical orders placed by **Dec 10** arrive before Christmas (standard shipping), and a Gift Reveal can go out any day, including Christmas morning.
- **Notes:** only send the Dec 10 date once ops confirms it (strategy cutoff). **No discount in W1.** The new style is the reason to come back.

### W2: bought once, 45–60 days after delivery
- **Subject:** Know a dog who deserves this too?
- **Preheader:** Paint a friend's dog, no new photo of yours needed.
- **Body:**
  > [Pet] has been on the wall for a while now (we hope they're still smug about it 👑). If there's a dog person on your gift list, you can make their dog's portrait free in 30 seconds, then send a Gift Reveal the moment you order.
  >
  > **[Paint a friend's dog →]**
  >
  > Want [Pet] on a mug or ornament too? Reply and we'll set it up from your original portrait. No new photo needed.

### W3: lapsed leads before a real deadline (only when the deadline is real)
- **Subject:** Ordering for Christmas? The real cutoff is [Dec 10]
- **Body:** a plain, factual cutoff reminder, plus "the Gift Reveal works right up to Dec 24." No countdown timers, no fake "final hours."

---

## 6. Measuring the flows

| Metric | Healthy (week 1–4) |
|---|---|
| Preview → email captured | ≥ 40% |
| Nurture step 1 click rate | ≥ 8% |
| Nurture-attributed orders | ≥ 3% of leads nurtured |
| Unsubscribe rate per send | < 0.5% |

**Where to look:**
- Admin → Leads: `nurture_step`, `converted_order_id`.
- Resend dashboard: opens and clicks, tagged `order_confirmation` / `shipped` / nurture.
