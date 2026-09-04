import Link from "next/link";
import RoomExperience from "./RoomExperience";

const rooms: Record<string, { title: string; detail: string; people: string; accent: string }> = {
  "leise-maschen": { title: "Leise Maschen am Abend", detail: "Gemeinsam stricken, wenig reden", people: "4 aktiv · 11 dabei", accent: "sage" },
  sockenrunde: { title: "Sockenrunde", detail: "Ferse, Spitze und gute Gesellschaft", people: "3 aktiv · 7 dabei", accent: "coral" },
  "wollcafe-nord": { title: "Wollcafe Nord", detail: "Freies Projekt · Anfänger willkommen", people: "2 aktiv · 5 dabei", accent: "ochre" },
};

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = rooms[slug] ?? rooms["leise-maschen"];

  return (
    <main className="room-page">
      <nav className="topbar" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
        <Link className="nav-login" href="/">Zur Übersicht</Link>
      </nav>
      <section className="room-stage">
        <div className={`room-stage-art ${room.accent}`}><div className="stage-ball" /><div className="stage-needle" /></div>
        <div className="room-stage-copy">
          <div className="room-topline"><span className="live-label"><span className="live-dot" /> LIVE</span><span>Demo-Raum</span></div>
          <p className="eyebrow">Virtuelles Strickwohnzimmer</p>
          <h1>{room.title}</h1>
          <p className="stage-detail">{room.detail}. Im Prototypen ist der Raum zunächst eine Vorschau. Kamera, Mikrofon und Chat werden in einem späteren Schritt verbunden.</p>
          <div className="stage-stats"><span>{room.people}</span><span>16+ · Deutsch</span></div>
          <div className="stage-actions"><a className="button button-dark" href="#preview">Als Zuschauer ansehen <span aria-hidden="true">↗</span></a><Link className="text-link" href="/">Zurück zu allen Räumen</Link></div>
        </div>
      </section>
      <RoomExperience title={room.title} detail={room.detail} people={room.people} />
      <footer><span>KnitAlong</span><span>Prototyp · keine Aufzeichnung</span></footer>
    </main>
  );
}
