import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  CalendarCheck2,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { getAllProjects } from "@/lib/admin-data";
import { CreateProjectUpdateForm } from "@/components/admin/CreateProjectUpdateForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminSection, AdminCard } from "@/components/admin/AdminSection";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal admin for clients, projects, support, and billing.",
};

const links = [
  { href: "/admin/clients", label: "Clients", icon: Users, desc: "Accounts & portal access" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, desc: "Engagements & delivery" },
  {
    href: "/admin/milestones",
    label: "Milestones",
    icon: CalendarCheck2,
    desc: "Rollout checkpoints",
  },
  { href: "/admin/support", label: "Support", icon: HelpCircle, desc: "Threads & replies" },
  { href: "/admin/billing", label: "Billing", icon: CreditCard, desc: "Invoices & links" },
];

const linkCardClass =
  "group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-5 ring-1 ring-white/[0.04] transition-all hover:border-indigo-400/25 hover:from-indigo-500/[0.07] hover:shadow-[0_12px_40px_-24px_rgba(79,70,229,0.25)]";

export default async function AdminOverviewPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Operations"
        title="Admin"
        subtitle="Fast access to clients, delivery, support, and billing—same data the portal reflects, tuned for internal workflows."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={linkCardClass}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-indigo-400/20 transition-colors group-hover:bg-indigo-500/25">
                <Icon className="h-5 w-5 text-indigo-300" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-white">{item.label}</span>
                <span className="mt-0.5 block text-xs text-zinc-500">{item.desc}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <AdminSection
        eyebrow="Client comms"
        title="Create project update"
        description="Posts to the client’s project updates feed—use for rollout notes and wins."
      >
        <AdminCard>
          {projects.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No projects yet. Create a client and project first.
            </p>
          ) : (
            <CreateProjectUpdateForm projects={projects} />
          )}
        </AdminCard>
      </AdminSection>
    </div>
  );
}
