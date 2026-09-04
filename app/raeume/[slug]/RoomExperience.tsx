"use client";

import { type FormEvent, useState } from "react";

type RoomExperienceProps = {
  title: string;
  detail: string;
  people: string;
};

export default function RoomExperience({ title, detail, people }: RoomExperienceProps) {
  const [joined, setJoined] = useState(false);
  const [activeParticipant, setActiveParticipant] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(["Anna: Schön, dass du da bist!", "Lisa: Ich bin gerade an der Ferse."]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    setMessages((currentMessages) => [...currentMessages, `Du: ${trimmedMessage}`]);
    setMessage("");
  }

  if (joined) {
    return (
      <section className="joined-room" id="preview" aria-live="polite">
        <div className="joined-header"><div><p className="eyebrow">Du bist dabei</p><h2>{title}</h2></div><span className="preview-badge">Zuschauer-Modus</span></div>
        <div className="joined-status"><span className="status-check" aria-hidden="true">✓</span><div><strong>{activeParticipant ? "Du nimmst aktiv teil." : "Willkommen im Raum."}</strong><p>{activeParticipant ? "Deine Kamera und dein Mikrofon sind weiterhin aus. LiveKit folgt im nächsten Schritt." : "Du bist als Zuschauer dabei. Du kannst jederzeit selbst aktiv werden."}</p></div><button className="text-button mode-button" type="button" onClick={() => setActiveParticipant((current) => !current)}>{activeParticipant ? "Zuschauer werden" : "Aktiv teilnehmen"}</button></div>
        <div className="room-tools"><div className="preview-grid"><div className="preview-tile tile-one"><span>MK</span><small>Hände-Ansicht</small></div><div className="preview-tile tile-two"><span>LS</span><small>Nur dabei</small></div><div className={`preview-tile tile-three tile-you ${activeParticipant ? "tile-active" : ""}`}><span>Du</span><small>{activeParticipant ? "Teilnehmer" : "Kamera aus"}</small></div></div><aside className="chat-panel"><div className="chat-heading"><div><p className="eyebrow">Raumchat</p><strong>Leise Nachrichten</strong></div><span>{messages.length} Nachrichten</span></div><div className="chat-messages">{messages.map((chatMessage, index) => <p key={`${chatMessage}-${index}`}>{chatMessage}</p>)}</div><form className="chat-form" onSubmit={sendMessage}><input aria-label="Nachricht schreiben" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Nachricht schreiben ..." /><button type="submit" aria-label="Nachricht senden">→</button></form></aside></div>
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
