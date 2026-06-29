export type GuideFormat = 'toplist' | 'recipe' | 'thoughts' | 'tip';

export type GuideListItem = {
    name: string;
    type?: string;
    category?: string;
    why: string;
    used?: boolean;
    comment?: string;
};

export type GuidePost = {
    id: string;
    format: GuideFormat;
    title: string;
    lead?: string;
    /** Datei unter public/headers/, z. B. headers/top-protein.jpg */
    headerImage?: string;
    tiktokUrl?: string;
    published?: string;
    items?: GuideListItem[];
    /** Fließtext-Absätze für Gedanken, Tipps oder Rezept-Einleitung */
    body?: string[];
    /** Rezept: Zutaten */
    ingredients?: string[];
    /** Rezept: Schritte */
    steps?: string[];
};
