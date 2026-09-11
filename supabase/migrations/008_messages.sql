create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null check (char_length(trim(content)) between 1 and 1000),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.messages enable row level security;

create policy "Active room members can read messages"
  on public.messages
  for select
  to authenticated
  using (exists (
    select 1 from public.room_members
    where room_members.room_id = messages.room_id
      and room_members.user_id = (select auth.uid())
      and room_members.left_at is null
  ));

create policy "Active room members can send messages"
  on public.messages
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.room_members
      where room_members.room_id = messages.room_id
        and room_members.user_id = (select auth.uid())
        and room_members.left_at is null
    )
  );

grant select, insert on table public.messages to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end
$$;
