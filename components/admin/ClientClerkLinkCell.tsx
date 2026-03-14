"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateClientClerkLinkAction } from "@/lib/admin-actions";
import type { UpdateClientClerkLinkState } from "@/lib/admin-action-types";

const initialState: UpdateClientClerkLinkState = { success: false, error: "" };

function truncateId(id: string, max = 20) {
  if (id.length <= max) return id;
  return id.slice(0, max - 3) + "...";
}

export function ClientClerkLinkCell({
  clientId,
  currentClerkUserId,
}: {
  clientId: string;
  currentClerkUserId: string | null | undefined;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState(updateClientClerkLinkAction, initialState);

  useEffect(() => {
    if (state?.success === true) {
      setEditing(false);
      router.refresh();
    }
  }, [state?.success, router]);

  if (editing) {
    return (
      <td className="px-4 py-3 text-zinc-400">
        <form action={formAction} className="flex flex-col gap-2">
          <input type="hidden" name="clientId" value={clientId} />
          <input
            type="text"
            name="clerkUserId"
            required
            defaultValue={currentClerkUserId ?? ""}
            placeholder="user_xxxx"
            className="w-full min-w-[140px] rounded border border-white/20 bg-white/10 px-2 py-1 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {state?.success === false && state.error && (
            <span className="text-xs text-red-300">{state.error}</span>
          )}
          <span className="flex items-center gap-2">
            <button
              type="submit"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-zinc-500 hover:text-zinc-400"
            >
              Cancel
            </button>
          </span>
        </form>
      </td>
    );
  }

  return (
    <td className="px-4 py-3 text-zinc-400">
      <span className="flex flex-wrap items-center gap-2">
        {currentClerkUserId ? (
          <span title={currentClerkUserId}>{truncateId(currentClerkUserId)}</span>
        ) : (
          <span>—</span>
        )}
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-sm text-zinc-500 hover:text-white"
        >
          {currentClerkUserId ? "Edit" : "Set"}
        </button>
      </span>
    </td>
  );
}
