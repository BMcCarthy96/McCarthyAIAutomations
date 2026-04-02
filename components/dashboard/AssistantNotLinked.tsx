import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { UserX } from "lucide-react";

/** Shown on /dashboard/assistant when Clerk user has no clients.clerk_user_id link yet. */
export function AssistantNotLinked() {
  return (
    <GlassCard hover={false} variant="premium" className="max-w-xl border-white/10 px-7 py-8 sm:px-9">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 ring-1 ring-indigo-400/25">
        <UserX className="h-7 w-7 text-indigo-300" aria-hidden />
      </div>
      <h2 className="mt-6 text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
        Link your account first
      </h2>
      <p className="mt-3 text-center text-sm leading-relaxed text-zinc-400">
        The Knowledge assistant answers from your client record—projects, milestones,
        updates, and support. Your sign-in is not linked to a client profile yet.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button href="/contact" variant="primary" size="md">
          Contact us
        </Button>
        <Button href="/dashboard" variant="secondary" size="md">
          Back to overview
        </Button>
      </div>
      <p className="mt-6 text-center text-xs text-zinc-500">
        Already working with us? Ask your account manager to connect your Clerk user
        in Admin → Clients → Link portal.
      </p>
    </GlassCard>
  );
}
