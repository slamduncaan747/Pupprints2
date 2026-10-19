# Launch today: first paying customers today (no personal network)

**Date:** Mon Oct 19, 2026. **Times are your local time.**
**Goal:** the site takes real money today, and at least one stranger pays before midnight.
**The one idea:** typical portrait shops make you pay, then wait days for a proof. We show a stranger *their own dog* as finished art in about a minute, then they buy on their phone while still looking at it. So the fastest path to a sale today is **in person**: go where dogs already are and make portraits on the spot. Online channels run alongside, but they mostly pay off tomorrow and later.

**Honest odds.** Most of today's sales odds come from block 3, the in-person pop-up.
- **Base case:** 40 conversations, 25 portraits, 2–4 orders.
- **Bad day:** 0–1 orders.

Nothing here is guaranteed. Every portrait you make today is also a lead you can convert tomorrow.

---

## 0. Before 1 pm: switch the money on (≈60 min, in this order)

Every variable goes in **Vercel → pup-prints → Settings → Environment Variables** (Production). Then **Redeploy** once at the end of this block. LAUNCH.md has the screenshot-level detail.

| # | Do | Why it matters today | Time |
|---|---|---|---|
| 1 | **Gemini key first:** aistudio.google.com → Get API key → enable billing on the project → `GEMINI_API_KEY`. | It works within minutes. OpenAI may need organization verification first, which can take a while. | 10 min |
| 2 | **OpenAI key:** platform.openai.com → Settings → Organization → Verify, add $10 credit → `OPENAI_API_KEY`. If verification is still pending, leave this out and Gemini carries today. The site uses whichever provider works. | Primary engine once verified. | 10 min (+ waiting) |
| 3 | **Stripe:** activate the account (business details + bank) → live secret key → `STRIPE_SECRET_KEY`. Add a webhook `https://pup-prints.vercel.app/api/webhooks/stripe` for `checkout.session.completed`, `checkout.session.async_payment_succeeded` and `charge.refunded` → `STRIPE_WEBHOOK_SECRET`. Settings → Payment methods: turn on **Apple Pay, Google Pay, Link**. Settings → Emails: turn on **successful payment receipts**. | No Stripe, no sale. Apple Pay is what makes a stranger pay in 10 seconds. Receipts give buyers an email today, before our own email is set up. | 20 min |
| 4 | **Your own admin password:** edit `ADMIN_PASSWORD` and set one you'll remember. The current value is a generated secret you can't read back. | You'll run the pop-up from `/admin` on your phone. | 2 min |
| 5 | **Vercel Pro** ($20/month) on the project. | The free Hobby plan is non-commercial. | 3 min |
| 6 | **Redeploy**, then log in at `https://pup-prints.vercel.app/admin` on your phone. | Picks up every key. | 3 min |
| 7 | **Prove it with your own card:** make a preview of any dog → buy the $29 digital file → the success page shows the order → it appears in `/admin/orders` as paid → refund yourself in Stripe. | If any step fails, fix it before talking to anyone. | 10 min |
| 8 | **Check quality on the real engine:** make 3 portraits (The Royal, Watercolor, Old Master) of one dog photo. Only go out if you'd hang them yourself. If the likeness is off, try the other provider by setting `AI_PROVIDER_ORDER=gemini,openai` (or the reverse) and redeploying. | The style instructions were rewritten this week and haven't run on the live engine yet. | 10 min |

**Can wait until tonight:** buying `pupprints.shop`, Resend email, Printful and pixels. Buyers can pay today; we approve and send prints to production tomorrow (`/admin/orders` → Approve & send to print).

---

## 1. 1–2 pm: what you take out the door

1. **50 QR cards.**
   - In `/admin/popup`, use **Print cards**: a code-free card that says "See your dog as a work of art, free", with a QR code that tracks as pop-up traffic. Print the A4 sheet (four cards per page).
   - Print at FedEx Office, Staples or a UPS Store, or at home on card stock. About $10–20.
2. **One physical reference piece** (optional, about $20):
   - Print the Royal sample at 8×10 at a photo counter and put it in a simple frame from Target or Michaels.
   - Call it "a size reference print", not our product. Our real pieces come from our print lab.
3. **Phone charged, plus a battery pack.** Each portrait takes about a minute of screen-on time.
4. **Pop-up mode open on your phone:** `/admin/popup`. Take a photo, pick a style, make the portrait, show the QR. *This is being deployed today; if it isn't live when you leave, use `/admin/gifts/new`, which does the same thing without the big QR. Copy the link and text it to them.*
5. **Instagram and TikTok accounts set up** (bio in `content/social-setup.md`), so "Where can I see more?" has an answer.

---

## 2. 2–3:30 pm: line up the venues (calls and walk-ins)

Pick **4–6 places within 15 minutes of you where strangers bring dogs between 4 and 7 pm**:
- independent pet supply stores (best: owners are there with dogs and wallets)
- dog-friendly brewery or café patios
- groomers and daycares at pickup time
- pet bakeries

**Ask the manager first.** It takes 30 seconds:
> "Hi, I'm launching a small studio that makes fine-art portraits of dogs. Could I offer your customers a free portrait for an hour this afternoon? I take a photo, they see their dog as a painting in about a minute. No selling at your counter, and I'll make one of your shop dog for you right now."

Then make the shop dog's portrait on the spot and give it to them. That is also your first partner conversation: their clients can get the card at the counter.

**Dog parks:** many city parks prohibit commercial solicitation or vending. Check your city's rules. At most, make free portraits for people who ask and hand over a card. No stand, no price talk unless they ask.

---

## 3. 3:30–7:30 pm: the pop-up (the main engine today)

