import type { GuidePost } from '../types';

export const RECIPE_POSTS: GuidePost[] = [
    {
        id: 'rezept-protein-cheesecake',
        format: 'recipe',
        title: 'Protein Cheesecake',
        lead: 'Dieses Rezept schmeckt nach Dessert, liefert aber deutlich mehr Protein als klassischer Käsekuchen. Ideal, wenn du abends Lust auf Süßes hast, ohne den Tagesplan zu sprengen.',
        headerImage: 'headers/rezept-cheesecake.svg',
        body: [
            'Die Basis aus Skyr oder Magerquark macht den großen Unterschied in den Makros. Du bekommst Cremigkeit und Sättigung bei einem Bruchteil der Kalorien von Kuchen aus dem Supermarkt.',
            'Das Rezept lässt sich in Minuten vorbereiten und hält ein bis zwei Tage im Kühlschrank. So hast du immer eine proteinreiche Antwort auf Heißhunger parat.',
        ],
        ingredients: [
            '400 Gramm Skyr oder Magerquark',
            '30 Gramm Proteinpulver in Geschmack deiner Wahl',
            'Süßstoff nach Bedarf oder ein Teelöffel Honig',
            'Optional: Beeren oder Zartbitterschokolade als Topping',
        ],
        steps: [
            'Skyr mit Proteinpulver und Süßstoff in einer Schüssel glatt verrühren, bis keine Klumpen mehr sichtbar sind.',
            'Die Masse in eine kleine Schüssel oder Glas füllen und mindestens 30 Minuten kalt stellen, damit die Konsistenz fester wird.',
            'Mit frischen Beeren oder etwas zerhackter Schokolade servieren und genießen.',
        ],
    },
];
