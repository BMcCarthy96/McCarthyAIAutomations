"use client";

import { useActionState } from "react";
import { updateProjectMetricsAction } from "@/lib/admin-actions";
import type { UpdateProjectMetricsState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: UpdateProjectMetricsState = { success: false, error: "" };

const inputClass =
  "w-full max-w-[8rem] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export function ProjectMetricsForm({
  projectId,
  initialCallsHandled,
  initialLeadsCaptured,
  initialAppointmentsBooked,
  initialHoursSaved,
  initialEstimatedRevenue,
}: {
  projectId: string;
  initialCallsHandled: number | null;
  initialLeadsCaptured: number | null;
  initialAppointmentsBooked: number | null;
  initialHoursSaved: number | null;
  initialEstimatedRevenue: number | null;
}) {
  const [state, formAction] = useActionState(
    updateProjectMetricsAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label
            htmlFor="callsHandled"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Calls handled
          </label>
          <input
            type="number"
            id="callsHandled"
            name="callsHandled"
            min={0}
            step={1}
            defaultValue={initialCallsHandled ?? ""}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="leadsCaptured"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Leads captured
          </label>
          <input
            type="number"
            id="leadsCaptured"
            name="leadsCaptured"
            min={0}
            step={1}
            defaultValue={initialLeadsCaptured ?? ""}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="appointmentsBooked"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Appointments booked
          </label>
          <input
            type="number"
            id="appointmentsBooked"
            name="appointmentsBooked"
            min={0}
            step={1}
            defaultValue={initialAppointmentsBooked ?? ""}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="hoursSaved"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Hours saved
          </label>
          <input
            type="number"
            id="hoursSaved"
            name="hoursSaved"
            min={0}
            step={1}
            defaultValue={initialHoursSaved ?? ""}
            className={inputClass}
            placeholder="0"
          />
        </div>
        <div>
          <label
            htmlFor="estimatedRevenue"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Estimated revenue
          </label>
          <input
            type="number"
            id="estimatedRevenue"
            name="estimatedRevenue"
            min={0}
            step={1}
            defaultValue={initialEstimatedRevenue ?? ""}
            className={inputClass}
            placeholder="0"
          />
        </div>
      </div>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Metrics updated.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Save metrics
      </Button>
    </form>
  );
}
