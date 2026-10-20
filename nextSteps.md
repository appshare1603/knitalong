Raumkarten und Buttons funktional machen. [x]
Eine Raumdetailseite erstellen. [x]
Demo-Login bzw. Testprofil ergänzen. [x]
Raumbeitritt simulieren. [x]
Chat-Oberfläche und Zuschauer-/Teilnehmerstatus darstellen. [x]
Test mit 20 Personen durchführen.
Rückmeldungen zu Verständlichkeit, Raumwahl und gewünschter Nutzung sammeln.

## Technischer Stand

1. [x] Supabase-Projekt anlegen
2. [x] Lokale Entwicklungs- und Testumgebung definieren
3. [x] Authentifizierung einrichten
4. [x] `profiles`-Tabelle und Row-Level Security erstellen
5. [x] Demo-Login durch echten Login ersetzen
6. [x] Räume aus Supabase laden
7. [x] Raumbeitritte speichern
8. [x] Chat mit Supabase Realtime anbinden
9. [ ] Blockieren und Melden ergänzen (spätere Phase)
10. [ ] LiveKit integrieren

### Supabase-Hinweise

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

### Lokale Umgebung

- [x] `.env.example` als sichere Variablenvorlage angelegt
- [ ] `.env.example` lokal nach `.env.local` kopieren
- [ ] Supabase-URL und `anon`-Key in `.env.local` eintragen
- [ ] Prüfen, dass `.env.local` nicht von Git erfasst wird
- [ ] Vercel-Variablen später separat in den Project Settings hinterlegen

Für den ersten geschlossenen Test verwenden wir ein Supabase-Projekt für Entwicklung und Test. Sobald produktive Daten hinzukommen, wird ein separates Produktionsprojekt angelegt. Die echte `.env.local` bleibt ausschließlich auf deinem Rechner; nur `.env.example` darf ins Repository.

### Supabase-Migrationen

Die Projektmigrationen liegen in `supabase/migrations/`. Sie wurden im Supabase SQL Editor ausgeführt; Raumbeitritte werden mit `left_at` historisiert und Chatnachrichten laufen über Supabase Realtime.

### Optionales Instagram-Profil

Die Migration `supabase/migrations/009_profile_instagram_handle.sql` ergänzt `profiles.instagram_handle`. Nach Ausführung im Supabase SQL Editor können Nutzer bei der Registrierung optional einen Handle eintragen und ihn später im Profil bearbeiten. Gespeichert wird nur der Handle, ohne `@`; Passwörter oder vollständige URLs werden nicht angenommen.

### LiveKit-Konfiguration

Für die lokale Entwicklung werden drei Variablen benötigt. Die Server-URL darf öffentlich verwendet werden; API-Key und besonders API-Secret bleiben geheim:

```env
NEXT_PUBLIC_LIVEKIT_URL=wss://dein-projekt.livekit.cloud
LIVEKIT_API_KEY=dein-api-key
LIVEKIT_API_SECRET=dein-api-secret
```

Die Werte gehören zusätzlich in Vercel unter **Settings → Environment Variables** für Preview und Production. `LIVEKIT_API_SECRET` darf niemals mit `NEXT_PUBLIC_` beginnen.

LiveKit-Einrichtung:
- [x] LiveKit-Cloud-Projekt angelegt und Server-URL ermittelt
- [x] Serverseitigen Token-Endpunkt implementiert; er prüft Login und aktiven Raumbeitritt
- [x] Browser-Client und Video-Grid implementiert; Kamera und Mikrofon starten aus
- [ ] Geheimnisse rotieren, weil das API-Secret im Chat offengelegt wurde
- [ ] Rotierte Variablen sicher lokal und in Vercel für Preview und Production setzen
- [ ] Zwei-Nutzer-Test durchführen und Kamera/Mikrofon in unterstützten Browsern prüfen

Die Variablen stehen in `.env.local` und `.env.example`. Das API-Secret wurde im Chat offengelegt: LiveKit-Dashboard → **Keys**: kompromittierten Key widerrufen, neuen Key/Secret erstellen, lokal und in Vercel hinterlegen, dann redeployen. Das Secret niemals in den Chat oder ins Git-Repository übernehmen.

