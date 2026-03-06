alter table public.tasks
  drop constraint if exists tasks_status_check;

update public.tasks
set status = 'backlog'
where status = 'todo';

alter table public.tasks
  add constraint tasks_status_check
  check (status in ('backlog', 'in_progress', 'review', 'done'));
