import type { GuideFormat, GuidePost } from '../content/types';
import { FORMATS, formatMeta } from '../content/formats';
import { countByFormat, findPostById, postsForFormat } from '../content/index';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';

const BASE = import.meta.env.BASE_URL;
const TOOL_TITLE = 'enoGuide';

type View =
    | { kind: 'home' }
    | { kind: 'format'; format: GuideFormat }
    | { kind: 'post'; id: string };

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function headerSrc(post: GuidePost): string {
    const path = post.headerImage ?? formatMeta(post.format).placeholderHeader;
    return `${BASE}${path}`;
}

function parseView(): View {
    const hash = window.location.hash.slice(1);
    if (!hash) {
        return { kind: 'home' };
    }
    if (hash.startsWith('format/')) {
        const format = hash.slice('format/'.length) as GuideFormat;
        if (FORMATS.some((entry) => entry.id === format)) {
            return { kind: 'format', format };
        }
    }
    if (findPostById(hash)) {
        return { kind: 'post', id: hash };
    }
    return { kind: 'home' };
}

function activeFormat(view: View): GuideFormat | null {
    if (view.kind === 'format') {
        return view.format;
    }
    if (view.kind === 'post') {
        return findPostById(view.id)?.format ?? null;
    }
    return null;
}

function renderFormatBadge(format: GuideFormat): string {
    return `<span class="egd-pill egd-pill--${format}">${escapeHtml(formatMeta(format).label)}</span>`;
}

function renderTabBar(view: View): string {
    const active = activeFormat(view);
    const isHome = view.kind === 'home';

    return `
        <nav class="egd-tabbar" aria-label="Hauptnavigation">
            <a class="egd-tab${isHome ? ' is-active' : ''}" href="#">
                <span class="egd-tab-icon" aria-hidden="true">⌂</span>
                <span class="egd-tab-label">Start</span>
            </a>
            ${FORMATS.map(
                (format) => `
                <a
                    class="egd-tab egd-tab--${format.id}${active === format.id ? ' is-active' : ''}"
                    href="#format/${format.id}"
                >
                    <span class="egd-tab-icon" aria-hidden="true">${formatIcon(format.id)}</span>
                    <span class="egd-tab-label">${escapeHtml(format.shortLabel)}</span>
                </a>
            `,
            ).join('')}
        </nav>
    `;
}

function formatIcon(format: GuideFormat): string {
    switch (format) {
        case 'toplist':
            return '★';
        case 'recipe':
            return '◆';
        case 'thoughts':
            return '◎';
        case 'tip':
            return '✦';
    }
}

function renderPostCard(post: GuidePost): string {
    const src = headerSrc(post);
    const preview = post.lead ?? post.items?.[0]?.text ?? post.body?.[0] ?? '';
    return `
        <a class="egd-card" href="#${escapeHtml(post.id)}">
            <div class="egd-card-media">
                <img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" onerror="this.src='${escapeHtml(`${BASE}headers/default.svg`)}'">
            </div>
            <div class="egd-card-body">
                ${renderFormatBadge(post.format)}
                <h2 class="egd-card-title">${escapeHtml(post.title)}</h2>
                <p class="egd-card-preview">${escapeHtml(preview)}</p>
                ${post.items ? `<p class="egd-card-meta">${post.items.length} Einträge</p>` : ''}
            </div>
            <span class="egd-card-chevron" aria-hidden="true">›</span>
        </a>
    `;
}

function renderHome(): string {
    const counts = countByFormat();
    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

    return `
        <section class="egd-hero-home">
            <p class="egd-hero-kicker">enoGuide</p>
            <h1 class="egd-hero-home-title">Wissen aus TikTok, ausführlich erklärt</h1>
            <p class="egd-hero-home-lead">
                Listen, Rezepte, Themen und Tipps von Einfach nur Olli. Jeder Punkt mit Kontext,
                damit du verstehst, warum etwas im Alltag funktioniert.
            </p>
            <p class="egd-hero-stat">${total} Beiträge</p>
        </section>
        <section class="egd-section" aria-label="Formate">
            <h2 class="egd-section-title">Kategorien</h2>
            <div class="egd-format-list">
                ${FORMATS.map(
                    (format) => `
                    <a class="egd-format-row egd-format-row--${format.id}" href="#format/${format.id}">
                        <span class="egd-format-row-icon" aria-hidden="true">${formatIcon(format.id)}</span>
                        <span class="egd-format-row-text">
                            <span class="egd-format-row-title">${escapeHtml(format.label)}</span>
                            <span class="egd-format-row-desc">${escapeHtml(format.description)}</span>
                        </span>
                        <span class="egd-format-row-meta">
                            <span class="egd-format-row-count">${counts[format.id]}</span>
                            <span class="egd-format-row-chevron" aria-hidden="true">›</span>
                        </span>
                    </a>
                `,
                ).join('')}
            </div>
        </section>
    `;
}

