-- Run this in Supabase SQL Editor to add missing columns
-- This will NOT delete any existing data

-- Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_path TEXT,
ADD COLUMN IF NOT EXISTS cover_path TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS nic_no TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS working_districts TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available',
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add tiler_portfolio table if missing
CREATE TABLE IF NOT EXISTS tiler_portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tiler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on tiler_portfolio
ALTER TABLE tiler_portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (drop first to avoid duplicates)
DROP POLICY IF EXISTS "profiles read" ON profiles;
DROP POLICY IF EXISTS "profiles update self" ON profiles;

CREATE POLICY "profiles read" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update self" ON profiles FOR UPDATE TO authenticated 
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Create RLS policies for tiler_portfolio
DROP POLICY IF EXISTS "portfolio read" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio insert" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio delete" ON tiler_portfolio;

CREATE POLICY "portfolio read" ON tiler_portfolio FOR SELECT TO authenticated USING (true);
CREATE POLICY "portfolio insert" ON tiler_portfolio FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "portfolio delete" ON tiler_portfolio FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- Create RLS policies for certifications
DROP POLICY IF EXISTS "certifications read" ON certifications;
DROP POLICY IF EXISTS "certifications insert" ON certifications;
DROP POLICY IF EXISTS "certifications update" ON certifications;
DROP POLICY IF EXISTS "certifications delete" ON certifications;

CREATE POLICY "certifications read" ON certifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "certifications insert" ON certifications FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "certifications update" ON certifications FOR UPDATE TO authenticated USING (tiler_id = auth.uid());
CREATE POLICY "certifications delete" ON certifications FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- Create RLS policies for tiler_services
DROP POLICY IF EXISTS "tiler_services read" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services insert" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services update" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services delete" ON tiler_services;

CREATE POLICY "tiler_services read" ON tiler_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "tiler_services insert" ON tiler_services FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "tiler_services update" ON tiler_services FOR UPDATE TO authenticated USING (tiler_id = auth.uid());
CREATE POLICY "tiler_services delete" ON tiler_services FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- Done! You should see "Success. No rows returned" message
