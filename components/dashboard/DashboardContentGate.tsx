"use client";

import { usePathname } from "next/navigation";
import { NoClientAccount } from "@/components/dashboard/NoClientAccount";

/**
 * When the user is signed in but not linked to a clients row, most dashboard routes
 * show NoClientAccount. The Knowledge assistant route is an exception so users can
 * read setup instructions and contact options without a silent blank/blocked page.
 */
export function DashboardContentGate({
  hasLinkedClient,
  children,
}: {
  hasLinkedClient: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isAssistantRoute =
    pathname === "/dashboard/assistant" ||
    pathname.startsWith("/dashboard/assistant/");

  if (!hasLinkedClient && !isAssistantRoute) {
    return <NoClientAccount />;
  }

  return <>{children}</>;
}
