-- 001_init.sql
-- Basic schema for TILERS HUB (V1)

create extension if not exists "pgcrypto";

-- Profiles (one-to-one with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('homeowner','tiler')),
  display_name text,
  district text,
  city text,
  created_at timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  location_text text,
  budget_min numeric,
  budget_max numeric,
  status text not null default 'open' check (status in ('open','awarded','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

-- Task photos (storage paths)
create table if not exists public.task_photos (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  storage_path text not null,
  created_at timestamptz not null default now()
);

-- Bids
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  tiler_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  message text,
  status text not null default 'active' check (status in ('active','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now()
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  homeowner_id uuid not null references public.profiles(id) on delete cascade,
  tiler_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (task_id, homeowner_id, tiler_id)
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  text text,
  attachment_path text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_created_at on public.tasks(created_at desc);
create index if not exists idx_bids_task_id on public.bids(task_id);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
-- 002_rls.sql
-- Row Level Security (RLS) policies for V1
-- NOTE: Adjust as your product evolves.

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.task_photos enable row level security;
alter table public.bids enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- PROFILES
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "profiles upsert self" on public.profiles;
create policy "profiles upsert self"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- TASKS
drop policy if exists "tasks public read open" on public.tasks;
create policy "tasks public read open"
on public.tasks for select
to anon, authenticated
using (status <> 'closed');

drop policy if exists "tasks insert owner" on public.tasks;
create policy "tasks insert owner"
on public.tasks for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "tasks update owner" on public.tasks;
create policy "tasks update owner"
on public.tasks for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists "tasks delete owner" on public.tasks;
create policy "tasks delete owner"
on public.tasks for delete
to authenticated
using (owner_id = auth.uid());

-- TASK PHOTOS (only owner can write; anyone can read if task is visible)
drop policy if exists "task_photos read if task visible" on public.task_photos;
create policy "task_photos read if task visible"
on public.task_photos for select
to anon, authenticated
using (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and t.status <> 'closed'
  )
);

drop policy if exists "task_photos insert owner" on public.task_photos;
create policy "task_photos insert owner"
on public.task_photos for insert
to authenticated
with check (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and t.owner_id = auth.uid()
  )
);

drop policy if exists "task_photos delete owner" on public.task_photos;
create policy "task_photos delete owner"
on public.task_photos for delete
to authenticated
using (
  exists (
    select 1 from public.tasks t
    where t.id = task_id and t.owner_id = auth.uid()
  )
);

-- BIDS
-- Anyone can read bids only if:
--   - they are the task owner OR
--   - they are the tiler who placed that bid
drop policy if exists "bids read owner or self" on public.bids;
create policy "bids read owner or self"
on public.bids for select
to authenticated
using (
  tiler_id = auth.uid()
  OR exists (
    select 1 from public.tasks t
    where t.id = task_id and t.owner_id = auth.uid()
  )
);

drop policy if exists "bids insert tiler" on public.bids;
create policy "bids insert tiler"
on public.bids for insert
to authenticated
with check (tiler_id = auth.uid());

drop policy if exists "bids update tiler own bid" on public.bids;
create policy "bids update tiler own bid"
on public.bids for update
to authenticated
using (tiler_id = auth.uid())
with check (tiler_id = auth.uid());

drop policy if exists "bids update owner accept" on public.bids;
create policy "bids update owner accept"
on public.bids for update
to authenticated
using (
  exists (select 1 from public.tasks t where t.id = task_id and t.owner_id = auth.uid())
)
with check (
  exists (select 1 from public.tasks t where t.id = task_id and t.owner_id = auth.uid())
);

-- CONVERSATIONS (participants only)
drop policy if exists "conversations read participants" on public.conversations;
create policy "conversations read participants"
on public.conversations for select
to authenticated
using (homeowner_id = auth.uid() OR tiler_id = auth.uid());

drop policy if exists "conversations insert homeowner (owner of task)" on public.conversations;
create policy "conversations insert homeowner (owner of task)"
on public.conversations for insert
to authenticated
with check (
  homeowner_id = auth.uid()
  AND exists (select 1 from public.tasks t where t.id = task_id and t.owner_id = auth.uid())
);

-- MESSAGES (participants only)
drop policy if exists "messages read participants" on public.messages;
create policy "messages read participants"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.homeowner_id = auth.uid() OR c.tiler_id = auth.uid())
  )
);

