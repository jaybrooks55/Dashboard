import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

export function adminClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Encodes who initiated the OAuth flow so the callback (a plain redirect from
// Google, with no Supabase session) knows which user to attach the
// connection to. Signed + time-boxed so it can't be forged or replayed.
export async function signState(userId: string): Promise<string> {
  const secret = Deno.env.get("OAUTH_STATE_SECRET")!;
  const payload = `${userId}.${Date.now()}`;
  const sig = await hmac(secret, payload);
  return `${btoa(payload)}.${sig}`;
}

export async function verifyState(state: string): Promise<string | null> {
  try {
    const secret = Deno.env.get("OAUTH_STATE_SECRET")!;
    const [payloadB64, sig] = state.split(".");
    const payload = atob(payloadB64);
    const expectedSig = await hmac(secret, payload);
    if (expectedSig !== sig) return null;
    const [userId, ts] = payload.split(".");
    if (Date.now() - Number(ts) > 10 * 60 * 1000) return null;
    return userId;
  } catch {
    return null;
  }
}

export async function getValidAccessToken(
  admin: SupabaseClient,
  connection: {
    id: string;
    access_token_secret_id: string;
    refresh_token_secret_id: string;
    expires_at: string | null;
  },
): Promise<string> {
  const expiresAt = connection.expires_at ? new Date(connection.expires_at).getTime() : 0;
  if (expiresAt - Date.now() > 60_000) {
    const { data } = await admin.rpc("read_oauth_secret", { secret_id: connection.access_token_secret_id });
    return data as string;
  }

  const { data: refreshToken } = await admin.rpc("read_oauth_secret", {
    secret_id: connection.refresh_token_secret_id,
  });
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: refreshToken as string,
      grant_type: "refresh_token",
    }),
  });
  if (!resp.ok) {
    throw new Error(`Failed to refresh Google token: ${resp.status} ${await resp.text()}`);
  }
  const json = await resp.json();
  const newExpiresAt = new Date(Date.now() + json.expires_in * 1000).toISOString();
  await admin.rpc("update_oauth_secret", {
    secret_id: connection.access_token_secret_id,
    secret_value: json.access_token,
  });
  await admin.from("oauth_connections").update({ expires_at: newExpiresAt }).eq("id", connection.id);
  return json.access_token as string;
}

export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface GoogleEvent {
  id: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

const WINDOW_DAYS_PAST = 7;
const WINDOW_DAYS_FUTURE = 60;

export interface OAuthConnectionRow {
  id: string;
  owner_id: string;
  access_token_secret_id: string;
  refresh_token_secret_id: string;
  expires_at: string | null;
  synced_calendar_ids: string[];
}

// Shared by the on-demand "Sync now" button (one connection, JWT-authenticated)
// and the cron job (every connection, secret-header-authenticated).
export async function syncConnectionEvents(
  admin: SupabaseClient,
  connection: OAuthConnectionRow,
): Promise<{ synced: number; deleted: number }> {
  const calendarIds = connection.synced_calendar_ids ?? [];
  if (calendarIds.length === 0) return { synced: 0, deleted: 0 };

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
        created_by: connection.owner_id,
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

  return { synced: upserts, deleted: deletions };
}
