"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After sign-out, Next.js RSC + client can briefly disagree. When the session
 * ends (userId transitions from a value to null), refresh the route so the
 * marketing homepage and nav re-render with the server tree in sync.
 */
export function MarketingAuthRefresh() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;
    const prev = prevUserId.current;
    if (prev !== undefined && prev !== null && userId === null) {
      router.refresh();
    }
    prevUserId.current = userId ?? null;
  }, [userId, isLoaded, router]);

  return null;
}
