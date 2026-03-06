create type public.app_role as enum ('member', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role public.app_role not null default 'member',
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  stage text not null default 'idea' check (stage in ('idea', 'active', 'paused', 'done')),
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  details text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists projects_owner_id_inserted_at_idx
  on public.projects (owner_id, inserted_at desc);

create index if not exists tasks_project_id_inserted_at_idx
  on public.tasks (project_id, inserted_at desc);

create index if not exists tasks_owner_id_status_idx
  on public.tasks (owner_id, status);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = check_user_id
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.app_role := 'member';
  resolved_name text;
begin
  if not exists (select 1 from public.profiles) then
    assigned_role := 'admin';
  end if;

  resolved_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(coalesce(new.email, ''), '@', 1),
    'User'
  );

  insert into public.profiles (id, email, display_name, role)
  values (new.id, coalesce(new.email, ''), resolved_name, assigned_role)
  on conflict (id) do update
    set email = excluded.email,
        display_name = excluded.display_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.handle_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.handle_updated_at();

insert into public.profiles (id, email, display_name, role)
select
  u.id,
  coalesce(u.email, ''),
  coalesce(split_part(coalesce(u.email, ''), '@', 1), 'User'),
  case
    when row_number() over (order by u.created_at, u.id) = 1
      and not exists (select 1 from public.profiles)
    then 'admin'::public.app_role
    else 'member'::public.app_role
  end
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "Profiles readable by owner or admin"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Profiles updateable by owner or admin"
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

create policy "Projects readable by owner or admin"
on public.projects
for select
using (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Projects insertable by owner or admin"
on public.projects
for insert
with check (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Projects updateable by owner or admin"
on public.projects
for update
using (auth.uid() = owner_id or public.is_admin(auth.uid()))
with check (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Projects deletable by owner or admin"
on public.projects
for delete
using (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Tasks readable by owner or admin"
on public.tasks
for select
using (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Tasks insertable by owner or admin"
on public.tasks
for insert
with check (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Tasks updateable by owner or admin"
on public.tasks
for update
using (auth.uid() = owner_id or public.is_admin(auth.uid()))
with check (auth.uid() = owner_id or public.is_admin(auth.uid()));

create policy "Tasks deletable by owner or admin"
on public.tasks
for delete
using (auth.uid() = owner_id or public.is_admin(auth.uid()));

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.projects to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
