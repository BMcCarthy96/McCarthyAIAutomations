"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { isConfiguredDemoUser } from "@/lib/demo-display";

/**
 * Development-only: logs Clerk session + sign-in URL context (redirect_url param).
 * Does not run in production builds.
 */
export function ClerkAuthDevLog({ context }: { context: string }) {
  const { user, isLoaded } = useUser();
  const prevId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;
    if (!isLoaded) return;

    const params = new URLSearchParams(window.location.search);
    const redirectUrlParam = params.get("redirect_url");

    const emails =
      user?.emailAddresses?.map((e) => ({
        email: e.emailAddress,
        id: e.id,
      })) ?? [];

    const payload = {
      context,
      clerkUserId: user?.id ?? null,
      emailCount: emails.length,
      emails,
      primaryEmail: user?.primaryEmailAddress?.emailAddress ?? null,
      hasRedirectUrlParam: Boolean(redirectUrlParam),
      redirectUrlParam: redirectUrlParam ?? null,
      isConfiguredDemoClerkUser: user?.id
        ? isConfiguredDemoUser(user.id)
        : false,
      note:
        "Admin is server-only (ADMIN_CLERK_USER_ID). If emailCount > 1, check Clerk Dashboard for duplicate identities.",
    };

    if (user?.id !== prevId.current) {
      prevId.current = user?.id;
      console.info("[clerk-auth-debug]", payload);
    }
  }, [context, isLoaded, user]);

  return null;
}
