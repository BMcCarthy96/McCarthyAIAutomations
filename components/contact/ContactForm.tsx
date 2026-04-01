"use client";

import { useActionState } from "react";
import {
  createPublicSupportRequestAction,
  type CreatePublicSupportRequestState,
} from "@/lib/portal-actions";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Mail, Sparkles } from "lucide-react";

const initialState: CreatePublicSupportRequestState = {
  success: false,
  error: "",
};

export function ContactForm() {
  const [state, formAction] = useActionState(
    createPublicSupportRequestAction,
    initialState
  );

  if (state?.success === true) {
    return (
      <div className="mt-12 overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.08] via-white/[0.04] to-white/[0.02] p-8 shadow-[0_0_40px_-20px_rgba(52,211,153,0.35)] backdrop-blur-xl sm:p-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <CheckCircle2
              className="h-7 w-7 text-emerald-300"
              aria-hidden
              strokeWidth={1.75}
            />
          </div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            Your consultation request is in
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-[15px]">
            We&apos;ve received your message and sent a confirmation to your inbox.
            A member of our team will review your goals and reply personally—
            <span className="font-medium text-zinc-200">
              {" "}
              typically within one business day
            </span>
            , often sooner during business hours.
          </p>
          <div className="mt-8 space-y-3 rounded-xl border border-white/[0.07] bg-black/20 px-5 py-4 text-left text-sm text-zinc-400">
            <p className="flex gap-3">
              <Mail
                className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400/90"
                aria-hidden
              />
              <span>
                Check your email for a copy of your submission. You can reply
                directly to that thread to add context—no need to re-send the
                form.
              </span>
            </p>
            <p className="flex gap-3">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90"
                aria-hidden
              />
              <span>
                Want to move faster? When we&apos;re ready, we may share a link to
                book a short discovery call—optional, and only on your
                timeline.
              </span>
            </p>
          </div>
          <p className="mt-6 text-xs text-zinc-500">
            — McCarthy AI Automations
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-12 space-y-6">
      <input
        type="text"
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden
      />
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-zinc-300"
        >
          Subject (optional)
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={500}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="e.g. Free consultation — AI phone agent"
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-300"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={200}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-zinc-300"
        >
          Company (optional)
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Your company"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-zinc-300"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          maxLength={10000}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="What are you looking to achieve? Any services or timeline in mind?"
        />
      </div>
      {state?.success === false && state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full sm:w-auto"
      >
        Send message
      </Button>
    </form>
  );
}
