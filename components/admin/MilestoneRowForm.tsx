"use client";

import { useActionState } from "react";
import {
  updateMilestoneAction,
  type UpdateMilestoneState,
} from "@/lib/admin-actions";
import type { AdminMilestoneRow } from "@/lib/admin-data";
import { Button } from "@/components/ui/Button";
import { formatDisplayDate } from "@/lib/utils";

export function MilestoneRowForm({ milestone }: { milestone: AdminMilestoneRow }) {
  const [state, formAction] = useActionState(
    updateMilestoneAction,
    null as UpdateMilestoneState | null
  );

  const isComplete = Boolean(milestone.completedAt);

  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-4 py-3 font-medium text-white">{milestone.title}</td>
      <td className="px-4 py-3 text-zinc-400">
        {formatDisplayDate(milestone.dueDate)}
      </td>
      <td className="px-4 py-3 text-zinc-400">
        {isComplete ? "Completed" : "Open"}
      </td>
      <td className="px-4 py-3">
        <form action={formAction} className="flex flex-wrap items-center gap-2">
          <input type="hidden" name="milestoneId" value={milestone.id} />
          <input
            type="date"
            name="dueDate"
            defaultValue={milestone.dueDate}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" variant="secondary" size="sm">
            Update date
          </Button>
          {!isComplete && (
            <Button
              type="submit"
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
        </form>
      </td>
      <td className="px-4 py-3">
        {state?.success === false && state.error && (
          <span className="text-xs text-red-300">{state.error}</span>
        )}
        {state?.success === true && (
          <span className="text-xs text-emerald-400">Saved</span>
        )}
      </td>
    </tr>
  );
}
