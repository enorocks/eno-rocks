# enoCalories · eno.rocks/tools/kalorienrechner

Statisches Tool für Kalorienbedarf (Vite + TypeScript). Alle Berechnungen laufen im Browser.

## Entwicklung

```bash
cd tools/kalorienrechner
npm install
npm run dev
```

Dev-Server: `http://localhost:5173/tools/kalorienrechner/`

## Build

```bash
npm run build
```

Output: `dist/` — Inhalt nach `/tools/kalorienrechner/` im Webroot von eno.rocks hochladen.

## Deploy (All-Inkl)

1. `npm run build` in diesem Ordner
2. Inhalt von `dist/` nach `eno.rocks/tools/kalorienrechner/` kopieren
3. Fonts liegen weiterhin unter `/fonts/Inter/` (Webroot)
4. Logo/Favicon unter `/assets/eno-logo.png`

Struktur Webroot:

```
eno.rocks/
  index.html
  fonts/Inter/
  assets/eno-logo.png
  tools/kalorienrechner/
    index.html
    assets/   ← gebaute JS/CSS
```

## Formeln

- Mifflin-St Jeor, Schofield, Harris-Benedict (immer)
- Katch-McArdle + Cunningham (optional mit KFA)
- Aktivität: Beruf-PAL + Schritte + Training
- Spanne: ±10 % um den Durchschnitt, gerundet auf 50 kcal
