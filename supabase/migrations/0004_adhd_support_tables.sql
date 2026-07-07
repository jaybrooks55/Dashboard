-- ADHD / memory-support features: reminders, "where was I" context notes,
-- auto-logged commitments, body-doubling focus sessions, end-of-day recaps,
-- and flagged Dispatch emails (per-user, since Gmail is connected per account).

create table if not exists public.commitments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  description text not null,
  source text not null default 'manual' check (source in ('manual', 'journal', 'note', 'quick_capture')),
  source_id uuid,
  due_date date,
  status text not null default 'open' check (status in ('open', 'done', 'dismissed')),
  created_at timestamptz not null default now()
);
alter table public.commitments enable row level security;
create policy "owner manages own commitments" on public.commitments for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  title text not null,
  remind_at timestamptz not null,
  recurrence text not null default 'none' check (recurrence in ('none', 'daily', 'weekly', 'monthly')),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reminders enable row level security;
create policy "owner manages own reminders" on public.reminders for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create index if not exists reminders_owner_remind_at_idx on public.reminders (owner_id, remind_at);

create table if not exists public.context_notes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  note text not null,
  related_feature text,
  created_at timestamptz not null default now()
);
alter table public.context_notes enable row level security;
create policy "owner manages own context notes" on public.context_notes for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  task_label text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_minutes int,
  created_at timestamptz not null default now()
);
alter table public.focus_sessions enable row level security;
create policy "owner manages own focus sessions" on public.focus_sessions for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.daily_recaps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  recap_date date not null default current_date,
  summary text not null default '',
  created_at timestamptz not null default now(),
  unique (owner_id, recap_date)
);
alter table public.daily_recaps enable row level security;
create policy "owner manages own daily recaps" on public.daily_recaps for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create table if not exists public.dispatch_flags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  gmail_message_id text not null,
  subject text,
  snippet text,
  received_at timestamptz,
  created_at timestamptz not null default now(),
  unique (owner_id, gmail_message_id)
);
alter table public.dispatch_flags enable row level security;
create policy "owner manages own dispatch flags" on public.dispatch_flags for all
  to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
