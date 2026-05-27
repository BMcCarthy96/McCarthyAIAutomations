"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/lib/data";
import { SectionHeading } from "./SectionHeading";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Frequently asked questions"
          subtitle="Quick answers about how the audit, pilot and advisory engagement work. Still have questions? Start with a brief fit conversation."
        />
        <p className="mt-4 text-center text-sm">
          <Link
            href="/contact"
            className="font-semibold text-blue-400 underline-offset-2 hover:text-blue-300 hover:underline"
          >
            Request an AI Revenue Leak Audit →
          </Link>
        </p>
        <div className="mt-8 space-y-2">
          {faqs.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-2xl"
                onClick={() =>
                  setOpenId(openId === item.id ? null : item.id)
                }
                aria-expanded={openId === item.id}
              >
                <span className="font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-slate-400 transition-transform",
                    openId === item.id && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              {openId === item.id && (
                <div className="border-t border-white/10 px-6 py-4">
                  <p className="text-sm text-slate-400">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
