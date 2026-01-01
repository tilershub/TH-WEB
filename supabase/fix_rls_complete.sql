-- COMPLETE RLS FIX - Run this in Supabase SQL Editor
-- This adds ALL necessary policies for the app to work

-- ============================================
-- PROFILES TABLE - Full policy setup
-- ============================================
DROP POLICY IF EXISTS "profiles read" ON profiles;
DROP POLICY IF EXISTS "profiles insert self" ON profiles;
DROP POLICY IF EXISTS "profiles update self" ON profiles;
DROP POLICY IF EXISTS "profiles upsert self" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;

-- Allow all authenticated users to read any profile
CREATE POLICY "profiles read" ON profiles 
  FOR SELECT TO authenticated 
  USING (true);

-- Allow users to insert their own profile
CREATE POLICY "profiles insert self" ON profiles 
  FOR INSERT TO authenticated 
  WITH CHECK (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "profiles update self" ON profiles 
  FOR UPDATE TO authenticated 
  USING (id = auth.uid()) 
  WITH CHECK (id = auth.uid());

-- ============================================
-- TILER_SERVICES TABLE
-- ============================================
DROP POLICY IF EXISTS "tiler_services read" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services insert" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services update" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services delete" ON tiler_services;

CREATE POLICY "tiler_services read" ON tiler_services 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "tiler_services insert" ON tiler_services 
  FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "tiler_services update" ON tiler_services 
  FOR UPDATE TO authenticated USING (tiler_id = auth.uid());
CREATE POLICY "tiler_services delete" ON tiler_services 
  FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- ============================================
-- CERTIFICATIONS TABLE
-- ============================================
DROP POLICY IF EXISTS "certifications read" ON certifications;
DROP POLICY IF EXISTS "certifications insert" ON certifications;
DROP POLICY IF EXISTS "certifications update" ON certifications;
DROP POLICY IF EXISTS "certifications delete" ON certifications;

CREATE POLICY "certifications read" ON certifications 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "certifications insert" ON certifications 
  FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "certifications update" ON certifications 
  FOR UPDATE TO authenticated USING (tiler_id = auth.uid());
CREATE POLICY "certifications delete" ON certifications 
  FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- ============================================
-- TILER_PORTFOLIO TABLE
-- ============================================
DROP POLICY IF EXISTS "portfolio read" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio insert" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio update" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio delete" ON tiler_portfolio;

CREATE POLICY "portfolio read" ON tiler_portfolio 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "portfolio insert" ON tiler_portfolio 
  FOR INSERT TO authenticated WITH CHECK (tiler_id = auth.uid());
CREATE POLICY "portfolio update" ON tiler_portfolio 
  FOR UPDATE TO authenticated USING (tiler_id = auth.uid());
CREATE POLICY "portfolio delete" ON tiler_portfolio 
  FOR DELETE TO authenticated USING (tiler_id = auth.uid());

-- Done! You should see "Success. No rows returned"
