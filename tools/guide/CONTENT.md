# enoGuide · Content pflegen

Internes Tool unter **`/tools/guide/`** (noindex, nicht im Hub verlinkt).

## Formate

| Datei | Format |
|-------|--------|
| `src/content/posts/toplists.ts` | Meine Top-Listen |
| `src/content/posts/recipes.ts` | Meine Rezepte |
| `src/content/posts/thoughts.ts` | Meine Gedanken zu |
| `src/content/posts/tips.ts` | Meine Tipps |

Neuer Beitrag = neues Objekt im passenden Array. `id` muss eindeutig sein (URL-Hash).

## Headbild

Bild in **`public/headers/`** legen, z. B. `top-proteinquellen.jpg`.

Im Beitrag:

```ts
headerImage: 'headers/top-proteinquellen.jpg',
```

Ohne Bild oder bei Fehler: grüner Platzhalter (`default.svg`).

Empfohlen: **1200×480** oder **16:9**, JPG/WebP.

## Top-Liste (Beispiel)

```ts
{
    id: 'top-snacks',
    format: 'toplist',
    title: 'Meine Top Snacks',
    lead: 'Kurzer Teaser wie auf TikTok.',
    headerImage: 'headers/top-snacks.jpg',
    tiktokUrl: 'https://www.tiktok.com/...',  // optional
    items: [
        {
            name: 'Popcorn',
            type: 'Lebensmittel',
            category: 'Snack',
            why: 'Viel Volumen, wenig Kalorien.',
            used: true,
            comment: '',  // optional
        },
    ],
},
```

## Lokal testen

```bash
cd tools/guide
npm install
npm run dev
```

→ `http://localhost:5173/tools/guide/`

## Später: APK

Wenn enoGuide + enoExercises stehen: Shell als PWA/APK (Capacitor o. ä.) — gleiche Content-Dateien.
