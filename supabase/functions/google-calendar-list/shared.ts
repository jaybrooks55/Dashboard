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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
