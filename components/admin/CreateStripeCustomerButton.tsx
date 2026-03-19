"use client";

import { useActionState, useEffect } from "react";
import { createStripeCustomerBackfillAction } from "@/lib/admin-actions";
import type { CreateStripeCustomerBackfillState } from "@/lib/admin-action-types";

const initialState: CreateStripeCustomerBackfillState = {
  success: false,
  error: "",
};

export function CreateStripeCustomerButton({ clientId }: { clientId: string }) {
  const [state, formAction] = useActionState(
    createStripeCustomerBackfillAction,
    initialState
  );

  // Keep it simple: we don't need extra UI work besides feedback;
  // server action revalidates the clients list pages.
  useEffect(() => {
    if (state?.success === true) {
      // no-op; revalidatePath triggers refresh on navigation
    }
  }, [state?.success]);

  return (
    <form action={formAction} className="inline-flex items-center gap-2">
      <input type="hidden" name="clientId" value={clientId} />
      <button
        type="submit"
        className="text-sm text-indigo-400 hover:text-indigo-300"
      >
        Create Stripe Customer
      </button>
      {state?.success === true && (
        <span className="text-xs text-emerald-300">Created</span>
      )}
      {state?.success === false && state.error && (
        <span className="text-xs text-red-300">{state.error}</span>
      )}
    </form>
  );
}

