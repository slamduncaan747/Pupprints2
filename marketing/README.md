# Pup Prints Marketing Kit

**The plan:** [docs/business-plan.md](../docs/business-plan.md): first customers → $1,000/month profit, Hormozi-style, no personal network, $100 of starting acquisition cash. **Week 1:** [FIRST-SALE-RUNBOOK.md](FIRST-SALE-RUNBOOK.md). This folder holds the scripts, lists and templates both of them use.

**Site:** https://pup-prints.vercel.app (moving to pupprints.shop) · **Admin:** `/admin` · **Strategy:** `docs/strategy.md` §8–9 · **Research:** `docs/research/`

---

## Start here: first 60 minutes

Do these in order on Day 1, then follow the [runbook](FIRST-SALE-RUNBOOK.md) (handles are already done here). No warm-network outreach: every gift goes to a stranger's dog.

| Min | Do | Why |
|---|---|---|
| 0–10 | **Check the site URL env.** Vercel → Settings → Environment Variables: `NEXT_PUBLIC_SITE_URL=https://pup-prints.vercel.app` on **Production *and* Preview**. The code's fallback is `https://pupprints.vercel.app`, which is **someone else's site** ("Pup Print Portraits"). Production looks right today (canonical links point to `pup-prints`), but confirm it, and update it the moment `pupprints.shop` is live. | Gift Reveal links, partner links and emails are all built from this URL |
| 10–20 | **One real order, end to end.** Make a preview of your own dog → buy the $29 digital file with your card → check the confirmation email, the Gift Reveal page and Admin → Orders. Refund yourself in Stripe afterwards. | Proves money, email and admin work before you send anyone |
| 20–28 | **Stripe codes** (Products → Coupons): A 100% "Once" coupon **`INTERNAL100`** with *no public code*. Add a single-use code per gift or Etsy order (e.g. `GIFT-RUFUS`). | The honest launch offer, plus the $0 internal orders used for gift prints and Etsy fulfillment |
| 28–35 | **Import creators.** Admin → Partners → Import → upload [`creators/prospects.csv`](creators/prospects.csv). | 167 creators land as `prospect`, with notes |
| 35–45 | **Test the gift flow.** Admin → Gifts → make your own dog's portrait → open the reveal link on your phone → then make 2 for P1 creators from the list. | You'll know the flow cold before the daily 25 |
| 45–55 | **Claim handles + bios:** `@pupprints.shop` on IG + TikTok ([social-setup.md](content/social-setup.md)). Paste the bios and links. | Everything you send points here |
| 55–60 | **Open the scorecard** (Admin → Scorecard) and log today's actions. Set alarms for 13:00, 17:00 and 21:00 to reply and log. | What gets measured gets done |

