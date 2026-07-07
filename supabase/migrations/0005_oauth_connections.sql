-- OAuth connections (Google/Outlook Calendar, Gmail). Tokens are never stored in
-- plaintext columns: the actual access/refresh tokens live in Supabase Vault
-- (already enabled on this project) and this table only stores the vault secret
-- ids. Reading/writing the real token values requires the service role (done
-- from a server-side Edge Function during the OAuth exchange/refresh), so the
-- browser client never has access to decrypted tokens even though it can see
-- connection status via RLS.

create table if not exists public.oauth_connections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) default auth.uid(),
  provider text not null check (provider in ('google_calendar', 'outlook_calendar', 'gmail')),
  external_account_email text,
  scope text,
  access_token_secret_id uuid references vault.secrets (id),
  refresh_token_secret_id uuid references vault.secrets (id),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, provider)
);

alter table public.oauth_connections enable row level security;

create trigger oauth_connections_set_updated_at
  before update on public.oauth_connections
  for each row execute function public.set_updated_at();

-- Owners can see their own connection metadata (status/expiry), never the token secrets.
create policy "owner can view own oauth connection status"
  on public.oauth_connections for select
  to authenticated
  using (owner_id = auth.uid());

-- Inserts/updates/deletes of this table happen via a service-role Edge Function
-- during the OAuth exchange, so no authenticated-role write policy is defined here.
