import type { GlossaryTerm } from './terms';

export type ToolLink = {
    href: string;
    label: string;
};

const CALORIES = { href: '/tools/kalorienrechner/', label: 'enoCalories' };
const MACROS = { href: '/tools/makrorechner/', label: 'enoMacros' };
const EXERCISES = { href: '/tools/lieblingsuebungen/', label: 'enoExercises' };

/** Begriffe mit direktem Link zu eno.rocks-Tools. */
export const TOOL_LINKS: Record<string, ToolLink> = {
    // Kalorien & Energie
    kalorie: CALORIES,
    energiebedarf: CALORIES,
    grundumsatz: CALORIES,
    leistungsumsatz: CALORIES,
    gesamtumsatz: CALORIES,
    energiebilanz: CALORIES,
    kaloriendefizit: CALORIES,
    kalorienueberschuss: CALORIES,
    erhaltungskalorien: CALORIES,
    kaloriendichte: CALORIES,
    defizitgroesse: CALORIES,
    tagesbudget: CALORIES,
    kalorienzahlen: CALORIES,
    tracken: CALORIES,
    abnehmen: CALORIES,
    fettverlust: CALORIES,
    plateau: CALORIES,
    'diet-break': CALORIES,
    refeed: CALORIES,
    'reverse-diet': CALORIES,
    'lean-bulk': CALORIES,
    'mini-cut': CALORIES,
    neat: CALORIES,
    schritte: CALORIES,
    cardio: CALORIES,
    'koerperfettanteil': CALORIES,

    // Makros
    makronaehrstoffe: MACROS,
    protein: MACROS,
    kohlenhydrate: MACROS,
    fett: MACROS,
    ballaststoffe: MACROS,
    proteinbedarf: MACROS,
    makroverteilung: MACROS,
    'protein-pro-mahlzeit': MACROS,

    // Training → enoExercises
    krafttraining: EXERCISES,
    hypertrophie: EXERCISES,
    ganzkoerperplan: EXERCISES,
    split: EXERCISES,
    'push-pull-legs': EXERCISES,
    'oberkoerper-unterkoerper': EXERCISES,
    'compound-uebung': EXERCISES,
    'isolation-uebung': EXERCISES,
    regeneration: EXERCISES,
    technik: EXERCISES,
    volumen: EXERCISES,
};

export function getToolLink(term: GlossaryTerm): ToolLink | null {
    return TOOL_LINKS[term.id] ?? null;
}
