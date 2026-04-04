-- Optional phone for public consultation / contact leads (Zapier Sheets "Phone" column).

ALTER TABLE support_requests
  ADD COLUMN IF NOT EXISTS requester_phone text NULL;

COMMENT ON COLUMN support_requests.requester_phone IS 'Optional phone from public contact form; null for client portal rows or when not provided.';
