-- Inquiries table for contact form submissions
create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz default now() not null
);

-- Index for filtering by status and ordering by date
create index idx_inquiries_status_created on public.inquiries (status, created_at desc);

-- RLS: no public access (only service role key via API route)
alter table public.inquiries enable row level security;
