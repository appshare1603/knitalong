alter table public.profiles
  add column if not exists instagram_handle text;

alter table public.profiles
  drop constraint if exists profiles_instagram_handle_format;

alter table public.profiles
  add constraint profiles_instagram_handle_format
  check (instagram_handle is null or instagram_handle ~ '^[A-Za-z0-9._]{1,30}$');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_handle text;
begin
  requested_handle := nullif(regexp_replace(trim(coalesce(new.raw_user_meta_data ->> 'instagram_handle', '')), '^@', ''), '');

  insert into public.profiles (id, display_name, age_confirmed, language, instagram_handle)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'KnitAlong Nutzer'),
    coalesce((new.raw_user_meta_data ->> 'age_confirmed')::boolean, false),
    coalesce(nullif(new.raw_user_meta_data ->> 'language', ''), 'de'),
    requested_handle
  );
  return new;
end;
$$;
