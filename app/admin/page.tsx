import type { Metadata } from "next";
import Link from "next/link";
import { Users, FolderKanban, HelpCircle, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal admin for clients, projects, support, and billing.",
};

const links = [
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/support", label: "Support", icon: HelpCircle },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Admin
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Read-only views. Use the sidebar to manage clients, projects, support
          requests, and billing.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors hover:border-white/15 hover:bg-white/10"
            >
              <Icon className="h-8 w-8 shrink-0 text-indigo-400" />
              <span className="font-medium text-white">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
