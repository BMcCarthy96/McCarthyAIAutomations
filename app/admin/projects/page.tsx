import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, getAllClients } from "@/lib/admin-data";
import { CreateProjectSetupForm } from "@/components/admin/CreateProjectSetupForm";
import { services } from "@/lib/data";
import { Pencil } from "lucide-react";

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
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Progress</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white">{p.name}</td>
                <td className="px-4 py-3 text-zinc-300">{p.clientName}</td>
                <td className="px-4 py-3 text-zinc-400">{p.status}</td>
                <td className="px-4 py-3 text-zinc-400">{p.progress}%</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {projects.length === 0 && (
          <p className="mt-4 text-sm text-zinc-500">No projects yet.</p>
        )}
      </section>
    </div>
  );
}
