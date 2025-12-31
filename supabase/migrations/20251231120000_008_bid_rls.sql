-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Tilers can insert bids" ON bids;

-- Create RLS policy to ensure only tilers can insert bids
CREATE POLICY "Tilers can insert bids" ON bids
  FOR INSERT
  WITH CHECK (
    auth.uid() = tiler_id
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'tiler'
    )
  );

-- Ensure RLS is enabled on bids table
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Policy for selecting bids (anyone can view bids on tasks they own or created)
DROP POLICY IF EXISTS "Users can view relevant bids" ON bids;
CREATE POLICY "Users can view relevant bids" ON bids
  FOR SELECT
  USING (
    -- Tiler can see their own bids
    auth.uid() = tiler_id
    OR
    -- Task owner can see bids on their tasks
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = bids.task_id
      AND tasks.owner_id = auth.uid()
    )
  );

-- Policy for updating bids (tiler can update their own, owner can accept)
DROP POLICY IF EXISTS "Users can update relevant bids" ON bids;
CREATE POLICY "Users can update relevant bids" ON bids
  FOR UPDATE
  USING (
    auth.uid() = tiler_id
    OR EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = bids.task_id
      AND tasks.owner_id = auth.uid()
    )
  );