**Target:** a new conversation every 5–6 minutes, about 40 in total, which should produce about 25 portraits.

**The loop, for every dog:**
1. **Open:**
   > "Hi! Can I show you something fun? I make portraits of dogs like a museum painting, and I can make one of [dog's name] right now, free. It takes about a minute."
2. **Photo:** ask first ("Can I take a quick photo of them?"). Eye level, face in good light, ears visible, no flash. Photograph the dog only, never the person.
3. **Style:**
   - big or serious dog: The Royal
   - senior, sweet or memorial: Watercolor or Old Master
   - modern owner: Fine Line or Charcoal

   While it renders, ask the dog's name and age. Small talk sells.
4. **Reveal:** turn the phone around and say nothing for two seconds. Let the reaction happen.
5. **Hand it over:**
   > "It's yours. Scan this and it's on your phone."

   They scan the QR, which opens their portrait on their own phone with the buy button right there.
6. **Offer once, plainly:**
   > "If you want it on your wall, prints start at $35 and the canvas is $99, with free shipping in the US. The digital file alone is $29. If you don't love it when it arrives, we remake it or refund you."
7. **If they're interested but not now:**
   > "No rush. The link works anytime. If it's a gift, you can send the digital reveal today and the print follows."

**Objections, answered honestly:**
- *"Is this AI?"* — "Yes. Our AI artist makes it, and a person checks every print before it's printed."
- *"How long does it take?"* — "Prints arrive in about 4–8 business days, canvas and framed in 5–9. The digital reveal is instant."
- *"Can you do my other dog?"* — "Of course." Make a second one.
- *"Can I see other styles?"* — Make one more. Two max, then let them browse on their own phone.

**Rules:**
- Never ask twice.
- Never photograph people.
- Never post a dog without the owner's yes. When they love it, ask: "Mind if I share it on our Instagram?"
- Log every conversation with +1 on `/admin/scorecard` ("Walk-ins").

---

## 4. Online, in parallel (start at 1 pm, check every hour)

These rarely close today, but they fill tomorrow. All of them reach strangers only.

| Channel | Do this today | Copy |
|---|---|---|
| **Local dog Facebook groups** (join 3–5 that allow promotional posts; read the rules) | Post once: a portrait plus an offer to paint the first 15 dogs whose owners comment a photo. Reply to each commenter by DM with their reveal link (`/admin/gifts/new`). | "Launching my little studio today. I make fine-art portraits of dogs from a phone photo. Comment a photo of your dog and I'll paint the first 15, free. No catch; you keep it." |
| **Nextdoor** (Business Page) | The same offer, worded for neighbors. | "Free dog portraits for neighbors today: comment a photo and I'll paint the first 15." |
| **Creator gift DMs** (`/admin/partners`, P1 first; batch tool `/admin/gifts/batch`) | 25 dog accounts with 2K–50K followers, each sent a finished portrait of *their* dog. | "Made this of [dog], thought you'd love it. It's yours, no strings: [link]. If you ever share it, your followers get 15% off with your code and you earn 15% on every order." |
| **TikTok / Reels** | Post 2 videos tonight from the pop-up, with the owners' permission: the dog, the phone turning around, the owner's reaction (face only if they agree). | Caption: "Phone photo in. Portrait out. Free to see." |
| **Google Search** (optional, $40 of the $100) | One campaign, exact and phrase match: "custom dog portrait", "dog portrait from photo", "royal dog portrait". Max CPC $1.75. Headlines: "See Your Dog's Portrait Free", "Free Preview. No Card Needed." | Expect 20–30 clicks today and probably 0–1 order. It's a read on demand, not the engine. |

---

## 5. 8–10 pm: close the day

1. **Orders:** for every paid order in `/admin/orders`, open it and check the print file. Approve it tomorrow, once Printful is connected.
2. **Thank-yous:** text or email every buyer a personal thank-you. Ask them, without any incentive, for an honest review once it arrives.
3. **Non-buyers:** everyone who got a portrait but didn't buy gets nothing tonight. Tomorrow at 10 am, send one friendly message: "Did [dog]'s portrait make it home okay? The link works anytime if you want it on the wall." Then stop.
4. **Scorecard:** log the day in `/admin/scorecard` (walk-ins, creator DMs, community posts, ad spend).
5. **Setup:** buy `pupprints.shop`, connect Printful and Resend (`LAUNCH.md` §2–3).

---

## Numbers for today

| Metric | Target | If you miss it |
|---|---|---|
| In-person conversations | 40 | Pick a busier venue; 4–7 pm at a pet store beats a quiet park |
| Portraits made (all channels) | 40+ | Shorten the opener; lead with "free, about a minute" |
| QR scans → reveal page opens | 60% of portraits | Hand the phone over with the QR already on screen |
| Paid orders | **1+** (base case 2–4) | See "If nothing sells by 7 pm" |

## If nothing sells by 7 pm

Change one thing at a time:
1. **People decline the portrait:** your opener is too long. Lead with "free" and "a minute".
2. **They love it but don't buy:** say the $29 file and the $35 print first, not the canvas. Mention the gift angle ("send the reveal today").
3. **They say "it doesn't look like my dog":** likeness is the product. Retake the photo in better light and at eye level, or switch provider tonight (`AI_PROVIDER_ORDER`).
4. **The checkout flow breaks:** test your own purchase again; check that Apple Pay appears on an iPhone.

Every portrait made today is a warm lead tomorrow: 25 people holding their own dog's portrait on their phone. Tomorrow, follow the 100-day plan in [`docs/business-plan.md`](../docs/business-plan.md) (Rule of 100). Keep the pop-up as a weekly block: one evening a week at a new venue.
