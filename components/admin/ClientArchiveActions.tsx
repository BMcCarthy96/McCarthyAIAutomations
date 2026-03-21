"use client";

import {
  archiveClientFormAction,
  unarchiveClientFormAction,
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/Button";

/** Primary safe cleanup: hide client from portal + monthly report batch. */
export function ClientArchiveActions({
  clientId,
  isArchived,
}: {
  clientId: string;
  isArchived: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isArchived ? (
        <form action={unarchiveClientFormAction}>
          <input type="hidden" name="clientId" value={clientId} />
          <Button type="submit" variant="secondary" size="sm">
            Unarchive
          </Button>
        </form>
      ) : (
        <form action={archiveClientFormAction}>
          <input type="hidden" name="clientId" value={clientId} />
          <Button type="submit" variant="secondary" size="sm">
            Archive
          </Button>
        </form>
      )}
    </div>
  );
}
