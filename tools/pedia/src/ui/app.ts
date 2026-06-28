import {
    FILTER_OPTIONS,
    TERMS,
    categoriesForFilter,
    labelForFilter,
    labelForCategory,
    type FilterId,
    type GlossaryTerm,
} from '../data/terms';
import { getToolLink } from '../data/term-links';
import { getRelatedTerms } from '../data/related-terms';
import { getPopularTermIds, recordTermView } from '../data/search-stats';
import { renderEnoFooter } from '../../../../shared/ui/footer';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';
import { toolUrl } from '../../../../shared/ui/tool-url';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function normalizeSearch(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .trim();
}

const PRIMARY_MATCH_MIN_SCORE = 65;
const VARIANT_MATCH_PENALTY = 3;

function searchQueryVariants(query: string): string[] {
    const variants = new Set<string>([query]);

    if (query.length < 3) {
        return [query];
    }

    if (query.endsWith('en')) {
        variants.add(query.slice(0, -1));
    }

    if (query.endsWith('n') && !query.endsWith('en')) {
        variants.add(query.slice(0, -1));
    }

    if (query.endsWith('e')) {
        variants.add(`${query}n`);
    }

    return [...variants];
}

function scoreTermForQuery(term: GlossaryTerm, query: string): number {
    const normalizedTitle = normalizeSearch(term.title);
    const normalizedAliases = term.aliases.map(normalizeSearch);
    const normalizedDescription = normalizeSearch(term.description);

    if (normalizedTitle === query) {
        return 100;
    }

    if (normalizedAliases.some((alias) => alias === query)) {
        return 95;
    }

    if (normalizedTitle.startsWith(query)) {
        return 90;
    }

    if (normalizedAliases.some((alias) => alias.startsWith(query))) {
        return 85;
    }

    if (normalizedTitle.includes(query)) {
        return 70;
    }

    if (normalizedAliases.some((alias) => alias.includes(query))) {
        return 65;
    }

    if (normalizedDescription.includes(query)) {
        return 20;
    }

    return 0;
}

function scoreTerm(term: GlossaryTerm, query: string, variants: string[]): number {
    let bestScore = 0;

    for (const variant of variants) {
        const score = scoreTermForQuery(term, variant);
        if (score === 0) {
            continue;
        }

        const adjustedScore = variant === query ? score : Math.max(score - VARIANT_MATCH_PENALTY, 1);
        bestScore = Math.max(bestScore, adjustedScore);
    }

    return bestScore;
}

type SearchResults =
    | { mode: 'browse'; terms: GlossaryTerm[] }
    | { mode: 'search'; primary: GlossaryTerm[]; secondary: GlossaryTerm[] };

function sortScoredTerms(
    a: { term: GlossaryTerm; score: number },
    b: { term: GlossaryTerm; score: number },
): number {
    return (
        b.score - a.score ||
        a.term.title.localeCompare(b.term.title, 'de', { sensitivity: 'base' })
    );
}

function searchTerms(query: string, filter: FilterId): SearchResults {
    const categories = categoriesForFilter(filter);
    const normalizedQuery = normalizeSearch(query);

    const categoryMatches = (term: GlossaryTerm) =>
        filter === 'all' || categories.includes(term.category);

    if (!normalizedQuery) {
        return {
            mode: 'browse',
            terms: TERMS.filter(categoryMatches).sort((a, b) =>
                a.title.localeCompare(b.title, 'de', { sensitivity: 'base' }),
            ),
        };
    }

    const variants = searchQueryVariants(normalizedQuery);
    const scored = TERMS.filter(categoryMatches)
        .map((term) => ({ term, score: scoreTerm(term, normalizedQuery, variants) }))
        .filter((entry) => entry.score > 0)
        .sort(sortScoredTerms);

    return {
        mode: 'search',
        primary: scored
            .filter((entry) => entry.score >= PRIMARY_MATCH_MIN_SCORE)
            .map((entry) => entry.term),
        secondary: scored
            .filter((entry) => entry.score < PRIMARY_MATCH_MIN_SCORE)
            .map((entry) => entry.term),
    };
}

function letterForTerm(term: GlossaryTerm): string {
    const firstCharacter = term.title
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .charAt(0)
        .toUpperCase();

    return /^[A-Z]$/.test(firstCharacter) ? firstCharacter : '0–9';
}

