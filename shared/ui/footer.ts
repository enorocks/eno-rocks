const IMPRESSUM = '/impressum/';

const DATENSCHUTZ = '/datenschutz/';

const HUB_NAME = 'eno.rocks';

/** Ein Footer für Hub, Tools und Legal-Seiten auf eno.rocks */
export function renderEnoFooter(): string {
    const year = new Date().getFullYear();

    return `
            <footer class="eno-foot">
                <div class="eno-foot-inner">
                    <p class="eno-foot-line">
                        © ${year} ${HUB_NAME}
                        · <a href="${IMPRESSUM}">Impressum</a>
                        · <a href="${DATENSCHUTZ}">Datenschutz</a>
                    </p>
                </div>
            </footer>`;
}

/** @deprecated Alias – identisch zu renderEnoFooter() */
export function renderEnoHubFooterHtml(): string {
    return renderEnoFooter();
}
