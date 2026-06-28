export type Sex = 'male' | 'female';

export type Goal = 'lose' | 'maintain' | 'gain';

export type JobActivity = 'sedentary' | 'mixed' | 'active';

export type StepBand = 'under2000' | 'under4000' | '4000-7000' | '7000-10000' | 'over10000';

export type SportSessions = '0' | '1-2' | '3-4' | '5+';

export interface CalculatorInput {
    age: number;
    sex: Sex;
    heightCm: number;
    weightKg: number;
    bodyFatKnown: boolean;
    bodyFatPercent: number | null;
    goal: Goal;
    job: JobActivity;
    steps: StepBand;
    sport: SportSessions;
}

export interface FormulaResult {
    id: string;
    label: string;
    bmr: number;
    tdee: number;
    note?: string;
}

export interface GoalOption {
    id: string;
    label: string;
    percent: number;
    kcal: number;
}

export interface CalculatorResult {
    formulas: FormulaResult[];
    averageTdee: number;
    rangeMin: number;
    rangeMax: number;
    pal: number;
    palExplanation: string;
    goals: GoalOption[];
    proteinMinG: number;
    proteinMaxG: number;
    proteinNote: string;
}

export interface ValidationError {
    field: string;
    message: string;
}
