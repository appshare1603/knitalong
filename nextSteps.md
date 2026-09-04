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
9. [ ] Blockieren und Melden ergänzen
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