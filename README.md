# iBM – Ingenieurbüro Memic — Website

Website für **iBM – Ingenieurbüro Memic**, Dipl.-Ing. Denis Memic, Dürkheimer Str. 105,
68309 Mannheim. Tragwerksplanung · Bauphysik · Gutachten.

Dies ist ein **Entwurf zur Ansicht**. Texte, Farben und Aufbau lassen sich jederzeit ändern.

---

## Was das hier ist

Eine schnelle Website ohne Baukasten, ohne Datenbank und ohne Abo-Gebühren eines
Baukastenanbieters. Sie besteht aus ein paar Dateien und läuft auf jedem Webspace.

- **Kein Cookie-Banner**, weil es nichts zuzustimmen gibt: keine Cookies, kein Tracking, keine
  Google-Schriften, keine eingebettete Karte.
- **Nichts, was kaputtgehen kann.** Kein Login, kein Plugin, kein Update.
- **Schnell**, auch unterwegs mit schlechtem Empfang.

## Die Idee: „Rotstift“

Die Seite sieht aus wie ein sauberer Ausführungsplan: Papier, Tusche, feine Linien, Achsen und
Bemaßung. Das einzige Rot ist der Rotstift des Statikers — auf Maßketten, Lastpfeilen und der
Momentenlinie. Statt austauschbarer Baustellenfotos tragen **technische Zeichnungen** die
Seite. Sie bauen sich beim Scrollen Strich für Strich auf.

Vorbilder aus der Recherche: die Oboro-Vorlage (Aufbau, große Schrift, nummerierte Liste),
schlaich bergermann partner und LERA (Zurückhaltung statt Werbesprache), TLC Engineering
(Zeichnungssprache als Ordnungsprinzip).

## Aufbau der Seite

| Nr. | Abschnitt | Inhalt |
|---|---|---|
| 00 | Start | „Statik, die trägt.“, Querschnitt als Planblatt mit Schriftfeld |
| 01 | Über uns | großer Satz, der sich beim Lesen dunkel färbt; darunter Memics Texte von der alten Seite |
| – | Foto-Band | Bewehrung, Symbolbild |
| 02 | Leistungen | fünf Leistungen als aufklappbare Liste, daneben wechselnde Zeichnung |
| 03 | Bauaufgaben | Wohnbau, Gewerbe & Industrie, Tiefbau, Bestand & Denkmal |
| 04 | Ablauf – der Lastpfad | fünf Schritte; am großen Bildschirm baut sich die Zeichnung beim Scrollen auf |
| 05 | Arbeitsweise | „Die Vorteile unserer Arbeit“ in vier Punkten |
| – | Referenzen | Projekte des Büros; zuerst das Dreifamilienhaus als Stapel echter Ausführungspläne (fächert beim Überfahren auf, Klick öffnet das Blatt im Fenster mit Lupe) |
| 06 | Profil | Porträt, Nachweisberechtigungen, Werdegang als Maßkette |
| 07 | Fragen | sechs häufige Fragen (auch für Google als FAQ ausgezeichnet) |
| 08 | Kontakt | Anfrageformular (öffnet E-Mail), Telefon, Adresse |

Dazu **Impressum** und **Datenschutzerklärung** als eigene Seiten.

## Was bewusst nicht auf der Seite steht

- **Referenzen aus der Angestelltenzeit.** Projekte bei früheren Arbeitgebern (z. B. Goldbeck)
  sind keine Referenzen von iBM. Unter „Referenzen“ stehen nur Projekte des eigenen Büros.
- **Bewertungen.** Es gibt keine echten; erfundene sind abmahnfähig (§ 5b UWG).
- **„Nachweisberechtigungen für ganz Deutschland“** (stand auf der alten Seite). Belegt sind nur
  Baden-Württemberg und Hessen.
- **Preise.** Nicht bestätigt.
- **Social-Media-Knöpfe.** Die alte Seite verlinkte auf Squarespace statt auf eigene Profile.

## Bevor die Seite online geht

Diese Punkte sind offen. Sie stehen zusätzlich als `TODO Bilal:` im Quelltext.

