# McCarthy AI Automations — Claude Behavioral Kernel

## Project Context

Next.js 16 / React 19 / TypeScript SaaS platform.
Stack: Supabase (Postgres) · Clerk (auth) · Stripe (payments) · Resend (email) · OpenAI (assistants + lead AI) · Zapier (webhook relay) · Vercel (hosting + cron).

Key systems:
- **Client portal** (`/dashboard`) — project tracking, milestones, support, billing, AI assistant
- **Admin dashboard** (`/admin`) — client management, billing, support inbox, demo seed
- **Lead capture** (`/contact` → Supabase → OpenAI → Zapier) — must never silently fail
- **Demo system** (`/demo` route + seed endpoint) — production demo for prospects
- **Marketing site** (`/app/(marketing)`) — public pages, AI widget, consultation form

---

## 1. Execution Loop

1. Read only what's needed (Grep before Read)
2. Understand the affected system before changing it
3. Make the minimal correct change
4. Verify (typecheck → lint → targeted check)
5. Report what was done and what was tested

---

## 2. Production Safety — Non-Negotiable

**Real client data is off-limits.**
- Never modify `clients`, `projects`, `billing_records`, or `support_requests` rows unless explicitly instructed and the target is the demo client (`id = 72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77`) or a new record
- Admin actions touch production — always confirm scope before executing
- Demo client is identified by `SHOWCASE_DEMO_CLIENT_ID` in `lib/demo-config.ts` — treat all other client rows as untouchable

**Never break these flows:**
- `createPublicSupportRequestAction()` → Supabase insert → email → OpenAI → Zapier webhook
- Stripe `checkout.session.completed` → billing record update
- `/demo` route → Clerk sign-in token → dashboard
- Cron endpoints (`/api/cron/*`) — verify auth, never disable without a replacement

**Before claiming a flow "works":** trace it end-to-end. A route that compiles is not a working flow.

---

## 3. Demo System Rules

- `SHOWCASE_DEMO_CLIENT_ID = "72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77"` — fixed UUID, never change
- Demo data lives in `app/api/admin/seed-demo/route.ts` (production) and `supabase/seeds/demo_showcase.sql` (dev) — keep in sync
- `lib/demo-display.ts` is the single source for demo client name/email displayed in UI
- `lib/demo-config.ts` controls demo detection logic — do not change without understanding all callers
- When updating demo data: change all three files (`seed-demo/route.ts`, `demo_showcase.sql`, `demo-display.ts`)
- After any demo data change: re-run "Seed demo data" from `/admin` to apply to production

---

## 4. Cost Governance

- `Grep` before `Read` — never load a file to find a single symbol
- Read only the needed line range when the file is large
- Do not re-read files already in context
- Do not run the full build to check one component — use `tsc --noEmit` targeted if needed
- One tool call when one will do; no redundant confirmation reads

---

## 5. Failure Classification

Classify before fixing:

| Class | Action |
|-------|--------|
| Syntax / compile | Fix the parse error; don't touch surrounding logic |
| Type error | Fix the type; check all callers |
| Env / config | Report missing var; never hardcode secrets |
| Logic bug | Trace the data path before editing |
| External service (OpenAI, Stripe, Resend, Zapier) | Check error code; add alert, don't swallow |
| Unknown | Investigate; never guess-fix |

**Self-healing:** max 2 retries, different strategy each time. If the same failure recurs, stop and report.

---

## 6. Key File Map

| Area | Critical files |
|------|---------------|
| Lead capture | `lib/portal-actions.ts` → `createPublicSupportRequestAction()` |
| Lead AI | `lib/lead-ai/analyze-public-lead.ts` |
| Email | `lib/email/public-consultation-emails.ts`, `lib/email/lead-follow-up-email.ts` |
| Portal data | `lib/portal-data.ts` — `getCurrentClientId()` is the auth resolver |
| Admin auth | `lib/admin-auth.ts` — `isAdminUser()` |
| Demo config | `lib/demo-config.ts`, `lib/demo-display.ts` |
| Demo seed | `app/api/admin/seed-demo/route.ts`, `supabase/seeds/demo_showcase.sql` |
| Assistant | `lib/assistant/generate.ts` (prompts), `lib/assistant/gather-context.ts` (retrieval) |
| Stripe webhook | `app/api/stripe/webhook/route.ts` |
| Redirects | `next.config.ts` |

---

## 7. Assistant Reliability Rules

- Never add a fallback that says "we don't have that information" — use a confident, forward-looking response
- Empty-state context chunks (`portal_snapshot` kind) must exist for every entity type (milestones, support, billing, updates) so the model has grounded negative scope
- System prompt changes in `generate.ts` require reading the full prompt before editing — partial edits break behavior
- Public widget (marketing site) must never imply it has access to private portal data

---

## 8. UI/UX Trust Rules

- No dead-end navigation — all nav links must resolve to a real page or redirect
- Redirects for stale URLs live in `next.config.ts` (`redirects()`)
- Legal pages (`/terms`, `/privacy`) must contain real content — no placeholders
- Stats and testimonials on the marketing site must be accurate or clearly framed as promises/outcomes — no fabricated metrics
- Post-submit states (forms, actions) must always tell the user what happens next

---

## 9. Environment Variables — Never Hardcode

| Purpose | Variable |
|---------|----------|
| Demo Clerk user | `DEMO_CLERK_USER_ID` |
| Admin Clerk user | `ADMIN_CLERK_USER_ID` |
| Zapier lead webhook | `ZAPIER_LEAD_WEBHOOK_URL` |
| Booking link | `NEXT_PUBLIC_BOOKING_URL` or `BOOKING_URL` |
| Lead cron toggle | `LEAD_FOLLOW_UP_CRON_ENABLED` |
| AI model | `OPENAI_ASSISTANT_MODEL`, `OPENAI_LEAD_ANALYSIS_MODEL` |

When a variable is missing: log clearly and return a safe no-op — never throw to the user.

---

## 10. Completion Integrity

A task is complete only when:
- The change compiles without type errors
- The affected flow was traced end-to-end (not just "it renders")
- No real client data was touched
- The demo system still works (if any shared code was changed)

If any of the above cannot be confirmed, state it explicitly in the report.

---

## 11. Report Format

```
### Result
What was accomplished

### Files Changed
Paths + one-line summary of each change

### Verification
What was traced or checked

### Risks / Follow-up
Real risks only — skip if none
```
