"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AuthMode = "signup" | "signin";
type Profile = { display_name: string; language: string; age_confirmed: boolean };

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const result = await supabase.from("profiles").select("display_name, language, age_confirmed").eq("id", userId).single();
    if (result.error) setError("Dein Konto ist aktiv, aber das Profil konnte nicht geladen werden.");
    else setProfile(result.data);
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) await loadProfile(data.session.user.id);
    }

    void restoreSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (mode === "signup" && !isAdult) {
      setError("Bitte bestätige, dass du mindestens 16 Jahre alt bist.");
      return;
    }

    setLoading(true);
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim(), age_confirmed: true } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signin" && result.data.user) await loadProfile(result.data.user.id);
    setMessage(mode === "signup"
      ? "Konto angelegt. Bitte prüfe deine E-Mail zur Bestätigung."
      : "Anmeldung erfolgreich. Du kannst jetzt einen Raum besuchen.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMessage("Du bist abgemeldet.");
    setProfile(null);
  }

  return (
    <main className="auth-page">
      <nav className="topbar" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
        <Link className="nav-login" href="/">Zur Übersicht</Link>
      </nav>
      <section className="auth-layout">
        <div className="auth-intro"><p className="eyebrow">Geschlossener Test · 20 Plätze</p><h1>Dein Platz im<br /><em>Wohnzimmer.</em></h1><p>Erstelle dein KnitAlong-Konto. Deine Kamera und dein Mikrofon bleiben aus, bis du sie selbst einschaltest.</p><Link className="text-link" href="/">← Zur Startseite</Link></div>
        {profile ? <section className="auth-form signed-in-panel"><div className="form-heading"><span className="form-step">AKTIV</span><h2>Dein Profil</h2></div><span className="profile-avatar">{profile.display_name.slice(0, 2).toUpperCase()}</span><h3>{profile.display_name}</h3><p className="profile-meta">{profile.language === "de" ? "Deutsch" : profile.language} · 16+ bestätigt</p><Link className="button button-dark button-wide" href="/raeume/leise-maschen">Zum Raum <span aria-hidden="true">↗</span></Link><button className="mode-toggle" type="button" onClick={signOut}>Abmelden</button></section> : <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="form-step">01 / 01</span><h2>{mode === "signup" ? "Konto erstellen" : "Willkommen zurück"}</h2></div>
          {mode === "signup" && <><label htmlFor="name">Wie dürfen wir dich nennen?</label><input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dein Anzeigename" autoComplete="nickname" required /></>}
          <label htmlFor="email">E-Mail-Adresse</label><input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@beispiel.de" autoComplete="email" required />
          <label htmlFor="password">Passwort</label><input id="password" name="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 6 Zeichen" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
          {mode === "signup" && <label className="check-row"><input type="checkbox" checked={isAdult} onChange={(event) => setIsAdult(event.target.checked)} required /><span>Ich bin mindestens 16 Jahre alt.</span></label>}
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          {message && <p className="form-message form-success" role="status">{message}</p>}
          <button className="button button-dark button-wide" type="submit" disabled={loading}>{loading ? "Wird verarbeitet ..." : mode === "signup" ? "Konto erstellen" : "Anmelden"} <span aria-hidden="true">↗</span></button>
          <button className="mode-toggle" type="button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setMessage(""); }}>{mode === "signup" ? "Ich habe bereits ein Konto" : "Neues Konto erstellen"}</button>
          <p className="form-note">Deine Zugangsdaten werden direkt von Supabase verarbeitet. KnitAlong speichert kein Passwort.</p>
        </form>}
      </section>
      <footer><span>KnitAlong</span><span>Deutsch · DSGVO · keine Aufzeichnung</span></footer>
    </main>
  );
}
