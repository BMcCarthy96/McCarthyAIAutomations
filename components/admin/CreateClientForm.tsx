"use client";

import { useActionState } from "react";
import { createClientAction } from "@/lib/admin-actions";
import type { CreateClientState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";

const initialState: CreateClientState = { success: false, error: "" };

export function CreateClientForm() {
  const [state, formAction] = useActionState(createClientAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Client name"
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
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="client@example.com"
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
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Company name"
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
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Link to portal sign-in"
        />
      </div>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Client created.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Create client
      </Button>
    </form>
  );
}
