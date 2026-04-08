import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketingAuthRefresh } from "@/components/marketing/MarketingAuthRefresh";
import { isAdminUser } from "@/lib/admin-auth";

/** Avoid stale static shells; marketing pages include session-dependent CTAs. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminUser();
  return (
    <>
      <MarketingAuthRefresh />
      <Navbar isAdmin={isAdmin} />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
