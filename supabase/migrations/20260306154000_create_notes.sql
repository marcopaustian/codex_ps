create extension if not exists pgcrypto;

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  content text not null default '',
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists notes_user_id_inserted_at_idx
  on public.notes (user_id, inserted_at desc);

create or replace function public.handle_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_notes_updated_at on public.notes;
create trigger set_notes_updated_at
before update on public.notes
for each row
execute function public.handle_notes_updated_at();

alter table public.notes enable row level security;

create policy "Users can read own notes"
on public.notes
for select
using (auth.uid() = user_id);

create policy "Users can insert own notes"
on public.notes
for insert
with check (auth.uid() = user_id);

create policy "Users can update own notes"
on public.notes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own notes"
on public.notes
for delete
using (auth.uid() = user_id);

grant select, insert, update, delete on public.notes to authenticated;
