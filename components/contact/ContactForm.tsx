"use client";

import { useActionState } from "react";
import {
  createPublicSupportRequestAction,
  type CreatePublicSupportRequestState,
} from "@/lib/portal-actions";
import { Button } from "@/components/ui/Button";

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
      <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white">
          Thanks for reaching out
        </h3>
        <p className="mt-2 text-zinc-400">
          We&apos;ll get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-12 space-y-6">
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
