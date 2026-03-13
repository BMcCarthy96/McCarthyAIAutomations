"use client";

import { useActionState } from "react";
import {
  createSupportRequestAction,
  type CreateSupportRequestState,
} from "@/lib/portal-actions";
import { Button } from "@/components/ui/Button";

const initialState: CreateSupportRequestState = { success: false, error: "" };

export function CreateSupportRequestForm({
  projects,
}: {
  projects: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState(
    createSupportRequestAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          maxLength={500}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Brief summary of your request"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Message
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={5}
          maxLength={10000}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Describe your question or request in detail."
        />
      </div>

      <div>
        <label
          htmlFor="projectId"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Project (optional)
        </label>
        <select
          id="projectId"
          name="projectId"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
        >
          <option value="">None</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}

      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Request submitted. We’ll get back to you soon.
        </p>
      )}

      <Button type="submit" variant="primary" size="md">
        Submit request
      </Button>
    </form>
  );
}
