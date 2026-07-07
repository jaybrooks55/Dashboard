import { adminClient, corsHeaders, getUserFromRequest, getValidAccessToken, jsonResponse } from "./shared.ts";

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

  const accessToken = await getValidAccessToken(admin, connection);

  const resp = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) {
    return jsonResponse({ error: `Google API error: ${resp.status}` }, 502);
  }
  const json = await resp.json();
  const calendars = (json.items ?? []).map((item: { id: string; summary: string; primary?: boolean }) => ({
    id: item.id,
    summary: item.summary,
    primary: !!item.primary,
  }));

  return jsonResponse({ calendars, selected: connection.synced_calendar_ids ?? [] });
});
