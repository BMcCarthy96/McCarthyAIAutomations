-- Demo showcase seed data
-- Safe to re-run: this script removes/recreates only fixed demo IDs.
-- Intended for sales demos/screenshots (not production seeding).

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM services WHERE id IN ('2', '3', '4')) THEN
    RAISE EXCEPTION 'Missing required services (2,3,4). Seed services first.';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Fixed demo IDs
-- ---------------------------------------------------------------------------
-- client
--   72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77
-- client_services
--   52c53e5e-3dce-47f4-a0ea-1434de5e4fd6
--   4fe28f4f-4d95-487a-aa41-cbe37d08914f
--   cce7ea37-2f2a-46fe-ba54-3122bc3ee9e8
-- projects
--   9244d329-d9ea-4713-9f74-87c9a2548fa4
--   19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3
--   7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4

-- Clean up only our demo rows (dependency order).
DELETE FROM support_replies
WHERE support_request_id IN (
  '5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7',
  'ea206cf4-6dc2-4628-99b4-cef656cf03f3',
  '9052039f-7d6d-4f64-8d1e-bd0de4c6f44e'
);

DELETE FROM support_requests
WHERE id IN (
  '5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7',
  'ea206cf4-6dc2-4628-99b4-cef656cf03f3',
  '9052039f-7d6d-4f64-8d1e-bd0de4c6f44e'
);

DELETE FROM billing_records
WHERE id IN (
  '95d4cef9-70f6-4dd6-a784-fce20b8b4eff',
  'f95f3168-f703-4f2e-8613-67d4c8fd15f4',
  '9e55ac73-d7f2-4a5a-b9f1-ef669a97cb57'
);

DELETE FROM project_updates
WHERE id IN (
  '3474371f-c6eb-4f19-92b0-1e6c53295d85',
  '4dd0643f-3520-4f9c-b8c4-2f8ec84e2d20',
  'e6f6b720-4f15-41e8-9eb7-6a72f7c8fa62',
  '93f30f89-9b74-48d1-b14b-7b0720f9935b'
);

DELETE FROM milestones
WHERE id IN (
  '57cdb6b8-78dd-49f8-9fbf-8c95730380c0',
  'd7f084cc-ceea-41ad-84e4-1ee7e0da08f8',
  '395f2f68-6b29-45d8-98db-f455ff4dc808',
  '9a4b10e1-6f9f-441e-82a2-1986c843fdb6',
  'e8f039b7-1334-4100-bf65-4cc9bc2feebf',
  '1ca08b67-e42f-45b1-aecf-9ce8bd27317d'
);

DELETE FROM project_metrics
WHERE project_id IN (
  '9244d329-d9ea-4713-9f74-87c9a2548fa4',
  '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
  '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4'
);

DELETE FROM projects
WHERE id IN (
  '9244d329-d9ea-4713-9f74-87c9a2548fa4',
  '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
  '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4'
);

DELETE FROM client_services
WHERE id IN (
  '52c53e5e-3dce-47f4-a0ea-1434de5e4fd6',
  '4fe28f4f-4d95-487a-aa41-cbe37d08914f',
  'cce7ea37-2f2a-46fe-ba54-3122bc3ee9e8'
);

DELETE FROM clients
WHERE id = '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77';

-- ---------------------------------------------------------------------------
-- Demo client
-- ---------------------------------------------------------------------------
INSERT INTO clients (
  id,
  name,
  email,
  company,
  monthly_report_enabled
) VALUES (
  '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
  'Alex Rivera',
  'demo@acmehome.example',
  'Acme Home Services (Demo)',
  true
);

-- ---------------------------------------------------------------------------
-- Engagements + projects
-- ---------------------------------------------------------------------------
INSERT INTO client_services (id, client_id, service_id, engagement_name, status, progress, started_at)
VALUES
  (
    '52c53e5e-3dce-47f4-a0ea-1434de5e4fd6',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    '2',
    'AI Voice Agent – Inbound Calls',
    'active',
    82,
    now() - interval '70 days'
  ),
  (
    '4fe28f4f-4d95-487a-aa41-cbe37d08914f',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    '3',
    'Lead Capture & Scheduling',
    'in_progress',
    58,
    now() - interval '42 days'
  ),
  (
    'cce7ea37-2f2a-46fe-ba54-3122bc3ee9e8',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    '4',
    'Website AI Chatbot',
    'active',
    93,
    now() - interval '95 days'
  );

INSERT INTO projects (id, client_service_id, name, status, progress, started_at)
VALUES
  (
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    '52c53e5e-3dce-47f4-a0ea-1434de5e4fd6',
    'Inbound Voice Agent Rollout',
    'active',
    82,
    now() - interval '70 days'
  ),
  (
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    '4fe28f4f-4d95-487a-aa41-cbe37d08914f',
    'Lead Funnel Automation',
    'in_progress',
    58,
    now() - interval '42 days'
  ),
  (
    '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4',
    'cce7ea37-2f2a-46fe-ba54-3122bc3ee9e8',
    'Chatbot Conversion Upgrade',
    'active',
    93,
    now() - interval '95 days'
  );

