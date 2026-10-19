# Social Setup: Instagram, TikTok, Pinterest, Facebook

Setup time is about 40 minutes on Day 1 (IG + TikTok) and 40 minutes on Day 2 (Facebook + Pinterest). Everything here is phone-doable.

---

## 1. Handles (decide once, use everywhere)

**Availability checks run 2026-10-13:**

| Handle | TikTok | Pinterest | Instagram | Facebook |
|---|---|---|---|---|
| **@pupprints** | **Taken** (0 followers, last video 2022) | **Taken** ("Pup Prints") | Couldn't check (IG blocks automated lookups); try it first | Try it |
| **@pupprints.shop** | **Available** | Dots aren't allowed, so use `pupprintsshop` | Try | Try |
| **@pupprintsco** | **Taken** (0 followers, 2024) | **Taken** | Try | Try |
| @pupprintsstudio (backup) | Available | Try | Try | Try |

**Recommendation: `@pupprints.shop` everywhere** (Pinterest: `pupprintsshop`). It matches the domain, it's free on TikTok today, and one handle across platforms means creators tag the right account.
- If **@pupprints** is free on Instagram, grab it *as well* and keep it as a redirect account ("We live at @pupprints.shop").
- If either taken TikTok handle is actually yours from an old account, recover it with "Forgot password".
- **Then tell engineering:** the site's social links are hard-coded in `web/src/lib/config.ts` (`site.social`, currently `instagram.com/pupprints` etc.). Update them to the final handles before creators start tagging.

**Display name everywhere:** `Pup Prints | Dog Portraits` (the keyword "Dog Portraits" is searchable inside the apps).

**Profile photo:** the paw logo mark in clay on cream (`#FAF6EF`), centered with generous padding. It reads at 40px. Don't use a dog portrait: it looks like a fan page at small sizes.

---

## 2. Instagram

**Account type:** Professional → **Business**. Category: *Art* (or *Shopping & retail*). Contact options: email `hello@[domain]`. Show category: on.

**Bio** (150 characters max):
```
Your dog, as fine art 🎨
See their portrait FREE in 30 sec (no card)
Canvas · framed · gift it today
👇 See yours free
```

**Link:** `https://pup-prints.vercel.app/?utm_source=instagram&utm_medium=social&utm_campaign=bio`

**Link-in-bio plan:**
- **Week 1: one direct link** to the homepage. Every extra tap loses people.
- If you need more, add IG's multi-link (up to 5 links, no Linktree needed) in this order:
  1. "Make your dog's portrait (free)" → `/create`
  2. "Send a Gift Reveal" → `/gifts`
  3. "Memorial portraits" → `/gifts/memorial`
  4. "Creators: get your dog painted" → `/partners`

**Story highlights.** Covers: a cream circle, one clay-colored line icon, and a one-word label in Fraunces serif.

| Order | Highlight | What goes in it |
|---|---|---|
| 1 | **Make yours** | 3-frame screen recording: upload → 30 s → reveal + link sticker |
| 2 | **Your dogs** | Follower-dog portraits (with permission), refreshed daily |
| 3 | **Gift Reveal** | What the recipient sees, plus "print follows in about a week" |
| 4 | **Styles** | One frame per style with its name |
| 5 | **How it's made** | "Our AI artist creates it, our team finishes and checks it" + the QA checklist + the guarantee |
| 6 | **Shelter dogs** | When the shelter partnership starts |

**Story cadence:** 6–10 frames a day. Behind the scenes, polls ("Royal or Watercolor?"), the "Add Yours" sticker ("Your dog as royalty 👑"), and reshares (only with permission).

---

## 3. TikTok

**Account:** switch to a **Business account** (Settings → Account).
- You get analytics and a website field. If the website field doesn't appear yet, put `pupprints.shop` in the bio text and pin a comment with the link.
- **Music:** business accounts can only use the **Commercial Music Library**. Pick sounds there; trending chart songs will get muted.
- Category: *Art & Crafts* or *Shopping & Retail*.

**Bio** (80 characters max):
```
Your dog as fine art 🎨 Free preview in 30 sec 👇
```

**Link:** `https://pup-prints.vercel.app/?utm_source=tiktok&utm_medium=social&utm_campaign=bio`

**Pinned videos (3):**
1. #1 "One photo → royalty"
2. #3 "Rating your dogs" (the comment loop)
3. #25 "The 10-second gift"

Re-pin whichever performs best.

**Settings:**
- Allow Stitch and Duet. Script #27 depends on it.
- Comment filters on for spam keywords only. Don't filter "AI": answer it honestly instead.

---

## 4. Facebook Page (needed for Meta boosts and the IG business link)

