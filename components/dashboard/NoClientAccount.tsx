import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { UserX } from "lucide-react";

export function NoClientAccount() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center py-12">
      <GlassCard hover={false} variant="premium" className="max-w-md border-white/10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-400/25">
          <UserX className="h-7 w-7 text-indigo-300" />
        </div>
        <h2 className="mt-6 text-xl font-bold tracking-tight text-white sm:text-2xl">
          No client account found
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Your account isn’t linked to a client record yet. If you expect to see projects and billing
          here, please contact your account manager or use the contact form so we can set up your
          access.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/contact" variant="primary" size="md">
            Contact us
          </Button>
          <Button href="/" variant="secondary" size="md">
            Back to site
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
