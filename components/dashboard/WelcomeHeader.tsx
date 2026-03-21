"use client";

import { LayoutDashboard } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export function WelcomeHeader() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "";
  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent p-6 shadow-xl shadow-indigo-950/20 ring-1 ring-white/5 backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
            <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" aria-hidden />
            Client portal
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {firstName ? (
              <>
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </>
            ) : (
              "Welcome back"
            )}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Your automation performance, projects, and next steps—same clarity we promise on day one.
          </p>
        </div>
      </div>
    </header>
  );
}
