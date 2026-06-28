# enoMacros

Statisches Tool unter `eno.rocks/tools/makrorechner/`.

## Entwicklung

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build
```

Nur den Inhalt von `dist/` nach `/tools/makrorechner/` auf dem Server legen.

Fonts und Logo liegen im Webroot (`/fonts/Inter/`, `/assets/eno-logo.png`).

## Logik

- Kalorienziel von dir oder aus enoCalories
- Protein und Fett pro kg **Wunsch- oder Normalgewicht** (nicht zwingend Ist-Gewicht)
- Beim Abnehmen: ca. 1,8–2,2 g Protein/kg, Fett ca. 0,7–1,0 g/kg
- Kohlenhydrate füllen den Rest der Kalorien
- Spannen für alle Makros, gerundet auf 5 g

## URL-Parameter (optional)

`/tools/makrorechner/?kcal=2150&weight=90&goal=lose` füllt das Formular vor und rechnet direkt. `weight` ist das Referenzgewicht in kg.
