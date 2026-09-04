# KnitAlong - Zusammenfassung und Bewertung

## Grundlage

Diese Zusammenfassung basiert auf `init.md` sowie `answer1.md` bis `answer7.md` und `answer8_costs.md`. Die Dateien beschreiben ein Konzept und einen möglichen MVP, enthalten aber noch keine Implementierung.

## 1. Ausgangsidee und Ziel

KnitAlong soll eine Community-App für Strickende werden. Im Mittelpunkt steht gemeinsames Handarbeiten in Echtzeit: Nutzer können ihr aktuelles Tun per Kamera zeigen, anderen zusehen und sich über verschiedene Chat-Formate austauschen. Die Kamera-Perspektive soll frei wählbar sein, etwa auf Gesicht oder Hände; Filter sollen Gestaltung und Anonymität unterstützen.

Der erste Bereich ist Stricken. Die Architektur soll später auf weitere DIY-Themen wie Häkeln, Nähen, Töpfern oder Malen erweitert werden können. Eine optionale Karte soll grob anzeigen, wo sich Online-Nutzer befinden, um digitale und möglicherweise reale Treffen zu unterstützen.

## 2. Bisherige Schritte und Ergebnisse

### Schritt 1: Chancen- und Problemprüfung

Als Chancen wurden eine engagierte Strick- und DIY-Zielgruppe, der soziale Nutzen von Body-Doubling sowie die niedrigere Einstiegshürde durch einen reinen Zuschauer- bzw. Zuhörmodus identifiziert. Die Positionierung als digitales "Wohnzimmer" wurde als erfolgversprechender bewertet als eine allgemeine Streaming-Plattform.

Wesentliche Risiken wurden ebenfalls erkannt:

- Viele parallele Videostreams erzeugen hohe Bandbreiten-, Akku- und Infrastrukturkosten.
- Eine Standortkarte kann Privatsphäre und Sicherheit gefährden.
- Live-Video benötigt Moderation, Melde- und Blockierfunktionen von Beginn an.

Als erste technische Begrenzung wurden etwa 4 bis 8 aktive Videostreams pro Raum vorgeschlagen.

### Schritt 2: Monetarisierung

Der Ansatz ist zunächst kostenloses Community-Wachstum. Als spätere Einnahmequellen wurden vorgeschlagen:

- Freemium-Funktionen für Power-User und Raumveranstalter
- Trinkgeld bzw. In-App-Währung für hilfreiche Creator
- Affiliate-Links für Garn und Zubehör
- Bezahlte Masterclasses und VIP-Räume
- Marktplatz für digitale Strickanleitungen

Damit wurden mehrere denkbare Modelle gesammelt. Eine Entscheidung für ein Modell, Zielgruppenvalidierung und eine Kalkulation der Margen stehen noch aus.

### Schritt 3: MVP-Anforderungen und Technologie

Der MVP umfasst laut den Unterlagen:

- Registrierung per E-Mail/Passwort oder Social Login
- Profil mit Avatar, Name, Erfahrungsstufe und bevorzugten Techniken
- Erstellen, Finden und Beitreten zu thematisch markierten Räumen
- Aktiver Videomodus oder passiver Zuschauer-/Zuhörermodus
- 4 bis 6 aktive Video-Feeds pro Raum als empfohlene Begrenzung
- Wahl zwischen Front- und Hauptkamera sowie Mikrofonsteuerung
- Raum-Chat und schnelle Reaktionen
- Standortfreigabe nur per Opt-in und nur grob auf Stadt-/Regionsebene
- Melden, Blockieren und Host-Rechte zum Stummschalten oder Entfernen

Als Start-Stack wurde vorgeschlagen:

- Flutter für iOS und Android
- Supabase für Authentifizierung, PostgreSQL und Realtime
- LiveKit Cloud für WebRTC-Video und Audio
- Mapbox oder OpenStreetMap für Karten
- `flutter_bloc`, `permission_handler` und `flutter_map` als mögliche Flutter-Abhängigkeiten

Für Supabase wurden zunächst `profiles` und `rooms` als Datenbanktabellen skizziert. Für LiveKit wurde ein kurzlebiger Token über eine Supabase Edge Function vorgesehen. Die konkreten Datenbankregeln, Rollen, Berechtigungen und der Umgang mit Chatdaten sind noch nicht beschrieben.

