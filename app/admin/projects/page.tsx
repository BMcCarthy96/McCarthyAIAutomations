import type { Metadata } from "next";
import { getAllProjects, getAllClients } from "@/lib/admin-data";
import { CreateProjectSetupForm } from "@/components/admin/CreateProjectSetupForm";
import { AdminProjectsList } from "@/components/admin/AdminProjectsList";
import { services } from "@/lib/data";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Projects
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white">New project</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Create a client engagement and project. Select client and service, then set name and status.
        </p>
        <div className="mt-4 max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
          <CreateProjectSetupForm clients={clients} services={services} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">All projects</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Filter by status to find projects quickly.
        </p>
        <div className="mt-4">
          <AdminProjectsList projects={projects} />
        </div>
      </section>
    </div>
  );
}
