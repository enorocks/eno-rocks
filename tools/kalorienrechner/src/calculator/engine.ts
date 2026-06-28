import {
    bmrCunningham,
    bmrHarrisBenedict,
    bmrKatchMcArdle,
    bmrMifflinStJeor,
    bmrSchofield,
    roundKcal,
} from './formulas';
import { palExplanation, resolvePal } from './activity';
import type { CalculatorInput, CalculatorResult, FormulaResult, GoalOption, ValidationError } from './types';

const RANGE_PERCENT = 0.1;

function buildFormulas(input: CalculatorInput, pal: number): FormulaResult[] {
    const { age, sex, heightCm, weightKg, bodyFatKnown, bodyFatPercent } = input;
    const formulas: FormulaResult[] = [
        {
            id: 'mifflin',
            label: 'Mifflin-St Jeor',
            bmr: bmrMifflinStJeor(weightKg, heightCm, age, sex),
            tdee: 0,
        },
        {
            id: 'schofield',
            label: 'Schofield (WHO)',
            bmr: bmrSchofield(weightKg, age, sex),
            tdee: 0,
        },
        {
            id: 'harris',
            label: 'Harris-Benedict (überarbeitet)',
            bmr: bmrHarrisBenedict(weightKg, heightCm, age, sex),
            tdee: 0,
            note: 'Ältere Referenzformel, hilft beim Vergleich.',
        },
    ];

    if (bodyFatKnown && bodyFatPercent !== null) {
        formulas.push(
            {
                id: 'katch',
                label: 'Katch-McArdle',
                bmr: bmrKatchMcArdle(weightKg, bodyFatPercent),
                tdee: 0,
                note: 'Nutzt deinen Körperfettanteil.',
            },
            {
                id: 'cunningham',
                label: 'Cunningham',
                bmr: bmrCunningham(weightKg, bodyFatPercent),
                tdee: 0,
                note: 'Nutzt deinen Körperfettanteil.',
            },
        );
    }

    return formulas.map((formula) => ({
        ...formula,
        bmr: roundKcal(formula.bmr),
        tdee: roundKcal(formula.bmr * pal),
    }));
}

function buildGoalOptions(averageTdee: number, goal: CalculatorInput['goal']): GoalOption[] {
    const base = roundKcal(averageTdee);

    if (goal === 'lose') {
        return [
            { id: 'lose-10', label: 'Moderates Defizit (−10 %)', percent: -10, kcal: roundKcal(base * 0.9) },
            { id: 'lose-15', label: 'Mittleres Defizit (−15 %)', percent: -15, kcal: roundKcal(base * 0.85) },
            { id: 'lose-20', label: 'Stärkeres Defizit (−20 %)', percent: -20, kcal: roundKcal(base * 0.8) },
        ];
    }

    if (goal === 'gain') {
        return [
            { id: 'gain-10', label: 'Leichter Überschuss (+10 %)', percent: 10, kcal: roundKcal(base * 1.1) },
            { id: 'gain-15', label: 'Mittlerer Überschuss (+15 %)', percent: 15, kcal: roundKcal(base * 1.15) },
        ];
    }

    return [
        { id: 'maintain', label: 'Erhaltung (ca. dein Durchschnitt)', percent: 0, kcal: base },
    ];
}

function proteinRange(weightKg: number, goal: CalculatorInput['goal']): { min: number; max: number; note: string } {
    if (goal === 'lose') {
        return {
            min: Math.round(weightKg * 1.8),
            max: Math.round(weightKg * 2.2),
            note: 'Beim Abnehmen hilft ausreichend Protein, Muskeln möglichst zu erhalten.',
        };
    }

    if (goal === 'gain') {
        return {
            min: Math.round(weightKg * 1.6),
            max: Math.round(weightKg * 1.8),
            note: 'Beim Zunehmen reicht meist ein solider Proteinbereich. Der Überschuss kommt über Kalorien.',
        };
    }

    return {
        min: Math.round(weightKg * 1.6),
        max: Math.round(weightKg * 2.0),
        note: 'Zum Halten ist ein stabiler Proteinbereich sinnvoll, nicht nur Low Carb oder Trends.',
    };
}

export function validateInput(input: Partial<CalculatorInput>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!input.age || input.age < 18 || input.age > 100) {
        errors.push({ field: 'age', message: 'Bitte ein Alter ab 18 Jahren eingeben.' });
    }

    if (!input.weightKg || input.weightKg < 35 || input.weightKg > 250) {
        errors.push({ field: 'weightKg', message: 'Bitte ein realistisches Gewicht in kg eingeben.' });
    }

    if (!input.heightCm || input.heightCm < 130 || input.heightCm > 230) {
        errors.push({ field: 'heightCm', message: 'Bitte eine realistische Größe in cm eingeben.' });
    }

    if (input.bodyFatKnown) {
        const bf = input.bodyFatPercent;
        if (bf === null || bf === undefined || bf < 3 || bf > 60) {
            errors.push({ field: 'bodyFatPercent', message: 'Bitte einen Körperfettanteil zwischen 3 und 60 % eingeben.' });
        }
    }

    return errors;
}

export function calculate(input: CalculatorInput): CalculatorResult {
    const pal = resolvePal(input.job, input.steps, input.sport);
    const formulas = buildFormulas(input, pal);
    const tdeeValues = formulas.map((formula) => formula.tdee);
    const averageTdee = roundKcal(tdeeValues.reduce((sum, value) => sum + value, 0) / tdeeValues.length);
    const rangeMin = roundKcal(averageTdee * (1 - RANGE_PERCENT));
    const rangeMax = roundKcal(averageTdee * (1 + RANGE_PERCENT));
    const protein = proteinRange(input.weightKg, input.goal);

    return {
        formulas,
        averageTdee,
        rangeMin,
        rangeMax,
        pal,
        palExplanation: palExplanation(input.job, input.steps, input.sport, pal),
        goals: buildGoalOptions(averageTdee, input.goal),
        proteinMinG: protein.min,
        proteinMaxG: protein.max,
        proteinNote: protein.note,
    };
}
