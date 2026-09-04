"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type Room = {
  slug: string;
  title: string;
  description: string;
  max_participants: number;
  accent: "sage" | "coral" | "ochre";
  created_at: string;
};

const fallbackRooms: Room[] = [
  { slug: "leise-maschen", title: "Leise Maschen am Abend", description: "Gemeinsam stricken, wenig reden", max_participants: 20, accent: "sage", created_at: "" },
  { slug: "sockenrunde", title: "Sockenrunde", description: "Ferse, Spitze und gute Gesellschaft", max_participants: 20, accent: "coral", created_at: "" },
  { slug: "wollcafe-nord", title: "Wollcafe Nord", description: "Freies Projekt · Anfänger willkommen", max_participants: 20, accent: "ochre", created_at: "" },
];

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>(fallbackRooms);
  const [loading, setLoading] = useState(true);
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    async function loadRooms() {
      const result = await supabase.from("rooms").select("slug, title, description, max_participants, accent, created_at").eq("is_active", true).eq("visibility", "public").order("created_at", { ascending: false });
      if (!result.error && result.data?.length) {
        setRooms(result.data as Room[]);
        setDatabaseReady(true);
      }
      setLoading(false);
    }

    void loadRooms();
  }, []);

  return <div className="room-list-wrap"><div className="room-list">{rooms.map((room, index) => <article className="room-card" key={room.slug}><div className={`room-art ${room.accent}`}><div className="mini-ball" /><div className="mini-needle" /></div><div className="room-content"><div className="room-topline"><span className="live-label"><span className="live-dot" /> LIVE</span><span>{loading ? "lädt ..." : index === 0 ? "gerade offen" : "heute"}</span></div><h3>{room.title}</h3><p>{room.description}</p><div className="room-footer"><span>bis zu {room.max_participants} dabei</span><a href={`/raeume/${room.slug}`}>Beitreten <span aria-hidden="true">→</span></a></div></div></article>)}</div><p className="data-status" aria-live="polite">{databaseReady ? "Live aus Supabase" : "Demo-Räume für den ersten Start"}</p></div>;
}
