"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createStripePaymentLinkAction } from "@/lib/admin-actions";
import type { CreateStripePaymentLinkState } from "@/lib/admin-action-types";
import { Button } from "@/components/ui/Button";
import { Copy, ExternalLink, Link as LinkIcon } from "lucide-react";

const initialState: CreateStripePaymentLinkState = {
  success: false,
  error: "",
};

export function BillingPaymentLinkForm({
  recordId,
  currentPaymentLinkUrl,
  billingStatus = "pending",
}: {
  recordId: string;
  currentPaymentLinkUrl: string | null;
  /** Used to tune copy when no link (e.g. pending invoices need payment). */
  billingStatus?: string;
}) {
  const [state, formAction] = useActionState<
    CreateStripePaymentLinkState | null,
    FormData
  >(createStripePaymentLinkAction, initialState);

  const router = useRouter();
  const prevSuccessRef = useRef(false);

  useEffect(() => {
    const ok = state?.success === true;
    if (ok && !prevSuccessRef.current) {
      router.refresh();
    }
    prevSuccessRef.current = ok;
  }, [state, router]);

  /**
   * Server URL wins when present. When the DB clears the link after an edit,
   * `currentPaymentLinkUrl` becomes null — do not keep showing a stale `state.url`
   * from a previous "Generate Payment Link" (parent `key` also remounts on row updates).
   */
  const urlToShow = useMemo(() => {
    const fromServer = currentPaymentLinkUrl?.trim() || null;
    if (fromServer) {
      return fromServer;
    }
    if (state?.success && state.url) {
      return state.url;
    }
    return null;
  }, [currentPaymentLinkUrl, state]);

  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    if (!urlToShow) return;
    try {
      await navigator.clipboard.writeText(urlToShow);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {!urlToShow ? (
        <form action={formAction} className="flex flex-col gap-1.5">
          <input type="hidden" name="recordId" value={recordId} />
          <Button type="submit" variant="secondary" size="sm">
            Generate Payment Link
          </Button>
          {billingStatus === "pending" ? (
            <p className="max-w-[15rem] text-[11px] leading-relaxed text-amber-200/90">
              No active link. Generate when amount and description are final —{" "}
              <span className="font-medium text-amber-100/95">regenerate</span> after editing those
              fields (saved changes clear the old link).
            </p>
          ) : (
            <p className="max-w-[14rem] text-[11px] text-zinc-500">
              No payment link on file for this record.
            </p>
          )}
          {state && !state.success && state.error && (
            <p className="text-xs text-red-300">{state.error}</p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
            <LinkIcon className="h-3.5 w-3.5 text-emerald-300" />
            Link ready
          </div>
          <div className="flex items-center gap-2">
            <a
              href={urlToShow}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-indigo-200 transition-colors hover:bg-white/10 hover:text-indigo-100"
              target="_blank"
              rel="noreferrer"
            >
              Open
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs"
              onClick={copyUrl}
              disabled={copied}
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
          {copied && <p className="text-xs text-emerald-300">Copied</p>}
          {state?.success === false && state.error && (
            <p className="text-xs text-red-300">{state.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

