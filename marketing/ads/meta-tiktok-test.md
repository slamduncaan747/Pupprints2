# The $40 Boost Test (Meta + TikTok), plus UTMs, pixels and creative for later

**The rule:** we don't buy reach for unproven creative. The $40 goes behind **one** post that has already earned it organically. It runs **Fri Oct 16 12:00 → Sun Oct 18 ~20:00**. If nothing qualifies by Friday noon, the $40 becomes a third paid nano post ([war plan §2](../00-week1-war-plan.md#2-the-100-where-every-dollar-goes)).

---

## 1. Before any dollar: tracking must work

1. **Pixels:** set these in Vercel → Project → Settings → Environment Variables, then redeploy:
   - `NEXT_PUBLIC_META_PIXEL_ID` (Meta Events Manager → Data sources → your pixel ID)
   - `NEXT_PUBLIC_TIKTOK_PIXEL_ID` (TikTok Ads Manager → Assets → Events → Web events)
   - optional `NEXT_PUBLIC_GA_ID`
2. **Events the site already fires** (`web/src/lib/analytics.ts` → `track()`):

   | Event | Meta | TikTok | When it fires |
   |---|---|---|---|
   | PageView | standard (auto) | `ttq.page()` | Every page |
   | ViewContent | standard | event | Product or style views |
   | UploadPhoto | custom | event | Photo uploaded |
   | GeneratePreview | custom | event | Preview requested |
   | **PreviewReady** | custom | event | Portrait shown. **Our key mid-funnel signal.** |
   | SelectProduct | custom | event | Size or format picked |
   | AddToCart | standard | event | Added to cart |
   | InitiateCheckout | standard | event | Sent to Stripe |
   | Lead | standard | event | Email captured (saved preview, newsletter) |

3. **Gap: there is no `Purchase` event yet.** Ask engineering to fire `Purchase` on `/order/success` with `value`, `currency: "USD"` and `event_id = order id`. Server-side CAPI with the same `event_id` would also be good.
   - Until that ships, **never optimize for purchases.** Optimize for landing-page views or link clicks.
   - Judge results on site data: Admin → Orders → each order's **UTM** block, plus Leads.
4. **Verify in 5 minutes:**
   - Meta Events Manager → Test events, then open the site and make a preview. You should see PageView → UploadPhoto → GeneratePreview → PreviewReady.
   - TikTok: Events → Test events (or the TikTok Pixel Helper extension).
5. **Meta custom conversion:** create one on `PreviewReady` so the boost's results column shows previews, not just clicks.

---

## 2. Choosing the one post to boost (Friday 11:00)

Candidates are any **our-account video** or any **creator video we have ad rights to** (Spark code or partnership-ad approval in writing) posted Tue–Thu.

**It qualifies only if all three are true:**

| Check | TikTok (Analytics → Video) | Instagram (Reel insights) |
|---|---|---|
| Hook holds | Average watch time ≥ 50% of video length, **or** "watched full video" ≥ 25% (videos ≤ 20s) | Skip rate below your account's average (IG shows it in Reel insights) |
| Above our baseline | Views ≥ 2× the median of our other posts this week | Same |
| Intent signals | (Profile views + link clicks + "how much?/link?" comments) ≥ 1 per 300 views | (Shares + saves) ≥ 10 per 1,000 views |

**Tie-breaker:** the post whose comments ask "where do I get this?" beats the one with more laughs.

---

## 3. How to spend it

### Path A: the winner is OUR TikTok → TikTok Promote (in-app, no minimums)

1. Open the video → **⋯ → Promote**.
2. **Goal:** *More website visits*. Website: `https://pup-prints.vercel.app/?utm_source=tiktok&utm_medium=paid_social&utm_campaign=boost_wk1&utm_content=[script#]`
3. **Audience:** *Custom*.
   - Gender: all.
   - Age: 25–34, 35–44, 45–54.
   - Interests: **Pets** (+ Home décor if offered).
   - Location: United States.
4. **Budget and duration:** $13/day × 3 days ≈ $40.
5. **Button:** *Shop now* or *Learn more*.

