-- The partial unique index (where external_id is not null) can't be used as
-- an ON CONFLICT target unless the same predicate is repeated in the query,
-- which supabase-js's upsert() doesn't do -- so every Google Calendar sync
-- upsert was silently failing. A plain unique constraint works instead:
-- Postgres treats every NULL as distinct under a unique constraint, so rows
-- with external_id = NULL (all manual entries) still never conflict with
-- each other.

drop index if exists public.calendar_events_source_external_id_idx;

alter table public.calendar_events
  add constraint calendar_events_source_external_id_key unique (source, external_id);
