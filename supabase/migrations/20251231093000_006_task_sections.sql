-- 006_task_sections.sql
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
