-- Add approval workflow for taskers and tasks

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved' CHECK (approval_status IN ('pending', 'approved', 'declined')),
  ADD COLUMN IF NOT EXISTS approval_note TEXT;

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'declined')),
  ADD COLUMN IF NOT EXISTS approval_note TEXT;

UPDATE public.tasks
SET approval_status = 'approved'
WHERE approval_status = 'pending';

-- Update public task visibility to require approval or ownership
DROP POLICY IF EXISTS "tasks public read open" ON public.tasks;
CREATE POLICY "tasks public read open"
ON public.tasks FOR SELECT
TO anon, authenticated
USING (
  (status <> 'closed' AND approval_status = 'approved')
  OR owner_id = auth.uid()
);

-- Ensure task photos follow task visibility rules
DROP POLICY IF EXISTS "task_photos read if task visible" ON public.task_photos;
CREATE POLICY "task_photos read if task visible"
ON public.task_photos FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.tasks t
    WHERE t.id = task_id
      AND ((t.status <> 'closed' AND t.approval_status = 'approved') OR t.owner_id = auth.uid())
  )
);
