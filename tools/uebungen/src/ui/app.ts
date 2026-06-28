import {
    EQUIPMENT_OPTIONS,
    FULLBODY_LABEL,
    LEVEL_OPTIONS,
    MUSCLE_OPTIONS,
    WIZARD_MODE_FULLBODY,
    WIZARD_QUESTIONS,
    filterExercises,
    findExerciseById,
    isEquipment,
    isLevel,
    isMuscle,
    isWizardMode,
    labelForEquipment,
    labelForLevel,
    labelForMuscle,
    nextWizardStep,
    resolveFullBodyPlan,
    wizardStepCount,
    wizardStepIndex,
    type Equipment,
    type Exercise,
    type FilterKey,
    type Level,
    type MuscleId,
    type WizardMode,
} from '../data/exercises';
import { fullBodyPlanIds } from '../data/full-body-plans';
import { renderEnoFooter } from '../../../../shared/ui/footer';
import { pediaTermUrl } from '../../../../shared/ui/pedia-url';
import { toolUrl } from '../../../../shared/ui/tool-url';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';

const BASE = import.meta.env.BASE_URL;
const TOOL_TITLE = 'enoExercises';

type Selection = {
    mode?: WizardMode;
    muscle?: MuscleId;
    equipment?: Equipment;
    level?: Level;
};

type EditableFilter = FilterKey | null;

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function exerciseImageSrc(exercise: Exercise): string {
    if (exercise.image) {
        return `${BASE}exercises/${exercise.image}`;
    }
    return `${BASE}exercises/placeholder.svg`;
}

function renderChoiceButtons(
    filter: FilterKey,
    options: { id: string; label: string }[],
    activeId?: string,
): string {
    return `
        <div class="exo-choices" role="group" aria-label="${escapeHtml(filter)}">
            ${options
                .map(
                    (option) => `
                <button
                    type="button"
                    class="exo-choice-btn${activeId === option.id ? ' is-active' : ''}"
                    data-filter="${escapeHtml(filter)}"
                    data-value="${escapeHtml(option.id)}"
                >
                    ${escapeHtml(option.label)}
                </button>
            `,
                )
                .join('')}
        </div>
    `;
}

function optionsForFilter(filter: FilterKey): { id: string; label: string }[] {
    switch (filter) {
        case 'muscle':
            return MUSCLE_OPTIONS;
        case 'equipment':
            return EQUIPMENT_OPTIONS;
        case 'level':
            return LEVEL_OPTIONS;
    }
}

function activeIdForFilter(filter: FilterKey, selection: Selection): string | undefined {
    switch (filter) {
        case 'muscle':
            return selection.muscle;
        case 'equipment':
            return selection.equipment;
        case 'level':
            return selection.level;
    }
}

function renderMuscleStep(selection: Selection): string {
    return `
        <section class="eno-panel exo-wizard" aria-label="Auswahl Schritt 1">
            <p class="exo-wizard-step">Schritt 1 von 3</p>
            <h2 class="exo-question">${WIZARD_QUESTIONS.muscle}</h2>
            ${renderChoiceButtons('muscle', MUSCLE_OPTIONS, selection.muscle)}
            <div class="exo-wizard-divider" aria-hidden="true">
                <span>oder</span>
            </div>
            <button type="button" class="exo-fullbody-btn" id="exo-start-fullbody">
                <span class="exo-fullbody-btn-title">Ganzkörperplan anzeigen</span>
                <span class="exo-fullbody-btn-desc">Kompletter Plan für heute — alle Bereiche</span>
            </button>
        </section>
    `;
}

function renderWizardStep(step: FilterKey, selection: Selection): string {
    const stepNumber = wizardStepIndex(selection.mode, step);
    const totalSteps = wizardStepCount(selection.mode);
    const canGoBack = stepNumber > 1;

    return `
        <section class="eno-panel exo-wizard" aria-label="Auswahl Schritt ${stepNumber}">
            <p class="exo-wizard-step">Schritt ${stepNumber} von ${totalSteps}</p>
            <h2 class="exo-question">${WIZARD_QUESTIONS[step]}</h2>
            ${renderChoiceButtons(step, optionsForFilter(step), activeIdForFilter(step, selection))}
            ${canGoBack ? '<button type="button" class="exo-back-btn" id="exo-wizard-back">← Zurück</button>' : ''}
        </section>
    `;
}

