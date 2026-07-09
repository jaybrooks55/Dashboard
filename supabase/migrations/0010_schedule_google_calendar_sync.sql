-- Auto-sync every connected Google Calendar every 30 minutes via pg_cron +
-- pg_net, instead of relying on someone clicking "Sync now".

create extension if not exists pg_cron;
create extension if not exists pg_net;

select
  cron.schedule(
    'sync-google-calendars',
    '*/30 * * * *',
    $$
    select net.http_post(
      url := 'https://llbgaxlqtmqrixktaits.supabase.co/functions/v1/google-calendar-cron-sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', '68666db8518d06c1f8d31ffe3956ec52516ea69eb0a3b9d9f68cc67e1afda3e5'
      ),
      body := '{}'::jsonb
    );
    $$
  );
