import type { GuidePost } from '../types';

export const TIP_POSTS: GuidePost[] = [
    {
        id: 'tipp-waage-trend',
        format: 'tip',
        title: 'Waage richtig lesen',
        lead: 'Die Zahl morgens sagt wenig über deinen Fortschritt aus. Entscheidend ist, wie sich der Wert über mehrere Tage und Wochen entwickelt.',
        headerImage: 'headers/tipp-waage.svg',
        body: [
            'Wassereinlagerungen durch Salz, Kohlenhydrate, Schlaf und Stress können das Gewicht um ein bis drei Kilogramm von einem Tag auf den anderen verschieben. Deshalb ist ein einzelner Messwert fast wertlos.',
            'Wiege dich möglichst unter gleichen Bedingungen, zum Beispiel morgens nach dem Toilettengang. Notiere den Wert oder nutze eine App und betrachte den Durchschnitt von sieben bis vierzehn Tagen. Steigt der langsam, passt dein Plan vermutlich. Steht er, brauchst du eine kleine Anpassung, keine radikale Diät.',
        ],
        items: [
            {
                name: 'Gleiche Messroutine',
                text: 'Gleiche Uhrzeit, gleiche Kleidung und gleiche Waage reduzieren Zufallsschwankungen. So vergleichst du Äpfel mit Äpfeln und erkennst echte Trends früher.',
            },
            {
                name: 'Trend statt Panik',
                text: 'Reagiere auf den Wochenschnitt, nicht auf den Wert von gestern. Wer nach jedem Plus springt, passt zu oft an und verliert den Überblick, ob der Plan grundsätzlich funktioniert.',
            },
        ],
    },
];
