# Perfect ETA Lead System

> **McCarthy AI Automations:** The title reflects an original “Perfect ETA” playbook. This repo’s app is **McCarthy AI Automations** (`www.mccarthyaiautomations.com`); use the same Zap/Sheets ideas below and set **Source** / branding in Zapier (or map the webhook’s `source` + `site_url` fields from the AI Lead Engine) so sheets and emails match your business—not another project.

This document describes the **Perfect ETA** lead workflow: inquiry intake automation, Google Sheets structure, and booking tracker integration. It is intended as operational reference for Zapier (or similar) automations—not as application code.

---

## 1. Inquiry Intake Zap

End-to-end flow from first touch through timed follow-ups.

| Step | Action |
|------|--------|
| **Trigger** | **Webhook** — receives lead payload from the website or form (e.g. inquiry submitted). |
| **1** | **Gmail** — send an internal notification email so the team sees the new lead immediately. |
| **2** | **Google Sheets** — **create a new row** with mapped fields (see [§2](#2-google-sheets-structure)). Initial **Status** is typically `New`. |
| **3** | **Delay** — **10 minutes** (cooling period before first automated outreach). |
| **4** | **Follow-up email** — send first follow-up to the lead (and/or log **Followed Up** when appropriate). |
| **5** | **Delay** — **1 day**. |
| **6** | **Second follow-up email** — second touch; update sheet (e.g. **Status** → `Auto-Followed-Up` if not yet contacted). |

> **Note:** Delays and email copy should align with your compliance and consent rules (e.g. marketing vs transactional).

---

## 2. Google Sheets Structure

### Columns

| Column | Purpose |
|--------|---------|
| **Submitted At** | Timestamp when the lead was received. |
| **Source** | Channel (e.g. web form, referral, ad). |
| **Name** | Lead name. |
| **Email** | Primary email (used for booking lookup). |
| **Phone** | Phone number. |
| **Message** | Inquiry / notes from the form. |
| **Status** | Pipeline stage (dropdown — see below). |
| **Notes** | Internal notes. |
| **Followed Up** | Whether follow-up was completed (dropdown). |
| **Booked** | Whether an appointment was booked (dropdown). |
| **Appointment Date** | Date of scheduled meeting. |
| **Appointment Time** | Time of scheduled meeting. |
| **Attended** | Whether they showed up (dropdown). |
| **Qualified** | Qualification outcome (dropdown). |
| **Offer Sold** | Whether an offer closed (dropdown). |
| **Revenue** | Deal value when applicable. |
| **Lead ID** | Stable unique id (from CRM, form, or generated). |
| **Lead Temperature** | Priority / intent signal (dropdown). |

### Dropdown values

| Field | Allowed values |
|-------|----------------|
| **Status** | `New`, `Auto-Followed-Up`, `Contacted`, `Interested`, `Booked`, `Attended`, `Qualified`, `Not Qualified`, `Closed Won`, `Closed Lost` |
| **Followed Up** | `Yes`, `No` |
| **Booked** | `Yes`, `No` |
| **Attended** | `Yes`, `No` |
| **Qualified** | `Unknown`, `Yes`, `No` |
| **Offer Sold** | `Yes`, `No` |
| **Lead Temperature** | `Cold`, `Warm`, `Hot` |

Configure these as **data validation** (dropdown lists) on the sheet so manual edits and Zaps stay consistent.

---

## 3. Booking Tracker Zap

Keeps the sheet aligned with confirmed meetings.

| Step | Action |
|------|--------|
| **Trigger** | **Gmail** — new email matching your **Zoom confirmation** pattern (sender/subject/body filters). |
| **1** | **Parse / extract** — pull **email address** and **appointment details** (date, time, timezone if needed) from the message body or headers. |
| **2** | **Google Sheets — lookup** — find the row where **Email** matches the extracted address (or **Lead ID** if you key off that instead). |
| **3** | **Google Sheets — update row** — set **Booked** → `Yes`, **Appointment Date** / **Appointment Time**, and **Status** → `Booked` (or your chosen mapping). Optionally set **Notes** with Zoom / meeting metadata. |

> **Reliability tip:** Prefer a consistent Zoom email template; if parsing is fragile, add a manual review step or a structured snippet in the email body.

---

## 4. In-app AI Lead Engine (McCarthy app) vs Zapier

The Next.js app stores **public consultation** submissions in Supabase (`support_requests` with `category = public`). **AI Lead Engine (MVP)** runs **after** each successful insert (non-blocking): it classifies the message, scores temperature/urgency/budget signals, and writes structured fields back to the same row (`ai_*` columns). Admins review results under **Admin → Support → request detail**.

**How this fits the Zap above**

| Layer | Role |
|--------|------|
| **App + Supabase** | System of record for the raw lead + **AI intelligence** (summary, temperature, suggested reply, etc.). |
| **Zapier** | Still ideal for **downstream comms** (Gmail, timed follow-ups) and **Sheets** as your operational pipeline. |
| **In-app cron** | Optional booking reminder (`/api/cron/lead-follow-up`) remains separate from Zapier; use either or both deliberately. |

**Webhook payload:** When `ZAPIER_LEAD_WEBHOOK_URL` is set, the app POSTs JSON after AI completes, including **`source`** (`McCarthy AI Automations`) and **`site_url`** (from `NEXT_PUBLIC_APP_URL` or `VERCEL_URL`) so Zapier can map a correct **Source** column without hardcoding another brand.

**Optional v2 idea:** Add a Zap step (e.g. Supabase insert/update webhook or scheduled poll) to copy `ai_lead_temperature` / summary into the **Lead Temperature** or **Notes** columns in Google Sheets so the sheet matches the app without replacing Zapier.

---

## 5. Future Improvements

| Improvement | Description |
|-------------|---------------|
| **Zoom Scheduler webhooks** | Replace **Gmail parsing** with **Zoom Scheduler** (or Zoom) **webhooks** for structured booking events—fewer brittle regex steps. |
| **SMS follow-ups** | Add SMS steps (Twilio, etc.) parallel to email for higher response rates; respect opt-in and regulations. |
| **CRM integration** | Sync sheet ↔ HubSpot / Salesforce / Pipedrive so **Status**, **Revenue**, and **Lead ID** stay authoritative in one system. |
| **Revenue & conversion metrics** | Dashboards from **Closed Won** revenue, time-to-book, and stage conversion (sheet pivot tables, Looker Studio, or BI tool). |
| **Sheet sync from AI fields** | Push `ai_lead_temperature` / `ai_lead_summary` from Supabase into the sheet row for a single view of lead quality. |

---

*Document version: internal reference for Perfect ETA lead operations.*
