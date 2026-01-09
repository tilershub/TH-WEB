alter table public.services enable row level security;
alter table public.sub_services enable row level security;
alter table public.tasker_sub_services enable row level security;

create policy "services_select_all" on public.services
for select using (true);

create policy "sub_services_select_all" on public.sub_services
for select using (true);

create policy "tasker_sub_services_select_active" on public.tasker_sub_services
for select using (is_active = true);

create policy "tasker_sub_services_insert_own" on public.tasker_sub_services
for insert with check (auth.uid() = tasker_id);

create policy "tasker_sub_services_update_own" on public.tasker_sub_services
for update using (auth.uid() = tasker_id);

create policy "tasker_sub_services_delete_own" on public.tasker_sub_services
for delete using (auth.uid() = tasker_id);
