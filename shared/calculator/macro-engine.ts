import type {
    MacroGoal,
    MacroInput,
    MacroResult,
    MacroSplit,
    MacroValidationError,
} from './macro-types';

const KCAL_PER_G_PROTEIN = 4;
const KCAL_PER_G_CARBS = 4;
const KCAL_PER_G_FAT = 9;

function roundG(value: number): number {
    return Math.round(value / 5) * 5;
}

function proteinPerKg(goal: MacroGoal): { min: number; max: number } {
    if (goal === 'lose') {
        return { min: 1.8, max: 2.2 };
    }
    if (goal === 'gain') {
        return { min: 1.6, max: 1.8 };
    }
    return { min: 1.6, max: 2.0 };
}

function fatPerKg(): { min: number; max: number } {
    return { min: 0.7, max: 1.0 };
}

function buildSplit(
    minG: number,
    maxG: number,
    midG: number,
    kcalPerG: number,
    totalKcal: number,
): MacroSplit {
    const midKcal = midG * kcalPerG;
    return {
        minG,
        maxG,
        midG,
        midKcal,
        pctKcal: totalKcal > 0 ? Math.round((midKcal / totalKcal) * 100) : 0,
    };
}

export function validateMacroInput(input: Partial<MacroInput>): MacroValidationError[] {
    const errors: MacroValidationError[] = [];

    if (!input.kcal || input.kcal < 1200 || input.kcal > 6000) {
        errors.push({ field: 'kcal', message: 'Bitte ein Kalorienziel zwischen 1.200 und 6.000 kcal eingeben.' });
    }

    if (!input.weightKg || input.weightKg < 35 || input.weightKg > 250) {
        errors.push({ field: 'weightKg', message: 'Bitte ein realistisches Wunsch- oder Normalgewicht in kg eingeben.' });
    }

    if (input.kcal && input.weightKg && input.goal) {
        const protein = proteinPerKg(input.goal);
        const fat = fatPerKg();
        const minProteinG = roundG(input.weightKg * protein.min);
        const minFatG = roundG(input.weightKg * fat.min);
        const floorKcal = minProteinG * KCAL_PER_G_PROTEIN + minFatG * KCAL_PER_G_FAT;

        if (input.kcal < floorKcal) {
            errors.push({
                field: 'kcal',
                message: 'Für dieses Gewicht wirken die Kalorien sehr niedrig. Bitte prüfen oder enoCalories nutzen.',
            });
        }
    }

    return errors;
}

export function calculateMacros(input: MacroInput): MacroResult {
    const { kcal, weightKg, goal } = input;
    const proteinRange = proteinPerKg(goal);
    const fatRange = fatPerKg();

    const proteinMinG = roundG(weightKg * proteinRange.min);
    const proteinMaxG = roundG(weightKg * proteinRange.max);
    const proteinMidG = roundG((proteinMinG + proteinMaxG) / 2);

    const fatMinG = roundG(weightKg * fatRange.min);
    const fatMaxG = roundG(weightKg * fatRange.max);
    const fatMidG = roundG((fatMinG + fatMaxG) / 2);

    const carbsAtMaxProteinFat =
        (kcal - proteinMaxG * KCAL_PER_G_PROTEIN - fatMaxG * KCAL_PER_G_FAT) / KCAL_PER_G_CARBS;
    const carbsAtMinProteinFat =
        (kcal - proteinMinG * KCAL_PER_G_PROTEIN - fatMinG * KCAL_PER_G_FAT) / KCAL_PER_G_CARBS;

    const carbsMinG = roundG(Math.max(0, Math.min(carbsAtMaxProteinFat, carbsAtMinProteinFat)));
    const carbsMaxG = roundG(Math.max(0, Math.max(carbsAtMaxProteinFat, carbsAtMinProteinFat)));
    const carbsMidG = roundG(
        Math.max(0, (kcal - proteinMidG * KCAL_PER_G_PROTEIN - fatMidG * KCAL_PER_G_FAT) / KCAL_PER_G_CARBS),
    );

    const protein = buildSplit(proteinMinG, proteinMaxG, proteinMidG, KCAL_PER_G_PROTEIN, kcal);
    const fat = buildSplit(fatMinG, fatMaxG, fatMidG, KCAL_PER_G_FAT, kcal);
    const carbs = buildSplit(carbsMinG, carbsMaxG, carbsMidG, KCAL_PER_G_CARBS, kcal);

    return {
        kcal,
        targetWeightKg: weightKg,
        protein,
        fat,
        carbs,
        note: '',
    };
}
