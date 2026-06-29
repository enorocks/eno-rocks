import type { GuidePost } from '../types';

export const RECIPE_POSTS: GuidePost[] = [
    {
        id: 'rezept-protein-cheesecake',
        format: 'recipe',
        title: 'Protein-Cheesecake',
        lead: 'Fühlt sich an wie Cheat — passt aber in den Plan.',
        headerImage: 'headers/rezept-cheesecake.svg',
        body: ['Aus meiner Snack-Top-Liste — hier die ausführliche Version für die Website.'],
        ingredients: [
            'Skyr oder Magerquark — Menge nach Bedarf',
            'Proteinpulver (Geschmack nach Wahl)',
            'Süßstoff oder etwas Honig',
            'Optional: Beeren obendrauf',
        ],
        steps: [
            'Alles verrühren bis cremig.',
            'In eine Schüssel füllen, kurz kalt stellen.',
            'Mit Beeren servieren — fertig.',
        ],
    },
];
