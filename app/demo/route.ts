import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Public entry for “Try Live Demo”: creates a short-lived Clerk sign-in token for the
 * configured demo Clerk user (server-only env) and redirects to Clerk’s ticket URL.
 * No passwords are exposed in the browser.
 *
 * Redirect paths (see GET handler):
 * 1) Success: redirect to Clerk’s `token.url` as returned (no query mutation).
 * 2) Fallback: `/sign-in?redirect_url=/dashboard` — demo disabled, missing env, token error,
 *    or API returned no `url`.
 *
 * Set NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard in env and Clerk Dashboard paths so
 * post-ticket navigation lands in the portal without appending redirect_url to the ticket URL.
 */
export const dynamic = "force-dynamic";

/** Where sign-in fallback sends users (align with Clerk after-sign-in URL). */
const POST_DEMO_PATH = "/dashboard";

function redirectToSignIn(requestUrl: string) {
  const url = new URL("/sign-in", requestUrl);
  url.searchParams.set("redirect_url", POST_DEMO_PATH);
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  if (process.env.DEMO_AUTH_ENABLED === "false") {
    if (process.env.NODE_ENV === "development") {
      console.info("[demo] DEMO_AUTH_ENABLED=false → /sign-in?redirect_url=/dashboard");
    }
    return redirectToSignIn(request.url);
  }

  const demoUserId = process.env.DEMO_CLERK_USER_ID?.trim();
  const adminId = process.env.ADMIN_CLERK_USER_ID?.trim();

  if (!demoUserId) {
    if (process.env.NODE_ENV === "development") {
      console.info("[demo] missing DEMO_CLERK_USER_ID → /sign-in?redirect_url=/dashboard");
    }
    return redirectToSignIn(request.url);
  }

  if (adminId && demoUserId === adminId) {
    console.error(
      "[demo] Refusing sign-in token: DEMO_CLERK_USER_ID must not match ADMIN_CLERK_USER_ID"
    );
    return redirectToSignIn(request.url);
  }

  try {
    const client = await clerkClient();
    const token = await client.signInTokens.createSignInToken({
      userId: demoUserId,
      expiresInSeconds: 60 * 5,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("[demo] sign-in token created", {
        userId: demoUserId,
        tokenId: token.id,
        hasUrl: Boolean(token.url),
      });
    }

    if (token?.url) {
      if (process.env.NODE_ENV === "development") {
        console.log("[demo] redirect → Clerk ticket URL (unmodified)");
      }
      return NextResponse.redirect(token.url);
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("[demo] token.url empty → /sign-in?redirect_url=/dashboard");
    }
  } catch (e) {
    console.error("[demo] createSignInToken failed:", e);
  }

  return redirectToSignIn(request.url);
}
