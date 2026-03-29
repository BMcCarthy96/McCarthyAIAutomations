import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Public entry for “Try Live Demo”: creates a short-lived Clerk sign-in token for the
 * configured demo Clerk user (server-only env) and redirects to Clerk’s ticket URL.
 * No passwords are exposed in the browser.
 */
export const dynamic = "force-dynamic";

function redirectToSignIn(requestUrl: string) {
  const url = new URL("/sign-in", requestUrl);
  url.searchParams.set("redirect_url", "/dashboard");
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const demoUserId = process.env.DEMO_CLERK_USER_ID?.trim();

  if (!demoUserId) {
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
      return NextResponse.redirect(token.url);
    }
  } catch (e) {
    console.error("[demo] createSignInToken failed:", e);
  }

  return redirectToSignIn(request.url);
}
