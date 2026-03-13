import type { Metadata } from "next";
import { getAllProjects } from "@/lib/admin-data";

export const metadata: Metadata = {
  title: "Projects | Admin",
  description: "View all projects.",
};

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Projects
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 font-medium text-zinc-400">Name</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Client</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-400">Progress</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {projects.length === 0 && (
        <p className="text-sm text-zinc-500">No projects yet.</p>
      )}
    </div>
  );
}
