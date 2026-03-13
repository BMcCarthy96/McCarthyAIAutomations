"use client";

import { useActionState } from "react";
import {
  updateProjectAction,
  type UpdateProjectState,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/Button";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In progress" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
] as const;

const initialState: UpdateProjectState = { success: false, error: "" };

export function EditProjectForm({
  projectId,
  projectName,
  initialProgress,
  initialStatus,
}: {
  projectId: string;
  projectName: string;
  initialProgress: number;
  initialStatus: string;
}) {
  const [state, formAction] = useActionState(
    updateProjectAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />
      <p className="text-sm text-zinc-400">Editing: {projectName}</p>

      <div>
        <label
          htmlFor="progress"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Progress (%)
        </label>
        <input
          type="number"
          id="progress"
          name="progress"
          min={0}
          max={100}
          defaultValue={initialProgress}
          required
          className="w-full max-w-[8rem] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          required
          className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white [&_option:hover]:bg-white/10"
          defaultValue={initialStatus}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Project updated.
        </p>
      )}

      <Button type="submit" variant="primary" size="md">
        Save
      </Button>
    </form>
  );
}
