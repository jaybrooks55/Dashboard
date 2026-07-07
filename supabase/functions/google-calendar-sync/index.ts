import { adminClient, corsHeaders, getUserFromRequest, getValidAccessToken, jsonResponse } from "./shared.ts";

const WINDOW_DAYS_PAST = 7;
const WINDOW_DAYS_FUTURE = 60;

interface GoogleEvent {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const user = await getUserFromRequest(req);
  if (!user) return jsonResponse({ error: "Not authenticated" }, 401);

  const admin = adminClient();
  const { data: connection, error } = await admin
    .from("oauth_connections")
    .select("id, access_token_secret_id, refresh_token_secret_id, expires_at, synced_calendar_ids")
    .eq("owner_id", user.id)
    .eq("provider", "google_calendar")
    .maybeSingle();

  if (error || !connection) return jsonResponse({ error: "Google Calendar is not connected" }, 404);

  const calendarIds: string[] = connection.synced_calendar_ids ?? [];
  if (calendarIds.length === 0) {
    return jsonResponse({ synced: 0, message: "No calendars selected to sync" });
  }

  const accessToken = await getValidAccessToken(admin, connection);

  const timeMin = new Date(Date.now() - WINDOW_DAYS_PAST * 86_400_000).toISOString();
  const timeMax = new Date(Date.now() + WINDOW_DAYS_FUTURE * 86_400_000).toISOString();

  let upserts = 0;
  let deletions = 0;

  for (const calendarId of calendarIds) {
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    });
    const resp = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!resp.ok) {
      console.error(`Failed to fetch events for ${calendarId}: ${resp.status} ${await resp.text()}`);
      continue;
    }
    const json = await resp.json();
    const events: GoogleEvent[] = json.items ?? [];

    const rows = [];
    const cancelledIds: string[] = [];

    for (const event of events) {
      if (event.status === "cancelled") {
        cancelledIds.push(event.id);
        continue;
      }
      if (!event.start) continue;
      const allDay = !event.start.dateTime;
      rows.push({
        title: event.summary || "(untitled)",
        description: event.description ?? null,
        location: event.location ?? null,
        start_time: event.start.dateTime ?? `${event.start.date}T00:00:00Z`,
        end_time: event.end?.dateTime ?? (event.end?.date ? `${event.end.date}T00:00:00Z` : null),
        all_day: allDay,
        source: "google",
        external_id: event.id,
        created_by: user.id,
      });
    }

    if (rows.length > 0) {
      const { error: upsertError } = await admin
        .from("calendar_events")
        .upsert(rows, { onConflict: "source,external_id" });
      if (upsertError) {
        console.error(`Upsert failed for ${calendarId}:`, upsertError.message);
      } else {
        upserts += rows.length;
      }
    }

    if (cancelledIds.length > 0) {
      const { error: deleteError, count } = await admin
        .from("calendar_events")
        .delete({ count: "exact" })
        .eq("source", "google")
        .in("external_id", cancelledIds);
      if (!deleteError) deletions += count ?? 0;
    }
  }

  return jsonResponse({ synced: upserts, deleted: deletions });
});
