"use client";

import { useActionState } from "react";
import { updateProjectMetricsAction } from "@/lib/admin-actions";
import type { UpdateProjectMetricsState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: UpdateProjectMetricsState = { success: false, error: "" };

const inputFocus =
  "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const inputClass = `w-full max-w-[8rem] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ${inputFocus}`;

const revenueInputClass = `min-w-0 flex-1 rounded-r-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white ${inputFocus}`;

function MetricNumberField({
  id,
  label,
  defaultValue,
  dollarPrefix,
}: {
  id: string;
  label: string;
  defaultValue: number | null;
  dollarPrefix?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>
      {dollarPrefix ? (
        <div className="flex max-w-[8rem] items-stretch">
          <span
            className="inline-flex shrink-0 items-center rounded-l-xl border border-r-0 border-white/10 bg-white/5 px-3 py-2.5 text-sm tabular-nums text-zinc-400"
            aria-hidden="true"
          >
            $
          </span>
          <input
            type="number"
            id={id}
            name={id}
            min={0}
            step={1}
            defaultValue={defaultValue ?? ""}
            className={revenueInputClass}
            placeholder="0"
          />
        </div>
      ) : (
        <input
          type="number"
          id={id}
          name={id}
          min={0}
          step={1}
          defaultValue={defaultValue ?? ""}
          className={inputClass}
          placeholder="0"
        />
      )}
    </div>
  );
}

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
        <MetricNumberField
          id="callsHandled"
          label="Calls handled"
          defaultValue={initialCallsHandled}
        />
        <MetricNumberField
          id="leadsCaptured"
          label="Leads captured"
          defaultValue={initialLeadsCaptured}
        />
        <MetricNumberField
          id="appointmentsBooked"
          label="Appointments booked"
          defaultValue={initialAppointmentsBooked}
        />
        <MetricNumberField
          id="hoursSaved"
          label="Hours saved"
          defaultValue={initialHoursSaved}
        />
        <MetricNumberField
          id="estimatedRevenue"
          label="Estimated revenue"
          defaultValue={initialEstimatedRevenue}
          dollarPrefix
        />
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
