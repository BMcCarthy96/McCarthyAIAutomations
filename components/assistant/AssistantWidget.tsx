"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getWidgetSuggestedPrompts,
  type WidgetAssistantMode,
} from "@/lib/assistant/widget-suggested-prompts";
import type { AssistantSourceDisplay } from "@/lib/assistant/types";
import { assistantSourceKindTitle } from "@/lib/assistant/types";
import { Button } from "@/components/ui/Button";
import {
  MessageCircle,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "mccarthy-assistant-widget-session-v1";

type ChatMessage =
  | { role: "user"; content: string }
  | {
      role: "assistant";
      content: string;
      sources: AssistantSourceDisplay[];
      insufficientContext: boolean;
    };

type StoredSession = {
  mode: WidgetAssistantMode;
  messages: ChatMessage[];
};

type ApiOk = {
  success: true;
  mode: WidgetAssistantMode;
  question: string;
  answer: string;
  insufficientContext: boolean;
  sources: AssistantSourceDisplay[];
  openAiConfigured: true;
};

type ApiErr = {
  success: false;
  error: string;
  openAiConfigured: boolean;
};

function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredSession;
    if (!p || !Array.isArray(p.messages)) return null;
    return p;
  } catch {
    return null;
  }
}

function saveSession(s: StoredSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota */
  }
}

function modeSubtitle(mode: WidgetAssistantMode): string {
  switch (mode) {
    case "public":
      return "McCarthy services & FAQs — ask anything";
    case "demo":
      return "Demo account — sample portal data only";
    case "client":
      return "Your projects & portal data";
    default:
      return "";
  }
}

export default function AssistantWidget() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<WidgetAssistantMode>("public");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAiOff, setOpenAiOff] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const s = loadSession();
    if (s) {
      setMode(s.mode);
      setMessages(s.messages);
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    saveSession({ mode, messages });
  }, [mode, messages]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [open, messages, loading]);

  const suggested = useMemo(
    () => getWidgetSuggestedPrompts(mode, pathname),
    [mode, pathname]
  );

  const bookingHref = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "";

  const sendQuestion = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || loading) return;
      setError(null);
      setMessages((m) => [...m, { role: "user", content: q }]);
      setInput("");
      setLoading(true);
      try {
        const res = await fetch("/api/assistant/widget", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: q, pathname }),
        });
        const data = (await res.json()) as ApiOk | ApiErr;
        if (!data.success) {
          setOpenAiOff(!data.openAiConfigured);
          setError(data.error);
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              content:
                data.openAiConfigured === false
                  ? "The AI assistant isn’t enabled on the server yet. You can still reach us via Contact or book a call below."
                  : "Something went wrong. Please try again or use Contact below.",
              sources: [],
              insufficientContext: false,
            },
          ]);
          return;
        }
        setMode(data.mode);
        setOpenAiOff(false);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            insufficientContext: data.insufficientContext,
          },
        ]);
      } catch {
        setError("Network error. Check your connection and try again.");
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Couldn’t reach the assistant. Try again shortly.",
            sources: [],
            insufficientContext: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, pathname]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const openPanel = () => {
    setOpen(true);
    // TODO(analytics): widget_opened
  };

  return (
    <>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        className={cn(
          "fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-600/90 to-violet-700/90 text-white shadow-[0_8px_32px_-8px_rgba(99,102,241,0.65)] ring-1 ring-white/10 transition hover:scale-[1.03] hover:shadow-[0_12px_40px_-10px_rgba(99,102,241,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:bottom-8 md:right-8",
          open && "ring-2 ring-indigo-300/80"
        )}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden />
        )}
      </button>

      {open ? (
        <div
          className="fixed inset-x-3 bottom-24 z-[99] flex max-h-[min(560px,70vh)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75)] ring-1 ring-white/[0.06] backdrop-blur-xl md:inset-x-auto md:right-8 md:bottom-28 md:w-[400px]"
          role="dialog"
          aria-label="McCarthy assistant"
        >
          <div className="flex items-start justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 to-transparent px-4 py-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/25">
                <Sparkles className="h-4 w-4 text-indigo-200" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Assistant</p>
                <p className="truncate text-xs text-zinc-400">
                  {modeSubtitle(mode)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300"
              title="New chat"
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.length === 0 && !loading ? (
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-xs leading-relaxed text-zinc-400">
                {openAiOff ? (
                  <span className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                    AI answers are off in this environment. Use{" "}
                    <Link href="/contact" className="text-indigo-300 underline">
                      Contact
                    </Link>{" "}
                    or book a call.
                  </span>
                ) : (
                  <>
                    Ask about our AI services, demos, or your portal (when
                    signed in). Suggestions below — or type your own.
                  </>
                )}
              </div>
            ) : null}

            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[90%] rounded-2xl rounded-br-md bg-indigo-500/25 px-3 py-2 text-sm text-indigo-50">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="space-y-2">
                  <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm leading-relaxed text-zinc-200">
                    {msg.insufficientContext ? (
                      <p className="mb-2 flex gap-2 text-amber-200/90">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>Limited context for that question.</span>
                      </p>
                    ) : null}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {msg.sources.length > 0 ? (
                    <div className="pl-1 text-[11px] text-zinc-500">
                      <p className="font-medium text-zinc-400">Sources</p>
                      <ul className="mt-1 space-y-0.5">
                        {msg.sources.map((s) => (
                          <li key={`${s.ref}-${s.label}`}>
                            <span className="text-zinc-600">{s.ref}</span>{" "}
                            <span className="text-zinc-400">
                              {assistantSourceKindTitle(s.kind)}
                            </span>
                            : {s.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-xs text-indigo-200/80">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Thinking…
              </div>
            ) : null}

            {error && !loading ? (
              <p className="text-xs text-red-300/90">{error}</p>
            ) : null}
          </div>

          {suggested.length > 0 && messages.length <= 2 ? (
            <div className="border-t border-white/[0.06] px-3 py-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                Suggested
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggested.map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendQuestion(p)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-left text-[11px] text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="border-t border-white/10 px-3 py-2">
            <div className="flex flex-wrap gap-2">
              {bookingHref ? (
                <Link
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    /* TODO(analytics): assistant_cta_clicked book_call */
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-medium text-emerald-100 transition hover:bg-emerald-500/15"
                >
                  Book a call
                  <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
                </Link>
              ) : null}
              <Link
                href="/contact"
                onClick={() => {
                  /* TODO(analytics): assistant_cta_clicked contact */
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1.5 text-[11px] font-medium text-indigo-100 transition hover:bg-indigo-500/15"
              >
                Contact us
              </Link>
            </div>
          </div>

          <form
            className="border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void sendQuestion(input);
              // TODO(analytics): assistant_message_sent
            }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                placeholder="Ask a question…"
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-60"
                aria-label="Your question"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading || !input.trim()}
              >
                Send
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
