Für das Minimum Viable Product (MVP) von **KnitAlong** liegt der Fokus darauf, das Kernversprechen – das gemeinsame, unkomplizierte Handarbeiten im Live-Video – technisch stabil und kosteneffizient umzusetzen. Complexities wie globale 3D-Karten oder schwerfällige Shopsysteme bleiben für spätere Phasen reserviert.

---

1. **Benutzerkonto & Profil:** Schlankes Onboarding ohne Reibung.
* **Authentifizierung:** Registrierung via E-Mail/Passwort oder Social Login (Apple, Google).
* **Handarbeits-Profil:** Anzeige von Profilbild/Avatar, Name, Erfahrungsstufe (Anfänger, Fortgeschritten, Profi) und bevorzugten Techniken (z. B. "Socken", "Muster", "Häkeln").


2. **Raum-System & Video-Streaming:** Das Herzstück: Das virtuelle Wohnzimmer.
* **Räume erstellen & beitreten:** Liste aktiver Räume mit Tags (z. B. *"Socken-Stricken am Abend"*, *"Anfängerfragen"*).
* **WebRTC-Integration:** Nutzung eines bestehenden WebRTC-Anbieters (z. B. Agora, Daily.co oder LiveKit), um Entwicklungszeit und Infrastrukturkosten gering zu halten.
* **Kamera-Limits:** Maximal **4–6 aktive Video-Feeds** gleichzeitig pro Raum (zur Schonung von Serverbandbreite und Smartphone-Akkus).
* **Betrachter-Modus (Passiv):** Unbegrenzte Anzahl von Nutzern kann rein als Zuschauer/Zuhörer ohne eigenes Videosignal teilnehmen.
* **Kamera-Features:** Freie Wahl zwischen Front- und Hauptkamera (z. B. Fokussierung auf die Hände auf dem Schoß) sowie einfacher Stummschalt-Funktion (Mute/Unmute).


3. **Kommunikation & Interaktion:** Echtzeit-Austausch im Raum.
* **Raum-Chat:** Integrierter Text-Chat für Links, kurze Anmerkungen oder Nachfragen, ohne den Video-Stream zu unterbrechen.
* **Reaktionen:** Schnelle Emoji-Buttons (z. B. ❤️, 👏, 🧶) für direktes Feedback im Video-Feed.


4. **Anonymisierte Standortkarte (Opt-In):** Datenschutzfreundliche Nähe erzeugen.
* **Opt-In-System:** Standardmäßig deaktiviert; der Standort wird nur auf expliziten Wunsch geteilt.
* **Fuzzy-Location:** Keine exakten Koordinaten. Das System rundet den Standort auf Stadt- oder Postleitzahlenebene ab (z. B. Anzeige des Avatars irgendwo im Großraum "Stuttgart", nicht in der spezifischen Straße).


5. **Moderation & Sicherheit:** Schutz der Community ab Tag 1.
* **Melde- & Blockierfunktion:** Einfache Möglichkeit, störende Nutzer oder unangebrachte Video-Inhalte direkt im Raum zu melden oder stummzuschalten.
* **Host-Rechte:** Der Raumersteller kann Teilnehmer stummschalten oder aus dem Raum entfernen.


---

### Empfohlener Tech-Stack für den Start

| Bereich | Empfohlene Technologie | Grund |
| --- | --- | --- |
| **Frontend App** | Flutter oder React Native | Eine Codebase für iOS und Android spart Zeit und Budget. |
| **Video-Engine** | LiveKit (Open Source) oder Agora.io | Zuverlässiges WebRTC-Streaming ohne eigene Server-Entwicklung. |
| **Backend / DB** | Firebase oder Supabase | Schnelles Setup für Auth, Datenbank und Echtzeit-Sockets im MVP. |
| **Karten-Dienst** | Mapbox oder OpenStreetMap | Flexible und datenschutzfreundliche Karteneinbindung. |