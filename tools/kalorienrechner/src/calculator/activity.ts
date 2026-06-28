import type { JobActivity, SportSessions, StepBand } from './types';

const JOB_PAL: Record<JobActivity, number> = {
    sedentary: 1.25,
    mixed: 1.45,
    active: 1.65,
};

const STEP_MODIFIER: Record<StepBand, number> = {
    under2000: -0.04,
    under4000: 0,
    '4000-7000': 0.05,
    '7000-10000': 0.1,
    over10000: 0.15,
};

const SPORT_MODIFIER: Record<SportSessions, number> = {
    '0': 0,
    '1-2': 0.05,
    '3-4': 0.1,
    '5+': 0.15,
};

const JOB_LABELS: Record<JobActivity, string> = {
    sedentary: 'überwiegend sitzend (Bürojob)',
    mixed: 'gemischte Alltagsaktivität',
    active: 'körperlich aktiver Beruf',
};

const STEP_LABELS: Record<StepBand, string> = {
    under2000: 'unter 2.000 Schritte/Tag',
    under4000: 'unter 4.000 Schritte/Tag',
    '4000-7000': '4.000–7.000 Schritte/Tag',
    '7000-10000': '7.000–10.000 Schritte/Tag',
    over10000: 'über 10.000 Schritte/Tag',
};

const SPORT_LABELS: Record<SportSessions, string> = {
    '0': 'kein Training',
    '1-2': '1–2 Trainingseinheiten/Woche',
    '3-4': '3–4 Trainingseinheiten/Woche',
    '5+': '5+ Trainingseinheiten/Woche',
};

export function resolvePal(job: JobActivity, steps: StepBand, sport: SportSessions): number {
    const raw = JOB_PAL[job] + STEP_MODIFIER[steps] + SPORT_MODIFIER[sport];
    return Math.min(2.2, Math.max(1.2, Math.round(raw * 100) / 100));
}

export function palExplanation(job: JobActivity, steps: StepBand, sport: SportSessions, pal: number): string {
    return [
        `Beruf: ${JOB_LABELS[job]}`,
        `Schritte: ${STEP_LABELS[steps]}`,
        `Sport: ${SPORT_LABELS[sport]}`,
        `→ zusammen ca. PAL ${pal.toFixed(2)} (Schätzung für deinen Alltag)`,
    ].join(' · ');
}
