# Bilder – Herkunft und Aufbau

Alle Bilder liegen in drei Formaten vor (AVIF, WebP, JPEG) und mehreren Breiten. Der Browser
wählt selbst das kleinste passende. Die Originale liegen **nicht** im Repo, sondern unter
`C:\Users\bilal\Desktop\Memic\Stock\`. Die Web-Fassungen baut
`C:\Users\bilal\Desktop\Memic\fotos-bauen.sh` (braucht ffmpeg).

| Datei | Motiv | Herkunft | Lizenz | Hinweis auf der Seite |
|---|---|---|---|---|
| `foto-bewehrung-{960,1600,2560}` | Bewehrungskorb von unten, s/w, auf 2:1 beschnitten | Unsplash, **JANG RACHEL** (@rachelhee), Foto-ID `ug3PIey6fI4` | Unsplash-Lizenz | „Symbolbild“ im Foto-Band |
| `foto-halle-{800,1200,1800}` | Stahltragwerk mit PV-Modulen, fast entsättigt | Unsplash, **Hasnan Monir** (@monirhasnan), Foto-ID `7UqBA8aBf2E` | Unsplash-Lizenz | „Symbolbild“ bei den Bauaufgaben |
| `foto-fachwerk-{1280,2560}` | Fachwerkträger, s/w | Unsplash, **Anton Maksimov** (@juvnsky), Foto-ID `ieFQLMfamIo` | Unsplash-Lizenz | „Hintergrund: Symbolbild“ im Kontakt |
| `denis-memic-{320,632}` | Porträt des Inhabers | von der bisherigen Website ib-memic.de (632 × 635 px), Original in `Desktop\Memic\Stock\memic-portrait-original.png` | Herr Memic | Wird mit 316 px angezeigt, also genau halbe Dateigröße = scharf auf 2×-Bildschirmen |
| `logo-ibm-marke.svg`, `favicon.svg` | Bildmarke iBM | neu gezeichnet nach dem bisherigen Logo | eigene Arbeit | – |

| `plan-p0{1..4}-{1400,2800}` | Ausführungspläne P-01 bis P-04 (Dachkonstruktion, Decken über DG/OG/EG), A2, M 1:50 | Pläne von **iBM – Ingenieurbüro Memic**, Projekt 31-DM/26 (Neubau eines Dreifamilienhauses, 2026), von Bilal als Bauherr zur Verfügung gestellt | Herr Memic (Planverfasser) – Freigabe bei der Vorstellung einholen | Abschnitt „Arbeitsweise“ |

Alle übrigen technischen Zeichnungen stehen als SVG direkt in `index.html` und sind eigene Darstellungen.

## Die Ausführungspläne

Die PDFs liegen unter `C:\Users\bilal\Desktop\Aktuellste Hauspläne\`. Gerendert werden sie mit
pdf.js in Edge (4200 × 2970 px), danach baut `C:\Users\bilal\Desktop\Memic\plaene-bauen.sh`
die ganzen Blätter in `1400` und `2800` px. Dazu kommen `plan-p0N-720` für den Planstapel
(`scale=720:-2`, AVIF crf 24, WebP 88) — im Stapel `720`/`1400`, im Fenster nach Klick
`1400`/`2800`. Die früheren Ausschnittkarten (`plaene-ausschnitte.sh`) werden nicht mehr genutzt.

**Im Schriftfeld wird das Feld BAUHERR/BAUORT weiß überdeckt.** Dort stehen Namen und
Privatadressen (auch von Hakan Altuntas), die nicht auf eine öffentliche Website gehören. Die
geschwärzten Vorlagen liegen in `Desktop\Memic\Plaene\`. Neue Pläne immer durch das Skript
schicken, nie das ungeschwärzte PDF verlinken.

## Warum „Symbolbild“ dransteht

Fremde Baustellenfotos ohne Hinweis würden wirken wie Projekte des Büros. Das wäre
irreführende Werbung (§ 5 UWG). Deshalb trägt jedes Stockfoto sichtbar die Beschriftung, und
im Impressum stehen die Fotografen.

## Die alten Bilder von ib-memic.de

Die Bilder der Squarespace-Seite wurden **bewusst nicht übernommen**. Es sind Bildschirmfotos
unklarer Herkunft (Dateinamen wie `Screenshot 2026-09-12 154117.png`), das große Titelbild
ist vermutlich KI-generiert. Nur das Porträt stammt erkennbar von Herrn Memic selbst.

## Eigene Fotos einsetzen

1. Foto nach `Desktop\Memic\Stock\` legen.
2. In `fotos-bauen.sh` die Quelldatei austauschen und das Skript laufen lassen.
3. In `index.html` den `alt`-Text anpassen und die Beschriftung „Symbolbild“ entfernen.
4. Im Impressum den Bildnachweis anpassen.

**Porträt in höherer Auflösung:** Die Squarespace-Seite ib-memic.de ist seit dem 17.09.2026
abgelaufen ("Website Expired"), das Bild ist dort also nicht mehr in besserer Auflösung zu holen;
im Internet Archive gibt es keine Sicherung. Eine schärfere Fassung kann nur von Herrn Memic
selbst kommen — am besten die Originaldatei aus Kamera oder Handy, nicht über WhatsApp geschickt
(WhatsApp rechnet Bilder herunter). Ab 960 px Kantenlänge lohnt der Tausch. Skript dafür:
`Desktop/Memic/portraet-bauen.sh`.