drop policy if exists "messages insert participants" on public.messages;
create policy "messages insert participants"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  AND exists (
    select 1 from public.conversations c
    where c.id = conversation_id and (c.homeowner_id = auth.uid() OR c.tiler_id = auth.uid())
  )
);
/*
  # Profile Improvements and Certifications

  ## Summary
  Adds comprehensive profile features for tilers including bio, certifications,
  and improved identification details.

  ## Modified Tables
  - `profiles`: Add bio/description field for tiler profiles

  ## New Tables
  - `certifications`: Store tiler certifications and qualifications
    - `id` (uuid, primary key)
    - `tiler_id` (uuid, references profiles)
    - `title` (text: certification name)
    - `issuer` (text: issuing organization)
    - `issue_date` (date: when issued)
    - `expiry_date` (date, nullable: expiration date)
    - `certificate_number` (text, nullable: certificate ID)
    - `image_path` (text, nullable: storage path for certificate image)
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on `certifications` table
  - Add policies for certifications (read: public for tilers, write: only own certifications)

  ## Indexes
  - Add index on certifications(tiler_id) for faster queries
*/

-- Add bio field to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN bio text;
  END IF;
END $$;

-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tiler_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date,
  certificate_number text,
  image_path text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_certifications_tiler_id ON public.certifications(tiler_id);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Certifications policies
DROP POLICY IF EXISTS "certifications public read" ON public.certifications;
CREATE POLICY "certifications public read"
ON public.certifications FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = tiler_id AND p.role = 'tiler'
  )
);

DROP POLICY IF EXISTS "certifications insert own" ON public.certifications;
CREATE POLICY "certifications insert own"
ON public.certifications FOR INSERT
TO authenticated
WITH CHECK (tiler_id = auth.uid());

DROP POLICY IF EXISTS "certifications update own" ON public.certifications;
CREATE POLICY "certifications update own"
ON public.certifications FOR UPDATE
TO authenticated
USING (tiler_id = auth.uid())
WITH CHECK (tiler_id = auth.uid());

DROP POLICY IF EXISTS "certifications delete own" ON public.certifications;
CREATE POLICY "certifications delete own"
ON public.certifications FOR DELETE
TO authenticated
USING (tiler_id = auth.uid());/*
  # Tiler Services Table

  ## Summary
  Creates a dedicated table for tiler service offerings with detailed information
  including service type, area, tile specifications, pricing, and images.

  ## New Tables
  - `tiler_services`: Store detailed service offerings from tilers
    - `id` (uuid, primary key)
    - `tiler_id` (uuid, references profiles)
    - `service_name` (text: e.g., "Tiling", "Bathroom Tiling")
    - `area_type` (text: e.g., "Ground Floor", "Bathroom", "Kitchen")
    - `tile_size` (text: e.g., "2x2", "600x600mm")
    - `unit` (text: e.g., "square foot", "per job")
    - `price` (numeric: price in LKR)
    - `description` (text, nullable: additional details)
    - `image_path` (text, nullable: storage path for service image)
    - `is_active` (boolean: whether service is currently offered)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on `tiler_services` table
  - Public can read active services from tiler profiles
  - Tilers can manage their own services

  ## Indexes
  - Add index on tiler_services(tiler_id) for faster queries
  - Add index on tiler_services(is_active) for filtering
*/

-- Create tiler_services table
CREATE TABLE IF NOT EXISTS public.tiler_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tiler_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  area_type text,
  tile_size text,
  unit text NOT NULL DEFAULT 'square foot',
  price numeric NOT NULL,
  description text,
  image_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tiler_services_tiler_id ON public.tiler_services(tiler_id);
CREATE INDEX IF NOT EXISTS idx_tiler_services_is_active ON public.tiler_services(is_active);

-- Enable RLS
ALTER TABLE public.tiler_services ENABLE ROW LEVEL SECURITY;

-- Public can read active services from tilers
DROP POLICY IF EXISTS "tiler_services public read active" ON public.tiler_services;
CREATE POLICY "tiler_services public read active"
ON public.tiler_services FOR SELECT
TO anon, authenticated
USING (
  is_active = true AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = tiler_id AND p.role = 'tiler'
  )
);

-- Tilers can insert their own services
DROP POLICY IF EXISTS "tiler_services insert own" ON public.tiler_services;
CREATE POLICY "tiler_services insert own"
ON public.tiler_services FOR INSERT
TO authenticated
WITH CHECK (
  tiler_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'tiler'
  )
);

-- Tilers can update their own services
DROP POLICY IF EXISTS "tiler_services update own" ON public.tiler_services;
CREATE POLICY "tiler_services update own"
ON public.tiler_services FOR UPDATE
TO authenticated
USING (tiler_id = auth.uid())
WITH CHECK (tiler_id = auth.uid());

-- Tilers can delete their own services
DROP POLICY IF EXISTS "tiler_services delete own" ON public.tiler_services;
CREATE POLICY "tiler_services delete own"
ON public.tiler_services FOR DELETE
TO authenticated
USING (tiler_id = auth.uid());-- 006_task_sections.sql
-- Add task_sections table for storing detailed service information per task

