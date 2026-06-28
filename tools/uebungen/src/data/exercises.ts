import { fullBodyPlanIds } from './full-body-plans';

export type MuscleId = 'beine' | 'ruecken' | 'arme' | 'rumpf' | 'brust' | 'schultern';
export type Equipment = 'kurzhantel' | 'bodyweight';
export type Level = 'anfaenger' | 'fortgeschritten' | 'experte';
export type FilterKey = 'muscle' | 'equipment' | 'level';
export type WizardMode = 'browse' | 'fullbody';

export const WIZARD_MODE_FULLBODY: WizardMode = 'fullbody';
export const WIZARD_MODE_BROWSE: WizardMode = 'browse';

export type Exercise = {
    id: string;
    name: string;
    muscle: MuscleId;
    equipment: Equipment;
    level: Level;
    cues: string[];
    image?: string;
};

export const MUSCLE_OPTIONS: { id: MuscleId; label: string }[] = [
    { id: 'beine', label: 'Beine' },
    { id: 'ruecken', label: 'Rücken' },
    { id: 'arme', label: 'Arme' },
    { id: 'rumpf', label: 'Rumpf' },
    { id: 'brust', label: 'Brust' },
    { id: 'schultern', label: 'Schultern' },
];

export const EQUIPMENT_OPTIONS: { id: Equipment; label: string }[] = [
    { id: 'kurzhantel', label: 'Kurzhantel' },
    { id: 'bodyweight', label: 'Ohne Geräte' },
];

export const LEVEL_OPTIONS: { id: Level; label: string }[] = [
    { id: 'anfaenger', label: 'Anfänger' },
    { id: 'fortgeschritten', label: 'Fortgeschritten' },
    { id: 'experte', label: 'Experte' },
];

export const WIZARD_QUESTIONS: Record<FilterKey, string> = {
    muscle: 'Hallo,<br>was willst du heute trainieren?',
    equipment: 'Womit möchtest du heute trainieren?',
    level: 'Wie ist dein Fitness-Stand?',
};

