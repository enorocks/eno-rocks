import { readStorageJson, writeStorageJson } from '../../../../shared/ui/browser-storage';

const STORAGE_KEY = 'eno-pedia-term-stats-v1';

const DEFAULT_TERM_IDS = [
    'protein',
    'kaloriendefizit',
    'kreatin',
    'magnesium',
    'krafttraining',
    'abnehmen',
    'koerperfettanteil',
    'tracken',
];

function loadStats(): Record<string, number> {
    return readStorageJson<Record<string, number>>(STORAGE_KEY) ?? {};
}

export function recordTermView(termId: string): void {
    const stats = loadStats();
    stats[termId] = (stats[termId] ?? 0) + 1;
    writeStorageJson(STORAGE_KEY, stats);
}

export function getPopularTermIds(limit = 8): string[] {
    const stats = loadStats();
    const ranked = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

    return [...new Set([...ranked, ...DEFAULT_TERM_IDS])].slice(0, limit);
}
