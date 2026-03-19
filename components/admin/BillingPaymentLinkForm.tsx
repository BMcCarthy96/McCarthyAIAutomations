"use client";

import { useActionState, useMemo, useState } from "react";
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
}: {
  recordId: string;
  currentPaymentLinkUrl: string | null;
}) {
  const [state, formAction] = useActionState<
    CreateStripePaymentLinkState | null,
    FormData
  >(createStripePaymentLinkAction, initialState);

  const urlToShow = useMemo(() => {
    if (state?.success) return state.url;
    return currentPaymentLinkUrl;
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
        <form action={formAction}>
          <input type="hidden" name="recordId" value={recordId} />
          <Button type="submit" variant="secondary" size="sm">
            Generate Payment Link
          </Button>
          {state && !state.success && state.error && (
            <p className="mt-2 text-xs text-red-300">{state.error}</p>
          )}
        </form>
      ) : (
        <div className="flex flex-col gap-2">
          <a
            href={urlToShow}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-indigo-100"
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon className="h-4 w-4" />
            Payment Link
            <ExternalLink className="h-4 w-4" />
          </a>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={urlToShow}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-200"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={copyUrl}
              disabled={copied}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          {copied && <p className="text-xs text-emerald-300">Copied</p>}
        </div>
      )}
    </div>
  );
}

