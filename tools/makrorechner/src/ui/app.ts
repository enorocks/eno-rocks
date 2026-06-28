import { calculate, validateInput } from '../calculator/engine';
import type { Goal, MacroInput, MacroResult } from '../calculator/types';
import { readStorageJson, writeStorageJson } from '../../../../shared/ui/browser-storage';
import { pediaTermUrl } from '../../../../shared/ui/pedia-url';
import { toolUrl } from '../../../../shared/ui/tool-url';
import { renderEnoFooter } from '../../../../shared/ui/footer';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';

const FORM_STORAGE_KEY = 'eno-macros-form-v1';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatNum(value: number): string {
    return new Intl.NumberFormat('de-DE').format(value);
}

function pediaLink(termId: string, label: string): string {
    return `<a class="eno-inline-link" href="${escapeHtml(pediaTermUrl(termId))}">${escapeHtml(label)}</a>`;
}

function readForm(form: HTMLFormElement): Partial<MacroInput> {
    const data = new FormData(form);

    return {
        kcal: Number(data.get('kcal')),
        weightKg: Number(data.get('weightKg')),
        goal: data.get('goal') as Goal,
    };
}

function saveFormInput(input: MacroInput): void {
    writeStorageJson(FORM_STORAGE_KEY, input);
}

function loadStoredForm(): Partial<MacroInput> | null {
    return readStorageJson<MacroInput>(FORM_STORAGE_KEY);
}

function isGoal(value: string | null): value is Goal {
    return value === 'lose' || value === 'maintain' || value === 'gain';
}

function readQueryDefaults(): Partial<MacroInput> {
    const params = new URLSearchParams(window.location.search);
    const defaults: Partial<MacroInput> = {};

    const kcal = Number(params.get('kcal'));
    const weightKg = Number(params.get('weight'));
    const goal = params.get('goal') as Goal | null;

    if (kcal >= 1200 && kcal <= 6000) {
        defaults.kcal = kcal;
    }
    if (weightKg >= 35 && weightKg <= 250) {
        defaults.weightKg = weightKg;
    }
    if (isGoal(goal)) {
        defaults.goal = goal;
    }

    return defaults;
}

function renderMacroLine(label: string, grams: number, percent: number, modifier: string): string {
    return `
        <li class="eno-macro-line ${modifier}">
            <span class="eno-macro-line-label">${escapeHtml(label)}</span>
            <span class="eno-macro-line-value">circa ${formatNum(grams)} g</span>
            <span class="eno-macro-line-pct">entspricht ${percent}&nbsp;%</span>
        </li>
    `;
}

function renderResults(result: MacroResult): string {
    const { protein, fat, carbs, kcal } = result;

    return `
        <section class="eno-panel eno-results" id="results" aria-live="polite">
            <h2>Deine Ausgangsbasis</h2>
            <p class="eno-results-lead">
                Bei <strong>${formatNum(kcal)} kcal</strong> pro Tag ist das eine gute Orientierung für deinen Alltag.
            </p>
            <ul class="eno-macro-summary">
                ${renderMacroLine('Protein', protein.midG, protein.pctKcal, 'is-protein')}
                ${renderMacroLine('Fett', fat.midG, fat.pctKcal, 'is-fat')}
                ${renderMacroLine('Kohlenhydrate', carbs.midG, carbs.pctKcal, 'is-carbs')}
            </ul>
            <p class="eno-results-foot">Du musst nicht jeden Tag exakt treffen. Wichtiger sind Kalorien und genug Protein im Wochenschnitt. Protein rechnen wir pro kg deines Wunschgewichts, nicht nach dem Gewicht auf der Waage heute. Unklar bei einem Begriff? In enoPedia: ${pediaLink('protein', 'Protein')}, ${pediaLink('makronaehrstoffe', 'Makros')} und ${pediaLink('makroverteilung', 'Makroverteilung')}.</p>
        </section>
    `;
}

function renderErrors(errors: { field: string; message: string }[]): string {
    if (errors.length === 0) {
        return '';
    }

    return `
        <div class="eno-errors" role="alert">
            <p><strong>Bitte prüfen:</strong></p>
            <ul>${errors.map((error) => `<li>${escapeHtml(error.message)}</li>`).join('')}</ul>
        </div>
    `;
}

