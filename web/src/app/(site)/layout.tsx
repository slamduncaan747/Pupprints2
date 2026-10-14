import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { TopLine } from "@/components/site/top-line";

/**
 * Marketing pages are static, but the offer on them follows the calendar (the founding deadline, the
 * Christmas cutoff), so regenerate them at most hourly.
 */
export const revalidate = 3600;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopLine />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
