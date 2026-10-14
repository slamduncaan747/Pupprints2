# B2B Partner Playbook (gift-first)

Ready-to-send scripts for breeders, groomers, daycares and trainers, memorial partners, rescues, pet boutiques, realtors and corporate buyers.

- Research, economics and sources: [docs/plan-research/partners-referrals.md](../../docs/plan-research/partners-referrals.md)
- Prospect list: [b2b-prospects.csv](b2b-prospects.csv) (65 businesses, public contact details only)
- Shelter specifics: [channels/shelter-partnership.md](../channels/shelter-partnership.md)
- Creator scripts: [creators/outreach-playbook.md](../creators/outreach-playbook.md)

Site: https://pup-prints.vercel.app. Swap in pupprints.shop when the domain is live.

---

## 0. The method in one paragraph

Every first message carries a **finished portrait of the partner's own dog**: the shop dog, the kennel's sire or dam, or the rescue's longest-stay dog. Make it in Admin, send it as a private reveal link, then make the offer. Nobody else in the category can show the work on the prospect's own dog before the first reply. Keep messages short and plain. Never claim reviews, customers or results we don't have.

### Daily block (about 90 minutes, weekdays)

| Min | Step |
|---|---|
| 10 | Pick 10 prospects from the CSV (one category, one city when possible). Check their website and Instagram for a clear photo of *their* dog: shop dog, sire or dam, adoptable dog. Use publicly posted photos only, as a private demo. Never post it. |
| 40 | For each: `/admin/partners/new`. Set platform `other`, niche (`breeder` · `groomer` · `daycare` · `trainer` · `rescue` · `memorial` · `vet` · `boutique` · `realtor` · `corporate`), status `prospect`, code (e.g. `EARTHPUPS`) and terms. Then `/admin/partners/[id]/gift`: paste the photo URL, pick a style, check the likeness and copy the reveal link. **The reveal sets the partner's code as the referral cookie, so any order from it is attributed to them.** |
| 30 | Send the category email or DM below. Set status to `contacted` with the date in notes. |
| 10 | Follow-ups that are due (§1.4). Log replies. Move warm ones to `negotiating`. |

**Default terms by niche** (set per partner row):

