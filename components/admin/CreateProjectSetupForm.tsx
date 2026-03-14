"use client";

import { useActionState } from "react";
import { createProjectSetupAction } from "@/lib/admin-actions";
import type { CreateProjectSetupState } from "@/lib/admin-action-types";
import type { Client } from "@/lib/types";
import type { Service } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "in_progress", label: "In progress" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
] as const;

const initialState: CreateProjectSetupState = { success: false, error: "" };

export function CreateProjectSetupForm({
  clients,
  services,
}: {
  clients: Client[];
  services: Service[];
}) {
  const [state, formAction] = useActionState(createProjectSetupAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="clientId" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Client
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
        >
          <option value="">Select a client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.email ? `(${c.email})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="serviceId" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Service
        </label>
        <select
          id="serviceId"
          name="serviceId"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="engagementName" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Engagement name
        </label>
        <input
          type="text"
          id="engagementName"
          name="engagementName"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Website AI Chatbot"
        />
      </div>
      <div>
        <label htmlFor="projectName" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Project name
        </label>
        <input
          type="text"
          id="projectName"
          name="projectName"
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Acme Corp Website"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue="active"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="progress" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Progress (%)
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            min={0}
            max={100}
            defaultValue={0}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Project created.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Create project
      </Button>
    </form>
  );
}
