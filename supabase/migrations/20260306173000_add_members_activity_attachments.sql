create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member', 'manager')),
  inserted_at timestamptz not null default timezone('utc'::text, now()),
  primary key (project_id, user_id)
);

create table if not exists public.project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  message text not null,
  inserted_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  uploader_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size_bytes integer not null default 0,
  inserted_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists project_members_user_id_idx on public.project_members (user_id);
create index if not exists project_activity_project_id_inserted_at_idx on public.project_activity (project_id, inserted_at desc);
create index if not exists task_attachments_task_id_inserted_at_idx on public.task_attachments (task_id, inserted_at desc);

alter table public.project_members enable row level security;
alter table public.project_activity enable row level security;
alter table public.task_attachments enable row level security;

create policy "Project members readable by project user or admin"
on public.project_members
for select
using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and (p.owner_id = auth.uid() or auth.uid() = user_id)
  )
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = project_members.project_id
      and pm.user_id = auth.uid()
  )
);

create policy "Project members insertable by owner or admin"
on public.project_members
for insert
with check (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and p.owner_id = auth.uid()
  )
);

create policy "Project members deletable by owner or admin"
on public.project_members
for delete
using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and p.owner_id = auth.uid()
  )
);

create policy "Project activity readable by project user or admin"
on public.project_activity
for select
using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and p.owner_id = auth.uid()
  )
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = project_activity.project_id
      and pm.user_id = auth.uid()
  )
);

create policy "Project activity insertable by project user or admin"
on public.project_activity
for insert
with check (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.projects p
    where p.id = project_id
      and p.owner_id = auth.uid()
  )
  or exists (
    select 1 from public.project_members pm
    where pm.project_id = project_activity.project_id
      and pm.user_id = auth.uid()
  )
);

create policy "Task attachments readable by task owner, project member or admin"
on public.task_attachments
for select
using (
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.tasks t
    join public.projects p on p.id = t.project_id
    where t.id = task_id
      and (t.owner_id = auth.uid() or p.owner_id = auth.uid())
  )
  or exists (
    select 1
    from public.tasks t
    join public.project_members pm on pm.project_id = t.project_id
    where t.id = task_id
      and pm.user_id = auth.uid()
  )
);

create policy "Task attachments insertable by task owner, project member or admin"
on public.task_attachments
for insert
with check (
  public.is_admin(auth.uid())
  or exists (
    select 1
    from public.tasks t
    join public.projects p on p.id = t.project_id
    where t.id = task_id
      and (t.owner_id = auth.uid() or p.owner_id = auth.uid())
  )
  or exists (
    select 1
    from public.tasks t
    join public.project_members pm on pm.project_id = t.project_id
    where t.id = task_id
      and pm.user_id = auth.uid()
  )
);

create policy "Task attachments deletable by uploader or admin"
on public.task_attachments
for delete
using (uploader_id = auth.uid() or public.is_admin(auth.uid()));

grant select, insert, delete on public.project_members to authenticated;
grant select, insert on public.project_activity to authenticated;
grant select, insert, delete on public.task_attachments to authenticated;
