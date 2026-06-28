import type { GlossaryTerm } from './terms';

const RELATED_LIMIT = 4;

export function getRelatedTerms(term: GlossaryTerm, allTerms: GlossaryTerm[]): GlossaryTerm[] {
    return allTerms
        .filter((candidate) => candidate.id !== term.id && candidate.category === term.category)
        .sort((a, b) => a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }))
        .slice(0, RELATED_LIMIT);
}
