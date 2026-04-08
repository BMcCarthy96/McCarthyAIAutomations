import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Development only: inspect the signed-in Clerk user (ids, emails, admin/demo flags).
 * GET /api/dev/clerk-identity
 */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      signedIn: false,
      clerkUserId: null,
    });
  }

  const user = await currentUser();
  const adminId = process.env.ADMIN_CLERK_USER_ID?.trim() ?? "";
  const demoId = process.env.DEMO_CLERK_USER_ID?.trim() ?? "";

  const emailAddresses =
    user?.emailAddresses?.map((e) => ({
      id: e.id,
      emailAddress: e.emailAddress,
    })) ?? [];

  return NextResponse.json({
    signedIn: true,
    clerkUserId: userId,
    primaryEmailAddress: user?.primaryEmailAddress?.emailAddress ?? null,
    emailAddresses,
    emailCount: emailAddresses.length,
    isAdmin: Boolean(adminId && userId === adminId),
    isDemoClerkUserConfigured: Boolean(demoId && userId === demoId),
    envHasAdminId: Boolean(adminId),
    envHasDemoId: Boolean(demoId),
    note:
      "If bmac96.dev@gmail.com and bmac96.dev+demo@gmail.com appear under one userId, create a separate Clerk user for demo in the Dashboard.",
  });
}
