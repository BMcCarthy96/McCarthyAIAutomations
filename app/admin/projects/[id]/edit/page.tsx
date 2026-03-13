import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, getMilestonesForProject } from "@/lib/admin-data";
import { EditProjectForm } from "@/components/admin/EditProjectForm";
import { MilestoneRowForm } from "@/components/admin/MilestoneRowForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Edit project | Admin",
  description: "Update project progress and status.",
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, milestones] = await Promise.all([
    getProjectById(id),
    getMilestonesForProject(id),
  ]);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Edit project
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Update progress and status. Changes appear on the client dashboard.
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <EditProjectForm
          projectId={project.id}
          projectName={project.name}
          initialProgress={project.progress}
          initialStatus={project.status}
        />
      </div>
      <section className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Milestones</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Update due dates and mark milestones complete.
        </p>
        {milestones.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            No milestones for this project.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-zinc-400">
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Due date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Actions</th>
                  <th className="px-4 py-2 font-medium w-24" />
                </tr>
              </thead>
              <tbody>
                {milestones.map((m) => (
                  <MilestoneRowForm key={m.id} milestone={m} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
