"use client";

import { useActionState } from "react";
import { deleteBillingRecordAction } from "@/lib/admin-actions";
import { Button } from "@/components/ui/Button";

export function BillingRecordDeleteForm({
  recordId,
  description,
}: {
  recordId: string;
  description: string;
}) {
  const [state, formAction] = useActionState(deleteBillingRecordAction, null);

  return (
    <form
      action={formAction}
      className="space-y-2"
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Delete this billing record?\n\n“${description}”\n\nThis cannot be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="recordId" value={recordId} />
      {state && state.success === false && state.error && (
        <p className="text-xs text-red-300">{state.error}</p>
      )}
      <Button type="submit" variant="danger" size="sm" className="w-full sm:w-auto">
        Delete record
      </Button>
    </form>
  );
}
