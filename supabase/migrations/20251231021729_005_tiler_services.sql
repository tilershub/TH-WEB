/*
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
USING (tiler_id = auth.uid());