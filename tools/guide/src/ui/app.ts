import type { GuideFormat, GuidePost } from '../content/types';
import { FORMATS, formatMeta } from '../content/formats';
import { countByFormat, findPostById, postsForFormat } from '../content/index';
import { renderEnoFooter } from '../../../../shared/ui/footer';
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

function navigate(view: View): void {
    if (view.kind === 'home') {
        window.location.hash = '';
        return;
    }
    if (view.kind === 'format') {
        window.location.hash = `format/${view.format}`;
        return;
    }
    window.location.hash = view.id;
}

function renderDraftBadge(): string {
    return '<p class="egd-draft-badge">Entwurf · noch nicht öffentlich verlinkt</p>';
}

function renderBackLink(label: string, view: View): string {
    return `<button type="button" class="egd-back" data-view="${escapeHtml(view.kind === 'home' ? '' : view.kind === 'format' ? `format/${view.format}` : view.id)}">← ${escapeHtml(label)}</button>`;
}

function renderFormatBadge(format: GuideFormat): string {
    return `<span class="egd-format-badge egd-format-badge--${format}">${escapeHtml(formatMeta(format).label)}</span>`;
}

function renderPostCard(post: GuidePost): string {
    const src = headerSrc(post);
    return `
        <a class="egd-card" href="#${escapeHtml(post.id)}">
            <div class="egd-card-media">
                <img src="${escapeHtml(src)}" alt="" loading="lazy" decoding="async" onerror="this.src='${escapeHtml(`${BASE}headers/default.svg`)}'">
            </div>
            <div class="egd-card-body">
                ${renderFormatBadge(post.format)}
                <h2 class="egd-card-title">${escapeHtml(post.title)}</h2>
                ${post.lead ? `<p class="egd-card-lead">${escapeHtml(post.lead)}</p>` : ''}
                ${post.items ? `<p class="egd-card-meta">${post.items.length} Einträge</p>` : ''}
            </div>
        </a>
    `;
}

function renderHome(): string {
    const counts = countByFormat();
    return `
        <section class="eno-panel egd-intro">
            ${renderDraftBadge()}
            <h2>Deine TikTok-Formate — als Text</h2>
            <p class="egd-lead">
                Top-Listen, Rezepte, Gedanken und Tipps. Content pflegst du in
                <code>tools/guide/src/content/posts/</code> — Headbild in <code>public/headers/</code>.
            </p>
        </section>
        <section class="egd-format-grid" aria-label="Formate">
            ${FORMATS.map(
                (format) => `
                <a class="egd-format-tile egd-format-tile--${format.id}" href="#format/${format.id}">
                    <span class="egd-format-tile-count">${counts[format.id]}</span>
                    <h2 class="egd-format-tile-title">${escapeHtml(format.label)}</h2>
                    <p class="egd-format-tile-desc">${escapeHtml(format.description)}</p>
                </a>
            `,
            ).join('')}
        </section>
    `;
}

function renderFormatView(format: GuideFormat): string {
    const meta = formatMeta(format);
    const posts = postsForFormat(format);
    return `
        ${renderBackLink('Alle Formate', { kind: 'home' })}
        <section class="eno-panel egd-format-head">
            <h2>${escapeHtml(meta.label)}</h2>
            <p>${escapeHtml(meta.description)}</p>
            <p class="egd-count">${posts.length} Beiträge</p>
        </section>
        <section class="egd-card-grid">
            ${posts.map((post) => renderPostCard(post)).join('')}
        </section>
    `;
}

function renderListItems(post: GuidePost): string {
    if (!post.items?.length) {
        return '';
    }
    return `
        <section class="eno-panel egd-items">
            <h2 class="egd-items-title">${post.format === 'toplist' ? 'Die Liste' : 'Kurz zusammengefasst'}</h2>
            <ol class="egd-item-list">
                ${post.items
                    .map(
                        (item) => `
                    <li class="egd-item">
                        <div class="egd-item-head">
                            <h3 class="egd-item-name">${escapeHtml(item.name)}</h3>
                            ${item.used ? '<span class="egd-item-used">Nutze ich</span>' : ''}
                        </div>
                        ${item.type || item.category ? `<p class="egd-item-tags">${[item.type, item.category].filter((v): v is string => Boolean(v)).map(escapeHtml).join(' · ')}</p>` : ''}
                        <p class="egd-item-why"><strong>Warum gut?</strong> ${escapeHtml(item.why)}</p>
                        ${item.comment ? `<p class="egd-item-comment">${escapeHtml(item.comment)}</p>` : ''}
                    </li>
                `,
                    )
                    .join('')}
            </ol>
        </section>
    `;
}

function renderBodyParagraphs(paragraphs?: string[]): string {
    if (!paragraphs?.length) {
        return '';
    }
    return `<div class="egd-body">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

function renderRecipe(post: GuidePost): string {
    if (!post.ingredients?.length && !post.steps?.length) {
        return '';
    }
    return `
        <section class="eno-panel egd-recipe">
            ${post.ingredients?.length ? `<h2>Zutaten</h2><ul>${post.ingredients.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : ''}
            ${post.steps?.length ? `<h2>Zubereitung</h2><ol>${post.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : ''}
        </section>
    `;
}

function renderPostView(id: string): string {
    const post = findPostById(id);
    if (!post) {
        return renderHome();
    }
    const src = headerSrc(post);
    const parentFormat: View = { kind: 'format', format: post.format };
    return `
        ${renderBackLink(formatMeta(post.format).label, parentFormat)}
        <article class="egd-article">
            <header class="egd-hero">
                <img
                    class="egd-hero-img"
                    src="${escapeHtml(src)}"
                    alt=""
                    onerror="this.src='${escapeHtml(`${BASE}headers/default.svg`)}'">
                <div class="egd-hero-overlay">
                    ${renderFormatBadge(post.format)}
                    <h1 class="egd-hero-title">${escapeHtml(post.title)}</h1>
                    ${post.lead ? `<p class="egd-hero-lead">${escapeHtml(post.lead)}</p>` : ''}
                </div>
            </header>
            <div class="egd-article-body">
                ${renderBodyParagraphs(post.body)}
                ${renderListItems(post)}
                ${renderRecipe(post)}
                ${post.tiktokUrl ? `<p class="egd-tiktok"><a href="${escapeHtml(post.tiktokUrl)}" rel="noopener noreferrer" target="_blank">Zum TikTok-Video →</a></p>` : ''}
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
            <main class="eno-tool-shell">
                <div class="eno-tool-inner">
                    ${renderToolBrandHeader({ title: TOOL_TITLE })}
                    <div id="egd-main">${renderMain(view)}</div>
                    ${renderEnoFooter()}
                </div>
            </main>
        `;
        mountEnoSiteNav(root);
        bindEvents();
    }

    function bindEvents(): void {
        root.querySelectorAll('.egd-back').forEach((button) => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-view') ?? '';
                if (!target) {
                    navigate({ kind: 'home' });
                } else if (target.startsWith('format/')) {
                    navigate({ kind: 'format', format: target.slice(7) as GuideFormat });
                } else {
                    navigate({ kind: 'post', id: target });
                }
            });
        });
    }

    window.addEventListener('hashchange', () => {
        view = parseView();
        const main = root.querySelector('#egd-main');
        if (main) {
            main.innerHTML = renderMain(view);
            bindEvents();
        }
        document.title = view.kind === 'post' && findPostById(view.id)
            ? `${findPostById(view.id)!.title} | enoGuide`
            : 'enoGuide | eno.rocks';
    });

    paint();
}
