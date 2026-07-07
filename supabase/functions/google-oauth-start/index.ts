import { corsHeaders, getUserFromRequest, jsonResponse, signState } from "./shared.ts";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly", "openid", "email"].join(" ");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const user = await getUserFromRequest(req);
  if (!user) return jsonResponse({ error: "Not authenticated" }, 401);

  const redirectUri = `${Deno.env.get("SUPABASE_URL")}/functions/v1/google-oauth-callback`;
  const state = await signState(user.id);
  const params = new URLSearchParams({
    client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return jsonResponse({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});
