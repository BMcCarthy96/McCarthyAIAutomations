"use client";

import { useActionState } from "react";
import { updateSupportRequestStatusAction } from "@/lib/admin-actions";
import type { UpdateSupportRequestStatusState } from "@/lib/admin-action-types";
import { supportRequestStatusLabels } from "@/lib/data";
import type { SupportRequestStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STATUSES: SupportRequestStatus[] = [
  "open",
  "in_progress",
  "resolved",
  "closed",
];

const initialState: UpdateSupportRequestStatusState = {
  success: false,
  error: "",
};

export function SupportRequestStatusForm({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(
    updateSupportRequestStatusAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="requestId" value={requestId} />
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
          defaultValue={currentStatus}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {supportRequestStatusLabels[s] ?? s}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Update status
      </Button>
      {state?.success === false && state.error && (
        <span className="text-sm text-red-300">{state.error}</span>
      )}
      {state?.success === true && (
        <span className="text-sm text-emerald-400">Saved</span>
      )}
    </form>
  );
}