### User-Verwaltung und Visualisierung der angemeldeten Benutzer

#### Umsetzungsplan

1. **Profilfelder und Darstellung festlegen**
	- Migration für Vorname, Nachname und Experience Level ergänzen.
	- Experience Level auf drei UI-Ausprägungen abbilden: Beginner, etwas Erfahrung, viel Erfahrung.
	- Optionales Profilbild ergänzen; ohne Upload wird ein Initialen-Avatar angezeigt.
	- Rollenfeld ergänzen: Standardrolle `Visitor`; Rolle `Admin` wird ausschließlich direkt über Supabase vergeben.
	- E-Mail bleibt in Supabase Auth; Änderungen erfolgen über `auth.updateUser()` mit erforderlicher Bestätigung.
	- Instagram-Handle bleibt optional.
2. **Profilseite ergänzen**
	- Angemeldete Nutzer können erlaubte Profilfelder bearbeiten.
	- Profilbild auswählen, Vorschau anzeigen, ersetzen und wieder entfernen können.
	- Upload auf erlaubte Bildformate und Dateigröße begrenzen; Bild vor dem Upload verkleinern und Metadaten/EXIF entfernen.
	- Bild in Supabase Storage unter einem nutzereigenen Pfad speichern; RLS/Storage-Policies erlauben Änderungen nur dem Eigentümer.
	- `avatar_url` beziehungsweise den Storage-Pfad im Profil aktualisieren; bei Löschen die Datei entfernen und zum Initialen-Avatar zurückkehren.
	- Eingaben validieren und Speichern/Fehlerzustände deutlich anzeigen.
	- E-Mail-Adresse nicht öffentlich darstellen.
	- Rolle anzeigen, aber nicht im Nutzerformular bearbeitbar machen.
3. **Anmeldebutton global zustandsabhängig machen**
	- Ausgeloggt: „Anmelden“.
	- Eingeloggt: „Abmelden“; bei Klick Supabase-Session beenden.
	- Den Auth-Status zentral bereitstellen, damit Navigation und Seiten denselben Zustand verwenden.
4. **Online-Anwesenheit einführen**
	- Supabase Realtime Presence für aktive Sessions verwenden; nicht alle registrierten Konten als „online“ anzeigen.
	- Presence-Eintrag auf Profil-ID, Avatar-URL und freigegebenen Anzeigenamen beschränken; E-Mail und private Stammdaten nie übertragen.
	- Beim Verlassen/Verbindungsabbruch Presence bereinigen und die Avatare auf der Startseite daraus rendern.
5. **Inaktivitäts-Warnung umsetzen**
	- Nach 60 Minuten ohne Aktivität einen StillAlive-Dialog mit 5-Minuten-Countdown anzeigen.
	- Bestätigung setzt den Aktivitätstimer zurück.
	- Ohne Bestätigung lokal abmelden und den Nutzer zurück zur Anmeldung führen.
	- Beim Zurückkehren in einen inaktiven Tab die verstrichene Zeit prüfen; Browser können Timer im Hintergrund verzögern.
6. **Tests und Rollout**
	- Profiländerungen, E-Mail-Bestätigung, Login/Logout und parallele Tabs testen.
	- Prüfen, dass neue Nutzer automatisch `Visitor` erhalten und Nutzer ihre eigene Rolle nicht ändern können.
	- `Admin`-Zuweisung über Supabase testen; Admin-Berechtigungen serverseitig anhand des gespeicherten Rollenwerts prüfen.
	- Avatar-Upload, ungültiges Format/zu große Datei, Ersetzen, Löschen und fehlendes Bild testen.
	- Presence mit zwei Browsern prüfen: Avatare erscheinen nach Login und verschwinden nach Logout/Timeout.
	- Timeout mit verkürzter Testdauer prüfen, danach 60 Minuten/5 Minuten aktivieren.
	- Vor einem öffentlichen Launch Datenschutzhinweise für sichtbare Online-Avatare ergänzen.

