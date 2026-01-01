-- Add missing columns to profiles table
-- Run this migration in your Supabase SQL Editor

-- Identity and contact fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS nic_no TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Image paths
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_path TEXT,
ADD COLUMN IF NOT EXISTS cover_path TEXT;

-- Service rates (JSON object storing rates for each service)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS service_rates JSONB DEFAULT '{}';

-- Profile completion flag
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON public.profiles(availability_status);
