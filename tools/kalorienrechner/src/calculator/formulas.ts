import type { Sex } from './types';

export function roundKcal(value: number): number {
    return Math.round(value / 50) * 50;
}

export function bmrMifflinStJeor(weightKg: number, heightCm: number, age: number, sex: Sex): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === 'male' ? base + 5 : base - 161;
}

export function bmrHarrisBenedict(weightKg: number, heightCm: number, age: number, sex: Sex): number {
    if (sex === 'male') {
        return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
    }

    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

export function bmrSchofield(weightKg: number, age: number, sex: Sex): number {
    if (sex === 'male') {
        if (age < 30) {
            return 15.057 * weightKg + 692.2;
        }

        if (age < 60) {
            return 11.472 * weightKg + 873.1;
        }

        return 11.711 * weightKg + 587.7;
    }

    if (age < 30) {
        return 14.818 * weightKg + 486.6;
    }

    if (age < 60) {
        return 8.126 * weightKg + 845.6;
    }

    return 9.082 * weightKg + 658.5;
}

export function fatFreeMassKg(weightKg: number, bodyFatPercent: number): number {
    return weightKg * (1 - bodyFatPercent / 100);
}

export function bmrKatchMcArdle(weightKg: number, bodyFatPercent: number): number {
    return 370 + 21.6 * fatFreeMassKg(weightKg, bodyFatPercent);
}

export function bmrCunningham(weightKg: number, bodyFatPercent: number): number {
    return 500 + 22 * fatFreeMassKg(weightKg, bodyFatPercent);
}