function renderFilterBar(selection: Selection, editingFilter: EditableFilter): string {
    const isFullBody = selection.mode === WIZARD_MODE_FULLBODY;

    const chips: { filter: FilterKey | 'mode'; label: string; editable: boolean }[] = isFullBody
        ? [
              { filter: 'mode', label: FULLBODY_LABEL, editable: false },
              { filter: 'equipment', label: labelForEquipment(selection.equipment!), editable: true },
              { filter: 'level', label: labelForLevel(selection.level!), editable: true },
          ]
        : [
              { filter: 'muscle', label: labelForMuscle(selection.muscle!), editable: true },
              { filter: 'equipment', label: labelForEquipment(selection.equipment!), editable: true },
              { filter: 'level', label: labelForLevel(selection.level!), editable: true },
          ];

    return `
        <div class="exo-filter-bar" role="toolbar" aria-label="Auswahl anpassen">
            ${chips
                .map((chip) => {
                    if (!chip.editable) {
                        return `
                            <span class="exo-filter-chip exo-filter-chip--static">
                                ${escapeHtml(chip.label)}
                            </span>
                        `;
                    }
                    const filter = chip.filter as FilterKey;
                    return `
                <button
                    type="button"
                    class="exo-filter-chip${editingFilter === filter ? ' is-active' : ''}"
                    data-edit-filter="${escapeHtml(filter)}"
                    aria-expanded="${editingFilter === filter ? 'true' : 'false'}"
                >
                    ${escapeHtml(chip.label)}
                </button>
            `;
                })
                .join('')}
        </div>
    `;
}

function renderExerciseCard(exercise: Exercise, index: number): string {
    const src = exerciseImageSrc(exercise);
    return `
        <article class="exo-card" id="${escapeHtml(exercise.id)}">
            <div class="exo-card-media">
                <img
                    class="exo-card-image"
                    src="${escapeHtml(src)}"
                    alt="${escapeHtml(exercise.name)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.hidden=true;this.nextElementSibling.hidden=false">
                <div class="exo-card-image-fallback" hidden>
                    <span class="exo-card-image-label">${escapeHtml(exercise.name)}</span>
                    <span class="exo-card-image-hint">Bild folgt</span>
                </div>
            </div>
            <div class="exo-card-body">
                <div class="exo-card-head">
                    <span class="exo-card-step">${index + 1}</span>
                    <h2 class="exo-card-title">${escapeHtml(exercise.name)}</h2>
                    <a
                        class="exo-card-permalink"
                        href="#${escapeHtml(exercise.id)}"
                        aria-label="Direktlink zu ${escapeHtml(exercise.name)}"
                        title="Link kopieren"
                    >#</a>
                </div>
                <ul class="exo-cues">
                    ${exercise.cues.map((cue) => `<li>${escapeHtml(cue)}</li>`).join('')}
                </ul>
            </div>
        </article>
    `;
}

function renderPediaLinks(): string {
    return `
        <section class="eno-panel exo-pedia-links" aria-label="Weiter auf eno.rocks">
            <p>
                Mehr in enoPedia:
                <a class="eno-inline-link" href="${escapeHtml(pediaTermUrl('krafttraining'))}">Krafttraining</a>,
                <a class="eno-inline-link" href="${escapeHtml(pediaTermUrl('split'))}">Split</a>,
                <a class="eno-inline-link" href="${escapeHtml(pediaTermUrl('regeneration'))}">Regeneration</a>
            </p>
            <p class="exo-tool-links">
                Rechner:
                <a class="eno-inline-link" href="${escapeHtml(toolUrl('calories'))}">enoCalories</a>
                ·
                <a class="eno-inline-link" href="${escapeHtml(toolUrl('macros'))}">enoMacros</a>
            </p>
        </section>
    `;
}