### Path B: the winner is OUR Instagram Reel → Meta boost

1. Instagram app → the Reel → **Boost**. Or Meta Business Suite for more control.
2. **Goal:** *More website visits*. URL with `utm_source=instagram&utm_medium=paid_social&utm_campaign=boost_wk1&utm_content=[script#]`. Button: *Shop now*.
3. **Audience:** *Create your own*.
   - Location: United States.
   - Age: **25–55**.
   - Gender: all.
   - Interests: *Dogs*, *Dog lovers*, *Pet adoption*, *Puppies*, plus *Gifts* as a second interest group if offered.
   - Leave Advantage+ audience **on**. With $40 it can't hurt, and it finds people faster.
4. **Budget:** $13/day for 3 days.
5. **Placements:** automatic (IG + FB Reels and Stories).
6. In Ads Manager afterwards, add the **PreviewReady** custom conversion as a results column.

### Path C: the winner is a CREATOR's video → Spark Ad (TikTok) or partnership ad (Meta)

- **TikTok Spark:**
  1. The creator gives a **Spark authorization code** for the video (their app: ⋯ → Ad settings → Generate code, 30 days).
  2. TikTok Ads Manager → Campaign *Traffic*, **no campaign budget limit**.
  3. Ad group: US, 25–54, interest *Pets*, **daily $20 × 2 days = $40**. $20/day is TikTok's ad-group minimum.
  4. Ad: *Use TikTok account to deliver Spark Ads* → paste the code → URL with `utm_medium=paid_social&utm_campaign=spark_[CODE]`, plus `&ref=[CODE]` so the creator still earns.
- **Meta partnership ad:**
  1. The creator approves a partnership-ad request (IG → Settings → Business tools → Branded content → Partnership ads).
  2. Ads Manager → Traffic → Audience as in Path B.
  3. Ad: *Use partnership ad* → select their post. URL with `ref=[CODE]`.
  4. Budget: $13/day × 3.

