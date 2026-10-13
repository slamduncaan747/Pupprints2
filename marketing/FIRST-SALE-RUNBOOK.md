# First-sale runbook (no personal network)

Goal: the first paid order from a stranger, then a repeatable loop that produces one sale a day.
Engine: **the gift-first loop.** A free portrait of someone's *own* dog, delivered as a private reveal link with a one-tap "Put {pet} on your wall" button, converts far better than any ad. Every channel below just feeds dogs into that loop.

Site: https://pup-prints.vercel.app (moving to pupprints.shop) · Admin: /admin · Launch code: `FOUNDING100` (15% off, first 100 orders, ends Oct 31; created in Stripe automatically).
Portraits: OpenAI's GPT Image model (primary) with Google Gemini as automatic fallback. Cost ≈ $0.04–0.25 per portrait depending on quality, so 20 gifts a day is roughly $1–5/day.

---

## Phase 0 — Turn it on (Day 1 morning, ~45 min, do in order)

All keys go in **Vercel → pup-prints → Settings → Environment Variables** (Production + Preview).

1. **Portrait engine — OpenAI (ChatGPT's image model), primary**: platform.openai.com → Settings → Organization → **verify your organization** (required for GPT Image models; takes a few minutes with an ID) → Billing: add ~$10 → API keys → create → `OPENAI_API_KEY`.
   **Fallback — Google Gemini**: aistudio.google.com → Get API key → enable billing on the linked Google Cloud project → `GEMINI_API_KEY`. If OpenAI refuses or times out, the site retries with Gemini automatically.
   Verify the key in one command (from `web/`): `npx tsx scripts/ai-smoke.ts <dog-photo.jpg> royal` → opens a finished portrait PNG. If it looks off, tell us before driving traffic.
2. **Stripe**: activate the account (business details, bank). Secret key → `STRIPE_SECRET_KEY`. Webhook `https://pup-prints.vercel.app/api/webhooks/stripe` (events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`) → `STRIPE_WEBHOOK_SECRET`. In Settings → Payment methods turn on Apple Pay, Google Pay, Link. Statement descriptor: `PUPPRINTS`.
3. **Printful**: create account, add a billing card, Settings → API → token → `PRINTFUL_API_KEY`; set `FULFILLMENT_PROVIDER=printful`.
4. **Resend** (order + gift emails): API key → `RESEND_API_KEY`; set `BUSINESS_POSTAL_ADDRESS` (PO box is fine) or marketing emails stay off.
5. **Pixels** (needed before spending a cent): create a Meta Pixel and TikTok Pixel → `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`.
6. **Domain**: Vercel → Domains → buy `pupprints.shop` → add to project `pup-prints` → set `NEXT_PUBLIC_SITE_URL=https://pupprints.shop` → update the Stripe webhook URL. Email forwarding for hello@pupprints.shop (ImprovMX, free).
7. **Redeploy** (Vercel → Deployments → ⋯ → Redeploy).

## Phase 1 — Prove the pipeline (Day 1, 20 min) — do not skip

1. Upload a photo of any dog on /create → confirm a preview appears in under ~60s and actually looks like the dog. Try 3 styles. Likeness is the product; if it's weak, stop and fix it first.
2. Buy the cheapest physical item ($35 print) with your own card, using `FOUNDING100`.
3. Confirm: success page shows the order → confirmation email arrives → order appears in /admin/orders as **paid** → click **Approve & send to print** → it appears in Printful (as a draft unless `PRINTFUL_CONFIRM=1`).
4. Open your Gift Reveal link from the success page on your phone.
5. Refund yourself in Stripe (order flips to *refunded*) and delete the Printful draft. (Or keep it as your quality sample.)

If any step fails, stop and fix it before driving traffic. Every visitor before this works is wasted.

## Phase 2 — Set up the storefronts strangers already browse (Day 1, ~90 min)

1. **Social accounts** (handles: TikTok `@pupprints.shop`; Instagram/Pinterest per [content/social-setup.md](content/social-setup.md)). Bio: "Your dog, as a work of art. See yours free ↓" + link. Put the URLs in `NEXT_PUBLIC_TIKTOK_URL` / `NEXT_PUBLIC_INSTAGRAM_URL`.
2. **Etsy shop** (highest buyer intent for strangers; ~$15 setup + $0.20/listing): publish the 5 listings in [channels/etsy-kit.md](channels/etsy-kit.md), with the required AI disclosure. Opt out of Offsite Ads. Etsy ads: $1/day on the two best listings.
3. **Google Merchant Center** (free Shopping listings): add the site, verify the domain, submit feed `https://pup-prints.vercel.app/feeds/google.xml`. Approval takes days; start now.
4. **Nextdoor Business Page** + join 5–10 dog Facebook groups that allow promos (read the rules first) — copy in [channels/community-posts.md](channels/community-posts.md).

## Phase 3 — The daily loop (every day until the first sale, ~3 hours/day)

### Loop A — Creator gifts (60 min, 10 per day)
1. /admin/partners → filter status *prospect*, sort P1 first.
2. Open their profile, save a clear photo of their dog (face visible, eye level).
3. /admin/partners/[id]/gift → paste the image URL → pick the style that fits the dog (big/serious → Royal or Admiral; small/silly → Pop Art or Storybook; senior/memorial → Watercolor or Old Master) → generate.
4. Check the likeness. If it's off, regenerate (same link). Only send portraits you'd hang yourself.
5. **Copy DM** → send by Instagram/TikTok DM (or email if listed). Status becomes *gifted*.
6. 48h later, if no reply: follow-up #2 from [creators/outreach-playbook.md](creators/outreach-playbook.md). If they react: offer the affiliate code (15% for their followers, 15% commission) and ask if you can repost the reveal.

### Loop B — Public "we paint your dogs" (60 min, 10 per day)
1. Post a comment-to-enter video (scripts 11–13, section C of [content/30-video-scripts.md](content/30-video-scripts.md)): "Comment your dog's name + breed, I'll paint the first 10 free."
2. Mirror the same offer in 2–3 Facebook groups that allow it, and on Nextdoor (Business Page).
3. For each commenter: ask them to DM a photo → /admin/gifts → **New gift** → generate → send them the reveal link (DM copy includes `FOUNDING100`).
4. With their permission, their dog becomes tomorrow's video ("Round 2"). That's the flywheel: every gift is both a lead and new content.

### Loop C — Content (45 min, 3 posts per day across TikTok/Reels/Shorts)
- Match the site's look: clean white backgrounds, the portrait large, one line of text on screen. Screen-record the real flow on pup-prints.vercel.app (photo → portrait in about a minute) — the speed is the hook.
- 1 comment-to-enter round (Loop B), 1 transformation reveal (photo → portrait), 1 rotating format (style quiz, "which style is your dog?", memorial tribute). All link to the site in bio.
- Always use permission for dogs shown. Never claim hand-painted; if asked: "our AI artist creates it, our team finishes and checks it."

### Loop D — Ops (15 min, morning and evening)
1. /admin dashboard: new **paid** orders → open → check the print file → **Approve & send to print** (same day, always).
2. /admin/messages and DMs: reply within 2 hours.
3. /admin/gifts: look at view counts. Anyone who opened their reveal twice but didn't buy gets a friendly nudge ("Want it on your wall? FOUNDING100 is 15% off this month").
4. Log the day's numbers (below).

---

## Paid spend ($100 max)

Only after Phase 1 passes and pixels are live.
- **$60 → two nano creators ($30 each)** chosen from gift recipients who reacted warmly: one reveal post with their code + #ad. Pay on the day it posts.
- **$40 → boost the single best organic video** (watch time above your account average), Friday–Sunday, US 25–55, dog-owner interests, link to /create. Stop-loss: pause if no preview starts after $15 spent. Rules in [ads/meta-tiktok-test.md](ads/meta-tiktok-test.md).

## Numbers to track daily

| Metric | Where | Target to first sale |
|---|---|---|
| Gifts sent (A + B) | /admin/gifts | 20/day |
| Reveal opens | view counts in /admin/gifts | 60%+ of gifts |
| Previews started by strangers | /admin dashboard | 15+/day |
| Checkouts started | Stripe → Payments (incomplete) | — |
| Paid orders | /admin/orders | **1** |

Rule of thumb: expect the first sale after **~30–60 delivered gifts** plus the traffic the videos bring, i.e. roughly days 2–4 of running the loops at full volume.

## If there's no sale by day 4

Diagnose in funnel order and change one thing at a time:
1. **Reveals not opened** → DM copy too long or salesy; lead with the image and the dog's name.
2. **Opened, no click to buy** → test style choice and portrait quality (likeness first); add a second style for the same dog.
3. **Clicked, no checkout** → price shock; push the $35 print and the $29 digital file in the DM, not the canvas.
   Also check likeness: compare 5 recent previews in /admin/generations to the source photos. If the dogs don't look like themselves, switch `AI_PROVIDER_ORDER` to `gemini,openai` (or raise `OPENAI_IMAGE_QUALITY`) and compare again.
4. **Checkout started, not paid** → look at Stripe's incomplete payments for errors; check that Apple Pay shows on iPhone.
5. **No traffic at all** → move effort from Loop C to Loop A/B; volume of personal gifts is the lever.

## After the first sale
1. Ship it fast; message the buyer personally; ask for an honest review and a photo of it on the wall (with permission, that's your first real social proof).
2. Turn every warm creator into an affiliate with a code; create gifts for their followers' dogs on request.
3. Keep the loops running; scale Loop A to 20/day.
