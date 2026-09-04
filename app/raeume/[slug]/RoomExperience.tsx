"use client";

import { useState } from "react";

type RoomExperienceProps = {
  title: string;
  detail: string;
  people: string;
};

export default function RoomExperience({ title, detail, people }: RoomExperienceProps) {
  const [joined, setJoined] = useState(false);

  if (joined) {
    return (
      <section className="joined-room" id="preview" aria-live="polite">
        <div className="joined-header"><div><p className="eyebrow">Du bist dabei</p><h2>{title}</h2></div><span className="preview-badge">Zuschauer-Modus</span></div>
        <div className="joined-status"><span className="status-check" aria-hidden="true">✓</span><div><strong>Willkommen im Raum.</strong><p>Deine Kamera und dein Mikrofon sind aus. Du kannst jederzeit selbst aktiv werden.</p></div></div>
        <div className="preview-grid"><div className="preview-tile tile-one"><span>MK</span><small>Hände-Ansicht</small></div><div className="preview-tile tile-two"><span>LS</span><small>Nur dabei</small></div><div className="preview-tile tile-three tile-you"><span>Du</span><small>Kamera aus</small></div></div>
        <div className="joined-footer"><span>{people} · jetzt mit dir</span><button className="text-button" type="button" onClick={() => setJoined(false)}>Raum verlassen</button></div>
      </section>
    );
  }

  return (
    <section className="room-preview" id="preview">
      <div className="preview-header"><div><p className="eyebrow">Raumvorschau</p><h2>Hier wird zusammen gestrickt.</h2></div><span className="preview-badge">Noch ohne LiveKit</span></div>
      <div className="preview-grid"><div className="preview-tile tile-one"><span>MK</span><small>Hände-Ansicht</small></div><div className="preview-tile tile-two"><span>LS</span><small>Nur dabei</small></div><div className="preview-tile tile-three"><span>Du</span><small>Kamera aus</small></div></div>
      <div className="join-panel"><p>{detail}. Tritt zunächst als Zuschauer bei.</p><button className="button button-dark" type="button" onClick={() => setJoined(true)}>Raum betreten <span aria-hidden="true">↗</span></button></div>
    </section>
  );
}