| Niche | `discount_percent` | `commission_rate` | Notes |
|---|---|---|---|
| groomer, daycare, trainer, boutique | 15 | 0.15 | Same as creators |
| breeder (Breeder's Gift) | 20 | 0.10 | 20% is the promo cap; never pair it with more than 10% commission |
| memorial: crematory (referral) | 10 | 0.15 | Or reseller pricing (§3.3) |
| vet | 10 | 0.00 | No fee by default; a disclosed fee only if the clinic asks |
| rescue | 15 | 0.00 | Flat, pre-decided donations instead (§3.4) |
| realtor, corporate | trade price | 0 | Invoice or a trade code; no referral fees |

---

## 1. Cold email rules (CAN-SPAM covers B2B)

The FTC: "The law makes no exception for business-to-business email." Each non-compliant email can cost up to **$53,088** ([FTC compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business)).

### 1.1 Checklist for every message

- [ ] **Accurate From and Reply-To.** Send from a real mailbox, e.g. `[firstname]@pupprints.shop`, with our real name.
- [ ] **Honest subject line.** Never fake "Re:" or "Fwd:", order or invoice language, or anything that isn't in the email.
- [ ] **Identify it as a business offer.** The footer line "This is a business offer from Pup Prints" covers it.
- [ ] **Valid physical postal address** in the footer: a street address, a USPS-registered PO box or a registered private mailbox. Set `BUSINESS_POSTAL_ADDRESS` first.
- [ ] **Clear opt-out.** "Reply 'no thanks' and we won't email again" plus an unsubscribe link if we use a sending tool.
- [ ] **Honor opt-outs within 10 business days.** Our rule is the same day: status `declined`, note `opted out YYYY-MM-DD`, never re-add. Keep the opt-out working for at least 30 days after each send.
- [ ] **Only public business addresses.** Use the email the business publishes on its own site or listing. **Never guess** (no `firstname@` patterns, no enrichment tools), and never use bought lists. Keep the source in the CSV notes.
- [ ] **We are responsible for anyone sending for us.** That includes a future VA or tool.
- [ ] **Low volume, plain text.** At most 30 sends a day per mailbox. SPF, DKIM and DMARC set on the domain. No attachments on first touch; link to the reveal instead.
- [ ] **No marketing texts to cold numbers.** Many breeder and groomer numbers are mobiles (TCPA and state laws). Email or DM first; phone calls are made by hand.

### 1.2 Footer template (paste under every cold email)

```
—
[First name] · Pup Prints · https://pup-prints.vercel.app
[Street or registered PO box], [City], [ST] [ZIP]
This is a business offer from Pup Prints. We found your address on [your website / your Google listing].
Not interested? Reply "no thanks" and we won't email you again.
```

### 1.3 The honest AI line (use when asked, or in the first email to memorial and rescue partners)

> "Our AI artist creates each portrait, and a person on our team checks the likeness and every print before it's made."

Never write "hand-painted" or "by our artists". Don't lead with "AI" in subject lines; lead with their dog.

### 1.4 Cadence

| Day | Touch | Note |
|---|---|---|
| 0 | Email or DM with the reveal link | One ask |
| 3 | Follow-up 1, same thread | Two lines. One follow-up lifts replies ~66% ([Backlinko](https://backlinko.com/email-outreach-study)) |
| 7 | DM on Instagram/Facebook, **or** a call, **or** a walk-in (local) | Different channel |
| 14 | Final note, same thread | Then stop. Status `declined` if no reply by day 21 |

**Memorial partners:** day 0 and day 10 only. Never more than two emails.

---

## 2. Universal pieces

### Subject lines that work for this offer (36–50 characters performs best)

- `A portrait of [Dog name], for [Business]`
- `I made a portrait of [Dog name] for you`
- `[Dog name] as an Admiral. For your front desk?`
- `A free portrait for every [Kennel] puppy family`
- `For [Rescue]: a portrait for every adopter`

Say "made", never "painted". "Painted" reads as a hand-painting claim.

### Partner disclosure line (FTC; goes on every partner card, sign and post)

> "[Business] earns a referral fee when you order."

Use it whenever the partner gets a commission or credit. Without a fee, the line isn't needed.

### What we can honestly say about ourselves

- New studio, launched October 2026.
- Free preview in about a minute. Try every style free.
- Love it or we remake or refund it. Free US shipping. Hi-res file free with every print.
- A person checks every print before it's made.
- **Never** cite reviews, customer counts, press, "trusted by" or partner counts we don't have. If asked: "We're new. That's why the preview is free and the guarantee is remake or refund."

---

## 3. Scripts by category

### 3.1 Breeders: "The Breeder's Gift"

#### One-pager (paste into email or send as a link)

> **The Breeder's Gift, from [Kennel] and Pup Prints**
>
> Every puppy family leaves with a card in their go-home pack: **"[Puppy]'s first portrait, from [Kennel]."**
>
> - **For your families:** they upload a photo and see a fine-art portrait free, in about a minute. **20% off any piece** (canvas, framed print, print or digital) for **12 months**, so the first birthday and gotcha day count too.
> - **For you:** cards printed and shipped free. **10%** of every order from your code, paid monthly, or we send it as a donation to your breed rescue if you prefer. Free portraits of your sire and dam for your website and socials, credited "Portrait by Pup Prints".
> - **No cost, no minimums, no exclusivity.** Stop any time.
> - **Quality:** our AI artist creates each portrait; a person checks the likeness and every print before it's made. Love it or we remake or refund it.
>
> *Optional, for breeders who want to give a finished gift:* the **Puppy Portrait Certificate**, $15 each in packs of 10. Each one is worth $29 toward any piece, which covers the hi-res portrait outright. *(Available once certificates launch.)*

#### Cold email

**Subject:** A portrait of [Sire/Dam name], for [Kennel]

> Hi [Name],
>
> I run Pup Prints, a small studio that makes fine-art portraits of dogs. I made one of [Sire/Dam name] from the photo on your site, just for you: [reveal link]
>
> The idea: a card in every go-home pack that says "[Puppy]'s first portrait, from [Kennel]." Your families see their puppy's portrait free in about a minute and get 20% off any piece for a year. It costs you nothing. We print the cards, and you earn 10% of every order (or we donate it to your breed rescue).
>
> Do you have a litter going home before the holidays? I can have cards to you within a week.
>
> [First name]
> [footer]

#### Instagram DM

> Hi! I made a portrait of [Dog] from your page, a little gift: [reveal link]. We're a new dog-portrait studio. Would you want a free card for your puppy packs ("[Puppy]'s first portrait, from [Kennel]")? Families get 20% off and you earn 10%. No cost to you.

#### Follow-ups

- **Day 3:** "Hi [Name], did the portrait of [Dog] come through? Happy to make one of [other dog] too, if you'd like it for your site."
- **Day 7 (DM or call):** "Hi, it's [First name] from Pup Prints. I sent a portrait of [Dog] last week. Quick question: do you put anything in your go-home packs? I'd love to send 25 free cards for your next litter."
- **Day 14:** "Last note from me. If puppy-pack cards would ever be useful, just reply 'cards' and I'll mail them. Either way, [Dog]'s portrait is yours to keep."

#### Phone script (60 seconds)

> "Hi, this is [Name] from Pup Prints, a dog-portrait studio. I sent [Name] a portrait of [Dog] last week. Do you have a minute?
> We put a card in breeders' puppy packs: 'Your puppy's first portrait, from [Kennel].' Families see it free and get 20% off for a year. It costs you nothing and you earn 10%. When's your next litter going home? I'll mail cards this week."

#### Puppy-pack card copy (customer-facing; house voice)

> **Front:** THE BREEDER'S GIFT · [Puppy]'s first portrait, from [Kennel].
> **Back:** Upload a photo. See the portrait, free, in about a minute.
> 20% off any piece for twelve months: code **[KENNELCODE]** · [QR to /?ref=KENNELCODE]
> Love it, or we remake or refund it. Free US shipping.
> Our AI artist creates each portrait; our team checks every print before it is made.
> [Kennel] earns a referral fee when you order.

#### Breeder objections

| They say | We say |
|---|---|
| "My families already get a lot in the pack." | "This is the one they'll frame. It's a card, it costs you nothing, and it's from you." |
| "Is it AI?" | "Yes. Our AI artist makes it, and a person checks every portrait and print. Judge it on [Dog]: that's the real thing." |
| "I don't want to seem like I'm selling to buyers." | "The card is a gift from you: a free preview, no obligation. The fee line is there so it's honest." |
| "What's the catch?" | "None. No cost, no minimum, no exclusivity. You can stop any time." |
| "Can you do my logo on it?" | "Your kennel name, yes. We keep logos off for now so cards print fast." |

---

### 3.2 Groomers, doggy daycares, boarding and trainers

#### One-pager

> **Portraits for your clients, from [Salon]**
>
> - **The counter card.** A small stand with a QR code: "Your dog, as a work of art. See it free." Clients get **15% off**; you earn **15%** of every order, paid monthly.
> - **Groomed Portrait Day** (optional). Forward us after-photos you already take, 10–30 a month. We turn each into a portrait and send you a private link to text the client: "A portrait of [Dog] after today's groom, from [Salon]." No cost to you.
> - **For the holidays:** "Holiday Portrait with every groom", Nov 1 to Dec 10, in our fireside Holiday style. Order by Dec 10 for delivery before Christmas; digital Gift Reveals work right up to Dec 24.
> - **For your wall:** a framed portrait of your shop dog once you've shared your first 10 links.
> - **Nothing to stock, no money to handle.** We ship, support and refund. Love it or we remake or refund it.
>
> Trainers: same terms, as a **graduation portrait** for every puppy-class graduate. Daycares: a **Pup of the Month** portrait on the lobby wall.

#### Cold email

**Subject:** [Shop dog] as a portrait, for your front desk

> Hi [Name],
>
> I made a portrait of [shop dog] from your Instagram as a small thank-you for the work you post: [reveal link]
>
> We're a new dog-portrait studio. Groomers already take the best photos of freshly groomed dogs, so here's an idea: you text clients a free portrait of their dog after the groom ("from [Salon]"), and if they order, they get 15% off and you earn 15%. Or simply keep our card at the counter.
>
> Could I drop off a few cards and a printed sample this week? Takes five minutes.
>
> [First name]
> [footer]

#### Instagram DM

> Hi [Salon]! Your grooms are gorgeous. I made a portrait of [Dog] from your feed, for you: [reveal link]. We're a new dog-portrait studio. Want to try sending your clients a free portrait after their groom? 15% off for them, 15% for you, nothing to stock.

#### Walk-in script (bring: a printed 8×10 of their shop dog if possible, 25 cards and a stand)

> "Hi, I'm [Name], I run a small dog-portrait studio. I made this of [shop dog] from your Instagram. It's yours.
> We give salons a card for the counter: clients see a portrait of their dog free in about a minute, get 15% off, and you earn 15%. If you ever want to send portraits of freshly groomed dogs, we'll make them for you, free.
> Can I leave 25 cards? I'll check in next month and bring a frame for [shop dog] once a few clients have tried it."

#### Follow-ups

- **Day 3:** "Hi [Name], did [shop dog]'s portrait land? Happy to drop off cards Thursday or Friday. Which suits?"
- **Day 7:** call or walk in (script above).
- **Day 14:** "Last note. If counter cards or holiday portraits would ever help, reply 'cards'. Enjoy [shop dog]'s portrait either way."

#### Counter card copy (customer-facing)

> **Front:** Your dog, as a work of art. · See the portrait, free, in about a minute.
> **Back:** [QR to /?ref=SALONCODE] · 15% off any piece with code **SALONCODE**
> Canvas · Framed · Print · Digital. Free US shipping. Love it, or we remake or refund it.
> [Salon] earns a referral fee when you order.

#### Groomed Portrait Day: how it runs

1. The salon emails or texts us after-photos, **with the client's OK** (most salons already ask before posting).
2. We make each in Admin → Gifts: `partner_id` = salon, `sender_name` = "[Salon]", `pet_name` = dog.
3. We send the salon the list of links. The salon texts each client: "A little gift after today's groom: [link]. From all of us at [Salon]."
4. Orders attribute automatically. Commission shows on the salon's stats page.

#### Groomer objections

| They say | We say |
|---|---|
| "We're slammed through December." | "Then just the counter card. Nothing to do. The holiday portrait links are optional." |
| "Clients will feel sold to." | "You choose who gets a link, and it's a free gift with no obligation. The card just sits there." |
| "We sell photo sessions." | "We complement them. We can make portraits from *your* photos, and clients who want the session still book it." |
| "How do I get paid?" | "Monthly, by PayPal or bank, 30 days after each order is delivered (that's our guarantee window). You can see your numbers on your stats page." |
| "Is it worth it for us?" | "It costs nothing. On a $99 canvas with the client's 15% off, your 15% is about $12.60. And the portrait is a gift your clients remember you for." |

---

### 3.3 Memorial partners: crematories, aftercare, in-home euthanasia, vets

**Read first: ethics rules.**
- We never contact families. The partner offers our card, and the family chooses.
- No urgency, no expiry pressure, no humor, no discount-led headline. Any courtesy is in small print and lasts 12 months.
- Memorial styles only: Watercolor, Old Master, Botanical, Charcoal, Fine Line.
- Likeness checked by a person. Remake or refund, always.
- **Vets:** no fee by default. If a clinic asks for a fee, it must be on the card.
- Start in **January**, with physical samples and memorial mode live.

#### One-pager (crematory / aftercare)

> **Memorial portraits for [Partner] families**
>
> A quiet card in the return package: **"When you're ready, a portrait of your companion. The preview is free."**
>
> - **Two ways to work together:**
>   1. **Referral.** Families receive a 10% courtesy on any piece for 12 months; you earn 15%.
>   2. **Reseller.** Include a Memorial Portrait in your packages at our list price; we invoice you wholesale (Canvas 16×20 $65, Framed 12×16 $65, Digital $15).
> - **Gentle by design.** Soft styles only and no urgency. We never contact families who haven't come to us. A family who previews gets at most a short, gentle reminder series that stops with one click.
> - **Quality.** Our AI artist creates each portrait from the family's photo; a person on our team checks the likeness and every print before it's made. Remake or refund, always.
> - **We'll send framed samples** for your arrangement room.

#### Cold email (crematory or aftercare owner)

**Subject:** A memorial portrait option for [Partner] families

> Hello [Name],
>
> I'm [First name], founder of Pup Prints, a small portrait studio for dogs. I'm reaching out because [Partner] already offers families thoughtful keepsakes like [paw prints / urns / jewelry, from their site].
>
> We make gentle memorial portraits in watercolor and old-master styles. A family uploads a favorite photo and sees the portrait free before deciding anything. Our AI artist creates it, and a person checks every portrait and print.
>
> As an example, here is one made from [your shop dog / a photo on your site, with permission]: [reveal link]
>
> If it would fit your aftercare, I'd be glad to send framed samples and a few cards for your arrangement room, either as a referral or wholesale at your list price. Would a 10-minute call next week work?
>
> With care,
> [First name]
> [footer]

**Only follow-up (day 10):** "Hello [Name], just making sure this reached you. If a sample would help you decide, I'm happy to send one. If not, no reply needed."

#### Email to a vet practice manager

**Subject:** A free sympathy gesture for [Clinic] families

> Hello [Name],
>
> I'm [First name] from Pup Prints, a small dog-portrait studio. Many clinics send a sympathy card when a patient dies; we'd like to offer something to slip inside it.
>
> The card reads: "When you're ready, a portrait of your companion. The preview is free." Families can see a gentle watercolor or old-master portrait of their dog at no cost, and order a print only if they want one. **The clinic pays nothing and receives nothing from orders**, so nothing conflicts with your recommendations.
>
> If you'd prefer to give the portrait itself, clinics can prepay a digital Sympathy Portrait for $15 per family.
>
> May I send 50 cards and a framed sample for the front desk?
>
> [First name]
> [footer]

#### Sympathy insert copy (customer-facing)

> **Front:** In loving memory.
> **Inside:** When you're ready, a portrait of your companion. Upload a favorite photo; the preview is free, with no obligation.
> [QR to /?ref=PARTNERCODE] · A 10% courtesy from [Partner] on any piece, for twelve months: **PARTNERCODE**
> Each portrait is created by our AI artist and checked by our team. If it isn't right, we remake it or refund you.
> *(Only if the partner earns a fee:)* [Partner] receives a referral fee.

#### Memorial objections

| They say | We say |
|---|---|
| "We don't want to upsell grieving families." | "Agreed. That's why it's an optional card with a free preview, no urgency, no emails from us. You decide whether to include it." |
| "We already sell keepsakes." | "This sits alongside them. Families who want a portrait otherwise go online on their own; this keeps it with you, and you can resell it at our list price." |
| "AI feels cold for this." | "Understood. Look at the sample: a person checks every likeness, and if it's not right we remake it or refund. We'll never call it hand-painted." |
| Vet: "Conflict of interest?" | "No fee by default. If you want one, it's printed on the card." |

---

### 3.4 Shelters and rescues

For adoptable-dog portraits, the press release and the phone script, use [channels/shelter-partnership.md](../channels/shelter-partnership.md). Add the **adoption portrait** below.

#### Add-on email (after the first yes, or as the opener for adoption-heavy rescues)

**Subject:** A portrait for every [Rescue] adopter

> Hi [Name],
>
> Here's [longest-stay dog] as a portrait, made from your listing photo: [reveal link]. Private, not posted anywhere.
>
> One more idea, free: when a dog goes home, the adopter gets a link from you: "Welcome home, [Dog]. A portrait to mark the day, from your friends at [Rescue]." It costs you nothing and needs only the photo you already have. If they ever want a print, they get 15% off for a year.
>
> We don't tie donations to sales, so there's nothing to register or disclose. When we donate, it's a flat gift we decide in advance.
>
> Want to try it with this week's adoptions?
>
> [First name]
> [footer]

**Follow-ups:** day 3 ("Want me to make portraits of your 3 longest-stay dogs while you decide?"), day 7 (call, using the shelter-plan phone script), day 14 (last note).

#### Adopter card (or a text the rescue sends)

> **Welcome home, [Dog].** A portrait to mark the day, from your friends at [Rescue]: [personal reveal link]
> 15% off any piece for twelve months: **RESCUECODE**
> *(Only if the rescue receives a referral fee, after legal sign-off:)* [Rescue] receives a referral fee when you order.

**Never** say "a portion of every purchase goes to [Rescue]". Several states regulate that as a commercial co-venture.

---

### 3.5 Pet boutiques and stores (Q1, once samples are ready)

#### Cold email or walk-in

**Subject:** [Shop dog] for your wall, on us

> Hi [Name],
>
> I made a portrait of [shop dog] from your Instagram: [reveal link]. I'd like to give you a framed print of it for the shop, with a small QR stand beside it: "Your dog, as a work of art. See yours free."
>
> Customers who order get 15% off; you earn 15–20% of each order. No inventory, no register, no returns to handle. In the new year we'll also have printed gift certificates for the counter at trade pricing.
>
> Could I bring it by next week?
>
> [First name]
> [footer]

#### Boutique objections

| They say | We say |
|---|---|
| "We need wholesale margin." | "With consignment you earn on every order with zero stock. Wholesale certificates (40% off face) come in Q1." |
| "We only buy through Faire." | "We plan to list on Faire once certificates launch, and I'll send you our Faire link the day we do. Until then, the consignment frame needs no purchase at all." |
| "Wall space is precious." | "It's your own dog on the wall. If nothing comes of it in 60 days, keep the frame anyway." |

---

### 3.6 Realtors and corporate gifting

#### Realtor DM or email

**Subject:** A closing gift they'll hang first

> Hi [Name],
>
> Congrats on [recent listing or sale from their feed]. I run Pup Prints, a dog-portrait studio. For clients with dogs, we make a closing gift you can reveal at the table: a link opens a fine-art portrait of their dog, and the framed print ships to the new address after move-in. "From [Your name]", if you like.
>
> Agent pricing is 10% off (framed 12×16: $85.50, delivered). Here's one I made of [their dog, if public]: [reveal link]
>
> Want me to set up the next one?
>
> [First name]
> [footer]

Notes:
- It's a genuine closing gift. We don't pay realtors for referring clients, and the agent should check their broker's gift rules.
- Business-gift tax deductibility is the agent's question.

#### Corporate email (people-ops lead or founder)

**Subject:** Holiday gifts for the dog people on your team

> Hi [Name],
>
> For teams with dog lovers: each person gets a private link that reveals a fine-art portrait of their own dog, and can choose a print or keep it digital. It works for remote teams and arrives instantly. Orders of 10+ are 10% off, 25+ are 15% off, invoiced.
>
> Here's an example: [reveal link]. Happy to run a pilot with 5 people.
>
> [First name]
> [footer]

---

## 4. Partner terms (plain English; send with every "yes")

1. **Your link and code.** `https://pup-prints.vercel.app/?ref=[CODE]` and code `[CODE]`. Your customers get [X]% off any piece. Codes never stack with sitewide events; the customer gets the better one.
2. **Your fee.** [Y]% of what the customer paid (after discounts, before tax). It locks 30 days after delivery (our remake or refund window). Refunded orders don't count. Paid monthly on the 15th by PayPal or bank transfer. A W-9 is required before the first payout; a 1099 is issued if you pass the federal threshold.
3. **Disclosure.** Any card, sign or post that recommends us must say "[Business] earns a referral fee when you order." It's the law (FTC) and our rule.
4. **Photos.** Only send us photos of client dogs with the client's OK. We use them only to make that client's portrait, and we never post a dog without written permission.
5. **Accuracy.** Please don't describe portraits as hand-painted, promise delivery dates beyond what our site shows, or ask for trademarked characters.
6. **Ads.** Don't bid on "Pup Prints" in search ads.
7. **Ending.** Either of us can stop any time by email. Fees already earned are still paid.

---

## 5. Master objection list

| Objection | Response |
|---|---|
| "Send me some info." | Send the category one-pager plus their dog's reveal link, then ask one question: "Would cards or links suit you better?" |
| "How many reviews or customers do you have?" | "We're new; we launched in October. That's why the preview is free and the guarantee is remake or refund. Judge us on [Dog]." |
| "Is it AI?" | "Yes. Our AI artist creates it, and a person checks the likeness and every print. We'll never call it hand-painted." |
| "What does it cost me?" | "Nothing, unless you choose to prepay gifts for your clients." |
| "We need corporate approval." | "Thanks. Who should I send it to?" Then mark `paused` with the contact. |
| "Not now." | "Totally fine. May I check back in [January / before your next litter]?" Add the date to notes. |
| "Take me off your list." | "Done, sorry for the bother." Set `declined`, note the opt-out, and never contact again. |

---

## 6. Do-not list

- No guessed, scraped-pattern or bought emails. No messages without the postal-address footer and opt-out.
- No cold marketing texts. No more than 4 touches (2 for memorial).
- No posting any dog (client, shelter, breeder) without written OK.
- No "proceeds go to charity" claims; flat donations only, announced after they're made.
- No fabricated reviews, partner counts, press or "trusted by".
- No contacting grieving families, and no urgency in anything memorial.
- No competitor names in outreach. Say "typical portrait shops" if a comparison is needed.
- No puppy mills or brokers as breeder partners. No trademarked characters or AKC/club logos in materials.
- No fees to vets unless disclosed. No realtor payments tied to home sales.

---

## 7. Tracking

- **Status flow in `/admin/partners`:** `prospect` → `contacted` (day 0) → `replied` → `negotiating` → `gifted` (cards or sample delivered) → `active` (first link shared or cards out) → `paused` / `declined`.
- **Notes:** dates of each touch, the source of the contact details, the opt-out date if any, the next step and date.
- **UTMs** on printed QR codes: `?ref=CODE&utm_source=[niche]&utm_medium=card&utm_campaign=b2b-q4`.
- **Weekly numbers:** touches sent, replies, actives, links sent by partners, partner-attributed orders, and reward cost per order (target ≤ $30 on a $99 order).
