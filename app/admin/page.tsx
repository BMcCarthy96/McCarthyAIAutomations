import type { Metadata } from "next";
import Link from "next/link";
import { Users, FolderKanban, HelpCircle, CreditCard } from "lucide-react";
import { getAllProjects } from "@/lib/admin-data";
import { CreateProjectUpdateForm } from "@/components/admin/CreateProjectUpdateForm";

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

export default async function AdminOverviewPage() {
  const projects = await getAllProjects();

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

      <section>
        <h2 className="text-lg font-semibold text-white">Create project update</h2>
        <p className="mt-0.5 text-sm text-zinc-400">
          Add an update that appears on the client’s project updates page.
        </p>
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-6">
          {projects.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No projects yet. Create a client and project first.
            </p>
          ) : (
            <CreateProjectUpdateForm projects={projects} />
          )}
        </div>
      </section>
    </div>
  );
}
