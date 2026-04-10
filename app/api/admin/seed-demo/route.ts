import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/admin-auth";
import { getSupabaseServiceClient } from "@/lib/supabase";

/**
 * POST /api/admin/seed-demo
 *
 * Admin-only: upserts the full demo dataset into production and links the
 * DEMO_CLERK_USER_ID to the demo client record so the demo dashboard shows
 * meaningful data when a prospect clicks "Portal demo".
 *
 * Idempotent: safe to run multiple times. Only touches fixed demo UUIDs.
 * Never modifies real client data.
 */

// ─── Fixed demo UUIDs (must match demo-config.ts SHOWCASE_DEMO_CLIENT_ID) ──

const DEMO_CLIENT_ID = "72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77";

const DEMO_CLIENT_SERVICE_IDS = [
  "52c53e5e-3dce-47f4-a0ea-1434de5e4fd6", // AI Voice Agent
  "4fe28f4f-4d95-487a-aa41-cbe37d08914f", // Lead Capture
  "cce7ea37-2f2a-46fe-ba54-3122bc3ee9e8", // Website Chatbot
];

const DEMO_PROJECT_IDS = [
  "9244d329-d9ea-4713-9f74-87c9a2548fa4", // Voice Agent Rollout
  "19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3", // Lead Funnel Automation
  "7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4", // Chatbot Conversion Upgrade
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  // Return YYYY-MM-DD for date columns
  return d.toISOString().slice(0, 10);
}