### Schritt 4: UI/UX und Nutzerfluss

Der Video-Raum wurde als mobiles Kachel-Grid mit 2 bis maximal 6 aktiven Kameras skizziert. Vorgesehen sind ein vergrößerbares Video, eine Projektanzeige, die Zahl der Zuhörer, ein Chat-Overlay und gut erreichbare Steuerungen für Kamera, Mikrofon, Chat, Reaktionen und Meldungen.

Der vorgeschlagene Nutzerfluss lautet:

1. App entdecken und installieren
2. Konto und Profil anlegen
3. Interessen wählen und Standort optional freigeben
4. Aktive Räume auf dem Dashboard entdecken oder einen Raum erstellen
5. Aktiv per Video oder passiv als Zuschauer teilnehmen
6. Chatten, reagieren, Raum verlassen und anderen Nutzern folgen bzw. Anfragen senden

Die UX-Idee ist nachvollziehbar und auf belegte Hände ausgerichtet. Es fehlen jedoch noch konkrete Accessibility-Anforderungen, Moderationsabläufe, Fehlerzustände, Onboarding-Texte und eine Entscheidung, ob Karte und Raumliste tatsächlich gemeinsam auf dem Startbildschirm erscheinen sollen.

### Schritt 5: Technische Einrichtung und Veröffentlichung

Als nächster technischer Ablauf wurde ein Flutter-Projekt mit den genannten Paketen, ein Supabase-Projekt, eine LiveKit-Integration mit Token-Service und anschließend ein Flutter-LiveKit-Client beschrieben.

Für iOS wurden Apple Developer Program, App Store Connect und TestFlight genannt. Codemagic oder GitHub Actions sollen den Build automatisieren. Als wichtige Store-Voraussetzungen wurden Berechtigungsbegründungen, ein Review-Testkonto und eine Privacy-Policy genannt.

Der beschriebene Weg ist grundsätzlich praktikabel. Die Beispielcodes sind jedoch nur Startpunkte: Es fehlen unter anderem sichere Eingabevalidierung, Fehlerbehandlung, Identitäts- und Berechtigungsprüfung beim Token-Service, sauberes Lifecycle-Management der Streams und eine konkrete Persistierung der Chat- und Raumereignisse.

### Schritt 6: Wettbewerb

Als direkte oder angrenzende Vergleichsangebote wurden Knit&Note, knitCompanion, Ravelry, Knit Collage, Focusmate, Flow Club, Deepwrk, Discord, Twitch und TikTok Live genannt.

Die zentrale Differenzierung lautet: Bestehende Strick-Apps konzentrieren sich überwiegend auf Projekte, Anleitungen oder Materialverwaltung; allgemeine Video- und Body-Doubling-Dienste bieten keine spezialisierte DIY-Community. KnitAlong soll die Kombination aus gegenseitigem Live-Handarbeiten, thematischen Räumen und niedrigschwelliger sozialer Nähe besetzen.

Die Wettbewerbsbewertung ist als Hypothese nützlich, aber noch keine Marktanalyse. Aussagen zu fehlenden Funktionen, Nutzerzahlen, aktueller Produktentwicklung und Zahlungsbereitschaft müssen vor Produktentscheidungen überprüft werden.

### Schritt 7: Kosten

Die Unterlagen unterscheiden zwischen MVP/Alpha und produktivem Betrieb. Für Entwicklung und kleine Tests werden kostenlose Kontingente von Supabase, LiveKit und CI/CD angenommen. Genannt werden außerdem:

- Apple Developer Program: ungefähr 99 US-Dollar pro Jahr
- Google Play Console: ungefähr 25 US-Dollar einmalig
- Domain: ungefähr 10 bis 15 Euro pro Jahr
- Supabase Pro: ungefähr 25 US-Dollar pro Monat
- LiveKit: abhängig von Teilnehmerminuten und Tarif

Als grobe Größenordnung werden für den Start 0 Euro monatliche Infrastrukturkosten, zum Store-Test etwa 100 bis 110 Euro einmalig, für den Launch etwa 25 bis 75 Euro monatlich und bei Wachstum etwa 150 bis 300 Euro monatlich genannt.

