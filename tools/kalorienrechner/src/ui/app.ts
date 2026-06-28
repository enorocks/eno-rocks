import { calculate, validateInput } from '../calculator/engine';
import type {
    CalculatorInput,
    CalculatorResult,
    Goal,
    JobActivity,
    Sex,
    SportSessions,
    StepBand,
} from '../calculator/types';
import { readStorageJson, writeStorageJson } from '../../../../shared/ui/browser-storage';
import { pediaTermUrl } from '../../../../shared/ui/pedia-url';
import { toolUrl } from '../../../../shared/ui/tool-url';
import { renderEnoFooter } from '../../../../shared/ui/footer';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';

const FORM_STORAGE_KEY = 'eno-calories-form-v1';

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatKcal(value: number): string {
    return new Intl.NumberFormat('de-DE').format(value);
}

function pediaLink(termId: string, label: string): string {
    return `<a class="eno-inline-link" href="${escapeHtml(pediaTermUrl(termId))}">${escapeHtml(label)}</a>`;
}

function toolLink(href: string, label: string): string {
    return `<a class="eno-inline-link" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}

function readForm(form: HTMLFormElement): Partial<CalculatorInput> {
    const data = new FormData(form);
    const bodyFatKnown = data.get('bodyFatKnown') === 'on';

    return {
        age: Number(data.get('age')),
        sex: data.get('sex') as Sex,
        heightCm: Number(data.get('heightCm')),
        weightKg: Number(data.get('weightKg')),
        bodyFatKnown,
        bodyFatPercent: bodyFatKnown ? Number(data.get('bodyFatPercent')) : null,
        goal: data.get('goal') as Goal,
        job: data.get('job') as JobActivity,
        steps: data.get('steps') as StepBand,
        sport: data.get('sport') as SportSessions,
    };
}

function saveFormInput(input: CalculatorInput): void {
    writeStorageJson(FORM_STORAGE_KEY, input);
}

function loadStoredForm(): Partial<CalculatorInput> | null {
    return readStorageJson<CalculatorInput>(FORM_STORAGE_KEY);
}

function isSex(value: string | null): value is Sex {
    return value === 'male' || value === 'female';
}

function isGoal(value: string | null): value is Goal {
    return value === 'lose' || value === 'maintain' || value === 'gain';
}

function isJob(value: string | null): value is JobActivity {
    return value === 'sedentary' || value === 'mixed' || value === 'active';
}

function isSteps(value: string | null): value is StepBand {
    return (
        value === 'under2000' ||
        value === 'under4000' ||
        value === '4000-7000' ||
        value === '7000-10000' ||
        value === 'over10000'
    );
}

function isSport(value: string | null): value is SportSessions {
    return value === '0' || value === '1-2' || value === '3-4' || value === '5+';
}

function readQueryInput(): Partial<CalculatorInput> | null {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('age') && !params.has('weight')) {
        return null;
    }

    const input: Partial<CalculatorInput> = {};
    const age = Number(params.get('age'));
    const heightCm = Number(params.get('height'));
    const weightKg = Number(params.get('weight'));
    const sex = params.get('sex');
    const goal = params.get('goal');
    const job = params.get('job');
    const steps = params.get('steps');
    const sport = params.get('sport');
    const bodyFatKnown = params.get('bf') === '1';
    const bodyFatPercent = Number(params.get('bfp'));

    if (age >= 18 && age <= 100) {
        input.age = age;
    }
    if (isSex(sex)) {
        input.sex = sex;
    }
    if (heightCm >= 130 && heightCm <= 230) {
        input.heightCm = heightCm;
    }
    if (weightKg >= 35 && weightKg <= 250) {
        input.weightKg = weightKg;
    }
    if (isGoal(goal)) {
        input.goal = goal;
    }
    if (isJob(job)) {
        input.job = job;
    }
    if (isSteps(steps)) {
        input.steps = steps;
    }
    if (isSport(sport)) {
        input.sport = sport;
    }
    if (bodyFatKnown) {
        input.bodyFatKnown = true;
        if (bodyFatPercent >= 3 && bodyFatPercent <= 60) {
            input.bodyFatPercent = bodyFatPercent;
        }
    }

    return input;
}

function buildShareUrl(input: CalculatorInput): string {
    const params = new URLSearchParams({
        age: String(input.age),
        sex: input.sex,
        height: String(input.heightCm),
        weight: String(input.weightKg),
        goal: input.goal,
        job: input.job,
        steps: input.steps,
        sport: input.sport,
    });

    if (input.bodyFatKnown && input.bodyFatPercent !== null) {
        params.set('bf', '1');
        params.set('bfp', String(input.bodyFatPercent));
    }

    const url = new URL(window.location.href);
    url.search = params.toString();
    url.hash = '';
    return url.toString();
}

function syncShareUrl(input: CalculatorInput): void {
    const url = new URL(buildShareUrl(input));
    window.history.replaceState({}, '', url);
}

function macrosUrl(kcal: number, weightKg: number, goal: Goal): string {
    const params = new URLSearchParams({
        kcal: String(kcal),
        weight: String(weightKg),
        goal,
    });
    return `/tools/makrorechner/?${params.toString()}`;
}

function applyInputToForm(form: HTMLFormElement, input: Partial<CalculatorInput>): void {
    if (input.age !== undefined) {
        (form.elements.namedItem('age') as HTMLInputElement).value = String(input.age);
    }
    if (input.sex) {
        (form.elements.namedItem('sex') as HTMLSelectElement).value = input.sex;
    }
    if (input.heightCm !== undefined) {
        (form.elements.namedItem('heightCm') as HTMLInputElement).value = String(input.heightCm);
    }
    if (input.weightKg !== undefined) {
        (form.elements.namedItem('weightKg') as HTMLInputElement).value = String(input.weightKg);
    }
    if (input.goal) {
        const goalInput = form.querySelector<HTMLInputElement>(`input[name="goal"][value="${input.goal}"]`);
        if (goalInput) {
            goalInput.checked = true;
        }
    }
    if (input.job) {
        (form.elements.namedItem('job') as HTMLSelectElement).value = input.job;
    }
    if (input.steps) {
        (form.elements.namedItem('steps') as HTMLSelectElement).value = input.steps;
    }
    if (input.sport) {
        (form.elements.namedItem('sport') as HTMLSelectElement).value = input.sport;
    }
    if (input.bodyFatKnown) {
        const checkbox = form.querySelector<HTMLInputElement>('#bodyFatKnown');
        const field = form.querySelector<HTMLLabelElement>('#bodyFatField');
        if (checkbox) {
            checkbox.checked = true;
        }
        if (field) {
            field.hidden = false;
        }
        if (input.bodyFatPercent !== undefined && input.bodyFatPercent !== null) {
            (form.elements.namedItem('bodyFatPercent') as HTMLInputElement).value = String(input.bodyFatPercent);
        }
    }
}

function renderFormulaRows(result: CalculatorResult): string {
    return result.formulas
        .map(
            (formula) => `
        <tr>
            <th scope="row">${escapeHtml(formula.label)}</th>
            <td>${formatKcal(formula.bmr)} kcal</td>
            <td>${formatKcal(formula.tdee)} kcal</td>
        </tr>
        ${formula.note ? `<tr class="eno-formula-note"><td colspan="3">${escapeHtml(formula.note)}</td></tr>` : ''}
    `,
        )
        .join('');
}

function renderGoalCards(result: CalculatorResult, input: CalculatorInput): string {
    return result.goals
        .map(
            (goal) => `
        <div class="eno-goal-card">
            <p class="eno-goal-label">${escapeHtml(goal.label)}</p>
            <p class="eno-goal-kcal">${formatKcal(goal.kcal)} <span>kcal/Tag</span></p>
            <a class="eno-goal-macros-link" href="${escapeHtml(macrosUrl(goal.kcal, input.weightKg, input.goal))}">
                Makros zu diesem Ziel berechnen →
            </a>
        </div>
    `,
        )
        .join('');
}

function renderResults(result: CalculatorResult, input: CalculatorInput): string {
    return `
        <section class="eno-panel eno-results" id="results" aria-live="polite">
            <p class="eno-badge">Schätzung · kein Ersatz für ärztliche Beratung</p>
            <h2>Dein geschätzter Kalorienbedarf</h2>
            <p class="eno-results-lead">
                Basierend auf ${result.formulas.length} Formeln liegt dein Bedarf vermutlich zwischen
                <strong>${formatKcal(result.rangeMin)}</strong> und <strong>${formatKcal(result.rangeMax)} kcal</strong> pro Tag.
            </p>
            <div class="eno-results-hero">
                <p class="eno-results-kicker">Durchschnitt aller Formeln</p>
                <p class="eno-results-main">${formatKcal(result.averageTdee)} <span>kcal/Tag</span></p>
                <p class="eno-results-sub">±10 % Spanne · gerundet auf 50 kcal</p>
            </div>
            <p class="eno-results-pal">
                ${escapeHtml(result.palExplanation)}
                Mehr dazu in enoPedia: ${pediaLink('gesamtumsatz', 'Gesamtumsatz')} und ${pediaLink('energiebedarf', 'Energiebedarf')}.
            </p>

            <h3 class="eno-subtitle">Empfehlung für dein Ziel</h3>
            <div class="eno-goal-grid">${renderGoalCards(result, input)}</div>

            <p class="eno-results-actions">
                <button type="button" class="eno-share-btn" id="eno-share-result">Ergebnis-Link kopieren</button>
            </p>

            <div class="eno-hint-grid">
                <article class="eno-hint-card">
                    <h3>${pediaLink('protein', 'Protein')}</h3>
                    <p><strong>${result.proteinMinG}–${result.proteinMaxG} g/Tag</strong></p>
                    <p>${escapeHtml(result.proteinNote)} Verteilen in ${toolLink(toolUrl('macros'), 'enoMacros')}.</p>
                </article>
                <article class="eno-hint-card">
                    <h3>Alltagsbewegung</h3>
                    <p>7.000+ Schritte täglich sind ein guter Richtwert, aber nicht Pflicht. Wichtiger ist langfristige Konstanz. Mehr: ${pediaLink('schritte', 'Schritte')}.</p>
                </article>
                <article class="eno-hint-card">
                    <h3>Gewicht messen</h3>
                    <p>Tägliche Schwankungen sind normal (Wasser, Salz, Schlaf). Bewerte Fortschritt über <strong>2–4 Wochen</strong>, nicht über einzelne Tage.</p>
                </article>
                <article class="eno-hint-card">
                    <h3>${pediaLink('kaloriendefizit', 'Nachjustieren')}</h3>
                    <p>Wenn sich nach einigen Wochen nichts tut: Kalorien um ca. <strong>100–200 kcal</strong> anpassen, nicht radikal umstellen.</p>
                </article>
            </div>

            <details class="eno-details">
                <summary>Formeln im Detail anzeigen</summary>
                <div class="eno-details-body">
                    <table class="eno-formula-table">
                        <thead>
                            <tr>
                                <th scope="col">Formel</th>
                                <th scope="col">Grundumsatz</th>
                                <th scope="col">Bedarf (mit Aktivität)</th>
                            </tr>
                        </thead>
                        <tbody>${renderFormulaRows(result)}</tbody>
                    </table>
                </div>
            </details>
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
    options: { scroll?: boolean; syncUrl?: boolean } = {},
): boolean {
    const input = readForm(form);
    const errors = validateInput(input);
    errorsRoot.innerHTML = renderErrors(errors);

    if (errors.length > 0) {
        resultsRoot.innerHTML = '';
        return false;
    }

    const fullInput = input as CalculatorInput;
    const result = calculate(fullInput);
    saveFormInput(fullInput);
    resultsRoot.innerHTML = renderResults(result, fullInput);

    resultsRoot.querySelector('#eno-share-result')?.addEventListener('click', async () => {
        const shareUrl = buildShareUrl(fullInput);
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareUrl);
        }
    });

    if (options.syncUrl !== false) {
        syncShareUrl(fullInput);
    }

    if (options.scroll !== false) {
        resultsRoot.querySelector('#results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return true;
}

export function mountApp(root: HTMLElement): void {
    root.innerHTML = `
        <header class="eno-tool-top">
            <div class="eno-tool-inner">
                ${renderToolBrandHeader({ title: 'enoCalories' })}
            </div>
        </header>

        <main class="eno-tool-body">
            <div class="eno-tool-inner">
            <div class="eno-tool-intro">
                <h1>Wie viele Kalorien brauchst du?</h1>
                <p class="eno-lead">
                    enoCalories ist ein Kalorienrechner, der mehrere Berechnungsformeln miteinander vergleicht.<br>
                    So bekommst du einen besseren Ausgangspunkt für dein Kalorienziel als bei vielen einfachen Rechnern.
                </p>
            </div>
            <form class="eno-form eno-panel" id="calculator-form" novalidate>
                <fieldset class="eno-fieldset">
                    <legend>Über dich</legend>
                    <div class="eno-field-grid">
                        <label class="eno-field">
                            <span>Alter</span>
                            <input type="number" name="age" min="18" max="100" inputmode="numeric" placeholder="z.B. 32" required>
                        </label>
                        <label class="eno-field">
                            <span>Geschlecht</span>
                            <select name="sex" required>
                                <option value="male">Männlich</option>
                                <option value="female">Weiblich</option>
                            </select>
                        </label>
                        <label class="eno-field">
                            <span>Größe (cm)</span>
                            <input type="number" name="heightCm" min="130" max="230" inputmode="numeric" placeholder="z.B. 178" required>
                        </label>
                        <label class="eno-field">
                            <span>Gewicht (kg)</span>
                            <input type="number" name="weightKg" min="35" max="250" step="0.1" inputmode="decimal" placeholder="z.B. 82" required>
                        </label>
                    </div>
                    <label class="eno-check">
                        <input type="checkbox" name="bodyFatKnown" id="bodyFatKnown">
                        <span>Körperfettanteil bekannt</span>
                    </label>
                    <p class="eno-field-hint">Mehr dazu in enoPedia: ${pediaLink('koerperfettanteil', 'Körperfettanteil')}.</p>
                    <label class="eno-field eno-field-bf" id="bodyFatField" hidden>
                        <span>Körperfett (%)</span>
                        <input type="number" name="bodyFatPercent" min="3" max="60" step="0.1" inputmode="decimal" placeholder="z.B. 22">
                    </label>
                </fieldset>

                <fieldset class="eno-fieldset">
                    <legend>Dein Ziel</legend>
                    <div class="eno-segment" role="radiogroup" aria-label="Ziel">
                        <label class="eno-segment-item"><input type="radio" name="goal" value="lose" checked> Abnehmen</label>
                        <label class="eno-segment-item"><input type="radio" name="goal" value="maintain"> Halten</label>
                        <label class="eno-segment-item"><input type="radio" name="goal" value="gain"> Zunehmen</label>
                    </div>
                </fieldset>

                <fieldset class="eno-fieldset">
                    <legend>Alltag &amp; Aktivität</legend>
                    <label class="eno-field">
                        <span>Beruf / Alltag</span>
                        <select name="job" required>
                            <option value="sedentary">Überwiegend sitzend (Bürojob)</option>
                            <option value="mixed">Gemischt (mal sitzen, mal aktiv)</option>
                            <option value="active">Körperlich aktiv</option>
                        </select>
                    </label>
                    <label class="eno-field">
                        <span>Schritte pro Tag (Durchschnitt)</span>
                        <select name="steps" required>
                            <option value="under2000">Unter 2.000</option>
                            <option value="under4000">Unter 4.000</option>
                            <option value="4000-7000" selected>4.000–7.000</option>
                            <option value="7000-10000">7.000–10.000</option>
                            <option value="over10000">Über 10.000</option>
                        </select>
                    </label>
                    <label class="eno-field">
                        <span>Training pro Woche</span>
                        <select name="sport" required>
                            <option value="0">0×</option>
                            <option value="1-2" selected>1–2×</option>
                            <option value="3-4">3–4×</option>
                            <option value="5+">5× oder mehr</option>
                        </select>
                    </label>
                </fieldset>
                <p class="eno-field-hint">
                    Alltagsbewegung und Schritte erklärt enoPedia: ${pediaLink('neat', 'NEAT')} und ${pediaLink('schritte', 'Schritte')}.
                </p>

                <div id="form-errors"></div>
                <button class="eno-submit" type="submit">Berechnen</button>
            </form>

            <div id="results-root"></div>

            <section class="eno-panel eno-faq" aria-labelledby="faq-title">
                <h2 id="faq-title">Häufige Fragen</h2>
                <details class="eno-faq-item">
                    <summary>Warum zeigt der Rechner eine Spanne statt einer exakten Zahl?</summary>
                    <p>Jede Formel ist eine Schätzung. Aktivitätsfaktor, Schritte und Training sind nie exakt messbar. Eine Spanne ist ehrlicher als „1.847 kcal“.</p>
                </details>
                <details class="eno-faq-item">
                    <summary>Welche Formel ist die beste?</summary>
                    <p>Mifflin-St Jeor und Schofield sind gute Allround-Formeln. Mit Körperfettanteil werden Katch-McArdle und Cunningham zusätzlich einbezogen.</p>
                </details>
                <details class="eno-faq-item">
                    <summary>Warum schwankt mein Gewicht täglich?</summary>
                    <p>Wasser, Salz, Kohlenhydrate, Schlaf und Stress beeinflussen die Waage. Deshalb: Trend über Wochen, nicht Panik am Morgen.</p>
                </details>
                <details class="eno-faq-item">
                    <summary>Wann sollte ich Kalorien anpassen?</summary>
                    <p>Wenn du über 2–4 Wochen keinen Trend siehst, passe um ca. 100–200 kcal an, nicht alles auf einmal ändern. Mehr: ${pediaLink('plateau', 'Plateau')} und ${pediaLink('defizitgroesse', 'Defizitgröße')}.</p>
                </details>
            </section>

            <section class="eno-panel eno-disclaimer">
                <h2>Hinweis</h2>
                <p>
                    Die berechneten Werte dienen ausschließlich der Orientierung und stellen keine medizinische,
                    ernährungswissenschaftliche oder therapeutische Beratung dar.
                </p>
                <p>
                    Die Ergebnisse basieren auf allgemeinen Berechnungsformeln und können von deinem tatsächlichen
                    Kalorienbedarf abweichen. Für die Richtigkeit, Vollständigkeit oder Eignung der Ergebnisse für
                    individuelle Zwecke wird keine Gewähr übernommen.
                </p>
                <p>
                    Bei gesundheitlichen Beschwerden, Vorerkrankungen, Essstörungen, Schwangerschaft oder anderen
                    besonderen Umständen solltest du fachlichen Rat einholen.
                </p>
                <p>
                    Alle Berechnungen erfolgen lokal in deinem Browser. Eingaben können lokal gespeichert werden,
                    damit du sie beim nächsten Besuch nicht erneut eintippen musst. Es werden keine Daten an einen Server übertragen.
                </p>
            </section>

            ${renderEnoFooter()}
            </div>
        </main>
    `;

    const form = root.querySelector<HTMLFormElement>('#calculator-form')!;
    const resultsRoot = root.querySelector<HTMLElement>('#results-root')!;
    const errorsRoot = root.querySelector<HTMLElement>('#form-errors')!;
    const bodyFatKnown = root.querySelector<HTMLInputElement>('#bodyFatKnown')!;
    const bodyFatField = root.querySelector<HTMLLabelElement>('#bodyFatField')!;

    bodyFatKnown.addEventListener('change', () => {
        bodyFatField.hidden = !bodyFatKnown.checked;
    });

    form.addEventListener('input', () => {
        const input = readForm(form);
        const errors = validateInput(input);
        if (errors.length === 0) {
            saveFormInput(input as CalculatorInput);
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        runCalculation(form, resultsRoot, errorsRoot);
    });

    const initialInput = readQueryInput() ?? loadStoredForm();
    if (initialInput) {
        applyInputToForm(form, initialInput);
        bodyFatField.hidden = !bodyFatKnown.checked;
        if (readQueryInput()) {
            runCalculation(form, resultsRoot, errorsRoot, { scroll: false, syncUrl: false });
        }
    }

    mountEnoSiteNav(root);
}
