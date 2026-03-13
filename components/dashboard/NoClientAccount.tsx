import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { UserX } from "lucide-react";

export function NoClientAccount() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <GlassCard hover={false} className="max-w-md text-center">
        <UserX className="mx-auto h-12 w-12 text-zinc-500" />
        <h2 className="mt-4 text-xl font-semibold text-white">
          No client account found
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Your account isn’t linked to a client record yet. If you expect to see
          projects and billing here, please contact your account manager or use
          the contact form so we can set up your access.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button href="/contact" variant="secondary" size="md">
            Contact us
          </Button>
          <Button href="/" variant="ghost" size="md">
            Back to site
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