function letterSectionId(letter: string): string {
    return letter === '0–9' ? 'pedia-letter-numbers' : `pedia-letter-${letter.toLowerCase()}`;
}

function termPermalink(termId: string): string {
    return `${window.location.pathname}${window.location.search}#${termId}`;
}

function renderToolQuickLinks(): string {
    return `
        <section class="pedia-tool-links" aria-label="eno.rocks Tools">
            <p>
                Direkt weiter:
                <a class="pedia-tool-links-anchor" href="${escapeHtml(toolUrl('calories'))}">enoCalories</a>
                <span class="pedia-tool-links-sep" aria-hidden="true">·</span>
                <a class="pedia-tool-links-anchor" href="${escapeHtml(toolUrl('macros'))}">enoMacros</a>
                <span class="pedia-tool-links-sep" aria-hidden="true">·</span>
                <a class="pedia-tool-links-anchor" href="${escapeHtml(toolUrl('exercises'))}">enoExercises</a>
            </p>
        </section>
    `;
}

function renderPopularTerms(): string {
    const popularTerms = getPopularTermIds()
        .map((id) => TERMS.find((term) => term.id === id))
        .filter((term): term is GlossaryTerm => Boolean(term));

    return `
        <section class="pedia-popular" aria-labelledby="pedia-popular-title">
            <h2 id="pedia-popular-title">Häufig gesucht</h2>
            <div class="pedia-popular-list">
                ${popularTerms
                    .map(
                        (term) => `
                            <button type="button" class="pedia-popular-link" data-term-id="${escapeHtml(term.id)}">
                                ${escapeHtml(term.title)}
                            </button>
                        `,
                    )
                    .join('')}
            </div>
        </section>
    `;
}

function renderAlphabetJump(terms: GlossaryTerm[]): string {
    const availableLetters = new Set(terms.map(letterForTerm));
    const letters = [...ALPHABET, ...(availableLetters.has('0–9') ? ['0–9'] : [])];

    return `
        <nav class="pedia-alpha" aria-label="Nach Buchstabe springen">
            <div class="pedia-alpha-inner">
                ${letters
                    .map((letter) => {
                        if (!availableLetters.has(letter)) {
                            return `<span class="pedia-alpha-link is-disabled" aria-hidden="true">${letter}</span>`;
                        }
                        return `
                            <button
                                type="button"
                                class="pedia-alpha-link"
                                data-letter-section="${escapeHtml(letterSectionId(letter))}"
                            >
                                ${letter}
                            </button>
                        `;
                    })
                    .join('')}
            </div>
        </nav>
    `;
}

function renderTermSections(terms: GlossaryTerm[]): string {
    const groupedTerms = new Map<string, GlossaryTerm[]>();

    terms.forEach((term) => {
        const letter = letterForTerm(term);
        const group = groupedTerms.get(letter) ?? [];
        group.push(term);
        groupedTerms.set(letter, group);
    });

    const orderedLetters = [
        ...ALPHABET.filter((letter) => groupedTerms.has(letter)),
        ...(groupedTerms.has('0–9') ? ['0–9'] : []),
    ];

    return orderedLetters
        .map((letter) => {
            const termsForLetter = groupedTerms.get(letter) ?? [];
            const sectionId = letterSectionId(letter);

            return `
                <details class="pedia-letter-section" id="${sectionId}" open>
                    <summary class="pedia-letter-heading">
                        <h2 id="${sectionId}-title">${letter}</h2>
                        <span>${termsForLetter.length} ${termsForLetter.length === 1 ? 'Begriff' : 'Begriffe'}</span>
                    </summary>
                    <div class="pedia-list">${termsForLetter.map(renderTermCard).join('')}</div>
                </details>
            `;
        })
        .join('');
}

function renderFilterButtons(activeFilter: FilterId): string {
    return FILTER_OPTIONS.map((filter) => {
        const isActive = filter.id === activeFilter;
        return `
            <button
                type="button"
                class="pedia-chip${isActive ? ' is-active' : ''}"
                data-filter="${escapeHtml(filter.id)}"
                aria-pressed="${isActive ? 'true' : 'false'}"
            >
                ${escapeHtml(filter.label)}
            </button>
        `;
    }).join('');
}

function renderAliases(term: GlossaryTerm): string {
    if (term.aliases.length === 0) {
        return '';
    }

    return `
        <p class="pedia-aliases">
            auch: ${term.aliases.map((alias) => escapeHtml(alias)).join(', ')}
        </p>
    `;
}

