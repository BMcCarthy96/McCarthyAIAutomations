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

