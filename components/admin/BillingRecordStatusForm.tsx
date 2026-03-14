"use client";

import { useActionState } from "react";
import { updateBillingStatusAction } from "@/lib/admin-actions";
import type { UpdateBillingStatusState } from "@/lib/admin-action-types";
import { billingStatusLabels } from "@/lib/data";
import type { BillingStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STATUSES: BillingStatus[] = ["pending", "paid", "overdue"];

const initialState: UpdateBillingStatusState = {
  success: false,
  error: "",
};

export function BillingRecordStatusForm({
  recordId,
  currentStatus,
}: {
  recordId: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(
    updateBillingStatusAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="recordId" value={recordId} />
      <select
        id={`status-${recordId}`}
        name="status"
        required
        defaultValue={currentStatus}
        className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {billingStatusLabels[s]}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary" size="sm">
        Update
      </Button>
      {state?.success === false && state.error && (
        <span className="text-xs text-red-300">{state.error}</span>
      )}
      {state?.success === true && (
        <span className="text-xs text-emerald-400">Saved</span>
      )}
    </form>
  );
}
