-- Run this in Supabase SQL Editor to check your database setup
-- This will show you what's missing

-- Check if profiles table exists and its columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if your profile exists
SELECT id, role, display_name, is_admin FROM profiles LIMIT 5;

-- Check RLS policies on profiles
SELECT polname FROM pg_policy WHERE polrelid = 'public.profiles'::regclass;
