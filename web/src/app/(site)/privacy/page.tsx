import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Pup Prints collects, uses and protects your information and your dog photos, in plain English. We never sell your photos, and you can ask us to delete them.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "October 12, 2026";

const email = (
  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
);

const SECTIONS: LegalSection[] = [
  {
    id: "summary",
    title: "The short version",
    body: (
      <>
        <ul>
          <li>We use your photos only to make your portrait and fulfill your order. We never sell them.</li>
          <li>We don&apos;t use your photos or portraits in our marketing unless you give us permission.</li>
          <li>Payments are handled by Stripe. We never see or store your full card number.</li>
          <li>We use cookies and ad pixels to understand our site and measure our ads. You can opt out.</li>
          <li>You can ask us to see, correct or delete your information, including your photos, at any time: {email}.</li>
        </ul>
        <p>
          This policy explains what {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects when you use our website
          and services, how we use it, and the choices you have.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "Information we collect",
    body: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Photos</strong> of your dog that you upload, and the portraits we create from them. Your dog&apos;s name, if
            you tell us.
          </li>
          <li>
            <strong>Contact details</strong> like your name and email address, for example when you order, join our email list
            or contact us.
          </li>
          <li>
            <strong>Order details</strong> like your shipping address, the products you buy and, for gifts, the
            recipient&apos;s name and email address if you choose to send them a Gift Reveal.
          </li>
          <li>
            <strong>Messages</strong> you send us through our contact form or by email.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            Device and usage information such as your browser type, pages viewed, links clicked and approximate location
            (city or region) derived from your IP address.
          </li>
          <li>
            A one-way hashed version of your IP address, used to prevent abuse of our free previews. We don&apos;t store it in
            readable form.
          </li>
          <li>
            Information from cookies and similar technologies (see{" "}
            <a href="#cookies">Cookies, analytics and ad pixels</a>), including the link or creator referral code that brought
            you to our site.
          </li>
        </ul>
        <h3>Information from others</h3>
        <ul>
          <li>Payment confirmation from Stripe (for example, that a payment succeeded and the last four digits of a card).</li>
          <li>Delivery and tracking updates from our print partner and shipping carriers.</li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    body: (
      <ul>
        <li>To create your portrait previews and the final artwork.</li>
        <li>To process payments, print and ship your order, and send order, shipping and Gift Reveal emails.</li>
        <li>To answer your questions and honor our love-it guarantee.</li>
        <li>To send marketing emails if you&apos;ve signed up (you can unsubscribe any time).</li>
        <li>To understand how our site is used, improve it, and measure whether our ads work.</li>
        <li>To credit creator and affiliate partners when you arrive through their link.</li>
        <li>To prevent fraud and abuse, keep our service secure, and comply with the law.</li>
      </ul>
    ),
  },
  {
    id: "photos",
    title: "Your photos and how the art is made",
    body: (
      <>
        <p>
          Your portrait is created by our AI artist. To do that, we send your photo and the style you choose to third-party AI
          image-generation providers that process it on our behalf and return the artwork. We choose providers whose business
          terms do not allow them to use your photos to train their models.
        </p>
        <p>
          Your photos and portraits are stored securely with our hosting providers. A person on our team may look at your
          photo and portrait to check quality before printing, and to help you if you contact us.
        </p>
        <p>
          We will never sell your photos. We will only show your photo or portrait publicly (for example, on our website or
          social media) if you give us permission, and you can withdraw that permission at any time.
        </p>
        <p>You can ask us to delete your photos and previews at any time by emailing {email}.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share information with",
    body: (
      <>
        <p>We share information only as needed to run our service, with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> that work on our behalf: website hosting and databases, AI image generation,
            payment processing (Stripe), printing and fulfillment, shipping carriers, email delivery, and customer support
            tools. They may only use your information to provide their services to us.
          </li>
          <li>
            <strong>Analytics and advertising partners</strong> such as Vercel Analytics, Google Analytics, Meta and TikTok,
            through the cookies and pixels described below.
          </li>
          <li>
            <strong>Creator and affiliate partners</strong>, who see that an order came through their link so we can pay them,
            but not your contact details.
          </li>
          <li>
            <strong>Authorities or others</strong> when required by law, or to protect the rights, safety and property of our
            customers, ourselves or others.
          </li>
          <li>
            <strong>A buyer or successor</strong> if our business is sold or merged, in which case this policy will continue to
            apply to your information.
          </li>
        </ul>
        <p>
          <strong>We do not sell your personal information for money.</strong> Some advertising cookies and pixels may count as
          &ldquo;sharing&rdquo; for targeted advertising under certain US state laws. You can opt out as described below.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies, analytics and ad pixels",
    body: (
      <>
        <p>We use a small number of cookies and similar technologies:</p>
        <ul>
          <li>
            <strong>Essential</strong>: to make the site work, remember your portrait in progress and keep checkout secure.
          </li>
          <li>
            <strong>Attribution</strong>: when you arrive from a creator&apos;s link or an ad, we store the referral code and
            campaign details in a first-party cookie for 30 days so we can credit the right partner.
          </li>
          <li>
            <strong>Analytics</strong>: to understand which pages are useful and where the site can be improved.
          </li>
          <li>
            <strong>Advertising</strong>: pixels from Meta, TikTok and Google help us measure our ads and show them to people
            who might like them.
          </li>
        </ul>
        <p>
          You can block or delete cookies in your browser settings, adjust your ad preferences directly with Meta, TikTok and
          Google, or turn on Global Privacy Control in a supporting browser, which we treat as a request to opt out of sharing
          for targeted advertising.
        </p>
      </>
    ),
  },
  {
    id: "email",
    title: "Email marketing",
    body: (
      <p>
        If you join our email list, we&apos;ll send you occasional emails about new styles, offers and holiday shipping dates.
        Every marketing email has an unsubscribe link, and unsubscribing takes effect promptly. We&apos;ll still send emails
        about orders you place, like confirmations, Gift Reveals and shipping updates.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <p>
        We keep your photos, previews and portraits only as long as we need them to create, fulfill and support your order
        (including remakes under our guarantee) and to let you come back to your previews, unless you ask us to delete them
        sooner. We keep order and payment records as long as needed for tax, accounting and legal reasons. Marketing contacts
        are kept until you unsubscribe or ask us to delete them.
      </p>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        We protect your information with access controls, encryption in transit, and private storage for uploaded photos and
        finished portraits. No system is perfectly secure, but we work hard to keep your information safe and will let you
        know if a breach affects you, as the law requires.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and choices",
    body: (
      <>
        <p>Wherever you live, you can ask us to:</p>
        <ul>
          <li>Tell you what personal information we have about you and give you a copy.</li>
          <li>Correct information that&apos;s wrong.</li>
          <li>Delete your information, including your photos and portraits.</li>
          <li>Stop sending you marketing emails.</li>
          <li>Opt out of sharing for targeted advertising.</li>
        </ul>
        <h3>California residents</h3>
        <p>
          Under the California Consumer Privacy Act (CCPA), as amended, you have the right to know, access, correct and delete
          your personal information, to opt out of its sale or sharing, and to not be treated differently for using these
          rights. In the last 12 months we collected the categories of information described above (identifiers, commercial
          information, internet activity, approximate location, and the photos you provide) for the purposes described in this
          policy. We do not sell personal information or knowingly share the information of anyone under 16.
        </p>
        <p>
          To make a request, email {email} with the subject &ldquo;Privacy request&rdquo;. We&apos;ll confirm your request
          within 10 days and respond within 45 days. We may need to verify your identity, usually by confirming the email
          address you used with us. You may also use an authorized agent.
        </p>
        <p>Residents of other US states with privacy laws, and of Canada, can make the same requests the same way.</p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Our service is not directed to children under 13, and we don&apos;t knowingly collect their personal information. If you
        believe a child has given us information, please contact us and we&apos;ll delete it.
      </p>
    ),
  },
  {
    id: "international",
    title: "Where your information is processed",
    body: (
      <p>
        We are based in the United States and our service providers process information in the United States and other
        countries. If you&apos;re in Canada, your information will be transferred to and processed in the United States.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our service changes. We&apos;ll post the new version here with a new &ldquo;last
        updated&rdquo; date, and if the changes are significant we&apos;ll let you know by email or on our site.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <p>
        Questions or requests about privacy? Email {email} or use our <Link href="/contact?topic=privacy">contact form</Link>.
        A real person will reply.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <LegalPage
        eyebrow="Privacy"
        title="Privacy policy"
        lede={<p>Plain English, no tricks. Your photos are used to make your portrait, and that&apos;s it.</p>}
        updated={UPDATED}
        sections={SECTIONS}
      />
      <CtaBand />
    </>
  );
}
