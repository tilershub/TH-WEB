insert into storage.buckets (id, name, public)
values ('tasker-service-images', 'tasker-service-images', false)
on conflict (id) do nothing;

create policy "tasker_service_images_select" on storage.objects
for select using (bucket_id = 'tasker-service-images');

create policy "tasker_service_images_insert" on storage.objects
for insert with check (
  bucket_id = 'tasker-service-images'
  and auth.uid() = owner
);

create policy "tasker_service_images_update" on storage.objects
for update using (
  bucket_id = 'tasker-service-images'
  and auth.uid() = owner
);

create policy "tasker_service_images_delete" on storage.objects
for delete using (
  bucket_id = 'tasker-service-images'
  and auth.uid() = owner
);
