"use client";

import { useUser } from "@clerk/nextjs";

export function WelcomeHeader() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "";
  return (
    <header className="border-b border-white/10 pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
      </h1>
      <p className="mt-1.5 text-zinc-400">
        Here’s what’s happening with your projects.
      </p>
    </header>
  );
}
