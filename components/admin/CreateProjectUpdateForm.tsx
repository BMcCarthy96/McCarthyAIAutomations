"use client";

import { useActionState } from "react";
import type { AdminProjectRow } from "@/lib/admin-data";
import {
  createProjectUpdateAction,
  type CreateProjectUpdateState,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/Button";

const initialState: CreateProjectUpdateState = { success: false, error: "" };

export function CreateProjectUpdateForm({
  projects,
}: {
  projects: AdminProjectRow[];
}) {
  const [state, formAction] = useActionState(
    createProjectUpdateAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label
          htmlFor="projectId"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white [&_option:hover]:bg-white/10"
        >
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {p.clientName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          maxLength={500}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Phase 1 complete"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Body
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Describe the update for the client."
        />
      </div>

      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Update created successfully.
        </p>
      )}

      <Button type="submit" variant="primary" size="md">
        Create update
      </Button>
    </form>
  );
}
