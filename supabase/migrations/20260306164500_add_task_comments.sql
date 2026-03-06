create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists task_comments_task_id_inserted_at_idx
  on public.task_comments (task_id, inserted_at asc);

create index if not exists task_comments_author_id_idx
  on public.task_comments (author_id);

drop trigger if exists set_task_comments_updated_at on public.task_comments;
create trigger set_task_comments_updated_at
before update on public.task_comments
for each row
execute function public.handle_updated_at();

alter table public.task_comments enable row level security;

create policy "Task comments readable by author or admin"
on public.task_comments
for select
using (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "Task comments insertable by author or admin"
on public.task_comments
for insert
with check (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "Task comments updateable by author or admin"
on public.task_comments
for update
using (auth.uid() = author_id or public.is_admin(auth.uid()))
with check (auth.uid() = author_id or public.is_admin(auth.uid()));

create policy "Task comments deletable by author or admin"
on public.task_comments
for delete
using (auth.uid() = author_id or public.is_admin(auth.uid()));

grant select, insert, update, delete on public.task_comments to authenticated;
