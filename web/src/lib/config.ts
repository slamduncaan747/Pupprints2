/** Site-wide brand + contact configuration. Single source of truth for copy that repeats. */
export const site = {
  name: "Pup Prints",
  legalName: "Pup Prints",
  tagline: "Fine-art portraits of your dog.",
  description:
    "Turn your favorite photo into a museum-worthy portrait of your dog. See your custom portrait free in about a minute, then order it as a print, canvas, or framed piece.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pupprints.vercel.app",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "hello@pupprints.com",
  partnersEmail: process.env.NEXT_PUBLIC_PARTNERS_EMAIL ?? "partners@pupprints.com",
  social: {
    instagram: "https://www.instagram.com/pupprints",
    tiktok: "https://www.tiktok.com/@pupprints",
    pinterest: "https://www.pinterest.com/pupprints",
  },
} as const;

export type Site = typeof site;
