-- Create profile rows automatically for new auth users

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
  role_value text;
  display_value text;
begin
  role_value := nullif(new.raw_user_meta_data->>'role', '');
  role_value := coalesce(role_value, 'homeowner');
  display_value := nullif(new.raw_user_meta_data->>'full_name', '');
  display_value := coalesce(display_value, split_part(new.email, '@', 1));

  insert into public.profiles (id, role, display_name)
  values (new.id, role_value, display_value)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
