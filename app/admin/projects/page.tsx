import type { Metadata } from "next";
import { getAllProjects, getAllClients } from "@/lib/admin-data";
import { CreateProjectSetupForm } from "@/components/admin/CreateProjectSetupForm";
import { AdminProjectsList } from "@/components/admin/AdminProjectsList";
import { services } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AdminSection, AdminCard } from "@/components/admin/AdminSection";

export const metadata: Metadata = {
  title: "Projects | Admin",
  description: "View all projects.",
};

export default async function AdminProjectsPage() {
  const [projects, clients] = await Promise.all([
    getAllProjects(),
    getAllClients(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Delivery"
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} — engagements tied to clients and services.`}
      />

      <AdminSection
        eyebrow="Create"
        title="New project"
        description="Create a client engagement and project. Select client and service, then set name and status."
      >
        <div className="max-w-xl">
          <AdminCard>
            <CreateProjectSetupForm clients={clients} services={services} />
          </AdminCard>
        </div>
      </AdminSection>

      <AdminSection
        eyebrow="Directory"
        title="All projects"
        description="Filter by status and jump to edit. Archived projects are hidden from default filters."
      >
        <AdminProjectsList projects={projects} />
      </AdminSection>
    </div>
  );
}
