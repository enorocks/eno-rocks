import { renderEnoFooter } from '../../../../shared/ui/footer';
import { renderToolBrandHeader } from '../../../../shared/ui/tool-header';
import { mountEnoSiteNav } from '../../../../shared/ui/site-nav';

const APP_URL = 'https://dailytogether.app';
const REGISTER_URL = 'https://dailytogether.app/register';
const SUPPORT_EMAIL = 'hello@dailytogether.de';
const LOGO_URL = '/tools/dailytogether/dt-logo.png';

const features = [
    {
        title: 'Gemeinsame Checkliste',
        text: 'Was steht heute an? Wer hat abgehakt? Täglich, an Wochentagen oder einmalig, mit Kategorien.',
    },
    {
        title: 'Bis zu 3 Listen',
        text: 'Pro Liste legt ihr fest, wer sie sieht. Kids, Haushalt oder nur für euch zwei.',
    },
    {
        title: 'Kalender & Fortschritt',
        text: 'Heute im Fokus, andere Tage per Pfeil oder Kalender. Fortschritt insgesamt und pro Person.',
    },
    {
        title: 'Chat für den Tag',
        text: 'Kurz etwas hinterlassen, zum Beispiel Milch mitbringen oder Termin um 15 Uhr. Kein Ersatz für Messenger.',
    },
    {
        title: 'Timer',
        text: 'Countdowns zu einem Datum wie Urlaub, Umzug oder Hochzeit. Bis zu zehn Timer pro Bereich.',
    },
    {
        title: '1 bis 5 Personen',
        text: 'Allein starten, zu zweit oder als kleiner Haushalt. Größe später in den Einstellungen änderbar.',
    },
];

const faqs = [
    {
        q: 'Bleibt das wirklich kostenlos?',
        a: 'Ja. Kein Abo, keine Paywall. DailyTogether soll helfen, nicht verdienen.',
    },
    {
        q: 'Gibt es eine App aus dem Store?',
        a: 'Aktuell nicht. Ihr könnt DailyTogether als PWA auf den Homescreen legen, unter Android am besten mit Chrome.',
    },
    {
        q: 'Wie viele Personen passen rein?',
        a: 'Allein, zu zweit oder bis zu fünf im Haushalt. Beim Einrichten wählt ihr den Umfang, später änderbar unter Space bearbeiten.',
    },
    {
        q: 'Was bedeutet drei Listen?',
        a: 'Ihr könnt bis zu drei Checklisten anlegen und festlegen, wer welche sieht. Nicht alles muss auf einer großen Liste hängen.',
    },
    {
        q: 'Für wen ist das gedacht?',
        a: 'Für alle, die den Alltag zu Hause übersichtlicher wollen, alleine, als Paar, Familie oder kleiner Haushalt, ohne Perfektionsdruck.',
    },
    {
        q: 'Was passiert mit unseren Daten?',
        a: 'Es wird nur das Nötige für Betrieb und euren Bereich gespeichert. Details in der <a class="dt-inline-link" href="/datenschutz/#dailytogether-app">Datenschutzerklärung</a>.',
    },
];

function renderPreview(): string {
    return `
                <section class="dt-showcase eno-panel" aria-label="App-Vorschau">
                    <p class="dt-showcase-kicker">So kann es aussehen</p>
                    <h2 class="dt-showcase-title">Checkliste, Chat und Timer</h2>
                    <div class="dt-showcase-grid">
                        <article class="dt-showcase-card dt-showcase-card--day">
                            <div class="dt-showcase-week" aria-hidden="true">
                                <span>MO</span><span class="is-done">DI</span><span class="is-done">MI</span><span class="is-today">DO</span><span>FR</span><span>SA</span><span>SO</span>
                            </div>
                            <div class="dt-showcase-progress">
                                <div class="dt-showcase-progress-head">
                                    <div>
                                        <span class="dt-showcase-label">Heute</span>
                                        <strong class="dt-showcase-day-title">Donnerstag</strong>
                                    </div>
                                    <span class="dt-showcase-pill">5/7</span>
                                </div>
                                <div class="dt-showcase-progress-track"><span style="width:71%"></span></div>
                                <div class="dt-showcase-member-bars">
                                    <div class="dt-showcase-member-bar">
                                        <div class="dt-showcase-member-bar-head"><span style="color:#e9a77d">Anna</span><strong>3/4</strong></div>
                                        <div class="dt-showcase-member-bar-track"><span style="width:75%;background:#e9a77d"></span></div>
                                    </div>
                                    <div class="dt-showcase-member-bar">
                                        <div class="dt-showcase-member-bar-head"><span style="color:#6fa99c">Ben</span><strong>2/3</strong></div>
                                        <div class="dt-showcase-member-bar-track"><span style="width:66%;background:#6fa99c"></span></div>
                                    </div>
                                </div>
                            </div>
                            <ul class="dt-showcase-checklist" aria-hidden="true">
                                <li class="is-done"><span>Müll rausbringen</span><b class="m-a is-checked"></b><b class="m-b"></b></li>
                                <li class="is-done"><span>Spaziergang</span><b class="m-a is-checked"></b><b class="m-b is-checked"></b></li>
                                <li><span>Medikamente</span><b class="m-a"></b><b class="m-b"></b></li>
                            </ul>
                        </article>

                        <article class="dt-showcase-card dt-showcase-card--chat">
                            <div class="dt-showcase-chat">
                                <div class="dt-showcase-chat-head">
                                    <span class="dt-showcase-label">Chat</span>
                                </div>
                                <div class="dt-showcase-chat-list">
                                    <div class="dt-showcase-chat-msg" style="--author:#e9a77d">
                                        <p class="dt-showcase-chat-meta"><strong>Anna</strong> <span>08:12</span></p>
                                        <p>Milch ist fast leer, ich bring welche mit.</p>
                                    </div>
                                    <div class="dt-showcase-chat-msg is-own" style="--author:#6fa99c">
                                        <p class="dt-showcase-chat-meta"><strong>Ben</strong> <span>08:19</span></p>
                                        <p>Super, danke. Termin um 15 Uhr nicht vergessen.</p>
                                    </div>
                                </div>
                                <div class="dt-showcase-chat-compose" aria-hidden="true">
                                    <span>Nachricht schreiben …</span>
                                    <b>OK</b>
                                </div>
                            </div>
                        </article>

                        <article class="dt-showcase-card dt-showcase-card--timers">
                            <div class="dt-showcase-timers">
                                <span class="dt-showcase-label">Aktive Timer</span>
                                <div class="dt-showcase-timer is-countdown">
                                    <span class="dt-showcase-timer-icon" aria-hidden="true">💍</span>
                                    <div>
                                        <strong>Hochzeit</strong>
                                        <p><span>in</span> <em>47 Tagen</em></p>
                                    </div>
                                </div>
                                <div class="dt-showcase-timer is-countdown">
                                    <span class="dt-showcase-timer-icon" aria-hidden="true">🏖</span>
                                    <div>
                                        <strong>Urlaub in Italien</strong>
                                        <p><span>in</span> <em>3 Wochen</em></p>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </section>`;
}

