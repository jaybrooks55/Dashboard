-- Address advisor warnings: pin search_path, and stop exposing internal
-- trigger/helper functions as callable PostgREST RPC endpoints.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- handle_new_auth_user is only ever meant to run as the auth.users trigger,
-- never called directly by a client.
revoke execute on function public.handle_new_auth_user() from public;
revoke execute on function public.handle_new_auth_user() from anon;
revoke execute on function public.handle_new_auth_user() from authenticated;

-- is_household_member() only needs to be invoked implicitly by RLS policies
-- evaluated as the authenticated role; anon has no need to call it directly.
revoke execute on function public.is_household_member() from public;
revoke execute on function public.is_household_member() from anon;
grant execute on function public.is_household_member() to authenticated;
