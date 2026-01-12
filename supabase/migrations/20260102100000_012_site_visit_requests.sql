-- Create site visit requests to allow taskers to request a visit before bidding
CREATE TABLE IF NOT EXISTS public.site_visit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  tasker_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  homeowner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Keep updated_at current
DROP TRIGGER IF EXISTS trg_site_visit_requests_updated_at ON public.site_visit_requests;
CREATE TRIGGER trg_site_visit_requests_updated_at
BEFORE UPDATE ON public.site_visit_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable RLS
ALTER TABLE public.site_visit_requests ENABLE ROW LEVEL SECURITY;

-- Taskers can insert their own site visit request
DROP POLICY IF EXISTS "Taskers can request site visits" ON public.site_visit_requests;
CREATE POLICY "Taskers can request site visits" ON public.site_visit_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = tasker_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'tasker'
    )
  );

-- Tasker and homeowner can view related requests
DROP POLICY IF EXISTS "Users can view related site visit requests" ON public.site_visit_requests;
CREATE POLICY "Users can view related site visit requests" ON public.site_visit_requests
  FOR SELECT
  USING (
    auth.uid() = tasker_id
    OR auth.uid() = homeowner_id
  );

-- Homeowners can update status on their tasks
DROP POLICY IF EXISTS "Homeowners can update site visit requests" ON public.site_visit_requests;
CREATE POLICY "Homeowners can update site visit requests" ON public.site_visit_requests
  FOR UPDATE
  USING (auth.uid() = homeowner_id);

-- Taskers can update their own request (e.g., withdraw)
DROP POLICY IF EXISTS "Taskers can update their own site visit requests" ON public.site_visit_requests;
CREATE POLICY "Taskers can update their own site visit requests" ON public.site_visit_requests
  FOR UPDATE
  USING (auth.uid() = tasker_id);
