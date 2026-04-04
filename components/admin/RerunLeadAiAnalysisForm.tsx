"use client";

import { useActionState } from "react";
import { rerunLeadAiAnalysisAction } from "@/lib/admin-actions";
import type { RerunLeadAiAnalysisState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

const initialState: RerunLeadAiAnalysisState = {
  success: false,
  error: "",
};

export function RerunLeadAiAnalysisForm({ requestId }: { requestId: string }) {
  const [state, formAction] = useActionState(
    rerunLeadAiAnalysisAction,
    initialState
  );

  return (
    <div className="space-y-2">
      {state?.success === false && state.error && (
        <p className="text-sm text-red-300">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-emerald-400">Analysis updated.</p>
      )}
      <form action={formAction}>
        <input type="hidden" name="requestId" value={requestId} />
        <Button type="submit" variant="secondary" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4 shrink-0" aria-hidden />
          Re-run AI analysis
        </Button>
      </form>
    </div>
  );
}
