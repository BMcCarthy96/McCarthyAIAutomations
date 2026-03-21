"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateBillingRecordAction } from "@/lib/admin-actions";
import type { UpdateBillingRecordState } from "@/lib/admin-action-types";
import { billingStatusLabels } from "@/lib/data";
import type { BillingStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";

const STATUSES: BillingStatus[] = ["pending", "paid", "overdue"];

const initialState: UpdateBillingRecordState = { success: false, error: "" };

const fieldClass =
  "w-full min-w-[7rem] rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const selectClass =
  "w-full min-w-[7rem] rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [&_option]:bg-zinc-800 [&_option]:text-white";

export function BillingRecordEditForm({
  recordId,
  amountCents,
  description,
  currentStatus,
}: {
  recordId: string;
  amountCents: number;
  description: string;
  currentStatus: string;
}) {
  const [state, formAction] = useActionState(updateBillingRecordAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success === true) {
      router.refresh();
    }
  }, [state, router]);

  const amountDefault = (amountCents / 100).toFixed(2);

  return (
    <form action={formAction} className="flex min-w-[200px] flex-col gap-2">
      <input type="hidden" name="recordId" value={recordId} />
      <div>
        <label htmlFor={`amt-${recordId}`} className="sr-only">
          Amount (USD)
        </label>
        <input
          id={`amt-${recordId}`}
          name="amountDollars"
          type="text"
          inputMode="decimal"
          required
          defaultValue={amountDefault}
          className={fieldClass}
          aria-label="Amount in USD"
        />
      </div>
      <div>
        <label htmlFor={`desc-${recordId}`} className="sr-only">
          Description
        </label>
        <input
          id={`desc-${recordId}`}
          name="description"
          type="text"
          required
          defaultValue={description}
          className={fieldClass}
          aria-label="Description"
        />
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <select
          id={`status-${recordId}`}
          name="status"
          required
          defaultValue={currentStatus}
          className={selectClass}
          aria-label="Status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {billingStatusLabels[s]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary" size="sm">
          Save
        </Button>
      </div>
      {state?.success === false && state.error && (
        <span className="text-xs text-red-300">{state.error}</span>
      )}
      {state?.success === true && state.stripeLinkCleared && (
        <div className="space-y-1.5">
          <span className="text-xs text-emerald-400">Saved</span>
          <p className="rounded-lg border border-amber-400/25 bg-amber-500/10 px-2.5 py-2 text-[11px] leading-relaxed text-amber-100">
            <span className="font-semibold text-amber-50">Checkout link removed</span> — amount or
            description no longer matches Stripe. Use{" "}
            <span className="font-semibold">Generate Payment Link</span> in Actions when the invoice
            is final.
          </p>
        </div>
      )}
      {state?.success === true && !state.stripeLinkCleared && (
        <span className="text-xs text-emerald-400">Saved</span>
      )}
    </form>
  );
}
