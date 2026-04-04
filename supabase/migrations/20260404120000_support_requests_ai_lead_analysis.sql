-- AI Lead Engine (MVP): structured analysis for public consultation rows on support_requests.
-- Complements in-app lead capture and external Zapier follow-up (see LEAD_SYSTEM.md).

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS ai_lead_analysis_status text NULL,
  ADD COLUMN IF NOT EXISTS ai_lead_summary text NULL,
  ADD COLUMN IF NOT EXISTS ai_business_type text NULL,
  ADD COLUMN IF NOT EXISTS ai_likely_service text NULL,
  ADD COLUMN IF NOT EXISTS ai_urgency text NULL,
  ADD COLUMN IF NOT EXISTS ai_budget_signal text NULL,
  ADD COLUMN IF NOT EXISTS ai_lead_temperature text NULL,
  ADD COLUMN IF NOT EXISTS ai_confidence real NULL,
  ADD COLUMN IF NOT EXISTS ai_next_action text NULL,
  ADD COLUMN IF NOT EXISTS ai_follow_up_tone text NULL,
  ADD COLUMN IF NOT EXISTS ai_suggested_reply text NULL,
  ADD COLUMN IF NOT EXISTS ai_classification_note text NULL,
  ADD COLUMN IF NOT EXISTS ai_processed_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS ai_error_message text NULL,
  ADD COLUMN IF NOT EXISTS ai_model text NULL;

ALTER TABLE support_requests DROP CONSTRAINT IF EXISTS support_requests_ai_lead_analysis_status_chk;
ALTER TABLE support_requests ADD CONSTRAINT support_requests_ai_lead_analysis_status_chk
  CHECK (
    ai_lead_analysis_status IS NULL
    OR ai_lead_analysis_status IN ('pending', 'processing', 'completed', 'failed', 'skipped')
  );

ALTER TABLE support_requests DROP CONSTRAINT IF EXISTS support_requests_ai_urgency_chk;
ALTER TABLE support_requests ADD CONSTRAINT support_requests_ai_urgency_chk
  CHECK (ai_urgency IS NULL OR ai_urgency IN ('low', 'medium', 'high', 'unknown'));

ALTER TABLE support_requests DROP CONSTRAINT IF EXISTS support_requests_ai_budget_signal_chk;
ALTER TABLE support_requests ADD CONSTRAINT support_requests_ai_budget_signal_chk
  CHECK (ai_budget_signal IS NULL OR ai_budget_signal IN ('low', 'medium', 'high', 'unknown'));

ALTER TABLE support_requests DROP CONSTRAINT IF EXISTS support_requests_ai_lead_temperature_chk;
ALTER TABLE support_requests ADD CONSTRAINT support_requests_ai_lead_temperature_chk
  CHECK (
    ai_lead_temperature IS NULL
    OR ai_lead_temperature IN ('cold', 'warm', 'hot', 'unknown')
  );

COMMENT ON COLUMN support_requests.ai_lead_analysis_status IS 'AI pipeline: pending after public insert, then processing/completed/failed/skipped.';
COMMENT ON COLUMN support_requests.ai_error_message IS 'Internal-only failure detail; not shown to public users.';

CREATE INDEX IF NOT EXISTS support_requests_ai_lead_temperature_idx
  ON support_requests (ai_lead_temperature)
  WHERE client_id IS NULL;

CREATE INDEX IF NOT EXISTS support_requests_ai_lead_analysis_pending_idx
  ON support_requests (ai_lead_analysis_status, created_at)
  WHERE client_id IS NULL AND ai_lead_analysis_status = 'pending';
