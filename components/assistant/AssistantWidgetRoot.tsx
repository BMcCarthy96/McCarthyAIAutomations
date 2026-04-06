"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const AssistantWidget = dynamic(() => import("./AssistantWidget"), {
  ssr: false,
  loading: () => null,
});

/**
 * Site-wide floating assistant. Gated by NEXT_PUBLIC_ENABLE_ASSISTANT_WIDGET=true.
 * Hidden on auth and admin routes.
 */
export function AssistantWidgetRoot() {
  const enabled =
    process.env.NEXT_PUBLIC_ENABLE_ASSISTANT_WIDGET === "true";
  const pathname = usePathname() || "";

  if (!enabled) return null;
  if (
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }
  if (pathname.startsWith("/admin")) return null;
  // Full-page Knowledge Assistant — avoid duplicate chat UIs
  if (pathname.startsWith("/dashboard/assistant")) return null;

  return <AssistantWidget />;
}
