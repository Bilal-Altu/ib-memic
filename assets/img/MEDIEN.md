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
| `denis-memic-{320,632}` | Porträt des Inhabers | von der bisherigen Website ib-memic.de (632 × 635 px) | Herr Memic | – |
| `logo-ibm-marke.svg`, `favicon.svg` | Bildmarke iBM | neu gezeichnet nach dem bisherigen Logo | eigene Arbeit | – |

Alle technischen Zeichnungen stehen als SVG direkt in `index.html` und sind eigene Darstellungen.

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
