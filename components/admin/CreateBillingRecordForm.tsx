"use client";

import { useActionState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createBillingRecordAction } from "@/lib/admin-actions";
import type { CreateBillingRecordState } from "@/lib/admin-action-types";
import { billingStatusLabels } from "@/lib/data";
import type { BillingStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STATUSES: BillingStatus[] = ["pending", "paid", "overdue"];

const initialState: CreateBillingRecordState = { success: false, error: "" };

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const selectClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white";

export function CreateBillingRecordForm({
  clients,
}: {
  clients: { id: string; name: string; isArchived: boolean }[];
}) {
  const [state, formAction] = useActionState(createBillingRecordAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success === true) {
      router.refresh();
    }
  }, [state?.success, router]);

  const sorted = useMemo(() => {
    return [...clients].sort((a, b) => {
      if (a.isArchived !== b.isArchived) return a.isArchived ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
  }, [clients]);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="billing-client" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Client
          </label>
          <select id="billing-client" name="clientId" required className={selectClass}>
            <option value="">Select client…</option>
            {sorted.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isArchived ? " (archived)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="billing-amount" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Amount (USD)
          </label>
          <input
            id="billing-amount"
            name="amountDollars"
            type="text"
            inputMode="decimal"
            required
            className={inputClass}
            placeholder="e.g. 1500 or 99.50"
          />
        </div>
        <div>
          <label htmlFor="billing-status-new" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Status
          </label>
          <select
            id="billing-status-new"
            name="status"
            required
            defaultValue="pending"
            className={selectClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {billingStatusLabels[s]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="billing-description" className="mb-1.5 block text-sm font-medium text-zinc-300">
          Description
        </label>
        <input
          id="billing-description"
          name="description"
          type="text"
          required
          className={inputClass}
          placeholder="e.g. Setup fee — CRM integration"
        />
      </div>
      <p className="text-xs text-zinc-500">
        Due date defaults to 30 days from today. After saving, use{" "}
        <strong className="font-medium text-zinc-400">Generate Payment Link</strong> in the table (client must have a Stripe customer).
      </p>
      {state?.success === false && state.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      {state?.success === true && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
          Billing record created.
        </p>
      )}
      <Button type="submit" variant="primary" size="md">
        Create record
      </Button>
    </form>
  );
}
