"use client";

import { useActionState } from "react";
import { createMilestoneAction } from "@/lib/admin-actions";
import type { CreateMilestoneState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: CreateMilestoneState = { success: false, error: "" };

const inputClass =
  "w-full max-w-xs rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export function AddMilestoneForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState(
    createMilestoneAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="add-milestone-title"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Title
          </label>
          <input
            type="text"
            id="add-milestone-title"
            name="title"
            required
            className={inputClass}
            placeholder="e.g. Phase 1 complete"
          />
        </div>
        <div>
          <label
            htmlFor="add-milestone-dueDate"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Due date
          </label>
          <input
            type="date"
            id="add-milestone-dueDate"
            name="dueDate"
            required
            className={inputClass}
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Add milestone
        </Button>
      </div>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Milestone added.
        </p>
      )}
    </form>
  );
}
