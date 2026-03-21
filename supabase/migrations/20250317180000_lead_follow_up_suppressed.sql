-- Per-lead opt-out for automated booking follow-up emails (public consultation rows only).

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS lead_follow_up_suppressed boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN support_requests.lead_follow_up_suppressed IS 'When true, batch/cron follow-up skips this row (admin can re-enable).';

CREATE INDEX IF NOT EXISTS support_requests_lead_follow_up_suppressed_idx
  ON support_requests (lead_follow_up_suppressed)
  WHERE client_id IS NULL AND lead_follow_up_suppressed = true;