**Always:**
- Disclosure stays on the post ("Paid partnership" label + #ad).
- The ad links to the **homepage** (the hero CTA starts the free preview). Don't send paid traffic to a page without the upload button.

---

## 4. UTM conventions

The site stores the **first touch** in a 30-day cookie and saves it on every lead and order (Admin → Orders → order → UTM). Partner links use `?ref=CODE` instead, and the creator discount applies automatically.

| Param | Values (lowercase, underscores) |
|---|---|
| `utm_source` | `tiktok` · `instagram` · `facebook` · `youtube` · `pinterest` · `nextdoor` · `reddit` · `etsy` · `google` · `email` · `sms` · `friends` · `shelter_[name]` · `qr` |
| `utm_medium` | `social` (organic post or bio) · `paid_social` · `dm` · `community` (groups, Nextdoor) · `personal` (founder's own posts and texts) · `email` · `sms` · `referral` · `creator` · `print` (QR) |
| `utm_campaign` | `organic_wk1` · `bio` · `boost_wk1` · `spark_[code]` · `founding100` · `friends_gift` · `launch_post` · `comment_portrait` · `fb_group_[breed]` · `shelter_[name]` · `dogpark_wk1` |
| `utm_content` | script number + slug, e.g. `s01_royal_reveal`, `s03_rate_dogs`, or the creator handle |
| `utm_term` | audience note for paid only, e.g. `us_25_54_pets` |

**Examples:**
- Founder's FB post: `https://pup-prints.vercel.app/?utm_source=facebook&utm_medium=personal&utm_campaign=launch_post`
- Text to a friend: `https://pup-prints.vercel.app/?utm_source=friends&utm_medium=sms&utm_campaign=friends_gift`
- Nextdoor: `...?utm_source=nextdoor&utm_medium=community&utm_campaign=launch_post`
- Creator: `https://pup-prints.vercel.app/?ref=RUFUS15` (add `&utm_source=tiktok&utm_medium=creator&utm_campaign=rufus15` if you want platform detail)

Keep a short-link note in your phone with these prefilled. Long URLs pasted into DMs are fine; for spoken CTAs, say "link in bio."

---

## 5. Stop-loss rules (check at 20:00 Fri and 12:00 Sat)

| Signal | Threshold | Action |
|---|---|---|
| Link CTR (Meta: "link click-through rate"; TikTok: CTR) | < **0.6%** after $10 spent | **Stop.** Move the remaining budget to a paid nano post. |
| Cost per landing-page view / click | > **$1.50** after $10 | Stop |
| Previews from paid UTMs (Admin → Generations/Leads, `utm_medium=paid_social`) | **0** after $20 | Stop. The creative is attracting the wrong people. |
| Frequency (Meta) | > **2.0** | Stop. The audience is too narrow for the budget. |
| Comments turning negative about AI | Any pile-on | Pause, reply honestly once, and don't argue |
| Going well (CTR > 1.5%, previews arriving) | – | **Don't raise the budget.** The cap is the cap. Note it for week 2. |

**Expected outcome for $40** (honest):
- ~2,500–5,000 impressions
- 40–120 clicks
- 10–35 previews
- 0–2 orders

The value is the **lesson**: which hook gets clicks from strangers. That's the seed for the week-2 Meta budget (`docs/strategy.md` §9.2).

---

## 6. Ten ad copy variants (for scale from week 2)

*Primary text first, then the headline. Outcome-first, honest, no fake urgency, no "AI" in the first line.*

1. "Your dog, but make it museum. Upload one photo and see their portrait free in 30 seconds. Love it before you pay." / **See your dog's portrait free**
2. "He has no idea he's about to be framed. Royal, watercolor, minimalist: try every style on your dog, free." / **Try every style free**
3. "The gift for the dog mom who has everything (except this). Send the Gift Reveal today; the canvas arrives in days." / **Give it today, hang it in days**
4. "No proofs to wait for. No surprise fees. See it first, then choose a print, canvas or frame. Free US shipping." / **See it before you pay**
5. "Grey muzzle, golden heart. A gentle portrait to remember them by. Even an old photo can work, and if it's not right, we remake it free." / **Memorial portraits, made gently**
6. "We checked: your dog looks great in a velvet robe. Find out in 30 seconds (no card needed)." / **Make your dog royalty**
7. "Every portrait is checked by a person before it's printed. Love it or we remake or refund it." / **The love-it guarantee**
8. "Two dogs? One portrait. Upload, pick a style, frame it. Hi-res file included free with every print." / **Your whole pack, framed**
9. "Christmas shopping for every dog person on your list, done in an evening. Free preview for each one." / **Dog people gifts, sorted**
10. "Be one of our first 100 customers: 15% off with FOUNDING100 (ends Oct 31 or at 100 orders)." / **Founding 100: 15% off** *(only while it's true)*

If asked how it's made, the comment-reply standard is: "Our AI artist creates it; our team finishes and checks every one."

---

## 7. Five static ad concepts (for scale)

| # | Concept | Layout | Copy on the image |
|---|---|---|---|
| 1 | **Phone-photo → portrait split** | Left: a candid phone photo with a slight blur and timestamp. Right: the Royal portrait in a black frame. A thin arrow between them. | "This photo → this portrait. 30 seconds. Free preview." |
| 2 | **Room mockup** | The 16×20 canvas above a sofa in a warm living room; the dog asleep on the sofa below it. | "The best seat in the house has a portrait now." · "Free US shipping." |
| 3 | **Style grid** | One dog in 4 styles (Royal, Watercolor, Fine Line, Pop Art) on a cream background, each labeled. | "Which one is your dog? Try all 4 free." |
| 4 | **Gift Reveal phone** | A hand holding a phone showing the Gift Reveal page, with a gift tag reading "For Mom." | "Give it today. The print follows." |
| 5 | **Honest checkout card** | A clean receipt-style card: "$99 canvas · free US shipping · hi-res file included · love-it guarantee · $0 surprise fees". | "One price. No surprises." |

**Production notes:**
- Use real portraits of dogs whose owners said yes (friends, creators with ad rights, or our own dog).
- Label example art if needed ("example portrait").
- No star ratings or review counts until we actually have them.
