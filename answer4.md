Bevor es an die technische Einrichtung geht, stellen die UI/UX des Video-Raums und das Storyboard das Fundament für die spätere App-Architektur dar.

---

### 1. UI/UX-Skizze: Der Video-Raum (Das "Wohnzimmer")

Das Design muss extrem auf **Einfachheit** und **Freihand-Bedienung** ausgelegt sein, da die Hände der Nutzer beim Stricken belegt sind.

#### Visualisierung des Screen-Layouts (Smartphone-Kopf- / Hochformat)

```text
+-------------------------------------------------------+
| [← Raus]   Wohnzimmer: "Socken-Session"    [⚙️/Mute]  |
+-------------------------------------------------------+
|                                                       |
|   +-----------------------+   +-----------------------+   |
|   |  User A (Aktiver Spk) |   |  User B               |   |
|   |  [🎥 Hände-Ansicht]   |   |  [🎥 Gesicht]         |   |
|   |  👤 Maria (München)   |   |  👤 Tim (Hamburg)     |   |
|   +-----------------------+   +-----------------------+   |
|                                                       |
|   +-----------------------+   +-----------------------+   |
|   |  User C               |   |  User D               |   |
|   |  [🎥 Naheinstellung]  |   |  [🎥 Hände-Ansicht]   |   |
|   |  👤 Anna (Köln)       |   |  👤 Lisa (Wien)       |   |
|   +-----------------------+   +-----------------------+   |
|                                                       |
+-------------------------------------------------------+
| 👁️ 14 Zuhörer | 🧶 Projekt: "Wollpullover Muster X"    |
+-------------------------------------------------------+
| (Live-Chat Verlauf - Transparenter Overlay-Text)      |
|  • Max: "Welche Nadelstärke nutzt du da?"            |
|  • Anna: "Sieht super aus! ❤️"                        |
+-------------------------------------------------------+
| [🎤 Mute]  [📷 Flip Cam]  [💬 Chat]  [❤️]  [✋ Melden] |
+-------------------------------------------------------+

```

#### Kern-UX-Elemente im Raum

* **Dynamisches Kachel-Grid:** 2 bis max. 6 aktive Kameras in gleichgroßen Kacheln. Ein Klick auf ein Video vergrößert dieses für Detailansichten (z. B. Maschenbild).
* **Handfreie Interaktion:** Große Buttons am unteren Bildschirmrand für blinde Bedienung während des Strickens.
* **Status-Bar:** Zeigt das aktuelle Projekt des Hosts und die Anzahl der passiven Zuhörer.
* **Kamera-Flip & Filter-Toggle:** Ein schneller Button wechselt sofort zwischen Frontkamera (Gesicht) und Hauptkamera (Blick auf Schoß/Hände). Ein Anonymitäts-Filter (z. B. Unschärfe auf den Hintergrund) ist direkt per Icon aktivierbar.

---

### 2. Gesamtes Storyboard (User Journey)

Das Storyboard beschreibt den Weg einer neuen Nutzerin von der Entdeckung bis zum aktiven Stricken in der Community.

```text
[1. Entdeckung & Download]
       │
       ▼
[2. Onboarding & Profil]
  • Registrierung (Social / Mail)
  • Auswahl von Lieblings-Techniken (Stricken, Häkeln, Töpfern)
  • Ortungs-Freigabe für Karte (Optional)
       │
       ▼
[3. Haupt-Dashboard (Home)]
  • Obere Hälfte: Interaktive Karte (Anzeige anonymer Avatare in der Nähe)
  • Untere Hälfte: Aktive Live-Räume ("Strick-Treffs") sortiert nach Themen
       │
       ├───────────────────────────────┐
       ▼                               ▼
[4a. Raum beitreten]            [4b. Eigenen Raum starten]
  • Wählen: Aktiv (Video)         • Raum-Titel eingeben (z. B. "Nachtschicht")
    oder Passiv (Zuschauen)       • Thema/Tags festlegen & Kamera ausrichten
       │                               │
       └───────────────┬───────────────┘
                       │
                       ▼
[5. Das "Wohnzimmer" (Video-Raum)]
  • Paralleler Video-Stream & Sprache
  • Text-Chat für Fragen/Links
  • Emojis fliegen visuell durchs Bild
                       │
                       ▼
[6. Raum verlassen & Vernetzen]
  • Feedback-Screen
  • Option: Teilnehmenden Stickern folgen / Freundschaftsanfrage senden

```

---

### Nächster Schritt: Technische Einrichtung

Sobald diese visuellen und Ablauf-Konzepte stehen, kann die technische Architektur aufgesetzt werden.