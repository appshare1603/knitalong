"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    // getSession waits for Supabase to process the recovery link on page load.
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setEmail(data.session?.user.email ?? null);
      setChecking(false);
    }).catch(() => {
      if (active) setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setEmail(session?.user.email ?? null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("Die Kennwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
      } else {
        setPassword("");
        setConfirmation("");
        setSaved(true);
      }
    } catch {
      setError("Das Kennwort konnte nicht geändert werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <SiteHeader />
      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">KnitAlong · Dein Konto</p>
          <h1>Zurück ins<br /><em>Wohnzimmer.</em></h1>
          <p>Wähle ein neues Kennwort für dein Konto.</p>
          <Link className="text-link" href="/">← Zur Startseite</Link>
        </div>
        <section className="auth-form">
          <div className="form-heading"><span className="form-step">01 / 01</span><h2>Kennwort zurücksetzen</h2></div>
          {checking ? <p role="status">Der Link wird geprüft …</p> : saved ? (
            <><p className="form-success" role="status">Dein Kennwort wurde geändert.</p><Link className="button button-dark button-wide" href="/anmelden">Weiter zum Konto</Link></>
          ) : !email ? (
            <><p className="form-error" role="alert">Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.</p><Link className="button button-dark button-wide" href="/anmelden">Zur Anmeldung</Link></>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="recovery-account">Kennwort ändern für: <strong>{email}</strong></p>
              <label htmlFor="new-password">Neues Kennwort</label>
              <input id="new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} autoComplete="new-password" required />
              <label htmlFor="confirm-password">Neues Kennwort wiederholen</label>
              <input id="confirm-password" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={6} autoComplete="new-password" required />
              {error && <p className="form-message form-error" role="alert">{error}</p>}
              <button className="button button-dark button-wide" type="submit" disabled={loading}>{loading ? "Wird gespeichert …" : "Kennwort speichern"}</button>
            </form>
          )}
        </section>
      </section>
      <footer><span>KnitAlong</span><span>Deutsch · DSGVO · keine Aufzeichnung</span></footer>
    </main>
  );
}