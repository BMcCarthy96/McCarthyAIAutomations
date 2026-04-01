"use client";

import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { DEMO_DISPLAY_PROFILE, isConfiguredDemoUser } from "@/lib/demo-display";

export function DemoSafeUserMenu({
  forceDemoMask = false,
}: {
  forceDemoMask?: boolean;
}) {
  const { user } = useUser();
  const shouldMask = forceDemoMask || isConfiguredDemoUser(user?.id);

  if (!shouldMask) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
          },
        }}
      />
    );
  }

  const initials = DEMO_DISPLAY_PROFILE.contactName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-200">
        {initials}
      </span>
      <div className="hidden min-w-0 md:block">
        <p className="truncate text-xs font-semibold text-white">
          {DEMO_DISPLAY_PROFILE.contactName}
        </p>
        <p className="truncate text-[11px] text-zinc-400">
          {DEMO_DISPLAY_PROFILE.businessName}
        </p>
      </div>
      <SignOutButton>
        <button
          type="button"
          className="rounded-md px-2 py-1 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </SignOutButton>
    </div>
  );
}

export function shouldMaskDemoIdentity(userId: string | null | undefined): boolean {
  return isConfiguredDemoUser(userId);
}
