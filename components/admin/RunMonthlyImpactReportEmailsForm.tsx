"use client";

import { useActionState } from "react";
import { runMonthlyImpactReportEmailsAction } from "@/lib/admin-actions";
import type { RunMonthlyImpactReportEmailsState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";

const initialState: RunMonthlyImpactReportEmailsState = {
  success: false,
  error: "",
};

export function RunMonthlyImpactReportEmailsForm() {
  const [state, formAction] = useActionState(
    runMonthlyImpactReportEmailsAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-wrap items-start gap-3">
        <Button type="submit" variant="secondary" size="sm" className="gap-2">
          <Mail className="h-4 w-4" aria-hidden />
          Send monthly impact reports
        </Button>
        <p className="max-w-xl text-xs text-zinc-500 leading-relaxed">
          Emails all clients (with an email address) the same summary as the
          portal &quot;Monthly impact report&quot;: value line, highlights, and a
          dashboard link. Clients with no reportable activity in the last 30
          days are skipped.
        </p>
      </div>
      {state?.success === false && state.error && (
        <p className="text-sm text-red-300">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-emerald-400">
          Sent {state.sent}. Skipped (no activity): {state.skippedNoActivity}.
          Skipped (no email): {state.skippedNoEmail}. Failed: {state.failed}.
        </p>
      )}
    </form>
  );
}
