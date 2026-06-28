# eno.rocks

Hub und Tools unter einer Marke. Design B: heller Content, Header-Banner, gemeinsame Footer/Tokens.

**Live:** [eno.rocks](https://eno.rocks)

## Struktur

Siehe [docs/STRUCTURE.md](docs/STRUCTURE.md) und [shared/README.md](shared/README.md).

## Tools

| URL | Quellcode | Build |
|-----|-----------|-------|
| `/tools/dailytogether/` | `tools/dailytogether/` | `npm run build` |
| `/tools/kalorienrechner/` | `tools/kalorienrechner/` | `npm run build` |
| `/tools/makrorechner/` | `tools/makrorechner/` | `npm run build` |
| `/tools/uebungen/` | `tools/uebungen/` | `npm run build` |
| `/tools/pedia/` | `tools/pedia/` | `npm run build` |

Alle Tools: `npm run build:tools` (im Projektroot).

## Deploy

**Auto-Deploy:** Siehe [docs/DEPLOY.md](docs/DEPLOY.md) — Push auf `main` → GitHub Actions → FTP auf All-Inkl.

Kurz manuell (falls nötig):

1. `npm run build` und `npm run deploy:prepare`
2. Inhalt von `.deploy/` ins Webroot hochladen

## Headerbild

`assets/eno-header.png` (+ optional `eno-header-wide.png`). Hub nutzt `<picture>` in `index.html`.
