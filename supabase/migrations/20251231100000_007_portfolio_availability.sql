-- Add new fields to profiles for availability and verification
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS working_districts TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS completed_jobs INTEGER DEFAULT 0;

-- Create portfolio table for work samples
CREATE TABLE IF NOT EXISTS tiler_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tiler_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT,
  image_path TEXT NOT NULL,
  before_image_path TEXT,
  location TEXT,
  completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create index for faster portfolio queries
CREATE INDEX IF NOT EXISTS idx_portfolio_tiler ON tiler_portfolio(tiler_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON tiler_portfolio(tiler_id, is_featured);

-- Enable RLS on portfolio
ALTER TABLE tiler_portfolio ENABLE ROW LEVEL SECURITY;

-- Portfolio policies
DROP POLICY IF EXISTS "Portfolio items are viewable by everyone" ON tiler_portfolio;
CREATE POLICY "Portfolio items are viewable by everyone"
  ON tiler_portfolio FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tilers can insert their own portfolio items" ON tiler_portfolio;
CREATE POLICY "Tilers can insert their own portfolio items"
  ON tiler_portfolio FOR INSERT
  WITH CHECK (auth.uid() = tiler_id);

DROP POLICY IF EXISTS "Tilers can update their own portfolio items" ON tiler_portfolio;
CREATE POLICY "Tilers can update their own portfolio items"
  ON tiler_portfolio FOR UPDATE
  USING (auth.uid() = tiler_id);

DROP POLICY IF EXISTS "Tilers can delete their own portfolio items" ON tiler_portfolio;
CREATE POLICY "Tilers can delete their own portfolio items"
  ON tiler_portfolio FOR DELETE
  USING (auth.uid() = tiler_id);
