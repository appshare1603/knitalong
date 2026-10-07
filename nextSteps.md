Raumkarten und Buttons funktional machen. [x]
Eine Raumdetailseite erstellen. [x]
Demo-Login bzw. Testprofil ergänzen. [x]
Raumbeitritt simulieren. [x]
Chat-Oberfläche und Zuschauer-/Teilnehmerstatus darstellen. [x]
Test mit 20 Personen durchführen.
Rückmeldungen zu Verständlichkeit, Raumwahl und gewünschter Nutzung sammeln.

## Supabase-Anbindung

1. [ ] Supabase-Projekt anlegen
2. [x] Lokale Entwicklungs- und Testumgebung definieren
3. [x] Authentifizierung einrichten
4. [x] `profiles`-Tabelle und Row-Level Security erstellen
5. [x] Demo-Login durch echten Login ersetzen
6. [x] Räume aus Supabase laden
7. [ ] Raumbeitritte speichern
8. [ ] Chat mit Supabase Realtime anbinden
9. [ ] Blockieren und Melden ergänzen (spätere Phase)
10. [ ] LiveKit integrieren

### Start mit Punkt 1

1. Öffne [supabase.com](https://supabase.com) und melde dich an oder erstelle ein Konto.
2. Wähle im Dashboard **New project**.
3. Lege eine Organisation beziehungsweise ein persönliches Projekt an.
4. Verwende als Projektnamen zum Beispiel `knitalong-test`.
5. Wähle eine europäische Region, möglichst nahe an den späteren Testteilnehmern.
6. Erzeuge ein starkes Datenbankpasswort und speichere es nur in einem Passwortmanager.
7. Erstelle das Projekt und warte, bis die Datenbank bereit ist.
8. Öffne danach **Project Settings → API** und notiere nur die Projekt-URL und den öffentlichen `anon`-Key für die spätere lokale Konfiguration.

Das Datenbankpasswort und der `service_role`-Key dürfen nicht in GitHub, in `NEXT_PUBLIC_`-Variablen oder in den Chat gelangen. Für den ersten Test genügt ein einzelnes Supabase-Projekt. Vor der echten Datenmodellierung sollten wir festlegen, ob Entwicklungs- und Testdaten getrennt werden.

Hinweis zur Berechtigung: Zusätzlich zu RLS benötigt PostgreSQL Tabellenrechte. Falls beim Profilabruf `42501` erscheint, führe `supabase/migrations/003_profile_grants.sql` im SQL Editor aus. Die Migration gibt der Rolle `authenticated` nur `select`, `insert` und `update` auf `profiles`. Für die öffentliche Raumübersicht führe zusätzlich `supabase/migrations/004_rooms_public_grant.sql` aus; diese gibt `anon` ausschließlich Leserechte auf öffentliche Raumdaten.

Für angemeldete Nutzer muss zusätzlich `supabase/migrations/006_rooms_authenticated_grant.sql` ausgeführt werden. Sie gibt `authenticated` ausschließlich Leserechte auf `rooms`.

### Punkt 2: Lokale Umgebung

- [x] `.env.example` als sichere Variablenvorlage angelegt
- [ ] `.env.example` lokal nach `.env.local` kopieren
- [ ] Supabase-URL und `anon`-Key in `.env.local` eintragen
- [ ] Prüfen, dass `.env.local` nicht von Git erfasst wird
- [ ] Vercel-Variablen später separat in den Project Settings hinterlegen

Für den ersten geschlossenen Test verwenden wir ein Supabase-Projekt für Entwicklung und Test. Sobald produktive Daten hinzukommen, wird ein separates Produktionsprojekt angelegt. Die echte `.env.local` bleibt ausschließlich auf deinem Rechner; nur `.env.example` darf ins Repository.

### Punkt 4: Migration ausführen

Die Migration liegt unter `supabase/migrations/001_profiles.sql`. Führe sie so aus:

1. Öffne im Supabase-Dashboard den **SQL Editor**.
2. Wähle **New query**.
3. Öffne die lokale Datei `supabase/migrations/001_profiles.sql` und kopiere ihren vollständigen Inhalt in den SQL Editor.
4. Klicke auf **Run**.
5. Prüfe unter **Table Editor**, ob `public.profiles` vorhanden ist.
6. Prüfe unter **Authentication → Users**, ob ein Testkonto angelegt werden kann.

Die Migration aktiviert Row-Level Security, erlaubt authentifizierten Nutzern das Lesen von Profilen und beschränkt Anlegen bzw. Ändern auf das jeweils eigene Profil. Neue Auth-Nutzer erhalten automatisch ein Profil aus den Registrierungsdaten. Punkt 4 wird erst nach erfolgreicher Ausführung im Dashboard mit `[x]` markiert.

### Punkt 7: Raumbeitritte

Die Migration `supabase/migrations/005_room_members.sql` legt `room_members` an und gibt authentifizierten Nutzern Rechte für ihre eigenen Beitritte. Führe sie im Supabase SQL Editor aus. Danach kann ein angemeldeter Nutzer beim Betreten eines Raums als Zuschauer gespeichert werden; beim Verlassen wird `left_at` gesetzt. Nicht angemeldete Besucher bleiben im lokalen Demo-Modus.

### Punkt 8: Chat mit Supabase Realtime

Die Migration `supabase/migrations/008_messages.sql` legt `messages` an, aktiviert RLS und registriert die Tabelle für Supabase Realtime. Führe sie im Supabase SQL Editor aus. Danach werden Chatnachrichten für aktive Raumteilnehmer geladen, gespeichert und live an weitere Teilnehmer verteilt. Nicht angemeldete Besucher können weiterhin nur den lokalen Demo-Raum sehen.

### LiveKit-Konfiguration

Für die lokale Entwicklung werden drei Variablen benötigt. Die Server-URL darf öffentlich verwendet werden; API-Key und besonders API-Secret bleiben geheim:

```env
NEXT_PUBLIC_LIVEKIT_URL=wss://dein-projekt.livekit.cloud
LIVEKIT_API_KEY=dein-api-key
LIVEKIT_API_SECRET=dein-api-secret
```

Die Werte gehören zusätzlich in Vercel unter **Settings → Environment Variables** für Preview und Production. `LIVEKIT_API_SECRET` darf niemals mit `NEXT_PUBLIC_` beginnen.

LiveKit-Einrichtung:
- [x] LiveKit-Cloud-Projekt angelegt
- [x] Server-URL im Dashboard gefunden
- [ ] Server-URL in `.env.local` eintragen
- [ ] API-Key und API-Secret im LiveKit-Dashboard erstellen und lokal eintragen
- [ ] Dieselben drei Variablen in Vercel für Preview und Production setzen
- [x] Serverseitigen Token-Endpunkt implementieren; er prüft Login und aktiven Raumbeitritt
- [x] Browser-Client und Video-Grid implementieren; Kamera und Mikrofon starten aus
- [ ] Credentials lokal und in Vercel testen, danach Zwei-Nutzer-Test durchführen

Die lokalen Variablen stehen bereits leer in `.env.local`. Fülle sie dort direkt im Editor aus. Im LiveKit-Dashboard findest du den API-Key und das Secret in den Projekt-Einstellungen unter **Keys**. Hinterlege dieselben Namen in Vercel unter **Settings → Environment Variables** für Preview und Production und löse danach einen Redeploy aus. Das API-Secret niemals in den Chat oder in Git einfügen.

### Zurückgestellt

Punkt 9 (Blockieren und Melden) wird zunächst zurückgestellt. Er wird vor einem öffentlichen Betrieb benötigt und in einer späteren Phase als eigenes Moderations- und Sicherheitskonzept umgesetzt.