function runCalculation(
    form: HTMLFormElement,
    resultsRoot: HTMLElement,
    errorsRoot: HTMLElement,
    options: { scroll?: boolean } = {},
): boolean {
    const input = readForm(form);
    const errors = validateInput(input);
    errorsRoot.innerHTML = renderErrors(errors);

    if (errors.length > 0) {
        resultsRoot.innerHTML = '';
        return false;
    }

    const fullInput = input as MacroInput;
    const result = calculate(fullInput);
    saveFormInput(fullInput);
    resultsRoot.innerHTML = renderResults(result);

    if (options.scroll !== false) {
        resultsRoot.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return true;
}

export function mountApp(root: HTMLElement): void {
    const queryDefaults = readQueryDefaults();
    const storedDefaults = loadStoredForm() ?? {};
    const defaults = { ...storedDefaults, ...queryDefaults };
    const defaultKcal = defaults.kcal ?? '';
    const defaultWeight = defaults.weightKg ?? '';
    const goalLose = defaults.goal === 'lose' || !defaults.goal ? 'checked' : '';
    const goalMaintain = defaults.goal === 'maintain' ? 'checked' : '';
    const goalGain = defaults.goal === 'gain' ? 'checked' : '';
    const shouldAutoCalculate = Boolean(queryDefaults.kcal && queryDefaults.weightKg);

    root.innerHTML = `
        <header class="eno-tool-top">
            <div class="eno-tool-inner">
                ${renderToolBrandHeader({ title: 'enoMacros' })}
            </div>
        </header>

        <main class="eno-tool-body">
            <div class="eno-tool-inner">
            <div class="eno-tool-intro">
                <h1>Makros auf dein Kalorienziel</h1>
                <p class="eno-lead">
                    enoMacros ist ein Makrorechner für Protein, Fett und Kohlenhydrate.<br>
                    Wenn dein Kalorienziel feststeht, bekommst du eine einfache Aufteilung in Gramm.
                </p>
            </div>
            <form class="eno-form eno-panel" id="macro-form" novalidate>
                <label class="eno-field">
                    <span>Kalorienziel (kcal/Tag)</span>
                    <input type="number" name="kcal" min="1200" max="6000" step="50" inputmode="numeric" placeholder="z.B. 2.150" value="${defaultKcal}" required>
                </label>
                <p class="eno-field-hint">
                    Kennst du dein Ziel nicht?
                    <a class="eno-inline-link" href="${escapeHtml(toolUrl('calories'))}">In enoCalories ausrechnen</a>
                </p>

                <label class="eno-field">
                    <span>Wunschgewicht (kg)</span>
                    <input type="number" name="weightKg" min="35" max="250" step="0.1" inputmode="decimal" placeholder="z.B. 90" value="${defaultWeight}" required>
                </label>

                <fieldset class="eno-fieldset">
                    <legend>Dein Ziel</legend>
                    <div class="eno-segment" role="radiogroup" aria-label="Ziel">
                        <label class="eno-segment-item"><input type="radio" name="goal" value="lose" ${goalLose}> Abnehmen</label>
                        <label class="eno-segment-item"><input type="radio" name="goal" value="maintain" ${goalMaintain}> Halten</label>
                        <label class="eno-segment-item"><input type="radio" name="goal" value="gain" ${goalGain}> Zunehmen</label>
                    </div>
                </fieldset>

                <div id="form-errors"></div>
                <button class="eno-submit" type="submit">Berechnen</button>
            </form>

            <div id="results-root"></div>

            <section class="eno-panel eno-disclaimer">
                <h2>Hinweis</h2>
                <p>
                    Die Werte dienen der Orientierung und ersetzen keine medizinische oder ernährungswissenschaftliche Beratung.
                    Berechnungen laufen lokal in deinem Browser. Eingaben können lokal gespeichert werden.
                </p>
            </section>

            ${renderEnoFooter()}
            </div>
        </main>
    `;

    const form = root.querySelector<HTMLFormElement>('#macro-form')!;
    const resultsRoot = root.querySelector<HTMLElement>('#results-root')!;
    const errorsRoot = root.querySelector<HTMLElement>('#form-errors')!;

    form.addEventListener('input', () => {
        const input = readForm(form);
        const errors = validateInput(input);
        if (errors.length === 0) {
            saveFormInput(input as MacroInput);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        runCalculation(form, resultsRoot, errorsRoot);
    });

    if (shouldAutoCalculate) {
        runCalculation(form, resultsRoot, errorsRoot, { scroll: false });
    }

    mountEnoSiteNav(root);
}