function renderFormatView(format: GuideFormat): string {
    const meta = formatMeta(format);
    const posts = postsForFormat(format);
    return `
        <section class="egd-format-hero egd-format-hero--${format}">
            <h1 class="egd-format-hero-title">${escapeHtml(meta.label)}</h1>
            <p class="egd-format-hero-desc">${escapeHtml(meta.description)}</p>
            <p class="egd-format-hero-count">${posts.length} Beiträge</p>
        </section>
        <section class="egd-card-stack">
            ${posts.map((post) => renderPostCard(post)).join('')}
        </section>
    `;
}

function renderListItems(post: GuidePost): string {
    if (!post.items?.length) {
        return '';
    }
    return `
        <section class="egd-entries">
            ${post.items
                .map(
                    (item, index) => `
                <article class="egd-entry">
                    <div class="egd-entry-rank" aria-hidden="true">${index + 1}</div>
                    <div class="egd-entry-content">
                        <div class="egd-entry-head">
                            <h2 class="egd-entry-name">${escapeHtml(item.name)}</h2>
                            ${item.category ? `<span class="egd-entry-cat">${escapeHtml(item.category)}</span>` : ''}
                        </div>
                        <p class="egd-entry-text">${escapeHtml(item.text)}</p>
                    </div>
                </article>
            `,
                )
                .join('')}
        </section>
    `;
}

function renderBodyParagraphs(paragraphs?: string[]): string {
    if (!paragraphs?.length) {
        return '';
    }
    return `<div class="egd-prose">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

function renderRecipe(post: GuidePost): string {
    if (!post.ingredients?.length && !post.steps?.length) {
        return '';
    }
    return `
        <section class="egd-recipe-blocks">
            ${post.ingredients?.length ? `
                <div class="egd-recipe-block">
                    <h2 class="egd-recipe-heading">Zutaten</h2>
                    <ul class="egd-recipe-list">${post.ingredients.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>
                </div>
            ` : ''}
            ${post.steps?.length ? `
                <div class="egd-recipe-block">
                    <h2 class="egd-recipe-heading">Zubereitung</h2>
                    <ol class="egd-recipe-steps">${post.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
                </div>
            ` : ''}
        </section>
    `;
}

function renderPostView(id: string): string {
    const post = findPostById(id);
    if (!post) {
        return renderHome();
    }
    const src = headerSrc(post);
    return `
        <article class="egd-article">
            <header class="egd-article-hero">
                <img
                    class="egd-article-hero-img"
                    src="${escapeHtml(src)}"
                    alt=""
                    onerror="this.src='${escapeHtml(`${BASE}headers/default.svg`)}'">
                <div class="egd-article-hero-overlay">
                    ${renderFormatBadge(post.format)}
                    <h1 class="egd-article-title">${escapeHtml(post.title)}</h1>
                </div>
            </header>
            <div class="egd-article-panel">
                ${post.lead ? `<p class="egd-article-lead">${escapeHtml(post.lead)}</p>` : ''}
                ${renderBodyParagraphs(post.body)}
                ${renderListItems(post)}
                ${renderRecipe(post)}
                ${post.tiktokUrl ? `<a class="egd-tiktok-link" href="${escapeHtml(post.tiktokUrl)}" rel="noopener noreferrer" target="_blank">Zum TikTok Video</a>` : ''}
            </div>
        </article>
    `;
}

function renderMain(view: View): string {
    switch (view.kind) {
        case 'home':
            return renderHome();
        case 'format':
            return renderFormatView(view.format);
        case 'post':
            return renderPostView(view.id);
    }
}

export function mountApp(root: HTMLElement): void {
    let view = parseView();

    function paint(): void {
        root.innerHTML = `
            <div class="egd-app">
                <header class="egd-app-header">
                    ${renderToolBrandHeader({ title: TOOL_TITLE })}
                </header>
                <main class="egd-app-main" id="egd-main">${renderMain(view)}</main>
                ${renderTabBar(view)}
            </div>
        `;
        mountEnoSiteNav(root);
    }

    function update(): void {
        view = parseView();
        const main = root.querySelector('#egd-main');
        const tabbar = root.querySelector('.egd-tabbar');
        if (main) {
            main.innerHTML = renderMain(view);
        }
        if (tabbar) {
            tabbar.outerHTML = renderTabBar(view);
        }
        document.title =
            view.kind === 'post' && findPostById(view.id)
                ? `${findPostById(view.id)!.title} | enoGuide`
                : 'enoGuide | eno.rocks';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.addEventListener('hashchange', update);
    paint();
}
