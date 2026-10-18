/**
 * Breed landing pages (/breeds/[slug]).
 *
 * Content rules: every breed's copy is written for that breed (no name-swapping), facts are
 * limited to well-documented breed history (AKC breed pages + the AKC 2025 popularity list,
 * published 2026), and nothing claims sales, reviews or popularity of OUR products.
 * Style names come from the catalog via `n()`, so a rename never breaks copy.
 */
import { STYLE_MAP, type StyleSlug } from "@/lib/catalog";
import { BEFORE_AFTER, GALLERY, STYLE_SAMPLES } from "@/lib/samples";
import type { Breed } from "@/content/types";

const n = (slug: StyleSlug) => STYLE_MAP[slug].name;

/** When the breed copy was last reviewed (used for sitemap lastmod). */
export const BREEDS_UPDATED = "2026-10-13";

export const BREEDS: Breed[] = [
  {
    slug: "french-bulldog",
    name: "French Bulldog",
    plural: "French Bulldogs",
    nickname: "Frenchie",
    akcRank2025: 1,
    size: "small",
    personality: "Bat ears, big opinions and a face built for close-ups.",
    intro: [
      "The French Bulldog is America's most popular breed right now, No. 1 on the AKC's list for the fourth year running, and it isn't hard to see why. Frenchies pack a huge personality into a compact, muscular frame and treat every room as a stage. They descend from toy-sized bulldogs that traveled from England to France in the 1800s, where they became the darlings of Paris.",
      "For a portrait, everything starts with the face: the upright bat ears, the short muzzle, the soft folds above the nose and those round, dark eyes. Those are the features that make a Frenchie instantly recognizable, so they're the ones we protect. The good news is that a Frenchie face carries a classical oil painting as easily as a loud pop-art print, and a little absurdity (an ermine collar, a velvet cape) suits them perfectly.",
    ],
    coat: "Brindle, fawn, cream, white and pied coats all paint well. Dark brindle looks rich in the candlelit old-master styles; fawn and cream glow in watercolor.",
    tips: [
      {
        title: "Get both ears in the frame",
        body: "The bat ears are the Frenchie signature. Leave a little space above the head so neither ear tip gets cropped, even in a close-up.",
      },
      {
        title: "Light the folds from the side",
        body: "Soft window light from one side shows the wrinkles over the nose. Flat, front-on flash makes a Frenchie face look smudgy.",
      },
      {
        title: "Shoot at their eye level",
        body: "Crouch down. Photos taken from above shrink the ears and make the muzzle disappear.",
      },
    ],
    styles: [
      { slug: "royal", why: "A smooshed face and total self-confidence were made for velvet and ermine." },
      { slug: "watercolor", why: "Soft washes flatter fawn and cream coats while keeping the ears crisp." },
      { slug: "pop-art", why: "That compact, graphic silhouette reads beautifully in bold flat color." },
      { slug: "admiral", why: "Stocky, serious and slightly ridiculous in uniform. In the best way." },
    ],
    faq: [
      {
        q: "Will the portrait keep my Frenchie's bat ears and wrinkles?",
        a: "That's the goal. Our styles are built to keep your dog's face shape, ear shape and markings, so start with a photo where both ears and the folds over the nose are clearly visible. You'll see the portrait free before you buy, and if a detail is off you can regenerate it or try another photo.",
      },
      {
        q: "My Frenchie is brindle. Which style shows that best?",
        a: `Brindle striping comes through beautifully in the painterly styles, especially ${n("royal")} and ${n("oil-classic")}, where the candlelit background makes a dark coat glow. For a lighter, airier look, try ${n("watercolor")}.`,
      },
    ],
    sampleNames: ["French Bulldog"],
    related: ["boston-terrier", "bulldog", "boxer"],
  },
  {
    slug: "labrador-retriever",
    name: "Labrador Retriever",
    plural: "Labrador Retrievers",
    nickname: "Lab",
    akcRank2025: 2,
    size: "large",
    personality: "Endlessly good-natured, food-motivated and sure every visitor came to see them.",
    intro: [
      "Labs held the top spot on the AKC's popularity list for more than three decades and still sit at No. 2 in 2025. Their story starts in Newfoundland, where their ancestors worked alongside fishermen, before British breeders refined them into the retriever we know. They're friendly, eager and famously hard to photograph without a treat in your hand.",
      "In a portrait, a Lab's charm lives in the broad head, the soft, kind eyes and the otter tail you'll never fit in the frame. Their short, dense coat is simple to paint, which puts all the attention on expression, so a calm, straight-on photo often makes the strongest piece. Black, yellow and chocolate Labs each suit different styles, and a greying muzzle on an older Lab looks especially beautiful in classic oil.",
    ],
    coat: "The AKC recognizes black, yellow and chocolate, and yellow ranges from pale cream to fox red. Black Labs need good light to show detail; chocolate glows in warm oil tones.",
    tips: [
      {
        title: "Expose for a black coat",
        body: "Shoot black Labs in bright shade or beside a big window, and look for a sparkle of light in their eyes. A dark face against a bright background turns into a silhouette.",
      },
      {
        title: "Skip the midday sun on yellow coats",
        body: "Harsh sun washes out a yellow coat and flattens the face. Overcast days and open shade are your friends.",
      },
      {
        title: "Hold a treat above the lens",
        body: "Labs follow food with their whole soul. Hold a treat just above your phone and you'll get the alert, soft-eyed look in seconds.",
      },
    ],
    styles: [
      { slug: "oil-classic", why: "No costume needed. A Lab's honest face is made for a quiet, museum-style oil." },
      { slug: "admiral", why: "Broad shoulders and a loyal stare look right at home in a naval dress coat." },
      { slug: "watercolor", why: "Lovely with yellow and fox-red coats, and gentle enough for a memorial piece." },
      { slug: "holiday", why: "Labs and a fireside scene go together like Labs and anything edible." },
    ],
    faq: [
      {
        q: "Will a black Lab look good in a portrait?",
        a: `Yes, as long as the photo shows detail in the face. Choose one taken in good daylight where you can clearly see their eyes, not a dim indoor shot. Painterly styles like ${n("oil-classic")} and ${n("admiral")} handle black coats especially well.`,
      },
    ],
    sampleNames: ["Labrador", "Labrador Retriever"],
    related: ["golden-retriever", "labradoodle", "german-shorthaired-pointer"],
  },
  {
    slug: "golden-retriever",
    name: "Golden Retriever",
    plural: "Golden Retrievers",
    nickname: "Golden",
    akcRank2025: 3,
    size: "large",
    personality: "Sunshine in dog form, with a coat to match.",
    intro: [
      "The Golden Retriever was developed in the Scottish Highlands in the 1800s, largely through the breeding program of Lord Tweedmouth, to retrieve game across rough country and cold water. Today it's No. 3 on the AKC's popularity list and a strong contender for friendliest dog on any street. Goldens are gentle, people-focused and blessed with a face that seems to be permanently smiling.",
      "That warmth is what a good Golden portrait captures. The details to protect are the soft, feathered ears, the dark eyes and nose set against a light coat, and the feathering on the chest that frames the face. Goldens range from pale cream to deep red-gold, and the shade matters: lighter coats sing in watercolor and botanical styles, while deeper reds look magnificent in candlelit oil. Seniors with frosted muzzles make especially moving portraits.",
    ],
    coat: "Light golden, golden and dark golden, from near-cream to deep red. Darker coats glow in the old-master styles; paler coats are lovely on light watercolor and botanical backgrounds.",
    tips: [
      {
        title: "Include the chest feathering",
        body: "Frame from the top of the head down to the chest so the feathering and ears have room. It adds so much of their softness to the finished piece.",
      },
      {
        title: "Shoot in golden hour (really)",
        body: "Early morning or late afternoon light brings out the warm tones in the coat without blowing out the highlights.",
      },
      {
        title: "Choose the expression",
        body: "An open-mouthed smile reads joyful; a closed mouth reads regal. Pick the one that feels most like your dog.",
      },
    ],
    styles: [
      { slug: "royal", why: "Gentle eyes above an ermine collar: dignified, funny and very giftable." },
      { slug: "oil-classic", why: "Warm Rembrandt light makes a red-gold coat look like it belongs in a museum." },
      { slug: "botanical", why: "Paler Goldens look lovely in a soft wreath of flowers, especially as a memorial." },
      { slug: "watercolor", why: "Light washes suit cream coats and keep the feathering airy." },
    ],
    faq: [
      {
        q: "My Golden has a white face now. Should I use an older photo?",
        a: "Use whichever photo feels most like them to you. Many people love a portrait of their senior Golden, grey muzzle and all; others prefer a photo from their younger years. Previews are free, so you can try both and compare.",
      },
    ],
    sampleNames: ["Golden Retriever"],
    related: ["labrador-retriever", "goldendoodle", "english-springer-spaniel"],
  },
  {
    slug: "german-shepherd",
    name: "German Shepherd",
    plural: "German Shepherds",
    nickname: "Shepherd",
    akcRank2025: 4,
    size: "large",
    personality: "Loyal, sharp and always on duty, even from the couch.",
    intro: [
      "German Shepherds were developed in Germany in the late 1890s, largely through the work of former cavalry officer Max von Stephanitz, who set out to breed the ideal herding dog. Their intelligence and steadiness soon made them famous as police, military, guide and search-and-rescue dogs, and they're No. 4 on the AKC's 2025 list. At home they tend to be devoted to their family and quietly watchful of everyone else.",
      "A great Shepherd portrait is all about presence: the tall, upright ears, the long muzzle, the intelligent eyes and the saddle markings across the back and shoulders. The black-and-tan pattern gives a portrait gorgeous contrast, while sable and solid black coats call for good light so the face doesn't disappear. Because the breed has such a serious, noble look, the classical and military styles feel natural rather than silly.",
    ],
    coat: "Black and tan, black and red, sable and solid black are the most familiar. Contrasting saddle markings look superb in oil and charcoal; solid black dogs need a bright photo.",
    tips: [
      {
        title: "Ears up, please",
        body: "A squeaky toy or an odd noise just above the camera gets both ears standing tall. Half-lowered ears can make the portrait read as a different dog.",
      },
      {
        title: "Find the light for dark coats",
        body: "Shoot outdoors in open shade or by a large window so the eyes, and the tan markings around them, stay visible.",
      },
      {
        title: "Try a three-quarter angle",
        body: "A slight turn of the head shows off the long Shepherd muzzle better than a straight-on photo, which can shorten it.",
      },
    ],
    styles: [
      { slug: "admiral", why: "A natural officer: serious, watchful and born to wear epaulettes." },
      { slug: "charcoal", why: "Strong contrast and expressive eyes make a Shepherd a perfect monochrome study." },
      { slug: "oil-classic", why: "Rich black-and-tan markings glow in warm old-master light." },
      { slug: "royal", why: "That noble profile can carry an ermine cape without a hint of irony." },
    ],
    faq: [
      {
        q: "Can you make a portrait of a working or K-9 dog?",
        a: `Absolutely. Upload a clear photo of their face. Each style creates its own costume and background, so the portrait won't show a vest or badge, but ${n("admiral")} has the distinguished, decorated feel many handlers and owners of working dogs love.`,
      },
    ],
    related: ["doberman-pinscher", "rottweiler", "siberian-husky"],
  },
  {
    slug: "poodle",
    name: "Poodle",
    plural: "Poodles",
    akcRank2025: 6,
    size: "varies",
    personality: "Brilliant, athletic and far less fussy than the haircut suggests.",
    intro: [
      "Despite being France's national dog, the Poodle was first bred in Germany as a water retriever; the name comes from the German pudel, linked to splashing in water. The breed comes in three sizes (Standard, Miniature and Toy) and all of them are sharp, playful and surprisingly sporty. Poodles rank No. 6 on the AKC's 2025 list.",
      "Portrait-wise, Poodles are a dream and a challenge. The dream: an elegant head, a long muzzle and sculptural curls give every style something to work with. The challenge: a dense topknot can hide the eyes, and solid black or brown coats swallow light. Pick a photo where the eyes are clearly visible and the current clip is one you love, because the portrait will keep it. Then lean into the drama. A Poodle carries velvet and ermine better than most.",
    ],
    coat: "Solid colors are the norm: black, white, apricot, red, cream, silver, blue, brown and more. White and apricot look stunning in fine line and watercolor; a black Poodle shines in high-contrast pop art.",
    tips: [
      {
        title: "Show the eyes",
        body: "If the topknot falls over the eyes, brush it back or use a photo taken just after grooming. Likeness depends on the eyes.",
      },
      {
        title: "Keep the silhouette",
        body: "Leave space around the head and ears. The outline of the clip is part of what makes your Poodle look like your Poodle.",
      },
      {
        title: "Light a dark coat",
        body: "Black and brown curls need bright, soft light. Face your Poodle toward a window, not away from it.",
      },
    ],
    styles: [
      { slug: "royal", why: "Elegant posture and a sculpted clip were born for the palace." },
      { slug: "fine-line", why: "Curls and a long, elegant profile look wonderful in minimal ink." },
      { slug: "pop-art", why: "A black or white Poodle against blush pink is pure gallery wall." },
      { slug: "mid-century", why: "That poised, geometric outline translates perfectly into flat retro shapes." },
    ],
    faq: [
      {
        q: "Does it matter whether my Poodle is a Toy, Miniature or Standard?",
        a: "Not at all. Portraits focus on the head and shoulders, so a Toy Poodle looks every bit as grand as a Standard. What matters is a sharp photo where the eyes and the shape of the clip are clear.",
      },
    ],
    related: ["goldendoodle", "labradoodle", "havanese"],
  },
  {
    slug: "dachshund",
    name: "Dachshund",
    plural: "Dachshunds",
    nickname: "Doxie",
    akcRank2025: 5,
    size: "small",
    personality: "Long body, short legs, enormous courage. Mostly courage.",
    intro: [
      "Dachshunds were bred in Germany to hunt badgers (Dachs is German for badger), which explains a lot: the long, low body built for tunnels, the deep chest, the surprisingly big bark and the firm belief that they are much larger than they are. They come in smooth, wirehaired and longhaired coats, in standard and miniature sizes, and they climbed to No. 5 on the AKC's 2025 list.",
      "In a portrait, most of that famous body sits outside the frame, so the head does the talking: the long, tapered muzzle, the low-set floppy ears and the bright, slightly mischievous eyes. Wirehaired Doxies bring eyebrows and a beard, and longhaired ones bring silky feathered ears, so it's worth matching the style to the coat. A big personality in a small package makes them naturals for the funny, costume-heavy styles.",
    ],
    coat: "Red, black and tan, chocolate, cream, dapple and brindle are common. Dapple and brindle look terrific in pop art; red coats glow in oil.",
    tips: [
      {
        title: "Get down on the floor",
        body: "A Dachshund's eye level is about a foot off the ground. Lie down with your phone and their face will fill the frame naturally.",
      },
      {
        title: "Mind the muzzle angle",
        body: "A slight three-quarter angle shows off the length of the muzzle. Straight-on photos can make the nose look stubby.",
      },
      {
        title: "Let the ears hang",
        body: "Catch them sitting or standing rather than lying with their ears flopped sideways, so the ear shape reads clearly.",
      },
    ],
    styles: [
      { slug: "pop-art", why: "A long nose and a bold attitude are made for halftone dots and hot color." },
      { slug: "admiral", why: "Small, fearless and decorated: the perfect pocket-sized commander." },
      { slug: "mid-century", why: "That unmistakable profile is a gift for flat, retro shapes." },
      { slug: "royal", why: "They already believe they're royalty. Make it official." },
    ],
    faq: [
      {
        q: "Will the portrait show my Dachshund's long body?",
        a: "Our portraits are composed around the head and chest, which is where likeness lives, so expect a classic head-and-shoulders portrait rather than a full-length one. The famous profile still comes through in the muzzle and ears.",
      },
    ],
    sampleNames: ["Dachshund"],
    related: ["beagle", "chihuahua", "miniature-schnauzer"],
  },
  {
    slug: "beagle",
    name: "Beagle",
    plural: "Beagles",
    akcRank2025: 7,
    size: "medium",
    personality: "A nose with a dog attached, and the sweetest face in the pack.",
    intro: [
      "Beagles are scent hounds, bred in England to hunt rabbits in packs, and they still follow their noses with total commitment. They're merry, sociable and vocal (that baying howl is a feature, not a bug), and they hold steady at No. 7 on the AKC's 2025 list. Their compact size and gentle nature have made them family dogs for generations.",
      "A Beagle's face is a gift to a portrait: long, soft ears, big brown eyes and the classic tricolor pattern of black, tan and white, often with a white blaze down the muzzle. Those markings are what make your Beagle look like your Beagle, so a sharp, evenly lit photo matters more than a perfect pose. That pleading expression works in nearly every style, from a sweet storybook scene to a very serious naval portrait.",
    ],
    coat: "Tricolor (black, tan and white) is classic; lemon, red and white, and tan and white are common too. Tricolor contrast is wonderful in oil; lighter coats look soft in storybook and watercolor.",
    tips: [
      {
        title: "Bring the nose up",
        body: "Beagles inspect the ground constantly. A treat held right above your phone lifts the nose and brings the eyes to the lens.",
      },
      {
        title: "Even light for three colors",
        body: "Patchy sun blows out the white and hides the black saddle. Shade or an overcast sky keeps all three colors readable.",
      },
      {
        title: "Show the full ear",
        body: "Make sure both long ears hang naturally on either side of the face. They're a big part of the Beagle outline.",
      },
    ],
    styles: [
      { slug: "admiral", why: "A Beagle's earnest stare is perfect beneath gold epaulettes." },
      { slug: "oil-classic", why: "Tricolor markings look rich and painterly in warm, quiet oil." },
      { slug: "storybook", why: "Those ears and that face belong in a picture book." },
      { slug: "holiday", why: "A Beagle by the fire, guarding the cookies, is a holiday card waiting to happen." },
    ],
    faq: [
      {
        q: "Can the portrait match my Beagle's markings?",
        a: "Our styles are designed to keep markings like the white blaze, tan cheeks and black saddle. Use a clear, front-facing photo, check the free preview, and regenerate or try another photo if anything looks off.",
      },
    ],
    sampleNames: ["Beagle"],
    related: ["dachshund", "english-springer-spaniel", "cavalier-king-charles-spaniel"],
  },
  {
    slug: "rottweiler",
    name: "Rottweiler",
    plural: "Rottweilers",
    nickname: "Rottie",
    akcRank2025: 8,
    size: "large",
    personality: "A gentle goofball at home and a serious guardian at the door.",
    intro: [
      "Rottweilers take their name from the German town of Rottweil, where they drove cattle to market and pulled butchers' carts. Their roots are usually traced back to the drover dogs that traveled with Roman armies. Today they're No. 8 on the AKC's 2025 list, loved for their loyalty, their calm confidence and a goofy side they save for the people they trust.",
      "In a portrait, a Rottweiler's power comes from the broad head, the strong muzzle and the rich mahogany markings: the spots above the eyes, on the cheeks and on the chest. Those tan points carry most of the expression, so they need to be visible in your photo. Against a black coat they create exactly the kind of contrast old-master painters loved, which is why the regal and military styles look so natural on this breed.",
    ],
    coat: "Black with rust to mahogany markings. That contrast is ideal for candlelit oil and charcoal; the trick is a photo bright enough to show the tan eyebrows.",
    tips: [
      {
        title: "Light the eyebrows",
        body: "The tan spots above the eyes are a Rottie's expression. Turn them toward the light so those spots, and the eyes beneath, are clear.",
      },
      {
        title: "Shoot from their eye level",
        body: "From above, a big head looks oddly small and the chest disappears. Kneel down and let them fill the frame.",
      },
      {
        title: "Relaxed beats alert",
        body: "A soft mouth and calm eyes read noble; a hard stare can look stern in a dramatic style. Choose the mood you want on your wall.",
      },
    ],
    styles: [
      { slug: "royal", why: "All that dignity deserves ermine, and a black coat makes the gold glow." },
      { slug: "admiral", why: "Broad-chested and steady: the kind of officer a crew would follow." },
      { slug: "charcoal", why: "Black and tan become a striking monochrome study full of depth." },
      { slug: "oil-classic", why: "Warm, quiet light shows off the mahogany points beautifully." },
    ],
    faq: [
      {
        q: "My Rottie looks mostly black in photos. Will the portrait lose detail?",
        a: "Not if the photo has detail to work with. Choose a daylight photo where you can see the eyes and the tan markings clearly; phone photos taken indoors at night tend to lose them. The free preview shows you exactly what you'll get.",
      },
    ],
    related: ["doberman-pinscher", "cane-corso", "german-shepherd"],
  },
  {
    slug: "bulldog",
    name: "Bulldog",
    plural: "Bulldogs",
    akcRank2025: 10,
    size: "medium",
    personality: "Wrinkles, an underbite and the calm of a retired heavyweight.",
    intro: [
      "The Bulldog is so tied to British grit that 'bulldog spirit' became a national figure of speech. The breed's early history is darker (the name comes from the long-banned blood sport of bull-baiting), but generations of breeding turned it into the mellow, affectionate companion that ranks No. 10 on the AKC's 2025 list. Bulldogs are famously happy to supervise from the sofa.",
      "Few breeds give a portrait more character per square inch. The loose wrinkles, the small rose ears, the wide-set eyes and the trademark underbite are what make a Bulldog face, and they all reward good directional light. Bulldogs come in brindle, white, red, fawn and pied combinations, and their solid, sculptural build looks fantastic in heavy classical styles. Their deadpan dignity is exactly what makes a costume portrait so funny.",
    ],
    coat: "Brindle, fawn, red, white and piebald patterns. Brindle and red look superb in oil; white and fawn pied coats pop in pop art.",
    tips: [
      {
        title: "Side light for the wrinkles",
        body: "Sit your Bulldog beside a window, not facing it. Light from one side shapes the folds; flat light erases them.",
      },
      {
        title: "Wipe the jowls first",
        body: "A quick wipe before the photo keeps drool and shiny reflections out of the finished portrait.",
      },
      {
        title: "Show the underbite",
        body: "A relaxed, closed-mouth photo shows the jaw that makes a Bulldog face unmistakable.",
      },
    ],
    styles: [
      { slug: "royal", why: "Nobody wears ermine with more gravity. It's hilarious and somehow fitting." },
      { slug: "admiral", why: "A barrel chest was made for a naval coat and gold epaulettes." },
      { slug: "oil-classic", why: "Rembrandt light turns every wrinkle into texture worth framing." },
      { slug: "pop-art", why: "A Bulldog's broad, graphic face is a natural for bold color blocks." },
    ],
    faq: [
      {
        q: "Will the portrait keep the wrinkles? I don't want them smoothed out.",
        a: "Wrinkles are a big part of likeness, and our styles are designed to keep them. A sharp photo with side light gives the best result. Check the free preview; if anything looks too smooth, regenerate or try a different photo.",
      },
    ],
    related: ["french-bulldog", "boxer", "boston-terrier"],
  },
  {
    slug: "german-shorthaired-pointer",
    name: "German Shorthaired Pointer",
    plural: "German Shorthaired Pointers",
    nickname: "GSP",
    akcRank2025: 9,
    size: "large",
    personality: "An athlete in a ticked coat who never, ever runs out of energy.",
    intro: [
      "The German Shorthaired Pointer was developed in Germany in the 1800s as a do-it-all hunting dog that could point, retrieve and swim. That versatility, plus a friendly, eager nature, has carried the GSP up to No. 9 on the AKC's 2025 list. They're happiest with a job and a long run, and they'll remind you of both every day.",
      "GSPs have a noble, chiseled head: a long muzzle, high-set ears and almond eyes that always seem to be scanning the horizon. Their coats, usually liver or black with white ticking or roan patches, are a joy in paint because the speckles add texture and life. A classic pose in profile echoes centuries of sporting art, which is why a GSP looks so at home in old-master and naturalist styles.",
    ],
    coat: "Solid liver, liver and white, black and white, ticked and roan. Ticking adds lovely texture in oil and watercolor if the photo is sharp enough to show it.",
    tips: [
      {
        title: "Capture the profile",
        body: "A side or three-quarter view of a GSP on point (or watching a squirrel) shows off the classic sporting outline.",
      },
      {
        title: "Sharpness shows the ticking",
        body: "Freeze the motion with plenty of light or burst mode. Blur turns those lovely speckles to mush.",
      },
      {
        title: "Tire them out first",
        body: "A long walk before the photo buys you a few calm seconds. You'll need them.",
      },
    ],
    styles: [
      { slug: "oil-classic", why: "Sporting dogs have been painted in oil for centuries; a GSP fits right in." },
      { slug: "admiral", why: "Alert, upright and disciplined: an officer's bearing comes naturally." },
      { slug: "botanical", why: "Leaves and wildflowers nod to the fields where they're happiest." },
      { slug: "watercolor", why: "Loose washes make liver-and-white ticking look effortlessly elegant." },
    ],
    faq: [
      {
        q: "Will the portrait show my GSP's ticking and patches?",
        a: "Our styles are built to keep markings, including patches and ticking. The sharper and better lit your photo, the more of that detail comes through. You'll see it in the free preview before you buy.",
      },
    ],
    related: ["labrador-retriever", "english-springer-spaniel", "border-collie"],
  },
  {
    slug: "yorkshire-terrier",
    name: "Yorkshire Terrier",
    plural: "Yorkshire Terriers",
    nickname: "Yorkie",
    akcRank2025: 13,
    size: "toy",
    personality: "Tiny, fearless and fabulous, with a terrier's heart under all that silk.",
    intro: [
      "Yorkshire Terriers were developed in the north of England in the 1800s, where mill workers kept them to catch rats. Within a few generations the little ratter had become a fashionable companion, and it never looked back. Yorkies sit at No. 13 on the AKC's 2025 list and remain big-hearted, bossy and brave.",
      "Portrait-wise, a Yorkie is all about the face: dark, bright eyes, small upright ears and the silky blue-and-tan coat that frames it all. Long, flowing coats and short puppy cuts both work, and the portrait follows your photo, so choose the look you love. Because they're so small, the real trick is getting down to their level. Their spunky elegance suits royal and storybook styles beautifully.",
    ],
    coat: "Adults are blue and tan or black and tan, with gold on the face. Warm tan details shine in oil, and the silky texture looks lovely in watercolor.",
    tips: [
      {
        title: "Lie down for this one",
        body: "Shoot from floor level so the face isn't foreshortened. Small dogs photographed from above look like all head and no body.",
      },
      {
        title: "Clear the eyes",
        body: "Tie back a long fringe or take the photo right after grooming. Bright, dark eyes are a Yorkie's whole expression.",
      },
      {
        title: "Bow or no bow",
        body: "If a topknot bow is part of their look, try a photo with it and one without. Previews are free, so you can compare.",
      },
    ],
    styles: [
      { slug: "royal", why: "A Yorkie in ermine looks like it has always expected to be painted." },
      { slug: "storybook", why: "Tiny and brave: the hero of every picture book." },
      { slug: "botanical", why: "Silky tan and steel blue look lovely in a wreath of soft flowers." },
      { slug: "watercolor", why: "Soft washes bring out the silky, flowing coat." },
    ],
    faq: [
      {
        q: "Should I use a photo with a long coat or a short haircut?",
        a: "Whichever look you'd most like to remember. The portrait follows your photo, so a long, silky coat and a short puppy cut give quite different results, both lovely. Try each with the free preview.",
      },
    ],
    related: ["shih-tzu", "havanese", "pomeranian"],
  },
  {
    slug: "australian-shepherd",
    name: "Australian Shepherd",
    plural: "Australian Shepherds",
    nickname: "Aussie",
    akcRank2025: 14,
    size: "medium",
    personality: "A herding genius with marbled coats and eyes you never forget.",
    intro: [
      "Despite the name, the Australian Shepherd as we know it was developed in the western United States, working livestock on ranches; the 'Australian' probably refers to herding dogs that arrived alongside sheep imported from Australia. Aussies are clever, tireless and devoted, and they rank No. 14 on the AKC's 2025 list.",
      "No two Aussies look alike. Blue merle and red merle coats marble like stone, and many Aussies have striking blue or amber eyes, or one of each. Those unique details are the whole point of a portrait, so choose a photo with even light where the merle pattern and eye color are clear. The complexity of the coat looks gorgeous in loose, painterly styles, while the intense herding stare holds its own in a dramatic old-master treatment.",
    ],
    coat: "Blue merle, red merle, black and red, with or without white and copper trim. Merle patterns are stunning in watercolor and oil.",
    tips: [
      {
        title: "Daylight for eye color",
        body: "Blue and amber eyes need natural light to read correctly. Indoor lamps can turn them grey or orange.",
      },
      {
        title: "Map the merle",
        body: "Take a sharp, front-facing photo so the patches on the face, including any split face, land in the right places.",
      },
      {
        title: "Use the herding stare",
        body: "Aussies lock onto anything that moves. Wiggle a toy just above your phone.",
      },
    ],
    styles: [
      { slug: "watercolor", why: "Merle marbling and soft color blooms were made for each other." },
      { slug: "oil-classic", why: "That focused stare and copper trim look magnificent in candlelight." },
      { slug: "astronaut", why: "Fearless and always ready for the next mission. Space is just the next pasture." },
      { slug: "botanical", why: "Red merles and copper points glow against muted greens and florals." },
    ],
    faq: [
      {
        q: "My Aussie has two different colored eyes. Will the portrait keep that?",
        a: "Eye color is one of the details our styles are built to keep, including two different colored eyes. Use a daylight photo where both eyes are clearly visible, then check the free preview. If the colors aren't right, regenerate or try another photo.",
      },
    ],
    related: ["border-collie", "shetland-sheepdog", "bernese-mountain-dog"],
  },
  {
    slug: "cavalier-king-charles-spaniel",
    name: "Cavalier King Charles Spaniel",
    plural: "Cavalier King Charles Spaniels",
    nickname: "Cavalier",
    akcRank2025: 12,
    size: "toy",
    personality: "A lap dog with royal ancestry and a face made for a palace wall.",
    intro: [
      "Toy spaniels were favorites of England's Stuart court, and King Charles II was so fond of them that the dogs took his name. Painters such as Van Dyck put little spaniels into royal portraits, and in the 1920s an American, Roswell Eldridge, offered prizes at Crufts for spaniels that looked like the ones in those old paintings. That revival became the Cavalier, now No. 12 on the AKC's 2025 list.",
      "So a Cavalier in a royal portrait is less a costume than a homecoming. The features to protect are the long, silky, feathered ears, the large round eyes and the gently tapered muzzle. Many Blenheim Cavaliers carry a chestnut spot on the top of the head, known as the 'Blenheim spot', so keep it in frame. Their sweet expression is also perfect for the softer floral and watercolor styles.",
    ],
    coat: "Four colors: Blenheim (chestnut on white), tricolor, black and tan, and ruby. Blenheim and ruby glow in oil; tricolor is crisp in botanical and watercolor.",
    tips: [
      {
        title: "Keep the top of the head in frame",
        body: "If your Blenheim has the chestnut spot on the crown, leave room above the head so it isn't cropped.",
      },
      {
        title: "Let the ears fall",
        body: "Brush the ears so they fall naturally on both sides. Tucked or flipped ears change the whole outline.",
      },
      {
        title: "Soft light for big eyes",
        body: "Window light gives those large eyes a gentle sparkle without the glowing-eye effect of a flash.",
      },
    ],
    styles: [
      { slug: "royal", why: "The breed grew up in royal portraits. This is simply bringing it home." },
      { slug: "botanical", why: "A wreath of roses and ferns suits that sweet, gentle face." },
      { slug: "oil-classic", why: "Blenheim and ruby coats look rich and timeless in old-master oil." },
      { slug: "watercolor", why: "Feathered ears and big eyes look lovely in soft, luminous washes." },
    ],
    faq: [
      {
        q: `Why is ${n("royal")} such a good fit for Cavaliers?`,
        a: "Because it's history. Toy spaniels appear in 17th-century royal portraits, and the breed is named for King Charles II. A velvet cape and an ermine collar feel right at home on a Cavalier.",
      },
    ],
    sampleNames: ["Cavalier King Charles", "Cavalier King Charles Spaniel", "Cavalier"],
    related: ["english-springer-spaniel", "shih-tzu", "havanese"],
  },
  {
    slug: "pembroke-welsh-corgi",
    name: "Pembroke Welsh Corgi",
    plural: "Pembroke Welsh Corgis",
    nickname: "Corgi",
    akcRank2025: 16,
    size: "small",
    personality: "Big ears, short legs and the confidence of a dog who's met royalty.",
    intro: [
      "Pembroke Welsh Corgis were bred in Wales to herd cattle, nipping at heels while staying low enough to dodge the kicks. They're quick, bossy, funny and loyal, and they rank No. 16 on the AKC's 2025 list. Queen Elizabeth II famously kept Pembrokes for most of her long life, which has given the breed a lasting royal glow.",
      "In a portrait, a Corgi's face is pure charm: the big, upright, fox-like ears, the bright eyes, the white blaze and that famous open-mouthed smile. Red, sable, fawn and black-and-tan coats with white markings each bring their own warmth. Because Corgis are so cheerful, they shine in whimsical and playful styles, and those ears give bold graphic styles a terrific silhouette to work with.",
    ],
    coat: "Red, sable, fawn, and black and tan, usually with white. Red and sable glow in warm, cozy styles; tricolor pops in pop art.",
    tips: [
      {
        title: "Ears are everything",
        body: "Make a funny noise right before you shoot. Both ears up and forward is classic Corgi.",
      },
      { title: "Get low", body: "They're short. Lie on the floor so you're looking straight into their face." },
      {
        title: "Catch the smile",
        body: "Corgis often 'smile' with an open mouth after play. Take a burst of photos right after a game of fetch.",
      },
    ],
    styles: [
      { slug: "storybook", why: "A Corgi trotting through a meadow is basically a picture book already." },
      { slug: "pop-art", why: "Those ears make a fantastic graphic silhouette in bold color." },
      { slug: "holiday", why: "A red-and-white Corgi in a knit scarf by the fire is peak cozy." },
      { slug: "royal", why: "Velvet and ermine are a cliché. They're also extremely good." },
    ],
    faq: [
      {
        q: "Is a royal portrait too obvious for a Corgi?",
        a: `Maybe, but it's a very good obvious. If you'd like something different, ${n("storybook")} and ${n("pop-art")} both play to the Corgi's sunny personality. Try them all free and see which one makes you laugh.`,
      },
    ],
    sampleNames: ["Corgi", "Pembroke Welsh Corgi"],
    related: ["shetland-sheepdog", "australian-shepherd", "pomeranian"],
  },
  {
    slug: "doberman-pinscher",
    name: "Doberman",
    plural: "Dobermans",
    nickname: "Dobie",
    akcRank2025: 15,
    size: "large",
    personality: "Sleek, alert and secretly a velcro dog.",
    intro: [
      "The Doberman Pinscher was created in Germany in the late 1800s by Karl Friedrich Louis Dobermann, a tax collector who wanted a loyal protector on his rounds. The result was one of the most elegant working dogs ever bred: athletic, intelligent and deeply bonded to its family. Dobermans rank No. 15 on the AKC's 2025 list.",
      "A Doberman portrait lives on line and contrast: the long, wedge-shaped head, the rust markings above the eyes and on the muzzle, and a short, glossy coat that catches light like polished wood. Cropped or natural ears both work beautifully, and the portrait follows your photo. That noble profile suits disciplined, classical styles, and the sleek lines translate just as well into a graphic mid-century poster.",
    ],
    coat: "Black and rust, red and rust, blue and rust, and fawn (Isabella) and rust. The rust points are key; a glossy black coat looks magnificent in candlelit oil.",
    tips: [
      {
        title: "No flash on a glossy coat",
        body: "Flash bounces off a short, shiny coat and flattens the face. Use bright daylight instead.",
      },
      { title: "Profile power", body: "A three-quarter view shows the long muzzle and the elegant line of the neck." },
      {
        title: "Find the rust points",
        body: "Make sure the markings above the eyes are lit. They give a Doberman its expression.",
      },
    ],
    styles: [
      { slug: "admiral", why: "Disciplined, elegant and always at attention: the uniform fits." },
      { slug: "oil-classic", why: "A glossy coat and rust points glow like polished wood in old-master light." },
      { slug: "mid-century", why: "Sleek lines and a sharp silhouette are made for flat retro shapes." },
      { slug: "charcoal", why: "Strong contrast and a noble profile make a striking monochrome study." },
    ],
    faq: [
      {
        q: "Does it matter if my Doberman's ears are cropped or natural?",
        a: "Not at all. The portrait follows your photo, so the ears will look the way your dog's ears look. Just make sure both are in the frame.",
      },
    ],
    related: ["rottweiler", "german-shepherd", "great-dane"],
  },
  {
    slug: "boxer",
    name: "Boxer",
    plural: "Boxers",
    akcRank2025: 18,
    size: "large",
    personality: "A clown in a muscle suit, with a forehead that frowns at everything.",
    intro: [
      "Boxers were developed in Germany in the late 1800s from older mastiff-type hunting dogs. They kept the strength and traded the job for a full-time career in comedy. Bouncy, affectionate and endlessly expressive, they're No. 18 on the AKC's 2025 list.",
      "A Boxer's face does a lot of talking. The square, upturned muzzle, the dark mask, the forehead that wrinkles when they're curious and those dark, soulful eyes are what make the breed so recognizable. Fawn and brindle Boxers, often with flashy white markings, both look striking in paint. Because Boxers are so expressive, the right photo is simply the one that shows your dog's particular brand of mischief.",
    ],
    coat: "Fawn or brindle, often with white 'flash' markings; some Boxers are mostly white. Fawn glows in royal and oil styles; brindle is gorgeous in charcoal and pop art.",
    tips: [
      {
        title: "Make them wonder",
        body: "A new noise makes a Boxer tilt the head and wrinkle the forehead. That's the expression you want.",
      },
      { title: "Watch the black mask", body: "Shoot in bright, even light so the dark muzzle keeps its detail." },
      { title: "Use burst mode", body: "Boxers rarely hold still. Take a dozen and pick the sharpest." },
    ],
    styles: [
      { slug: "royal", why: "A wrinkled, worried brow above an ermine collar is comic perfection." },
      { slug: "pop-art", why: "Big expressions and a bold mask suit loud, flat color." },
      { slug: "admiral", why: "Square jaw, broad chest, gold epaulettes. Very convincing." },
      { slug: "astronaut", why: "Boundless energy deserves a launch pad." },
    ],
    faq: [
      {
        q: "My Boxer is mostly white. Will that work?",
        a: `Yes. White coats need a photo that isn't overexposed, so shoot in shade or on an overcast day and make sure the eyes and nose are crisp. ${n("watercolor")} and ${n("charcoal")} are especially pretty with white coats.`,
      },
    ],
    related: ["bulldog", "french-bulldog", "great-dane"],
  },
  {
    slug: "miniature-schnauzer",
    name: "Miniature Schnauzer",
    plural: "Miniature Schnauzers",
    nickname: "Mini Schnauzer",
    akcRank2025: 17,
    size: "small",
    personality: "A small dog with a big beard and an even bigger opinion.",
    intro: [
      "Miniature Schnauzers were developed in Germany in the late 1800s as farm ratters, bred down from the larger Standard Schnauzer. They're alert, spirited and talkative, and they rank No. 17 on the AKC's 2025 list. That face is part distinguished professor, part grumpy old man and entirely lovable.",
      "Schnauzer portraits succeed or fail on the 'furnishings': the bushy eyebrows, the long beard and the rectangular head they create. Those features need a sharp photo in which the eyebrows don't completely hide the eyes. Salt-and-pepper, black-and-silver and solid black coats all offer fantastic texture, which is why line-based and drawn styles look especially good on this breed. A Schnauzer in a naval coat is also very hard to argue with.",
    ],
    coat: "Salt and pepper, black and silver, and solid black. Wiry, textured coats look wonderful in fine line and charcoal.",
    tips: [
      {
        title: "Trim or part the eyebrows",
        body: "If the brows cover the eyes, give them a trim or wait until after the next grooming appointment.",
      },
      {
        title: "Keep the beard clean and dry",
        body: "A soggy, just-left-the-water-bowl beard photographs as a dark blob.",
      },
      {
        title: "Sharp beats posed",
        body: "The wiry texture is what makes a Schnauzer. Pick your sharpest photo, even if the pose is ordinary.",
      },
    ],
    styles: [
      { slug: "fine-line", why: "Eyebrows and beard are practically drawn in ink already." },
      { slug: "charcoal", why: "Salt-and-pepper texture looks rich and expressive in charcoal." },
      { slug: "admiral", why: "That beard was made for a captain's portrait." },
      { slug: "mid-century", why: "A boxy head and bold brows make a fantastic retro graphic." },
    ],
    faq: [
      {
        q: "Will the portrait show my Schnauzer's beard and eyebrows?",
        a: "Yes, they're central to likeness. A sharp photo where the eyes are visible beneath the brows gives the best result, and you'll see the free preview before deciding anything.",
      },
    ],
    related: ["yorkshire-terrier", "poodle", "dachshund"],
  },
  {
    slug: "cane-corso",
    name: "Cane Corso",
    plural: "Cane Corsos",
    nickname: "Corso",
    akcRank2025: 11,
    size: "giant",
    personality: "A calm, quiet guardian with the head of a Roman statue.",
    intro: [
      "The Cane Corso is an Italian mastiff whose ancestors are generally traced to the mastiff-type dogs of ancient Rome. For centuries they guarded farms and property across southern Italy, and the breed was brought back from near-extinction by Italian enthusiasts in the 1970s. Corsos have climbed fast in the US and reached No. 11 on the AKC's 2025 list.",
      "In a portrait, the Corso's huge, square head and deep muzzle create instant drama, and a calm, steady gaze reads as pure authority. Black, gray, fawn, red and brindle coats are all common, and the darker ones need strong, soft light so the face keeps its shape. Few breeds look so natural in an old-master painting. The classical styles feel less like a costume and more like a portrait that could hang in a palazzo.",
    ],
    coat: "Black, gray, fawn, red and brindle, sometimes with a gray or black mask. Gray and fawn look superb in charcoal and oil; black needs a bright photo.",
    tips: [
      {
        title: "Shoot slightly from below",
        body: "With the camera at chest height looking up a little, a big dog looks powerful and heroic.",
      },
      {
        title: "Light the brow",
        body: "Deep-set eyes need light from the front or side. A shaded brow can hide them completely.",
      },
      {
        title: "Calm is king",
        body: "A relaxed Corso looks noble; a mid-bark Corso looks like a warning sign. Wait for the quiet moment.",
      },
    ],
    styles: [
      { slug: "royal", why: "A Roman profile and an ermine cape: this one practically paints itself." },
      { slug: "admiral", why: "Calm authority suits a decorated naval command." },
      { slug: "charcoal", why: "Gray and brindle coats become sculptural in charcoal." },
      { slug: "oil-classic", why: "A big, quiet head in candlelight looks like a museum piece." },
    ],
    faq: [
      {
        q: "Is a Cane Corso too big for a portrait?",
        a: "Not at all. Portraits focus on the head and shoulders, and a Corso's head is about as portrait-friendly as it gets. For a dog with this much presence, many people choose one of our larger canvas or framed sizes.",
      },
    ],
    related: ["rottweiler", "great-dane", "doberman-pinscher"],
  },
  {
    slug: "great-dane",
    name: "Great Dane",
    plural: "Great Danes",
    nickname: "Dane",
    akcRank2025: 22,
    size: "giant",
    personality: "A gentle giant who still thinks they're a lap dog.",
    intro: [
      "Great Danes were developed in Germany (not Denmark, despite the name) to hunt wild boar, and later became guardians of grand estates. Today they're famously sweet-natured, a little clumsy and convinced they fit on any sofa. The breed sits at No. 22 on the AKC's 2025 list.",
      "A Dane's long, rectangular head, high-set ears and soulful eyes give a portrait real gravity, and their coat colors offer beautiful variety: fawn, brindle, black, blue, harlequin, mantle and merle. Harlequins and mantles have bold patches that need to land in the right places, so choose a clear, front-facing photo. A dog this regal is made for the grandest styles. Put a Dane in an admiral's coat and it looks like it commands the fleet.",
    ],
    coat: "Fawn, brindle, black, blue, harlequin, mantle and merle. Harlequin and mantle patterns are striking in pop art; fawn and brindle glow in oil.",
    tips: [
      {
        title: "Don't shoot down at them",
        body: "Ironically, the usual mistake with giant dogs is standing up. Shoot from their head height so the face isn't distorted.",
      },
      {
        title: "Map the patches",
        body: "For harlequins and mantles, a straight-on photo in even light keeps the patches on the face where they belong.",
      },
      {
        title: "Give the ears room",
        body: "Cropped or natural, leave space above the head so the ears aren't clipped.",
      },
    ],
    styles: [
      { slug: "admiral", why: "Tall, dignified and born to command the fleet." },
      { slug: "royal", why: "A dog this grand deserves the full velvet-and-ermine treatment." },
      { slug: "oil-classic", why: "Fawn and brindle coats glow in quiet, warm old-master light." },
      { slug: "pop-art", why: "Harlequin patches look incredible in bold, flat color." },
    ],
    faq: [
      {
        q: "What size portrait suits a Great Dane?",
        a: "Any size works, since portraits are head and shoulders, but there's something right about a big dog on a big wall. Our largest canvas and framed sizes make a real statement above a sofa or console.",
      },
    ],
    related: ["cane-corso", "doberman-pinscher", "bernese-mountain-dog"],
  },
  {
    slug: "shih-tzu",
    name: "Shih Tzu",
    plural: "Shih Tzus",
    akcRank2025: 21,
    size: "toy",
    personality: "A palace dog at heart, with a face like a chrysanthemum.",
    intro: [
      "The Shih Tzu's history runs through the imperial courts of China, where small 'lion dogs' were treasured companions, and the breed's ancestors are thought to have come from Tibet. The name is usually translated as 'little lion', and while they're more cuddle than roar, they carry themselves with unmistakable dignity. Shih Tzus are No. 21 on the AKC's 2025 list.",
      "The coat grows outward in every direction around the face, giving the Shih Tzu its famous 'chrysanthemum' look, framed by big, dark, round eyes and a short muzzle. Whether your dog wears a full flowing coat, a topknot or a practical puppy cut, the portrait follows your photo. Their royal backstory makes the regal styles an easy choice, while their sweetness suits softer floral and storybook scenes.",
    ],
    coat: "Almost every color and pattern: gold, white, black, liver, brindle and parti. Gold and white coats glow in oil; parti coats look charming in storybook.",
    tips: [
      {
        title: "Get the hair off the eyes",
        body: "A topknot or a fresh trim makes all the difference. The eyes are the heart of a Shih Tzu portrait.",
      },
      { title: "Come down to their level", body: "Sit on the floor and hold a treat right above the lens." },
      { title: "Brush before the photo", body: "A quick brush fluffs the face into that lovely chrysanthemum shape." },
    ],
    styles: [
      { slug: "royal", why: "Centuries of palace life make the ermine feel overdue." },
      { slug: "storybook", why: "A sweet, round face and a flowing coat belong in a picture book." },
      { slug: "botanical", why: "The chrysanthemum face among real flowers is a lovely visual rhyme." },
      { slug: "watercolor", why: "Soft washes bring out the silky texture of the coat." },
    ],
    faq: [
      {
        q: "Should I use a photo with a topknot?",
        a: "If your Shih Tzu usually wears one, yes, because it keeps the eyes visible and it's part of their look. If not, choose a photo taken soon after a trim. The portrait follows your photo, so pick the version you love.",
      },
    ],
    related: ["havanese", "yorkshire-terrier", "pomeranian"],
  },
  {
    slug: "siberian-husky",
    name: "Siberian Husky",
    plural: "Siberian Huskies",
    nickname: "Husky",
    akcRank2025: 30,
    size: "medium",
    personality: "A dramatic, talkative escape artist with ice-blue eyes.",
    intro: [
      "Siberian Huskies were bred by the Chukchi people of northeastern Siberia as endurance sled dogs, able to pull light loads over long distances in brutal cold. They became American heroes in 1925, when sled-dog teams relayed diphtheria serum to Nome, Alaska. Today they're No. 30 on the AKC's 2025 list, and famously friendly, vocal and mischievous.",
      "Husky portraits are all about the eyes and the mask. Blue eyes, brown eyes, one of each, or 'parti' eyes with two colors in one are among the most striking features in the dog world, and the facial mask, the pattern of white and darker fur around the eyes and muzzle, is unique to each dog. A symmetrical, front-facing photo in good daylight captures both. Their wolfish looks and adventurous spirit make bold, cinematic styles feel completely natural.",
    ],
    coat: "Black, gray, red, agouti, sable and white, usually with white markings and a facial mask. Gray and white coats are striking in charcoal; reds glow in oil.",
    tips: [
      {
        title: "Daylight for those eyes",
        body: "Blue eyes can look gray or washed out indoors. Open shade outdoors gives them their true color.",
      },
      {
        title: "Square up the mask",
        body: "A straight-on photo shows the symmetry of the facial markings, which is a huge part of likeness.",
      },
      {
        title: "Snow is tricky",
        body: "Snow fools phone cameras into underexposing. Tap your dog's face on screen to set exposure before you shoot.",
      },
    ],
    styles: [
      { slug: "astronaut", why: "Built for extreme environments. Space is the obvious next step." },
      { slug: "charcoal", why: "A dramatic mask and pale eyes make a stunning monochrome study." },
      { slug: "watercolor", why: "Cool grays and icy blues bloom beautifully on white paper." },
      { slug: "admiral", why: "That piercing gaze was made for surveying a grey sea." },
    ],
    faq: [
      {
        q: "My Husky has one blue eye and one brown. Can the portrait show that?",
        a: "Yes. Eye color, including two different colored eyes, is one of the details our styles are built to keep. Choose a daylight photo where both eyes are clearly visible. If the preview gets it wrong, regenerate or try a different photo.",
      },
    ],
    sampleNames: ["Husky", "Siberian Husky"],
    related: ["german-shepherd", "australian-shepherd", "bernese-mountain-dog"],
  },
  {
    slug: "bernese-mountain-dog",
    name: "Bernese Mountain Dog",
    plural: "Bernese Mountain Dogs",
    nickname: "Berner",
    akcRank2025: 20,
    size: "giant",
    personality: "A gentle Swiss farm dog wrapped in a tricolor teddy-bear coat.",
    intro: [
      "Bernese Mountain Dogs come from the farmlands around Bern in Switzerland, where they pulled carts, drove cattle and kept watch. They're big, strong, calm and wonderfully affectionate, and they rank No. 20 on the AKC's 2025 list. Berners are famous for leaning their whole weight against the people they love.",
      "Their tricolor coat is one of the most beautiful in dogdom: jet black, with rich rust on the cheeks, eyebrows and legs, and a crisp white blaze and chest marking that owners often call the 'Swiss cross'. A great Berner portrait keeps that symmetry and the warm brown eyes, which means good, even light is essential. Their gentle, wholesome look suits cozy, classic styles. A Berner by a crackling fire is about as heartwarming as art gets.",
    ],
    coat: "Tricolor: black, rust and white. The contrast is spectacular in oil and holiday styles; keep the black areas well lit.",
    tips: [
      {
        title: "Balance the three colors",
        body: "Shoot in shade or on a cloudy day. Bright sun overexposes the white blaze while the black coat goes flat.",
      },
      {
        title: "Show the chest",
        body: "Frame down to the chest to include the white marking. It completes the tricolor pattern.",
      },
      {
        title: "Brush the ruff",
        body: "A quick brush fluffs the cheeks and chest so the coat reads soft, not tangled.",
      },
    ],
    styles: [
      { slug: "oil-classic", why: "Black, rust and white glow like an Alpine farmhouse painting." },
      { slug: "holiday", why: "A Berner by the fire in a knit scarf is the definition of cozy." },
      { slug: "botanical", why: "Wildflowers frame that gentle face like a Swiss meadow." },
      { slug: "watercolor", why: "Soft washes keep the tricolor bold but tender, lovely for a memorial." },
    ],
    faq: [
      {
        q: "Will the black, rust and white markings come out right?",
        a: "That's what our styles are designed to do: keep your dog's markings in the right places. An evenly lit, front-facing photo that shows the face and chest gives the best result, and you'll see it free before you buy.",
      },
    ],
    related: ["great-dane", "golden-retriever", "australian-shepherd"],
  },
  {
    slug: "pomeranian",
    name: "Pomeranian",
    plural: "Pomeranians",
    nickname: "Pom",
    akcRank2025: 19,
    size: "toy",
    personality: "A tiny, foxy cloud of fluff with a big-dog attitude.",
    intro: [
      "Pomeranians descend from much larger Spitz-type working dogs and take their name from Pomerania, a region on the Baltic coast. Queen Victoria fell for a small Pom in Italy in the 1880s and helped make the little ones fashionable in Britain. Today they're No. 19 on the AKC's 2025 list, still bold, bright and very much in charge.",
      "Poms have a sweet, fox-like face with almond eyes, small pricked ears and a huge ruff of fluff around the neck. In photos, that coat can swallow the face, so the best portrait photos are crisp and close, with the eyes and ears clearly visible. Orange, cream, sable, black and parti coats all look lovely, and the fluff gives painterly styles wonderful texture. Thomas Gainsborough painted a Pomeranian in the 1770s, so the classical styles have precedent.",
    ],
    coat: "Orange, red, cream, sable, black, chocolate, merle and parti. Orange and cream glow in royal and watercolor styles; parti and merle pop in pop art.",
    tips: [
      {
        title: "Find the face in the fluff",
        body: "Brush the fur away from the eyes and shoot close enough that the face fills most of the frame.",
      },
      { title: "Floor level, always", body: "Poms are tiny. Lie down so you're eye to eye." },
      {
        title: "Bright light, fast fingers",
        body: "Poms move constantly. Shoot near a window in burst mode and pick the sharpest frame.",
      },
    ],
    styles: [
      { slug: "royal", why: "A Pom in ermine looks like a Victorian court favorite. Because it was one." },
      { slug: "storybook", why: "A round, fluffy hero for any picture book." },
      { slug: "pop-art", why: "An orange cloud on blush pink? Yes, please." },
      { slug: "botanical", why: "Cream and orange fluff looks lovely among muted florals." },
    ],
    faq: [
      {
        q: "Will the portrait capture all that fluff?",
        a: "Yes. Texture is part of likeness, and painterly styles love a big coat. The key is a photo where the face is sharp and the eyes aren't buried in fur.",
      },
    ],
    related: ["chihuahua", "yorkshire-terrier", "shih-tzu"],
  },
  {
    slug: "boston-terrier",
    name: "Boston Terrier",
    plural: "Boston Terriers",
    nickname: "Boston",
    akcRank2025: 23,
    size: "small",
    personality: "The American Gentleman: tuxedoed, friendly and a little bit goofy.",
    intro: [
      "The Boston Terrier really is from Boston, developed there in the late 1800s from bulldog and terrier crosses. Its neat black-and-white markings earned it the nickname 'the American Gentleman', and its friendly, clownish temperament made it a classic city dog. Bostons are No. 23 on the AKC's 2025 list.",
      "Boston portraits work because the face is so graphic: big, round, wide-set eyes, a short square muzzle, upright ears and that crisp white blaze down the middle. The tuxedo pattern (black, brindle or seal with white) needs balanced light so the white doesn't blow out and the dark doesn't go flat. Their dapper look plays perfectly in uniform, and those bold markings were practically designed for pop art.",
    ],
    coat: "Black, brindle or seal, with white markings. The high contrast looks crisp in pop art, fine line and mid-century.",
    tips: [
      {
        title: "Tame the contrast",
        body: "Black-and-white dogs are hard for phone cameras. Skip direct sun; open shade keeps both the white blaze and the dark coat detailed.",
      },
      {
        title: "Both ears, both eyes",
        body: "Big eyes and upright ears are a Boston's signature. Keep them fully in the frame.",
      },
      {
        title: "Watch for reflections",
        body: "Large, round eyes reflect everything. Turn off the flash and angle away from lamps.",
      },
    ],
    styles: [
      { slug: "admiral", why: "Already wearing a tuxedo. A dress uniform is a small step." },
      { slug: "pop-art", why: "Crisp black-and-white markings were made for bold color blocks." },
      { slug: "mid-century", why: "A dapper, graphic face suits a clean retro poster." },
      { slug: "fine-line", why: "Simple ink lines capture that neat tuxedo pattern beautifully." },
    ],
    faq: [
      {
        q: "Will the portrait confuse my Boston with a French Bulldog?",
        a: "It shouldn't. The portrait is made from your dog's photo, so it follows your Boston's own face shape, ears and markings rather than a breed template. Choose a sharp photo and check the free preview.",
      },
    ],
    related: ["french-bulldog", "bulldog", "boxer"],
  },
  {
    slug: "havanese",
    name: "Havanese",
    plural: "Havanese",
    akcRank2025: 25,
    size: "toy",
    personality: "Cuba's cheerful little ambassador, built for laps and laughter.",
    intro: [
      "The Havanese is Cuba's national dog, descended from small bichon-type dogs that arrived with Spanish settlers and became companions to the island's aristocracy. The breed dwindled after the Cuban Revolution and was rebuilt by enthusiasts in the United States. Today Havanese rank No. 25 on the AKC's 2025 list, loved for their sunny, social, slightly silly nature.",
      "A Havanese portrait centers on the dark, expressive eyes, the soft muzzle and the long, silky coat that falls in waves (or, in some dogs, cords). Every color is possible, from cream and gold to chocolate, black and parti. Because the coat can easily cover the eyes, a clear, close photo is the key. Their playful sweetness makes them a joy in storybook and watercolor styles, and a bright pop-art palette suits that springy step too.",
    ],
    coat: "Any color or pattern: cream, gold, white, black, chocolate, brindle and parti. Light coats are lovely in watercolor; parti coats shine in storybook.",
    tips: [
      { title: "Clip back the fringe", body: "A small clip or a fresh trim keeps the eyes visible." },
      { title: "Shoot after a brush", body: "A freshly brushed coat reads soft and silky in a portrait." },
      { title: "Catch the bounce", body: "A burst of photos during play captures their happiest expression." },
    ],
    styles: [
      { slug: "storybook", why: "A cheerful little companion belongs in a cozy picture book." },
      { slug: "watercolor", why: "Silky, wavy coats look beautiful in loose washes." },
      { slug: "botanical", why: "Soft florals suit a sweet face and a flowing coat." },
      { slug: "pop-art", why: "A sunny personality deserves sunny colors." },
    ],
    faq: [
      {
        q: "My Havanese has a corded coat. Will that work?",
        a: "Yes. The portrait follows your photo, so cords, long silky coats and short puppy cuts all work. Just make sure the face and eyes are visible.",
      },
    ],
    related: ["shih-tzu", "poodle", "cavalier-king-charles-spaniel"],
  },
  {
    slug: "english-springer-spaniel",
    name: "English Springer Spaniel",
    plural: "English Springer Spaniels",
    nickname: "Springer",
    akcRank2025: 27,
    size: "medium",
    personality: "A happy, bouncing bird dog with freckles and feathered ears.",
    intro: [
      "English Springer Spaniels were bred to 'spring', or flush, birds from cover for hunters, and they still bring that bouncy enthusiasm to everything they do. They're friendly, eager to please and hard-working, and they rank No. 27 on the AKC's 2025 list.",
      "A Springer's portrait features are the long, wavy, feathered ears, the kind eyes and the freckled muzzle so many Springers have. Liver-and-white and black-and-white coats are classic, sometimes with tan points, and that contrast is beautiful in classical styles. Because Springers belong outdoors, a portrait that hints at the countryside, whether leafy botanicals or sporting-art oil, feels just right. They're also wonderfully photogenic when they finally sit still.",
    ],
    coat: "Liver and white, black and white, or either with tan, often ticked or roan. Freckled muzzles look wonderful in oil and watercolor.",
    tips: [
      {
        title: "Show off the ears",
        body: "Brush the ears so the waves fall naturally, and frame wide enough to include them.",
      },
      {
        title: "Sharp shows the freckles",
        body: "Ticking on the muzzle is part of their face. Choose your sharpest photo.",
      },
      { title: "Outdoors is best", body: "Springers are happiest outside. Shade under a tree gives soft, even light." },
    ],
    styles: [
      { slug: "oil-classic", why: "Springers have starred in sporting paintings for generations." },
      { slug: "botanical", why: "Ferns and wildflowers nod to the hedgerows they love." },
      { slug: "watercolor", why: "Feathered ears and freckles look lovely in loose washes." },
      { slug: "admiral", why: "Earnest, loyal and keen: a fine first mate." },
    ],
    faq: [
      {
        q: "Can the portrait include my Springer's freckles?",
        a: "That's the aim. Ticking and freckles are part of what makes your dog look like your dog, and our styles are built to keep markings. A sharp, well-lit photo helps a lot.",
      },
    ],
    related: ["cavalier-king-charles-spaniel", "german-shorthaired-pointer", "golden-retriever"],
  },
  {
    slug: "shetland-sheepdog",
    name: "Shetland Sheepdog",
    plural: "Shetland Sheepdogs",
    nickname: "Sheltie",
    akcRank2025: 29,
    size: "small",
    personality: "A sensitive, clever herder in a miniature collie coat.",
    intro: [
      "Shetland Sheepdogs come from the Shetland Islands off the north of Scotland, where small, hardy dogs herded sheep, ponies and poultry. They look like a small Collie but are their own breed: bright, sensitive, devoted and famously quick learners. Shelties are No. 29 on the AKC's 2025 list.",
      "Sheltie portraits hinge on the elegant, wedge-shaped head, the almond eyes, the tipped ears and the magnificent mane and frill around the neck. Sable, tricolor and blue merle are the most familiar colors, and some blue merles have blue or partly blue eyes. That luxurious coat is a gift to painterly styles, and the Sheltie's gentle expression makes soft watercolor and floral portraits especially lovely.",
    ],
    coat: "Sable, tricolor, blue merle, bi-black and bi-blue, with white. Sable glows in oil; blue merle is beautiful in watercolor.",
    tips: [
      {
        title: "Keep the tipped ears",
        body: "Sheltie ears fold at the tips. Get their attention with a sound so the ears lift into their natural shape.",
      },
      { title: "Include the mane", body: "Frame down to the chest so the full white frill is visible." },
      { title: "Even light for merle", body: "Shade or cloudy daylight shows the merle pattern without hot spots." },
    ],
    styles: [
      { slug: "watercolor", why: "Blue merle and sable look luminous in soft, blooming washes." },
      { slug: "botanical", why: "A gentle face framed in flowers, perfect for a sensitive soul." },
      { slug: "oil-classic", why: "A golden sable mane glows in warm old-master light." },
      { slug: "storybook", why: "A clever little herder is the natural hero of a countryside tale." },
    ],
    faq: [
      {
        q: "Should I use a photo of my Sheltie in full coat?",
        a: "If you love the full mane, yes: pick a photo after a good brush, when the frill is at its fullest. If your Sheltie is mid-shed, the portrait will follow that look instead. Previews are free, so you can try both.",
      },
    ],
    related: ["border-collie", "australian-shepherd", "pembroke-welsh-corgi"],
  },
  {
    slug: "border-collie",
    name: "Border Collie",
    plural: "Border Collies",
    akcRank2025: 26,
    size: "medium",
    personality: "The workaholic genius of the dog world, with a stare that could herd you.",
    intro: [
      "Border Collies were developed along the border between Scotland and England to herd sheep, and they're widely regarded as one of the most intelligent breeds there is. They're intense, athletic and happiest with a job to do (and if you don't give them one, they'll invent one). The breed climbed to No. 26 on the AKC's 2025 list.",
      "The famous Border Collie 'eye', the focused, hypnotic stare they use to move livestock, is the heart of any portrait. Black and white is classic, but red, blue, merle, tricolor and sable are common too, and ears range from fully pricked to soft and folded. Capture the eyes and the quirks of the markings and you've captured the dog. Minimal, graphic and monochrome styles suit that intensity beautifully.",
    ],
    coat: "Black and white is classic; red, blue, lilac, merle, tricolor and sable also appear. Black and white is striking in fine line and charcoal; merle looks gorgeous in watercolor.",
    tips: [
      {
        title: "Use the stare",
        body: "Hold a ball right next to your phone. A Border Collie will lock on and give you the most intense look of its life.",
      },
      {
        title: "Keep the quirks",
        body: "Many Border Collies have one ear up and one down, or an uneven blaze. Choose a photo that shows them; they're what makes yours yours.",
      },
      { title: "Freeze the motion", body: "They rarely stop. Use burst mode in bright light." },
    ],
    styles: [
      { slug: "fine-line", why: "Minimal ink matches their focus: nothing wasted, every line deliberate." },
      { slug: "charcoal", why: "Black-and-white coats and that intense stare make a powerful drawing." },
      { slug: "watercolor", why: "Merle and red coats bloom beautifully in soft washes." },
      { slug: "astronaut", why: "The smartest dog in the room deserves a mission to Mars." },
    ],
    faq: [
      {
        q: "My Border Collie has one ear up and one down. Will the portrait keep that?",
        a: "It should. The portrait is based on your photo, and ear shape is one of the details our styles are built to keep. Use a photo where both ears are clearly visible, and check the free preview.",
      },
    ],
    sampleNames: ["Border Collie"],
    related: ["australian-shepherd", "shetland-sheepdog", "german-shorthaired-pointer"],
  },
  {
    slug: "chihuahua",
    name: "Chihuahua",
    plural: "Chihuahuas",
    nickname: "Chi",
    akcRank2025: 24,
    size: "toy",
    personality: "The smallest breed around, with the largest sense of self.",
    intro: [
      "The Chihuahua is named for the Mexican state of Chihuahua, and its ancestors are often linked to the Techichi, a small companion dog of ancient Mexico. Widely considered the smallest dog breed, Chihuahuas make up for it with loyalty, sass and a fierce attachment to their favorite person. They're No. 24 on the AKC's 2025 list.",
      "A Chihuahua portrait is a study in big features on a tiny face: huge upright ears, large luminous eyes and either a rounded 'apple head' or a longer 'deer head' shape. Smooth and long coats come in nearly every color. Because they're so small, they're easy to photograph badly from above, so get low. And because their attitude is enormous, they're perfect candidates for the grandest, silliest styles we offer.",
    ],
    coat: "Smooth or long coats in almost any color: fawn, cream, chocolate, black, white, merle and parti. Fawn and cream glow in royal styles; bolder coats pop in pop art.",
    tips: [
      {
        title: "Lie down. Lower.",
        body: "Get your phone to their eye level, which is close to the floor. From above, a Chihuahua looks like a pair of ears.",
      },
      {
        title: "Ears fully in",
        body: "Those big ears reach right to the edges of the frame, so leave generous space around the head.",
      },
      { title: "Steady the shivers", body: "A warm, calm spot and burst mode help with a nervous or shivery Chi." },
    ],
    styles: [
      { slug: "royal", why: "The tiniest monarch with the biggest ego. Perfect." },
      { slug: "pop-art", why: "Big ears and bigger attitude look fantastic in loud color." },
      { slug: "astronaut", why: "Small enough to fit in any rocket, brave enough to fly it." },
      { slug: "mid-century", why: "Those ears make a wonderfully graphic retro silhouette." },
    ],
    faq: [
      {
        q: "Is there such a thing as too small for a portrait?",
        a: "No. Portraits focus on the face, so a tiny Chihuahua looks as grand as a Great Dane. Choose a sharp photo taken at their eye level.",
      },
    ],
    related: ["pomeranian", "dachshund", "yorkshire-terrier"],
  },
  {
    slug: "goldendoodle",
    name: "Goldendoodle",
    plural: "Goldendoodles",
    nickname: "Doodle",
    size: "varies",
    personality: "A walking teddy bear with a Golden's heart and a Poodle's curls.",
    intro: [
      "Goldendoodles are a cross between a Golden Retriever and a Poodle, popularized in the 1990s, and they've become one of the most familiar family dogs in America. Because they're a mix rather than a recognized breed, they don't appear on the AKC's list, and they vary a lot: size depends on whether a Standard, Miniature or Toy Poodle is involved, and coats range from loose waves to tight curls.",
      "That variety is exactly why a Goldendoodle portrait should follow your own dog, not a template. The features to protect are the coat texture, the shape of the face under the fluff and those dark eyes and nose against a cream, apricot or red coat. A fresh teddy-bear cut and a shaggy mid-grooming look produce very different portraits, so choose the version of your Doodle you love most. Soft, warm styles bring out their cuddly charm.",
    ],
    coat: "Cream, apricot, red, gold, chocolate, black and parti, in wavy, curly or straight coats. Cream and apricot glow in watercolor and storybook; red looks rich in oil.",
    tips: [
      {
        title: "Find the eyes",
        body: "Doodle fluff can hide the eyes completely. Trim, brush or use a photo from just after grooming.",
      },
      {
        title: "Protect light coats",
        body: "Cream coats wash out in bright sun. Open shade keeps the curl texture visible.",
      },
      {
        title: "Pick your favorite haircut",
        body: "The portrait follows your photo, so choose the cut you'd want to remember.",
      },
    ],
    styles: [
      { slug: "storybook", why: "A teddy-bear face was made for a picture book." },
      { slug: "watercolor", why: "Cream and apricot curls look dreamy in soft washes." },
      { slug: "royal", why: "Fluffy and regal is a surprisingly winning combination." },
      { slug: "botanical", why: "Warm coats look lovely nestled among muted flowers." },
    ],
    faq: [
      {
        q: "My Doodle looks totally different after grooming. Which photo should I use?",
        a: "Whichever version feels most like them. You can try both, free, and compare the previews side by side.",
      },
    ],
    related: ["labradoodle", "golden-retriever", "poodle"],
  },
  {
    slug: "labradoodle",
    name: "Labradoodle",
    plural: "Labradoodles",
    nickname: "Doodle",
    size: "varies",
    personality: "Friendly, bouncy and curly, with a Lab's love of absolutely everyone.",
    intro: [
      "The Labradoodle, a Labrador Retriever and Poodle cross, was first bred deliberately in Australia in the late 1980s, when Wally Conron of the Royal Guide Dogs Association of Victoria set out to create a guide dog for a woman whose husband was allergic to dogs. The idea caught on around the world. As a mix, Labradoodles aren't ranked by the AKC, but they're a fixture of American parks.",
      "Labradoodles vary widely: some have a Lab's sleek head and a light wave, others a full Poodle-style fleece. Chalk, cream, apricot, caramel, red, chocolate and black are all common. For a portrait, the essentials are the shape of the head, the dark eyes and the texture of the coat around the face. Their outgoing, sporty personality looks just as good in a bold pop-art print as in a classic oil painting.",
    ],
    coat: "Chalk, cream, apricot, caramel, red, chocolate, black and parti. Darker coats glow in oil; lighter, curly coats are lovely in storybook.",
    tips: [
      {
        title: "Show the head shape",
        body: "A three-quarter photo helps the portrait capture whether your Labradoodle has a Lab-like or Poodle-like head.",
      },
      {
        title: "Dark coats need light",
        body: "Chocolate and black Doodles need bright, soft light so the curls don't merge into one dark shape.",
      },
      {
        title: "Treat above the lens",
        body: "That Lab appetite is your best tool. Hold a treat over the camera for an alert, happy look.",
      },
    ],
    styles: [
      { slug: "oil-classic", why: "Chocolate and caramel coats look gorgeous in warm old-master light." },
      { slug: "storybook", why: "Curly, cheerful and huggable: a picture-book natural." },
      { slug: "pop-art", why: "An outgoing personality deserves a loud, happy palette." },
      { slug: "holiday", why: "A curly coat and a knit scarf by the fire is pure cozy." },
    ],
    faq: [
      {
        q: "Are Labradoodle portraits different from Goldendoodle portraits?",
        a: "Each portrait comes from your own dog's photo, so it's about your dog rather than the label. Labradoodles often have a slightly broader, Lab-like head and Goldendoodles a softer golden coat, which is why we suggest slightly different styles. Try any style free.",
      },
    ],
    related: ["goldendoodle", "labrador-retriever", "poodle"],
  },
  {
    slug: "mixed-breed",
    name: "Mixed Breed & Rescue Dog",
    plural: "mixed-breed and rescue dogs",
    nickname: "rescue",
    size: "varies",
    personality: "One of a kind, by definition. Their portrait should be too.",
    intro: [
      "Some of the best dogs in the world don't fit on a breed list. Mixed-breed and rescue dogs come with their own unrepeatable combination of ears, markings and expressions, and often with a story you love telling. You don't need to know what's in the mix to get a portrait that's unmistakably them.",
      "Because our portraits are made from your photo rather than a breed template, every quirk carries through: the one ear that flops, the freckle on the nose, the brindle patch shaped vaguely like Ohio. The key is a photo that shows those details clearly: sharp, well lit and at their eye level. Then pick a style that matches their personality, whether that's dignified, goofy, gentle or bold. And a gotcha day is a lovely excuse for a portrait.",
    ],
    coat: "Any coat at all. Choose a style for their personality and let the markings do the rest.",
    tips: [
      {
        title: "Show what makes them unique",
        body: "Make sure the photo clearly shows their most distinctive features, whether that's a split face, mismatched eyes or one upright ear.",
      },
      {
        title: "Use a recent, sharp photo",
        body: "Shelter listing photos are often small and dim. A fresh photo at home in daylight gives far more detail.",
      },
      {
        title: "Try a few styles",
        body: "Mixes can surprise you. Previews are free, so try a classic, a funny and a soft style and see which one feels like them.",
      },
    ],
    styles: [
      { slug: "oil-classic", why: "No costume, no labels: just your dog, painted like a museum piece." },
      { slug: "royal", why: "From the shelter to the throne. The glow-up story everyone loves." },
      { slug: "watercolor", why: "Soft and forgiving, lovely for any coat and any story." },
      { slug: "pop-art", why: "A one-of-a-kind face looks fantastic in bold, one-of-a-kind color." },
    ],
    faq: [
      {
        q: "Do I need to know my dog's breed?",
        a: "Not at all. The portrait is based entirely on your photo, so it follows your dog's actual face, ears and markings. No breed label required.",
      },
      {
        q: "Is a portrait a good gotcha-day gift?",
        a: "It's a lovely one. Many families celebrate the anniversary of adopting their dog, and a portrait marks the day in a way that lasts. You can send a Gift Reveal the moment you order and have the print follow.",
      },
    ],
    related: ["labrador-retriever", "german-shepherd", "chihuahua"],
  },
];

