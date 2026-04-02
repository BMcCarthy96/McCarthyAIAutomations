"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  FileText,
  ListChecks,
  HelpCircle,
  CreditCard,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/assistant", label: "Assistant", icon: Sparkles },
  { href: "/dashboard/services", label: "My Services", icon: Layers },
  { href: "/dashboard/milestones", label: "Roadmap", icon: ListChecks },
  { href: "/dashboard/updates", label: "Project Updates", icon: FileText },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <nav className="flex flex-col gap-0.5 p-4 lg:pt-5">
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              isActive
                ? "border border-indigo-400/20 bg-indigo-500/12 text-white"
                : "border border-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
          >
            {isActive && (
              <span
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-indigo-500"
                aria-hidden
              />
            )}
            <Icon
              className={cn(
                "h-5 w-5 shrink-0",
                isActive ? "text-indigo-400" : "text-current"
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-20 z-40 rounded-lg p-2.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-white/10 bg-[var(--background)]/95 shadow-xl backdrop-blur-xl transition-transform duration-200 ease-out lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 lg:hidden">
          <span className="text-sm font-medium text-zinc-400">Navigation</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{content}</div>
      </aside>
    </>
  );
}
