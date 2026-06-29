import type { GuideFormat } from './types';

export type FormatMeta = {
    id: GuideFormat;
    label: string;
    shortLabel: string;
    description: string;
    placeholderHeader: string;
};

export const FORMATS: FormatMeta[] = [
    {
        id: 'toplist',
        label: 'Meine Top Listen',
        shortLabel: 'Listen',
        description: 'Produkte, Marken und Tools, die mir im Alltag wirklich helfen. Jeder Eintrag mit Begründung und Kontext.',
        placeholderHeader: 'headers/placeholder-toplist.svg',
    },
    {
        id: 'recipe',
        label: 'Meine Rezepte',
        shortLabel: 'Rezepte',
        description: 'Gerichte, die in meinen Plan passen, inklusive Zubereitung und warum sie sich lohnen.',
        placeholderHeader: 'headers/placeholder-recipe.svg',
    },
    {
        id: 'thoughts',
        label: 'Meine Gedanken zu',
        shortLabel: 'Themen',
        description: 'Längere Einordnung zu Themen, die auf TikTok oft nur als Kurzclip rüberkommen.',
        placeholderHeader: 'headers/placeholder-thoughts.svg',
    },
    {
        id: 'tip',
        label: 'Meine Tipps',
        shortLabel: 'Tipps',
        description: 'Konkrete Empfehlungen für Tracking, Training und Ernährung im Alltag.',
        placeholderHeader: 'headers/placeholder-tip.svg',
    },
];

export function formatMeta(id: GuideFormat): FormatMeta {
    const meta = FORMATS.find((entry) => entry.id === id);
    if (!meta) {
        throw new Error(`Unknown format: ${id}`);
    }
    return meta;
}
