-- COMPLETE FIX FOR TILERS HUB
-- Run this ENTIRE script in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- This will fix ALL RLS and profile issues

-- ============================================
-- STEP 1: Disable RLS temporarily to fix data
-- ============================================
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE tiler_portfolio DISABLE ROW LEVEL SECURITY;
ALTER TABLE certifications DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Drop ALL existing policies
-- ============================================
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname, tablename FROM pg_policies 
               WHERE schemaname = 'public' 
               AND tablename IN ('profiles', 'tiler_portfolio', 'certifications')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- ============================================
-- STEP 3: Ensure all required columns exist
-- ============================================

-- Profiles table columns
DO $$
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'avatar_path') THEN
        ALTER TABLE profiles ADD COLUMN avatar_path TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'cover_path') THEN
        ALTER TABLE profiles ADD COLUMN cover_path TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'whatsapp') THEN
        ALTER TABLE profiles ADD COLUMN whatsapp TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'nic_no') THEN
        ALTER TABLE profiles ADD COLUMN nic_no TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
        ALTER TABLE profiles ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'district') THEN
        ALTER TABLE profiles ADD COLUMN district TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city') THEN
        ALTER TABLE profiles ADD COLUMN city TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'service_rates') THEN
        ALTER TABLE profiles ADD COLUMN service_rates JSONB DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'availability_status') THEN
        ALTER TABLE profiles ADD COLUMN availability_status TEXT DEFAULT 'available';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'working_districts') THEN
        ALTER TABLE profiles ADD COLUMN working_districts TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'years_experience') THEN
        ALTER TABLE profiles ADD COLUMN years_experience INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verified') THEN
        ALTER TABLE profiles ADD COLUMN verified BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- tiler_portfolio table columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'title') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN title TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'description') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'service_type') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN service_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'location') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN location TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'completed_date') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN completed_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'before_image_path') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN before_image_path TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tiler_portfolio' AND column_name = 'is_featured') THEN
        ALTER TABLE tiler_portfolio ADD COLUMN is_featured BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================
-- STEP 4: Create/Update auto-profile trigger
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'homeowner')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STEP 5: Create profiles for existing users without one
-- ============================================
INSERT INTO profiles (id, email, full_name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', ''),
  'homeowner'
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 6: Fix any bad cover_path data
-- ============================================
UPDATE profiles SET cover_path = NULL WHERE cover_path IS NOT NULL AND cover_path NOT LIKE '%/%';

-- ============================================
-- STEP 7: Re-enable RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiler_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 8: Create SIMPLE, PERMISSIVE policies
-- ============================================

-- PROFILES policies
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- TILER_PORTFOLIO policies
CREATE POLICY "portfolio_select_all" ON tiler_portfolio FOR SELECT USING (true);
CREATE POLICY "portfolio_insert_own" ON tiler_portfolio FOR INSERT WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "portfolio_update_own" ON tiler_portfolio FOR UPDATE USING (auth.uid() = tiler_id) WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "portfolio_delete_own" ON tiler_portfolio FOR DELETE USING (auth.uid() = tiler_id);

-- CERTIFICATIONS policies
CREATE POLICY "certs_select_all" ON certifications FOR SELECT USING (true);
CREATE POLICY "certs_insert_own" ON certifications FOR INSERT WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "certs_update_own" ON certifications FOR UPDATE USING (auth.uid() = tiler_id) WITH CHECK (auth.uid() = tiler_id);
CREATE POLICY "certs_delete_own" ON certifications FOR DELETE USING (auth.uid() = tiler_id);

-- ============================================
-- STEP 9: Grant permissions
-- ============================================
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON tiler_portfolio TO authenticated;
GRANT ALL ON certifications TO authenticated;
GRANT SELECT ON profiles TO anon;
GRANT SELECT ON tiler_portfolio TO anon;
GRANT SELECT ON certifications TO anon;

-- ============================================
-- DONE! Verify with:
-- ============================================
SELECT 'Policies created:' as status, count(*) as count 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'tiler_portfolio', 'certifications');
