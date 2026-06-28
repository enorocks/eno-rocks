export type MacroGoal = 'lose' | 'maintain' | 'gain';

export interface MacroInput {
    kcal: number;
    weightKg: number;
    goal: MacroGoal;
}

export interface MacroSplit {
    minG: number;
    maxG: number;
    midG: number;
    midKcal: number;
    pctKcal: number;
}

export interface MacroResult {
    kcal: number;
    targetWeightKg: number;
    protein: MacroSplit;
    fat: MacroSplit;
    carbs: MacroSplit;
    note: string;
}

export interface MacroValidationError {
    field: string;
    message: string;
}
