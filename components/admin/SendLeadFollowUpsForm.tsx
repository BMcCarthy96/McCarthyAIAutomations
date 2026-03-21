"use client";

import { useActionState } from "react";
import { sendPendingLeadFollowUpsAction } from "@/lib/admin-actions";
import type { SendPendingLeadFollowUpsState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";
import { CalendarClock } from "lucide-react";

const initialState: SendPendingLeadFollowUpsState = {
  success: false,
  error: "",
};

export function SendLeadFollowUpsForm({
  pendingCount,
  hasBookingUrl,
}: {
  pendingCount: number;
  hasBookingUrl: boolean;
}) {
  const [state, formAction] = useActionState(
    sendPendingLeadFollowUpsAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex flex-wrap items-start gap-3">
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="gap-2"
          disabled={!hasBookingUrl || pendingCount === 0}
        >
          <CalendarClock className="h-4 w-4" aria-hidden />
          Send pending follow-ups
        </Button>
        <div className="max-w-xl space-y-1 text-xs text-zinc-500 leading-relaxed">
          <p>
            Sends the booking reminder to public consultation requests that are
            still open, have an email, and haven&apos;t received a follow-up
            yet. Configure{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-zinc-300">
              NEXT_PUBLIC_BOOKING_URL
            </code>{" "}
            or{" "}
            <code className="rounded bg-white/10 px-1 py-0.5 text-zinc-300">
              BOOKING_URL
            </code>
            .
          </p>
          <p className="text-zinc-400">
            Pending now:{" "}
            <span className="font-medium text-zinc-300">{pendingCount}</span>
            {!hasBookingUrl && (
              <span className="text-amber-400">
                {" "}
                — add a booking URL to enable sending.
              </span>
            )}
          </p>
        </div>
      </div>
      {state?.success === false && state.error && (
        <p className="text-sm text-red-300">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-emerald-400">
          Sent {state.sent}. Failed (claim/send): {state.failed}.
        </p>
      )}
    </form>
  );
}
