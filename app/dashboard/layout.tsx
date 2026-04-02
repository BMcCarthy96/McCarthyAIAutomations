import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { getCurrentClientId } from "@/lib/portal-data";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";
import { getPortalDemoMode } from "@/lib/demo-portal";
import { DemoPortalProvider } from "@/components/dashboard/DemoPortalProvider";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { DemoSafeUserMenu } from "@/components/auth/DemoSafeUserMenu";
import { DashboardContentGate } from "@/components/dashboard/DashboardContentGate";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServiceClient();
  const [clientId, isAdmin, isDemo] = await Promise.all([
    getCurrentClientId(),
    isAdminUser(),
    getPortalDemoMode(),
  ]);
  const showNoClientState = supabase !== null && clientId === null;

  return (
    <div className="min-h-screen bg-premium">
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[var(--background)]/90 shadow-md shadow-black/15 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-8 lg:pr-8">
          <div className="flex min-w-0 items-center gap-4 lg:pl-64">
            <Link
              href="/dashboard"
              className="truncate bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-xl font-bold tracking-tight text-transparent"
            >
              Client portal
            </Link>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden />
            <Link
              href="/dashboard/assistant"
              className="hidden text-sm font-medium text-indigo-300/90 transition-colors hover:text-indigo-200 sm:inline"
            >
              Knowledge assistant
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline"
              >
                Admin
              </Link>
            )}
            <Link
              href="/"
              className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Back to site
            </Link>
            <DemoSafeUserMenu forceDemoMask={isDemo} />
          </div>
        </div>
      </header>
      <DashboardSidebar />
      <div className="lg:pl-64">
        <div className="relative mx-auto max-w-5xl px-4 py-10 pl-14 sm:px-6 sm:pl-6 lg:px-8 lg:py-12 lg:pl-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(99,102,241,0.12),transparent)]"
            aria-hidden
          />
          <div className="relative">
            <DashboardContentGate hasLinkedClient={!showNoClientState}>
              <DemoPortalProvider isDemo={isDemo}>
                <DemoModeBanner />
                {children}
              </DemoPortalProvider>
            </DashboardContentGate>
          </div>
        </div>
      </div>
    </div>
  );
}