export const EXERCISES: Exercise[] = [
    // —— Beine · Kurzhantel ——
    {
        id: 'calf-raise',
        name: 'Wadenheben (Calf Raise)',
        muscle: 'beine',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'calf-raise.jpg',
        cues: [
            'Stehend, optional Kurzhanteln in den Händen.',
            'Langsam auf die Zehenspitzen, oben kurz halten.',
            'Kontrolliert absenken, Knie nicht durchdrücken.',
        ],
    },
    {
        id: 'split-squat',
        name: 'Split Squat',
        muscle: 'beine',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'split-squat.jpg',
        cues: [
            'Ein Fuß nach hinten, vorderer Fuß bleibt flach.',
            'Optional Kurzhanteln seitlich, senken bis Oberschenkel parallel.',
            'Durch die vordere Ferse hochdrücken.',
        ],
    },
    {
        id: 'squat',
        name: 'Kniebeuge mit Kurzhanteln',
        muscle: 'beine',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'squat.jpg',
        cues: [
            'Kurzhanteln seitlich oder vor der Brust halten.',
            'Hüfte nach hinten-unten, Brust bleibt aufrecht.',
            'Knie folgen den Zehen, oben Hüfte durchdrücken.',
        ],
    },
    {
        id: 'romanian-deadlift',
        name: 'Rumänisches Kreuzheben',
        muscle: 'beine',
        equipment: 'kurzhantel',
        level: 'experte',
        image: 'romanian-deadlift.jpg',
        cues: [
            'Kurzhanteln vor den Oberschenkeln, leichte Beugung in den Knien.',
            'Hüfte nach hinten schieben, Hanteln entlang der Beine führen.',
            'Rücken gerade halten, Po-Spannung oben spüren.',
        ],
    },

    // —— Beine · Ohne Geräte ——
    {
        id: 'bodyweight-squat',
        name: 'Kniebeugen',
        muscle: 'beine',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'bodyweight-squat.jpg',
        cues: [
            'Füße schulterbreit, Fersen am Boden.',
            'Hüfte nach hinten-unten, Brust bleibt aufrecht.',
            'Knie folgen den Zehen, oben Hüfte durchdrücken.',
        ],
    },
    {
        id: 'bw-calf-raise',
        name: 'Wadenheben',
        muscle: 'beine',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'bw-calf-raise.jpg',
        cues: [
            'Stehend, Hände an der Hüfte oder an der Wand zur Balance.',
            'Langsam auf die Zehenspitzen, oben kurz halten.',
            'Kontrolliert absenken.',
        ],
    },
    {
        id: 'lunge',
        name: 'Ausfallschritte',
        muscle: 'beine',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'lunge.jpg',
        cues: [
            'Großer Schritt nach vorn, Oberkörper aufrecht.',
            'Hinteres Knie Richtung Boden, vorderes Knie über dem Fuß.',
            'Durch die Ferse hochdrücken, Seite wechseln.',
        ],
    },
    {
        id: 'jump-squat',
        name: 'Sprung-Kniebeugen',
        muscle: 'beine',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'jump-squat.jpg',
        cues: [
            'Kniebeuge absenken, Arme nach hinten schwingen.',
            'Explosiv hochspringen, weich landen.',
            'Direkt in die nächste Wiederholung übergehen.',
        ],
    },
    {
        id: 'pistol-squat-assisted',
        name: 'Einbeinige Kniebeuge (assistiert)',
        muscle: 'beine',
        equipment: 'bodyweight',
        level: 'experte',
        image: 'pistol-squat.jpg',
        cues: [
            'Ein Bein nach vorn, optional an Stuhl oder Wand festhalten.',
            'Langsam auf dem Standbein absenken, Rücken gerade.',
            'Kontrolliert hochdrücken, Seite wechseln.',
        ],
    },

    // —— Rücken · Kurzhantel ——
    {
        id: 'one-arm-row',
        name: 'Einarmiges Rudern',
        muscle: 'ruecken',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'one-arm-row.jpg',
        cues: [
            'Hand und Knie auf der Bank, Rücken gerade.',
            'Hantel zum Hüftknochen ziehen, Ellbogen nah am Körper.',
            'Oben kurz halten, Schulter nicht hochziehen.',
        ],
    },
    {
        id: 'shrugs',
        name: 'Schulterheben (Shrugs)',
        muscle: 'ruecken',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'shrugs.jpg',
        cues: [
            'Stehend, Kurzhanteln seitlich, Arme gestreckt.',
            'Schultern gerade nach oben ziehen, Nacken lang.',
            'Oben kurz halten, langsam senken.',
        ],
    },
    {
        id: 'wide-row',
        name: 'Wide Row',
        muscle: 'ruecken',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'wide-row.jpg',
        cues: [
            'Oberkörper leicht nach vorn geneigt, Core fest.',
            'Kurzhanteln mit breitem Ellbogenwinkel nach hinten ziehen.',
            'Schulterblätter zusammenziehen, kontrolliert senken.',
        ],
    },

    // —— Rücken · Ohne Geräte ——
    {
        id: 'superman',
        name: 'Superman',
        muscle: 'ruecken',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'superman.jpg',
        cues: [
            'Bauchlage, Arme nach vorn oder seitlich.',
            'Brust und Beine leicht anheben, Blick zum Boden.',
            'Kurz halten, langsam absenken — nicht schwingen.',
        ],
    },
    {
        id: 'bird-dog',
        name: 'Bird Dog',
        muscle: 'ruecken',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'bird-dog.jpg',
        cues: [
            'Vierfüßlerstand, Rücken neutral.',
            'Gegenüberliegenden Arm und Bein strecken.',
            'Kurz halten, Rumpf ruhig halten, Seite wechseln.',
        ],
    },
    {
        id: 'reverse-snow-angel',
        name: 'Reverse Snow Angel',
        muscle: 'ruecken',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'reverse-snow-angel.jpg',
        cues: [
            'Bauchlage, Stirn leicht angehoben.',
            'Arme über den Kopf führen und in einem Bogen nach unten.',
            'Schulterblätter aktivieren, langsam zurück.',
        ],
    },

    // —— Arme · Kurzhantel ——
    {
        id: 'hammer-curl',
        name: 'Hammercurl',
        muscle: 'arme',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'hammer-curl.jpg',
        cues: [
            'Stehend, Kurzhanteln seitlich am Körper (neutraler Griff).',
            'Ellbogen bleiben am Körper, nur Unterarm bewegt sich.',
            'Oben kurz halten, kontrolliert senken.',
        ],
    },
    {
        id: 'forearm-curl',
        name: 'Unterarmcurl',
        muscle: 'arme',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'forearm-curl.jpg',
        cues: [
            'Unterarme auf den Oberschenkeln oder Bankkante.',
            'Handgelenke nach oben rollen, Kurzhantel festhalten.',
            'Langsam zurück, voller Bewegungsumfang.',
        ],
    },
    {
        id: 'rotating-curl',
        name: 'Rotating Bicep Curl',
        muscle: 'arme',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'rotating-curl.jpg',
        cues: [
            'Stehend, Handflächen zeigen nach vorn (supinierter Griff unten).',
            'Beim Hochheben Handgelenk drehen, Handfläche zeigt nach oben.',
            'Oben kurz halten, beim Senken wieder drehen.',
        ],
    },

    // —— Arme · Ohne Geräte ——
    {
        id: 'chair-dip',
        name: 'Trizeps-Dips am Stuhl',
        muscle: 'arme',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'chair-dip.jpg',
        cues: [
            'Hände auf Stuhl oder Bankkante, Beine gestreckt oder gebeugt.',
            'Ellbogen nach hinten beugen, Schultern bleiben unten.',
            'Oben durchdrücken, ohne die Schultern hochzuziehen.',
        ],
    },
    {
        id: 'close-push-up',
        name: 'Enge Liegestütze',
        muscle: 'arme',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'close-push-up.jpg',
        cues: [
            'Hände schulterbreit oder enger, Daumen zeigen zueinander.',
            'Ellbogen nah am Körper, Brust Richtung Hände senken.',
            'Kontrolliert hochdrücken, Core bleibt fest.',
        ],
    },
    {
        id: 'diamond-push-up',
        name: 'Diamond Push-ups',
        muscle: 'arme',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'diamond-push-up.jpg',
        cues: [
            'Daumen und Zeigefinger bilden ein Dreieck unter der Brust.',
            'Tief absenken, Ellbogen eng am Körper.',
            'Kraftvoll hochdrücken, Hüfte nicht durchhängen lassen.',
        ],
    },

    // —— Rumpf · Kurzhantel ——
    {
        id: 'side-twist',
        name: 'Seit-Twist (Russian Twist)',
        muscle: 'rumpf',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'side-twist.jpg',
        cues: [
            'Sitzend, leicht nach hinten gelehnt, Füße am Boden.',
            'Optional Kurzhantel vor der Brust halten.',
            'Oberkörper kontrolliert zur Seite drehen, Rumpf bleibt aktiv.',
        ],
    },
    {
        id: 'side-bend',
        name: 'Seitbeuge',
        muscle: 'rumpf',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'side-bend.jpg',
        cues: [
            'Stehend, optional eine Kurzhantel in einer Hand.',
            'Seitlich zur Seite beugen, Rumpf stabil halten.',
            'Kontrolliert zurück in die Mitte, nicht schwingen.',
        ],
    },

    // —— Rumpf · Ohne Geräte ——
    {
        id: 'bw-side-twist',
        name: 'Seit-Twist',
        muscle: 'rumpf',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'bw-side-twist.jpg',
        cues: [
            'Sitzend, leicht nach hinten gelehnt, Füße am Boden.',
            'Hände vor der Brust verschränken.',
            'Oberkörper kontrolliert zur Seite drehen.',
        ],
    },
    {
        id: 'bw-side-bend',
        name: 'Seitbeuge',
        muscle: 'rumpf',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'bw-side-bend.jpg',
        cues: [
            'Stehend, Hände hinter dem Kopf oder an der Hüfte.',
            'Seitlich zur Seite beugen, Rumpf stabil halten.',
            'Kontrolliert zurück in die Mitte.',
        ],
    },
    {
        id: 'plank',
        name: 'Unterarmstütz (Plank)',
        muscle: 'rumpf',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'plank.jpg',
        cues: [
            'Unterarme unter den Schultern, Körper in einer Linie.',
            'Bauch und Gesäß anspannen, Hüfte nicht durchhängen.',
            'Ruhig atmen, Position halten.',
        ],
    },

    // —— Brust · Kurzhantel ——
    {
        id: 'bench-press',
        name: 'Flachbankdrücken',
        muscle: 'brust',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'bench-press.jpg',
        cues: [
            'Hantelbank flach, Füße fest am Boden.',
            'Kurzhanteln auf Brusthöhe senken, Ellbogen ca. 45°.',
            'Oben kurz halten, Schulterblätter zusammen.',
        ],
    },
    {
        id: 'decline-bench',
        name: 'Negativbankdrücken (Decline)',
        muscle: 'brust',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'decline-bench.jpg',
        cues: [
            'Bank leicht negativ/neigbar, Füße fixieren.',
            'Kurzhanteln zur unteren Brust führen, Ellbogen kontrolliert.',
            'Drücken ohne die Schultern nach vorn zu rollen.',
        ],
    },
    {
        id: 'standing-fly',
        name: 'Stehende Flys',
        muscle: 'brust',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'standing-fly.jpg',
        cues: [
            'Stehend, leichte Beugung in den Ellbogen behalten.',
            'Arme seitlich öffnen, Spannung in der Brust spüren.',
            'Langsam schließen, nicht zusammenklatschen.',
        ],
    },

    // —— Brust · Ohne Geräte ——
    {
        id: 'push-up',
        name: 'Liegestütze',
        muscle: 'brust',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'push-up.jpg',
        cues: [
            'Hände etwas breiter als schulterbreit, Körper in einer Linie.',
            'Brust Richtung Boden, Ellbogen nicht zu weit nach außen.',
            'Kontrolliert hochdrücken, Core bleibt fest.',
        ],
    },
    {
        id: 'wide-push-up',
        name: 'Breite Liegestütze',
        muscle: 'brust',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'wide-push-up.jpg',
        cues: [
            'Hände weiter als schulterbreit, Körper gerade.',
            'Tief absenken, Brust zwischen den Händen führen.',
            'Kontrolliert hoch, Core bleibt aktiv.',
        ],
    },
    {
        id: 'decline-push-up',
        name: 'Liegestütze mit erhöhten Füßen',
        muscle: 'brust',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'decline-push-up.jpg',
        cues: [
            'Füße auf Stufe oder Stuhl, Hände am Boden.',
            'Körper in einer Linie halten, Brust tief absenken.',
            'Kontrolliert hochdrücken.',
        ],
    },

    // —— Schultern · Kurzhantel ——
    {
        id: 'w-press',
        name: 'W-Press',
        muscle: 'schultern',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'w-press.jpg',
        cues: [
            'Stehend oder sitzend, Core anspannen.',
            'Ellbogen im W-Winkel, Hanteln auf Schulterhöhe.',
            'Nach oben drücken, oben nicht überstrecken.',
        ],
    },
    {
        id: 'upright-row',
        name: 'Aufrechtes Rudern',
        muscle: 'schultern',
        equipment: 'kurzhantel',
        level: 'anfaenger',
        image: 'upright-row.jpg',
        cues: [
            'Kurzhanteln vor dem Körper, Schulterbreiter Griff.',
            'Ellbogen nach oben führen, Hanteln entlang des Körpers.',
            'Nicht zu hoch ziehen — Schultern bleiben unten.',
        ],
    },
    {
        id: 'lateral-raise',
        name: 'Lateral Raise',
        muscle: 'schultern',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'lateral-raise.jpg',
        cues: [
            'Stehend, leichte Beugung in den Ellbogen.',
            'Arme seitlich bis Schulterhöhe heben, Daumen leicht nach unten.',
            'Langsam senken, nicht schwingen.',
        ],
    },
    {
        id: 'front-raise',
        name: 'Front Raise',
        muscle: 'schultern',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'front-raise.jpg',
        cues: [
            'Stehend, Kurzhanteln vor den Oberschenkeln.',
            'Arme gestreckt oder leicht gebeugt nach vorn heben.',
            'Bis Schulterhöhe, kontrolliert zurück.',
        ],
    },
    {
        id: 'shoulder-press',
        name: 'Shoulder Press',
        muscle: 'schultern',
        equipment: 'kurzhantel',
        level: 'fortgeschritten',
        image: 'shoulder-press.jpg',
        cues: [
            'Stehend oder sitzend, Hanteln auf Schulterhöhe.',
            'Nach oben drücken, Kopf leicht zurückweichen lassen.',
            'Oben nicht überstrecken, Core bleibt fest.',
        ],
    },

    // —— Schultern · Ohne Geräte ——
    {
        id: 'pike-push-up',
        name: 'Pike-Liegestütze',
        muscle: 'schultern',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'pike-push-up.jpg',
        cues: [
            'Hüfte hoch, Körper bildet ein umgekehrtes V.',
            'Kopf zwischen den Händen Richtung Boden senken.',
            'Durch die Schultern hochdrücken.',
        ],
    },
    {
        id: 'wall-push-up',
        name: 'Liegestütze an der Wand',
        muscle: 'schultern',
        equipment: 'bodyweight',
        level: 'anfaenger',
        image: 'wall-push-up.jpg',
        cues: [
            'Hände schulterbreit an der Wand, leichter Winkel im Körper.',
            'Brust Richtung Wand senken, Ellbogen nach hinten.',
            'Kontrolliert zurückdrücken.',
        ],
    },
    {
        id: 'shoulder-tap-plank',
        name: 'Schulter-Taps im Plank',
        muscle: 'schultern',
        equipment: 'bodyweight',
        level: 'fortgeschritten',
        image: 'shoulder-tap-plank.jpg',
        cues: [
            'High Plank, Hüfte ruhig halten.',
            'Abwechselnd eine Hand zur gegenüberliegenden Schulter führen.',
            'Rumpf stabil, wenig Wackeln.',
        ],
    },
];