function dateOnly(isoOrOffset: string): string {
  return isoOrOffset.slice(0, 10);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST() {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const demoClerkUserId = process.env.DEMO_CLERK_USER_ID?.trim();
  if (!demoClerkUserId) {
    return NextResponse.json(
      { error: "DEMO_CLERK_USER_ID is not set. Add it to your production environment variables." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database unavailable." }, { status: 503 });
  }

  const log: string[] = [];

  try {
    // ── 1. Services (required FKs for client_services) ──────────────────────
    //    Upsert only the three we use so we don't overwrite a full catalog.
    const { error: svcErr } = await supabase.from("services").upsert(
      [
        {
          id: "2",
          slug: "ai-voice-agents",
          name: "AI Voice Agents",
          tagline: "24/7 phone answering that never misses a lead",
          description:
            "Deploy AI voice agents that answer calls, qualify leads, and book appointments around the clock.",
          long_description:
            "Never miss a call again. Our AI voice agents handle inbound calls with natural conversation, capture lead details, schedule appointments, and escalate when needed.",
          features: JSON.stringify([
            "24/7 automated phone answering",
            "Natural language call handling",
            "Lead capture and qualification",
            "Calendar and CRM integration",
            "Escalation to human agents",
          ]),
          icon: "Phone",
          highlights: JSON.stringify(["Voice AI", "24/7", "Bookings"]),
        },
        {
          id: "3",
          slug: "lead-capture-appointment-automation",
          name: "Lead Capture & Appointment Automation",
          tagline: "Capture every lead, book every appointment automatically",
          description:
            "Automate your entire lead capture and appointment scheduling workflow so no opportunity slips through.",
          long_description:
            "From web form to booked appointment, we automate the full pipeline: capture, qualify, follow up, and schedule — all without manual effort.",
          features: JSON.stringify([
            "Smart web form capture",
            "Automated lead follow-up",
            "Calendar integration and booking",
            "CRM lead writeback",
            "Pipeline reporting",
          ]),
          icon: "Target",
          highlights: JSON.stringify(["Lead Gen", "Automation", "CRM"]),
        },
        {
          id: "4",
          slug: "website-ai-chatbots",
          name: "Website AI Chatbots",
          tagline: "Engage visitors 24/7 with intelligent conversation",
          description:
            "Deploy AI chatbots that answer questions, qualify visitors, and route leads straight into your pipeline.",
          long_description:
            "Turn passive website traffic into active conversations. Our chatbots handle FAQs, capture contact details, and escalate to a human when the intent is clear.",
          features: JSON.stringify([
            "Custom-trained on your content",
            "Lead capture and qualification",
            "Escalation to live agent",
            "CRM and email integration",
            "Analytics and containment tracking",
          ]),
          icon: "MessageSquare",
          highlights: JSON.stringify(["Chatbot", "Conversions", "24/7"]),
        },
      ],
      { onConflict: "id" }
    );
    if (svcErr) throw new Error(`services upsert: ${svcErr.message}`);
    log.push("✓ services (3 records upserted)");

    // ── 2. Demo client (with clerk_user_id linked) ───────────────────────────
    const { error: clientErr } = await supabase.from("clients").upsert(
      {
        id: DEMO_CLIENT_ID,
        name: "Chris Hartwell",
        email: "demo@hartwellhvac.example",
        company: "Hartwell HVAC & Plumbing (Demo)",
        monthly_report_enabled: true,
        clerk_user_id: demoClerkUserId,
        is_archived: false,
      },
      { onConflict: "id" }
    );
    if (clientErr) throw new Error(`clients upsert: ${clientErr.message}`);
    log.push(`✓ demo client upserted (clerk_user_id = ${demoClerkUserId})`);

    // ── 3. Client services ───────────────────────────────────────────────────
    const { error: csErr } = await supabase.from("client_services").upsert(
      [
        {
          id: DEMO_CLIENT_SERVICE_IDS[0],
          client_id: DEMO_CLIENT_ID,
          service_id: "2",
          engagement_name: "AI Voice Agent – Inbound Calls",
          status: "active",
          progress: 88,
          started_at: daysAgo(72),
        },
        {
          id: DEMO_CLIENT_SERVICE_IDS[1],
          client_id: DEMO_CLIENT_ID,
          service_id: "3",
          engagement_name: "Lead Capture & Booking Automation",
          status: "active",
          progress: 65,
          started_at: daysAgo(44),
        },
        {
          id: DEMO_CLIENT_SERVICE_IDS[2],
          client_id: DEMO_CLIENT_ID,
          service_id: "4",
          engagement_name: "Website AI Assistant",
          status: "active",
          progress: 95,
          started_at: daysAgo(98),
        },
      ],
      { onConflict: "id" }
    );
    if (csErr) throw new Error(`client_services upsert: ${csErr.message}`);
    log.push("✓ client_services (3 records upserted)");

    // ── 4. Projects ──────────────────────────────────────────────────────────
    const { error: projErr } = await supabase.from("projects").upsert(
      [
        {
          id: DEMO_PROJECT_IDS[0],
          client_service_id: DEMO_CLIENT_SERVICE_IDS[0],
          name: "Inbound Voice Agent Rollout",
          status: "active",
          progress: 88,
          started_at: daysAgo(72),
        },
        {
          id: DEMO_PROJECT_IDS[1],
          client_service_id: DEMO_CLIENT_SERVICE_IDS[1],
          name: "Lead Funnel Automation",
          status: "active",
          progress: 65,
          started_at: daysAgo(44),
        },
        {
          id: DEMO_PROJECT_IDS[2],
          client_service_id: DEMO_CLIENT_SERVICE_IDS[2],
          name: "Website AI Chatbot",
          status: "active",
          progress: 95,
          started_at: daysAgo(98),
        },
      ],
      { onConflict: "id" }
    );
    if (projErr) throw new Error(`projects upsert: ${projErr.message}`);
    log.push("✓ projects (3 records upserted)");

    // ── 5. Project metrics ───────────────────────────────────────────────────
    const { error: metricsErr } = await supabase.from("project_metrics").upsert(
      [
        {
          id: "4cc8f4d0-cb20-4e5d-9bc0-72d67fa5b1d7",
          project_id: DEMO_PROJECT_IDS[0],
          calls_handled: 412,
          leads_captured: 94,
          appointments_booked: 67,
          hours_saved: 88,
          estimated_revenue: 34200,
        },
        {
          id: "f44a16fc-f80d-4ba6-9145-ff9b7f13dfef",
          project_id: DEMO_PROJECT_IDS[1],
          calls_handled: 0,
          leads_captured: 141,
          appointments_booked: 89,
          hours_saved: 41,
          estimated_revenue: 22700,
        },
        {
          id: "fe62d867-a130-4ca8-a239-f6ea0f55d38c",
          project_id: DEMO_PROJECT_IDS[2],
          calls_handled: 0,
          leads_captured: 52,
          appointments_booked: 0,
          hours_saved: 29,
          estimated_revenue: 8900,
        },
      ],
      { onConflict: "id" }
    );
    if (metricsErr) {
      // project_metrics may not exist in all environments — log but don't fail
      log.push(`⚠ project_metrics: ${metricsErr.message} (skipped — table may not exist yet)`);
    } else {
      log.push("✓ project_metrics (3 records upserted)");
    }

    // ── 6. Milestones ────────────────────────────────────────────────────────
    const { error: msErr } = await supabase.from("milestones").upsert(
      [
        // Voice agent
        {
          id: "57cdb6b8-78dd-49f8-9fbf-8c95730380c0",
          project_id: DEMO_PROJECT_IDS[0],
          title: "Call routing intents approved",
          due_date: dateOnly(daysAgo(12)),
          completed_at: daysAgo(11),
        },
        {
          id: "d7f084cc-ceea-41ad-84e4-1ee7e0da08f8",
          project_id: DEMO_PROJECT_IDS[0],
          title: "After-hours escalation playbook live",
          due_date: daysFromNow(4),
          completed_at: null,
        },
        // Lead capture
        {
          id: "395f2f68-6b29-45d8-98db-f455ff4dc808",
          project_id: DEMO_PROJECT_IDS[1],
          title: "CRM writeback + source tagging QA",
          due_date: dateOnly(daysAgo(3)),
          completed_at: null,
        },
        {
          id: "9a4b10e1-6f9f-441e-82a2-1986c843fdb6",
          project_id: DEMO_PROJECT_IDS[1],
          title: "Booking confirmation sequence launch",
          due_date: daysFromNow(8),
          completed_at: null,
        },
        // Website chatbot
        {
          id: "e8f039b7-1334-4100-bf65-4cc9bc2feebf",
          project_id: DEMO_PROJECT_IDS[2],
          title: "Knowledge base v2 ingested",
          due_date: dateOnly(daysAgo(19)),
          completed_at: daysAgo(18),
        },
        {
          id: "1ca08b67-e42f-45b1-aecf-9ce8bd27317d",
          project_id: DEMO_PROJECT_IDS[2],
          title: "A/B response optimization complete",
          due_date: daysFromNow(6),
          completed_at: null,
        },
      ],
      { onConflict: "id" }
    );
    if (msErr) throw new Error(`milestones upsert: ${msErr.message}`);
    log.push("✓ milestones (6 records upserted)");

    // ── 7. Project updates ───────────────────────────────────────────────────
    const { error: updErr } = await supabase.from("project_updates").upsert(
      [
        {
          id: "3474371f-c6eb-4f19-92b0-1e6c53295d85",
          project_id: DEMO_PROJECT_IDS[0],
          title: "Peak weekend call volume handled",
          body: "Bot managed 47 inbound calls Saturday with zero missed contacts and an average response time under 20 seconds. After-hours handoff is working exactly as designed.",
          created_at: daysAgo(14),
        },
        {
          id: "4dd0643f-3520-4f9c-b8c4-2f8ec84e2d20",
          project_id: DEMO_PROJECT_IDS[1],
          title: "First 30-day result: 61 booked appointments",
          body: "Lead capture rate improved 3x over manual intake. Campaign source tagging is now live — you can see exactly which marketing channels are driving bookings.",
          created_at: daysAgo(9),
        },
        {
          id: "e6f6b720-4f15-41e8-9eb7-6a72f7c8fa62",
          project_id: DEMO_PROJECT_IDS[2],
          title: "Chatbot tier-1 containment at 78%",
          body: "AI now resolves 4 in 5 visitor questions without escalating to a human. Common queries (service areas, pricing estimates, availability) are handled end-to-end.",
          created_at: daysAgo(6),
        },
        {
          id: "93f30f89-9b74-48d1-b14b-7b0720f9935b",
          project_id: DEMO_PROJECT_IDS[0],
          title: "Holiday scripts + fallback copy updated",
          body: "Seasonal greeting and revised voicemail fallback are now live. The spring promotion mention was added to the after-hours message as requested.",
          created_at: daysAgo(2),
        },
      ],
      { onConflict: "id" }
    );
    if (updErr) throw new Error(`project_updates upsert: ${updErr.message}`);
    log.push("✓ project_updates (4 records upserted)");

    // ── 8. Billing records ───────────────────────────────────────────────────
    const { error: billErr } = await supabase.from("billing_records").upsert(
      [
        {
          id: "95d4cef9-70f6-4dd6-a784-fce20b8b4eff",
          client_id: DEMO_CLIENT_ID,
          amount_cents: 240000,
          currency: "USD",
          description: "AI Voice Agent — Month 3 Retainer",
          status: "paid",
          due_date: dateOnly(daysAgo(30)),
          paid_at: daysAgo(27),
        },
        {
          id: "f95f3168-f703-4f2e-8613-67d4c8fd15f4",
          client_id: DEMO_CLIENT_ID,
          amount_cents: 180000,
          currency: "USD",
          description: "Lead Capture Expansion — Phase 2",
          status: "pending",
          due_date: daysFromNow(5),
          paid_at: null,
        },
        {
          id: "9e55ac73-d7f2-4a5a-b9f1-ef669a97cb57",
          client_id: DEMO_CLIENT_ID,
          amount_cents: 95000,
          currency: "USD",
          description: "Website AI Chatbot — Optimization Sprint",
          status: "paid",
          due_date: dateOnly(daysAgo(45)),
          paid_at: daysAgo(42),
        },
      ],
      { onConflict: "id" }
    );
    if (billErr) throw new Error(`billing_records upsert: ${billErr.message}`);
    log.push("✓ billing_records (3 records upserted)");

    // ── 9. Support requests ──────────────────────────────────────────────────
    const { error: srErr } = await supabase.from("support_requests").upsert(
      [
        {
          id: "5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7",
          client_id: DEMO_CLIENT_ID,
          project_id: DEMO_PROJECT_IDS[0],
          subject: "Update intake script for spring promotions",
          body: "Can we add a mention of our spring HVAC tune-up special in the call intro? Something like \"Ask about our spring tune-up package\" after the greeting.",
          status: "in_progress",
          category: "voice_agent",
          created_at: daysAgo(7),
          updated_at: daysAgo(2),
        },
        {
          id: "ea206cf4-6dc2-4628-99b4-cef656cf03f3",
          client_id: DEMO_CLIENT_ID,
          project_id: DEMO_PROJECT_IDS[1],
          subject: "Add Google Review link to booking confirmation",
          body: "After a job is completed, could we send an automated follow-up with a Google Review link? We've been getting good feedback verbally but not capturing it online.",
          status: "open",
          category: "lead_capture",
          created_at: daysAgo(3),
          updated_at: daysAgo(3),
        },
      ],
      { onConflict: "id" }
    );
    if (srErr) throw new Error(`support_requests upsert: ${srErr.message}`);
    log.push("✓ support_requests (2 records upserted)");

    // ── 10. Support replies ───────────────────────────────────────────────────
    const { error: repErr } = await supabase.from("support_replies").upsert(
      [
        {
          id: "263fc57b-a404-41fd-81d5-20bd77f85e35",
          support_request_id: "5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7",
          body: "On it — we'll publish the updated script with the spring tune-up mention by end of week. I'll send you a preview of the new intro copy for approval first.",
          sender_type: "admin",
          created_at: daysAgo(2),
        },
      ],
      { onConflict: "id" }
    );
    if (repErr) throw new Error(`support_replies upsert: ${repErr.message}`);
    log.push("✓ support_replies (1 record upserted)");

    return NextResponse.json({
      ok: true,
      demoClientId: DEMO_CLIENT_ID,
      linkedClerkUserId: demoClerkUserId,
      log,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, log }, { status: 500 });
  }
}
