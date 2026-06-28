import type { Equipment, Level } from './exercises';

/**
 * Ganzkörperpläne — geordnete Exercise-IDs pro Equipment × Level.
 * Reihenfolge = Trainingsablauf. Leeres Array = „Plan folgt bald“.
 */
export const FULL_BODY_PLANS: Record<Equipment, Record<Level, string[]>> = {
    kurzhantel: {
        anfaenger: [
            'calf-raise',
            'one-arm-row',
            'hammer-curl',
            'side-twist',
            'bench-press',
            'w-press',
        ],
        fortgeschritten: [
            'split-squat',
            'wide-row',
            'rotating-curl',
            'side-bend',
            'standing-fly',
            'shoulder-press',
        ],
        experte: [
            'romanian-deadlift',
            'wide-row',
            'rotating-curl',
            'side-bend',
            'decline-bench',
            'shoulder-press',
        ],
    },
    bodyweight: {
        anfaenger: [
            'bodyweight-squat',
            'superman',
            'chair-dip',
            'bw-side-twist',
            'push-up',
            'pike-push-up',
        ],
        fortgeschritten: [
            'lunge',
            'bird-dog',
            'diamond-push-up',
            'plank',
            'wide-push-up',
            'shoulder-tap-plank',
        ],
        experte: [
            'pistol-squat-assisted',
            'reverse-snow-angel',
            'diamond-push-up',
            'plank',
            'decline-push-up',
            'shoulder-tap-plank',
        ],
    },
};

export function fullBodyPlanIds(equipment: Equipment, level: Level): string[] {
    return FULL_BODY_PLANS[equipment][level];
}
