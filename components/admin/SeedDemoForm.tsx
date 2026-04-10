"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";

type SeedResult = {
  ok: boolean;
  demoClientId?: string;
  linkedClerkUserId?: string;
  log?: string[];
  error?: string;
};

export function SeedDemoForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<SeedResult | null>(null);

  async function handleSeed() {
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/admin/seed-demo", { method: "POST" });
      const data = (await res.json()) as SeedResult;
      setResult(data);
      setStatus(data.ok ? "done" : "error");
    } catch (e) {
      setResult({ ok: false, error: e instanceof Error ? e.message : "Network error" });
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4 text-sm text-zinc-400">
        <p>
          This will <span className="text-zinc-200 font-medium">upsert</span> all demo client data
          (services, projects, milestones, updates, billing, support) and link{" "}
          <code className="rounded bg-white/[0.06] px-1 py-0.5 text-xs text-indigo-300">
            DEMO_CLERK_USER_ID
          </code>{" "}
          to the demo client record. Safe to run multiple times — only fixed demo UUIDs are touched.
        </p>
      </div>

      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={() => void handleSeed()}
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding…
          </>
        ) : status === "done" ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Re-seed demo data
          </>
        ) : (
          "Seed demo data"
        )}
      </Button>

      {result && (
        <div
          className={`rounded-xl border px-5 py-4 text-sm ${
            result.ok
              ? "border-emerald-500/25 bg-emerald-500/[0.06]"
              : "border-red-500/25 bg-red-500/[0.06]"
          }`}
        >
          <div className="flex items-start gap-2">
            {result.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            )}
            <div className="min-w-0 space-y-1">
              {result.ok ? (
                <>
                  <p className="font-medium text-emerald-300">Demo data seeded successfully.</p>
                  {result.linkedClerkUserId && (
                    <p className="text-zinc-400">
                      Clerk user{" "}
                      <code className="rounded bg-white/[0.06] px-1 py-0.5 text-xs text-zinc-300">
                        {result.linkedClerkUserId}
                      </code>{" "}
                      is now linked to the demo client.
                    </p>
                  )}
                </>
              ) : (
                <p className="font-medium text-red-300">{result.error}</p>
              )}
              {result.log && result.log.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-xs text-zinc-500">
                  {result.log.map((line, i) => (
                    <li key={i} className="font-mono">
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
