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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:pl-8 lg:pr-8">
          <div className="flex min-w-0 items-center gap-4 lg:pl-64">
            <Link
              href="/admin"
              className="truncate text-xl font-bold tracking-tight text-white"
            >
              Admin
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Client portal
            </Link>
            <Link
              href="/"
              className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:inline"
            >
              Site
            </Link>
            <UserButton />
          </div>
        </div>
      </header>
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 pl-14 sm:px-6 sm:pl-6 lg:px-8 lg:pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}
