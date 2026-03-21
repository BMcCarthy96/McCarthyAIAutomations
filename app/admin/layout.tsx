import Link from "next/link";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdminUser } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allowed = await isAdminUser();
  if (!allowed) redirect("/");

  return (
    <div className="min-h-screen bg-premium">
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[var(--background)]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--background)]/75">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent" />
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-8 lg:pr-8">
          <div className="flex min-w-0 items-center gap-4 lg:pl-64">
            <Link
              href="/admin"
              className="truncate text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
            >
              Admin
            </Link>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
            <span className="hidden text-xs font-medium uppercase tracking-wider text-zinc-500 sm:inline">
              Operations
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Client portal
            </Link>
            <Link
              href="/"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-10 pl-14 sm:px-6 sm:pl-6 lg:px-8 lg:pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