create table if not exists public.task_sections (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  section_type text not null,
  title text not null,
  data jsonb not null default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_task_sections_task_id on public.task_sections(task_id);

-- RLS policies for task_sections
alter table public.task_sections enable row level security;

-- Anyone can read task sections (for viewing task details)
create policy "Anyone can view task sections"
  on public.task_sections for select
  using (true);

-- Only the task owner can insert sections
create policy "Task owners can insert sections"
  on public.task_sections for insert
  with check (
    exists (
      select 1 from public.tasks
      where tasks.id = task_sections.task_id
      and tasks.owner_id = auth.uid()
    )
  );

-- Only the task owner can update sections
create policy "Task owners can update sections"
  on public.task_sections for update
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = task_sections.task_id
      and tasks.owner_id = auth.uid()
    )
  );

-- Only the task owner can delete sections
create policy "Task owners can delete sections"
  on public.task_sections for delete
  using (
    exists (
      select 1 from public.tasks
      where tasks.id = task_sections.task_id
      and tasks.owner_id = auth.uid()
    )
  );
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
CREATE POLICY "Portfolio items are viewable by everyone"
  ON tiler_portfolio FOR SELECT
  USING (true);

CREATE POLICY "Tilers can insert their own portfolio items"
  ON tiler_portfolio FOR INSERT
  WITH CHECK (auth.uid() = tiler_id);

CREATE POLICY "Tilers can update their own portfolio items"
  ON tiler_portfolio FOR UPDATE
  USING (auth.uid() = tiler_id);

CREATE POLICY "Tilers can delete their own portfolio items"
  ON tiler_portfolio FOR DELETE
  USING (auth.uid() = tiler_id);
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
-- Admin Dashboard Tables
-- Run this migration in your Supabase SQL Editor

-- Add is_admin flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name, created_at)
  VALUES (
    NEW.id,
    'homeowner',
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (id, role, display_name, created_at)
SELECT 
  u.id,
  'homeowner',
  COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1)),
  COALESCE(u.created_at, NOW())
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tips',
  read_time TEXT DEFAULT '5 min read',
  cover_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guides Table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'book',
  steps JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS guides_updated_at ON public.guides;
CREATE TRIGGER guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;
CREATE POLICY "blog_posts_public_read"
ON public.blog_posts FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "blog_posts_admin_all" ON public.blog_posts;
CREATE POLICY "blog_posts_admin_all"
ON public.blog_posts FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Guides Policies
DROP POLICY IF EXISTS "guides_public_read" ON public.guides;
CREATE POLICY "guides_public_read"
ON public.guides FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "guides_admin_all" ON public.guides;
CREATE POLICY "guides_admin_all"
ON public.guides FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_published ON public.guides(is_published);

-- Function to check if current user is admin (SECURITY DEFINER bypasses RLS to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
DECLARE
  admin_status BOOLEAN;
BEGIN
  SELECT is_admin INTO admin_status
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(admin_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Admin profile policies (allow admins to read and update any profile)
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;
CREATE POLICY "profiles_admin_select"
ON public.profiles FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR
  public.is_current_user_admin()
);

DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
CREATE POLICY "profiles_admin_update"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  id = auth.uid() OR
  public.is_current_user_admin()
)
WITH CHECK (
  id = auth.uid() OR
  public.is_current_user_admin()
);

-- SECURITY: Trigger to prevent privilege escalation
-- Only existing admins or service-role (for bootstrapping) can modify the is_admin field
CREATE OR REPLACE FUNCTION protect_is_admin()
RETURNS TRIGGER AS $$
DECLARE
  current_user_is_admin BOOLEAN;
BEGIN
  -- Check if the is_admin field is being changed
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    -- Allow service-role operations (auth.uid() is NULL)
    -- This enables bootstrapping the first admin via SQL editor
    IF auth.uid() IS NULL THEN
      RETURN NEW;
    END IF;
    
    -- Get current user's admin status
    SELECT is_admin INTO current_user_is_admin
    FROM public.profiles
    WHERE id = auth.uid();
    
    -- Only admins can change is_admin field
    IF current_user_is_admin IS NOT TRUE THEN
      RAISE EXCEPTION 'Only admins can modify admin status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protect_is_admin_trigger ON public.profiles;
CREATE TRIGGER protect_is_admin_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_is_admin();

-- Admin task policies (allow admins to manage all tasks)
DROP POLICY IF EXISTS "tasks_admin_select" ON public.tasks;
CREATE POLICY "tasks_admin_select"
ON public.tasks FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() OR
  public.is_current_user_admin()
);

DROP POLICY IF EXISTS "tasks_admin_update" ON public.tasks;
CREATE POLICY "tasks_admin_update"
ON public.tasks FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid() OR
  public.is_current_user_admin()
)
WITH CHECK (
  owner_id = auth.uid() OR
  public.is_current_user_admin()
);

DROP POLICY IF EXISTS "tasks_admin_delete" ON public.tasks;
CREATE POLICY "tasks_admin_delete"
ON public.tasks FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid() OR
  public.is_current_user_admin()
);
