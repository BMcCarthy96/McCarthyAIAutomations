"use client";

import type { ReactNode } from "react";
import { useShowTryLiveDemoCta } from "@/hooks/useShowTryLiveDemoCta";

/** Hides children when the current user is the demo Clerk account (marketing pages only). */
export function TryLiveDemoMarketingGate({ children }: { children: ReactNode }) {
  const show = useShowTryLiveDemoCta();
  if (!show) return null;
  return children;
}
