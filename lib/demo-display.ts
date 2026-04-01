export const DEMO_DISPLAY_PROFILE = {
  businessName: "Acme Home Services",
  contactName: "Jordan Hayes",
  displayEmail: "demo@acmehome.com",
  phone: "(555) 214-9087",
} as const;

export function getConfiguredDemoUserId(): string | null {
  const fromServer = process.env.DEMO_CLERK_USER_ID?.trim();
  if (fromServer) return fromServer;

  const fromClient = process.env.NEXT_PUBLIC_DEMO_CLERK_USER_ID?.trim();
  if (fromClient) return fromClient;

  return null;
}

export function isConfiguredDemoUser(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const demoUserId = getConfiguredDemoUserId();
  if (!demoUserId) return false;
  return userId === demoUserId;
}