function renderFeatures(): string {
    return features
        .map(
            (item) => `
            <article class="dt-feature">
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            </article>`,
        )
        .join('');
}

function renderFaqs(): string {
    return faqs
        .map(
            (item) => `
            <details class="eno-faq-item">
                <summary>${item.q}</summary>
                <p>${item.a}</p>
            </details>`,
        )
        .join('');
}

export function mountApp(root: HTMLElement): void {
    root.innerHTML = `
        <header class="eno-tool-top">
            <div class="eno-tool-inner">
                ${renderToolBrandHeader({ title: 'DailyTogether' })}
            </div>
        </header>

        <main class="eno-tool-body">
            <div class="eno-tool-inner">
                <section class="eno-panel dt-hero-panel">
                    <div class="dt-hero-brand">
                        <img
                            class="dt-hero-logo"
                            src="${LOGO_URL}"
                            alt="DailyTogether – Weniger Chaos. Mehr WIR."
                            width="640"
                            height="120"
                            decoding="async">
                    </div>
                    <h1>Weniger Chaos. Mehr WIR.</h1>
                    <p class="eno-lead">
                        DailyTogether ist eine kostenlose Webseite/App für Paare, Familien und alle,
                        die ihren Alltag gemeinsam etwas entspannter meistern wollen.<br>
                        Kleine gemeinsame Routinen werden leichter, wenn man sie zusammen sehen und erledigen kann.
                    </p>
                    <div class="dt-hero-actions">
                        <a class="dt-btn dt-btn-primary" href="${APP_URL}">App öffnen</a>
                        <a class="dt-btn dt-btn-secondary" href="${REGISTER_URL}">Kostenlos starten</a>
                    </div>
                </section>
                ${renderPreview()}

                <section class="eno-panel">
                    <h2>Funktionen</h2>
                    <p class="dt-section-lead">
                        Das sind die Bausteine, die ihr wirklich nutzt.<br>
                        Alles in einem Bereich.
                    </p>
                    <div class="dt-feature-grid">${renderFeatures()}</div>
                    <p class="dt-note">
                        Außerdem Einladungen per Link oder QR, Rechte pro Person, hell/dunkel mit eigener Akzentfarbe.
                    </p>
                </section>

                <section class="eno-panel">
                    <h2>Häufige Fragen</h2>
                    <p class="dt-section-lead">
                        Kurz und ehrlich.<br>
                        Noch etwas offen?
                        <a class="dt-inline-link" href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
                    </p>
                    ${renderFaqs()}
                </section>

                <section class="eno-panel dt-cta-panel">
                    <h2>Bereit für weniger Chaos?</h2>
                    <p>DailyTogether ist und bleibt kostenlos, weil es helfen soll.</p>
                    <div class="dt-hero-actions">
                        <a class="dt-btn dt-btn-primary" href="${REGISTER_URL}">Jetzt kostenlos starten</a>
                        <a class="dt-btn dt-btn-secondary" href="${APP_URL}">Zur App</a>
                    </div>
                </section>

                ${renderEnoFooter()}
            </div>
        </main>
    `;

    mountEnoSiteNav(root);
}
