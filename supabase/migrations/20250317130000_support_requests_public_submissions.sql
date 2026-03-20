-- Allow support requests from non-clients (public contact / free consultation).
-- Existing rows keep client_id set; public rows store requester_name + requester_email.

ALTER TABLE support_requests
  ALTER COLUMN client_id DROP NOT NULL;

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS requester_name text NULL,
  ADD COLUMN IF NOT EXISTS requester_email text NULL;

ALTER TABLE support_requests
  ADD CONSTRAINT support_requests_client_or_public_contact_chk
  CHECK (
    client_id IS NOT NULL
    OR (
      requester_name IS NOT NULL
      AND length(btrim(requester_name)) > 0
      AND requester_email IS NOT NULL
      AND length(btrim(requester_email)) > 0
    )
  );

COMMENT ON COLUMN support_requests.requester_name IS 'Contact name for public (non-client) submissions.';
COMMENT ON COLUMN support_requests.requester_email IS 'Contact email for public (non-client) submissions.';
