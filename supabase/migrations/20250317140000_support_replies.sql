-- Admin (and future) threaded replies on support requests

CREATE TABLE support_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  support_request_id uuid NOT NULL REFERENCES support_requests (id) ON DELETE CASCADE,
  body text NOT NULL,
  sender_type text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT support_replies_sender_type_chk CHECK (sender_type IN ('admin'))
);

CREATE INDEX idx_support_replies_request_created
  ON support_replies (support_request_id, created_at ASC);

COMMENT ON TABLE support_replies IS 'Threaded messages on a support request; sender_type reserved for future client replies.';
