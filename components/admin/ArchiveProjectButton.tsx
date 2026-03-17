"use client";

import { useActionState } from "react";
import { archiveProjectAction, unarchiveProjectAction } from "@/lib/admin-actions";
import type { ArchiveProjectState } from "@/lib/admin-action-types";
import { Archive, ArchiveRestore } from "lucide-react";

export function ArchiveProjectButton({
  projectId,
  isArchived,
}: {
  projectId: string;
  isArchived: boolean;
}) {
  const [state, formAction] = useActionState<ArchiveProjectState | null, FormData>(
    isArchived ? unarchiveProjectAction : archiveProjectAction,
    null
  );

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="projectId" value={projectId} />
      <button
        type="submit"
        className={
          isArchived
            ? "inline-flex items-center gap-1.5 rounded-lg border border-amber-500/50 bg-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-200 transition-colors hover:bg-amber-500/30"
            : "inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
        }
      >
        {isArchived ? (
          <>
            <ArchiveRestore className="h-4 w-4" />
            Unarchive
          </>
        ) : (
          <>
            <Archive className="h-4 w-4" />
            Archive
          </>
        )}
      </button>
      {state && !state.success && (
        <p className="mt-2 text-sm text-red-400">{state.error}</p>
      )}
    </form>
  );
}
