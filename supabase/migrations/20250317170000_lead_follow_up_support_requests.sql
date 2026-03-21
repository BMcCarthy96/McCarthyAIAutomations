-- Lead follow-up automation for public consultation (marketing contact form).
-- Client portal support requests keep defaults (eligible false, no follow-up sent).

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS lead_follow_up_eligible boolean NOT NULL DEFAULT false;

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS follow_up_sent_at timestamptz NULL;

COMMENT ON COLUMN support_requests.lead_follow_up_eligible IS 'True when a public consultation submission should receive the delayed booking follow-up email.';
COMMENT ON COLUMN support_requests.follow_up_sent_at IS 'When the lead follow-up email was sent; null if not sent yet.';

CREATE INDEX IF NOT EXISTS support_requests_lead_follow_up_pending_idx
  ON support_requests (lead_follow_up_eligible, follow_up_sent_at)
  WHERE client_id IS NULL AND lead_follow_up_eligible = true AND follow_up_sent_at IS NULL;
