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
