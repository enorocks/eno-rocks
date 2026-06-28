# ENO · Shared

Gemeinsame Basis für **eno.rocks** (Hub + Tools). Eine Quelle für Design und Footer.

## Inhalt

| Pfad | Zweck |
|------|--------|
| `css/eno-tokens.css` | Farben, Abstände, `--eno-max` |
| `css/eno-fonts.css` | Inter (`/fonts/Inter/` auf dem Server) |
| `css/eno-footer.css` | Footer-Styles (`.eno-foot`) |
| `css/eno-brand.css` | Wordmark + Tagline (Hub + Tools) |
| `css/eno-tool-shell.css` | Tool-Header, Intro, Layout |
| `ui/footer.ts` | Footer-HTML für Vite-Tools |
| `ui/tool-header.ts` | Brand-Header für Vite-Tools |
| `snippets/footer.html` | Referenz für Hub (`index.html`) |

## Hub

In `eno-landing.css`:

```css
@import url("shared/css/eno-tokens.css");
@import url("shared/css/eno-fonts.css");
@import url("shared/css/eno-footer.css");
```

Footer-Markup: `snippets/footer.html` (oder gleiche Links wie in `footer.ts`).

## Tools

In `src/styles/tool.css`:

```css
@import "../../../../shared/css/eno-tokens.css";
@import "../../../../shared/css/eno-fonts.css";
@import "../../../../shared/css/eno-footer.css";
```

In `src/ui/app.ts`:

```ts
import { renderEnoFooter } from '../../../shared/ui/footer';
// …
${renderEnoFooter()}
```

Überall: `© {Jahr} eno.rocks · Impressum · Datenschutz`

## Deploy

Ordner `shared/` muss **nicht** auf den Server – nur die gebauten/kompilierten Dateien aus Hub und `tools/*/dist/`.
