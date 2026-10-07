"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, GridLayout, ParticipantTile, RoomAudioRenderer, TrackToggle, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { supabase } from "@/lib/supabase/client";

type LiveKitRoomPanelProps = { slug: string; canPublish: boolean };
type LiveKitTokenResponse = { token: string; serverUrl: string };

function ConnectedRoom({ canPublish }: { canPublish: boolean }) {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);

  return (
    <div className="livekit-connected">
      <GridLayout tracks={tracks} className="livekit-grid"><ParticipantTile /></GridLayout>
      <RoomAudioRenderer />
      <div className="livekit-controls">
        <TrackToggle source={Track.Source.Microphone} disabled={!canPublish} title={canPublish ? "Mikrofon umschalten" : "Aktive Teilnahme einschalten, um das Mikrofon zu verwenden"} className="button button-dark">Mikrofon</TrackToggle>
        <TrackToggle source={Track.Source.Camera} disabled={!canPublish} title={canPublish ? "Kamera umschalten" : "Aktive Teilnahme einschalten, um die Kamera zu verwenden"} className="button button-dark">Kamera</TrackToggle>
      </div>
    </div>
  );
}

export default function LiveKitRoomPanel({ slug, canPublish }: LiveKitRoomPanelProps) {
  const [credentials, setCredentials] = useState<LiveKitTokenResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function requestToken() {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        if (active) {
          setError("Bitte melde dich an, um LiveKit zu verwenden.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.session.access_token}`,
          },
          body: JSON.stringify({ roomSlug: slug }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "LiveKit-Token konnte nicht erstellt werden.");
        if (active) setCredentials(result as LiveKitTokenResponse);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Verbindung zu LiveKit fehlgeschlagen.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void requestToken();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="livekit-message">LiveKit-Verbindung wird vorbereitet …</div>;
  if (error) return <div className="livekit-message livekit-error" role="alert">{error}</div>;
  if (!credentials) return null;

  return (
    <div className="livekit-shell" data-lk-theme="default">
      <LiveKitRoom token={credentials.token} serverUrl={credentials.serverUrl} connect audio={false} video={false} options={{ adaptiveStream: true, dynacast: true }} onError={(roomError) => setError(roomError.message)}>
        <ConnectedRoom canPublish={canPublish} />
      </LiveKitRoom>
    </div>
  );
}
