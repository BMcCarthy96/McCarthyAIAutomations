import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { NoClientAccount } from "@/components/dashboard/NoClientAccount";
import { getCurrentClientId } from "@/lib/portal-data";
import { getSupabaseServiceClient } from "@/lib/supabase";
import { isAdminUser } from "@/lib/admin-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServiceClient();
  const [clientId, isAdmin] = await Promise.all([
    getCurrentClientId(),
    isAdminUser(),
  ]);
  const showNoClientState = supabase !== null && clientId === null;

  return (
    <div className="min-h-screen bg-premium">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/85 shadow-lg shadow-black/20 ring-1 ring-white/[0.04] backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-8 lg:pr-8">
          <div className="flex min-w-0 items-center gap-4 lg:pl-64">
            <Link
              href="/dashboard"
              className="truncate bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-xl font-bold tracking-tight text-transparent"
            >
              Client portal
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
            <UserButton />
          </div>
        </div>
      </header>
      <DashboardSidebar />
      <div className="lg:pl-64">
        <div className="relative mx-auto max-w-5xl px-4 py-8 pl-14 sm:px-6 sm:pl-6 lg:px-8 lg:pl-8">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(99,102,241,0.12),transparent)]"
            aria-hidden
          />
          <div className="relative">
            {showNoClientState ? <NoClientAccount /> : children}
          </div>
        </div>
      </div>
    </div>
  );
}
