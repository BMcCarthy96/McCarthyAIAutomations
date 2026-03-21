"use client";

import { useActionState } from "react";
import { deleteClientAction } from "@/lib/admin-actions";
import type { ClientDeletionImpact } from "@/lib/admin-data";
import type { Client } from "@/lib/types";
import { Button } from "@/components/ui/Button";

/**
 * Danger zone: permanent DB removal (see `delete_client_cascade` migration).
 * Stripe customer objects are not deleted in Stripe.
 */
export function ClientDeleteSection({
  client,
  impact,
}: {
  client: Client;
  impact: ClientDeletionImpact;
}) {
  const [state, formAction] = useActionState(deleteClientAction, null);

  const summary = [
    `${impact.clientServices} client service engagement(s)`,
    `${impact.projects} project(s)`,
    `${impact.billingRecords} billing record(s)`,
    `${impact.supportRequests} support request(s)`,
    `${impact.supportReplies} support reply/replies`,
  ].join(", ");

  return (
    <div className="space-y-4 rounded-xl border border-rose-500/30 bg-rose-950/20 p-6">
      <div>
        <h2 className="text-lg font-semibold text-rose-200">Delete client permanently</h2>
        <p className="mt-1 text-sm text-rose-100/80">
          This cannot be undone. Related data will be removed in one transaction:{" "}
          <span className="font-medium text-rose-50">{summary}.</span>
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Stripe customers and subscriptions in Stripe are not automatically deleted—manage those in the
          Stripe dashboard if needed.
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="clientId" value={client.id} />
        <div>
          <label
            htmlFor="confirmEmail"
            className="mb-1.5 block text-sm font-medium text-rose-200/90"
          >
            Type the client email to confirm
          </label>
          <input
            type="email"
            id="confirmEmail"
            name="confirmEmail"
            autoComplete="off"
            placeholder={client.email}
            className="w-full rounded-xl border border-rose-500/40 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
        {state && state.success === false && state.error && (
          <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">
            {state.error}
          </p>
        )}
        <Button type="submit" variant="danger" size="md">
          Delete client forever
        </Button>
      </form>
    </div>
  );
}
