"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useAuth, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoSafeUserMenu, shouldMaskDemoIdentity } from "@/components/auth/DemoSafeUserMenu";
import { cn } from "@/lib/utils";
import { useShowTryLiveDemoCta } from "@/hooks/useShowTryLiveDemoCta";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Consultation" },
];

export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { sessionId } = useAuth();
  const showTryLiveDemo = useShowTryLiveDemoCta();
  const isHome = pathname === "/";

  function refreshIfAlreadyOnHome(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
          onClick={refreshIfAlreadyOnHome}
        >
          McCarthy AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              )}
              onClick={link.href === "/" ? refreshIfAlreadyOnHome : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div
          key={sessionId ?? "signed-out"}
          className="hidden items-center gap-3 md:flex"
        >
          {isHome && showTryLiveDemo && !isAdmin ? (
            <Link
              href="/demo"
              prefetch={false}
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Portal demo
            </Link>
          ) : null}
          {isSignedIn ? (
            <>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Admin
                </Link>
              ) : null}
              <Button variant="ghost" size="sm" href="/dashboard">
                Dashboard
              </Button>
              <DemoSafeUserMenu
                forceDemoMask={shouldMaskDemoIdentity(user?.id, isAdmin)}
                isAdmin={isAdmin}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="primary" size="sm">
                  Get started
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div
          key={sessionId ?? "signed-out"}
          className="border-t border-white/10 bg-[var(--background)]/95 px-4 py-4 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === link.href
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {showTryLiveDemo && !isAdmin ? (
              <Link
                href="/demo"
                prefetch={false}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Portal demo
              </Link>
            ) : null}
            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
              {isSignedIn ? (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-zinc-300 hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <Link
                    href="/dashboard"
                    className="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      Sign in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button variant="primary" size="md" className="w-full">
                      Get started
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
