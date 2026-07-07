import { adminClient, corsHeaders, getUserFromRequest, jsonResponse } from "./shared.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const user = await getUserFromRequest(req);
  if (!user) return jsonResponse({ error: "Not authenticated" }, 401);

  const body = await req.json().catch(() => null);
  const calendarIds = body?.calendarIds;
  if (!Array.isArray(calendarIds) || !calendarIds.every((id: unknown) => typeof id === "string")) {
    return jsonResponse({ error: "calendarIds must be an array of strings" }, 400);
  }

  const admin = adminClient();
  const { error } = await admin
    .from("oauth_connections")
    .update({ synced_calendar_ids: calendarIds })
    .eq("owner_id", user.id)
    .eq("provider", "google_calendar");

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ ok: true });
});
