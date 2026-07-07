-- Shared data: visible/editable by any household member.

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  due_date date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_by uuid not null references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.todos enable row level security;

create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();

create policy "household members can manage todos"
  on public.todos for all
  to authenticated
  using (public.is_household_member())
  with check (public.is_household_member());

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  all_day boolean not null default false,
  source text not null default 'manual' check (source in ('manual', 'google', 'outlook')),
  external_id text,
  created_by uuid not null references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.calendar_events enable row level security;

create trigger calendar_events_set_updated_at
  before update on public.calendar_events
  for each row execute function public.set_updated_at();

create policy "household members can manage calendar events"
  on public.calendar_events for all
  to authenticated
  using (public.is_household_member())
  with check (public.is_household_member());

create index if not exists calendar_events_start_time_idx on public.calendar_events (start_time);
create index if not exists todos_due_date_idx on public.todos (due_date);
