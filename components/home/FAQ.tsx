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
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          title="Frequently asked questions"
          subtitle="Quick answers to common questions. Still deciding? Start with a free consultation—no pitch deck required."
        />
        <p className="mt-4 text-center text-sm">
          <Link
            href="/contact"
            className="font-semibold text-indigo-400 underline-offset-2 hover:text-indigo-300 hover:underline"
          >
            Book your free consultation →
          </Link>
        </p>
        <div className="mt-10 space-y-2">
          {faqs.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between px-6 py-4 text-left"
                onClick={() =>
                  setOpenId(openId === item.id ? null : item.id)
                }
              >
                <span className="font-medium text-white">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-zinc-400 transition-transform",
                    openId === item.id && "rotate-180"
                  )}
                />
              </button>
              {openId === item.id && (
                <div className="border-t border-white/10 px-6 py-4">
                  <p className="text-sm text-zinc-400">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