Diese Zahlen sind nur Orientierungswerte. Anbieterpreise, enthaltene Free-Tiers, regionale Steuern, Audio-/Videobandbreite, Speicherung, Push-Dienste, Moderation, Support und mögliche Kosten für Karten- bzw. CI/CD-Nutzung müssen aktuell nachgerechnet werden. Besonders die Videoannahmen sollten mit realistischen Raumgrößen, Zuschauerzahlen, Auflösungen und Session-Dauern simuliert werden.

## 3. Gesamteinschätzung

Die Idee hat eine plausible Nische: Das soziale gemeinsame Handarbeiten ist klarer und emotionaler als eine reine Projektverwaltungs-App und zugleich fokussierter als Discord oder allgemeine Livestreaming-Plattformen. Ein MVP mit kleinen Räumen, optionalem Zuschauerstatus, Text-Chat und starker Sicherheitsbasis ist grundsätzlich realistisch.

Die Erfolgschance hängt allerdings weniger von der bloßen technischen Machbarkeit als von drei noch ungeprüften Punkten ab:

1. Gibt es genügend Nutzer, die regelmäßig gleichzeitig teilnehmen wollen?
2. Ist das Format gegenüber Discord, bestehenden Knit-Alongs und Video-Calls deutlich bequemer?
3. Lassen sich Datenschutz, Moderation und Videokosten bei wachsender Nutzung dauerhaft beherrschen?

Die empfohlene Reihenfolge ist deshalb: Zielgruppe befragen, Nutzungshypothesen mit einem kleinen Prototyp testen, Kosten und Datenschutz konkretisieren und erst danach die technische Implementierung festlegen.

## 4. Festgelegte Richtung

Die folgenden Entscheidungen wurden nach der ersten Bewertung ergänzt:

- **Zielmarkt und Sprache:** Start im deutschsprachigen Raum. Die Internationalisierung wird vorbereitet, insbesondere durch übersetzbare UI-Texte, lokalisierbare Datums-/Zeitformate und keine fest in den Code eingebauten deutschen Texte.
- **Plattform:** Zunächst ausschließlich Web als responsive Web-App bzw. PWA. Eine native iOS-App bleibt eine spätere Option.
- **Primäre Nutzung:** Zuerst stilles gemeinsames Stricken mit Chat. Danach kostenpflichtige Beratung durch qualifizierte Premium-Nutzer und von Premium-Nutzern angebotene Events.
- **Raumregeln:** Öffentliche und private Räume, Einladungen, Passwörter, Altersgrenzen sowie konfigurierbare Teilnehmerlimits sollen unterstützt werden. Das Mindestalter beträgt 16 Jahre. Für den MVP sollten davon nur die für den Testbetrieb nötigen Varianten aktiviert werden.
- **Datenschutz:** Betrieb nach DSGVO-Grundsätzen mit Datenminimierung, transparenter Einwilligung, Löschkonzept, Auskunfts- und Löschmöglichkeit sowie einer öffentlich erreichbaren Privacy-Policy.
- **Soziale Funktionen:** Folgen, Freundschaftsanfragen, Blockieren und Benachrichtigungen sind als Zielumfang vorgesehen.
- **Datenmodell:** Raumteilnahmen, Chat, Reaktionen, Tags, Reports, Nutzerstatus und grobe Standortzonen gehören zum geplanten Modell.
- **Erfolgsmessung:** Aktive Räume, wiederkehrende Teilnehmer, Session-Dauer, Abbruchrate und Moderationsfälle werden als Kernmetriken vorgesehen. Die Messung muss datensparsam und transparent erfolgen.
- **Ressourcen:** Das eigene Zeitbudget ist der primäre Entwicklungsaufwand. Die Testphase soll mit möglichst geringen laufenden Kosten stattfinden und zunächst auf 20 Teilnehmer begrenzt werden.

## 5. Empfehlungen zu Architektur und Video

### Web und Vercel

Eine ausschließliche Web-Lösung ist für den ersten Test sinnvoll: Sie vermeidet Apple- und Google-Store-Gebühren, beschleunigt Releases und ist ohne Installation erreichbar. Vercel kann das Web-Frontend, statische Inhalte und kurze serverseitige Funktionen hosten.

Vercel sollte jedoch nicht als Medienserver oder als dauerhafter Chat-/WebSocket-Server eingeplant werden. WebRTC-Signalisierung, Videorouting und Audioverteilung sollten über einen spezialisierten Dienst wie LiveKit Cloud erfolgen. Supabase kann Authentifizierung, Datenbank, Realtime-Chat und Edge Functions übernehmen. Damit ergibt sich:

