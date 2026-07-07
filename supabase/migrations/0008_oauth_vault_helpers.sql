-- Service-role-only helpers so Edge Functions can store/read/rotate OAuth
-- tokens in Supabase Vault without giving the browser (anon/authenticated)
-- any path to the decrypted values.

create or replace function public.store_oauth_secret(secret_value text, secret_name text default null)
returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  new_id uuid;
begin
  new_id := vault.create_secret(secret_value, coalesce(secret_name, 'oauth_token_' || gen_random_uuid()::text));
  return new_id;
end;
$$;

create or replace function public.read_oauth_secret(secret_id uuid)
returns text
language sql
stable
security definer
set search_path = public, vault
as $$
  select decrypted_secret from vault.decrypted_secrets where id = secret_id;
$$;

create or replace function public.update_oauth_secret(secret_id uuid, secret_value text)
returns void
language plpgsql
security definer
set search_path = public, vault
as $$
begin
  perform vault.update_secret(secret_id, secret_value);
end;
$$;

revoke execute on function public.store_oauth_secret(text, text) from public;
revoke execute on function public.read_oauth_secret(uuid) from public;
revoke execute on function public.update_oauth_secret(uuid, text) from public;

revoke execute on function public.store_oauth_secret(text, text) from anon, authenticated;
revoke execute on function public.read_oauth_secret(uuid) from anon, authenticated;
revoke execute on function public.update_oauth_secret(uuid, text) from anon, authenticated;

grant execute on function public.store_oauth_secret(text, text) to service_role;
grant execute on function public.read_oauth_secret(uuid) to service_role;
grant execute on function public.update_oauth_secret(uuid, text) to service_role;
