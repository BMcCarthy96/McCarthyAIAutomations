import { auth } from "@clerk/nextjs/server";

/**
 * Returns true only if the current user's Clerk id matches ADMIN_CLERK_USER_ID.
 * Use in server components/layouts to restrict /admin to a single user.
 */
export async function isAdminUser(): Promise<boolean> {
  const { userId } = await auth();
  const adminId = process.env.ADMIN_CLERK_USER_ID;
  if (!userId || !adminId) return false;
  return userId === adminId;
}
