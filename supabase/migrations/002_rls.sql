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
