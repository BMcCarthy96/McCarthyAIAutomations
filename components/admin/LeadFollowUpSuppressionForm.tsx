"use client";

import { useActionState } from "react";
import { setLeadFollowUpSuppressedAction } from "@/lib/admin-actions";
import type { SetLeadFollowUpSuppressedState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";
import { BellOff, BellRing } from "lucide-react";

const initialState: SetLeadFollowUpSuppressedState = {
  success: false,
  error: "",
};

export function LeadFollowUpSuppressionForm({
  requestId,
  suppressed,
  showDisable,
  showReEnable,
}: {
  requestId: string;
  suppressed: boolean;
  showDisable: boolean;
  showReEnable: boolean;
}) {
  const [state, formAction] = useActionState(
    setLeadFollowUpSuppressedAction,
    initialState
  );

  return (
    <div className="space-y-2">
      {state?.success === false && state.error && (
        <p className="text-sm text-red-300">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-emerald-400">Saved.</p>
      )}
      <div className="flex flex-wrap gap-2">
        {showDisable && (
          <form action={formAction}>
            <input type="hidden" name="requestId" value={requestId} />
            <input type="hidden" name="suppressed" value="true" />
            <Button type="submit" variant="secondary" size="sm" className="gap-2">
              <BellOff className="h-4 w-4 shrink-0" aria-hidden />
              Disable follow-up
            </Button>
          </form>
        )}
        {showReEnable && (
          <form action={formAction}>
            <input type="hidden" name="requestId" value={requestId} />
            <input type="hidden" name="suppressed" value="false" />
            <Button type="submit" variant="secondary" size="sm" className="gap-2">
              <BellRing className="h-4 w-4 shrink-0" aria-hidden />
              Re-enable follow-up
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
