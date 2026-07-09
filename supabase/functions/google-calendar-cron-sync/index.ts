import { adminClient, corsHeaders, jsonResponse, syncConnectionEvents } from "./shared.ts";

// Triggered by pg_cron (via pg_net) on a schedule, not by a logged-in user --
// there's no Supabase session/JWT involved, so this authenticates via a
// shared secret header instead. verify_jwt is disabled for this function
// (see deploy config) precisely so pg_net's plain HTTP call can reach it.
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const providedSecret = req.headers.get("x-cron-secret");
  if (!providedSecret || providedSecret !== Deno.env.get("CRON_SECRET")) {
    return jsonResponse({ error: "Not authorized" }, 401);
  }

  const admin = adminClient();
  const { data: connections, error } = await admin
    .from("oauth_connections")
    .select("id, owner_id, access_token_secret_id, refresh_token_secret_id, expires_at, synced_calendar_ids")
    .eq("provider", "google_calendar");

  if (error) return jsonResponse({ error: error.message }, 500);

  const results = [];
  for (const connection of connections ?? []) {
    if ((connection.synced_calendar_ids ?? []).length === 0) continue;
    try {
      const result = await syncConnectionEvents(admin, connection);
      results.push({ owner_id: connection.owner_id, ...result });
    } catch (err) {
      console.error(`Sync failed for connection ${connection.id}:`, err);
      results.push({ owner_id: connection.owner_id, error: String(err) });
    }
  }

  return jsonResponse({ synced_connections: results.length, results });
});