function renderResults(selection: Selection, editingFilter: EditableFilter): string {
    const isFullBody = selection.mode === WIZARD_MODE_FULLBODY;
    const exercises = isFullBody
        ? resolveFullBodyPlan(selection.equipment!, selection.level!)
        : filterExercises(selection.muscle!, selection.equipment!, selection.level!);

    const planConfigured =
        !isFullBody || fullBodyPlanIds(selection.equipment!, selection.level!).length > 0;

    const inlinePicker =
        editingFilter !== null
            ? `
        <section class="eno-panel exo-inline-picker" aria-label="Auswahl ändern">
            <p class="exo-inline-picker-label">${escapeHtml(WIZARD_QUESTIONS[editingFilter].replace('<br>', ' '))}</p>
            ${renderChoiceButtons(
                editingFilter,
                optionsForFilter(editingFilter),
                activeIdForFilter(editingFilter, selection),
            )}
        </section>
    `
            : '';

    const metaLabel = isFullBody
        ? `${FULLBODY_LABEL} · ${labelForEquipment(selection.equipment!)} · ${labelForLevel(selection.level!)}`
        : `${labelForMuscle(selection.muscle!)} · ${labelForEquipment(selection.equipment!)} · ${labelForLevel(selection.level!)}`;

    let list = '';
    if (!planConfigured) {
        list = `
        <section class="eno-panel exo-empty">
            <p>Für diese Kombination gibt es noch keinen Ganzkörperplan.</p>
            <p class="exo-empty-hint">Plan folgt bald — wähle oben ein anderes Equipment oder Level.</p>
        </section>
    `;
    } else if (exercises.length > 0) {
        list = `
        <section class="exo-list" aria-label="${isFullBody ? 'Ganzkörperplan' : 'Übungen'}">
            ${exercises.map((exercise, index) => renderExerciseCard(exercise, index)).join('')}
        </section>
    `;
    } else {
        list = `
        <section class="eno-panel exo-empty">
            <p>Für diese Kombination gibt es noch keine Übungen.</p>
            <p class="exo-empty-hint">Wähle oben ein anderes Equipment oder Level.</p>
        </section>
    `;
    }

    return `
        <div class="exo-results">
            ${renderFilterBar(selection, editingFilter)}
            ${inlinePicker}
            <p class="exo-result-meta">
                ${exercises.length} ${exercises.length === 1 ? 'Übung' : 'Übungen'} ·
                ${escapeHtml(metaLabel)}
            </p>
            ${list}
        </div>
    `;
}

function renderShell(content: string): string {
    return `
        <header class="eno-tool-top">
            <div class="eno-tool-inner">
                ${renderToolBrandHeader({ title: TOOL_TITLE })}
            </div>
        </header>

        <main class="eno-tool-body">
            <div class="eno-tool-inner">
                <div id="exo-content">${content}</div>

                ${renderPediaLinks()}

                <section class="eno-panel eno-disclaimer">
                    <h2>Hinweis</h2>
                    <p>
                        Kein Ersatz für medizinische Beratung oder personalisiertes Coaching.
                        Bei Schmerzen, Verletzungen oder Unsicherheit lieber pausieren und Fachpersonal fragen.
                        Alle Inhalte werden lokal geladen — es werden keine Trainingsdaten gespeichert.
                    </p>
                </section>

                ${renderEnoFooter()}
            </div>
        </main>
    `;
}

function readSelectionFromUrl(): Selection {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const muscle = params.get('muscle');
    const equipment = params.get('eq');
    const level = params.get('level');

    const mode = isWizardMode(modeParam) ? modeParam : undefined;

    return {
        mode: mode === WIZARD_MODE_FULLBODY ? WIZARD_MODE_FULLBODY : undefined,
        muscle: mode === WIZARD_MODE_FULLBODY ? undefined : isMuscle(muscle) ? muscle : undefined,
        equipment: isEquipment(equipment) ? equipment : undefined,
        level: isLevel(level) ? level : undefined,
    };
}

function syncUrl(selection: Selection, hash?: string): void {
    const url = new URL(window.location.href);

    if (selection.mode === WIZARD_MODE_FULLBODY) {
        url.searchParams.set('mode', WIZARD_MODE_FULLBODY);
        url.searchParams.delete('muscle');
    } else {
        url.searchParams.delete('mode');
        if (selection.muscle) {
            url.searchParams.set('muscle', selection.muscle);
        } else {
            url.searchParams.delete('muscle');
        }
    }

    if (selection.equipment) {
        url.searchParams.set('eq', selection.equipment);
    } else {
        url.searchParams.delete('eq');
    }
    if (selection.level) {
        url.searchParams.set('level', selection.level);
    } else {
        url.searchParams.delete('level');
    }

    if (hash !== undefined) {
        url.hash = hash;
    } else {
        url.hash = '';
    }

    window.history.replaceState({}, '', url);
}

function exercisePermalink(exerciseId: string): string {
    return `${window.location.pathname}${window.location.search}#${exerciseId}`;
}

