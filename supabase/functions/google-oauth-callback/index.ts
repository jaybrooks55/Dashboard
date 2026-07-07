import { adminClient, corsHeaders, verifyState } from "./shared.ts";

function redirectToApp(path: string): Response {
  const appUrl = Deno.env.get("APP_URL")!;
  return new Response(null, { status: 302, headers: { Location: `${appUrl}${path}`, ...corsHeaders } });
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  if (errorParam) return redirectToApp("/calendar?google=denied");
  if (!code || !state) return redirectToApp("/calendar?google=error");

  const userId = await verifyState(state);
  if (!userId) return redirectToApp("/calendar?google=error");

  const redirectUri = `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-oauth-callback`;
  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenResp.ok) {
    console.error("Google token exchange failed", await tokenResp.text());
    return redirectToApp("/calendar?google=error");
  }

  const tokens = await tokenResp.json();
  const admin = adminClient();

  let externalEmail: string | null = null;
  try {
    const userInfoResp = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (userInfoResp.ok) {
      const info = await userInfoResp.json();
      externalEmail = info.email ?? null;
    }
  } catch {
    // Non-critical -- only used for display.
  }

  const { data: existing } = await admin
    .from("oauth_connections")
    .select("refresh_token_secret_id")
    .eq("owner_id", userId)
    .eq("provider", "google_calendar")
    .maybeSingle();

  const { data: accessSecretId } = await admin.rpc("store_oauth_secret", {
    secret_value: tokens.access_token,
    secret_name: `google_access_${userId}_${Date.now()}`,
  });

  let refreshSecretId: string | null = existing?.refresh_token_secret_id ?? null;
  if (tokens.refresh_token) {
    const { data } = await admin.rpc("store_oauth_secret", {
      secret_value: tokens.refresh_token,
      secret_name: `google_refresh_${userId}_${Date.now()}`,
    });
    refreshSecretId = data;
  }

  if (!refreshSecretId) {
    // Google didn't return a refresh token and we don't have one on file --
    // without it we can't keep this connection alive past the first hour.
    console.error("No refresh token available for user", userId);
    return redirectToApp("/calendar?google=error");
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  await admin.from("oauth_connections").upsert(
    {
      owner_id: userId,
      provider: "google_calendar",
      external_account_email: externalEmail,
      scope: tokens.scope ?? null,
      access_token_secret_id: accessSecretId,
      refresh_token_secret_id: refreshSecretId,
      expires_at: expiresAt,
    },
    { onConflict: "owner_id,provider" },
  );

  return redirectToApp("/calendar?google=connected");
});
