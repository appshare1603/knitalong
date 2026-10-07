import { AccessToken } from "livekit-server-sdk";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!accessToken) return Response.json({ error: "Anmeldung erforderlich." }, { status: 401 });

  let roomSlug: unknown;
  try {
    ({ roomSlug } = await request.json());
  } catch {
    return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  if (typeof roomSlug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(roomSlug)) {
    return Response.json({ error: "Ungültiger Raum." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const liveKitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const liveKitApiKey = process.env.LIVEKIT_API_KEY;
  const liveKitApiSecret = process.env.LIVEKIT_API_SECRET;
  if (!supabaseUrl || !supabaseAnonKey || !liveKitUrl || !liveKitApiKey || !liveKitApiSecret) {
    return Response.json({ error: "LiveKit ist serverseitig noch nicht vollständig konfiguriert." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: userResult, error: authError } = await supabase.auth.getUser(accessToken);
  const user = userResult.user;
  if (authError || !user) return Response.json({ error: "Sitzung ungültig oder abgelaufen." }, { status: 401 });

  const { data: room, error: roomError } = await supabase.from("rooms").select("id, slug").eq("slug", roomSlug).eq("is_active", true).single();
  if (roomError || !room) return Response.json({ error: "Aktiver Raum nicht gefunden." }, { status: 404 });

  const { data: membership, error: membershipError } = await supabase.from("room_members").select("mode").eq("room_id", room.id).eq("user_id", user.id).is("left_at", null).maybeSingle();
  if (membershipError || !membership) return Response.json({ error: "Du musst dem Raum zuerst beitreten." }, { status: 403 });

  const displayName = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : user.id;
  const token = new AccessToken(liveKitApiKey, liveKitApiSecret, {
    identity: user.id,
    name: displayName,
    ttl: "10m",
  });
  token.addGrant({
    roomJoin: true,
    room: room.slug,
    canPublish: membership.mode === "participant",
    canSubscribe: true,
    canPublishData: true,
  });

  return Response.json({ token: await token.toJwt(), serverUrl: liveKitUrl }, { headers: { "Cache-Control": "no-store" } });
}