function renderToolLink(term: GlossaryTerm): string {
    const toolLink = getToolLink(term);
    if (!toolLink) {
        return '';
    }

    return `
        <p class="pedia-tool-link">
            <a class="pedia-tool-link-anchor" href="${escapeHtml(toolLink.href)}">
                Weiter mit ${escapeHtml(toolLink.label)} →
            </a>
        </p>
    `;
}

function renderRelatedTerms(term: GlossaryTerm): string {
    const related = getRelatedTerms(term, TERMS);
    if (related.length === 0) {
        return '';
    }

    return `
        <div class="pedia-related">
            <p class="pedia-related-label">Verwandt</p>
            <div class="pedia-related-list">
                ${related
                    .map(
                        (relatedTerm) => `
                            <button
                                type="button"
                                class="pedia-related-link"
                                data-term-id="${escapeHtml(relatedTerm.id)}"
                            >
                                ${escapeHtml(relatedTerm.title)}
                            </button>
                        `,
                    )
                    .join('')}
            </div>
        </div>
    `;
}

function renderTermCard(term: GlossaryTerm): string {
    return `
        <article class="pedia-card" id="${escapeHtml(term.id)}">
            <div class="pedia-card-top">
                <div class="pedia-card-heading">
                    <p class="pedia-card-category">${escapeHtml(labelForCategory(term.category))}</p>
                    <h2>${escapeHtml(term.title)}</h2>
                </div>
                <a
                    class="pedia-card-permalink"
                    href="#${escapeHtml(term.id)}"
                    aria-label="Direktlink zu ${escapeHtml(term.title)}"
                    title="Link kopieren"
                >
                    #
                </a>
            </div>
            <p class="pedia-card-desc">${escapeHtml(term.description)}</p>
            ${renderToolLink(term)}
            ${renderRelatedTerms(term)}
            ${renderAliases(term)}
        </article>
    `;
}

function renderEmptyState(query: string, filter: FilterId): string {
    const filterText = filter === 'all' ? 'allen Bereichen' : labelForFilter(filter);
    const queryText = query ? ` für „${escapeHtml(query)}“` : '';

    return `
        <section class="eno-panel pedia-empty" aria-live="polite">
            <h2>Nichts gefunden</h2>
            <p>In ${escapeHtml(filterText)} gibt es aktuell keinen Treffer${queryText}.</p>
            <button type="button" class="pedia-reset" id="pedia-reset">Suche zurücksetzen</button>
        </section>
    `;
}

function renderSearchGroup(title: string, terms: GlossaryTerm[], headingId: string): string {
    if (terms.length === 0) {
        return '';
    }

    return `
        <section class="pedia-search-group" aria-labelledby="${headingId}">
            <h2 class="pedia-search-group-title" id="${headingId}">${escapeHtml(title)}</h2>
            <div class="pedia-list">${terms.map(renderTermCard).join('')}</div>
        </section>
    `;
}

function renderResults(query: string, filter: FilterId): string {
    const results = searchTerms(query, filter);
    const activeLabel = filter === 'all' ? 'alle Bereiche' : labelForFilter(filter);

    if (results.mode === 'browse') {
        return `
            <div class="pedia-result-head">
                <p>
                    <strong>${results.terms.length}</strong> von ${TERMS.length} Begriffen
                    <span>${escapeHtml(activeLabel)}</span>
                </p>
            </div>
            ${
                results.terms.length > 0
                    ? `
                        ${renderAlphabetJump(results.terms)}
                        <div class="pedia-sections">${renderTermSections(results.terms)}</div>
                    `
                    : renderEmptyState(query, filter)
            }
        `;
    }

    const total = results.primary.length + results.secondary.length;
    const primaryTitle = results.secondary.length > 0 ? 'Direkte Treffer' : 'Treffer';

    return `
        <div class="pedia-result-head">
            <p>
                <strong>${total}</strong> von ${TERMS.length} Begriffen
                <span>${escapeHtml(activeLabel)}</span>
            </p>
        </div>
        ${
            total > 0
                ? `
                    <div class="pedia-sections pedia-search-results">
                        ${renderSearchGroup(primaryTitle, results.primary, 'pedia-primary-title')}
                        ${renderSearchGroup('Weitere Hinweise', results.secondary, 'pedia-secondary-title')}
                    </div>
                `
                : renderEmptyState(query, filter)
        }
    `;
}

