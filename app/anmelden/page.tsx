"use client";

import Link from "next/link";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import SiteHeader from "@/components/SiteHeader";
import { useAuth } from "@/components/AuthProvider";

type AuthMode = "signup" | "signin" | "recovery";
type Profile = { id: string; display_name: string; language: string; age_confirmed: boolean; instagram_handle: string | null; avatar_url: string | null; experience_level: string | null; role: "Visitor" | "Admin" };

export default function SignInPage() {
  const { refreshProfile } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [savingInstagram, setSavingInstagram] = useState(false);
  const [instagramMessage, setInstagramMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    const [result, privateResult] = await Promise.all([
      supabase.from("profiles").select("id, display_name, language, age_confirmed, instagram_handle, avatar_url, experience_level, role").eq("id", userId).maybeSingle(),
      supabase.from("private_profiles").select("first_name, last_name").eq("user_id", userId).maybeSingle(),
    ]);
    if (!result.error && result.data) {
      setProfile(result.data as Profile);
      setInstagramHandle(result.data.instagram_handle ?? "");
      setExperienceLevel(result.data.experience_level ?? "");
      setFirstName(privateResult.data?.first_name ?? "");
      setLastName(privateResult.data?.last_name ?? "");
      setNewEmail((await supabase.auth.getUser()).data.user?.email ?? "");
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
      avatar_url: null,
      experience_level: null,
      role: "Visitor",
    }).select("id, display_name, language, age_confirmed, instagram_handle, avatar_url, experience_level, role").single();
    if (repair.error) setError("Dein Konto ist aktiv, aber das Profil konnte nicht angelegt werden.");
    else {
      setProfile(repair.data as Profile);
      setInstagramHandle(repair.data.instagram_handle ?? "");
      await supabase.from("private_profiles").upsert({ user_id: user.id }, { onConflict: "user_id" });
      setNewEmail(user.email ?? "");
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

    if (mode === "recovery") {
      setLoading(true);
      try {
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/kennwort-zuruecksetzen`,
        });
        if (recoveryError) {
          setError("Die Anfrage konnte nicht verarbeitet werden. Bitte versuche es später erneut.");
        } else {
          setMessage("Falls ein Konto mit dieser E-Mail-Adresse existiert, erhältst du einen Link zum Zurücksetzen deines Kennworts.");
        }
      } catch {
        setError("Die Anfrage konnte nicht verarbeitet werden. Bitte versuche es später erneut.");
      } finally {
        setLoading(false);
      }
      return;
    }

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
    await supabase.auth.signOut({ scope: "local" });
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

  function handleAvatarFile(file: File | undefined) {
    setProfileMessage("");
    if (!file) return;
    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProfileMessage("Bitte wähle ein JPEG-, PNG- oder WebP-Bild.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileMessage("Das Bild darf maximal 5 MB groß sein.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setRemoveAvatar(false);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user || !profile) {
      setProfileMessage("Bitte melde dich erneut an.");
      setSavingProfile(false);
      return;
    }

    let avatarPath = profile.avatar_url;
    let uploadedPath: string | null = null;
    if (avatarFile) {
      try {
        const bitmap = await createImageBitmap(avatarFile);
        const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(bitmap.width * scale));
        canvas.height = Math.max(1, Math.round(bitmap.height * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Bildbearbeitung ist in diesem Browser nicht verfügbar.");
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        const webp = await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Bild konnte nicht verarbeitet werden.")), "image/webp", 0.82));
        const path = `${authData.user.id}/${crypto.randomUUID()}.webp`;
        const upload = await supabase.storage.from("avatars").upload(path, webp, { contentType: "image/webp", upsert: false });
        if (upload.error) throw upload.error;
        avatarPath = path;
        uploadedPath = path;
      } catch (uploadError) {
        setProfileMessage(uploadError instanceof Error ? uploadError.message : "Profilbild konnte nicht hochgeladen werden.");
        setSavingProfile(false);
        return;
      }
    } else if (removeAvatar) {
      avatarPath = null;
    }

    const privateUpdate = await supabase.from("private_profiles").upsert({ user_id: authData.user.id, first_name: firstName.trim() || null, last_name: lastName.trim() || null }, { onConflict: "user_id" });
    if (privateUpdate.error) {
      if (uploadedPath) await supabase.storage.from("avatars").remove([uploadedPath]);
      setProfileMessage(`Private Profildaten konnten nicht gespeichert werden (${privateUpdate.error.code}): ${privateUpdate.error.message}`);
      setSavingProfile(false);
      return;
    }

    const publicUpdate = await supabase.from("profiles").update({ experience_level: experienceLevel || null, avatar_url: avatarPath }).eq("id", authData.user.id);
    if (publicUpdate.error) {
      if (uploadedPath) await supabase.storage.from("avatars").remove([uploadedPath]);
      setProfileMessage(`Profil konnte nicht gespeichert werden (${publicUpdate.error.code}): ${publicUpdate.error.message}`);
      setSavingProfile(false);
      return;
    }

    if ((avatarFile || removeAvatar) && profile.avatar_url) await supabase.storage.from("avatars").remove([profile.avatar_url]);
    setProfile((current) => current ? { ...current, avatar_url: avatarPath, experience_level: experienceLevel || null } : current);
    await refreshProfile();
    setAvatarFile(null);
    setAvatarPreview("");
    setRemoveAvatar(false);
    setProfileMessage("Profil gespeichert.");
    setSavingProfile(false);
  }

  async function updateEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailMessage("");
    const { error: updateError } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailMessage(updateError ? updateError.message : "Bestätigungslink an die neue E-Mail-Adresse gesendet. Die Änderung wird erst nach Bestätigung wirksam.");
  }

  return (
    <main className="auth-page">
      <SiteHeader />
      <section className="auth-layout">
        <div className="auth-intro"><p className="eyebrow">Geschlossener Test · 20 Plätze</p><h1>Dein Platz im<br /><em>Wohnzimmer.</em></h1><p>Erstelle dein KnitAlong-Konto. Deine Kamera und dein Mikrofon bleiben aus, bis du sie selbst einschaltest.</p><Link className="text-link" href="/">← Zur Startseite</Link></div>
        {profile ? <section className="auth-form signed-in-panel"><div className="form-heading"><span className="form-step">{profile.role.toUpperCase()}</span><h2>Dein Profil</h2></div><div className="profile-avatar profile-avatar-large" style={avatarPreview || profile.avatar_url ? { backgroundImage: `url(${avatarPreview || supabase.storage.from("avatars").getPublicUrl(profile.avatar_url ?? "").data.publicUrl})` } : undefined}>{!profile.avatar_url && !avatarPreview ? profile.display_name.slice(0, 2).toUpperCase() : null}</div><h3>{profile.display_name}</h3><p className="profile-meta">Öffentlicher Display-Name · {profile.role}</p>{profile.instagram_handle && <a className="instagram-profile-link" href={`https://www.instagram.com/${profile.instagram_handle}/`} target="_blank" rel="noreferrer">Instagram · @{profile.instagram_handle}</a>}
          <form className="instagram-profile-form account-profile-form" onSubmit={saveProfile}><p className="eyebrow">Private Angaben</p><label htmlFor="first-name">Vorname (privat, optional)</label><input id="first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} autoComplete="given-name" /><label htmlFor="last-name">Nachname (privat, optional)</label><input id="last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} autoComplete="family-name" /><label htmlFor="experience-level">Strickerfahrung</label><select id="experience-level" value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)}><option value="">Bitte auswählen</option><option value="beginner">Beginner</option><option value="some_experience">Etwas Erfahrung</option><option value="experienced">Viel Erfahrung</option></select><label htmlFor="avatar-file">Profilbild (optional)</label><input id="avatar-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => handleAvatarFile(event.target.files?.[0])} />{profile.avatar_url && <label className="check-row avatar-remove"><input type="checkbox" checked={removeAvatar} onChange={(event) => { setRemoveAvatar(event.target.checked); if (event.target.checked) { setAvatarFile(null); setAvatarPreview(""); } }} /><span>Profilbild entfernen</span></label>}<p className="form-note">Bild wird auf maximal 512×512 Pixel verkleinert, als WebP gespeichert und Metadaten werden verworfen. Vor- und Nachname bleiben privat.</p>{profileMessage && <p className="form-message" role="status">{profileMessage}</p>}<button className="button button-dark button-wide" type="submit" disabled={savingProfile}>{savingProfile ? "Wird gespeichert …" : "Profil speichern"}</button></form>
          <form className="instagram-profile-form" onSubmit={saveInstagramHandle}><label htmlFor="instagram-handle">Instagram-Profil (optional)</label><input id="instagram-handle" name="instagram_handle" value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} placeholder="@deinprofil" maxLength={31} autoComplete="off" /><p className="form-note">Nur dein Nutzername; kein Passwort oder vollständiger Link.</p>{instagramMessage && <p className="form-message" role="status">{instagramMessage}</p>}<button className="button button-dark button-wide" type="submit" disabled={savingInstagram}>{savingInstagram ? "Wird gespeichert …" : "Instagram-Profil speichern"}</button></form>
          <form className="instagram-profile-form" onSubmit={updateEmail}><label htmlFor="new-email">E-Mail-Adresse ändern</label><input id="new-email" type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} autoComplete="email" required /><p className="form-note">Die neue Adresse wird erst nach Bestätigung wirksam.</p>{emailMessage && <p className="form-message" role="status">{emailMessage}</p>}<button className="button button-dark button-wide" type="submit">Bestätigungslink senden</button></form>
          <Link className="button button-dark button-wide" href="/raeume/leise-maschen">Zum Raum <span aria-hidden="true">↗</span></Link><button className="mode-toggle" type="button" onClick={signOut}>Abmelden</button></section> : <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-heading"><span className="form-step">01 / 01</span><h2>{mode === "signup" ? "Konto erstellen" : mode === "recovery" ? "Kennwort vergessen" : "Willkommen zurück"}</h2></div>
          {mode === "signup" && <><label htmlFor="name">Wie dürfen wir dich nennen?</label><input id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Dein Anzeigename" autoComplete="nickname" required /></>}
          {mode === "signup" && <><label htmlFor="signup-instagram">Instagram-Profil (optional)</label><input id="signup-instagram" name="instagram_handle" value={instagramHandle} onChange={(event) => setInstagramHandle(event.target.value)} placeholder="@deinprofil" maxLength={31} autoComplete="off" /><p className="form-note instagram-hint">Nur dein Nutzername, z. B. @maschenliebe. Kein Passwort oder vollständiger Link.</p></>}
          <label htmlFor="email">E-Mail-Adresse</label><input id="email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="du@beispiel.de" autoComplete="email" required />
          {mode !== "recovery" && <><label htmlFor="password">Passwort</label><div className="password-field"><input id="password" name="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 6 Zeichen" minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} required /><button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"} aria-pressed={showPassword}>{showPassword ? "Verbergen" : "Anzeigen"}</button></div></>}
          {mode === "signin" && <button className="forgot-password" type="button" onClick={() => { setMode("recovery"); setPassword(""); setError(""); setMessage(""); }}>Kennwort vergessen?</button>}
          {mode === "recovery" && <p className="form-note recovery-note">Gib deine E-Mail-Adresse ein. Du erhältst einen Link, mit dem du ein neues Kennwort festlegen kannst.</p>}
          {mode === "signup" && <label className="check-row"><input type="checkbox" checked={isAdult} onChange={(event) => setIsAdult(event.target.checked)} required /><span>Ich bin mindestens 16 Jahre alt.</span></label>}
          {error && <p className="form-message form-error" role="alert">{error}</p>}
          {message && <p className="form-message form-success" role="status">{message}</p>}
          <button className="button button-dark button-wide" type="submit" disabled={loading}>{loading ? "Wird verarbeitet ..." : mode === "signup" ? "Konto erstellen" : mode === "recovery" ? "Link senden" : "Anmelden"} <span aria-hidden="true">↗</span></button>
          <button className="mode-toggle" type="button" disabled={loading} onClick={() => { setMode(mode === "signup" || mode === "recovery" ? "signin" : "signup"); setError(""); setMessage(""); }}>{mode === "signup" ? "Ich habe bereits ein Konto" : mode === "recovery" ? "Zurück zur Anmeldung" : "Neues Konto erstellen"}</button>
          <p className="form-note">Deine Zugangsdaten werden direkt von Supabase verarbeitet. KnitAlong speichert kein Passwort.</p>
        </form>}
      </section>
      <footer><span>KnitAlong</span><span>Deutsch · DSGVO · keine Aufzeichnung</span></footer>
    </main>
  );
}
