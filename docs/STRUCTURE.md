# ENO.rocks · Ordnerstruktur

## Auf einen Blick

```
02 - ENO.ROCKS/
├── index.html              → Hub (deploy: Webroot)
├── eno-landing.css         → Hub-Styles (importiert shared/)
├── assets/                 → Logo, Headerbilder
├── fonts/                  → Inter (deploy mit hochladen)
├── shared/                 → Design + Footer (nur Entwicklung, nicht deployen)
│   ├── css/                → Tokens, Fonts, Footer
│   ├── ui/                 → footer.ts für Tools
│   └── snippets/           → footer.html Referenz für Hub
├── tools/
│   ├── kalorienrechner/    → Vite + TS → dist/
│   ├── makrorechner/       → Vite + TS → dist/
│   ├── dailytogether/      → Vite + TS → dist/ (One-Pager)
│   ├── uebungen/           → Vite + TS → dist/ (enoExercises)
│   └── pedia/              → Vite + TS → dist/ (enoPedia)
├── docs/                   → Doku
├── 01 VIDEO SOCIAL MEDIA/  → Content-Ideen, Grafiken, YouTube-Banner-Tool (lokal)
└── package.json            → build:tools
```

## Was wohin deployen

| Lokal | Server (eno.rocks) |
|-------|---------------------|
| `index.html` | `/` |
| `eno-landing.css` | `/eno-landing.css` |
| `eno-legal.css` | `/eno-legal.css` |
| `shared/css/*` | `/shared/css/` (Hub + Legal @imports) |
| `impressum/index.html` | `/impressum/` |
| `datenschutz/index.html` | `/datenschutz/` |
| `assets/*` | `/assets/` |
| `fonts/Inter/*` | `/fonts/Inter/` |
| `tools/kalorienrechner/dist/*` | `/tools/kalorienrechner/` |
| `tools/makrorechner/dist/*` | `/tools/makrorechner/` |
| `tools/dailytogether/dist/*` | `/tools/dailytogether/` |
| `tools/uebungen/dist/*` | `/tools/uebungen/` |
| `tools/pedia/dist/*` | `/tools/pedia/` |
| `shared/js/*` | `/shared/js/` (zentrales Menü) |

`shared/` bleibt im Repo – wird in CSS/JS der Tools eingebunden und beim Build mitkompiliert.

## Design aus einer Quelle

| Element | Quelle |
|---------|--------|
| Farben, `--eno-max` | `shared/css/eno-tokens.css` |
| Inter | `shared/css/eno-fonts.css` |
| Footer | `shared/css/eno-footer.css` + `shared/ui/footer.ts` |
| Hub-Footer HTML | `shared/snippets/footer.html` (Sync mit footer.ts) |

## Builds

```bash
cd "02 - ENO.ROCKS"
npm run build:tools
```

Oder einzeln in `tools/kalorienrechner/` bzw. `tools/makrorechner/`: `npm run build`

## Archiv

Design-Quellen (PSD): `00 - ARCHIV/ENO/eno-rocks/design-quellen/`

Content & Social: `01 VIDEO SOCIAL MEDIA/` (inkl. `youtube-banner/` zum Banner exportieren)
