import type { Metadata } from "next";
import { CURRENT_CLIENT_ID, getProjectsWithDetails } from "@/lib/data";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProjectCard } from "@/components/dashboard/ProjectCard";

export const metadata: Metadata = {
  title: "My Services",
  description: "Your active services and project status.",
};

export default function DashboardServicesPage() {
  const projects = getProjectsWithDetails(CURRENT_CLIENT_ID);
  return (
    <div className="space-y-8">
      <PageHeader
        title="My Services"
        subtitle="Project status, next milestones, and recent updates."
      />
      <div className="space-y-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
