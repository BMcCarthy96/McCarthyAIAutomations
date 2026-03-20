-- Per-client monthly impact email preference
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS monthly_report_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN clients.monthly_report_enabled IS 'Controls whether automated/manual monthly impact report emails are sent for this client.';
