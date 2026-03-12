import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for McCarthy AI Automations.",
};

export default function TermsPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Terms of Service
        </h1>
        <p className="mt-6 text-zinc-300">
          These are placeholder terms for McCarthy AI Automations.
        </p>
      </div>
    </div>
  );
}
