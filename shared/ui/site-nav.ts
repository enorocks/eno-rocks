export type BrandHeaderOptions = {
    /** Tool-Seite: Untertitel unter dem Wordmark */
    title?: string;
    /** h1 auf Hub, p auf Tool-Seiten */
    wordmarkTag?: "h1" | "p";
};

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function renderBrandHeader(options: BrandHeaderOptions = {}): string {
    const { title, wordmarkTag = "p" } = options;
    const tagline = title
        ? `<p class="eno-hub-tagline">» ${escapeHtml(title)}</p>`
        : "";

    return `
        <div class="eno-hub-brand eno-tool-brand">
            <div class="eno-brand-bar">
                <div class="eno-brand-bar__identity">
                    <${wordmarkTag} class="eno-hub-wordmark">
                        <a href="/">eno<span class="eno-hub-wordmark-dot">.</span>rocks</a>
                    </${wordmarkTag}>
                </div>
                <div data-eno-nav></div>
            </div>
            ${tagline}
        </div>`;
}

declare global {
    interface Window {
        EnoSiteNav?: {
            mount: (container: Element) => void;
            mountAll: (root?: ParentNode) => void;
        };
    }
}

/** Menü aus /shared/js/ einhängen — nach jedem DOM-Update aufrufen. */
export function mountEnoSiteNav(root: ParentNode = document): void {
    window.EnoSiteNav?.mountAll(root);
}
