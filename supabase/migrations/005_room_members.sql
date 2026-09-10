create table if not exists public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('host', 'member')),
  mode text not null default 'viewer' check (mode in ('viewer', 'participant')),
  joined_at timestamptz not null default timezone('utc', now()),
  left_at timestamptz,
  unique (room_id, user_id)
);

alter table public.room_members enable row level security;

create policy "Users can read their own room memberships"
  on public.room_members
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can join rooms as themselves"
  on public.room_members
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own room memberships"
  on public.room_members
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on table public.room_members to authenticated;
