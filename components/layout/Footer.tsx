import Link from "next/link";
import { services } from "@/lib/data";

const footerLinks = {
  services: services.slice(0, 4).map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
  company: [
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Request Audit" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden rounded-t-[2.5rem] border-t border-white/[0.07] bg-[#03070f]">
      {/* Subtle ambient glow at the top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80">
              McCarthy<span className="text-blue-400"> AI</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
              AI workflow consulting for lead handling, follow-up, and operational handoffs — audit-first, with human review where it counts.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 transition-all hover:-translate-y-px hover:text-blue-300"
            >
              Request an AI Revenue Leak Audit
              <span aria-hidden>→</span>
            </Link>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Company
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600">
              Legal
            </h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} McCarthy AI Automations. All rights reserved.
          </p>

          {/* System status indicator */}
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] px-3 py-1.5">
            <span
              className="status-dot h-1.5 w-1.5 rounded-full bg-emerald-400"
              aria-hidden
            />
            <span className="font-mono text-[10px] font-medium tracking-widest text-emerald-400/80 uppercase">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
