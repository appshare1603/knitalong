create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(trim(title)) between 1 and 80),
  description text not null default '',
  host_id uuid references public.profiles (id) on delete set null,
  visibility text not null default 'public' check (visibility in ('public', 'private', 'invite_only', 'password')),
  max_participants integer not null default 20 check (max_participants between 2 and 20),
  max_active_video integer not null default 6 check (max_active_video between 0 and 6),
  is_active boolean not null default true,
  accent text not null default 'sage' check (accent in ('sage', 'coral', 'ochre')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.rooms enable row level security;

create policy "Public active rooms are visible"
  on public.rooms
  for select
  to anon, authenticated
  using (is_active = true and visibility = 'public');

create policy "Hosts can create rooms"
  on public.rooms
  for insert
  to authenticated
  with check ((select auth.uid()) = host_id);

create policy "Hosts can update their rooms"
  on public.rooms
  for update
  to authenticated
  using ((select auth.uid()) = host_id)
  with check ((select auth.uid()) = host_id);

create or replace function public.set_rooms_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists rooms_set_updated_at on public.rooms;
create trigger rooms_set_updated_at
before update on public.rooms
for each row execute procedure public.set_rooms_updated_at();

insert into public.rooms (slug, title, description, visibility, max_participants, max_active_video, accent)
values
  ('leise-maschen', 'Leise Maschen am Abend', 'Gemeinsam stricken, wenig reden', 'public', 20, 6, 'sage'),
  ('sockenrunde', 'Sockenrunde', 'Ferse, Spitze und gute Gesellschaft', 'public', 20, 6, 'coral'),
  ('wollcafe-nord', 'Wollcafe Nord', 'Freies Projekt · Anfänger willkommen', 'public', 20, 6, 'ochre')
on conflict (slug) do nothing;