**Pixels** (`NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`) can wait until Wednesday. No ads run before Friday ([ads doc §1](ads/meta-tiktok-test.md#1-before-any-dollar-tracking-must-work)).

---

## The kit

| # | File | Use it for | When |
|---|---|---|---|
| 1 | [docs/business-plan.md](../docs/business-plan.md) + [FIRST-SALE-RUNBOOK.md](FIRST-SALE-RUNBOOK.md) | The plan (goal math, offer, money model, channels, $100, Rule of 100, 100-day roadmap, gates) and the week-1 runbook. The old [week-1 war plan](00-week1-war-plan.md) is retired | Every morning |
| 2 | [creators/prospects.csv](creators/prospects.csv) | 167 real creators (108 nano/micro), with priority (`P1`/`P2`/`P3`/`LATER`), verification date and source in the notes. Imports straight into Admin → Partners. | Day 1 import; daily picks |
| 3 | [creators/outreach-playbook.md](creators/outreach-playbook.md) | The gift-first flow, a style picker, 6 templates (A gift · B follow-up · C affiliate · D paid post · E memorial · F UGC license), the 3-touch sequence, reply scripts, the AI answer, FTC in plain English, ops, do-not list | Every outreach block |
| 4 | [creators/creator-brief.md](creators/creator-brief.md) | One-pager for creators who said yes: the deal, content formats, hooks, disclosure, payouts | After a "yes" |
| 5 | [creators/partner-agreement.md](creators/partner-agreement.md) | Plain-English creator/affiliate agreement (template, not legal advice) | With the brief |
| 6 | [content/30-video-scripts.md](content/30-video-scripts.md) | 30 scripts (hooks, shots, text, captions, hashtags, sound) plus the "comment your dog" lead engine | 3 videos/day |
| 7 | [content/social-setup.md](content/social-setup.md) | Handles (availability checked), bios, link-in-bio, highlights, first 9 posts, schedule | Day 1–2 |
| 8 | [ads/meta-tiktok-test.md](ads/meta-tiktok-test.md) | How to spend the $40 boost, qualification rules, stop-loss, UTM conventions, pixel events, 10 ad copies, 5 static concepts | Fri Oct 16 |
| 9 | [channels/etsy-kit.md](channels/etsy-kit.md) | Etsy setup, 5 complete listings, AI disclosure, fulfillment through our pipeline. **Deferred:** not in Q4 (plan §5.7); January memorial test | Jan 2027 |
| 10 | [channels/community-posts.md](channels/community-posts.md) | Nextdoor (2026 rules), 10 breed-group posts, Reddit verdict + 3 posts. Skip the founder-network posts and friend texts (no warm outreach) | Day 1–4 |
| 11 | [channels/shelter-partnership.md](channels/shelter-partnership.md) | Shelter pitch, call script, process, social templates, press release + reporter pitch | Day 1 email, Day 3 call |
| 12 | [email/flows.md](email/flows.md) | Welcome, preview nurture, post-purchase, review request, win-back: matched to what the site sends, with the gaps flagged | Reference + manual sends |

---

## Only the founder can do these

1. **Accounts and money:**
   - Claim handles (IG, TikTok, FB Page, Pinterest, Nextdoor Business Page).
   - Create the Stripe codes.
   - Open the Etsy shop (decide on the ~$15–29 setup fee).
   - Set up PayPal for creator payouts.
2. **The warm network.** Texting friends and family with their own dog's portrait is the #1 cash lever, and it only works coming from you.
3. **Face and voice:** film the videos (script #29 is you to camera), and make the shelter and press calls.
4. **Judgment calls:**
   - Approve each portrait before it's sent. Never send a weak one.
   - Pick the 2 paid creators.
   - Approve the boost.
   - Handle anything memorial with care.
5. **Pay creators** on the day their post goes live, and collect a W-9 before cumulative payouts pass $600.
6. **Get the partner agreement reviewed by a lawyer** before any deal larger than a nano post.
7. **Say yes or no to the engineering asks below.**

## Engineering asks found while building this kit

| # | Issue | Where | Impact |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_SITE_URL` fallback is `pupprints.vercel.app`, which belongs to a different business | `lib/config.ts`, `lib/env.ts` | Wrong links if the env is ever missing (e.g. Preview) |
| 2 | Social links hard-coded to `instagram.com/pupprints` etc. | `lib/config.ts` → `site.social` | Update to the final handles (`@pupprints.shop`) |
| 3 | **No `Purchase` pixel event** | `/order/success` (+ CAPI) | We can't optimize ads for sales |
| 4 | **No welcome email** is sent, but the newsletter form promises "WELCOME10 is on its way" | `components/site/newsletter-form.tsx`, `lib/email` | A broken promise to every subscriber |
| 5 | `REVIEW_URL` not set, so the review button opens a `mailto:` | env | No public reviews collected |
| 6 | No **postal address** in marketing email footers (CAN-SPAM) | `lib/email/layout.ts` | Legal |
| 7 | `EMAIL_FROM` / support email default to `@pupprints.com` | env | Deliverability: use a verified domain you own |
| 9 | Typed partner codes (e.g. `RUFUS15`) don't exist as Stripe promotion codes; only `?ref=` links work | `lib/stripe.ts` | Spoken codes in creator videos fail; manual workaround in [playbook §8](creators/outreach-playbook.md#8-ops-tracking-codes-payouts) |
| 10 | `?ref=` cookie is overwritten by the latest partner link (last click wins), while UTMs are first-touch; strategy wants a 60-day window, the code has 30 | `components/site/tracking.tsx`, `program.ts` | The partner agreement says "30 days, most recent link wins" to match today's code. Update it if this changes. |

## Where the numbers come from

- **Unit economics:** `docs/research/fulfillment.md`
- **Creator rates and FTC:** `docs/research/influencers.md`
- **Funnel benchmarks:** `docs/research/growth.md`
- **Strategy terms** (15% commission, 20% Founding Partner rate): `docs/strategy.md` §8–9
- **Prospect follower counts** are listed per row:
  - TikTok and YouTube counts were read live on 2026-10-13.
  - Instagram counts come from dated third-party snapshots (TheSocialCat, iQfluence, Modash, Scrumball) and are labeled as such.
  - Emails appear only where publicly listed on the profile or link page.
