# enoGuide · Content pflegen

Internes Tool: **`/tools/abnehmguide/`** (noindex).

## Formate

| Datei | Format |
|-------|--------|
| `src/content/posts/toplists.ts` | Meine Top Listen |
| `src/content/posts/recipes.ts` | Meine Rezepte |
| `src/content/posts/thoughts.ts` | Meine Gedanken zu |
| `src/content/posts/tips.ts` | Meine Tipps |

## Neuer Beitrag

```ts
{
    id: 'top-snacks',
    format: 'toplist',
    title: 'Meine Top Snacks',
    lead: 'Zwei bis drei Sätze Einleitung als Fließtext.',
    headerImage: 'headers/top-snacks.jpg',
    items: [
        {
            name: 'Popcorn',
            category: 'Snack',
            text: 'Mindestens zwei bis drei vollständige Sätze. Erklären, warum es sinnvoll ist. Keine Bindestriche im Fließtext.',
        },
    ],
},
```

## Headbild

Datei nach `public/headers/` legen, z. B. `top-snacks.jpg` (ca. 1200×600, JPG/WebP).

## Lokal

```bash
cd tools/abnehmguide && npm run dev
```
