import { adminClient, corsHeaders, getUserFromRequest, jsonResponse, syncConnectionEvents } from "./shared.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const user = await getUserFromRequest(req);
  if (!user) return jsonResponse({ error: "Not authenticated" }, 401);

  const admin = adminClient();
  const { data: connection, error } = await admin
    .from("oauth_connections")
    .select("id, owner_id, access_token_secret_id, refresh_token_secret_id, expires_at, synced_calendar_ids")
    .eq("owner_id", user.id)
    .eq("provider", "google_calendar")
    .maybeSingle();

  if (error || !connection) return jsonResponse({ error: "Google Calendar is not connected" }, 404);

  if ((connection.synced_calendar_ids ?? []).length === 0) {
    return jsonResponse({ synced: 0, deleted: 0, message: "No calendars selected to sync" });
  }

  const result = await syncConnectionEvents(admin, connection);
  return jsonResponse(result);
});
