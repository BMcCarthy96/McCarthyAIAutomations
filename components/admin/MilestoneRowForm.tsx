"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateMilestoneAction, deleteMilestoneAction } from "@/lib/admin-actions";
import type { UpdateMilestoneState, DeleteMilestoneState } from "@/lib/admin-action-types";
import type { AdminMilestoneRow } from "@/lib/admin-data";
import { Button } from "@/components/ui/Button";

const inputClass =
  "w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export function MilestoneRowForm({
  milestone,
  projectId,
}: {
  milestone: AdminMilestoneRow;
  projectId: string;
}) {
  const router = useRouter();
  const [updateState, updateFormAction] = useActionState(
    updateMilestoneAction,
    null as UpdateMilestoneState | null
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteMilestoneAction,
    null as DeleteMilestoneState | null
  );

  useEffect(() => {
    if (updateState?.success === true || deleteState?.success === true) {
      router.refresh();
    }
  }, [updateState, deleteState, router]);

  const isComplete = Boolean(milestone.completedAt);
  const formId = `update-milestone-${milestone.id}`;

  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-4 py-3">
        <form action={updateFormAction} id={formId}>
          <input type="hidden" name="milestoneId" value={milestone.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <input
            type="text"
            name="title"
            defaultValue={milestone.title}
            required
            className={inputClass}
            aria-label="Milestone title"
          />
        </form>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            form={formId}
            type="date"
            name="dueDate"
            defaultValue={milestone.dueDate}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" form={formId} variant="secondary" size="sm">
            Update date
          </Button>
          {!isComplete && (
            <Button
              type="submit"
              form={formId}
              name="markComplete"
              value="true"
              variant="ghost"
              size="sm"
              className="!border-0 !p-0"
            >
              <span className="text-sm text-indigo-400 hover:text-indigo-300">
                Mark complete
              </span>
            </Button>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-zinc-400">
        {isComplete ? "Completed" : "Open"}
      </td>
      <td className="px-4 py-3">
        <form action={deleteFormAction} className="inline">
          <input type="hidden" name="milestoneId" value={milestone.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <Button type="submit" variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
            Delete
          </Button>
        </form>
      </td>
      <td className="px-4 py-3">
        {updateState?.success === false && updateState.error && (
          <span className="text-xs text-red-300">{updateState.error}</span>
        )}
        {deleteState?.success === false && deleteState.error && (
          <span className="text-xs text-red-300">{deleteState.error}</span>
        )}
        {updateState?.success === true && (
          <span className="text-xs text-emerald-400">Saved</span>
        )}
        {deleteState?.success === true && (
          <span className="text-xs text-emerald-400">Deleted</span>
        )}
      </td>
    </tr>
  );
}