#### Festgelegte Profiltrennung

- `display_name` bleibt der separate, öffentliche und nicht bearbeitbare KnitAlong-Name.
- Vorname und Nachname sind optionale, private und vom Nutzer bearbeitbare Stammdaten.
- Vorname und Nachname werden weder in der Online-Liste noch in öffentlichen Profilen angezeigt.
- Die öffentliche Benutzerliste verwendet ausschließlich den freigegebenen `display_name` und Avatar.
- Neue Konten erhalten die Rolle `Visitor` als Standard.
- `Admin` wird ausschließlich manuell in Supabase gesetzt; Nutzer können ihre Rolle nicht selbst ändern.
- Der Umfang der Admin-Funktionen wird später festgelegt; bis dahin keine zusätzlichen Admin-Aktionen freischalten.


### Zurückgestellt

Punkt 9 (Blockieren und Melden) wird zunächst zurückgestellt. Er wird vor einem öffentlichen Betrieb benötigt und in einer späteren Phase als eigenes Moderations- und Sicherheitskonzept umgesetzt.

## Nächste Produktphase: 200 Tester in drei Wochen

### Reihenfolge der Ideen

1. **Anmeldung vereinfachen** – zuerst Registrierung, Fehlermeldungen und Bestätigungsmails auf Mobilgeräten testen; unnötige Felder vermeiden.
2. **Raumbeitritt vereinfachen** – klarer Weg von Startseite → Raum → Beitritt, verständliche Gast-/Login-Zustände und sichtbare Kamera-/Mikrofonkontrolle.
3. **Geschlossener Test mit 20 Personen** – vor größerer Werbung den Kernablauf beobachten und kritische Fehler beheben.
4. **Instagram-Rekrutierung auf 200 Tester ausweiten** – klare Landingpage, kurze Demo und ein eindeutiger Tester-Aufruf.
5. **Verlosung optional** – erst nach Prüfung der Teilnahmebedingungen, Datenschutzangaben und Instagram-Vorgaben. Sie sollte freiwillig sein und nicht die einzige Motivation sein.
6. **Premium-Räume, Newsfeed und gebrandeter Dropshipping-Shop zurückstellen** – erst nach Validierung von Wiederkehr und Nutzung priorisieren.

### Drei-Wochen-Plan

- **Woche 1 – Stabilität und Onboarding:** LiveKit-Secrets rotieren; testen, dass Anmeldung, Raumbeitritt, Chat, Kamera und Verlassen auf Desktop und Mobilgerät funktionieren. Gespräche mit 5–10 Zielgruppenmitgliedern führen. Anmeldung/Beitritt vereinfachen.
- **Woche 2 – geschlossener Pilot:** 20–30 Tester einladen. Sitzungen beobachten, Fehler und Abbrüche dokumentieren. Entscheiden, ob Räume und Video für neue Nutzer selbsterklärend sind. Danach kritische Probleme beheben.
- **Woche 3 – Instagram-Aufruf:** Landingpage und Demo-Clip veröffentlichen, Partnerschaften mit Strick-Accounts/Communities anfragen und Einladungen schrittweise versenden. Ziel: 200 qualifizierte Anmeldungen; getrennt messen, wie viele sich tatsächlich einloggen und an einer Session teilnehmen.

### Messgrößen

- 200 abgeschlossene Tester-Anmeldungen (Zielgröße, keine Garantie)
- Anteil, der die erste Anmeldung abschließt
- Anteil der Angemeldeten, die einem Raum beitreten
- Anteil, die Kamera oder Chat tatsächlich verwenden
- zweite Session innerhalb von sieben Tagen
- technische Fehler, Abbrüche und Supportanfragen

**Empfehlung:** Der nächste sinnvolle Schritt ist nicht der Newsfeed oder Shop, sondern ein durchgängiger mobiler Test des Anmelde- und Raumbeitritts mit einer kleinen Pilotgruppe. Damit vermeiden wir, 200 Personen in einen Ablauf einzuladen, der noch Reibung oder LiveKit-Probleme hat.