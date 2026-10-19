"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type AuthMode = "signup" | "signin";
type Profile = { display_name: string; language: string; age_confirmed: boolean; instagram_handle: string | null };

export default function SignInPage() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [savingInstagram, setSavingInstagram] = useState(false);
  const [instagramMessage, setInstagramMessage] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const result = await supabase.from("profiles").select("display_name, language, age_confirmed, instagram_handle").eq("id", userId).maybeSingle();
    if (!result.error && result.data) {
      setProfile(result.data);
      setInstagramHandle(result.data.instagram_handle ?? "");
      return;
    }

    if (result.error) {
      setError(`Profilabfrage fehlgeschlagen (${result.error.code}): ${result.error.message}${result.error.details ? ` Details: ${result.error.details}` : ""}`);
      return;
    }

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;
    const metadata = user?.user_metadata;
    if (!user || metadata?.age_confirmed !== true) {
      setError("Dein Konto ist aktiv, aber es fehlt die bestätigte Altersangabe im Profil. Bitte registriere dich erneut.");
      return;
    }

    const repair = await supabase.from("profiles").insert({
      id: user.id,
      display_name: typeof metadata.display_name === "string" && metadata.display_name.trim() ? metadata.display_name.trim() : "KnitAlong Nutzer",
      age_confirmed: true,
      language: metadata.language === "en" ? "en" : "de",
      instagram_handle: typeof metadata.instagram_handle === "string" && /^[A-Za-z0-9._]{1,30}$/.test(metadata.instagram_handle.replace(/^@/, "")) ? metadata.instagram_handle.replace(/^@/, "") : null,
    }).select("display_name, language, age_confirmed, instagram_handle").single();
    if (repair.error) setError("Dein Konto ist aktiv, aber das Profil konnte nicht angelegt werden.");
    else {
      setProfile(repair.data);
      setInstagramHandle(repair.data.instagram_handle ?? "");
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const { data } = await supabase.auth.getSession();
      if (active && data.session) await loadProfile(data.session.user.id);
    }

    void restoreSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setTimeout(() => void loadProfile(session.user.id), 0);
      } else {
        setProfile(null);
      }
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

    const normalizedInstagramHandle = instagramHandle.trim().replace(/^@/, "");
    if (mode === "signup" && normalizedInstagramHandle && !/^[A-Za-z0-9._]{1,30}$/.test(normalizedInstagramHandle)) {
      setError("Bitte gib einen gültigen Instagram-Nutzernamen ein (Buchstaben, Zahlen, Punkt oder Unterstrich). Das Feld ist optional.");
      return;
    }

    setLoading(true);
    const result = mode === "signup"
      ? await supabase.auth.signUp({ email, password, options: { data: { display_name: name.trim(), age_confirmed: true, instagram_handle: normalizedInstagramHandle || null } } })
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

  async function saveInstagramHandle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInstagramMessage("");
    const normalizedHandle = instagramHandle.trim().replace(/^@/, "");
    if (normalizedHandle && !/^[A-Za-z0-9._]{1,30}$/.test(normalizedHandle)) {
      setInstagramMessage("Bitte prüfe den Nutzernamen. Er darf Buchstaben, Zahlen, Punkte und Unterstriche enthalten.");
      return;
    }

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setInstagramMessage("Bitte melde dich erneut an.");
      return;
    }

    setSavingInstagram(true);
    const result = await supabase.from("profiles").update({ instagram_handle: normalizedHandle || null }).eq("id", data.user.id);
    setSavingInstagram(false);
    if (result.error) {
      setInstagramMessage(`Profil konnte nicht gespeichert werden (${result.error.code}): ${result.error.message}`);
      return;
    }

    setInstagramHandle(normalizedHandle);
    setProfile((current) => current ? { ...current, instagram_handle: normalizedHandle || null } : current);
    setInstagramMessage("Instagram-Profil gespeichert.");
  }

  return (
    <main className="auth-page">
      <nav className="topbar" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="KnitAlong Startseite"><span className="brand-mark" aria-hidden="true">K</span><span>KnitAlong</span></Link>
        <Link className="nav-login" href="/">Zur Übersicht</Link>
      </nav>
      <section className="auth-layout">
        <div className="auth-intro"><p className="eyebrow">Geschlossener Test · 20 Plätze</p><h1>Dein Platz im<br /><em>Wohnzimmer.</em></h1><p>Erstelle dein KnitAlong-Konto. Deine Kamera und dein Mikrofon bleiben aus, bis du sie selbst einschaltest.</p><Link className="text-link" href="/">← Zur Startseite</Link></div>
        {profile ? <section className="auth-form signed-in-panel"><div className="form-heading"><span className="form-step">AKTIV</span><h2>Dein Profil</h2></div><span className="profile-avatar">{profile.display_name.slice(0, 2).toUpperCase()}</span><h3>{profile.display_name}</h3><p className="profile-meta">{profile.language === "de" ? "Deutsch" : profile.language} · 16+ bestätigt</p>{profile.instagram_handle && <a className="instagram-profile-link" href={`https://www.instagram.com/${profile.instagram_handle}/`} target="_blank" rel="noreferrer">Instagram · @{profile.instagram_handle}</a>}<form className="instagram-profile-form" onSubmit={saveInstagramHandle}><label htmlFor="instagram-handle">Instagram-Profil (optional)</label><input id="instagram-handle" name="instagram_handle" value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} placeholder="@deinprofil" maxLength={31} autoComplete="off" /><p className="form-note">Nur dein Nutzername, z. B. @maschenliebe. Kein Passwort oder vollständiger Link.</p>{instagramMessage && <p className="form-message" role="status">{instagramMessage}</p>}<button className="button button-dark button-wide" type="submit" disabled={savingInstagram}>{savingInstagram ? "Wird gespeichert …" : "Instagram-Profil speichern"}</button></form><Link className="button button-dark button-wide" href="/raeume/leise-maschen">Zum Raum <span aria-hidden="true">↗</span></Link><button className="mode-toggle" type="button" onClick={signOut}>Abmelden</button></section> : <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="form-step">01 / 01</span><h2>{mode === "signup" ? "Konto erstellen" : "Willkommen zurück"}</h2></div>
          {mode === "signup" && <><label htmlFor="name">Wie dürfen wir dich nennen?</label><input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dein Anzeigename" autoComplete="nickname" required /></>}
          {mode === "signup" && <><label htmlFor="signup-instagram">Instagram-Profil (optional)</label><input id="signup-instagram" name="instagram_handle" value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} placeholder="@deinprofil" maxLength={31} autoComplete="off" /><p className="form-note instagram-hint">Nur dein Nutzername, z. B. @maschenliebe. Kein Passwort oder vollständiger Link.</p></>}
          <label htmlFor="email">E-Mail-Adresse</label><input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@beispiel.de" autoComplete="email" required />
          <label htmlFor="password">Passwort</label><div className="password-field"><input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 6 Zeichen" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /><button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"} aria-pressed={showPassword}>{showPassword ? "Verbergen" : "Anzeigen"}</button></div>
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
