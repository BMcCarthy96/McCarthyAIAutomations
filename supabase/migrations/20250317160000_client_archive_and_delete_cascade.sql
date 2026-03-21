-- Client archive flag (safe cleanup: hide from portal & monthly emails without deleting).
-- Atomic delete of a client and all related rows (explicit order for FK safety).

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN clients.is_archived IS 'When true, client is hidden from portal resolution and monthly report batch; admin can unarchive.';

CREATE INDEX IF NOT EXISTS idx_clients_is_archived ON clients (is_archived) WHERE is_archived = true;

-- Deletes one client and dependent rows in a fixed order (project children → projects → engagements → support → billing → client).
CREATE OR REPLACE FUNCTION public.delete_client_cascade(p_client_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM automation_events
  WHERE project_id IN (
    SELECT p.id
    FROM projects p
    INNER JOIN client_services cs ON cs.id = p.client_service_id
    WHERE cs.client_id = p_client_id
  );

  DELETE FROM project_metrics
  WHERE project_id IN (
    SELECT p.id
    FROM projects p
    INNER JOIN client_services cs ON cs.id = p.client_service_id
    WHERE cs.client_id = p_client_id
  );

  DELETE FROM milestones
  WHERE project_id IN (
    SELECT p.id
    FROM projects p
    INNER JOIN client_services cs ON cs.id = p.client_service_id
    WHERE cs.client_id = p_client_id
  );

  DELETE FROM project_updates
  WHERE project_id IN (
    SELECT p.id
    FROM projects p
    INNER JOIN client_services cs ON cs.id = p.client_service_id
    WHERE cs.client_id = p_client_id
  );

  DELETE FROM projects
  WHERE id IN (
    SELECT p.id
    FROM projects p
    INNER JOIN client_services cs ON cs.id = p.client_service_id
    WHERE cs.client_id = p_client_id
  );

  DELETE FROM client_services WHERE client_id = p_client_id;

  DELETE FROM support_replies
  WHERE support_request_id IN (
    SELECT id FROM support_requests WHERE client_id = p_client_id
  );

  DELETE FROM support_requests WHERE client_id = p_client_id;

  DELETE FROM billing_records WHERE client_id = p_client_id;

  DELETE FROM clients WHERE id = p_client_id;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_client_cascade(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_client_cascade(uuid) TO service_role;
