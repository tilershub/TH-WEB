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
USING (tiler_id = auth.uid());