function renderShell(query: string, filter: FilterId): string {
    return `
        <header class="eno-tool-top">
            <div class="eno-tool-inner">
                ${renderToolBrandHeader({ title: 'enoPedia' })}
            </div>
        </header>

        <main class="eno-tool-body">
            <div class="eno-tool-inner">
                <div class="eno-tool-intro pedia-intro">
                    <h1>Fitness und Ernährung einfach erklärt.</h1>
                    <p class="eno-lead">
                        enoPedia ist ein Nachschlagewerk für Fitness und Ernährung.<br>
                        Begriffe, Grundlagen und häufige Fragen werden kurz und verständlich erklärt.
                    </p>
                </div>

                ${renderToolQuickLinks()}
                ${renderPopularTerms()}

                <section class="eno-panel pedia-search-panel" aria-label="enoPedia durchsuchen">
                    <label class="pedia-search" for="pedia-search">
                        <span>Begriff suchen</span>
                        <input
                            id="pedia-search"
                            type="search"
                            inputmode="search"
                            autocomplete="off"
                            placeholder="Suche z.B. nach Protein, Magnesium oder Kalorien"
                            value="${escapeHtml(query)}">
                    </label>
                    <div class="pedia-chips" role="group" aria-label="Bereich filtern">
                        ${renderFilterButtons(filter)}
                    </div>
                </section>

                <div id="pedia-results">
                    ${renderResults(query, filter)}
                </div>

                <section class="eno-panel eno-disclaimer pedia-disclaimer">
                    <h2>Hinweis</h2>
                    <p>
                        Die Inhalte in enoPedia dienen der allgemeinen Orientierung und ersetzen keine medizinische,
                        ernährungswissenschaftliche oder therapeutische Beratung. Suchanfragen und häufig angesehene
                        Begriffe werden lokal in deinem Browser verarbeitet. Es werden keine Suchdaten an einen Server übertragen.
                    </p>
                </section>

                ${renderEnoFooter()}
            </div>
        </main>
    `;
}

function isFilterId(value: string | null): value is FilterId {
    return FILTER_OPTIONS.some((option) => option.id === value);
}

function readInitialState(): { query: string; filter: FilterId } {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ?? '';
    const filterParam = params.get('cat') ?? params.get('filter');
    const legacyFilterMap: Record<string, FilterId> = {
        basics: 'nutrition',
        macros: 'nutrition',
        micros: 'nutrition',
        weight: 'nutrition',
        supplements: 'supplements',
        training: 'training',
        tracking: 'tracking',
        body: 'body',
        habits: 'habits',
    };
    const filter = isFilterId(filterParam)
        ? filterParam
        : filterParam && legacyFilterMap[filterParam]
          ? legacyFilterMap[filterParam]
          : 'all';

    return { query, filter };
}

function syncUrl(query: string, filter: FilterId, termId?: string | null): void {
    const url = new URL(window.location.href);

    if (termId) {
        url.hash = termId;
        url.searchParams.delete('q');
        url.searchParams.delete('cat');
        url.searchParams.delete('filter');
    } else {
        url.hash = '';

        if (query) {
            url.searchParams.set('q', query);
        } else {
            url.searchParams.delete('q');
        }

        if (filter !== 'all') {
            url.searchParams.set('cat', filter);
        } else {
            url.searchParams.delete('cat');
            url.searchParams.delete('filter');
        }
    }

    window.history.replaceState({}, '', url);
}

