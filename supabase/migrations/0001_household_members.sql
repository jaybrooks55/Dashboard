-- Household membership: only explicitly-invited auth.users get access to shared data.
-- New users are added automatically when their auth.users row is created (invited via
-- the Supabase dashboard / admin API — there is no public sign-up form in this app).

create table if not exists public.household_members (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.household_members enable row level security;

create policy "household members can view the household"
  on public.household_members for select
  to authenticated
  using (exists (select 1 from public.household_members m where m.user_id = auth.uid()));

create or replace function public.is_household_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.household_members where user_id = auth.uid()
  );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.household_members (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
