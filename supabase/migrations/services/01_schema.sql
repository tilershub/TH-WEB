create extension if not exists "pgcrypto";

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sub_services (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  unit text not null check (unit in ('sq.ft','lin.ft','item','hour','day','fixed')),
  default_price numeric(12,2),
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique(service_id, name)
);

create table if not exists public.tasker_sub_services (
  id uuid primary key default gen_random_uuid(),
  tasker_id uuid not null,
  sub_service_id uuid not null references public.sub_services(id) on delete cascade,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'LKR',
  image_path text,
  note text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tasker_id, sub_service_id)
);

create index if not exists sub_services_service_id_idx on public.sub_services(service_id);
create index if not exists tasker_sub_services_tasker_id_idx on public.tasker_sub_services(tasker_id);
create index if not exists tasker_sub_services_sub_service_id_idx on public.tasker_sub_services(sub_service_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_tasker_sub_services_updated_at on public.tasker_sub_services;
create trigger set_tasker_sub_services_updated_at
before update on public.tasker_sub_services
for each row
execute function public.set_updated_at();