-- ---------------------------------------------------------------------------
-- Milestones (mix of upcoming/overdue/completed)
-- ---------------------------------------------------------------------------
INSERT INTO milestones (id, project_id, title, due_date, completed_at)
VALUES
  (
    '57cdb6b8-78dd-49f8-9fbf-8c95730380c0',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    'Call routing intents finalized',
    (current_date - interval '10 days')::date,
    now() - interval '9 days'
  ),
  (
    'd7f084cc-ceea-41ad-84e4-1ee7e0da08f8',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    'Escalation playbook v2',
    (current_date + interval '5 days')::date,
    null
  ),
  (
    '395f2f68-6b29-45d8-98db-f455ff4dc808',
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    'Calendar sync QA',
    (current_date - interval '3 days')::date,
    null
  ),
  (
    '9a4b10e1-6f9f-441e-82a2-1986c843fdb6',
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    'CRM writeback launch',
    (current_date + interval '12 days')::date,
    null
  ),
  (
    'e8f039b7-1334-4100-bf65-4cc9bc2feebf',
    '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4',
    'Knowledge base ingestion',
    (current_date - interval '18 days')::date,
    now() - interval '17 days'
  ),
  (
    '1ca08b67-e42f-45b1-aecf-9ce8bd27317d',
    '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4',
    'A/B response optimization',
    (current_date + interval '9 days')::date,
    null
  );

-- ---------------------------------------------------------------------------
-- Project updates
-- ---------------------------------------------------------------------------
INSERT INTO project_updates (id, project_id, title, body, created_at)
VALUES
  (
    '3474371f-c6eb-4f19-92b0-1e6c53295d85',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    'After-hours handoff improved',
    'Updated transfer logic reduced missed escalations by 34% in the first week.',
    now() - interval '14 days'
  ),
  (
    '4dd0643f-3520-4f9c-b8c4-2f8ec84e2d20',
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    'Lead form enrichment live',
    'Added campaign source capture and qualification tags to scheduling payloads.',
    now() - interval '9 days'
  ),
  (
    'e6f6b720-4f15-41e8-9eb7-6a72f7c8fa62',
    '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4',
    'Chat containment reached target',
    'Bot now resolves 71% of tier-1 intents without human takeover.',
    now() - interval '6 days'
  ),
  (
    '93f30f89-9b74-48d1-b14b-7b0720f9935b',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    'Weekend volume spike handled',
    'Voice agent managed peak demand while maintaining <25s avg response.',
    now() - interval '2 days'
  );

-- ---------------------------------------------------------------------------
-- Automation metrics (powers monthly impact report)
-- ---------------------------------------------------------------------------
INSERT INTO project_metrics (
  id,
  project_id,
  calls_handled,
  leads_captured,
  appointments_booked,
  hours_saved,
  estimated_revenue
) VALUES
  (
    '4cc8f4d0-cb20-4e5d-9bc0-72d67fa5b1d7',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    318,
    86,
    41,
    62,
    28750
  ),
  (
    'f44a16fc-f80d-4ba6-9145-ff9b7f13dfef',
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    166,
    54,
    28,
    33,
    16300
  ),
  (
    'fe62d867-a130-4ca8-a239-f6ea0f55d38c',
    '7c8e64bd-acbc-442e-b4ce-c8d4e0f6fcf4',
    204,
    39,
    19,
    27,
    12400
  );

-- ---------------------------------------------------------------------------
-- Billing records
-- ---------------------------------------------------------------------------
INSERT INTO billing_records (
  id,
  client_id,
  amount_cents,
  currency,
  description,
  status,
  due_date,
  paid_at
) VALUES
  (
    '95d4cef9-70f6-4dd6-a784-fce20b8b4eff',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    420000,
    'USD',
    'Voice Agent Optimization Retainer',
    'paid',
    (current_date - interval '30 days')::date,
    now() - interval '27 days'
  ),
  (
    'f95f3168-f703-4f2e-8613-67d4c8fd15f4',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    310000,
    'USD',
    'Lead Funnel Automation Expansion',
    'pending',
    (current_date + interval '8 days')::date,
    null
  ),
  (
    '9e55ac73-d7f2-4a5a-b9f1-ef669a97cb57',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    180000,
    'USD',
    'Chatbot Conversion Sprint',
    'overdue',
    (current_date - interval '12 days')::date,
    null
  );

-- ---------------------------------------------------------------------------
-- Support requests
-- ---------------------------------------------------------------------------
INSERT INTO support_requests (
  id,
  client_id,
  project_id,
  subject,
  body,
  status,
  category,
  created_at,
  updated_at
) VALUES
  (
    '5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    '9244d329-d9ea-4713-9f74-87c9a2548fa4',
    'Adjust voicemail fallback copy',
    'Can we update the fallback script to mention holiday scheduling?',
    'in_progress',
    'voice_agent',
    now() - interval '7 days',
    now() - interval '2 days'
  ),
  (
    'ea206cf4-6dc2-4628-99b4-cef656cf03f3',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    '19fda46e-6f6a-4fe5-b9ee-d208fdb48ee3',
    'Need extra lead source tagging',
    'Please add “Direct Mail” as a source option in the booking flow.',
    'open',
    'lead_capture',
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '9052039f-7d6d-4f64-8d1e-bd0de4c6f44e',
    '72b8a4b0-9e83-4f39-a5b2-3f3589fb2c77',
    null,
    'Monthly report export format',
    'Could we get a CSV export from the monthly impact report?',
    'resolved',
    'reporting',
    now() - interval '18 days',
    now() - interval '10 days'
  );

INSERT INTO support_replies (id, support_request_id, body, sender_type, created_at)
VALUES
  (
    '263fc57b-a404-41fd-81d5-20bd77f85e35',
    '5f1b6f0e-bf88-44ef-bf5a-39ed58d949f7',
    'Absolutely — we will publish revised fallback copy with the holiday note by Friday.',
    'admin',
    now() - interval '2 days'
  );

COMMIT;