export function mountApp(root: HTMLElement): void {
    let { query, filter } = readInitialState();
    let pendingTermId: string | null = window.location.hash.slice(1) || null;

    function resetFiltersUi(): void {
        const input = root.querySelector<HTMLInputElement>('#pedia-search');
        if (input) {
            input.value = '';
        }
        root.querySelectorAll<HTMLButtonElement>('.pedia-chip').forEach((chip) => {
            const isAll = chip.dataset.filter === 'all';
            chip.classList.toggle('is-active', isAll);
            chip.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        });
    }

    function highlightTerm(target: HTMLElement): void {
        target.classList.add('is-highlighted');
        window.setTimeout(() => target.classList.remove('is-highlighted'), 1400);
    }

    function openLetterSection(sectionId: string): void {
        const section = root.querySelector(`#${CSS.escape(sectionId)}`);
        if (section instanceof HTMLDetailsElement) {
            section.open = true;
        }
    }

    function scrollToTerm(termId: string, highlight = true): boolean {
        const target = root.querySelector<HTMLElement>(`#${CSS.escape(termId)}`);
        if (!target) {
            return false;
        }

        const section = target.closest('details');
        if (section instanceof HTMLDetailsElement) {
            section.open = true;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (highlight) {
            highlightTerm(target);
            recordTermView(termId);
        }
        return true;
    }

    function navigateToTerm(termId: string): void {
        const term = TERMS.find((entry) => entry.id === termId);
        if (!term) {
            return;
        }

        pendingTermId = termId;
        query = '';
        filter = 'all';
        resetFiltersUi();
        updateResults();
    }

    function applyPendingTerm(): void {
        if (!pendingTermId) {
            return;
        }

        const termId = pendingTermId;
        const found = scrollToTerm(termId);
        if (found) {
            pendingTermId = null;
            syncUrl('', 'all', termId);
            return;
        }

        if (!TERMS.some((term) => term.id === termId)) {
            pendingTermId = null;
        }
    }

    function updateResults(): void {
        const resultsRoot = root.querySelector('#pedia-results');
        if (!resultsRoot) {
            return;
        }
        resultsRoot.innerHTML = renderResults(query, filter);
        bindResultEvents();

        if (pendingTermId) {
            requestAnimationFrame(() => applyPendingTerm());
        } else {
            syncUrl(query.trim(), filter);
        }
    }

    function bindResultEvents(): void {
        root.querySelector('#pedia-reset')?.addEventListener('click', () => {
            query = '';
            filter = 'all';
            pendingTermId = null;
            resetFiltersUi();
            updateResults();
        });

        root.querySelectorAll<HTMLButtonElement>('.pedia-alpha-link:not(.is-disabled)').forEach((button) => {
            button.addEventListener('click', () => {
                const sectionId = button.dataset.letterSection;
                if (!sectionId) {
                    return;
                }
                openLetterSection(sectionId);
                root.querySelector<HTMLElement>(`#${CSS.escape(sectionId)}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        });

        root.querySelectorAll<HTMLAnchorElement>('.pedia-card-permalink').forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const termId = link.getAttribute('href')?.slice(1);
                if (!termId) {
                    return;
                }

                recordTermView(termId);
                navigateToTerm(termId);

                if (navigator.clipboard?.writeText) {
                    void navigator.clipboard.writeText(termPermalink(termId));
                }
            });
        });

        root.querySelectorAll<HTMLButtonElement>('.pedia-related-link').forEach((button) => {
            button.addEventListener('click', () => {
                const termId = button.dataset.termId;
                if (termId) {
                    navigateToTerm(termId);
                }
            });
        });
    }

    function bindTermNavigationButtons(): void {
        root.querySelectorAll<HTMLButtonElement>('.pedia-popular-link').forEach((button) => {
            button.addEventListener('click', () => {
                const termId = button.dataset.termId;
                if (termId) {
                    navigateToTerm(termId);
                }
            });
        });
    }

    function bindEvents(): void {
        root.querySelector<HTMLInputElement>('#pedia-search')?.addEventListener('input', (event) => {
            query = (event.currentTarget as HTMLInputElement).value;
            pendingTermId = null;
            updateResults();
        });

        root.querySelectorAll<HTMLButtonElement>('.pedia-chip').forEach((button) => {
            button.addEventListener('click', () => {
                const nextFilter = button.dataset.filter;
                if (!nextFilter || !isFilterId(nextFilter)) {
                    return;
                }
                filter = nextFilter;
                pendingTermId = null;
                root.querySelectorAll<HTMLButtonElement>('.pedia-chip').forEach((chip) => {
                    const isActive = chip === button;
                    chip.classList.toggle('is-active', isActive);
                    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });
                updateResults();
            });
        });

        bindTermNavigationButtons();

        window.addEventListener('hashchange', () => {
            const termId = window.location.hash.slice(1);
            if (!termId) {
                return;
            }
            navigateToTerm(termId);
        });

        bindResultEvents();
    }

    root.innerHTML = renderShell(query, filter);
    bindEvents();
    mountEnoSiteNav(root);

    if (pendingTermId) {
        const termExists = TERMS.some((term) => term.id === pendingTermId);
        if (termExists && (query || filter !== 'all')) {
            query = '';
            filter = 'all';
            resetFiltersUi();
            updateResults();
        } else {
            requestAnimationFrame(() => applyPendingTerm());
        }
    }
}
