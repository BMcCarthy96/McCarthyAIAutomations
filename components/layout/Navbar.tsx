"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SignInButton, useAuth, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoSafeUserMenu, shouldMaskDemoIdentity } from "@/components/auth/DemoSafeUserMenu";
import { cn } from "@/lib/utils";
import { useShowTryLiveDemoCta } from "@/hooks/useShowTryLiveDemoCta";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Free Audit" },
];

export function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isSignedIn, user } = useUser();
  const { sessionId } = useAuth();
  const showTryLiveDemo = useShowTryLiveDemoCta();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function refreshIfAlreadyOnHome(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") {
      e.preventDefault();
      router.refresh();
    }
  }

  return (
    <div className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="w-full max-w-5xl">
        {/* ── Floating pill ─────────────────────────────────────────────── */}
        <header
          className={cn(
            "relative transition-all duration-500 ease-out",
            scrolled
              ? "rounded-2xl border border-white/[0.11] bg-[#050c1a]/88 shadow-2xl shadow-black/50 backdrop-blur-2xl"
              : "rounded-2xl border border-transparent bg-transparent"
          )}
        >
          <div className="flex h-14 items-center justify-between px-5">
            {/* Logo */}
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80"
              onClick={refreshIfAlreadyOnHome}
            >
              McCarthy<span className="text-blue-400"> AI</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link text-sm font-medium",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop auth */}
            <div key={sessionId ?? "signed-out"} className="hidden items-center gap-3 md:flex">
              {isSignedIn ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="nav-link text-sm font-medium text-zinc-400 hover:text-white"
                    >
                      Admin
                    </Link>
                  )}
                  {showTryLiveDemo && !isAdmin && (
                    <Link
                      href="/demo"
                      prefetch={false}
                      className="nav-link text-sm font-medium text-zinc-400 hover:text-white"
                    >
                      Demo
                    </Link>
                  )}
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
                  {isHome && showTryLiveDemo && (
                    <Link
                      href="/demo"
                      prefetch={false}
                      className="nav-link text-sm font-medium text-zinc-400 hover:text-white"
                    >
                      Portal demo
                    </Link>
                  )}
                  <SignInButton mode="modal">
                    <Button variant="ghost" size="sm">Sign in</Button>
                  </SignInButton>
                  <Button
                    href="/contact"
                    variant="primary"
                    size="sm"
                    className="btn-magnetic"
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu — slides inside the pill */}
          {open && (
            <div
              key={sessionId ?? "signed-out"}
              className="border-t border-white/[0.08] px-4 pb-4 pt-3 md:hidden"
            >
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  className={cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={(e) => { setOpen(false); refreshIfAlreadyOnHome(e); }}
                >
                  Home
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "bg-white/10 text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {showTryLiveDemo && !isAdmin && (
                  <Link
                    href="/demo"
                    prefetch={false}
                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    Portal demo
                  </Link>
                )}
                <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.08] pt-3">
                  {isSignedIn ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="w-full rounded-xl px-3 py-2 text-center text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
                          onClick={() => setOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <Link
                        href="/dashboard"
                        className="w-full rounded-xl px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-white/5"
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
                          className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                          onClick={() => setOpen(false)}
                        >
                          Sign in
                        </button>
                      </SignInButton>
                      <Button href="/contact" variant="primary" size="md" className="w-full">
                        Get started
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}
