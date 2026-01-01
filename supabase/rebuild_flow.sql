-- REBUILD TILER FLOW - Run this in Supabase SQL Editor
-- This script fixes the signup → profile flow completely

-- ============================================
-- STEP 1: Drop and recreate the trigger function
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'homeowner'),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = COALESCE(EXCLUDED.role, profiles.role),
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STEP 2: Clean up legacy/invalid cover_path data
-- External URLs or invalid paths should be cleared
-- ============================================
UPDATE profiles 
SET cover_path = NULL 
WHERE cover_path IS NOT NULL 
AND (
  cover_path LIKE 'http%' 
  OR cover_path NOT LIKE '%/%'
  OR LENGTH(cover_path) < 10
);

UPDATE profiles 
SET avatar_path = NULL 
WHERE avatar_path IS NOT NULL 
AND (
  avatar_path LIKE 'http%' 
  OR avatar_path NOT LIKE '%/%'
  OR LENGTH(avatar_path) < 10
);

-- ============================================
-- STEP 3: Create profiles for any existing auth users without profiles
-- ============================================
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data ->> 'full_name', split_part(au.email, '@', 1)),
  COALESCE(au.raw_user_meta_data ->> 'role', 'homeowner'),
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 4: Verify RLS policies exist
-- ============================================
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles';
    
    IF policy_count = 0 THEN
        -- Create basic policies if none exist
        EXECUTE 'CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true)';
        EXECUTE 'CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id)';
        EXECUTE 'CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)';
        EXECUTE 'CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id)';
    END IF;
END $$;

-- ============================================
-- STEP 5: Ensure RLS is enabled
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiler_portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Output results
-- ============================================
SELECT 'Profiles cleaned' as action, 
       (SELECT COUNT(*) FROM profiles WHERE cover_path IS NULL) as profiles_with_null_cover;

SELECT 'Total profiles' as action, COUNT(*) as count FROM profiles;

SELECT 'Trigger recreated' as status, 'handle_new_user' as trigger_name;
