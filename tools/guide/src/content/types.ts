export type GuideFormat = 'toplist' | 'recipe' | 'thoughts' | 'tip';

export type GuideListItem = {
    name: string;
    type?: string;
    category?: string;
    /** Ausführlicher Fließtext, mindestens zwei bis drei Sätze. Keine Bindestriche im Text. */
    text: string;
};

export type GuidePost = {
    id: string;
    format: GuideFormat;
    title: string;
    lead?: string;
    headerImage?: string;
    tiktokUrl?: string;
    published?: string;
    items?: GuideListItem[];
    body?: string[];
    ingredients?: string[];
    steps?: string[];
};
