-- Support for Google Calendar sync: upsert-safe external events, and which
-- calendar(s) each connection is configured to sync.

create unique index if not exists calendar_events_source_external_id_idx
  on public.calendar_events (source, external_id)
  where external_id is not null;

alter table public.oauth_connections
  add column if not exists synced_calendar_ids text[] not null default '{}';
