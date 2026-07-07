# Household Dashboard

A shared dashboard for two accounts (you + your wife), deployed on Cloudflare
Pages with a Supabase backend. Calendar and to-dos are shared; journal,
habits, notes, reading, exercise, and meals are private per account.

## Stack

- Vite + React + TypeScript (SPA)
- Tailwind CSS
- Supabase (Postgres + Auth + Row Level Security + Vault)
- Cloudflare Pages (static hosting)

## How access control works

- **Shared data** (`todos`, `calendar_events`): any account listed in
  `household_members` can read/write. A trigger on `auth.users` automatically
  adds every new account to `household_members`, so once you invite your wife's
  account in the Supabase dashboard she's in the shared workspace with no
  extra setup.
- **Private data** (`journal_entries`, `habits`, `habit_logs`, `notes`,
  `reading_list`, `exercise_logs`, `meals`, `commitments`, `reminders`,
  `context_notes`, `focus_sessions`, `daily_recaps`, `dispatch_flags`): every
  table has an `owner_id` column and an RLS policy restricting rows to
  `owner_id = auth.uid()`. Nobody, including your wife's account, can query
  another account's private rows — enforced in Postgres, not just in the UI.
- **OAuth tokens** (`oauth_connections`): the table only stores references
  (`vault.secrets` ids) to encrypted tokens in Supabase Vault. The
  browser/anon/authenticated roles can see connection *status* (provider,
  expiry) but never the decrypted token — only a service-role Edge Function
  can read/write the actual token during the OAuth exchange or refresh.
- There is **no public sign-up form**. Accounts are created by inviting them
  from the Supabase Auth dashboard (Authentication → Users → Invite), which
  matches the login-gated, zero-trust-style pattern used elsewhere.

Full schema + RLS policies are in `supabase/migrations/`, applied in order.
Both the shared/private isolation and the household auto-join trigger were
verified directly against the live database (impersonating two test accounts
via RLS, then deleting them) before this was committed.

## Local development

```bash
npm install
cp .env.example .env   # already has the real Supabase URL/anon key filled in
npm run dev
```

Sign in with an account you've invited via the Supabase dashboard.

## Project structure

```
src/
  lib/            Supabase client, auth context, generated DB types
  components/     Layout/nav shell, quick capture bar, route guard
  pages/          One file per feature/route
supabase/
  migrations/     SQL migrations (source of truth for schema/RLS)
```

## What's built vs. stubbed

**Built and working:** auth (sign in / sign out), daily briefing (today's
calendar + placeholder weather/dispatch/verse sections), to-do list (full
CRUD, shared), calendar (agenda view + manual add, shared), journal (private,
per-account).

**Schema exists, UI is a placeholder page:** habits, notes, reading list,
exercise log, meals, focus timer, reminders, weekly review, daily recap. These
just need list/form UI wired to the already-migrated tables — no new schema
work required.

**Not started (needs credentials first):**
- Google/Outlook Calendar OAuth sync (writes into `calendar_events` with
  `source = 'google' | 'outlook'`)
- Gmail OAuth + filtering into `dispatch_flags`
- Quick Capture smart routing via the Anthropic API (currently just saves
  everything as a note in `notes` — see `src/components/QuickCaptureBar.tsx`)
- Live weather
- Auto-logged commitments extraction from journal/notes (table `commitments`
  exists; the extraction logic itself isn't written)

## Adding the integrations later

1. **Google/Outlook Calendar + Gmail OAuth**: implement the OAuth exchange in
   a Supabase Edge Function (needs the service role key, never expose it
   client-side). On success, call `vault.create_secret()` for the access/refresh
   tokens and store the returned ids in `oauth_connections`. Use a scheduled
   Edge Function (pg_cron is already enabled on the project) to refresh
   tokens and sync events/flagged emails.
2. **Anthropic API (quick capture routing)**: add a `quick-capture` Edge
   Function that takes the raw text, calls the Claude API with a small
   classification prompt (todo vs. calendar vs. journal vs. note), and inserts
   into the right table. Set `ANTHROPIC_API_KEY` as an Edge Function secret,
   not a `VITE_`-prefixed client env var.
3. **Weather**: pick a provider (e.g. Open-Meteo needs no key, or use one that
   does) and either call it directly from the client (if keyless/CORS-friendly)
   or proxy through an Edge Function if a key must stay secret.

## Deploying to Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`
- `public/_redirects` is already set up for SPA client-side routing
  (`/* /index.html 200`).
- Environment variables to set in the Pages project: `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY` (same values as `.env.example`).

## Supabase project

- Name: `household-dashboard`
- Ref: `llbgaxlqtmqrixktaits`
- Region: `us-east-2`

To invite the second account: Supabase dashboard → Authentication → Users →
Invite user. They'll get added to `household_members` automatically the
moment their account is created, giving them access to shared to-dos/calendar
while keeping their own private data separate from yours.
