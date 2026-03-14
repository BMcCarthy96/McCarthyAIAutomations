import type { Metadata } from "next";
import { fetchProjectsWithDetails } from "@/lib/portal-data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "My Services",
  description: "Your active services and project status.",
};

export default async function DashboardServicesPage() {
  const projects = await fetchProjectsWithDetails();
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Services"
        subtitle="Project status, next milestones, and recent updates."
      />
      <div className="space-y-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <EmptyState
            icon={Layers}
            title="No services yet"
            description="Your active services and projects will appear here once they’re set up. If you expect to see something, contact your account manager or use the contact form."
          />
        )}
      </div>
    </div>
  );
}
