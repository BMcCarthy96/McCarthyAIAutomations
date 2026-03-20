"use client";

import { useActionState } from "react";
import { updateClientAction } from "@/lib/admin-actions";
import type { UpdateClientState } from "@/lib/admin-action-types";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const initialState: UpdateClientState = { success: false, error: "" };

export function EditClientForm({ client }: { client: Client }) {
  const [state, formAction] = useActionState(updateClientAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="clientId" value={client.id} />
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={client.name}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          defaultValue={client.email}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Company (optional)
        </label>
        <input
          type="text"
          id="company"
          name="company"
          defaultValue={client.company ?? ""}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="clerkUserId" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Clerk user ID (optional)
        </label>
        <input
          type="text"
          id="clerkUserId"
          name="clerkUserId"
          defaultValue={client.clerkUserId ?? ""}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Link to portal sign-in"
        />
      </div>
      <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <input
          type="checkbox"
          name="monthlyReportEnabled"
          defaultChecked={client.monthlyReportEnabled !== false}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-zinc-900 text-indigo-500 focus:ring-indigo-500"
        />
        <span>
          <span className="block text-sm font-medium text-zinc-200">
            Monthly impact emails enabled
          </span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            Include this client in manual and scheduled monthly impact report sends.
          </span>
        </span>
      </label>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Client updated.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Save
      </Button>
    </form>
  );
}