export function mountApp(root: HTMLElement): void {
    let pendingExerciseId: string | null = window.location.hash.slice(1) || null;
    let selection: Selection = readSelectionFromUrl();
    let editingFilter: EditableFilter = null;

    function bootstrapFromHash(): void {
        if (!pendingExerciseId) {
            return;
        }

        const exercise = findExerciseById(pendingExerciseId);
        if (!exercise) {
            return;
        }

        selection = {
            muscle: exercise.muscle,
            equipment: exercise.equipment,
            level: exercise.level,
        };
    }

    bootstrapFromHash();

    function applyFilter(filter: FilterKey, value: string): void {
        switch (filter) {
            case 'muscle':
                if (isMuscle(value)) {
                    selection = {
                        muscle: value,
                        equipment: selection.equipment,
                        level: selection.level,
                    };
                }
                break;
            case 'equipment':
                if (isEquipment(value)) {
                    selection = { ...selection, equipment: value };
                }
                break;
            case 'level':
                if (isLevel(value)) {
                    selection = { ...selection, level: value };
                }
                break;
        }
        editingFilter = null;
        syncUrl(selection);
    }

    function startFullBodyPlan(): void {
        selection = {
            mode: WIZARD_MODE_FULLBODY,
            equipment: selection.equipment,
            level: selection.level,
        };
        editingFilter = null;
        syncUrl(selection);
    }

    function goBack(): void {
        if (selection.mode === WIZARD_MODE_FULLBODY) {
            if (selection.level) {
                selection = { mode: WIZARD_MODE_FULLBODY, equipment: selection.equipment };
            } else if (selection.equipment) {
                selection = { mode: WIZARD_MODE_FULLBODY };
            } else {
                selection = {};
            }
        } else if (selection.level) {
            selection = { muscle: selection.muscle, equipment: selection.equipment };
        } else if (selection.equipment) {
            selection = { muscle: selection.muscle };
        } else if (selection.muscle) {
            selection = {};
        }
        editingFilter = null;
        syncUrl(selection);
    }

    function renderContent(): string {
        const step = nextWizardStep(
            selection.mode,
            selection.muscle,
            selection.equipment,
            selection.level,
        );

        if (step === 'muscle') {
            return renderMuscleStep(selection);
        }
        if (step) {
            return renderWizardStep(step, selection);
        }
        return renderResults(selection, editingFilter);
    }

    function scrollToExercise(exerciseId: string, highlight = true): boolean {
        const target = root.querySelector<HTMLElement>(`#${CSS.escape(exerciseId)}`);
        if (!target) {
            return false;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (highlight) {
            target.classList.add('is-highlighted');
            window.setTimeout(() => target.classList.remove('is-highlighted'), 1400);
        }
        return true;
    }

    function applyPendingExercise(): void {
        if (!pendingExerciseId) {
            return;
        }

        const exerciseId = pendingExerciseId;
        if (scrollToExercise(exerciseId)) {
            pendingExerciseId = null;
            syncUrl(selection, exerciseId);
        }
    }

    function render(): void {
        root.innerHTML = renderShell(renderContent());
        bindEvents();
        mountEnoSiteNav(root);
        if (pendingExerciseId) {
            requestAnimationFrame(() => applyPendingExercise());
        }
    }

    function bindEvents(): void {
        root.querySelector('#exo-start-fullbody')?.addEventListener('click', () => {
            startFullBodyPlan();
            render();
        });

        root.querySelector('#exo-wizard-back')?.addEventListener('click', () => {
            goBack();
            render();
        });

        root.querySelectorAll<HTMLButtonElement>('.exo-choice-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;
                const value = button.dataset.value;
                if (!filter || !value) {
                    return;
                }
                if (filter !== 'muscle' && filter !== 'equipment' && filter !== 'level') {
                    return;
                }
                applyFilter(filter, value);
                render();
                if (
                    nextWizardStep(
                        selection.mode,
                        selection.muscle,
                        selection.equipment,
                        selection.level,
                    ) === null
                ) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });

        root.querySelectorAll<HTMLButtonElement>('.exo-filter-chip').forEach((button) => {
            button.addEventListener('click', () => {
                const filter = button.dataset.editFilter;
                if (filter !== 'muscle' && filter !== 'equipment' && filter !== 'level') {
                    return;
                }
                editingFilter = editingFilter === filter ? null : filter;
                render();
            });
        });

        root.querySelectorAll<HTMLAnchorElement>('.exo-card-permalink').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const exerciseId = link.getAttribute('href')?.slice(1);
                if (!exerciseId) {
                    return;
                }

                scrollToExercise(exerciseId);
                syncUrl(selection, exerciseId);

                if (navigator.clipboard?.writeText) {
                    void navigator.clipboard.writeText(exercisePermalink(exerciseId));
                }
            });
        });

        window.addEventListener('hashchange', () => {
            const exerciseId = window.location.hash.slice(1);
            if (!exerciseId) {
                return;
            }

            const exercise = findExerciseById(exerciseId);
            if (!exercise) {
                return;
            }

            pendingExerciseId = exerciseId;
            selection = {
                muscle: exercise.muscle,
                equipment: exercise.equipment,
                level: exercise.level,
            };
            editingFilter = null;
            render();
        });
    }

    render();
}
