import type { GuideFormat } from './types';

export type FormatMeta = {
    id: GuideFormat;
    label: string;
    description: string;
    placeholderHeader: string;
};

export const FORMATS: FormatMeta[] = [
    {
        id: 'toplist',
        label: 'Meine Top-Listen',
        description: 'Produkte, Marken und Tools — mit kurzem Warum.',
        placeholderHeader: 'headers/placeholder-toplist.svg',
    },
    {
        id: 'recipe',
        label: 'Meine Rezepte',
        description: 'Was ich wirklich koche und warum es sich lohnt.',
        placeholderHeader: 'headers/placeholder-recipe.svg',
    },
    {
        id: 'thoughts',
        label: 'Meine Gedanken zu',
        description: 'Längere Einordnung zu Themen aus TikTok.',
        placeholderHeader: 'headers/placeholder-thoughts.svg',
    },
    {
        id: 'tip',
        label: 'Meine Tipps',
        description: 'Kurz, direkt, umsetzbar.',
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
