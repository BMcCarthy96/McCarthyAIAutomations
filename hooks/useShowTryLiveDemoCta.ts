"use client";

import { useUser } from "@clerk/nextjs";

/**
 * Whether to show “Try Live Demo” CTAs on the marketing site.
 * Hide only when the signed-in user is the configured demo Clerk user
 * (`NEXT_PUBLIC_DEMO_CLERK_USER_ID`, same value as `DEMO_CLERK_USER_ID` on the server).
 * Uses `useUser()` so UI updates as soon as Clerk session changes (including after sign-out).
 */
export function useShowTryLiveDemoCta(): boolean {
  const { user, isLoaded } = useUser();
  const demoId = process.env.NEXT_PUBLIC_DEMO_CLERK_USER_ID?.trim();

  if (!isLoaded) {
    return true;
  }
  if (!user) {
    return true;
  }
  if (!demoId) {
    return true;
  }
  return user.id !== demoId;
}
