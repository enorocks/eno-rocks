# Auto-Deploy für eno.rocks (All-Inkl + GitHub)

Bei jedem Push auf `main` baut GitHub Actions alle Tools und lädt den fertigen Stand per FTP auf All-Inkl hoch. Du musst nichts mehr manuell per FileZilla hochladen.

## Was du einmal einrichten musst

### 1. GitHub-Repository anlegen

1. Auf [github.com](https://github.com) ein **privates** Repo erstellen, z. B. `eno-rocks`.
2. Im Projektordner `02 - ENO.ROCKS`:

```powershell
cd "C:\Users\WebdesignHofmann\Desktop\PROJEKTE\02 - ENO.ROCKS"
git init
git add .
git commit -m "Initial commit: eno.rocks Hub und Tools"
git branch -M main
git remote add origin https://github.com/DEIN-USER/eno-rocks.git
git push -u origin main
```

### 2. FTP-Zugangsdaten aus dem All-Inkl KAS

Im KAS unter **FTP** / **Zusatzuser** notieren:

| Wert | Beispiel |
|------|----------|
| Server | `w0123456.kasserver.com` |
| Benutzer | `w0123456` oder Zusatzuser |
| Passwort | dein FTP-Passwort |
| Zielordner | oft `/` oder der Ordner der Domain `eno.rocks` |

Tipp: In FileZilla nachschauen, welcher **Remote-Pfad** bisher dein Webroot war — genau den brauchst du als `FTP_SERVER_DIR`.

### 3. GitHub Secrets hinterlegen

Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret | Inhalt |
|--------|--------|
| `FTP_SERVER` | z. B. `w0123456.kasserver.com` |
| `FTP_USERNAME` | FTP-Benutzername |
| `FTP_PASSWORD` | FTP-Passwort |
| `FTP_SERVER_DIR` | Remote-Webroot, z. B. `/` oder `/eno.rocks/` |

Ohne trailing issues: bei All-Inkl oft einfach `/` wenn die Domain direkt auf den Account zeigt.

### 4. Fertig testen

- Push auf `main` → unter **Actions** den Workflow „Deploy eno.rocks“ beobachten
- Oder manuell: **Actions** → **Deploy eno.rocks** → **Run workflow**

Nach ca. 2–4 Minuten sollte [eno.rocks](https://eno.rocks) aktualisiert sein.

## Alltag

```text
Änderung machen → git add . → git commit -m "…" → git push
```

GitHub baut und deployed automatisch.

## Lokal prüfen (optional)

```powershell
npm run install:tools   # einmalig nach clone
npm run build
npm run deploy:prepare  # erzeugt Ordner .deploy/ wie auf dem Server
```

## Was deployed wird

Das Skript `scripts/prepare-deploy.mjs` packt alles in `.deploy/`:

- Hub: `index.html`, CSS, `assets/`, `fonts/`, Legal-Seiten
- `shared/css/`, `shared/js/`, `shared/vendor/lucide/`
- `tools/*/dist/` → `tools/<name>/` auf dem Server

## Hinweise

- **Privates Repo** empfohlen (FTP-Passwort liegt in GitHub Secrets, nicht im Code).
- `dangerous-clean-slate` ist **aus** — es werden nur geänderte Dateien hochgeladen, nichts Remote gelöscht.
- Wenn der Deploy fehlschlägt: Actions-Log öffnen, meist ist `FTP_SERVER_DIR` falsch oder der FTP-User hat keinen Schreibzugriff auf den Webroot.
