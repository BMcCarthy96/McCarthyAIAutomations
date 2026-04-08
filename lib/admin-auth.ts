import { auth } from "@clerk/nextjs/server";

/**
 * Admin auth: Clerk-based check for /admin access.
 * Single source for "is this user the admin?" Used by admin layout and all admin server actions.
 */

/**
 * Returns true only if the current user's Clerk **user id** matches `ADMIN_CLERK_USER_ID`.
 * Never uses email (including Gmail +alias): admin vs demo must be separate Clerk users.
 */
export async function isAdminUser(): Promise<boolean> {
  const { userId } = await auth();
  const adminId = process.env.ADMIN_CLERK_USER_ID?.trim();
  const uid = userId?.trim();
  if (!uid || !adminId) return false;
  return uid === adminId;
}
