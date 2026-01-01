-- COMPLETE DATABASE FIX - Run this in Supabase SQL Editor
-- This fixes all missing columns and policies

-- ============================================
-- 1. ADD ALL MISSING COLUMNS TO PROFILES
-- ============================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_path TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_path TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nic_no TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS working_districts TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS service_rates JSONB DEFAULT '{}';

-- ============================================
-- 2. FIX TILER_PORTFOLIO TABLE (add missing columns)
-- ============================================
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS service_type TEXT;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS completed_date DATE;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS before_image_path TEXT;
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Rename caption to image_path if needed (or add image_path)
ALTER TABLE tiler_portfolio ADD COLUMN IF NOT EXISTS image_path TEXT;

-- ============================================
-- 3. ENSURE RLS IS ENABLED ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiler_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiler_portfolio ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. DROP AND RECREATE ALL POLICIES (CLEAN SLATE)
-- ============================================

-- Profiles policies
DROP POLICY IF EXISTS "profiles read" ON profiles;
DROP POLICY IF EXISTS "profiles insert self" ON profiles;
DROP POLICY IF EXISTS "profiles update self" ON profiles;
DROP POLICY IF EXISTS "profiles upsert self" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Tiler services policies
DROP POLICY IF EXISTS "tiler_services read" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services insert" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services update" ON tiler_services;
DROP POLICY IF EXISTS "tiler_services delete" ON tiler_services;

CREATE POLICY "tiler_services_select" ON tiler_services FOR SELECT USING (true);
CREATE POLICY "tiler_services_insert" ON tiler_services FOR INSERT WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "tiler_services_update" ON tiler_services FOR UPDATE USING (auth.uid() = tiler_id);
CREATE POLICY "tiler_services_delete" ON tiler_services FOR DELETE USING (auth.uid() = tiler_id);

-- Certifications policies
DROP POLICY IF EXISTS "certifications read" ON certifications;
DROP POLICY IF EXISTS "certifications insert" ON certifications;
DROP POLICY IF EXISTS "certifications update" ON certifications;
DROP POLICY IF EXISTS "certifications delete" ON certifications;

CREATE POLICY "certifications_select" ON certifications FOR SELECT USING (true);
CREATE POLICY "certifications_insert" ON certifications FOR INSERT WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "certifications_update" ON certifications FOR UPDATE USING (auth.uid() = tiler_id);
CREATE POLICY "certifications_delete" ON certifications FOR DELETE USING (auth.uid() = tiler_id);

-- Portfolio policies
DROP POLICY IF EXISTS "portfolio read" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio insert" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio update" ON tiler_portfolio;
DROP POLICY IF EXISTS "portfolio delete" ON tiler_portfolio;
DROP POLICY IF EXISTS "tiler_portfolio_select" ON tiler_portfolio;
DROP POLICY IF EXISTS "tiler_portfolio_insert" ON tiler_portfolio;
DROP POLICY IF EXISTS "tiler_portfolio_update" ON tiler_portfolio;
DROP POLICY IF EXISTS "tiler_portfolio_delete" ON tiler_portfolio;

CREATE POLICY "tiler_portfolio_select" ON tiler_portfolio FOR SELECT USING (true);
CREATE POLICY "tiler_portfolio_insert" ON tiler_portfolio FOR INSERT WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "tiler_portfolio_update" ON tiler_portfolio FOR UPDATE USING (auth.uid() = tiler_id);
CREATE POLICY "tiler_portfolio_delete" ON tiler_portfolio FOR DELETE USING (auth.uid() = tiler_id);

-- ============================================
-- 5. AUTO-CREATE PROFILE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. CREATE PROFILES FOR EXISTING USERS WHO DON'T HAVE ONE
-- ============================================
INSERT INTO public.profiles (id, display_name, role)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)),
  'tiler'
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DONE! You should see "Success. No rows returned"
-- ============================================