export const BREED_MAP: Record<string, Breed> = Object.fromEntries(BREEDS.map((b) => [b.slug, b]));

export function getBreed(slug: string): Breed | undefined {
  return BREED_MAP[slug];
}

/** Breeds in index order: AKC popularity first, then mixes, with "mixed / rescue" last. */
export const BREEDS_SORTED: Breed[] = [...BREEDS].sort((a, b) => {
  if (a.slug === "mixed-breed") return 1;
  if (b.slug === "mixed-breed") return -1;
  return (a.akcRank2025 ?? 100) - (b.akcRank2025 ?? 100);
});

export type BreedSample = {
  src: string;
  style: StyleSlug;
  alt: string;
  /** True when the image actually depicts this breed (vs. a generic style sample). */
  breedSpecific: boolean;
};

/**
 * The best sample to show for a breed: a portrait of that breed from the sample pipeline if one exists,
 * otherwise the generic sample of the breed's top recommended style. Alt text never claims a breed
 * the image doesn't show.
 */
export function breedSample(breed: Breed): BreedSample {
  const names = (breed.sampleNames ?? []).map((s) => s.toLowerCase());
  const pair = BEFORE_AFTER.find((p) => names.includes(p.dog.toLowerCase()));
  if (pair) {
    return {
      src: pair.after,
      style: pair.style,
      alt: `${STYLE_MAP[pair.style].name} portrait of a ${pair.dog}`,
      breedSpecific: true,
    };
  }
  const g = GALLERY.find((p) => names.includes(p.dog.toLowerCase()));
  if (g) {
    return {
      src: g.src,
      style: g.style,
      alt: `${STYLE_MAP[g.style].name} portrait of a ${g.dog}`,
      breedSpecific: true,
    };
  }
  const style = breed.styles[0].slug;
  return {
    src: STYLE_SAMPLES[style],
    style,
    alt: `Example ${STYLE_MAP[style].name} dog portrait`,
    breedSpecific: false,
  };
}

/** Related breeds: hand-picked first, then same-size breeds, never the breed itself. */
export function relatedBreeds(breed: Breed, count = 4): Breed[] {
  const picked = (breed.related ?? []).map((s) => BREED_MAP[s]).filter((b): b is Breed => Boolean(b));
  const sameSize = BREEDS_SORTED.filter((b) => b.size === breed.size && b.slug !== breed.slug);
  const fill = BREEDS_SORTED.filter((b) => b.slug !== breed.slug);
  const out: Breed[] = [];
  for (const b of [...picked, ...sameSize, ...fill]) {
    if (out.length >= count) break;
    if (!out.some((o) => o.slug === b.slug)) out.push(b);
  }
  return out;
}

/** Breeds whose recommendations include a style (for cross-linking from articles). */
export function breedsForStyle(style: StyleSlug, count = 6): Breed[] {
  return BREEDS_SORTED.filter((b) => b.styles.some((s) => s.slug === style)).slice(0, count);
}