| Was | Wo | Warum |
|---|---|---|
| **Zustimmung von Herrn Memic** | – | Die Seite nutzt seinen Namen, sein Porträt und seinen Lebenslauf. |
| **Rechtsform** | `impressum.html` | Pflichtangabe nach § 5 DDG. Vermutlich Einzelunternehmen. |
| **USt-IdNr.** | `impressum.html` | Nur falls vorhanden. |
| **Staat der Verleihung „Dipl.-Ing.“** | `impressum.html` | Pflichtangabe bei reglementierten Berufen; Studium in Tuzla. |
| **Kammermitgliedschaft** | `impressum.html` | Mitglied oder nur in der Liste der Nachweisberechtigten? |
| **Nachweisberechtigung Rheinland-Pfalz?** | `index.html` (Fragen, JSON-LD) | Ludwigshafen fehlt deshalb bewusst im Einsatzgebiet. |
| **Größeres Porträt** | `assets/img/` | Das jetzige hat nur 632 px. |
| **Eigene Projektfotos** | `assets/img/` | Ersetzen die drei Symbolbilder, siehe [MEDIEN.md](assets/img/MEDIEN.md). |
| **Hoster** | `datenschutz.html` | Nach dem Umzug ALL-INKL eintragen und AV-Vertrag abschließen. |

## Umzug auf ib-memic.de (ALL-INKL)

Die Domain liegt derzeit bei Squarespace.

1. Domain zu ALL-INKL umziehen (Auth-Code bei Squarespace anfordern).
2. Alle Dateien per FTP hochladen, **inklusive `.htaccess`** (Umleitung auf https://www,
   Komprimierung, Cache-Zeiten).
3. Let's-Encrypt-Zertifikat für `ib-memic.de` und `www.ib-memic.de` aktivieren.
4. Postfach `info@ib-memic.de` bei ALL-INKL anlegen (vorher Mails bei Squarespace sichern).
5. `og:url`, `og:image` und die zwei Bildadressen im JSON-LD in `index.html` auf
   `https://www.ib-memic.de/` umstellen.
6. Abschnitt „Server-Logdateien“ in `datenschutz.html` auf ALL-INKL umschreiben.
7. **Zuletzt** in allen drei Seiten `noindex, nofollow` auf `index, follow` stellen.
8. Google Search Console: Domain bestätigen, `sitemap.xml` einreichen.

## Für den technischen Blick

```
index.html            Startseite, alle Abschnitte, Zeichnungen als Inline-SVG
impressum.html
datenschutz.html
favicon.svg
.htaccess             Serverregeln für ALL-INKL
robots.txt, sitemap.xml
assets/
  css/style.css       das gesamte Design, Farben als Variablen in :root
  js/main.js          Menü, Zeichnen, Lastpfad, Formular
  fonts/              Inter Tight, lokal (SIL Open Font License 1.1)
  img/                Fotos (AVIF/WebP/JPEG), Logo — Herkunft in MEDIEN.md
```

Kein Build-Schritt, kein npm, kein Framework.

**Lokal ansehen:** im Ordner darüber `serve.ps1 -Port 4720` starten und
`http://localhost:4720/ib-memic/index.html` öffnen.

**Nach jeder Änderung an `style.css` oder `main.js`** das `?v=` in allen drei HTML-Seiten
hochzählen — ALL-INKL lässt CSS und JS einen Monat im Browser liegen.

**Ohne JavaScript** und bei „Bewegung reduzieren“ ist alles vollständig sichtbar: Die
Zeichnungen stehen fertig da, der Lastpfad ist ein normaler Abschnitt.

### Eine Referenz ergänzen

1. Foto oder Planausschnitt nach `Desktop\Memic\Stock\` legen und wie die übrigen Bilder in
   AVIF, WebP und JPEG bauen, Breiten 800 und 1400, Seitenverhältnis 3:2 — Dateinamen
   `assets/img/ref-NAME-800.*` und `ref-NAME-1400.*` (siehe `assets/img/MEDIEN.md`).
2. In `index.html` im Abschnitt „Referenzen“ die auskommentierte **VORLAGE** kopieren, die
   Kommentarzeichen entfernen, Bildnamen, Bereich · Jahr · Ort, Titel, Text und Leistungen eintragen.
3. Fertig — ab zwei Referenzen stellt sich die Liste automatisch als Raster dar.

Nur echte Projekte des Büros zeigen und nur mit Einverständnis des Bauherrn. Name und Adresse
des Bauherrn gehören nicht auf die Seite.