export function labelForMuscle(id: MuscleId): string {
    return MUSCLE_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export function labelForEquipment(id: Equipment): string {
    return EQUIPMENT_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export function labelForLevel(id: Level): string {
    return LEVEL_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export function filterExercises(
    muscle: MuscleId,
    equipment: Equipment,
    level: Level,
): Exercise[] {
    return EXERCISES.filter(
        (exercise) =>
            exercise.muscle === muscle &&
            exercise.equipment === equipment &&
            exercise.level === level,
    );
}

export function getExerciseById(id: string): Exercise | undefined {
    return EXERCISES.find((exercise) => exercise.id === id);
}

export function resolveExercisesByIds(ids: string[]): Exercise[] {
    return ids
        .map((id) => getExerciseById(id))
        .filter((exercise): exercise is Exercise => exercise !== undefined);
}

export function resolveFullBodyPlan(equipment: Equipment, level: Level): Exercise[] {
    return resolveExercisesByIds(fullBodyPlanIds(equipment, level));
}

export function isWizardMode(value: string | null): value is WizardMode {
    return value === 'browse' || value === 'fullbody';
}

export function isMuscle(value: string | null): value is MuscleId {
    return MUSCLE_OPTIONS.some((option) => option.id === value);
}

export function isEquipment(value: string | null): value is Equipment {
    return EQUIPMENT_OPTIONS.some((option) => option.id === value);
}

export function isLevel(value: string | null): value is Level {
    return LEVEL_OPTIONS.some((option) => option.id === value);
}

export function nextWizardStep(
    mode: WizardMode | undefined,
    muscle?: MuscleId,
    equipment?: Equipment,
    level?: Level,
): FilterKey | null {
    if (mode === 'fullbody') {
        if (!equipment) {
            return 'equipment';
        }
        if (!level) {
            return 'level';
        }
        return null;
    }

    if (!muscle) {
        return 'muscle';
    }
    if (!equipment) {
        return 'equipment';
    }
    if (!level) {
        return 'level';
    }
    return null;
}

export function wizardStepCount(mode: WizardMode | undefined): number {
    return mode === 'fullbody' ? 2 : 3;
}

export function wizardStepIndex(mode: WizardMode | undefined, step: FilterKey): number {
    if (mode === 'fullbody') {
        return step === 'equipment' ? 1 : 2;
    }
    return step === 'muscle' ? 1 : step === 'equipment' ? 2 : 3;
}

export const FULLBODY_LABEL = 'Ganzkörper';

export function findExerciseById(id: string): Exercise | undefined {
    return EXERCISES.find((exercise) => exercise.id === id);
}
