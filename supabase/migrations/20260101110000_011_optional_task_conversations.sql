-- Allow conversations without a task for direct messaging
ALTER TABLE public.conversations 
ALTER COLUMN task_id DROP NOT NULL;

-- Update unique constraint to handle null task_id
ALTER TABLE public.conversations
DROP CONSTRAINT IF EXISTS conversations_task_id_homeowner_id_tiler_id_key;

-- Create a unique index that works with nullable task_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique 
ON public.conversations (homeowner_id, tiler_id, COALESCE(task_id, '00000000-0000-0000-0000-000000000000'::uuid));
