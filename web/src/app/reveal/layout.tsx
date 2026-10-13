import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** Standalone gift experience: no site header or footer. */
export default function RevealLayout({ children }: LayoutProps<"/reveal">) {
  return <>{children}</>;
}
