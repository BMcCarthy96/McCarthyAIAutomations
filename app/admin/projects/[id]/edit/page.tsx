import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/admin-data";
import { EditProjectForm } from "@/components/admin/EditProjectForm";
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
  const project = await getProjectById(id);
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
    </div>
  );
}
