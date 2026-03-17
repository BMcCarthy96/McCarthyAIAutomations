-- Optional: seed a few demo automation events for existing projects.
-- Run this in the Supabase SQL Editor after create-automation-events-table.sql.
-- Inserts 2 events per project for up to 5 projects (oldest projects first).

INSERT INTO public.automation_events (project_id, event_type, description, created_at)
SELECT p.id, 'update_posted', 'Project kickoff completed and first workflow configured.', now() - interval '2 days'
FROM public.projects p
ORDER BY p.created_at ASC NULLS LAST
LIMIT 5;

INSERT INTO public.automation_events (project_id, event_type, description, created_at)
SELECT p.id, 'milestone_completed', 'Phase 1 setup milestone completed successfully.', now() - interval '1 day'
FROM public.projects p
ORDER BY p.created_at ASC NULLS LAST
LIMIT 5;
