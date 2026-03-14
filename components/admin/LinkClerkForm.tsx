"use client";

import { useActionState } from "react";
import { updateClientClerkLinkAction } from "@/lib/admin-actions";
import type { UpdateClientClerkLinkState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: UpdateClientClerkLinkState = { success: false, error: "" };

export function LinkClerkForm({
  clientId,
  currentClerkUserId,
}: {
  clientId: string;
  currentClerkUserId: string | null | undefined;
}) {
  const [state, formAction] = useActionState(updateClientClerkLinkAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clientId" value={clientId} />
      <div>
        <label htmlFor="clerkUserId" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Clerk user ID
        </label>
        <input
          type="text"
          id="clerkUserId"
          name="clerkUserId"
          required
          defaultValue={currentClerkUserId ?? ""}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="user_xxxx (from Clerk dashboard)"
        />
      </div>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Link updated.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Update link
      </Button>
    </form>
  );
}
