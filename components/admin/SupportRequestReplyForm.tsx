"use client";

import { useActionState } from "react";
import { sendSupportReplyAction } from "@/lib/admin-actions";
import type { SendSupportReplyState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: SendSupportReplyState = { success: false, error: "" };

export function SupportRequestReplyForm({
  requestId,
  replyToHint,
}: {
  requestId: string;
  /** Shown above the textarea (e.g. recipient email). */
  replyToHint: string | null;
}) {
  const [state, formAction] = useActionState(
    sendSupportReplyAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="requestId" value={requestId} />
      {replyToHint && (
        <p className="text-xs text-zinc-500">
          Email will be sent to:{" "}
          <span className="font-medium text-zinc-400">{replyToHint}</span>
        </p>
      )}
      <div>
        <label
          htmlFor="support-reply-body"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Your reply
        </label>
        <textarea
          id="support-reply-body"
          name="body"
          required
          rows={6}
          maxLength={10000}
          placeholder="Write a professional response. This will be emailed to the requester and saved to the thread."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {state?.success === false && state.error && (
        <p className="text-sm text-red-300">{state.error}</p>
      )}
      {state?.success === true && (
        <p className="text-sm text-emerald-400">
          Reply saved to the thread. The requester is emailed when Resend is
          configured.
        </p>
      )}
      <Button type="submit" variant="primary" size="sm">
        Send reply
      </Button>
    </form>
  );
}
