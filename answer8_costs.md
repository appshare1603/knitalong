Für das Projekt **KnitAlong** fallen die laufenden Kosten in zwei Phasen an: **Entwicklung/Testphase (MVP)** und **Produktionsphase (Betrieb mit echten Nutzern)**.

Dank großzügiger Free Tiers (kostenloser Kontingente) bei den gewählten Diensten kannst du die App **sehr günstig oder sogar fast kostenlos aufbauen und testen**, bevor echte Kosten für die Skalierung entstehen.

---

### 1. Einmalige / Jährliche Fixkosten (Plattform-Accounts)

Diese Kosten fallen an, um die App auf den Geräten und in den Stores bereitzustellen:

* **Apple Developer Program:** **~99 $/Jahr** (ca. 92 €)
* *Pflicht für App Store, TestFlight-Uploads und Push-Notifications.*


* **Google Play Console (optional für Android):** **25 $ einmalig** (ca. 23 €)
* *Lebenslanger Account für den Google Play Store.*


* **Domain & Branding (.de / .com):** **~10–15 € / Jahr**
* *Für Website, Support-Adresse und Deep-Links.*



---

### 2. Monatliche Infrastrukturkosten (Backend & Streaming)

#### Phase 1: Entwicklung & Alpha-Test (MVP)

Solange du die App baust und mit einer kleinen Testgruppe (z. B. bis zu 10–20 Personen gleichzeitig) testest, liegen die laufenden Serverkosten bei **0 €/Monat**:

| Dienst | Kostenloser Rahmen (Free Tier) | Monatliche Kosten (Testphase) |
| --- | --- | --- |
| **Supabase** (Datenbank & Auth) | 500 MB Speicher, 50.000 aktive Nutzer/Monat | **0 €** |
| **LiveKit Cloud** (Video-Streaming) | 5.000 Video-Minuten / Monat inklusive | **0 €** |
| **Hosting & CI/CD** (Codemagic, Firebase) | Ausreichend kostenlose Minuten für App-Builds | **0 €** |

---

#### Phase 2: Produktiver Live-Betrieb (Beispielrechnung)

Sobald hunderte Nutzer aktiv im "Wohnzimmer" gemeinsam stricken, skalieren die Dienste verbrauchsabhängig:

##### **A. Supabase Pro Plan:** **~25 $/Monat**

* Reicht für ca. 100.000 monatlich aktive Nutzer, tägliche Datenbank-Backups und unbegrenzten Live-Chat-Verlauf.

##### **B. LiveKit Cloud (Der Hauptkostenfaktor beim Video):**

Video-Streaming verbraucht Bandbreite. LiveKit berechnet dies pro "Teilnehmer-Minute".

* **Kostenstruktur (Ship Tier):** **50 $/Monat Base** (inkl. 150.000 Minuten) + $0.0005 pro weiterer Minute.
* **Rechenbeispiel für KnitAlong:**
* Wenn 4 Personen für **1 Stunde** gemeinsam in einem Live-Raum mit Video sind, entspricht das 240 Video-Minuten.
* **Beispiel 100 aktive Nutzer:** Wenn täglich ca. 20 Nutzer für 2 Stunden in Räumen sind, verbrauchst du ~120.000 Minuten/Monat.
* **Kosten bei 100 aktiven Nutzern:** **~50 $/Monat** (durch Inklusiv-Volumen gedeckt).
* **Kosten bei 500 aktiven Nutzern:** **~120–180 $/Monat**.



---

### Kosten-Zusammenfassung im Überblick

| Zeitabschnitt | Was enthalten ist | Erwartete Gesamtkosten |
| --- | --- | --- |
| **Start & Entwicklung** (Monat 1–2) | Xcode, Flutter, Supabase Free, LiveKit Free | **0 €** |
| **TestFlight & Alpha** (Monat 3) | Apple Developer Account (99 $), Domain, erste Tester | **ca. 100–110 € einmalig** |
| **App Store Launch** (Erste Nutzer) | Supabase Free / Pro + LiveKit Ship Tier | **ca. 25–75 € / Monat** |
| **Wachstum** (z. B. 1.000 aktive Sticker) | Supabase Pro + höheres Video-Volumen | **ca. 150–300 € / Monat** |

---

### Fazit & Spartipp für den Start

Du kannst das Projekt **risikofrei aufsetzen**:

1. Du musst **keinen Cent zahlen**, um die komplette App auf deinem Mac zu bauen und im Emulator zu testen.
2. Erst wenn du die App auf ein echtes iPhone via TestFlight laden willst, wird die Apple-Gebühr von ~99 $/Jahr fällig.
3. Serverkosten entstehen erst dann nennenswert, wenn deine Räume wirklich über viele Stunden von vielen Menschen gleichzeitig genutzt werden – und genau ab diesem Zeitpunkt greift dein geplantes Sponsoring-/Provisionsmodell.