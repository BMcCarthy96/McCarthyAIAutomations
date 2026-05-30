import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "n8n AI Lead Intake and CRM-Style Tracking Workflow",
  description:
    "A reusable n8n workflow template demonstrating AI-assisted lead intake, CRM-style Google Sheets record management, and a human-approval checkpoint using fictional sample data.",
};

const TOOLS = [
  "n8n (workflow automation platform)",
  "OpenAI gpt-4o-mini (AI classification and draft generation)",
  "Google Sheets API via OAuth2 (CRM-style record storage)",
  "Webhook nodes (stateless intake + always-on approval handler)",
  "Information Extractor node (structured AI output)",
  "Basic LLM Chain node (follow-up draft generation)",
  "Wait node (async human-approval checkpoint)",
  "IF node (approval / rejection routing)",
  "Stop And Error node (duplicate detection, validation failure)",
];

const SAFETY_POINTS = [
  "No email is ever sent automatically at any stage",
  "All follow-up drafts are stored for human review only",
  "Approval is required before lead status advances to Ready to Send",
  "All test data is fictional — no real names, companies, or email addresses appear in the system",
  "Webhook payloads contain only demo-mode data",
];

export default function N8nLeadWorkflowPage() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to home
        </Link>

        <div className="mt-8">
          <span className="inline-flex rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 ring-1 ring-white/[0.04]">
            Workflow demo
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            n8n AI Lead Intake and CRM-Style Tracking Workflow
          </h1>
          <p className="mt-4 text-xl leading-relaxed text-zinc-400">
            A reusable n8n workflow template demonstrating AI-assisted lead
            intake, CRM-style Google Sheets record management, and a
            human-approval checkpoint using fictional sample data.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] px-6 py-4">
          <p className="text-sm leading-relaxed text-amber-200/80">
            <span className="font-semibold text-amber-300">Disclosure: </span>
            Independent workflow demonstration using fictional sample data. This
            project does not represent client results or a live client
            deployment.
          </p>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">The Workflow Problem</h2>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Most small teams handle lead intake manually — copying submissions
            into spreadsheets, eyeballing priority, and writing follow-up
            messages from scratch. The result is inconsistent triage, slow
            response times, and leads that fall through the cracks before anyone
            decides whether they&apos;re worth pursuing.
          </p>
          <p className="mt-3 leading-relaxed text-zinc-400">
            The pattern gets worse when outreach is unreviewed. Auto-sending
            follow-ups without a human checkpoint creates compliance risk and
            off-brand messaging. This workflow addresses both sides: structured
            intake with AI classification, and an explicit approval gate before
            any draft advances to send.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Architecture</h2>
          <p className="mt-3 text-sm text-zinc-500">
            Two coordinated workflows handle the full lead lifecycle.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                WF1 — Lead Intake
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Stateless intake
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Triggered by a POST webhook. Validates required fields and email
                format, checks for duplicate submissions via Google Sheets
                lookup, then runs AI classification using the Information
                Extractor node — producing temperature (HOT/WARM/COLD), urgency,
                business type, a 2–3 sentence summary, and a suggested reply
                tone.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                A 21-column record is written to Google Sheets, a follow-up
                draft is generated via the Basic LLM Chain, and the draft is
                stored in the record. WF1 then responds immediately to the
                caller with the lead ID and the WF2 review endpoint. No waiting,
                no pause.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Webhook", "Validation", "Duplicate check", "OpenAI classify", "Google Sheets", "LLM draft"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                WF2 — Lead Approval
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Always-on approval handler
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                A permanently active webhook that receives approve or reject
                decisions from a reviewer. On approval, it updates the Sheets
                record to Approved, sends an immediate response to the reviewer,
                then pauses at a Wait node for up to 24 hours awaiting send
                confirmation.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                When the reviewer confirms, the workflow resumes and routes to
                Mark Ready to Send. On rejection, the workflow routes directly
                to Mark Rejected without triggering the Wait node. The
                approve-then-wait pattern separates the decision from the send
                action, giving the reviewer a final checkpoint.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Always-on webhook", "IF routing", "Wait node", "Google Sheets", "Reject path"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Import order
            </p>
            <p className="mt-1.5 text-sm text-zinc-400">
              WF4 Error Handler → WF3 Booking Update → WF2 Lead Approval{" "}
              <span className="text-emerald-400">(activate before WF1)</span> →
              WF1 Lead Intake
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              This public walkthrough demonstrates WF1 lead intake and WF2 human approval. Additional booking-update and error-handling workflow concepts remain outside the validated public demo until separately tested and documented.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Tools Used</h2>
          <ul className="mt-5 space-y-2.5">
            {TOOLS.map((tool) => (
              <li key={tool} className="flex items-start gap-3 text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span className="text-sm">{tool}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">
              Human Review and Safety
            </h2>
          </div>
          <p className="mt-4 leading-relaxed text-zinc-400">
            The workflow is designed so that no outreach action happens
            automatically. Every path through the approval handler requires a
            deliberate human decision before lead status advances.
          </p>
          <ul className="mt-5 space-y-2.5">
            {SAFETY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-zinc-300">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">
            What Could This Look Like for Your Business?
          </h2>
          <p className="mt-4 leading-relaxed text-zinc-400">
            The two-workflow pattern — stateless intake plus always-on approval
            handler — is reusable across any lead or inquiry workflow that needs
            consistent triage and human review before outreach. The intake
            webhook can be pointed at a Typeform, a website form, or any tool
            that sends a POST request. The storage layer can be Google Sheets
            or another scoped data store, depending on the workflow requirements.
          </p>
          <p className="mt-3 leading-relaxed text-zinc-400">
            For a client deployment, the follow-up draft would be reviewed and
            sent by a real team member rather than held indefinitely. The AI
            classification fields — temperature, urgency, business type, summary
            — give the reviewer enough signal to prioritize and personalize
            without reading the raw submission every time.
          </p>
        </section>

        <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-600/[0.08] to-transparent p-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Have a similar workflow challenge?
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Let&apos;s map out your intake and approval flow.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400">
            Request an AI Revenue Leak Audit to review your current lead or
            inquiry process and determine whether a structured intake and
            approval workflow is worth scoping.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-500"
          >
            Request an AI Revenue Leak Audit
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