- **Create:** Name `Pup Prints`, category *Art studio* (secondary: *Shopping & retail*), username `@pupprints.shop`.
- **Action button:** *Shop now* → `https://pup-prints.vercel.app/?utm_source=facebook&utm_medium=social&utm_campaign=page`
- **About (intro, 101 characters max):** `Fine-art portraits of your dog. See yours free in 30 seconds, then hang it in days.`
- **Connect:** link the Page to the Instagram account (Meta Business Suite → Settings → Linked accounts). That's required for boosting Reels and for partnership ads.
- **Posting:** share every Reel to the Page (auto-share setting on IG), plus one personal "founder note" a week.
- **Your personal profile** does the heavy lifting this week ([community-posts.md](../channels/community-posts.md)). The Page is mainly the ad and boost account.

---

## 5. Pinterest (slow burn, Q4 payoff)

- **Create a business account:** username `pupprintsshop`, display name `Pup Prints | Custom Dog Portraits`.
- **Bio:** `Fine-art portraits of your dog: royal, watercolor, minimalist & more. Free preview in 30 seconds. Dog mom gifts, memorial portraits, holiday gifts.`
- **Claim the website:**
  - Pinterest gives a meta tag or a DNS TXT record. Use the DNS record on `pupprints.shop` once the domain is connected; until then, ask engineering to add the meta tag.
  - Once claimed, add a **catalog** using the existing feed `https://pup-prints.vercel.app/feeds/google.xml`. Pinterest accepts RSS/XML feeds.
- **Boards** (keyword names = search traffic):
  1. Custom Dog Portraits
  2. Royal Dog Portraits
  3. Gifts for Dog Moms
  4. Dog Memorial Gift Ideas
  5. Dog Portraits by Breed
  6. Christmas Gifts for Dog Lovers
- **Pins:**
  - 5 a day, using Pinterest's free native scheduler.
  - Each pin is one portrait in a frame mockup, plus a title like "Royal French Bulldog Portrait from Your Photo | Free Preview" and a description of 2–3 sentences with keywords.
  - Each pin links to `/styles/[slug]` with `utm_source=pinterest`.

---

## 6. First 9 Instagram posts (grid plan)

Post in this order. Instagram shows newest top-left, so #7–9 end up as the top row. Alternate **Reels** (motion) with **carousels** (saves), all on the same cream background and frame style so the grid reads as a gallery.

| # | Type | Content | Caption hook |
|---|---|---|---|
| 1 | Carousel (4) | "We're open." Founder + dog → "How it works: upload → 30 sec → love it or don't pay" → what's included → "Love it, or it's free" | "Hi. We make dogs look like museum pieces." |
| 2 | Reel | Script #1, "One photo → royalty" | "I uploaded ONE photo…" |
| 3 | Carousel (5) | One dog in 4 styles + "vote in comments" | "Which one is the real him? 1–4 👇" |
| 4 | Reel | Script #2, "POV: royalty" | "We've created a monster." |
| 5 | Carousel (5) | **What's included:** free preview · free US shipping · hi-res file included · checked by a person · love-it guarantee | "No surprise fees. Ever." |
| 6 | Reel | Script #3, "Painting YOUR dogs, round 1" | "Comment your dog's name 👇" |
| 7 | Reel | Script #25, Gift Reveal screen recording | "Gift sorted in 30 seconds." |
| 8 | Carousel | Follower dogs, round 1 grid (with permission), or the first shelter dogs | "You sent them. We painted them." |
| 9 | Reel | Script #29, "Day 1 of my dog portrait business" (founder to camera) | "It's just me and my dog right now." |

**Grid look:**
- Cream (`#FAF6EF`) borders on statics.
- Fraunces serif for any text.
- Clay (`#C8553D`, the site's `clay` token) as the one accent color.
- No neon, no meme fonts on the grid. Save those for Stories.

---

## 7. Posting schedule (week 1, Eastern Time; shift for your audience)

| Platform | Daily volume | Times (ET) | Notes |
|---|---|---|---|
| **TikTok** | 3 videos | 8:30 · 12:30 · 20:00 | Reply to comments for the first 60 minutes after each post. That's when reach is decided. |
| **Instagram Reels** | 2–3 (same videos) | 12:30 · 20:00 (+ 8:30 optional) | Change the cover frame and first-line text from the TikTok version. |
| **IG Stories** | 6–10 frames | Through the day | Polls, Add Yours, real counts, reshares with permission |
| **YouTube Shorts** | 1–2 | 20:00 | Same videos. Title = the hook text. Description = the link with `utm_source=youtube`. |
| **Facebook Page** | Auto-shared Reels | – | Plus your personal profile posts ([community-posts.md](../channels/community-posts.md)) |
| **Pinterest** | 5 pins | Scheduled | From Day 2 |

**Batching tip:** film 3 scripts back to back in one 45-minute session (same dog, same light), then post them across the day.

**Weekly:** check which hook got the best 3-second hold, and write 3 new variations of it for next week.
