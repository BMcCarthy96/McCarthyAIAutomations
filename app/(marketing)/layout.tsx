import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketingAuthRefresh } from "@/components/marketing/MarketingAuthRefresh";

/** Avoid stale static shells; marketing pages include session-dependent CTAs. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingAuthRefresh />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
