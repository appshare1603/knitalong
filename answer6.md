Der schnellste Weg in den App Store führt über **Flutter** und den Einsatz von **TestFlight** in Kombination mit automatisierten CI/CD-Tools (wie **Codemagic** oder **GitHub Actions**).

---

### Der Express-Fahrplan für den App Store Release

1. **1. Account & Zertifikate vorbereiten:** Apple Developer Account.
* Registriere ein **Apple Developer Konto** (ca. 99 $/Jahr). Die Freischaltung kann 24–48 Stunden dauern.
* Erstelle im Apple Developer Portal die App ID für `com.knitalong.app` und erstelle ein *App Store Distribution Certificate*.


2. **2. App Store Connect & TestFlight einrichten:** Einfachste Bereitstellung.
* Lege in **App Store Connect** den neuen App-Eintrag an (Name, Primärsprache, Privacy-Policy-Link).
* Nutzen für schnelles Testen: **TestFlight**. Sobald der erste Build hochgeladen ist, kannst du Tester per Link einladen, ohne dass die App bereits den strengen App Store Review bestanden hat.


3. **3. Automatisierter Build (CI/CD):** Kein Mac nötig.
* Wenn du keinen Mac besitzt oder Builds automatisieren willst, nutze **Codemagic.io** (speziell für Flutter optimiert) oder **GitHub Actions**.
* Diese Dienste bauen die App in der Cloud auf einem Mac-Server und laden die `.ipa`-Datei direkt in deinen App Store Connect Account hoch.


4. **4. Richtlinien & Fast-Track Review:** Prüfung beschleunigen.
* **Berechtigungs-Begründungen (Info.plist):** Gib genaue Gründe für Kamera- und Mikrofonzugriff an (z. B. *"Kamera wird benötigt, um Handarbeit live im Raum zu zeigen"*). Fehlen diese, wird die App sofort abgelehnt.
* **Test-Account bereitstellen:** Gib dem Apple-Prüfer im Review-Formular Zugangsdaten zu einem Test-Konto, damit dieser sofort einen Test-Raum betreten kann.
* **In-App-Käufe vermeiden:** Starte im MVP rein kostenlos. Sobald Bezahlsysteme integriert werden, dauert die Prüfung deutlich länger.


---

### Relevante Zeiten

* **Build & Upload via TestFlight:** ~1 bis 2 Stunden (sobald Account & Profil stehen).
* **Apple App Review (Freigabe für den App Store):** In der Regel **24 bis 48 Stunden** nach Einreichung.

---

Sollen wir als Nächstes den Flutter-Code für das **Video-Grid** und die **Kamera-Steuerung** im Live-Raum umsetzen?