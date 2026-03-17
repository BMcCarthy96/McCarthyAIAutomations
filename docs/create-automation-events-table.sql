-- Create public.automation_events for the client Automation Activity Feed.
-- Run this in the Supabase SQL Editor.
-- Requires: public.projects table with id (uuid).

CREATE TABLE IF NOT EXISTS public.automation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_automation_events_project_id ON public.automation_events (project_id);
CREATE INDEX IF NOT EXISTS idx_automation_events_created_at ON public.automation_events (created_at DESC);

ALTER TABLE public.automation_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on automation_events"
  ON public.automation_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
