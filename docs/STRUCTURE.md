# ENO.rocks · Ordnerstruktur

## Auf einen Blick

```
02 - ENO.ROCKS/
├── index.html
├── eno-landing.css
├── assets/
├── shared/
├── tools/
│   ├── abnehmguide/
│   ├── kalorienrechner/
│   ├── makrorechner/
│   ├── abnehmlexikon/
│   └── lieblingsuebungen/
└── package.json
```

## URLs = Ordnernamen

| Tool | Lokal | Server |
|------|-------|--------|
| Abnehmguide | `tools/abnehmguide/dist/` | `/tools/abnehmguide/` |
| Kalorienrechner | `tools/kalorienrechner/dist/` | `/tools/kalorienrechner/` |
| Makrorechner | `tools/makrorechner/dist/` | `/tools/makrorechner/` |
| Abnehmlexikon | `tools/abnehmlexikon/dist/` | `/tools/abnehmlexikon/` |
| Lieblingsübungen | `tools/lieblingsuebungen/dist/` | `/tools/lieblingsuebungen/` |

DailyTogether: separates Projekt `01 - DAILYTOGETHER/`.

## Build

```bash
cd "02 - ENO.ROCKS"
npm run build:tools
npm run deploy:prepare
```
