-- Admin Dashboard Tables
-- Run this migration in your Supabase SQL Editor

-- Add is_admin flag to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

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

-- Admin profile policy update (allow admins to update any profile for verification)
DROP POLICY IF EXISTS "profiles_admin_update" ON public.profiles;
CREATE POLICY "profiles_admin_update"
ON public.profiles FOR UPDATE
TO authenticated
USING (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);