```text
[Browser/PWA]
	|-- Web-App/API --> [Vercel]
	|-- Auth/DB/Chat --> [Supabase]
	`-- Audio/Video --> [LiveKit Cloud]
```

Zu beachten sind Browser-Berechtigungen, Kamera-/Mikrofon-Kompatibilität, Safari auf iOS, HTTPS, mobile Akkunutzung, Hintergrundverhalten und fehlende native Push-Möglichkeiten gegenüber einer App. Die Web-App sollte zunächst als Desktop- und Mobile-Browser-Erlebnis getestet werden.

### Video-Modell

Empfohlen wird **SFU über LiveKit**, nicht Mesh. Bei Mesh sendet jeder Teilnehmer seinen Stream an alle anderen; Upload, Akkuverbrauch und Fehleranfälligkeit wachsen schnell mit der Raumgröße. Ein SFU empfängt Streams einmal und verteilt sie gezielt an die Teilnehmer. Das passt besser zu kleinen Gruppen, Zuschauern und einer späteren Skalierung.

Empfohlene Standardwerte:

- Audio beim Beitritt standardmäßig aus; bewusste Freigabe durch den Nutzer
- Kamera und Mikrofon getrennt steuerbar
- Zuschauer veröffentlichen weder Audio noch Video
- zunächst maximal 4 bis 6 aktive Kameras pro Raum
- Sprecher- bzw. Fokusansicht optional, ohne alle Videos dauerhaft groß zu übertragen
- keine Aufzeichnung im MVP
- klare sichtbare Anzeige, sobald Kamera oder Mikrofon aktiv ist

### Monetarisierung

Die geplanten Phasen sind schlüssig:

1. kostenloser Aufbau der Community
2. Sponsoring, zunächst möglichst ohne störende Unterbrechung des gemeinsamen Strickens
3. Marktplatz für "Bewohner" mit provisionsbasierter Vermittlung

Ergänzend denkbar sind bezahlte Einzelberatungen, zeitlich begrenzte Event-Tickets, hervorgehobene aber klar gekennzeichnete Premium-Räume und Partnerschaften mit Woll- oder Zubehöranbietern. Bezahlte digitale Leistungen in einer späteren iOS-App müssen die App-Store-Zahlungsregeln berücksichtigen; beim Web-MVP ist ein eigener Zahlungsdienst grundsätzlich einfacher, ersetzt aber keine Prüfung von Steuer-, Verbraucher- und Plattformpflichten.

## 6. Empfehlungen zu Kosten, Anbietern und Veröffentlichung

Die offiziellen Anbieterangaben wurden am 4. September 2026 als Orientierung geprüft. Preise und Limits können sich ändern und sollten vor jedem produktiven Start erneut im jeweiligen Dashboard kontrolliert werden.

- **Vercel:** Hobby ist kostenlos, aber laut Anbieter für persönliche, nicht-kommerzielle Nutzung vorgesehen. Für einen privaten Prototypen ist es geeignet; bei kommerziellem Testbetrieb sollte der Pro-Plan einkalkuliert werden. Das aktuelle Pro-Modell nennt 20 US-Dollar pro Monat plus mögliche nutzungsabhängige Kosten.
- **Supabase:** Der Free-Plan nennt unter anderem 50.000 monatlich aktive Nutzer, 5 GB Egress, 1 GB Dateispeicher, 200 gleichzeitige Realtime-Verbindungen und 2 Millionen Nachrichten pro Monat. Projekte können bei Inaktivität pausieren. Pro startet laut Preisseite bei 25 US-Dollar pro Monat, enthält 500 Realtime-Verbindungen und 5 Millionen Nachrichten; zusätzliche Nutzung kann berechnet werden. Für eine kleine Testgruppe reicht Free voraussichtlich, aber Spend-Limits und Monitoring müssen aktiviert bzw. geprüft werden.
- **LiveKit:** Die frühere pauschale Annahme von 5.000 kostenlosen Videominuten und die konkrete Beispielrechnung in `answer8_costs.md` sollten nicht als bestätigt gelten. LiveKit-Cloud-Preise und Medienquoten sind vor der Auswahl des Tarifs direkt auf der aktuellen offiziellen Preisseite und im Dashboard zu verifizieren. Entscheidend sind Teilnehmerminuten, veröffentlichte Tracks, Abonnenten, Auflösung, Recording und Egress.
- **Store-Konten:** Bei einer reinen Web-App entfallen zunächst Apple- und Google-Store-Konten. Für eine spätere iOS-App kostet das Apple Developer Program laut offizieller Angabe 99 US-Dollar pro Jahr; Apple nennt außerdem 25 enthaltene Xcode-Cloud-Compute-Stunden pro Monat. Ein App-Store-Launch mit nutzergenerierten Inhalten erfordert unter anderem Filterung, Meldefunktion, zeitnahe Reaktionen, Blockieren, Kontaktmöglichkeit und Account-Löschung. Bei kostenpflichtigen digitalen Beratungen oder Events müssen die App-Store-Zahlungsregeln früh berücksichtigt werden.

### Konkreter Kostenplan für die Testphase

1. Web-App auf Vercel Hobby nur für einen privaten, nicht-kommerziellen Prototypen.
2. Supabase Free für getrennte Entwicklungs- und Testdaten, mit kleinen Datenmengen und aktivem Usage-Monitoring.
3. LiveKit zunächst nach einem kleinen, realen Test mit wenigen Räumen auswählen; keine Aufzeichnung und keine unnötig hohe Videoqualität.
4. Kostenlimits, Warnungen und automatische Abschaltung bei allen kostenpflichtigen Diensten einrichten.
5. Domain, E-Mail-Versand, Kartenanbieter, Analytics, Fehlertracking und Moderation als separate Kostenpositionen einplanen.
6. Vor öffentlichem oder kommerziellem Betrieb rechtliche Beratung zu DSGVO, Impressum, Nutzungsbedingungen, Zahlungsabwicklung, Haftung und Moderation einholen.

## 7. Später zu klärende Punkte

- Wie werden Premium-Berater qualifiziert, und wie werden Qualität, Verfügbarkeit, Rückerstattung und Konflikte geregelt? Die Definition der Premium-Beratung erfolgt später.
- Sind Events live, aufgezeichnet oder ausschließlich als Terminangebote gedacht?
- Welche Zahlungsabwicklung und welches Provisionsmodell gelten für Beratung, Events und Marktplatz?
- Welche Moderationsrollen gibt es, wie werden Reports priorisiert und welche Reaktionszeit ist realistisch? Das Moderationskonzept wird in einer späteren Phase ausgearbeitet.
- Wird die Standortkarte für den MVP überhaupt benötigt oder erst nach erfolgreicher Community-Validierung aktiviert?
- Welche Testdauer, Raumanzahl und maximale Gleichzeitigkeit gelten innerhalb des Tests mit 20 Teilnehmern?
- Welche Mindestwerte entscheiden über den nächsten Schritt: wiederkehrende Nutzer, aktive Räume, Chat-Nutzung oder Session-Dauer?

## Fazit

KnitAlong ist als fokussierte Community-Idee und als kleiner technischer MVP schlüssig. Die aktualisierte Richtung ist: deutschsprachige Web-App/PWA zuerst, LiveKit-SFU für kleine Live-Räume, Supabase für Daten und Realtime sowie Vercel für Frontend und kurze API-Funktionen. Die Monetarisierung wird erst nach Community-Aufbau über Sponsoring und anschließend über Beratung, Events und einen Marktplatz erprobt.

Die technische Machbarkeit ist damit gut, aber die größten Risiken bleiben Marktvalidierung, der zunächst noch auszuarbeitende Moderationsbetrieb, DSGVO-Betrieb und die tatsächlichen Kosten von Videonutzung. Die Anbieter-Free-Tiers eignen sich voraussichtlich für einen kleinen geschlossenen Test mit 20 Teilnehmern, nicht als automatische Zusage für einen öffentlichen oder kommerziellen Betrieb.

## Frage

Für die nächste Planungsrunde sind Testgröße und Mindestalter festgelegt. Moderation und Premium-Beratung bleiben bewusst spätere Themen; zusätzlich müssen noch Testdauer, Raumanzahl und die konkrete Definition der Events festgelegt werden. Fehlt dir in dieser aktualisierten Zusammenfassung noch ein bestimmter Aspekt?