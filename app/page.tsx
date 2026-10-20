import RoomList from "./RoomList";
import OnlineMembers from "./OnlineMembers";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="start">
        <div className="hero-copy"><p className="eyebrow">Das digitale Strickwohnzimmer</p><h1>Masche für Masche<br /><em>zusammen.</em></h1><p className="hero-text">Öffne deine Wolle, komm in einen Raum und strick in deinem Tempo mit Menschen, die gerade dasselbe tun.</p><div className="hero-actions"><a className="button button-dark" href="#raeume">Räume entdecken <span aria-hidden="true">↗</span></a><a className="text-link" href="/anmelden">Ich habe schon ein Konto</a></div><div className="trust-line"><span className="live-dot" aria-hidden="true" /> 12 Räume sind gerade offen <span className="dot-separator">·</span> kostenlos im Test</div></div>
        <div className="hero-art" aria-label="Illustration eines gemütlichen Strickplatzes"><div className="sun-shape" /><div className="thread thread-one" /><div className="thread thread-two" /><div className="yarn-ball"><span /></div><div className="needle needle-one" /><div className="needle needle-two" /><div className="art-caption"><span className="caption-dot" /> live aus München</div></div>
      </section>

      <section className="room-section" id="raeume"><div className="section-heading"><div><p className="eyebrow">Gerade online</p><h2>Finde deinen Raum.</h2></div><a className="filter-link" href="#raeume">Alle Räume <span aria-hidden="true">→</span></a></div><div className="room-layout"><RoomList /><aside className="welcome-panel" id="anmelden"><p className="eyebrow">Dein Platz ist frei</p><h2>Strickst du<br /><em>mit?</em></h2><p>Ein Name genügt für den ersten Besuch. Kamera und Mikrofon bleiben aus, bis du sie selbst einschaltest.</p><a className="button button-dark button-wide" href="/anmelden">Kostenlos anmelden <span aria-hidden="true">↗</span></a><p className="small-note">Bereits dabei? <a href="/anmelden">Einloggen</a></p></aside></div></section>

      <section className="social-proof" id="ueber"><OnlineMembers /></section>
      <footer><span>KnitAlong</span><span>Deutsch · Datenschutz · Noch im Test</span></footer>
    </main>
  );
}