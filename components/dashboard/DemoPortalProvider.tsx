"use client";

import { createContext, useContext } from "react";

const DemoPortalContext = createContext(false);

export function DemoPortalProvider({
  isDemo,
  children,
}: {
  isDemo: boolean;
  children: React.ReactNode;
}) {
  return (
    <DemoPortalContext.Provider value={isDemo}>{children}</DemoPortalContext.Provider>
  );
}

export function useDemoPortal(): boolean {
  return useContext(DemoPortalContext);
}
