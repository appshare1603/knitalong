alter table public.profiles
  add column if not exists role text not null default 'Visitor';

alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('Visitor', 'Admin'));

alter table public.profiles
  drop constraint if exists profiles_experience_level_check;
alter table public.profiles
  add constraint profiles_experience_level_check
  check (experience_level is null or experience_level in ('beginner', 'some_experience', 'experienced'));

create table if not exists public.private_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  first_name text check (first_name is null or char_length(trim(first_name)) <= 80),
  last_name text check (last_name is null or char_length(trim(last_name)) <= 80),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.private_profiles enable row level security;

drop policy if exists "Users can read their own private profile" on public.private_profiles;
create policy "Users can read their own private profile"
  on public.private_profiles for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own private profile" on public.private_profiles;
create policy "Users can create their own private profile"
  on public.private_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own private profile" on public.private_profiles;
create policy "Users can update their own private profile"
  on public.private_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.private_profiles to authenticated;

insert into public.private_profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Replace table-wide write grants so clients cannot assign or change roles.
revoke insert, update on table public.profiles from authenticated;
grant insert (id, display_name, age_confirmed, language, experience_level, preferred_techniques, avatar_url, instagram_handle)
  on public.profiles to authenticated;
grant update (display_name, language, experience_level, preferred_techniques, avatar_url, instagram_handle)
  on public.profiles to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload their own avatar" on storage.objects;
create policy "Users can upload their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users can delete their own avatar" on storage.objects;
create policy "Users can delete their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

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

  insert into public.private_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;
