import type { GuidePost } from '../types';

export const TIP_POSTS: GuidePost[] = [
    {
        id: 'tipp-waage-trend',
        format: 'tip',
        title: 'Waage: Trend statt Panik',
        lead: 'Täglich wiegen — aber richtig lesen.',
        headerImage: 'headers/tipp-waage.svg',
        body: [
            'Die Waage schwankt durch Wasser, Salz, Kohlenhydrate und Schlaf. Ein Tag sagt wenig.',
            'Schau auf den Durchschnitt von 7–14 Tagen. Steigt der langsam? Defizit passt vermutlich. Steht er? Kleine Anpassung, keine Radikalkur.',
        ],
        items: [
            { name: 'Morgens, nach Toilette', why: 'Gleiche Bedingungen = vergleichbarer.' },
            { name: 'Nicht jeden Tag neu rechnen', why: 'Geduld schlägt Mikromanagement.' },
        ],
    },
];
