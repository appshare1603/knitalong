"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [name, setName] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [joined, setJoined] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim() && isAdult) setJoined(true);
  }

  if (joined) {
    return (
      <main className="auth-page">
        <nav className="topbar" aria-label="Hauptnavigation">
          <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
          <Link className="nav-login" href="/">Zur Übersicht</Link>
        </nav>
        <section className="profile-card profile-success">
          <span className="profile-avatar">{name.trim().slice(0, 2).toUpperCase()}</span>
          <p className="eyebrow">Willkommen im Test</p>
          <h1>Schön, dass du<br /><em>dabei bist.</em></h1>
          <p>Dein Demo-Profil ist bereit. Du kannst jetzt einen Raum als Zuschauer besuchen.</p>
          <Link className="button button-dark button-wide" href="/raeume/leise-maschen">Zum ersten Raum <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" href="/">Zurück zur Übersicht</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <nav className="topbar" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
        <Link className="nav-login" href="/">Zur Übersicht</Link>
      </nav>
      <section className="auth-layout">
        <div className="auth-intro"><p className="eyebrow">Geschlossener Test · 20 Plätze</p><h1>Dein Platz im<br /><em>Wohnzimmer.</em></h1><p>Für den Prototypen genügt ein Anzeigename. Es werden noch keine echten Konten angelegt und keine Daten an einen Server gesendet.</p><Link className="text-link" href="/">← Zur Startseite</Link></div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="form-step">01 / 01</span><h2>Demo-Profil</h2></div>
          <label htmlFor="name">Wie dürfen wir dich nennen?</label>
          <input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dein Anzeigename" autoComplete="nickname" required />
          <label className="check-row"><input type="checkbox" checked={isAdult} onChange={(event) => setIsAdult(event.target.checked)} required /><span>Ich bin mindestens 16 Jahre alt.</span></label>
          <button className="button button-dark button-wide" type="submit">Demo-Profil erstellen <span aria-hidden="true">↗</span></button>
          <p className="form-note">Im nächsten Schritt werden Authentifizierung und Datenschutz-Einstellungen mit Supabase verbunden.</p>
        </form>
      </section>
      <footer><span>KnitAlong</span><span>Deutsch · Prototyp · keine Aufzeichnung</span></footer>
    </main>
  );
}
