-- Private per-user data: only the owning user can see or edit their rows.
-- Reused across tables via a single policy shape: owner_id = auth.uid().

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  entry_date date not null default current_date,
  content text not null default '',
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.journal_entries enable row level security;
create trigger journal_entries_set_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();
create policy "owner manages own journal entries" on public.journal_entries for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create index if not exists journal_entries_owner_date_idx on public.journal_entries (owner_id, entry_date desc);

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  name text not null,
  target_per_week int not null default 7 check (target_per_week between 1 and 7),
  color text not null default '#5b6cf0',
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.habits enable row level security;
create policy "owner manages own habits" on public.habits for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  owner_id uuid not null references auth.users (id) default auth.uid(),
  log_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);
alter table public.habit_logs enable row level security;
create policy "owner manages own habit logs" on public.habit_logs for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create index if not exists habit_logs_habit_date_idx on public.habit_logs (habit_id, log_date desc);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  title text,
  content text not null default '',
  tags text[] not null default '{}',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.notes enable row level security;
create trigger notes_set_updated_at before update on public.notes
  for each row execute function public.set_updated_at();
create policy "owner manages own notes" on public.notes for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.reading_list (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  title text not null,
  author text,
  status text not null default 'want_to_read' check (status in ('want_to_read', 'reading', 'finished', 'abandoned')),
  rating int check (rating between 1 and 5),
  started_at date,
  finished_at date,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.reading_list enable row level security;
create policy "owner manages own reading list" on public.reading_list for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  log_date date not null default current_date,
  activity text not null,
  duration_minutes int,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.exercise_logs enable row level security;
create policy "owner manages own exercise logs" on public.exercise_logs for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create index if not exists exercise_logs_owner_date_idx on public.exercise_logs (owner_id, log_date desc);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  meal_date date not null default current_date,
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  description text not null,
  planned boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.meals enable row level security;
create policy "owner manages own meals" on public.meals for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create index if not exists meals_owner_date_idx on public.meals (owner_id, meal_date desc);
